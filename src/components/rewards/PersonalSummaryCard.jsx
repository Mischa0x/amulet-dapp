/**
 * PersonalSummaryCard Component
 *
 * Displays the connected user's personal stats with a progress ring.
 * Apple Fitness-inspired design with large numbers.
 */

import ProgressRing from './ProgressRing';
import styles from './PersonalSummaryCard.module.css';

export default function PersonalSummaryCard({ stats, epoch, isLoading = false }) {
  if (isLoading) {
    return <PersonalSummaryCardSkeleton />;
  }

  if (!stats) {
    return (
      <div className={styles.card}>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>👤</span>
          <span className={styles.emptyText}>Connect wallet to see your stats</span>
        </div>
      </div>
    );
  }

  const {
    rank,
    totalComputeUsed,
    queriesRun,
    activeDays,
    streakDays,
    top50ThresholdCompute,
    percentile,
  } = stats;

  const progress = top50ThresholdCompute > 0
    ? totalComputeUsed / top50ThresholdCompute
    : 0;

  const isRanked = rank !== undefined;

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        {/* Left side - Stats */}
        <div className={styles.statsSection}>
          {/* Rank */}
          <div className={styles.rankBlock}>
            <span className={styles.rankLabel}>Your Rank</span>
            <span className={styles.rankValue}>
              {isRanked ? (
                <>
                  <span className={styles.hash}>#</span>
                  {rank}
                  {rank <= 3 && (
                    <span className={styles.medal}>
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                    </span>
                  )}
                </>
              ) : (
                <span className={styles.unranked}>Unranked</span>
              )}
            </span>
          </div>

          {/* Main stat - Compute Used */}
          <div className={styles.mainStat}>
            <span className={styles.mainValue}>
              {totalComputeUsed.toLocaleString()}
            </span>
            <span className={styles.mainLabel}>Compute Used</span>
          </div>

          {/* Secondary stats row */}
          <div className={styles.secondaryStats}>
            <div className={styles.secondaryStat}>
              <span className={styles.secondaryValue}>{queriesRun.toLocaleString()}</span>
              <span className={styles.secondaryLabel}>Queries</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.secondaryStat}>
              <span className={styles.secondaryValue}>{activeDays}</span>
              <span className={styles.secondaryLabel}>Active Days</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.secondaryStat}>
              <span className={styles.secondaryValue}>
                <span className={styles.fireEmoji}>🔥</span>
                {streakDays}
              </span>
              <span className={styles.secondaryLabel}>Streak</span>
            </div>
          </div>

          {/* Percentile line */}
          <div className={styles.percentileLine}>
            You're ahead of <strong>~{percentile}%</strong> of users
          </div>
        </div>

        {/* Right side - Progress Ring */}
        <div className={styles.ringSection}>
          <ProgressRing
            progress={progress}
            size={140}
            strokeWidth={10}
            label="Top-50 Threshold"
          />
        </div>
      </div>
    </div>
  );
}

function PersonalSummaryCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.statsSection}>
          <div className={styles.skeleton} style={{ width: 100, height: 20 }} />
          <div className={styles.skeleton} style={{ width: 80, height: 48, marginTop: 8 }} />
          <div className={styles.skeleton} style={{ width: 160, height: 56, marginTop: 24 }} />
          <div className={styles.skeleton} style={{ width: '100%', height: 40, marginTop: 16 }} />
          <div className={styles.skeleton} style={{ width: 180, height: 16, marginTop: 16 }} />
        </div>
        <div className={styles.ringSection}>
          <div className={`${styles.skeleton} ${styles.skeletonRing}`} />
        </div>
      </div>
    </div>
  );
}
