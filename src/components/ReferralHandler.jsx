/**
 * ReferralHandler Component
 *
 * Handles referral registration when a user connects their wallet.
 * This component should be mounted at the app level to catch all wallet connections.
 */

import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { STORAGE_KEYS } from '../shared/constants';

export default function ReferralHandler() {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected || !address) return;

    const registerReferral = async () => {
      const storedReferrer = localStorage.getItem(STORAGE_KEYS.REFERRER);
      if (!storedReferrer) return;

      // Don't register if it's your own referral link
      if (storedReferrer.toLowerCase() === address.toLowerCase()) {
        localStorage.removeItem(STORAGE_KEYS.REFERRER);
        return;
      }

      try {
        const response = await fetch('/api/refs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referrer: storedReferrer,
            referee: address,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Referral registered successfully
          localStorage.removeItem(STORAGE_KEYS.REFERRER);
        } else if (data.error === 'Already referred') {
          // Already referred, clear storage
          localStorage.removeItem(STORAGE_KEYS.REFERRER);
        }
        // Silently fail for other errors - don't interrupt user experience
      } catch {
        // Network error - will retry on next page load
      }
    };

    registerReferral();
  }, [isConnected, address]);

  // This component doesn't render anything
  return null;
}
