/**
 * Rewards API Abstraction Layer
 *
 * This module provides data fetching for the rewards dashboard.
 * Uses real API endpoints with fallback to mock data if API returns empty.
 *
 * Backend endpoints:
 * - GET /api/rewards/leaderboard?epoch={24h|7d|30d|all}
 * - GET /api/rewards/personal?epoch={epoch}&wallet={address}
 * - GET /api/rewards/social-proof?epoch={epoch}
 */

import type { Epoch, LeaderboardEntry, PersonalStats, SocialProofStats } from './types';
import {
  getRewardsLeaderboard,
  getRewardsPersonalStats,
  getRewardsSocialProof,
} from './mock';

// Re-export types and constants for convenience
export type { Epoch, LeaderboardEntry, PersonalStats, SocialProofStats } from './types';
export { DEMO_WALLET } from './mock';

// Set to true to force mock data (useful for development)
const FORCE_MOCK = false;

/**
 * Fetch the top 50 leaderboard for a given epoch
 */
export async function fetchLeaderboard(epoch: Epoch): Promise<LeaderboardEntry[]> {
  if (FORCE_MOCK) {
    return getRewardsLeaderboard(epoch);
  }

  try {
    const res = await fetch(`/api/rewards/leaderboard?epoch=${epoch}`);
    if (!res.ok) throw new Error('API error');

    const data = await res.json();
    return data || [];
  } catch (error) {
    console.error('Leaderboard fetch failed:', error);
    return [];
  }
}

/**
 * Fetch personal stats for a connected wallet
 */
export async function fetchPersonalStats(
  epoch: Epoch,
  wallet: string
): Promise<PersonalStats> {
  if (FORCE_MOCK) {
    return getRewardsPersonalStats(epoch, wallet);
  }

  try {
    const res = await fetch(
      `/api/rewards/personal?epoch=${epoch}&wallet=${encodeURIComponent(wallet)}`
    );
    if (!res.ok) throw new Error('API error');

    const data = await res.json();
    return data || {
      wallet,
      rank: undefined,
      totalComputeUsed: 0,
      referralPoints: 0,
      referralCount: 0,
      totalPoints: 0,
      queriesRun: 0,
      activeDays: 0,
      streakDays: 0,
      top50ThresholdPoints: 0,
      percentile: 0,
    };
  } catch (error) {
    console.error('Personal stats fetch failed:', error);
    return {
      wallet,
      rank: undefined,
      totalComputeUsed: 0,
      referralPoints: 0,
      referralCount: 0,
      totalPoints: 0,
      queriesRun: 0,
      activeDays: 0,
      streakDays: 0,
      top50ThresholdPoints: 0,
      percentile: 0,
    };
  }
}

/**
 * Fetch platform-wide social proof statistics
 */
export async function fetchSocialProof(epoch: Epoch): Promise<SocialProofStats> {
  if (FORCE_MOCK) {
    return getRewardsSocialProof(epoch);
  }

  try {
    const res = await fetch(`/api/rewards/social-proof?epoch=${epoch}`);
    if (!res.ok) throw new Error('API error');

    const data = await res.json();
    return data || { activeWallets: 0, totalCompute: 0, totalQueries: 0 };
  } catch (error) {
    console.error('Social proof fetch failed:', error);
    return { activeWallets: 0, totalCompute: 0, totalQueries: 0 };
  }
}

/**
 * Helper to get user badge based on stats
 */
export function getUserBadge(
  rank: number | undefined,
  activeDays: number,
  totalCompute: number,
  epochDays: number
): string {
  if (rank !== undefined && rank <= 5) return 'Top 10%';
  if (activeDays >= epochDays * 0.7) return 'Power User';
  if (totalCompute >= 1000) return 'Heavy Compute';
  if (activeDays >= 1) return 'Active';
  return 'New';
}

/**
 * Get badge color class
 */
export function getBadgeColor(badge: string): string {
  switch (badge) {
    case 'Top 10%':
      return 'gold';
    case 'Power User':
      return 'purple';
    case 'Heavy Compute':
      return 'blue';
    case 'Active':
      return 'green';
    default:
      return 'grey';
  }
}
