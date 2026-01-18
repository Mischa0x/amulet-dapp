/**
 * ProgressRing Component
 *
 * An SVG-based circular progress indicator with smooth animations.
 * Used to visualize progress toward the top-50 threshold.
 */

import { useEffect, useState } from 'react';
import styles from './ProgressRing.module.css';

export default function ProgressRing({
  progress = 0,      // 0-1 (or higher, capped at 1.2 for display)
  size = 120,
  strokeWidth = 8,
  showLabel = true,
  label = 'Top-50 Threshold',
}) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Animate on mount and progress change
  useEffect(() => {
    const cappedProgress = Math.min(progress, 1.2);
    const timer = setTimeout(() => {
      setAnimatedProgress(cappedProgress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(animatedProgress, 1) * circumference);

  // Colors based on progress
  const getProgressColor = () => {
    if (progress >= 1) return 'var(--brand-green-default, #22a06b)';
    if (progress >= 0.7) return 'var(--brand-blue-default, #1D7AFC)';
    if (progress >= 0.4) return 'var(--brand-purple-default, #8270db)';
    return 'var(--brand-grey-default, #758195)';
  };

  const percentage = Math.round(Math.min(progress, 1) * 100);

  return (
    <div className={styles.container}>
      <svg
        className={styles.ring}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background track */}
        <circle
          className={styles.track}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <circle
          className={styles.progress}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={getProgressColor()}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      <div className={styles.inner}>
        <span className={styles.percentage}>{percentage}%</span>
        {showLabel && <span className={styles.label}>{label}</span>}
      </div>

      {progress >= 1 && (
        <div className={styles.badge}>
          <span className={styles.checkmark}>✓</span>
        </div>
      )}
    </div>
  );
}
