/**
 * LeaderboardTable Component
 *
 * Displays the top 50 wallets with their stats.
 * Responsive design: table on desktop, cards on mobile.
 */

import { useState, useMemo } from 'react';
import { getUserBadge, getBadgeColor } from '../../lib/rewards/api';
import styles from './LeaderboardTable.module.css';

// Epoch days for badge calculation
const EPOCH_DAYS = {
  '24h': 1,
  '7d': 7,
  '30d': 30,
  'all': 90,
};

export default function LeaderboardTable({
  entries,
  connectedWallet,
  epoch,
  isLoading = false,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const query = searchQuery.toLowerCase();
    return entries.filter(
      (e) =>
        e.wallet.toLowerCase().includes(query) ||
        (e.ens && e.ens.toLowerCase().includes(query))
    );
  }, [entries, searchQuery]);

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  const epochDays = EPOCH_DAYS[epoch] || 30;

  return (
    <div className={styles.container}>
      {/* Header with search */}
      <div className={styles.header}>
        <h2 className={styles.title}>Top 50 Leaderboard</h2>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search wallet or ENS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              className={styles.clearButton}
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thRank}>Rank</th>
              <th className={styles.thWallet}>Wallet</th>
              <th className={styles.thCompute}>Compute</th>
              <th className={styles.thQueries}>Queries</th>
              <th className={styles.thActive}>Active Days</th>
              <th className={styles.thStatus}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => {
              const isUser = connectedWallet &&
                entry.wallet.toLowerCase() === connectedWallet.toLowerCase();
              const badge = getUserBadge(
                entry.rank,
                entry.activeDays,
                entry.totalComputeUsed,
                epochDays
              );
              const badgeColor = getBadgeColor(badge);

              return (
                <tr
                  key={entry.wallet}
                  className={`${styles.row} ${isUser ? styles.userRow : ''}`}
                >
                  <td className={styles.tdRank}>
                    <span className={styles.rankBadge}>
                      {entry.rank <= 3 ? (
                        <span className={styles.medal}>
                          {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                        </span>
                      ) : (
                        entry.rank
                      )}
                    </span>
                  </td>
                  <td className={styles.tdWallet}>
                    <div className={styles.walletCell}>
                      {entry.ens ? (
                        <span className={styles.ens}>{entry.ens}</span>
                      ) : (
                        <span className={styles.address}>
                          {truncateAddress(entry.wallet)}
                        </span>
                      )}
                      {isUser && <span className={styles.youTag}>You</span>}
                    </div>
                  </td>
                  <td className={styles.tdCompute}>
                    {entry.totalComputeUsed.toLocaleString()}
                  </td>
                  <td className={styles.tdQueries}>
                    {entry.queriesRun.toLocaleString()}
                  </td>
                  <td className={styles.tdActive}>
                    {entry.activeDays}
                    {entry.streakDays > 0 && (
                      <span className={styles.streak}>
                        🔥{entry.streakDays}
                      </span>
                    )}
                  </td>
                  <td className={styles.tdStatus}>
                    <span className={`${styles.statusBadge} ${styles[badgeColor]}`}>
                      {badge}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className={styles.mobileCards}>
        {filteredEntries.map((entry) => {
          const isUser = connectedWallet &&
            entry.wallet.toLowerCase() === connectedWallet.toLowerCase();
          const badge = getUserBadge(
            entry.rank,
            entry.activeDays,
            entry.totalComputeUsed,
            epochDays
          );
          const badgeColor = getBadgeColor(badge);

          return (
            <div
              key={entry.wallet}
              className={`${styles.mobileCard} ${isUser ? styles.userCard : ''}`}
            >
              <div className={styles.mobileCardHeader}>
                <div className={styles.mobileRank}>
                  {entry.rank <= 3 ? (
                    <span className={styles.medal}>
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                    </span>
                  ) : (
                    <span className={styles.mobileRankNum}>#{entry.rank}</span>
                  )}
                </div>
                <div className={styles.mobileWallet}>
                  {entry.ens ? (
                    <span className={styles.ens}>{entry.ens}</span>
                  ) : (
                    <span className={styles.address}>
                      {truncateAddress(entry.wallet)}
                    </span>
                  )}
                  {isUser && <span className={styles.youTag}>You</span>}
                </div>
                <span className={`${styles.statusBadge} ${styles[badgeColor]}`}>
                  {badge}
                </span>
              </div>
              <div className={styles.mobileCardStats}>
                <div className={styles.mobileStat}>
                  <span className={styles.mobileStatValue}>
                    {entry.totalComputeUsed.toLocaleString()}
                  </span>
                  <span className={styles.mobileStatLabel}>Compute</span>
                </div>
                <div className={styles.mobileStat}>
                  <span className={styles.mobileStatValue}>
                    {entry.queriesRun.toLocaleString()}
                  </span>
                  <span className={styles.mobileStatLabel}>Queries</span>
                </div>
                <div className={styles.mobileStat}>
                  <span className={styles.mobileStatValue}>
                    {entry.activeDays}
                    {entry.streakDays > 0 && (
                      <span className={styles.streakSmall}>🔥{entry.streakDays}</span>
                    )}
                  </span>
                  <span className={styles.mobileStatLabel}>Active</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEntries.length === 0 && (
        <div className={styles.noResults}>
          No wallets found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}

function truncateAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function LeaderboardSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={`${styles.skeleton}`} style={{ width: 200, height: 28 }} />
        <div className={`${styles.skeleton}`} style={{ width: 200, height: 40 }} />
      </div>
      <div className={styles.skeletonRows}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={styles.skeletonRow}>
            <div className={`${styles.skeleton}`} style={{ width: 40, height: 24 }} />
            <div className={`${styles.skeleton}`} style={{ flex: 1, height: 24 }} />
            <div className={`${styles.skeleton}`} style={{ width: 80, height: 24 }} />
            <div className={`${styles.skeleton}`} style={{ width: 60, height: 24 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
