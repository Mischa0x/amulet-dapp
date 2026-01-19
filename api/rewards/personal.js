/**
 * Personal Rewards Stats API
 * GET /api/rewards/personal?epoch={24h|7d|30d|all}&wallet={address}
 *
 * Returns personal stats for a connected wallet including rank, compute used,
 * queries, active days, streak, and percentile.
 */

import { getPersonalStats } from '../../lib/rewardsMiddleware.js';

const VALID_EPOCHS = ['24h', '7d', '30d', 'all'];

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
    const { epoch = '30d', wallet } = req.query;

    if (!wallet) {
      return res.status(400).json({ error: 'Wallet address required' });
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
    console.error('Personal stats API error:', error);
    return res.status(500).json({ error: 'Failed to fetch personal stats' });
  }
}
