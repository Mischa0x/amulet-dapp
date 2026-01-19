/**
 * Personal Rewards Stats API
 * GET /api/rewards/personal?epoch={24h|7d|30d|all}&wallet={address}
 *
 * Returns personal stats for a connected wallet including rank, compute used,
 * queries, active days, streak, and percentile.
 */

import { getPersonalStats } from '../../lib/rewardsMiddleware.js';
import { setCorsHeaders, handlePreflight, validateAddress, checkRateLimit } from '../../lib/apiUtils.js';
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

  try {
    const { epoch = '30d', wallet: rawWallet } = req.query;

    if (!rawWallet) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    // Validate address format
    const wallet = validateAddress(rawWallet);
    if (!wallet) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }

    // Rate limiting
    const rateLimit = await checkRateLimit(wallet, 120, 60000);
    if (!rateLimit.allowed) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    if (!VALID_EPOCHS.includes(epoch)) {
      return res.status(400).json({
        error: 'Invalid epoch',
        validEpochs: VALID_EPOCHS,
      });
    }

    const stats = await getPersonalStats(epoch, wallet);

    return res.status(200).json(stats);

  } catch (error) {
    logError('api/rewards/personal', 'Personal stats API error', { error });
    return res.status(500).json({ error: 'Failed to fetch personal stats' });
  }
}
