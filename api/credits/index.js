/**
 * Credits API - Combined endpoint
 * GET  /api/credits?address={address} - Get balance
 * GET  /api/credits?action=admin-list - List all users (admin only)
 * GET  /api/credits?action=admin-list-beta - List beta whitelist emails (admin only)
 * POST /api/credits?action=claim - Claim free credits
 * POST /api/credits?action=sync-stake - Sync staked credits
 * POST /api/credits?action=admin-adjust - Adjust user credits (admin only)
 * POST /api/credits?action=admin-send-email - Send email via Resend (admin only)
 * POST /api/credits?action=admin-send-beta - Send email to all beta users (admin only)
 */
import { kv } from '@vercel/kv';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { Resend } from 'resend';
import { neon } from '@neondatabase/serverless';
import { setCorsHeaders, handlePreflight, validateAddress, checkRateLimit } from '../../lib/apiUtils.js';
import { logError } from '../../lib/logger.js';

// Admin check
function isAdmin(req) {
  const adminKey = req.headers['x-admin-key'];
  const adminSecret = process.env.ADMIN_SECRET;
  if (adminSecret && adminKey === adminSecret) return true;
  return false;
}

const FREE_CREDITS = 40;
const CLAIM_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const STAKING_ABI = [
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getStakeInfo',
    outputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'stakedAt', type: 'uint256' },
      { name: 'creditsGranted', type: 'uint256' },
      { name: 'expiresAt', type: 'uint256' },
      { name: 'active', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

// ============ GET BALANCE ============
async function handleGetBalance(req, res) {
  const { address: rawAddress } = req.query;

  if (!rawAddress) {
    return res.status(400).json({ error: 'Wallet address required' });
  }

  const normalizedAddress = validateAddress(rawAddress);
  if (!normalizedAddress) {
    return res.status(400).json({ error: 'Invalid wallet address format' });
  }

  const rateLimit = await checkRateLimit(normalizedAddress, 120, 60000);
  if (!rateLimit.allowed) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  const creditData = await kv.get(`credits:${normalizedAddress}`);

  if (!creditData) {
    return res.status(200).json({
      address: normalizedAddress,
      balance: 0,
      freeClaimedAt: null,
      stakedCredits: 0,
      purchasedCredits: 0,
      totalUsed: 0,
    });
  }

  const balance = Math.max(0, creditData.balance || 0);
  return res.status(200).json({ address: normalizedAddress, ...creditData, balance });
}

// ============ CLAIM FREE CREDITS ============
async function handleClaim(req, res) {
  const { address: rawAddress } = req.body;

  if (!rawAddress) {
    return res.status(400).json({ error: 'Wallet address required' });
  }

  const normalizedAddress = validateAddress(rawAddress);
  if (!normalizedAddress) {
    return res.status(400).json({ error: 'Invalid wallet address format' });
  }

  const rateLimit = await checkRateLimit(normalizedAddress, 10, 60000);
  if (!rateLimit.allowed) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  const creditData = await kv.get(`credits:${normalizedAddress}`) || {
    balance: 0, freeClaimedAt: null, stakedCredits: 0, purchasedCredits: 0, totalUsed: 0,
  };

  if (creditData.freeClaimedAt) {
    const timeSinceClaim = Date.now() - creditData.freeClaimedAt;
    if (timeSinceClaim < CLAIM_COOLDOWN_MS) {
      const nextClaimAt = creditData.freeClaimedAt + CLAIM_COOLDOWN_MS;
      return res.status(429).json({
        error: 'Free credits already claimed',
        nextClaimAt,
        daysRemaining: Math.ceil((nextClaimAt - Date.now()) / (24 * 60 * 60 * 1000)),
      });
    }
  }

  const newBalance = creditData.balance + FREE_CREDITS;

  await kv.set(`credits:${normalizedAddress}`, {
    ...creditData,
    balance: newBalance,
    freeClaimedAt: Date.now(),
  });

  await kv.lpush(`transactions:${normalizedAddress}`, {
    type: 'free_claim', amount: FREE_CREDITS, timestamp: Date.now(),
  });

  return res.status(200).json({
    success: true,
    creditsClaimed: FREE_CREDITS,
    newBalance,
    nextClaimAt: Date.now() + CLAIM_COOLDOWN_MS,
  });
}

// ============ SYNC STAKED CREDITS ============
async function handleSyncStake(req, res) {
  const stakingContractAddress = process.env.VITE_STAKING_CONTRACT_ADDRESS;
  if (!stakingContractAddress) {
    return res.status(500).json({ error: 'Staking contract not configured' });
  }

  const { address: rawAddress } = req.body;

  if (!rawAddress) {
    return res.status(400).json({ error: 'Wallet address required' });
  }

  const normalizedAddress = validateAddress(rawAddress);
  if (!normalizedAddress) {
    return res.status(400).json({ error: 'Invalid wallet address format' });
  }

  const rateLimit = await checkRateLimit(normalizedAddress, 20, 60000);
  if (!rateLimit.allowed) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  const client = createPublicClient({
    chain: mainnet,
    transport: http(process.env.MAINNET_RPC_URL),
  });

  const stakeInfo = await client.readContract({
    address: stakingContractAddress,
    abi: STAKING_ABI,
    functionName: 'getStakeInfo',
    args: [normalizedAddress],
  });

  const [amount, stakedAt, creditsGranted, expiresAt, active] = stakeInfo;

  if (!active) {
    return res.status(200).json({ synced: true, hasActiveStake: false, stakedCredits: 0 });
  }

  const creditData = await kv.get(`credits:${normalizedAddress}`) || {
    balance: 0, freeClaimedAt: null, stakedCredits: 0, purchasedCredits: 0, totalUsed: 0,
  };

  const stakedCreditsNum = Number(creditsGranted);

  if (stakedCreditsNum > creditData.stakedCredits) {
    const creditsToAdd = stakedCreditsNum - creditData.stakedCredits;

    await kv.set(`credits:${normalizedAddress}`, {
      ...creditData,
      balance: creditData.balance + creditsToAdd,
      stakedCredits: stakedCreditsNum,
      stakeExpiresAt: Number(expiresAt) * 1000,
      lastStakeSyncAt: Date.now(),
    });

    await kv.lpush(`transactions:${normalizedAddress}`, {
      type: 'stake_sync', amount: creditsToAdd, stakedAmount: Number(amount), timestamp: Date.now(),
    });

    return res.status(200).json({
      synced: true, hasActiveStake: true, creditsAdded: creditsToAdd,
      totalStakedCredits: stakedCreditsNum, expiresAt: Number(expiresAt) * 1000,
    });
  }

  return res.status(200).json({
    synced: true, hasActiveStake: true, creditsAdded: 0,
    totalStakedCredits: stakedCreditsNum, expiresAt: Number(expiresAt) * 1000,
    message: 'Already synced',
  });
}

// ============ ADMIN: LIST ALL USERS ============
async function handleAdminListUsers(req, res) {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized - Admin access required' });
  }

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
      });
    }
  }

  users.sort((a, b) => b.balance - a.balance);

  return res.status(200).json({
    totalUsers: users.length,
    totalCreditsInCirculation: users.reduce((sum, u) => sum + u.balance, 0),
    totalCreditsUsed: users.reduce((sum, u) => sum + u.totalUsed, 0),
    users,
  });
}

// ============ ADMIN: ADJUST CREDITS ============
async function handleAdminAdjustCredits(req, res) {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized - Admin access required' });
  }

  const { address: rawAddress, amount, reason } = req.body;

  if (!rawAddress) return res.status(400).json({ error: 'Address required' });

  const address = validateAddress(rawAddress);
  if (!address) return res.status(400).json({ error: 'Invalid address format' });

  if (typeof amount !== 'number' || isNaN(amount)) {
    return res.status(400).json({ error: 'Valid amount required' });
  }

  const creditData = await kv.get(`credits:${address}`) || {
    balance: 0, freeClaimedAt: null, stakedCredits: 0, purchasedCredits: 0, totalUsed: 0,
  };

  const newBalance = Math.max(0, creditData.balance + amount);

  await kv.set(`credits:${address}`, { ...creditData, balance: newBalance });

  await kv.lpush(`transactions:${address}`, {
    type: 'admin_adjustment', amount, reason: reason || 'Admin adjustment', timestamp: Date.now(),
  });

  return res.status(200).json({
    success: true, address, previousBalance: creditData.balance, newBalance, adjustment: amount,
  });
}

// ============ ADMIN: LIST BETA WHITELIST ============
async function handleAdminListBeta(req, res) {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized - Admin access required' });
  }

  const sql = neon(process.env.DATABASE_URL);
  const emails = await sql`SELECT id, email, created_at FROM signup_whitelist ORDER BY created_at DESC`;

  return res.status(200).json({
    totalEmails: emails.length,
    emails: emails.map(e => ({ id: e.id, email: e.email, createdAt: e.created_at })),
  });
}

// ============ ADMIN: SEND EMAIL ============
async function handleAdminSendEmail(req, res) {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized - Admin access required' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Resend API key not configured' });
  }

  const { to, subject, html, text, from } = req.body;

  if (!to || !subject || (!html && !text)) {
    return res.status(400).json({ error: 'Required: to, subject, and html or text' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = from || process.env.RESEND_FROM_EMAIL || 'Amulet <noreply@amulet.ai>';

  // Handle single email or array
  const recipients = Array.isArray(to) ? to : [to];

  const results = [];
  const errors = [];

  // Send in batches of 50 to avoid rate limits
  const batchSize = 50;
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);

    // Use Resend's batch API for efficiency
    const promises = batch.map(async (email) => {
      try {
        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: email,
          subject,
          html: html || undefined,
          text: text || undefined,
        });
        if (error) {
          errors.push({ email, error: error.message });
        } else {
          results.push({ email, id: data.id });
        }
      } catch (err) {
        errors.push({ email, error: err.message });
      }
    });

    await Promise.all(promises);

    // Small delay between batches
    if (i + batchSize < recipients.length) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  return res.status(200).json({
    success: true,
    sent: results.length,
    failed: errors.length,
    results,
    errors: errors.length > 0 ? errors : undefined,
  });
}

// ============ ADMIN: SEND TO BETA LIST ============
async function handleAdminSendBeta(req, res) {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized - Admin access required' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Resend API key not configured' });
  }

  const { subject, html, text, from, testMode } = req.body;

  if (!subject || (!html && !text)) {
    return res.status(400).json({ error: 'Required: subject, and html or text' });
  }

  // Fetch all beta emails from whitelist
  const sql = neon(process.env.DATABASE_URL);
  const whitelist = await sql`SELECT email FROM signup_whitelist`;

  if (whitelist.length === 0) {
    return res.status(400).json({ error: 'No emails in beta whitelist' });
  }

  const emails = whitelist.map(w => w.email);

  // Test mode - only send to first email
  if (testMode) {
    const testEmail = emails[0];
    return handleAdminSendEmail({
      ...req,
      body: { to: testEmail, subject: `[TEST] ${subject}`, html, text, from }
    }, res);
  }

  // Send to all beta users
  return handleAdminSendEmail({
    ...req,
    body: { to: emails, subject, html, text, from }
  }, res);
}

// ============ MAIN HANDLER ============
export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  if (!setCorsHeaders(req, res)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  try {
    const action = req.query.action || req.body?.action;

    if (req.method === 'GET') {
      if (action === 'admin-list') {
        return await handleAdminListUsers(req, res);
      }
      if (action === 'admin-list-beta') {
        return await handleAdminListBeta(req, res);
      }
      return await handleGetBalance(req, res);
    }

    if (req.method === 'POST') {
      switch (action) {
        case 'claim':
          return await handleClaim(req, res);
        case 'sync-stake':
          return await handleSyncStake(req, res);
        case 'admin-adjust':
          return await handleAdminAdjustCredits(req, res);
        case 'admin-send-email':
          return await handleAdminSendEmail(req, res);
        case 'admin-send-beta':
          return await handleAdminSendBeta(req, res);
        default:
          return res.status(400).json({ error: 'Invalid action' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    logError('api/credits', 'Credits API error', { error });
    return res.status(500).json({ error: 'Internal server error' });
  }
}
