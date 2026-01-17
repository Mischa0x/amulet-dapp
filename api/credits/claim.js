// POST /api/credits/claim - Claim 40 free credits (once per 30 days)
import { kv } from '@vercel/kv';

const FREE_CREDITS = 40;
const CLAIM_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

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

  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Wallet address required' });
  }

  const normalizedAddress = address.toLowerCase();

  try {
    // Get current credit data
    const creditData = await kv.get(`credits:${normalizedAddress}`) || {
      balance: 0,
      freeClaimedAt: null,
      stakedCredits: 0,
      purchasedCredits: 0,
      totalUsed: 0,
    };

    // Check if already claimed within cooldown period
    if (creditData.freeClaimedAt) {
      const timeSinceClaim = Date.now() - creditData.freeClaimedAt;
      if (timeSinceClaim < CLAIM_COOLDOWN_MS) {
        const nextClaimAt = creditData.freeClaimedAt + CLAIM_COOLDOWN_MS;
        return res.status(429).json({
          error: 'Free credits already claimed',
          nextClaimAt,
          daysRemaining: Math.ceil((nextClaimAt - Date.now()) / (24 * 60 * 60 * 1000)),
        });
      }
    }

    // Grant free credits
    const newBalance = creditData.balance + FREE_CREDITS;

    await kv.set(`credits:${normalizedAddress}`, {
      ...creditData,
      balance: newBalance,
      freeClaimedAt: Date.now(),
    });

    // Log the transaction
    await kv.lpush(`transactions:${normalizedAddress}`, {
      type: 'free_claim',
      amount: FREE_CREDITS,
      timestamp: Date.now(),
    });

    return res.status(200).json({
      success: true,
      creditsClaimed: FREE_CREDITS,
      newBalance,
      nextClaimAt: Date.now() + CLAIM_COOLDOWN_MS,
    });

  } catch (error) {
    console.error('Credits claim error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
