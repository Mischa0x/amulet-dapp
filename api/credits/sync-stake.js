// POST /api/credits/sync-stake - Sync credits from on-chain staking
import { kv } from '@vercel/kv';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

// AmuletStaking contract ABI (minimal for reading stake info)
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stakingContractAddress = process.env.VITE_STAKING_CONTRACT_ADDRESS;
  if (!stakingContractAddress) {
    return res.status(500).json({ error: 'Staking contract not configured' });
  }

  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Wallet address required' });
  }

  const normalizedAddress = address.toLowerCase();

  try {
    // Create viem client for reading contract state
    const client = createPublicClient({
      chain: mainnet,
      transport: http(process.env.MAINNET_RPC_URL),
    });

    // Read stake info from contract
    const stakeInfo = await client.readContract({
      address: stakingContractAddress,
      abi: STAKING_ABI,
      functionName: 'getStakeInfo',
      args: [address],
    });

    const [amount, stakedAt, creditsGranted, expiresAt, active] = stakeInfo;

    if (!active) {
      return res.status(200).json({
        synced: true,
        hasActiveStake: false,
        stakedCredits: 0,
      });
    }

    // Get current credit data
    const creditData = await kv.get(`credits:${normalizedAddress}`) || {
      balance: 0,
      freeClaimedAt: null,
      stakedCredits: 0,
      purchasedCredits: 0,
      totalUsed: 0,
    };

    const stakedCreditsNum = Number(creditsGranted);

    // Only add difference if staked credits increased
    if (stakedCreditsNum > creditData.stakedCredits) {
      const creditsToAdd = stakedCreditsNum - creditData.stakedCredits;

      await kv.set(`credits:${normalizedAddress}`, {
        ...creditData,
        balance: creditData.balance + creditsToAdd,
        stakedCredits: stakedCreditsNum,
        stakeExpiresAt: Number(expiresAt) * 1000, // Convert to ms
        lastStakeSyncAt: Date.now(),
      });

      // Log the transaction
      await kv.lpush(`transactions:${normalizedAddress}`, {
        type: 'stake_sync',
        amount: creditsToAdd,
        stakedAmount: Number(amount),
        timestamp: Date.now(),
      });

      return res.status(200).json({
        synced: true,
        hasActiveStake: true,
        creditsAdded: creditsToAdd,
        totalStakedCredits: stakedCreditsNum,
        expiresAt: Number(expiresAt) * 1000,
      });
    }

    return res.status(200).json({
      synced: true,
      hasActiveStake: true,
      creditsAdded: 0,
      totalStakedCredits: stakedCreditsNum,
      expiresAt: Number(expiresAt) * 1000,
      message: 'Already synced',
    });

  } catch (error) {
    console.error('Stake sync error:', error);
    return res.status(500).json({ error: 'Failed to sync stake' });
  }
}
