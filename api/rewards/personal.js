// GET /api/rewards/personal - Get personal stats for a wallet
import { kv } from '@vercel/kv';

// Epoch time ranges in milliseconds
const EPOCH_RANGES = {
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
  'all': Infinity
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { epoch = '30d', wallet } = req.query;

  if (!wallet) {
    return res.status(400).json({ error: 'Wallet address required' });
  }

  if (!EPOCH_RANGES[epoch]) {
    return res.status(400).json({ error: 'Invalid epoch. Use: 24h, 7d, 30d, or all' });
  }

  try {
    const normalizedWallet = wallet.toLowerCase();
    const now = Date.now();
    const epochStart = epoch === 'all' ? 0 : now - EPOCH_RANGES[epoch];

    // Get user's query history
    const historyKey = `credits:${normalizedWallet}:history`;
    const history = await kv.lrange(historyKey, 0, -1);

    // Calculate user's stats for the epoch
    let totalComputeUsed = 0;
    let queriesRun = 0;
    const activeDaysSet = new Set();

    for (const entryStr of history) {
      try {
        const entry = typeof entryStr === 'string' ? JSON.parse(entryStr) : entryStr;

        if (entry.timestamp >= epochStart) {
          totalComputeUsed += entry.credits || 0;
          queriesRun += 1;

          const dayKey = new Date(entry.timestamp).toISOString().split('T')[0];
          activeDaysSet.add(dayKey);
        }
      } catch (e) {
        // Skip malformed entries
      }
    }

    const activeDays = activeDaysSet.size;
    const streakDays = calculateStreak(activeDaysSet);

    // Get top 50 threshold and user's rank
    // We need to scan other wallets to determine rank
    const allWalletStats = [];
    let cursor = 0;

    do {
      const [nextCursor, keys] = await kv.scan(cursor, {
        match: 'credits:0x*',
        count: 100
      });
      cursor = nextCursor;

      const creditKeys = keys.filter(k => !k.includes(':history'));

      for (const key of creditKeys) {
        const otherWallet = key.replace('credits:', '');
        if (otherWallet.includes(':')) continue;

        const otherHistoryKey = `credits:${otherWallet}:history`;
        const otherHistory = await kv.lrange(otherHistoryKey, 0, -1);

        let otherCompute = 0;
        for (const entryStr of otherHistory) {
          try {
            const entry = typeof entryStr === 'string' ? JSON.parse(entryStr) : entryStr;
            if (entry.timestamp >= epochStart) {
              otherCompute += entry.credits || 0;
            }
          } catch (e) {}
        }

        if (otherCompute > 0) {
          allWalletStats.push({
            wallet: otherWallet,
            totalComputeUsed: otherCompute
          });
        }
      }
    } while (cursor !== 0);

    // Sort and find user's rank
    allWalletStats.sort((a, b) => b.totalComputeUsed - a.totalComputeUsed);

    const userIndex = allWalletStats.findIndex(
      s => s.wallet.toLowerCase() === normalizedWallet
    );

    const rank = userIndex >= 0 && userIndex < 50 ? userIndex + 1 : undefined;
    const top50Threshold = allWalletStats[49]?.totalComputeUsed || 0;

    // Calculate percentile
    const totalWallets = allWalletStats.length;
    const walletsBelow = allWalletStats.filter(
      s => s.totalComputeUsed < totalComputeUsed
    ).length;
    const percentile = totalWallets > 0
      ? Math.round((walletsBelow / totalWallets) * 100)
      : 0;

    return res.status(200).json({
      wallet: normalizedWallet,
      rank,
      totalComputeUsed,
      queriesRun,
      activeDays,
      streakDays,
      top50ThresholdCompute: top50Threshold,
      percentile
    });

  } catch (error) {
    console.error('Personal stats API error:', error);
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
