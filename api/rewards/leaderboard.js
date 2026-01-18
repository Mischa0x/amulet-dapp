// GET /api/rewards/leaderboard - Get top 50 wallets by compute usage
import { kv } from '@vercel/kv';

// Epoch time ranges in milliseconds
const EPOCH_RANGES = {
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
  'all': Infinity
};

// Simple ENS-like names for demo (in production, resolve via ENS)
const KNOWN_ENS = {
  '0xd8da6bf26964af9d7eed9e03e53415d37aa96045': 'vitalik.eth',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Cache for 5 minutes to reduce KV load
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { epoch = '30d' } = req.query;

  if (!EPOCH_RANGES[epoch]) {
    return res.status(400).json({ error: 'Invalid epoch. Use: 24h, 7d, 30d, or all' });
  }

  try {
    const now = Date.now();
    const epochStart = epoch === 'all' ? 0 : now - EPOCH_RANGES[epoch];

    // Scan all credit keys
    const walletStats = [];
    let cursor = 0;

    do {
      const [nextCursor, keys] = await kv.scan(cursor, {
        match: 'credits:0x*',
        count: 100
      });
      cursor = nextCursor;

      // Filter out history keys, only get main credit keys
      const creditKeys = keys.filter(k => !k.includes(':history'));

      for (const key of creditKeys) {
        const wallet = key.replace('credits:', '');

        // Skip if it's a history key (double check)
        if (wallet.includes(':')) continue;

        // Get query history for this wallet
        const historyKey = `credits:${wallet}:history`;
        const history = await kv.lrange(historyKey, 0, -1);

        // Calculate stats for the epoch
        let totalComputeUsed = 0;
        let queriesRun = 0;
        const activeDaysSet = new Set();

        for (const entryStr of history) {
          try {
            const entry = typeof entryStr === 'string' ? JSON.parse(entryStr) : entryStr;

            // Check if entry is within epoch
            if (entry.timestamp >= epochStart) {
              totalComputeUsed += entry.credits || 0;
              queriesRun += 1;

              // Track active days
              const dayKey = new Date(entry.timestamp).toISOString().split('T')[0];
              activeDaysSet.add(dayKey);
            }
          } catch (e) {
            // Skip malformed entries
          }
        }

        // Only include wallets with activity in this epoch
        if (totalComputeUsed > 0) {
          // Calculate streak (consecutive days ending today or yesterday)
          const activeDays = activeDaysSet.size;
          const streakDays = calculateStreak(activeDaysSet);

          walletStats.push({
            wallet,
            ens: KNOWN_ENS[wallet.toLowerCase()],
            totalComputeUsed,
            queriesRun,
            activeDays,
            streakDays,
            rank: 0 // Will be assigned after sorting
          });
        }
      }
    } while (cursor !== 0);

    // Sort by compute used (descending) and take top 50
    walletStats.sort((a, b) => b.totalComputeUsed - a.totalComputeUsed);
    const top50 = walletStats.slice(0, 50);

    // Assign ranks
    top50.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return res.status(200).json(top50);

  } catch (error) {
    console.error('Leaderboard API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Calculate consecutive day streak ending today or yesterday
 */
function calculateStreak(activeDaysSet) {
  if (activeDaysSet.size === 0) return 0;

  const sortedDays = Array.from(activeDaysSet).sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Streak must start from today or yesterday
  if (sortedDays[0] !== today && sortedDays[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const prevDate = new Date(sortedDays[i - 1]);
    const currDate = new Date(sortedDays[i]);
    const diffDays = (prevDate - currDate) / 86400000;

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
