/**
 * Admin API - User Credits and Rewards Management
 * GET /api/admin/users - List all users with their credits
 * POST /api/admin/users?action=adjust-credits - Adjust user credits
 */
import { kv } from '@vercel/kv';
import { setCorsHeaders, handlePreflight, validateAddress } from '../../lib/apiUtils.js';
import { logError } from '../../lib/logger.js';

// Admin wallet addresses (lowercase for comparison)
const ADMIN_WALLETS = [
  '0x742d35cc6634c0532925a3b844bc454e4438f44e', // Add your admin wallet addresses here
  // Add more admin wallets as needed
];

// Simple admin check - in production, use proper auth
function isAdmin(req) {
  const adminKey = req.headers['x-admin-key'];
  const adminSecret = process.env.ADMIN_SECRET;

  // Check admin secret key
  if (adminSecret && adminKey === adminSecret) {
    return true;
  }

  // Check if request includes an admin wallet
  const wallet = req.headers['x-wallet-address']?.toLowerCase();
  if (wallet && ADMIN_WALLETS.includes(wallet)) {
    return true;
  }

  return false;
}

// List all users with credits
async function handleListUsers(req, res) {
  try {
    // Get all credit keys from KV
    const keys = await kv.keys('credits:*');

    const users = [];

    for (const key of keys) {
      const address = key.replace('credits:', '');
      const creditData = await kv.get(key);

      if (creditData) {
        users.push({
          address,
          balance: creditData.balance || 0,
          freeClaimedAt: creditData.freeClaimedAt || null,
          stakedCredits: creditData.stakedCredits || 0,
          purchasedCredits: creditData.purchasedCredits || 0,
          totalUsed: creditData.totalUsed || 0,
          lastStakeSyncAt: creditData.lastStakeSyncAt || null,
          stakeExpiresAt: creditData.stakeExpiresAt || null,
        });
      }
    }

    // Sort by balance descending
    users.sort((a, b) => b.balance - a.balance);

    return res.status(200).json({
      totalUsers: users.length,
      totalCreditsInCirculation: users.reduce((sum, u) => sum + u.balance, 0),
      totalCreditsUsed: users.reduce((sum, u) => sum + u.totalUsed, 0),
      users,
    });
  } catch (error) {
    logError('api/admin/users', 'Error listing users', { error });
    throw error;
  }
}

// Adjust user credits (add or subtract)
async function handleAdjustCredits(req, res) {
  const { address: rawAddress, amount, reason } = req.body;

  if (!rawAddress) {
    return res.status(400).json({ error: 'Address required' });
  }

  const address = validateAddress(rawAddress);
  if (!address) {
    return res.status(400).json({ error: 'Invalid address format' });
  }

  if (typeof amount !== 'number' || isNaN(amount)) {
    return res.status(400).json({ error: 'Valid amount required' });
  }

  try {
    const creditData = await kv.get(`credits:${address}`) || {
      balance: 0,
      freeClaimedAt: null,
      stakedCredits: 0,
      purchasedCredits: 0,
      totalUsed: 0,
    };

    const newBalance = Math.max(0, creditData.balance + amount);

    await kv.set(`credits:${address}`, {
      ...creditData,
      balance: newBalance,
    });

    // Log the adjustment
    await kv.lpush(`transactions:${address}`, {
      type: 'admin_adjustment',
      amount,
      reason: reason || 'Admin adjustment',
      timestamp: Date.now(),
    });

    return res.status(200).json({
      success: true,
      address,
      previousBalance: creditData.balance,
      newBalance,
      adjustment: amount,
    });
  } catch (error) {
    logError('api/admin/users', 'Error adjusting credits', { error, address, amount });
    throw error;
  }
}

// Get transaction history for a user
async function handleGetTransactions(req, res) {
  const { address: rawAddress, limit = 50 } = req.query;

  if (!rawAddress) {
    return res.status(400).json({ error: 'Address required' });
  }

  const address = validateAddress(rawAddress);
  if (!address) {
    return res.status(400).json({ error: 'Invalid address format' });
  }

  try {
    const transactions = await kv.lrange(`transactions:${address}`, 0, parseInt(limit) - 1);

    return res.status(200).json({
      address,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    logError('api/admin/users', 'Error getting transactions', { error, address });
    throw error;
  }
}

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  if (!setCorsHeaders(req, res)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  // Check admin authorization
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized - Admin access required' });
  }

  try {
    if (req.method === 'GET') {
      const action = req.query.action;

      if (action === 'transactions') {
        return await handleGetTransactions(req, res);
      }

      return await handleListUsers(req, res);
    }

    if (req.method === 'POST') {
      const action = req.query.action;

      if (action === 'adjust-credits') {
        return await handleAdjustCredits(req, res);
      }

      return res.status(400).json({ error: 'Invalid action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    logError('api/admin/users', 'Admin API error', { error });
    return res.status(500).json({ error: 'Internal server error' });
  }
}
