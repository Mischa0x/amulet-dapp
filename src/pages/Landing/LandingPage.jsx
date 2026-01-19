// pages/Landing/LandingPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './LandingPage.module.css';
import GhostBackground from '../../components/GhostBackground/GhostBackground';
import RotatingSubtitle from '../../components/RotatingSubtitle';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

function LandingPage() {
  const [draft, setDraft] = useState('');
  const navigate = useNavigate();

  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const sendFromLanding = () => {
    const text = (draft || 'How can I live forever?').trim();
    if (!text) return;

    if (!isConnected) {
      // Wallet not connected → open wallet modal
      openConnectModal?.();
      return;
    }

    // Wallet connected → proceed to agent
    navigate('/agent', { state: { initialMessage: text } });
  };

  // Navigate to protected routes (requires wallet connection)
  const goTo = (path) => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    navigate(path);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (!isConnected) {
        openConnectModal?.();
        return;
      }

      sendFromLanding();
    }
  };

  return (
    <>
      <div
        className={styles.landingMainContainer}
   
      >
        <GhostBackground />

        <div className={styles.landingLightMode}>
          <div className={styles.container}>
            <div className={styles.titleContainer}>
              <div className={styles.title}>Unlock Longevity</div>

              <RotatingSubtitle
                className={styles.subtitle}
                interval={3}
                phrases={[
                  'Order treatments directly on the agent',
                  'Personalize your longevity plan',
                  'Shop expert-curated supplements',
                  'Track visits & orders in one place',
                ]}
              />
            </div>

            <div className={styles.creditsContainer}>
              {/* Composer bar */}
              <div className={styles.divTwo}>
                <div className={styles.inputPlaceholderWrapper}>
                  {draft.length === 0 && (
                    <p className={styles.inputPlaceholder}>How can I live forever?</p>
                  )}

                  <input
                    type="text"
                    aria-label="Ask a question"
                    className={styles.realInput}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={onKeyDown}
                    inputMode="text"
                    autoComplete="off"
                    autoCorrect="on"
                  />
                </div>

             <button
  className={`${styles.buttonIcon} ${!isConnected ? styles.disabledButton : ''}`}
  onClick={() => {
    if (!isConnected) {
      openConnectModal?.();  // if disconnected, open wallet modal
      return;
    }
    sendFromLanding();
  }}
  aria-label="Send"
  disabled={!isConnected}
>
  <img alt="Send" className={styles.send} src="/assets/send.svg" />
</button>
              </div>

            </div>
              {/* Mobile-only ConnectButton under the input */}
              <div
                className={`${styles.connectWrapper} ${styles.mobileOnly}`}
              >
                <ConnectButton
                  accountStatus="full"
                  chainStatus="full"
                  showBalance={true}
                />
              </div>

            <div className={styles.actionsContainer}>
              <div
                className={`${styles.actionCard} ${styles.orderHistory}`}
                style={{ cursor: 'pointer' }}
                onClick={() => goTo('/orderhistory')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && goTo('/orderhistory')}
              >
                <img
                  alt="Order history"
                  className={styles.actionIcon}
                  src="/assets/orderHistoryIcon.svg"
                />
                <div className={styles.orderHistoryTitle}>Order History</div>
                <div className={styles.orderHistorySubtitle}>Check your orders</div>
              </div>

              <div
                className={`${styles.actionCard} ${styles.shopSupplements}`}
                style={{ cursor: 'pointer' }}
                onClick={() => goTo('/shop')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && goTo('/shop')}
              >
                <img
                  alt="Shop supplements"
                  className={styles.actionIcon}
                  src="/assets/shopSupplementsIcon.svg"
                />
                <div className={styles.shopSupplementsTitle}>Shop Supplements</div>
                <div className={styles.shopSupplementsSubtitle}>
                  Longevity-enhanced products
                </div>
              </div>

              <div
                className={`${styles.actionCard} ${styles.viewVisits}`}
                style={{ cursor: 'pointer' }}
                onClick={() => goTo('/visits')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && goTo('/visits')}
              >
                <img
                  alt="View visits"
                  className={styles.actionIcon}
                  src="/assets/viewVisitsIcon.svg"
                />
                <div className={styles.viewVisitsTitle}>View Visits</div>
                <div className={styles.viewVisitsSubtitle}>Track medical history</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Four corner words */}
      <div className={styles.cornerWords}>
        <span className={`${styles.corner} ${styles.topLeft}`}>
          <img
            src="/assets/blue_logo_transparent_square.png"
            alt="Amulet Logo"
            className={styles.logo}
          />
        </span>

        <span className={`${styles.corner} ${styles.topRight}`}>
          <div className={styles.topRightNav}>
            <Link to="/blog" className={styles.blogLink}>
              Blog
            </Link>
            <Link to="/auth" className={styles.blogLink}>
              Sign In
            </Link>
            {/* Desktop-only ConnectButton in top-right corner */}
            <div
              className={`${styles.tabs} ${styles.desktopOnly}`}
              role="tablist"
              aria-label="Wallet"
            >
              <ConnectButton
                accountStatus="full"
                chainStatus="full"
                showBalance={true}
              />
            </div>
          </div>
        </span>

        <span className={`${styles.corner} ${styles.bottomLeft}`}></span>
        <span className={`${styles.corner} ${styles.bottomRight}`}></span>
      </div>
    </>
  );
}

export default LandingPage;
