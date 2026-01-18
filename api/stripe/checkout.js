// POST /api/stripe/checkout - Create Stripe checkout session for credit purchases
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Credit packages (matching frontend TokenPage.jsx)
const PACKAGES = {
  mortal: {
    credits: 100,
    price: 500, // $5.00 in cents
    name: 'Mortal Pack',
    description: '100 Compute Credits',
  },
  awakened: {
    credits: 500,
    price: 2250, // $22.50 (10% discount)
    name: 'Awakened Pack',
    description: '500 Compute Credits (10% off)',
  },
  transcendent: {
    credits: 2000,
    price: 8000, // $80.00 (20% discount)
    name: 'Transcendent Pack',
    description: '2,000 Compute Credits (20% off)',
  },
  immortal: {
    credits: 10000,
    price: 35000, // $350.00 (30% discount)
    name: 'Immortal Pack',
    description: '10,000 Compute Credits (30% off)',
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  const { packageId, address } = req.body;

  if (!packageId || !address) {
    return res.status(400).json({ error: 'Package ID and wallet address required' });
  }

  const pkg = PACKAGES[packageId];
  if (!pkg) {
    return res.status(400).json({ error: 'Invalid package ID' });
  }

  const normalizedAddress = address.toLowerCase();

  try {
    // Determine the app URL from environment or request headers
    const appUrl = process.env.VITE_APP_URL
      || process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`
      || (req.headers.origin)
      || (req.headers.referer && new URL(req.headers.referer).origin)
      || 'https://amulet-dapp.vercel.app';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: pkg.name,
              description: pkg.description,
            },
            unit_amount: pkg.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/token?success=true&credits=${pkg.credits}`,
      cancel_url: `${appUrl}/token?canceled=true`,
      metadata: {
        walletAddress: normalizedAddress,
        packageId,
        credits: pkg.credits.toString(),
      },
    });

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
