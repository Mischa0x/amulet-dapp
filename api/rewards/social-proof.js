// GET /api/rewards/social-proof - Get platform-wide statistics
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
  // Cache for 5 minutes
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

    let activeWallets = 0;
    let totalCompute = 0;
    let totalQueries = 0;

    // Scan all credit keys
    let cursor = 0;

    do {
      const [nextCursor, keys] = await kv.scan(cursor, {
        match: 'credits:0x*',
        count: 100
      });
      cursor = nextCursor;

      const creditKeys = keys.filter(k => !k.includes(':history'));

      for (const key of creditKeys) {
        const wallet = key.replace('credits:', '');
        if (wallet.includes(':')) continue;

        const historyKey = `credits:${wallet}:history`;
        const history = await kv.lrange(historyKey, 0, -1);

        let walletCompute = 0;
        let walletQueries = 0;

        for (const entryStr of history) {
          try {
            const entry = typeof entryStr === 'string' ? JSON.parse(entryStr) : entryStr;

            if (entry.timestamp >= epochStart) {
              walletCompute += entry.credits || 0;
              walletQueries += 1;
            }
          } catch (e) {
            // Skip malformed entries
          }
        }

        if (walletCompute > 0) {
          activeWallets += 1;
          totalCompute += walletCompute;
          totalQueries += walletQueries;
        }
      }
    } while (cursor !== 0);

    return res.status(200).json({
      activeWallets,
      totalCompute,
      totalQueries
    });

  } catch (error) {
    console.error('Social proof API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
