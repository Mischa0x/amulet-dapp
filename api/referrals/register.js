/**
 * Referral Registration API
 * POST /api/referrals/register
 *
 * Registers a referral relationship and awards points:
 * - Referrer: +1 point
 * - Referee: +1 point
 *
 * Body: { referrer: "0x...", referee: "0x..." }
 */

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { referrer, referee } = req.body;

    // Validate addresses
    if (!referrer || !referee) {
      return res.status(400).json({ error: 'Missing referrer or referee address' });
    }

    const normalizedReferrer = referrer.toLowerCase();
    const normalizedReferee = referee.toLowerCase();

    // Can't refer yourself
    if (normalizedReferrer === normalizedReferee) {
      return res.status(400).json({ error: 'Cannot refer yourself' });
    }

    // Check if referee was already referred
    const referredByKey = `referred_by:${normalizedReferee}`;
    const existingReferrer = await kv.get(referredByKey);

    if (existingReferrer) {
      return res.status(400).json({
        error: 'Already referred',
        referredBy: existingReferrer
      });
    }

    // Record the referral relationship
    await kv.set(referredByKey, normalizedReferrer);

    // Increment referrer's referral count
    const referrerCountKey = `referrals:${normalizedReferrer}:count`;
    const newCount = await kv.incr(referrerCountKey);

    // Add referee to referrer's list
    const referrerListKey = `referrals:${normalizedReferrer}:list`;
    await kv.sadd(referrerListKey, normalizedReferee);

    // Award points to both parties
    // Referrer gets +1
    const referrerPointsKey = `referrals:${normalizedReferrer}:points`;
    await kv.incr(referrerPointsKey);

    // Referee gets +1
    const refereePointsKey = `referrals:${normalizedReferee}:points`;
    await kv.incr(refereePointsKey);

    // Invalidate leaderboard caches
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
