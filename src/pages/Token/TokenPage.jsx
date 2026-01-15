// pages/Token/TokenPage.jsx
import { useState } from 'react';
import { useAccount, useBalance, useReadContract, useWriteContract } from 'wagmi';
import { formatUnits, parseEther } from 'viem';
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

  // Mock total credits used (in real app, this would come from backend)
  const totalCreditsUsed = 127;

  // Calculate progress percentage for the bar
  const maxCredits = 1000;
  const progressPercent = Math.min((availableCredits / maxCredits) * 100, 100);

  const handleClaimFaucet = async () => {
    setClaimingFaucet(true);
    // Simulate faucet claim - in real implementation this would call a faucet contract
    setTimeout(() => {
      setClaimingFaucet(false);
      refetchBalance();
    }, 2000);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Gradient Background */}
      <div className={styles.gradientBg} />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Compute Credits</h1>
          <p className={styles.subtitle}>
            Power your longevity journey with AMULET tokens
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className={styles.statsGrid}>
          {/* Amulet Balance Card */}
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <img src="/assets/infinite-outline-gold.svg" alt="" />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>AMULET Balance</span>
              <span className={styles.statValue}>{formattedAmulet}</span>
            </div>
            <div className={styles.statProgress}>
              <div
                className={styles.statProgressBar}
                style={{ width: `${Math.min(parseFloat(formattedAmulet) / 100 * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Available Credits Card */}
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 10V3L4 14H11V21L20 10H13Z" fill="#22C55E"/>
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Available Credits</span>
              <span className={styles.statValueGreen}>{availableCredits}</span>
            </div>
            <div className={styles.statProgress}>
              <div
                className={styles.statProgressBarGreen}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Total Credits Used Card */}
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#8B5CF6"/>
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Total Credits Used</span>
              <span className={styles.statValuePurple}>{totalCreditsUsed}</span>
            </div>
            <div className={styles.statProgress}>
              <div
                className={styles.statProgressBarPurple}
                style={{ width: `${(totalCreditsUsed / 500) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Faucet Card */}
        <div className={styles.faucetCard}>
          <div className={styles.faucetContent}>
            <div className={styles.faucetIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C7.03 3 3 7.03 3 12C3 14.76 4.23 17.23 6.18 18.88L7.63 17.43C6.03 16.12 5 14.18 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 14.18 17.97 16.12 16.37 17.43L17.82 18.88C19.77 17.23 21 14.76 21 12C21 7.03 16.97 3 12 3ZM12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z" fill="white"/>
                <path d="M12 21L8 17H16L12 21Z" fill="white"/>
              </svg>
            </div>
            <div className={styles.faucetText}>
              <h3 className={styles.faucetTitle}>AMULET Faucet</h3>
              <p className={styles.faucetDesc}>Claim free testnet AMULET tokens to start using Amulet.ai</p>
            </div>
          </div>
          <button
            className={styles.faucetButton}
            onClick={handleClaimFaucet}
            disabled={claimingFaucet || !isConnected}
          >
            {claimingFaucet ? 'Claiming...' : 'Claim Tokens'}
          </button>
        </div>

        {/* Info Section */}
        <div className={styles.infoGrid}>
          {/* What are Compute Credits */}
          <div className={styles.infoCard}>
            <div className={styles.infoHeader}>
              <div className={styles.infoIconSmall}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="#1D7AFC"/>
                </svg>
              </div>
              <h3 className={styles.infoTitle}>What are Compute Credits?</h3>
            </div>
            <p className={styles.infoText}>
              Compute credits are the fuel that powers Amulet.ai. Each interaction with
              the AI assistant consumes credits based on complexity. Hold AMULET
              tokens to access credits at preferential rates.
            </p>
          </div>

          {/* Conversion Rate */}
          <div className={styles.infoCard}>
            <div className={styles.infoHeader}>
              <div className={styles.infoIconSmall}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 8L15 12H18C18 15.31 15.31 18 12 18C10.99 18 10.03 17.75 9.2 17.3L7.74 18.76C8.97 19.54 10.43 20 12 20C16.42 20 20 16.42 20 12H23L19 8ZM6 12C6 8.69 8.69 6 12 6C13.01 6 13.97 6.25 14.8 6.7L16.26 5.24C15.03 4.46 13.57 4 12 4C7.58 4 4 7.58 4 12H1L5 16L9 12H6Z" fill="#22C55E"/>
                </svg>
              </div>
              <h3 className={styles.infoTitle}>Conversion Rate</h3>
            </div>
            <div className={styles.conversionDisplay}>
              <span className={styles.conversionValue}>1 AMULET</span>
              <span className={styles.conversionEquals}>=</span>
              <span className={styles.conversionCredits}>10 Credits</span>
            </div>
          </div>
        </div>

        {/* Get SEI Link */}
        <div className={styles.seiLink}>
          <span className={styles.seiText}>Need testnet SEI for gas?</span>
          <a
            href="https://atlantic-2.app.sei.io/faucet"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.seiButton}
          >
            Get Testnet SEI
          </a>
        </div>
      </div>
    </div>
  );
}

export default TokenPage;
