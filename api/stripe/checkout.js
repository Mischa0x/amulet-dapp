// POST /api/stripe/checkout - Create Stripe checkout session for credit purchases
import Stripe from 'stripe';
import { setCorsHeaders, handlePreflight, validateAddress, checkRateLimit } from '../../lib/apiUtils.js';
import { logError } from '../../lib/logger.js';

// Initialize Stripe lazily to ensure env vars are loaded
let stripe = null;
function getStripe() {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
      timeout: 30000,
      maxNetworkRetries: 2,
    });
  }
  return stripe;
}

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
  // Handle CORS preflight
  if (handlePreflight(req, res)) return;

  // Set CORS headers with origin validation
  if (!setCorsHeaders(req, res)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  const { packageId, address: rawAddress } = req.body;

  if (!packageId || !rawAddress) {
    return res.status(400).json({ error: 'Package ID and wallet address required' });
  }

  // Validate address format
  const normalizedAddress = validateAddress(rawAddress);
  if (!normalizedAddress) {
    return res.status(400).json({ error: 'Invalid wallet address format' });
  }

  // Rate limiting for checkout (10 per minute to prevent abuse)
  const rateLimit = await checkRateLimit(normalizedAddress, 10, 60000);
  if (!rateLimit.allowed) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  const pkg = PACKAGES[packageId];
  if (!pkg) {
    return res.status(400).json({ error: 'Invalid package ID' });
  }

  try {
    // Determine the app URL from environment or request headers
    const appUrl = process.env.VITE_APP_URL
      || process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`
      || (req.headers.origin)
      || (req.headers.referer && new URL(req.headers.referer).origin)
      || 'https://amulet-dapp.vercel.app';

    const session = await getStripe().checkout.sessions.create({
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
    logError('api/stripe/checkout', 'Stripe checkout error', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
    });
    return res.status(500).json({
      error: 'Failed to create checkout session',
      details: error.message,
      type: error.type,
      code: error.code,
    });
  }
}
