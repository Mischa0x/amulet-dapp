// contexts/CreditsContext.jsx
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';

const CreditsContext = createContext(null);

export function CreditsProvider({ children }) {
  const { address } = useAccount();
  const [creditData, setCreditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch credits from API
  const fetchCredits = useCallback(async () => {
    if (!address) {
      setCreditData(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setError(null);
      const res = await fetch(`/api/credits?address=${address}`);
      if (!res.ok) {
        throw new Error('Failed to fetch credits');
      }
      const data = await res.json();
      setCreditData(data);
    } catch {
      setError('Failed to load credits');
      setCreditData(null);
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

  // Memoize context value to prevent unnecessary re-renders of consumers
  const value = useMemo(() => ({
    creditData,
    loading,
    error,
    updateCredits,
    refetchCredits,
    setCreditData,
  }), [creditData, loading, error, updateCredits, refetchCredits]);

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
