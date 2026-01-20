/**
 * Credits API - Combined endpoint
 * GET  /api/credits?address={address} - Get balance
 * POST /api/credits?action=claim - Claim free credits
 * POST /api/credits?action=sync-stake - Sync staked credits
 */
import { kv } from '@vercel/kv';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { setCorsHeaders, handlePreflight, validateAddress, checkRateLimit } from '../../lib/apiUtils.js';
import { logError } from '../../lib/logger.js';

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

// ============ MAIN HANDLER ============
export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  if (!setCorsHeaders(req, res)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  try {
    if (req.method === 'GET') {
      return await handleGetBalance(req, res);
    }

    if (req.method === 'POST') {
      const action = req.query.action || req.body?.action;

      switch (action) {
        case 'claim':
          return await handleClaim(req, res);
        case 'sync-stake':
          return await handleSyncStake(req, res);
        default:
          return res.status(400).json({ error: 'Invalid action. Use ?action=claim or ?action=sync-stake' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    logError('api/credits', 'Credits API error', { error });
    return res.status(500).json({ error: 'Internal server error' });
  }
}
