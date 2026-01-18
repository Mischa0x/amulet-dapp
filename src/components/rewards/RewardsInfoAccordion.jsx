/**
 * RewardsInfoAccordion Component
 *
 * Collapsible panel explaining how the rewards system works.
 */

import { useState } from 'react';
import styles from './RewardsInfoAccordion.module.css';

export default function RewardsInfoAccordion() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <button
        className={styles.header}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.headerText}>
          <span className={styles.icon}>💡</span>
          How Rewards Work
        </span>
        <span className={`${styles.chevron} ${isOpen ? styles.open : ''}`}>
          ▼
        </span>
      </button>

      <div className={`${styles.content} ${isOpen ? styles.expanded : ''}`}>
        <div className={styles.inner}>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Compute Credits</h4>
            <p className={styles.text}>
              Compute credits power your interactions with DrPepe.ai. Each query
              consumes credits based on complexity—from 1 credit for simple questions
              to 25 credits for deep research.
            </p>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Leaderboard Tracking</h4>
            <p className={styles.text}>
              Your usage is tracked per wallet across different time periods.
              The leaderboard ranks the top 50 wallets by total compute credits used.
            </p>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Future Rewards</h4>
            <p className={styles.text}>
              Future AMULET token distributions may prioritize wallets based on:
            </p>
            <ul className={styles.list}>
              <li>Total compute credits used</li>
              <li>Consistency and activity streaks</li>
              <li>Leaderboard position over time</li>
              <li>Early adoption and engagement</li>
            </ul>
          </div>

          <div className={styles.notice}>
            <span className={styles.noticeIcon}>ℹ️</span>
            <span className={styles.noticeText}>
              Leaderboard position is not transferable. Stats are tied to your
              wallet address and cannot be sold or moved to another wallet.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
