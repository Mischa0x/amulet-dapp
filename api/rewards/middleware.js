/**
 * Rewards Tracking Middleware
 *
 * This module provides functions for tracking and aggregating user rewards data.
 * It integrates with the existing credit system to build leaderboard data.
 *
 * ANTI-GAMING CONSIDERATIONS:
 * 1. Streak weighting: Require minimum compute per day (>5 credits) to count as active
 * 2. Query spam caps: Rate limits via existing credit system, complexity variance required
 * 3. Burst detection: Flag 10x spikes vs 7-day average, sliding window analysis
 * 4. Sybil resistance: Consider wallet age, staking requirements, clustering detection
 * 5. Credit diversity: Track query tier distribution (not just total credits)
 *
 * Storage structure in Vercel KV:
 * - rewards:{wallet}:daily:{date} - Daily aggregates
 * - rewards:leaderboard:{epoch} - Cached leaderboard (TTL: 5 min)
 * - rewards:global:{epoch} - Platform totals (TTL: 5 min)
 */

import { kv } from '@vercel/kv';

// Constants
const MIN_DAILY_COMPUTE_FOR_ACTIVE = 5;
const LEADERBOARD_CACHE_TTL = 300; // 5 minutes
const MAX_LEADERBOARD_SIZE = 50;

/**
 * Record a query for rewards tracking
 * Called after successful credit deduction in chat.js
 */
export async function recordQueryForRewards(wallet, credits, tier) {
  if (!wallet) return;

  const normalizedWallet = wallet.toLowerCase();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const dailyKey = `rewards:${normalizedWallet}:daily:${today}`;

  try {
    // Get or create daily record
    const dailyData = await kv.get(dailyKey) || {
      date: today,
      totalCompute: 0,
      queriesRun: 0,
      tierBreakdown: { basic: 0, standard: 0, deep: 0 },
      firstQueryAt: Date.now(),
      lastQueryAt: Date.now(),
    };

    // Update daily stats
    dailyData.totalCompute += credits;
    dailyData.queriesRun += 1;
    dailyData.lastQueryAt = Date.now();

    // Track tier distribution for anti-gaming
    if (tier === 'basic') dailyData.tierBreakdown.basic += 1;
    else if (tier === 'standard') dailyData.tierBreakdown.standard += 1;
    else if (tier === 'deep') dailyData.tierBreakdown.deep += 1;

    // Save with 90-day TTL
    await kv.set(dailyKey, dailyData, { ex: 90 * 24 * 60 * 60 });

    // Update wallet's all-time stats
    const allTimeKey = `rewards:${normalizedWallet}:alltime`;
    const allTimeData = await kv.get(allTimeKey) || {
      totalCompute: 0,
      queriesRun: 0,
      firstSeen: Date.now(),
      lastSeen: Date.now(),
    };

    allTimeData.totalCompute += credits;
    allTimeData.queriesRun += 1;
    allTimeData.lastSeen = Date.now();

    await kv.set(allTimeKey, allTimeData);

    // Add to active wallets set for the day
    const activeSetKey = `rewards:active:${today}`;
    await kv.sadd(activeSetKey, normalizedWallet);
    await kv.expire(activeSetKey, 90 * 24 * 60 * 60);

    // Invalidate leaderboard caches
    await invalidateLeaderboardCaches();

  } catch (error) {
    console.error('Failed to record rewards:', error);
    // Don't throw - rewards tracking failure shouldn't block chat
  }
}

/**
 * Invalidate leaderboard caches when data changes
 */
async function invalidateLeaderboardCaches() {
  const epochs = ['24h', '7d', '30d', 'all'];
  for (const epoch of epochs) {
    await kv.del(`rewards:leaderboard:${epoch}`);
    await kv.del(`rewards:global:${epoch}`);
  }
}

/**
 * Get date range for an epoch
 */
export function getEpochDateRange(epoch) {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0];
  let startDate;
  let days;

  switch (epoch) {
    case '24h':
      startDate = endDate;
      days = 1;
      break;
    case '7d':
      startDate = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      days = 7;
      break;
    case '30d':
      startDate = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      days = 30;
      break;
    case 'all':
    default:
      startDate = new Date(now.getTime() - 89 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      days = 90;
      break;
  }

  return { startDate, endDate, days };
}

/**
 * Get all dates in range
 */
export function getDatesInRange(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Aggregate wallet stats for an epoch
 */
export async function aggregateWalletStats(wallet, epoch) {
  const normalizedWallet = wallet.toLowerCase();
  const { startDate, endDate, days } = getEpochDateRange(epoch);
  const dates = getDatesInRange(startDate, endDate);

  let totalCompute = 0;
  let queriesRun = 0;
  let activeDays = 0;
  let streakDays = 0;
  let currentStreak = 0;

  // Get daily data for each date
  const dailyPromises = dates.map(date =>
    kv.get(`rewards:${normalizedWallet}:daily:${date}`)
  );
  const dailyResults = await Promise.all(dailyPromises);

  // Process in reverse order for streak calculation
  for (let i = dailyResults.length - 1; i >= 0; i--) {
    const data = dailyResults[i];
    if (data) {
      totalCompute += data.totalCompute || 0;
      queriesRun += data.queriesRun || 0;

      // Count as active day if met minimum compute
      if ((data.totalCompute || 0) >= MIN_DAILY_COMPUTE_FOR_ACTIVE) {
        activeDays += 1;
        currentStreak += 1;
      } else {
        // Streak broken
        if (currentStreak > streakDays) {
          streakDays = currentStreak;
        }
        currentStreak = 0;
      }
    } else {
      // No data for this day - streak broken
      if (currentStreak > streakDays) {
        streakDays = currentStreak;
      }
      currentStreak = 0;
    }
  }

  // Final streak check
  if (currentStreak > streakDays) {
    streakDays = currentStreak;
  }

  return {
    wallet: normalizedWallet,
    totalComputeUsed: totalCompute,
    queriesRun,
    activeDays,
    streakDays,
  };
}

/**
 * Get all active wallets for an epoch
 */
export async function getActiveWalletsForEpoch(epoch) {
  const { startDate, endDate } = getEpochDateRange(epoch);
  const dates = getDatesInRange(startDate, endDate);

  const walletSet = new Set();

  for (const date of dates) {
    const activeSetKey = `rewards:active:${date}`;
    const wallets = await kv.smembers(activeSetKey);
    if (wallets) {
      wallets.forEach(w => walletSet.add(w));
    }
  }

  return Array.from(walletSet);
}

/**
 * Build leaderboard for an epoch
 */
export async function buildLeaderboard(epoch) {
  // Check cache first
  const cacheKey = `rewards:leaderboard:${epoch}`;
  const cached = await kv.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Get all active wallets
  const wallets = await getActiveWalletsForEpoch(epoch);

  if (wallets.length === 0) {
    return [];
  }

  // Aggregate stats for each wallet
  const statsPromises = wallets.map(wallet => aggregateWalletStats(wallet, epoch));
  const allStats = await Promise.all(statsPromises);

  // Sort by total compute (descending)
  allStats.sort((a, b) => b.totalComputeUsed - a.totalComputeUsed);

  // Take top 50 and assign ranks
  const leaderboard = allStats.slice(0, MAX_LEADERBOARD_SIZE).map((stats, index) => ({
    ...stats,
    rank: index + 1,
  }));

  // Cache for 5 minutes
  await kv.set(cacheKey, leaderboard, { ex: LEADERBOARD_CACHE_TTL });

  return leaderboard;
}

/**
 * Get personal stats for a wallet
 */
export async function getPersonalStats(epoch, wallet) {
  const stats = await aggregateWalletStats(wallet, epoch);
  const leaderboard = await buildLeaderboard(epoch);

  // Find rank in leaderboard
  const normalizedWallet = wallet.toLowerCase();
  const entry = leaderboard.find(e => e.wallet === normalizedWallet);
  const rank = entry ? entry.rank : undefined;

  // Get threshold (rank 50's compute or lowest in leaderboard)
  const threshold = leaderboard.length >= 50
    ? leaderboard[49].totalComputeUsed
    : leaderboard.length > 0
      ? leaderboard[leaderboard.length - 1].totalComputeUsed
      : 100;

  // Calculate percentile (mock for now - would need full user count)
  const totalUsers = leaderboard.length > 0 ? Math.max(leaderboard.length * 2, 100) : 100;
  const percentile = rank
    ? Math.round((1 - (rank / totalUsers)) * 100)
    : Math.round((stats.totalComputeUsed / (threshold || 1)) * 50);

  return {
    wallet: normalizedWallet,
    rank,
    totalComputeUsed: stats.totalComputeUsed,
    queriesRun: stats.queriesRun,
    activeDays: stats.activeDays,
    streakDays: stats.streakDays,
    top50ThresholdCompute: threshold,
    percentile: Math.min(99, Math.max(1, percentile)),
  };
}

/**
 * Get global/social proof stats for an epoch
 */
export async function getGlobalStats(epoch) {
  // Check cache
  const cacheKey = `rewards:global:${epoch}`;
  const cached = await kv.get(cacheKey);
  if (cached) {
    return cached;
  }

  const wallets = await getActiveWalletsForEpoch(epoch);

  if (wallets.length === 0) {
    return {
      activeWallets: 0,
      totalCompute: 0,
      totalQueries: 0,
    };
  }

  // Aggregate all stats
  const statsPromises = wallets.map(wallet => aggregateWalletStats(wallet, epoch));
  const allStats = await Promise.all(statsPromises);

  const totals = allStats.reduce((acc, stats) => ({
    totalCompute: acc.totalCompute + stats.totalComputeUsed,
    totalQueries: acc.totalQueries + stats.queriesRun,
  }), { totalCompute: 0, totalQueries: 0 });

  const result = {
    activeWallets: wallets.length,
    totalCompute: totals.totalCompute,
    totalQueries: totals.totalQueries,
  };

  // Cache for 5 minutes
  await kv.set(cacheKey, result, { ex: LEADERBOARD_CACHE_TTL });

  return result;
}
