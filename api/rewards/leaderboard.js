/**
 * Rewards Leaderboard API
 * GET /api/rewards/leaderboard?epoch={24h|7d|30d|all}
 *
 * Returns the top 50 wallets ranked by compute credits used.
 */

import { buildLeaderboard } from '../../lib/rewardsMiddleware.js';
import { setCorsHeaders, handlePreflight, checkRateLimit } from '../../lib/apiUtils.js';
import { logError } from '../../lib/logger.js';

const VALID_EPOCHS = ['24h', '7d', '30d', 'all'];

export default async function handler(req, res) {
  // Handle CORS preflight
  if (handlePreflight(req, res)) return;

  // Set CORS headers with origin validation
  if (!setCorsHeaders(req, res)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting by IP
  const clientId = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const rateLimit = await checkRateLimit(clientId, 60, 60000);
  if (!rateLimit.allowed) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  try {
    const { epoch = '30d' } = req.query;

    if (!VALID_EPOCHS.includes(epoch)) {
      return res.status(400).json({
        error: 'Invalid epoch',
        validEpochs: VALID_EPOCHS,
      });
    }

    const leaderboard = await buildLeaderboard(epoch);

    // Add ENS resolution placeholder (would integrate with ENS API)
    const enrichedLeaderboard = leaderboard.map(entry => ({
      ...entry,
      // In production, resolve ENS names here
      ens: null,
    }));

    return res.status(200).json(enrichedLeaderboard);

  } catch (error) {
    logError('api/rewards/leaderboard', 'Leaderboard API error', { error });
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
}
