/**
 * EpochTabs Component
 *
 * Segmented control for switching between time epochs.
 * Sticky positioning when scrolled.
 */

import styles from './EpochTabs.module.css';

const EPOCHS = [
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: 'all', label: 'ALL TIME' },
];

export default function EpochTabs({ value, onChange, isLoading = false }) {
  return (
    <div className={styles.container}>
      <div className={`${styles.tabs} ${isLoading ? styles.loading : ''}`}>
        {EPOCHS.map((epoch) => (
          <button
            key={epoch.value}
            className={`${styles.tab} ${value === epoch.value ? styles.active : ''}`}
            onClick={() => onChange(epoch.value)}
            disabled={isLoading}
            aria-pressed={value === epoch.value}
          >
            {epoch.label}
          </button>
        ))}
        <div
          className={styles.indicator}
          style={{
            transform: `translateX(${EPOCHS.findIndex(e => e.value === value) * 100}%)`,
            width: `${100 / EPOCHS.length}%`,
          }}
        />
      </div>
    </div>
  );
}
