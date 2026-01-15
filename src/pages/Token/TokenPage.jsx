// pages/Token/TokenPage.jsx
import { useState } from 'react';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import styles from './TokenPage.module.css';
import GhostBackground from '../../components/GhostBackground/GhostBackground';

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
  const [activeTab, setActiveTab] = useState('overview');

  // Get native SEI balance
  const { data: seiBalance } = useBalance({
    address,
  });

  // Get AMULET token balance
  const { data: amuletBalance } = useReadContract({
    address: AMULET_CONTRACT,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
  });

  const formattedAmulet = amuletBalance
    ? parseFloat(formatUnits(amuletBalance, 18)).toFixed(2)
    : '0.00';

  // Compute credit tiers
  const creditTiers = [
    { name: 'Explorer', credits: 100, amulet: 10, color: 'var(--brand-green-default)' },
    { name: 'Pioneer', credits: 500, amulet: 45, color: 'var(--brand-blue-default)' },
    { name: 'Visionary', credits: 2000, amulet: 160, color: 'var(--brand-purple-default)' },
    { name: 'Immortal', credits: 10000, amulet: 700, color: 'var(--brand-gold, #D4AF37)' },
  ];

  // Usage examples
  const usageExamples = [
    { action: 'AI Consultation', credits: 5, description: 'Ask Dr. Alex any longevity question' },
    { action: 'Personalized Plan', credits: 25, description: 'Generate a custom longevity protocol' },
    { action: 'Lab Analysis', credits: 50, description: 'Upload and analyze blood work results' },
    { action: 'Supplement Review', credits: 10, description: 'Get AI recommendations on your stack' },
    { action: 'Research Summary', credits: 15, description: 'Summarize latest longevity papers' },
    { action: 'Treatment Comparison', credits: 20, description: 'Compare treatment options side-by-side' },
  ];

  return (
    <div className={styles.tokenPageContainer}>
      <GhostBackground />

      <div className={styles.tokenContent}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Compute Credits</h1>
          <p className={styles.subtitle}>
            Power your longevity journey with AMULET tokens
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabNav}>
          <button
            className={`${styles.tab} ${activeTab === 'overview' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'pricing' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('pricing')}
          >
            Pricing
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'usage' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('usage')}
          >
            Usage
          </button>
        </div>

        {/* Wallet Balance Card */}
        {isConnected && (
          <div className={styles.balanceCard}>
            <div className={styles.balanceRow}>
              <div className={styles.balanceItem}>
                <span className={styles.balanceLabel}>AMULET Balance</span>
                <span className={styles.balanceValue}>{formattedAmulet}</span>
              </div>
              <div className={styles.balanceItem}>
                <span className={styles.balanceLabel}>SEI Balance</span>
                <span className={styles.balanceValue}>
                  {seiBalance ? parseFloat(seiBalance.formatted).toFixed(4) : '0.0000'}
                </span>
              </div>
              <div className={styles.balanceItem}>
                <span className={styles.balanceLabel}>Available Credits</span>
                <span className={styles.balanceValueCredits}>
                  {Math.floor(parseFloat(formattedAmulet) * 10)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className={styles.section}>
            <div className={styles.overviewGrid}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <img src="/assets/infinite-ouline-blue.svg" alt="Token" className={styles.iconImg} />
                </div>
                <h3 className={styles.infoTitle}>What are Compute Credits?</h3>
                <p className={styles.infoText}>
                  Compute credits are the fuel that powers Amulet.ai. Each interaction with
                  our AI assistant Dr. Alex consumes credits based on complexity. Hold AMULET
                  tokens to access credits at preferential rates.
                </p>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <span className={styles.iconEmoji}>&#x26A1;</span>
                </div>
                <h3 className={styles.infoTitle}>How It Works</h3>
                <p className={styles.infoText}>
                  1. Acquire AMULET tokens via DEX or faucet<br />
                  2. Convert tokens to compute credits<br />
                  3. Use credits to interact with Amulet.ai<br />
                  4. Earn bonus credits through referrals
                </p>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <span className={styles.iconEmoji}>&#x1F512;</span>
                </div>
                <h3 className={styles.infoTitle}>Token Utility</h3>
                <p className={styles.infoText}>
                  AMULET tokens unlock premium features, governance voting, and exclusive
                  access to advanced longevity protocols. Stakers receive credit multipliers
                  and early access to new features.
                </p>
              </div>
            </div>

            <div className={styles.tokenomicsCard}>
              <h3 className={styles.tokenomicsTitle}>Token Economics</h3>
              <div className={styles.tokenomicsGrid}>
                <div className={styles.tokenomicsStat}>
                  <span className={styles.statValue}>1 AMULET</span>
                  <span className={styles.statLabel}>= 10 Credits</span>
                </div>
                <div className={styles.tokenomicsStat}>
                  <span className={styles.statValue}>1.5x</span>
                  <span className={styles.statLabel}>Staker Bonus</span>
                </div>
                <div className={styles.tokenomicsStat}>
                  <span className={styles.statValue}>5%</span>
                  <span className={styles.statLabel}>Referral Reward</span>
                </div>
                <div className={styles.tokenomicsStat}>
                  <span className={styles.statValue}>100M</span>
                  <span className={styles.statLabel}>Max Supply</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Credit Packages</h2>
            <div className={styles.tiersGrid}>
              {creditTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={styles.tierCard}
                  style={{ '--tier-color': tier.color }}
                >
                  <div className={styles.tierHeader}>
                    <h3 className={styles.tierName}>{tier.name}</h3>
                    <span className={styles.tierBadge}>{tier.credits} Credits</span>
                  </div>
                  <div className={styles.tierPrice}>
                    <span className={styles.priceValue}>{tier.amulet}</span>
                    <span className={styles.priceUnit}>AMULET</span>
                  </div>
                  <div className={styles.tierRate}>
                    {(tier.credits / tier.amulet).toFixed(1)} credits per AMULET
                  </div>
                  <button className={styles.tierButton}>
                    Purchase
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.bonusCard}>
              <h3 className={styles.bonusTitle}>Staking Bonuses</h3>
              <p className={styles.bonusText}>
                Stake your AMULET tokens to unlock credit multipliers
              </p>
              <div className={styles.bonusGrid}>
                <div className={styles.bonusItem}>
                  <span className={styles.bonusStake}>100+ AMULET</span>
                  <span className={styles.bonusMultiplier}>1.1x Credits</span>
                </div>
                <div className={styles.bonusItem}>
                  <span className={styles.bonusStake}>500+ AMULET</span>
                  <span className={styles.bonusMultiplier}>1.25x Credits</span>
                </div>
                <div className={styles.bonusItem}>
                  <span className={styles.bonusStake}>1000+ AMULET</span>
                  <span className={styles.bonusMultiplier}>1.5x Credits</span>
                </div>
                <div className={styles.bonusItem}>
                  <span className={styles.bonusStake}>5000+ AMULET</span>
                  <span className={styles.bonusMultiplier}>2x Credits</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Usage Tab */}
        {activeTab === 'usage' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Credit Usage Guide</h2>
            <div className={styles.usageGrid}>
              {usageExamples.map((example) => (
                <div key={example.action} className={styles.usageCard}>
                  <div className={styles.usageHeader}>
                    <h4 className={styles.usageAction}>{example.action}</h4>
                    <span className={styles.usageCredits}>{example.credits} credits</span>
                  </div>
                  <p className={styles.usageDescription}>{example.description}</p>
                </div>
              ))}
            </div>

            <div className={styles.faqCard}>
              <h3 className={styles.faqTitle}>Frequently Asked Questions</h3>
              <div className={styles.faqList}>
                <div className={styles.faqItem}>
                  <h4 className={styles.faqQuestion}>Do credits expire?</h4>
                  <p className={styles.faqAnswer}>
                    No, credits never expire. Once converted from AMULET tokens,
                    they remain in your account indefinitely.
                  </p>
                </div>
                <div className={styles.faqItem}>
                  <h4 className={styles.faqQuestion}>Can I convert credits back to tokens?</h4>
                  <p className={styles.faqAnswer}>
                    Credits are a one-way conversion. However, you can earn new tokens
                    through referrals and community activities.
                  </p>
                </div>
                <div className={styles.faqItem}>
                  <h4 className={styles.faqQuestion}>What happens if I run out of credits?</h4>
                  <p className={styles.faqAnswer}>
                    You can still browse products and view your history. AI interactions
                    require credits, but you can always purchase more.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className={styles.ctaSection}>
          <h3 className={styles.ctaTitle}>Ready to start your longevity journey?</h3>
          <p className={styles.ctaText}>
            Get testnet AMULET tokens from the faucet and start exploring Amulet.ai today.
          </p>
          <div className={styles.ctaButtons}>
            <a
              href="https://atlantic-2.app.sei.io/faucet"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaButtonPrimary}
            >
              Get Testnet SEI
            </a>
            <button className={styles.ctaButtonSecondary}>
              Claim AMULET Faucet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenPage;
