// POST /api/stripe/webhook - Handle Stripe payment webhooks
import Stripe from 'stripe';
import { kv } from '@vercel/kv';
import { validateAddress } from '../../lib/apiUtils.js';
import { logError, logWarn } from '../../lib/logger.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Valid packages with expected credits - must match TokenPage.jsx
const VALID_PACKAGES = {
  mortal: { credits: 100, priceInCents: 500 },
  awakened: { credits: 500, priceInCents: 2250 },
  transcendent: { credits: 2000, priceInCents: 8000 },
  immortal: { credits: 10000, priceInCents: 35000 },
};

// Disable body parsing to get raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!webhookSecret) {
    console.error('Stripe webhook secret not configured');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    logWarn('api/stripe/webhook', 'Webhook signature verification failed', { error: err.message });
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const rawWalletAddress = session.metadata?.walletAddress;
    const metadataCredits = parseInt(session.metadata?.credits, 10);
    const packageId = session.metadata?.packageId;

    if (!rawWalletAddress || !metadataCredits || !packageId) {
      logWarn('api/stripe/webhook', 'Missing metadata in checkout session', { sessionId: session.id });
      return res.status(400).json({ error: 'Missing metadata' });
    }

    // Validate wallet address format
    const walletAddress = validateAddress(rawWalletAddress);
    if (!walletAddress) {
      logWarn('api/stripe/webhook', 'Invalid wallet address format', { rawAddress: rawWalletAddress });
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    // SECURITY: Verify package exists and credits match expected values
    const expectedPackage = VALID_PACKAGES[packageId];
    if (!expectedPackage) {
      logWarn('api/stripe/webhook', 'Invalid package ID', { packageId });
      return res.status(400).json({ error: 'Invalid package' });
    }

    if (metadataCredits !== expectedPackage.credits) {
      logWarn('api/stripe/webhook', 'Credits mismatch', {
        packageId,
        expected: expectedPackage.credits,
        received: metadataCredits,
      });
      return res.status(400).json({ error: 'Credits mismatch' });
    }

    // Use the validated credits from our server-side config, not from metadata
    const credits = expectedPackage.credits;

    try {
      // Get current credit data
      const creditData = await kv.get(`credits:${walletAddress}`) || {
        balance: 0,
        freeClaimedAt: null,
        stakedCredits: 0,
        purchasedCredits: 0,
        totalUsed: 0,
      };

      // Add purchased credits
      const newBalance = creditData.balance + credits;
      const newPurchasedCredits = (creditData.purchasedCredits || 0) + credits;

      await kv.set(`credits:${walletAddress}`, {
        ...creditData,
        balance: newBalance,
        purchasedCredits: newPurchasedCredits,
        lastPurchaseAt: Date.now(),
      });

      // Log the transaction
      await kv.lpush(`transactions:${walletAddress}`, {
        type: 'purchase',
        amount: credits,
        packageId,
        stripeSessionId: session.id,
        amountPaid: session.amount_total,
        timestamp: Date.now(),
      });

      // Success - credits added (no log in production)

    } catch (error) {
      logError('api/stripe/webhook', 'Error processing payment', { error, walletAddress, credits });
      return res.status(500).json({ error: 'Failed to process payment' });
    }
  }

  return res.status(200).json({ received: true });
}
