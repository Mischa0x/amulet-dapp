/**
 * Referral Stats API
 * GET /api/referrals/stats?address=0x...
 *
 * Returns referral statistics for a wallet:
 * - referralCount: number of people referred
 * - referralPoints: total points from referrals
 * - referredBy: address that referred this wallet (if any)
 */

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ error: 'Missing address parameter' });
    }

    const normalizedAddress = address.toLowerCase();

    // Get referral count
    const countKey = `referrals:${normalizedAddress}:count`;
    const referralCount = await kv.get(countKey) || 0;

    // Get referral points (includes +1 for being referred + referrals made)
    const pointsKey = `referrals:${normalizedAddress}:points`;
    const referralPoints = await kv.get(pointsKey) || 0;

    // Check if this wallet was referred by someone
    const referredByKey = `referred_by:${normalizedAddress}`;
    const referredBy = await kv.get(referredByKey) || null;

    return res.status(200).json({
      address: normalizedAddress,
      referralCount,
      referralPoints,
      referredBy,
    });

  } catch (error) {
    console.error('Referral stats error:', error);
    return res.status(500).json({ error: 'Failed to fetch referral stats' });
  }
}

