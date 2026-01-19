// GET /api/credits - Get user's credit balance
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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address: rawAddress } = req.query;

  if (!rawAddress) {
    return res.status(400).json({ error: 'Wallet address required' });
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

  try {
    // Get credit balance from KV store
    const creditData = await kv.get(`credits:${normalizedAddress}`);

    if (!creditData) {
      // New user - no credits yet
      return res.status(200).json({
        address: normalizedAddress,
        balance: 0,
        freeClaimedAt: null,
        stakedCredits: 0,
        purchasedCredits: 0,
        totalUsed: 0,
      });
    }

    // Ensure balance is never negative (fix for legacy data)
    const balance = Math.max(0, creditData.balance || 0);

    return res.status(200).json({
      address: normalizedAddress,
      ...creditData,
      balance, // Override with clamped value
    });

  } catch (error) {
    logError('api/credits', 'Credits API error', { error });
    return res.status(500).json({ error: 'Internal server error' });
  }
}
