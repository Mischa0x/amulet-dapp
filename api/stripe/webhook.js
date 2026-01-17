// POST /api/stripe/webhook - Handle Stripe payment webhooks
import Stripe from 'stripe';
import { kv } from '@vercel/kv';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const walletAddress = session.metadata?.walletAddress;
    const credits = parseInt(session.metadata?.credits, 10);
    const packageId = session.metadata?.packageId;

    if (!walletAddress || !credits) {
      console.error('Missing metadata in checkout session');
      return res.status(400).json({ error: 'Missing metadata' });
    }

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

      console.log(`Credits added: ${credits} to ${walletAddress}`);

    } catch (error) {
      console.error('Error processing payment:', error);
      return res.status(500).json({ error: 'Failed to process payment' });
    }
  }

  return res.status(200).json({ received: true });
}
