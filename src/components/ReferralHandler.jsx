/**
 * ReferralHandler Component
 *
 * Handles referral registration when a user connects their wallet.
 * This component should be mounted at the app level to catch all wallet connections.
 */

import { useEffect } from 'react';
import { useAccount } from 'wagmi';

const REFERRER_STORAGE_KEY = 'amulet_referrer';

export default function ReferralHandler() {
  const { address, isConnected } = useAccount();

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
          console.log('Referral registered:', data);
          localStorage.removeItem(REFERRER_STORAGE_KEY);
        } else if (data.error === 'Already referred') {
          // Already referred, clear storage
          localStorage.removeItem(REFERRER_STORAGE_KEY);
        } else {
          console.error('Referral registration failed:', data.error);
        }
      } catch (error) {
        console.error('Failed to register referral:', error);
      }
    };

    registerReferral();
  }, [isConnected, address]);

  // This component doesn't render anything
  return null;
}
