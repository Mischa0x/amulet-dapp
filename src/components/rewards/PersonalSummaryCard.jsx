/**
 * PersonalSummaryCard Component - Compact Stats Grid
 *
 * Redesigned to be more compact like BitVault referrals page.
 * Uses a 4-column grid on desktop, 2-column on mobile.
 */

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
    totalComputeUsed = 0,
    referralPoints = 0,
    referralCount = 0,
    totalPoints = 0,
    queriesRun = 0,
    activeDays = 0,
    streakDays = 0,
    top50ThresholdPoints = 100,
    percentile = 0,
  } = stats;

  const isRanked = rank !== undefined && rank !== null;
  const progress = top50ThresholdPoints > 0
    ? Math.min(Math.round((totalPoints / top50ThresholdPoints) * 100), 100)
    : 0;

  const getMedalEmoji = (r) => {
    if (r === 1) return '🥇';
    if (r === 2) return '🥈';
    if (r === 3) return '🥉';
    return null;
  };

  const statsData = [
    {
      label: 'Rank',
      value: isRanked ? (getMedalEmoji(rank) || `#${rank}`) : '—',
      subValue: isRanked ? `Top ${100 - percentile}%` : 'Unranked',
      highlight: isRanked && rank <= 10,
    },
    {
      label: 'Total Points',
      value: totalPoints.toLocaleString(),
      subValue: referralPoints > 0
        ? `${totalComputeUsed} compute + ${referralPoints} referral`
        : 'from compute usage',
      highlight: true,
    },
    {
      label: 'Queries',
      value: queriesRun.toLocaleString(),
      subValue: `${activeDays} active days`,
    },
    {
      label: 'Referrals',
      value: referralCount.toLocaleString(),
      subValue: streakDays > 0 ? `🔥 ${streakDays} day streak` : '+1 pt each',
    },
  ];

  return (
    <div className={styles.statsGrid}>
      {statsData.map((stat, index) => (
        <div key={index} className={`${styles.statBox} ${stat.highlight ? styles.highlight : ''}`}>
          <div className={styles.statLabel}>{stat.label}</div>
          <div className={styles.statValue}>{stat.value}</div>
          {stat.subValue && (
            <div className={styles.statSubValue}>{stat.subValue}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function PersonalSummaryCardSkeleton() {
  return (
    <div className={styles.statsGrid}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={styles.statBox}>
          <div className={styles.skeleton} style={{ width: 50, height: 12, marginBottom: 8 }} />
          <div className={styles.skeleton} style={{ width: 70, height: 24, marginBottom: 4 }} />
          <div className={styles.skeleton} style={{ width: 60, height: 12 }} />
        </div>
      ))}
    </div>
  );
}
