/**
 * Rewards Leaderboard API
 * GET /api/rewards/leaderboard?epoch={24h|7d|30d|all}
 *
 * Returns the top 50 wallets ranked by compute credits used.
 */

import { buildLeaderboard } from './middleware.js';

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
    console.error('Leaderboard API error:', error);
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
}
