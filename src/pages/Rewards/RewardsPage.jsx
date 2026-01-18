/**
 * RewardsPage Component - Compact Dashboard
 *
 * Redesigned to be more compact like BitVault referrals page.
 * All content fits on one screen with collapsible leaderboard.
 */

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useAccount } from 'wagmi';
import {
  EpochTabs,
  PersonalSummaryCard,
  LeaderboardTable,
  SocialProofStrip,
} from '../../components/rewards';
import {
  fetchLeaderboard,
  fetchPersonalStats,
  fetchSocialProof,
  DEMO_WALLET,
} from '../../lib/rewards/api';
import styles from './RewardsPage.module.css';

export default function RewardsPage() {
  const { address, isConnected } = useAccount();
  const [isPending, startTransition] = useTransition();

  // State
  const [epoch, setEpoch] = useState('30d');
  const [leaderboard, setLeaderboard] = useState([]);
  const [personalStats, setPersonalStats] = useState(null);
  const [socialProof, setSocialProof] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use connected wallet or demo wallet for preview
  const activeWallet = isConnected && address ? address : DEMO_WALLET;

  // Fetch all data for an epoch
  const fetchAllData = useCallback(async (selectedEpoch) => {
    try {
      setError(null);

      const [leaderboardData, personalData, socialData] = await Promise.all([
        fetchLeaderboard(selectedEpoch),
        fetchPersonalStats(selectedEpoch, activeWallet),
        fetchSocialProof(selectedEpoch),
      ]);

      setLeaderboard(leaderboardData);
      setPersonalStats(personalData);
      setSocialProof(socialData);
    } catch (err) {
      console.error('Failed to fetch rewards data:', err);
      setError('Failed to load rewards data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [activeWallet]);

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    fetchAllData(epoch);
  }, [epoch, fetchAllData]);

  // Handle epoch change with transition
  const handleEpochChange = (newEpoch) => {
    startTransition(() => {
      setEpoch(newEpoch);
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header Row */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Rewards</h1>
            {!isConnected && (
              <span className={styles.demoTag}>Demo</span>
            )}
          </div>
          <EpochTabs
            value={epoch}
            onChange={handleEpochChange}
            isLoading={isPending}
          />
        </header>

        {/* Error State */}
        {error && (
          <div className={styles.errorBanner}>
            {error}
            <button
              className={styles.retryButton}
              onClick={() => fetchAllData(epoch)}
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <PersonalSummaryCard
          stats={personalStats}
          epoch={epoch}
          isLoading={isLoading}
        />

        {/* Social Proof */}
        <SocialProofStrip
          stats={socialProof}
          epoch={epoch}
          isLoading={isLoading}
        />

        {/* Leaderboard */}
        <LeaderboardTable
          entries={leaderboard}
          connectedWallet={isConnected ? address : null}
          epoch={epoch}
          isLoading={isLoading}
        />

        {/* How It Works - Inline */}
        <div className={styles.infoCard}>
          <div className={styles.infoTitle}>How Rewards Work</div>
          <div className={styles.infoText}>
            Earn compute credits by using the AI assistant. Your rank is determined by total credits used.
            Top performers get recognized on the leaderboard. Credits reset each epoch period.
          </div>
        </div>
      </div>
    </div>
  );
}
