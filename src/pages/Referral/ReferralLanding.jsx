/**
 * Referral Landing Page
 * Route: /ref/:address
 *
 * Captures the referrer address from URL, stores in localStorage,
 * and redirects to the main app.
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../../shared/constants';

export default function ReferralLanding() {
  const { address } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (address) {
      // Store referrer address in localStorage
      const normalizedAddress = address.toLowerCase();

      // Only store if not already referred
      const existingReferrer = localStorage.getItem(STORAGE_KEYS.REFERRER);
      if (!existingReferrer) {
        localStorage.setItem(STORAGE_KEYS.REFERRER, normalizedAddress);
      }
    }

    // Redirect to landing page
    navigate('/', { replace: true });
  }, [address, navigate]);

  // Brief loading state while redirecting
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--brand-ghostbackground-bg1, #0a0a0b)',
      color: 'var(--brand-black, #fff)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>Amulet.ai</div>
        <div style={{ fontSize: '14px', opacity: 0.6 }}>Redirecting...</div>
      </div>
    </div>
  );
}
