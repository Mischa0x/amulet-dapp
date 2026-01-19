/**
 * LeaderboardTable Component - Collapsible Design
 *
 * Shows top 5 wallets by default with expand button for full list.
 * Inspired by BitVault referrals leaderboard.
 */

import { useState, useMemo } from 'react';
import { getUserBadge, getBadgeColor } from '../../lib/rewards/api';
import styles from './LeaderboardTable.module.css';

const EPOCH_DAYS = {
  '24h': 1,
  '7d': 7,
  '30d': 30,
  'all': 90,
};

const INITIAL_ROWS = 5;

export default function LeaderboardTable({
  entries,
  connectedWallet,
  epoch,
  isLoading = false,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
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

  const displayedEntries = isExpanded ? filteredEntries : filteredEntries.slice(0, INITIAL_ROWS);

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  const epochDays = EPOCH_DAYS[epoch] || 30;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>Leaderboard</h2>
          <span className={styles.subtitle}>Top 50</span>
        </div>
        {isExpanded && (
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search..."
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
        )}
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thRank}>#</th>
              <th className={styles.thWallet}>Wallet</th>
              <th className={styles.thCompute}>Points</th>
              <th className={styles.thQueries}>Refs</th>
              <th className={styles.thStatus}>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedEntries.map((entry) => {
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
                    {entry.rank <= 3 ? (
                      <span className={styles.medal}>
                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                      </span>
                    ) : (
                      <span className={styles.rankNum}>{entry.rank}</span>
                    )}
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
                    {(entry.totalPoints || entry.totalComputeUsed).toLocaleString()}
                  </td>
                  <td className={styles.tdQueries}>
                    {(entry.referralCount || 0).toLocaleString()}
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
        {displayedEntries.map((entry) => {
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
                    {(entry.totalPoints || entry.totalComputeUsed).toLocaleString()}
                  </span>
                  <span className={styles.mobileStatLabel}>Points</span>
                </div>
                <div className={styles.mobileStat}>
                  <span className={styles.mobileStatValue}>
                    {(entry.referralCount || 0).toLocaleString()}
                  </span>
                  <span className={styles.mobileStatLabel}>Refs</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand/Collapse Button */}
      {filteredEntries.length > INITIAL_ROWS && (
        <button
          className={styles.expandButton}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              Collapse
              <svg className={styles.expandIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              View Full Leaderboard ({filteredEntries.length})
              <svg className={styles.expandIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      )}

      {filteredEntries.length === 0 && searchQuery && (
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
        <div className={`${styles.skeleton}`} style={{ width: 150, height: 24 }} />
      </div>
      <div className={styles.skeletonRows}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={styles.skeletonRow}>
            <div className={`${styles.skeleton}`} style={{ width: 30, height: 20 }} />
            <div className={`${styles.skeleton}`} style={{ flex: 1, height: 20 }} />
            <div className={`${styles.skeleton}`} style={{ width: 60, height: 20 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
