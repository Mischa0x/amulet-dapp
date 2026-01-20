// pages/Token/TokenPage.jsx
import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useCredits } from '../../contexts/CreditsContext';
import styles from './TokenPage.module.css';

// AMULET Token contract address
// NOTE: Fallback is Sei Testnet address - set VITE_AMULET_TOKEN_ADDRESS in production
const AMULET_CONTRACT = import.meta.env.VITE_AMULET_TOKEN_ADDRESS || '0xe8564273D6346Db0Ff54d3a6CCb1Dd12993A042c';
// Staking contract - optional, staking UI disabled if not set
const STAKING_CONTRACT = import.meta.env.VITE_STAKING_CONTRACT_ADDRESS;

// ERC20 ABI
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
];

// Staking ABI
const STAKING_ABI = [
  {
    name: 'stake',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'getStakeInfo',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'stakedAt', type: 'uint256' },
      { name: 'creditsGranted', type: 'uint256' },
      { name: 'expiresAt', type: 'uint256' },
      { name: 'active', type: 'bool' },
    ],
  },
];

// Credit packages with volume discounts
const PACKAGES = [
  { id: 'mortal', name: 'Mortal', credits: 100, price: 5, discount: null, popular: false },
  { id: 'awakened', name: 'Awakened', credits: 500, price: 22.5, discount: 10, popular: true },
  { id: 'transcendent', name: 'Transcendent', credits: 2000, price: 80, discount: 20, popular: false },
  { id: 'immortal', name: 'Immortal', credits: 10000, price: 350, discount: 30, popular: false },
];

function TokenPage() {
  const { address, isConnected } = useAccount();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { creditData, loading, refetchCredits, setCreditData } = useCredits();

  // Check if redirected from chat due to insufficient credits
  const insufficientCredits = location.state?.insufficientCredits;
  const [claimingFree, setClaimingFree] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakingStep, setStakingStep] = useState(null); // 'approving' | 'staking'

  // Check for Stripe redirect
  const paymentSuccess = searchParams.get('success') === 'true';
  const paymentCanceled = searchParams.get('canceled') === 'true';

  // Get AMULET token balance
  const { data: amuletBalance, refetch: refetchBalance } = useReadContract({
    address: AMULET_CONTRACT,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
  });

  // Get stake info
  const { data: stakeInfo, refetch: refetchStake } = useReadContract({
    address: STAKING_CONTRACT,
    abi: STAKING_ABI,
    functionName: 'getStakeInfo',
    args: [address],
    enabled: !!address && !!STAKING_CONTRACT,
  });

  // Write contracts for staking
  const { writeContract: approve, data: approveTxHash } = useWriteContract();
  const { writeContract: stake, data: stakeTxHash } = useWriteContract();

  const { isLoading: isApproving, isSuccess: approveSuccess } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  });

  const { isLoading: isStaking, isSuccess: stakeSuccess } = useWaitForTransactionReceipt({
    hash: stakeTxHash,
  });

  const formattedAmulet = amuletBalance
    ? parseFloat(formatUnits(amuletBalance, 18)).toFixed(2)
    : '0.00';

  // Refetch credits on payment success
  useEffect(() => {
    if (paymentSuccess) {
      refetchCredits();
    }
  }, [paymentSuccess, refetchCredits]);

  // Handle approve success -> stake
  useEffect(() => {
    if (approveSuccess && stakingStep === 'approving') {
      setStakingStep('staking');
      const amountWei = parseUnits(stakeAmount, 18);
      stake({
        address: STAKING_CONTRACT,
        abi: STAKING_ABI,
        functionName: 'stake',
        args: [amountWei],
      });
    }
  }, [approveSuccess, stakingStep, stakeAmount, stake]);

  // Handle stake success
  useEffect(() => {
    if (stakeSuccess) {
      setStakingStep(null);
      setStakeAmount('');
      refetchBalance();
      refetchStake();
      // Sync credits from stake
      syncStakeCredits();
    }
  }, [stakeSuccess, refetchBalance, refetchStake]);

  const syncStakeCredits = async () => {
    try {
      await fetch('/api/credits?action=sync-stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      // Refresh credit data via context
      refetchCredits();
    } catch {
      // Silently fail - stake sync is non-critical
    }
  };

  const handleClaimFreeCredits = async () => {
    if (!address) return;
    setClaimingFree(true);
    try {
      const res = await fetch('/api/credits?action=claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      if (res.ok) {
        setCreditData(prev => ({
          ...prev,
          balance: data.newBalance,
          freeClaimedAt: Date.now(),
        }));
      } else {
        alert(data.error || 'Failed to claim credits');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setClaimingFree(false);
    }
  };

  const handlePurchase = async (packageId) => {
    if (!address) return;
    setPurchaseLoading(packageId);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId, address }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setPurchaseLoading(null);
    }
  };

  const handleStake = () => {
    if (!stakeAmount || !STAKING_CONTRACT) return;
    const amountWei = parseUnits(stakeAmount, 18);
    setStakingStep('approving');
    approve({
      address: AMULET_CONTRACT,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [STAKING_CONTRACT, amountWei],
    });
  };

  const canClaimFree = !creditData?.freeClaimedAt ||
    (Date.now() - creditData.freeClaimedAt) > 30 * 24 * 60 * 60 * 1000;

  const hasActiveStake = stakeInfo?.[4]; // active boolean
  const stakedAmount = stakeInfo?.[0] ? formatUnits(stakeInfo[0], 18) : '0';

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Insufficient Credits Banner */}
        {insufficientCredits && (
          <div className={styles.insufficientBanner}>
            You've run out of credits. Purchase more below to continue chatting with Amulette.
          </div>
        )}

        {/* Success/Cancel Messages */}
        {paymentSuccess && (
          <div className={styles.successBanner}>
            Payment successful! Your credits have been added.
          </div>
        )}
        {paymentCanceled && (
          <div className={styles.cancelBanner}>
            Payment was canceled.
          </div>
        )}

        {/* Stats Row */}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>AMULET Balance</span>
            <span className={styles.statValue}>{formattedAmulet}</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.statItem}>
            <span className={styles.statLabel}>Available Credits</span>
            <span className={styles.statValue}>
              {loading ? '...' : (creditData?.balance || 0)}
            </span>
          </div>

          <div className={styles.divider} />

          <div className={styles.statItem}>
            <span className={styles.statLabel}>Credits Used</span>
            <span className={styles.statValue}>
              {loading ? '...' : (creditData?.totalUsed || 0)}
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className={styles.cardsGrid}>
          {/* Free Credits Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Free Credits</span>
              <span className={styles.cardBadge}>40 credits</span>
            </div>
            <p className={styles.cardDesc}>
              Claim 40 free compute credits every 30 days to try Amulet.ai
            </p>
            <button
              className={styles.claimButton}
              onClick={handleClaimFreeCredits}
              disabled={claimingFree || !isConnected || !canClaimFree}
            >
              {claimingFree ? 'Claiming...' : canClaimFree ? 'Claim Free Credits' : 'Already Claimed'}
            </button>
          </div>

          {/* Staking Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Stake AMULET</span>
            </div>
            {hasActiveStake ? (
              <>
                <p className={styles.cardDesc}>
                  You have {parseFloat(stakedAmount).toFixed(2)} AMULET staked (12-month lock)
                </p>
                <div className={styles.stakedInfo}>
                  Credits earned: {stakeInfo?.[2] ? Number(stakeInfo[2]).toString() : 0}
                </div>
              </>
            ) : (
              <>
                <p className={styles.cardDesc}>
                  Stake AMULET for:
                </p>
                <div className={styles.benefitsList}>
                  <div className={styles.benefitItem}>
                    <span className={styles.benefitIcon}>✓</span>
                    <span>Significant discounts on compute credits</span>
                  </div>
                  <div className={styles.benefitItem}>
                    <span className={styles.benefitIcon}>✓</span>
                    <span>Priority access to new features</span>
                  </div>
                  <div className={styles.benefitItem}>
                    <span className={styles.benefitIcon}>✓</span>
                    <span>Future rewards and governance rights</span>
                  </div>
                  <div className={styles.benefitItem}>
                    <span className={styles.benefitIcon}>✓</span>
                    <span>Protocol IP participation</span>
                  </div>
                </div>
                <p className={styles.cardDescSmall}>
                  Full Amulet Tokenomics will be released soon
                </p>
                <div className={styles.stakeInput}>
                  <input
                    type="number"
                    placeholder="Amount to stake"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className={styles.input}
                    disabled={!STAKING_CONTRACT}
                  />
                  <button
                    className={styles.stakeButton}
                    onClick={handleStake}
                    disabled={!stakeAmount || isApproving || isStaking || !STAKING_CONTRACT}
                  >
                    {isApproving ? 'Approving...' : isStaking ? 'Staking...' : 'Stake'}
                  </button>
                </div>
                {!STAKING_CONTRACT && (
                  <p className={styles.cardDescSmall}>Staking contract not yet deployed</p>
                )}
              </>
            )}
          </div>

          {/* Info Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Credit Pricing</span>
            </div>
            <div className={styles.pricingList}>
              <div className={styles.pricingItem}>
                <div className={styles.pricingLeft}>
                  <span className={styles.pricingTier}>Basic Query</span>
                  <span className={styles.pricingDesc}>Simple questions, quick answers</span>
                </div>
                <span className={styles.pricingCost}>1 credit</span>
              </div>
              <div className={styles.pricingItem}>
                <div className={styles.pricingLeft}>
                  <span className={styles.pricingTier}>Standard Analysis</span>
                  <span className={styles.pricingDesc}>Comparisons, personalized advice</span>
                </div>
                <span className={styles.pricingCost}>3 credits</span>
              </div>
              <div className={styles.pricingItem}>
                <div className={styles.pricingLeft}>
                  <span className={styles.pricingTier}>Deep Research</span>
                  <span className={styles.pricingDesc}>Comprehensive, evidence-based analysis</span>
                </div>
                <span className={styles.pricingCost}>25 credits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Section */}
        <div className={styles.purchaseSection}>
          <h2 className={styles.sectionTitle}>Buy Credits with Card</h2>
          <div className={styles.packagesGrid}>
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`${styles.packageCard} ${pkg.popular ? styles.popular : ''}`}
              >
                {pkg.popular && <span className={styles.popularBadge}>Most Popular</span>}
                <h3 className={styles.packageName}>{pkg.name}</h3>
                <div className={styles.packageCredits}>{pkg.credits.toLocaleString()} credits</div>
                <div className={styles.packagePrice}>${pkg.price}</div>
                <div className={styles.packageRate}>
                  ${(pkg.price / pkg.credits).toFixed(3)} per credit
                  {pkg.discount && <span className={styles.discountBadge}>{pkg.discount}% off</span>}
                </div>
                <button
                  className={styles.buyButton}
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={purchaseLoading === pkg.id || !isConnected}
                >
                  {purchaseLoading === pkg.id ? 'Loading...' : 'Buy Now'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default TokenPage;
