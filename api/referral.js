/**
 * Referral API
 *
 * GET /api/referral?address=0x... - Get referral stats
 * POST /api/referral - Register a referral
 */

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - Fetch referral stats
  if (req.method === 'GET') {
    try {
      const { address } = req.query;

      if (!address) {
        return res.status(400).json({ error: 'Missing address parameter' });
      }

      const normalizedAddress = address.toLowerCase();

      const countKey = `referrals:${normalizedAddress}:count`;
      const referralCount = await kv.get(countKey) || 0;

      const pointsKey = `referrals:${normalizedAddress}:points`;
      const referralPoints = await kv.get(pointsKey) || 0;

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

  // POST - Register a referral
  if (req.method === 'POST') {
    try {
      const { referrer, referee } = req.body;

      if (!referrer || !referee) {
        return res.status(400).json({ error: 'Missing referrer or referee address' });
      }

      const normalizedReferrer = referrer.toLowerCase();
      const normalizedReferee = referee.toLowerCase();

      if (normalizedReferrer === normalizedReferee) {
        return res.status(400).json({ error: 'Cannot refer yourself' });
      }

      const referredByKey = `referred_by:${normalizedReferee}`;
      const existingReferrer = await kv.get(referredByKey);

      if (existingReferrer) {
        return res.status(400).json({
          error: 'Already referred',
          referredBy: existingReferrer
        });
      }

      await kv.set(referredByKey, normalizedReferrer);

      const referrerCountKey = `referrals:${normalizedReferrer}:count`;
      const newCount = await kv.incr(referrerCountKey);

      const referrerListKey = `referrals:${normalizedReferrer}:list`;
      await kv.sadd(referrerListKey, normalizedReferee);

      const referrerPointsKey = `referrals:${normalizedReferrer}:points`;
      await kv.incr(referrerPointsKey);

      const refereePointsKey = `referrals:${normalizedReferee}:points`;
      await kv.incr(refereePointsKey);

      const epochs = ['24h', '7d', '30d', 'all'];
      for (const epoch of epochs) {
        await kv.del(`rewards:leaderboard:${epoch}`);
      }

      return res.status(200).json({
        success: true,
        referrer: normalizedReferrer,
        referee: normalizedReferee,
        referrerTotalReferrals: newCount,
      });

    } catch (error) {
      console.error('Referral registration error:', error);
      return res.status(500).json({ error: 'Failed to register referral' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
