// GET /api/credits - Get user's credit balance
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Wallet address required' });
  }

  const normalizedAddress = address.toLowerCase();

  try {
    // Get credit balance from KV store
    const creditData = await kv.get(`credits:${normalizedAddress}`);

    if (!creditData) {
      // New user - no credits yet
      return res.status(200).json({
        address: normalizedAddress,
        balance: 0,
        freeClaimedAt: null,
        stakedCredits: 0,
        purchasedCredits: 0,
        totalUsed: 0,
      });
    }

    // Ensure balance is never negative (fix for legacy data)
    const balance = Math.max(0, creditData.balance || 0);

    return res.status(200).json({
      address: normalizedAddress,
      ...creditData,
      balance, // Override with clamped value
    });

  } catch (error) {
    console.error('Credits API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
