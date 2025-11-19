// src/components/WalletGuard.jsx
import { useAccount } from 'wagmi';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function WalletGuard() {
  const { isConnected } = useAccount();
  const location = useLocation();

  if (!isConnected) {
    // redirect to /auth and remember where the user wanted to go
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location }}
      />
    );
  }

  // wallet is connected → render protected routes
  return <Outlet />;
}
