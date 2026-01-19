/**
 * Rewards Dashboard Types
 *
 * This module defines the data models for the competitive rewards leaderboard.
 * The leaderboard tracks compute credit usage to gamify engagement with DrPepe.ai.
 */

export type Epoch = "24h" | "7d" | "30d" | "all";

export type LeaderboardEntry = {
  wallet: string;
  ens?: string;
  totalComputeUsed: number;
  referralPoints: number;        // points from referrals
  referralCount: number;         // number of people referred
  totalPoints: number;           // compute + referrals
  queriesRun: number;
  activeDays: number;            // for selected epoch
  streakDays: number;            // for selected epoch
  rank: number;
};

export type PersonalStats = {
  wallet: string;
  rank?: number;                 // undefined if not in top 50
  totalComputeUsed: number;
  referralPoints: number;        // points from referrals
  referralCount: number;         // number of people referred
  totalPoints: number;           // compute + referrals
  queriesRun: number;
  activeDays: number;
  streakDays: number;
  top50ThresholdPoints: number;  // points used by rank #50
  percentile: number;            // 0-100 mock percentile vs all users
};

export type SocialProofStats = {
  activeWallets: number;
  totalCompute: number;
  totalQueries: number;
};

export type UserBadge =
  | "Top 10%"
  | "Power User"
  | "Heavy Compute"
  | "Active"
  | "New";

/**
 * Anti-Gaming Considerations
 * -------------------------
 * When implementing real endpoints, consider the following anti-gaming measures:
 *
 * 1. STREAK WEIGHTING:
 *    - Weight streaks based on consistent daily usage, not just consecutive logins
 *    - Require minimum compute per day to count as "active"
 *    - Cap streak bonus impact to prevent manipulation
 *
 * 2. QUERY SPAM CAPS:
 *    - Rate limit queries per wallet per hour (e.g., max 100/hour)
 *    - Implement cooldowns between rapid-fire queries
 *    - Flag accounts with > 95% basic queries (likely spam)
 *    - Require minimum query complexity variance
 *
 * 3. BURST DETECTION:
 *    - Flag unusual compute spikes (> 10x normal usage)
 *    - Implement sliding window analysis for usage patterns
 *    - Compare against wallet historical average
 *    - Delay leaderboard updates by 5-10 minutes to allow fraud detection
 *
 * 4. SYBIL RESISTANCE:
 *    - Track wallet age and activity patterns
 *    - Consider requiring minimum token holdings or staking
 *    - Implement wallet clustering detection
 *    - Weight rewards toward consistent long-term users
 *
 * 5. ECONOMIC CONSIDERATIONS:
 *    - Ensure reward value doesn't exceed compute cost
 *    - Implement diminishing returns for extreme usage
 *    - Consider tiered rewards that favor quality over quantity
 */
