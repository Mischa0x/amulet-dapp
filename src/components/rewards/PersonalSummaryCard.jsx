/**
 * PersonalSummaryCard Component
 *
 * Displays the connected user's personal stats in a dark mode card.
 * Design: Apple Screen Time + Coinbase inspired
 * - Large headline number (Compute Used)
 * - Rank badge with medal
 * - 2x2 grid of secondary stats
 * - Progress ring for top-50 threshold
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
    ? Math.min(totalComputeUsed / top50ThresholdCompute, 1.2)
    : 0;

  const isRanked = rank !== undefined;

  const getMedalEmoji = (r) => {
    if (r === 1) return '🥇';
    if (r === 2) return '🥈';
    if (r === 3) return '🥉';
    return null;
  };

  const epochLabel = {
    '24h': 'Today',
    '7d': 'This Week',
    '30d': 'This Month',
    'all': 'All Time',
  }[epoch] || 'This Month';

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        {/* Main stat row with ring */}
        <div className={styles.mainStatRow}>
          <div className={styles.mainStat}>
            <span className={styles.mainLabel}>Compute Used</span>
            <span className={styles.mainValue}>
              {totalComputeUsed.toLocaleString()}
              <span className={styles.mainUnit}>cr</span>
            </span>
          </div>
          <div className={styles.ringSection}>
            <ProgressRing
              progress={progress}
              size={100}
              strokeWidth={8}
              label="Top 50"
            />
          </div>
        </div>

        {/* Rank block */}
        <div className={styles.rankBlock}>
          <div className={`${styles.rankBadge} ${!isRanked ? styles.rankBadgeUnranked : ''}`}>
            {isRanked ? (
              getMedalEmoji(rank) ? (
                <span className={styles.medal}>{getMedalEmoji(rank)}</span>
              ) : (
                <span className={styles.rankNumber}>{rank}</span>
              )
            ) : (
              <span className={`${styles.rankNumber} ${styles.rankNumberUnranked}`}>—</span>
            )}
          </div>
          <div className={styles.rankInfo}>
            <span className={styles.rankLabel}>
              {isRanked ? `Rank #${rank} ${epochLabel}` : `Unranked ${epochLabel}`}
            </span>
            <span className={styles.percentileText}>
              Ahead of <span className={styles.percentileValue}>{percentile}%</span> of users
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statTile}>
            <span className={styles.statTileLabel}>Queries</span>
            <span className={styles.statTileValue}>{queriesRun.toLocaleString()}</span>
          </div>
          <div className={styles.statTile}>
            <span className={styles.statTileLabel}>Active Days</span>
            <span className={styles.statTileValue}>{activeDays}</span>
          </div>
          <div className={styles.statTile}>
            <span className={styles.statTileLabel}>Streak</span>
            <span className={`${styles.statTileValue} ${styles.statTileStreak}`}>
              <span className={styles.fireEmoji}>🔥</span>
              {streakDays}
            </span>
          </div>
          <div className={styles.statTile}>
            <span className={styles.statTileLabel}>Top 50 Threshold</span>
            <span className={styles.statTileValue}>{top50ThresholdCompute.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalSummaryCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.mainStatRow}>
          <div className={styles.mainStat}>
            <div className={styles.skeleton} style={{ width: 100, height: 16, marginBottom: 8 }} />
            <div className={styles.skeleton} style={{ width: 180, height: 56 }} />
          </div>
          <div className={`${styles.skeleton} ${styles.skeletonRing}`} />
        </div>
        <div className={styles.rankBlock}>
          <div className={styles.skeleton} style={{ width: 48, height: 48, borderRadius: 12 }} />
          <div style={{ flex: 1 }}>
            <div className={styles.skeleton} style={{ width: 140, height: 16, marginBottom: 6 }} />
            <div className={styles.skeleton} style={{ width: 100, height: 14 }} />
          </div>
        </div>
        <div className={styles.statsGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.statTile}>
              <div className={styles.skeleton} style={{ width: 60, height: 12, marginBottom: 8 }} />
              <div className={styles.skeleton} style={{ width: 50, height: 28 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
