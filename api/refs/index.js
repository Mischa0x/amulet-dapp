/**
 * Referral API
 *
 * GET /api/refs?address=0x... - Get referral stats
 * GET /api/refs?address=0x...&action=list - Get list of referred wallets
 * POST /api/refs - Register a referral
 */

import { kv } from '@vercel/kv';
import { setCorsHeaders, handlePreflight, validateAddress, checkRateLimit } from '../../lib/apiUtils.js';
import { logError } from '../../lib/logger.js';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (handlePreflight(req, res)) return;

  // Set CORS headers with origin validation
  if (!setCorsHeaders(req, res)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  // GET - Fetch referral stats
  if (req.method === 'GET') {
    try {
      const { address: rawAddress } = req.query;

      if (!rawAddress) {
        return res.status(400).json({ error: 'Missing address parameter' });
      }

      // Validate address format
      const normalizedAddress = validateAddress(rawAddress);
      if (!normalizedAddress) {
        return res.status(400).json({ error: 'Invalid wallet address format' });
      }

      // Rate limiting
      const rateLimit = await checkRateLimit(normalizedAddress, 120, 60000);
      if (!rateLimit.allowed) {
        return res.status(429).json({ error: 'Too many requests' });
      }

      const { action } = req.query;

      // Return list of referred wallets
      if (action === 'list') {
        const listKey = `referrals:${normalizedAddress}:list`;
        const referredWallets = await kv.smembers(listKey) || [];

        // Get additional info for each referred wallet (when they joined, their activity)
        const walletsWithDetails = await Promise.all(
          referredWallets.map(async (wallet) => {
            const referredByKey = `referred_by:${wallet}`;
            const allTimeKey = `rewards:${wallet}:alltime`;
            const creditsKey = `credits:${wallet}`;

            const [allTimeData, creditsData] = await Promise.all([
              kv.get(allTimeKey),
              kv.get(creditsKey),
            ]);

            return {
              wallet,
              joinedAt: allTimeData?.firstSeen || null,
              lastActive: allTimeData?.lastSeen || null,
              totalCompute: allTimeData?.totalCompute || 0,
              queriesRun: allTimeData?.queriesRun || 0,
              creditsBalance: creditsData?.balance || 0,
            };
          })
        );

        // Sort by most recent first
        walletsWithDetails.sort((a, b) => (b.joinedAt || 0) - (a.joinedAt || 0));

        return res.status(200).json({
          address: normalizedAddress,
          totalReferred: referredWallets.length,
          referredWallets: walletsWithDetails,
        });
      }

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
      logError('api/refs', 'Referral stats error', { error });
      return res.status(500).json({ error: 'Failed to fetch referral stats' });
    }
  }

  // POST - Register a referral
  if (req.method === 'POST') {
    try {
      const { referrer: rawReferrer, referee: rawReferee } = req.body;

      if (!rawReferrer || !rawReferee) {
        return res.status(400).json({ error: 'Missing referrer or referee address' });
      }

      // Validate both addresses
      const normalizedReferrer = validateAddress(rawReferrer);
      const normalizedReferee = validateAddress(rawReferee);

      if (!normalizedReferrer || !normalizedReferee) {
        return res.status(400).json({ error: 'Invalid wallet address format' });
      }

      // Rate limiting for POST (stricter - 20 per minute)
      const rateLimit = await checkRateLimit(normalizedReferee, 20, 60000);
      if (!rateLimit.allowed) {
        return res.status(429).json({ error: 'Too many requests' });
      }

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
      logError('api/refs', 'Referral registration error', { error });
      return res.status(500).json({ error: 'Failed to register referral' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
