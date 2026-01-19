/**
 * ReferAndEarn Component
 *
 * Displays referral link with copy/share functionality.
 * Simple design that fits into the rewards page.
 */

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { REFERRER_STORAGE_KEY } from '../../pages/Referral/ReferralLanding';
import styles from './ReferAndEarn.module.css';

export default function ReferAndEarn({ referralCount = 0 }) {
  const { address, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [baseUrl, setBaseUrl] = useState('https://amulet-dapp.vercel.app');

  // Use current origin for local testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const referralUrl = address
    ? `${baseUrl}/ref/${address}`
    : '';

  // Register referral on wallet connect
  useEffect(() => {
    if (!isConnected || !address) return;

    const registerReferral = async () => {
      const storedReferrer = localStorage.getItem(REFERRER_STORAGE_KEY);
      if (!storedReferrer) return;

      // Don't register if it's your own referral link
      if (storedReferrer.toLowerCase() === address.toLowerCase()) {
        localStorage.removeItem(REFERRER_STORAGE_KEY);
        return;
      }

      try {
        const response = await fetch('/api/referral-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referrer: storedReferrer,
            referee: address,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setRegistrationStatus('success');
          // Clear the stored referrer after successful registration
          localStorage.removeItem(REFERRER_STORAGE_KEY);
          console.log('Referral registered:', data);
        } else if (data.error === 'Already referred') {
          // Already referred, clear storage
          localStorage.removeItem(REFERRER_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Failed to register referral:', error);
      }
    };

    registerReferral();
  }, [isConnected, address]);

  const handleCopy = async () => {
    if (!referralUrl) return;

    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShareX = () => {
    if (!referralUrl) return;
    const text = encodeURIComponent('Try Amulet.ai - AI-powered longevity assistant');
    const url = encodeURIComponent(referralUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleShareTelegram = () => {
    if (!referralUrl) return;
    const text = encodeURIComponent('Try Amulet.ai - AI-powered longevity assistant');
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${text}`, '_blank');
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>Refer & Earn</h3>
          {referralCount > 0 && (
            <span className={styles.badge}>{referralCount} referrals</span>
          )}
        </div>
        <p className={styles.subtitle}>
          Invite friends and both earn +1 point
        </p>
      </div>

      {/* Success message */}
      {registrationStatus === 'success' && (
        <div className={styles.successBanner}>
          You earned +1 point from a referral!
        </div>
      )}

      {/* Referral Link */}
      <div className={styles.linkRow}>
        <div className={styles.linkBox}>
          <span className={styles.linkText}>{referralUrl}</span>
        </div>
        <button
          onClick={handleCopy}
          className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
        >
          {copied ? (
            <>
              <CheckIcon />
              Copied
            </>
          ) : (
            <>
              <CopyIcon />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Share Buttons */}
      <div className={styles.shareRow}>
        <button onClick={handleShareX} className={styles.shareBtn}>
          <XIcon />
          Share on X
        </button>
        <button onClick={handleShareTelegram} className={styles.shareBtn}>
          <TelegramIcon />
          Telegram
        </button>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <InfoIcon />
        <span>
          When friends join using your link, you both get +1 point added to your leaderboard score.
        </span>
      </div>
    </div>
  );
}

// Icons
function CopyIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
