/**
 * RewardsPage Component
 *
 * Main rewards dashboard page displaying the competitive leaderboard
 * and personal usage statistics for DrPepe.ai compute credits.
 *
 * Design references:
 * - Coinbase: Dark financial dashboard, big numbers, segmented time controls
 * - Apple Screen Time: Large metrics, comparison percentages, stacked cards
 * - Fitness apps: Progress rings, rewards framing, share affordance
 */

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useAccount } from 'wagmi';
import {
  EpochTabs,
  PersonalSummaryCard,
  LeaderboardTable,
  RewardsInfoAccordion,
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

  // Share handler (future: generate shareable image/link)
  const handleShare = () => {
    if (navigator.share && personalStats) {
      navigator.share({
        title: 'My Amulet Rewards',
        text: `I'm ranked #${personalStats.rank || 'Unranked'} with ${personalStats.totalComputeUsed.toLocaleString()} compute credits on Amulet.ai!`,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Page Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Rewards</h1>
          <button className={styles.shareButton} onClick={handleShare}>
            <svg className={styles.shareIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Share
          </button>
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

        {/* (A) Personal Summary Card */}
        <PersonalSummaryCard
          stats={personalStats}
          epoch={epoch}
          isLoading={isLoading}
        />

        {/* (B) Epoch Tabs - Sticky */}
        <EpochTabs
          value={epoch}
          onChange={handleEpochChange}
          isLoading={isPending}
        />

        {/* (C) Top 50 Leaderboard */}
        <LeaderboardTable
          entries={leaderboard}
          connectedWallet={isConnected ? address : null}
          epoch={epoch}
          isLoading={isLoading}
        />

        {/* (D) How Rewards Work */}
        <RewardsInfoAccordion />

        {/* (E) Social Proof Strip */}
        <SocialProofStrip
          stats={socialProof}
          epoch={epoch}
          isLoading={isLoading}
        />

        {/* Demo Mode Notice */}
        {!isConnected && (
          <div className={styles.demoNotice}>
            <span className={styles.demoIcon}>👀</span>
            <span className={styles.demoText}>
              Viewing demo data. Connect your wallet to see your real stats.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
