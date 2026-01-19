/**
 * Skeleton Component
 *
 * Provides animated placeholder loading states for async content.
 * Use to prevent layout shift and indicate loading progress.
 */

import styles from './Skeleton.module.css';

/**
 * Basic skeleton block
 * @param {Object} props
 * @param {string} [props.width] - Width (e.g., '100%', '200px')
 * @param {string} [props.height] - Height (e.g., '20px', '1rem')
 * @param {string} [props.borderRadius] - Border radius (e.g., '4px', '50%')
 * @param {string} [props.className] - Additional CSS class
 */
export function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius = '4px',
  className = '',
}) {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

/**
 * Text line skeleton - mimics a line of text
 */
export function SkeletonText({ lines = 1, className = '' }) {
  return (
    <div className={`${styles.textContainer} ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="0.875rem"
          width={i === lines - 1 && lines > 1 ? '60%' : '100%'}
          borderRadius="3px"
        />
      ))}
    </div>
  );
}

/**
 * Circle skeleton - for avatars/icons
 */
export function SkeletonCircle({ size = '40px', className = '' }) {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius="50%"
      className={className}
    />
  );
}

/**
 * Card skeleton - for card layouts
 */
export function SkeletonCard({ className = '' }) {
  return (
    <div className={`${styles.card} ${className}`}>
      <Skeleton height="120px" borderRadius="8px" />
      <div className={styles.cardContent}>
        <Skeleton height="1rem" width="70%" />
        <Skeleton height="0.75rem" width="50%" />
      </div>
    </div>
  );
}

/**
 * Stats row skeleton - for numeric displays
 */
export function SkeletonStats({ count = 4, className = '' }) {
  return (
    <div className={`${styles.statsRow} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.statItem}>
          <Skeleton height="0.75rem" width="60px" />
          <Skeleton height="1.5rem" width="80px" />
        </div>
      ))}
    </div>
  );
}

/**
 * Table row skeleton - for leaderboard/lists
 */
export function SkeletonTableRow({ columns = 4, className = '' }) {
  return (
    <div className={`${styles.tableRow} ${className}`}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          height="1rem"
          width={i === 0 ? '40px' : i === 1 ? '120px' : '60px'}
        />
      ))}
    </div>
  );
}

/**
 * Message skeleton - for chat messages
 */
export function SkeletonMessage({ isUser = false, className = '' }) {
  return (
    <div
      className={`${styles.message} ${isUser ? styles.messageUser : ''} ${className}`}
    >
      {!isUser && <SkeletonCircle size="32px" />}
      <div className={styles.messageContent}>
        <SkeletonText lines={isUser ? 1 : 3} />
      </div>
    </div>
  );
}

export default Skeleton;
