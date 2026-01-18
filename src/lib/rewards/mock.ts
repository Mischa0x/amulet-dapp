/**
 * Mock Data Generator for Rewards Dashboard
 *
 * Generates deterministic, realistic mock data for development.
 * To swap with real API: update api.ts to call actual endpoints.
 */

import type { Epoch, LeaderboardEntry, PersonalStats, SocialProofStats } from './types';

// Seeded random for deterministic results
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Generate realistic wallet addresses
function generateWallet(index: number): string {
  const chars = '0123456789abcdef';
  let addr = '0x';
  const rand = seededRandom(index * 7919);
  for (let i = 0; i < 40; i++) {
    addr += chars[Math.floor(rand() * 16)];
  }
  return addr;
}

// Some wallets have ENS names
const ENS_NAMES: Record<number, string> = {
  0: 'drpepe.eth',
  1: 'longevity.eth',
  2: 'healthmaxi.eth',
  5: 'biohacker.eth',
  8: 'amulet-whale.eth',
  12: 'peptide-king.eth',
  15: 'nootropic.eth',
  20: 'nmn-enjoyer.eth',
  25: 'rapamycin.eth',
  30: 'metformin.eth',
};

// Epoch multipliers for generating consistent data across epochs
const EPOCH_CONFIG: Record<Epoch, { days: number; computeMultiplier: number; queryMultiplier: number }> = {
  '24h': { days: 1, computeMultiplier: 0.03, queryMultiplier: 0.03 },
  '7d': { days: 7, computeMultiplier: 0.2, queryMultiplier: 0.2 },
  '30d': { days: 30, computeMultiplier: 0.6, queryMultiplier: 0.6 },
  'all': { days: 90, computeMultiplier: 1, queryMultiplier: 1 },
};

// Base stats for top 50 wallets (all-time baseline)
function generateBaseStats(): Array<{
  wallet: string;
  ens?: string;
  baseCompute: number;
  baseQueries: number;
  activityScore: number; // 0-1, determines streaks and active days
}> {
  const stats: Array<{
    wallet: string;
    ens?: string;
    baseCompute: number;
    baseQueries: number;
    activityScore: number;
  }> = [];

  for (let i = 0; i < 50; i++) {
    const rand = seededRandom(i * 1337);

    // Power law distribution - top wallets use significantly more
    const rankFactor = Math.pow(1 - (i / 50), 2);
    const baseCompute = Math.floor(5000 + rankFactor * 45000 + rand() * 5000);
    const avgComputePerQuery = 2 + rand() * 8; // 2-10 credits per query
    const baseQueries = Math.floor(baseCompute / avgComputePerQuery);
    const activityScore = 0.5 + rankFactor * 0.4 + rand() * 0.1;

    stats.push({
      wallet: generateWallet(i),
      ens: ENS_NAMES[i],
      baseCompute,
      baseQueries,
      activityScore: Math.min(activityScore, 1),
    });
  }

  // Sort by baseCompute descending
  stats.sort((a, b) => b.baseCompute - a.baseCompute);

  return stats;
}

const BASE_STATS = generateBaseStats();

/**
 * Get leaderboard entries for a given epoch
 */
export async function getRewardsLeaderboard(epoch: Epoch): Promise<LeaderboardEntry[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

  const config = EPOCH_CONFIG[epoch];

  const entries: LeaderboardEntry[] = BASE_STATS.map((stat, index) => {
    const rand = seededRandom(index * 2749 + epoch.length);

    // Scale compute and queries by epoch
    const computeVariance = 0.8 + rand() * 0.4; // 80-120% variance
    const totalComputeUsed = Math.floor(stat.baseCompute * config.computeMultiplier * computeVariance);
    const queriesRun = Math.floor(stat.baseQueries * config.queryMultiplier * computeVariance);

    // Active days based on epoch max days and activity score
    const maxActiveDays = config.days;
    const activeDays = Math.min(
      Math.floor(maxActiveDays * stat.activityScore * (0.7 + rand() * 0.3)),
      maxActiveDays
    );

    // Streak is a subset of active days
    const streakDays = Math.min(
      Math.floor(activeDays * (0.5 + rand() * 0.5)),
      activeDays
    );

    return {
      wallet: stat.wallet,
      ens: stat.ens,
      totalComputeUsed,
      queriesRun,
      activeDays,
      streakDays,
      rank: index + 1,
    };
  });

  // Re-sort by compute for this epoch (rankings can shift)
  entries.sort((a, b) => b.totalComputeUsed - a.totalComputeUsed);

  // Reassign ranks after sorting
  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return entries;
}

/**
 * Get personal stats for a connected wallet
 */
export async function getRewardsPersonalStats(
  epoch: Epoch,
  wallet: string
): Promise<PersonalStats> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 150));

  const leaderboard = await getRewardsLeaderboard(epoch);
  const normalizedWallet = wallet.toLowerCase();

  // Check if wallet is in top 50
  const userEntry = leaderboard.find(
    entry => entry.wallet.toLowerCase() === normalizedWallet
  );

  const top50Threshold = leaderboard[49]?.totalComputeUsed || 0;

  if (userEntry) {
    return {
      wallet,
      rank: userEntry.rank,
      totalComputeUsed: userEntry.totalComputeUsed,
      queriesRun: userEntry.queriesRun,
      activeDays: userEntry.activeDays,
      streakDays: userEntry.streakDays,
      top50ThresholdCompute: top50Threshold,
      percentile: Math.max(1, 100 - Math.floor(userEntry.rank * 0.5)),
    };
  }

  // Generate stats for wallet not in top 50
  const rand = seededRandom(parseInt(wallet.slice(2, 10), 16));
  const config = EPOCH_CONFIG[epoch];

  // Lower tier user
  const baseCompute = Math.floor(50 + rand() * 2000);
  const totalComputeUsed = Math.floor(baseCompute * config.computeMultiplier);
  const queriesRun = Math.floor(totalComputeUsed / (2 + rand() * 5));
  const activeDays = Math.min(Math.floor(config.days * rand() * 0.5), config.days);
  const streakDays = Math.floor(activeDays * rand());

  // Calculate percentile based on compute usage relative to top 50
  const percentile = Math.min(
    Math.floor((totalComputeUsed / top50Threshold) * 50),
    49
  );

  return {
    wallet,
    rank: undefined, // Not in top 50
    totalComputeUsed,
    queriesRun,
    activeDays,
    streakDays,
    top50ThresholdCompute: top50Threshold,
    percentile: Math.max(1, percentile),
  };
}

/**
 * Get social proof statistics for the platform
 */
export async function getRewardsSocialProof(epoch: Epoch): Promise<SocialProofStats> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 150));

  const config = EPOCH_CONFIG[epoch];
  const rand = seededRandom(epoch.length * 4231);

  // Platform-wide stats scaled by epoch
  const baseActiveWallets = 2847;
  const baseTotalCompute = 1_250_000;
  const baseTotalQueries = 180_000;

  return {
    activeWallets: Math.floor(baseActiveWallets * config.computeMultiplier * (0.3 + rand() * 0.7)),
    totalCompute: Math.floor(baseTotalCompute * config.computeMultiplier * (0.9 + rand() * 0.2)),
    totalQueries: Math.floor(baseTotalQueries * config.queryMultiplier * (0.9 + rand() * 0.2)),
  };
}

/**
 * Demo wallet for testing when no wallet is connected
 */
export const DEMO_WALLET = '0x742d35Cc6634C0532925a3b844Bc9e7595f8bE22';
