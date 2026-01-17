// contexts/CreditsContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';

const CreditsContext = createContext(null);

export function CreditsProvider({ children }) {
  const { address } = useAccount();
  const [creditData, setCreditData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch credits from API
  const fetchCredits = useCallback(async () => {
    if (!address) {
      setCreditData(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/credits?address=${address}`);
      const data = await res.json();
      setCreditData(data);
    } catch (err) {
      console.error('Failed to fetch credits:', err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Fetch on address change
  useEffect(() => {
    setLoading(true);
    fetchCredits();
  }, [address, fetchCredits]);

  // Update credits after a query (called from AgentChat)
  const updateCredits = useCallback((newCreditInfo) => {
    if (newCreditInfo) {
      setCreditData(prev => ({
        ...prev,
        balance: newCreditInfo.newBalance,
        totalUsed: (prev?.totalUsed || 0) + newCreditInfo.creditsUsed,
      }));
    }
  }, []);

  // Refetch credits (called after purchase, claim, etc.)
  const refetchCredits = useCallback(() => {
    fetchCredits();
  }, [fetchCredits]);

  const value = {
    creditData,
    loading,
    updateCredits,
    refetchCredits,
    setCreditData,
  };

  return (
    <CreditsContext.Provider value={value}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
}
