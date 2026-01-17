# Stripe Integration

## Overview

Stripe powers credit purchases in the Amulet AI platform. Users can buy credit packages with credit/debit cards, and credits are automatically added to their wallet balance upon successful payment.

## Credit Packages

| Package | Credits | Price | Rate |
|---------|---------|-------|------|
| Starter | 100 | $5 | $0.05/credit |
| Builder | 500 | $25 | $0.05/credit |
| Pro | 2,000 | $100 | $0.05/credit |
| Enterprise | 10,000 | $500 | $0.05/credit |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│                    TokenPage.jsx                             │
│                  "Buy Now" buttons                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              POST /api/stripe/checkout                       │
│         Creates Stripe Checkout Session                      │
│         Returns checkout URL → redirect user                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Stripe Checkout                            │
│              (hosted payment page)                           │
│         User enters card → payment processed                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│             POST /api/stripe/webhook                         │
│         Receives checkout.session.completed                  │
│         Credits wallet in Vercel KV                          │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

### POST `/api/stripe/checkout`

Creates a Stripe Checkout session for credit purchase.

**Request:**
```json
{
  "packageId": "builder",
  "address": "0x..."
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_..."
}
```

**Error Response:**
```json
{
  "error": "Invalid package selected"
}
```

### POST `/api/stripe/webhook`

Handles Stripe webhook events. Automatically credits the user's wallet upon successful payment.

**Handled Events:**
- `checkout.session.completed` - Payment successful, add credits

**Metadata Flow:**
The checkout session includes metadata that the webhook uses to credit the correct wallet:

```javascript
// In checkout.js
const session = await stripe.checkout.sessions.create({
  metadata: {
    walletAddress: address,
    packageId: packageId,
    credits: package.credits.toString()
  }
  // ...
});

// In webhook.js
const { walletAddress, credits } = session.metadata;
// Add credits to Vercel KV
```

## Implementation

### `/api/stripe/checkout.js`

```javascript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PACKAGES = {
  starter: { credits: 100, price: 500 },      // $5.00 in cents
  builder: { credits: 500, price: 2500 },     // $25.00
  pro: { credits: 2000, price: 10000 },       // $100.00
  enterprise: { credits: 10000, price: 50000 } // $500.00
};

export default async function handler(req, res) {
  const { packageId, address } = req.body;
  const pkg = PACKAGES[packageId];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: `${pkg.credits} Compute Credits` },
        unit_amount: pkg.price,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.VITE_APP_URL}/token?success=true`,
    cancel_url: `${process.env.VITE_APP_URL}/token?canceled=true`,
    metadata: {
      walletAddress: address,
      packageId,
      credits: pkg.credits.toString()
    }
  });

  res.json({ url: session.url });
}
```

### `/api/stripe/webhook.js`

```javascript
import Stripe from 'stripe';
import { kv } from '@vercel/kv';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { walletAddress, credits } = session.metadata;

    // Add credits to wallet
    const key = `credits:${walletAddress.toLowerCase()}`;
    const current = await kv.get(key) || { balance: 0 };

    await kv.set(key, {
      ...current,
      balance: current.balance + parseInt(credits),
      purchasedCredits: (current.purchasedCredits || 0) + parseInt(credits)
    });
  }

  res.json({ received: true });
}
```

## Frontend Integration

### TokenPage Purchase Flow

```jsx
// src/pages/Token/TokenPage.jsx
const handlePurchase = async (packageId) => {
  setPurchaseLoading(packageId);
  try {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageId, address }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // Redirect to Stripe
    }
  } finally {
    setPurchaseLoading(null);
  }
};
```

### Success/Cancel Handling

```jsx
// Read URL params after Stripe redirect
const [searchParams] = useSearchParams();
const paymentSuccess = searchParams.get('success') === 'true';
const paymentCanceled = searchParams.get('canceled') === 'true';

// Show banners
{paymentSuccess && <div className={styles.successBanner}>Payment successful!</div>}
{paymentCanceled && <div className={styles.cancelBanner}>Payment was canceled.</div>}
```

## Environment Variables

```env
# Stripe Keys (add to Vercel)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App URL for redirects
VITE_APP_URL=https://amulet-dapp.vercel.app
```

## Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://amulet-dapp.vercel.app/api/stripe/webhook`
3. Select event: `checkout.session.completed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Testing

### Test Mode
All current integration uses Stripe test mode. Use test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

### Local Development
```bash
# Install Stripe CLI
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Trigger test events
stripe trigger checkout.session.completed
```

## Files

| File | Purpose |
|------|---------|
| `api/stripe/checkout.js` | Create checkout session |
| `api/stripe/webhook.js` | Handle payment events |
| `src/pages/Token/TokenPage.jsx` | Purchase UI |

## Security Notes

- Never expose `STRIPE_SECRET_KEY` to frontend
- Webhook signature verification prevents spoofing
- Credit amounts come from server-side metadata, not client
- Wallet addresses are normalized (lowercased) for consistency
