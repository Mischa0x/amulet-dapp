/**
 * Rewards API - Combined endpoint
 * GET /api/rewards?action=leaderboard&epoch={24h|7d|30d|all}
 * GET /api/rewards?action=personal&epoch={epoch}&wallet={address}
 * GET /api/rewards?action=social-proof&epoch={epoch}
 */

import { buildLeaderboard, getPersonalStats, getGlobalStats } from '../../lib/rewardsMiddleware.js';
import { setCorsHeaders, handlePreflight, validateAddress, checkRateLimit } from '../../lib/apiUtils.js';
import { logError } from '../../lib/logger.js';

const VALID_EPOCHS = ['24h', '7d', '30d', 'all'];

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  if (!setCorsHeaders(req, res)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientId = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const rateLimit = await checkRateLimit(clientId, 60, 60000);
  if (!rateLimit.allowed) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  try {
    const { action, epoch = '30d', wallet: rawWallet } = req.query;

    if (!VALID_EPOCHS.includes(epoch)) {
      return res.status(400).json({ error: 'Invalid epoch', validEpochs: VALID_EPOCHS });
    }

    switch (action) {
      case 'leaderboard': {
        const leaderboard = await buildLeaderboard(epoch);
        const enrichedLeaderboard = leaderboard.map(entry => ({ ...entry, ens: null }));
        return res.status(200).json(enrichedLeaderboard);
      }

      case 'personal': {
        if (!rawWallet) {
          return res.status(400).json({ error: 'Wallet address required' });
        }
        const wallet = validateAddress(rawWallet);
        if (!wallet) {
          return res.status(400).json({ error: 'Invalid wallet address format' });
        }
        const stats = await getPersonalStats(epoch, wallet);
        return res.status(200).json(stats);
      }

      case 'social-proof': {
        const stats = await getGlobalStats(epoch);
        return res.status(200).json(stats);
      }

      default:
        return res.status(400).json({
          error: 'Invalid action. Use ?action=leaderboard, ?action=personal, or ?action=social-proof'
        });
    }
  } catch (error) {
    logError('api/rewards', 'Rewards API error', { error });
    return res.status(500).json({ error: 'Failed to fetch rewards data' });
  }
}
