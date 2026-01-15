// pages/Token/TokenPage.jsx
import { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import styles from './TokenPage.module.css';

// AMULET Token contract on Sei Testnet
const AMULET_CONTRACT = '0xe8564273D6346Db0Ff54d3a6CCb1Dd12993A042c';

// ERC20 ABI for balanceOf
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
];

function TokenPage() {
  const { address, isConnected } = useAccount();
  const [claimingFaucet, setClaimingFaucet] = useState(false);

  // Get AMULET token balance
  const { data: amuletBalance, refetch: refetchBalance } = useReadContract({
    address: AMULET_CONTRACT,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
  });

  const formattedAmulet = amuletBalance
    ? parseFloat(formatUnits(amuletBalance, 18)).toFixed(2)
    : '0.00';

  const availableCredits = Math.floor(parseFloat(formattedAmulet) * 10);
  const totalCreditsUsed = 127;

  const handleClaimFaucet = async () => {
    setClaimingFaucet(true);
    setTimeout(() => {
      setClaimingFaucet(false);
      refetchBalance();
    }, 2000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Stats Row - Like Debank */}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>AMULET Balance</span>
            <span className={styles.statValue}>{formattedAmulet}</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.statItem}>
            <span className={styles.statLabel}>Available Credits</span>
            <span className={styles.statValue}>{availableCredits}</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.statItem}>
            <span className={styles.statLabel}>Credits Used</span>
            <span className={styles.statValue}>{totalCreditsUsed}</span>
          </div>
        </div>

        {/* Cards Grid - Like Claude Console */}
        <div className={styles.cardsGrid}>
          {/* Faucet Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>AMULET Faucet</span>
            </div>
            <p className={styles.cardDesc}>
              Claim free testnet tokens to start using Amulet.ai
            </p>
            <button
              className={styles.claimButton}
              onClick={handleClaimFaucet}
              disabled={claimingFaucet || !isConnected}
            >
              {claimingFaucet ? 'Claiming...' : 'Claim Tokens'}
            </button>
          </div>

          {/* Conversion Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Conversion Rate</span>
            </div>
            <div className={styles.conversionRow}>
              <div className={styles.conversionItem}>
                <span className={styles.conversionLabel}>You hold</span>
                <span className={styles.conversionValue}>{formattedAmulet} AMULET</span>
              </div>
              <span className={styles.conversionArrow}>→</span>
              <div className={styles.conversionItem}>
                <span className={styles.conversionLabel}>Worth</span>
                <span className={styles.conversionValue}>{availableCredits} credits</span>
              </div>
            </div>
            <p className={styles.cardDescSmall}>1 AMULET = 10 compute credits</p>
          </div>

          {/* Info Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>What are Compute Credits?</span>
            </div>
            <p className={styles.cardDesc}>
              Compute credits are the fuel that powers Amulet.ai. Each interaction
              with the AI assistant consumes credits based on complexity. Hold AMULET
              tokens to access credits at preferential rates.
            </p>
          </div>
        </div>

        {/* SEI Faucet Link */}
        <div className={styles.footer}>
          <span className={styles.footerText}>Need testnet SEI for gas?</span>
          <a
            href="https://atlantic-2.app.sei.io/faucet"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Get Testnet SEI →
          </a>
        </div>
      </div>
    </div>
  );
}

export default TokenPage;
