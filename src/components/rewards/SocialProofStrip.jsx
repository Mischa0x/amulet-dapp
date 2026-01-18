/**
 * SocialProofStrip Component
 *
 * Displays platform-wide statistics for social proof.
 */

import styles from './SocialProofStrip.module.css';

export default function SocialProofStrip({ stats, epoch, isLoading = false }) {
  if (isLoading) {
    return (
      <div className={styles.container}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.stat}>
            <div className={`${styles.skeleton}`} style={{ width: 60, height: 28 }} />
            <div className={`${styles.skeleton}`} style={{ width: 80, height: 14, marginTop: 6 }} />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const epochLabels = {
    '24h': 'in the last 24 hours',
    '7d': 'this week',
    '30d': 'this month',
    'all': 'all time',
  };

  return (
    <div className={styles.container}>
      <div className={styles.stat}>
        <span className={styles.value}>{stats.activeWallets.toLocaleString()}</span>
        <span className={styles.label}>Active Wallets</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={styles.value}>{formatNumber(stats.totalCompute)}</span>
        <span className={styles.label}>Total Compute</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={styles.value}>{formatNumber(stats.totalQueries)}</span>
        <span className={styles.label}>Queries Run</span>
      </div>
    </div>
  );
}

function formatNumber(num) {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}
