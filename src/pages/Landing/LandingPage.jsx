// pages/Landing/LandingPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';
import GhostBackground from '../../components/GhostBackground/GhostBackground';
import RotatingSubtitle from '../../components/RotatingSubtitle';
import { ConnectButton } from '@rainbow-me/rainbowkit';




function LandingPage() {
  const [draft, setDraft] = useState('');
  const [mode, setMode] = useState('login'); // for visual active state
  const navigate = useNavigate();

  const sendFromLanding = () => {
    const text = (draft || 'How can I live forever?').trim();
    if (!text) return;
    navigate('/agent', { state: { initialMessage: text } });
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendFromLanding();
    }
  };

  const goToAuth = (nextMode) => {
    setMode(nextMode);
    navigate(`/auth?mode=${nextMode}`);
  };

  return (
    <>
<div  className={styles.landingMainContainer} style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden',display: 'flex', alignItems: 'center',justifyContent: 'center' }}>


       <GhostBackground />
      <div className={styles.landingLightMode}>
        <div className={styles.container}>
          <div className={styles.titleContainer}>
            <div className={styles.title}>Unlock Longevity</div>
             <RotatingSubtitle
              className={styles.subtitle}
              interval={3} // seconds each subtitle stays visible before swapping
              phrases={[
                "Order treatments directly on the agent.",
                "Personalize your longevity plan.",
                "Shop expert-curated supplements.",
                "Track visits & orders in one place."
              ]}
            />
            
          </div>

          <div className={styles.creditsContainer}>
          

            {/* Composer bar — visuals preserved */}
            <div className={styles.divTwo}>
              <div className={styles.inputPlaceholderWrapper}>
                {/* Show your pretty placeholder only when the input is empty */}
                {draft.length === 0 && (
                  <p className={styles.inputPlaceholder}>How can I live forever?</p>
                )}

                {/* Invisible (but interactive) real input on top */}
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
                className={styles.buttonIcon}
                onClick={sendFromLanding}
                aria-label="Send"
              >
                <img alt="Send" className={styles.send} src="/assets/send.svg" />
              </button>
            </div>
          </div>

          <div className={styles.actionsContainer}>
            <div className={`${styles.actionCard} ${styles.orderHistory}`}>
              <img
                alt="Order history"
                className={styles.actionIcon}
                src="/assets/orderHistoryIcon.svg"
              />
              <div className={styles.orderHistoryTitle}>Order History</div>
              <div className={styles.orderHistorySubtitle}>Check your orders</div>
            </div>

            <div className={`${styles.actionCard} ${styles.shopSupplements}`}>
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

            <div className={`${styles.actionCard} ${styles.viewVisits}`}>
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
    <img src="./assets/infinite-ouline-blue.svg" alt="Amulet Logo" className={styles.logo} />
  </span>
  <span className={`${styles.corner} ${styles.topRight}`}>


              <div className={styles.tabs} role="tablist" aria-label="Auth mode">
     
      <ConnectButton />
        </div>
  </span>
  <span className={`${styles.corner} ${styles.bottomLeft}`}>.</span>
  <span className={`${styles.corner} ${styles.bottomRight}`}>.</span>
</div>
    </>
  );
}

export default LandingPage;
