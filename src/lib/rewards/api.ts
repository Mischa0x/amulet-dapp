/**
 * Rewards API Abstraction Layer
 *
 * This module wraps the data fetching logic for the rewards dashboard.
 * Currently uses mock data, but can be easily swapped to real API endpoints.
 *
 * TO SWAP TO REAL API:
 * 1. Create API endpoints on your backend:
 *    - GET /api/rewards/leaderboard?epoch={24h|7d|30d|all}
 *    - GET /api/rewards/personal?epoch={epoch}&wallet={address}
 *    - GET /api/rewards/social-proof?epoch={epoch}
 *
 * 2. Update the functions below to call your endpoints instead of mock:
 *
 *    export async function fetchLeaderboard(epoch: Epoch): Promise<LeaderboardEntry[]> {
 *      const res = await fetch(`/api/rewards/leaderboard?epoch=${epoch}`);
 *      if (!res.ok) throw new Error('Failed to fetch leaderboard');
 *      return res.json();
 *    }
 *
 * 3. Add error handling and retry logic as needed.
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

/**
 * Fetch the top 50 leaderboard for a given epoch
 */
export async function fetchLeaderboard(epoch: Epoch): Promise<LeaderboardEntry[]> {
  // Currently using mock data
  // TODO: Replace with real API call when backend is ready
  return getRewardsLeaderboard(epoch);
}

/**
 * Fetch personal stats for a connected wallet
 */
export async function fetchPersonalStats(
  epoch: Epoch,
  wallet: string
): Promise<PersonalStats> {
  // Currently using mock data
  // TODO: Replace with real API call when backend is ready
  return getRewardsPersonalStats(epoch, wallet);
}

/**
 * Fetch platform-wide social proof statistics
 */
export async function fetchSocialProof(epoch: Epoch): Promise<SocialProofStats> {
  // Currently using mock data
  // TODO: Replace with real API call when backend is ready
  return getRewardsSocialProof(epoch);
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
