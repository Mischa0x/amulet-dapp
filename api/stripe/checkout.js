// POST /api/stripe/checkout - Create Stripe checkout session for credit purchases
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Credit packages
const PACKAGES = {
  starter: {
    credits: 100,
    price: 500, // $5.00 in cents
    name: 'Starter Pack',
    description: '100 Compute Credits',
  },
  builder: {
    credits: 500,
    price: 2500, // $25.00
    name: 'Builder Pack',
    description: '500 Compute Credits',
  },
  pro: {
    credits: 2000,
    price: 10000, // $100.00
    name: 'Pro Pack',
    description: '2,000 Compute Credits',
  },
  enterprise: {
    credits: 10000,
    price: 50000, // $500.00
    name: 'Enterprise Pack',
    description: '10,000 Compute Credits',
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
      success_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/token?success=true&credits=${pkg.credits}`,
      cancel_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/token?canceled=true`,
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
