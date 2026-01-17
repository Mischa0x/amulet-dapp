// POST /api/credits/use - Deduct credits after query
import { kv } from '@vercel/kv';

// Query pricing tiers
const QUERY_COSTS = {
  basic: 1,      // Simple questions
  standard: 3,   // Standard analysis
  deep: 25,      // Deep research queries
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

  const { address, queryType = 'basic' } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Wallet address required' });
  }

  const cost = QUERY_COSTS[queryType] || QUERY_COSTS.basic;
  const normalizedAddress = address.toLowerCase();

  try {
    // Get current credit balance
    const creditData = await kv.get(`credits:${normalizedAddress}`);

    if (!creditData || creditData.balance < cost) {
      return res.status(402).json({
        error: 'Insufficient credits',
        required: cost,
        balance: creditData?.balance || 0,
      });
    }

    // Deduct credits
    const newBalance = creditData.balance - cost;
    const newTotalUsed = (creditData.totalUsed || 0) + cost;

    await kv.set(`credits:${normalizedAddress}`, {
      ...creditData,
      balance: newBalance,
      totalUsed: newTotalUsed,
      lastUsedAt: Date.now(),
    });

    // Log the transaction
    await kv.lpush(`transactions:${normalizedAddress}`, {
      type: 'use',
      amount: -cost,
      queryType,
      timestamp: Date.now(),
    });

    return res.status(200).json({
      success: true,
      deducted: cost,
      newBalance,
      totalUsed: newTotalUsed,
    });

  } catch (error) {
    console.error('Credits use error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
