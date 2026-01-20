import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";

export default function WalletGuard() {
  const { isConnected } = useAccount();
  const location = useLocation();

  // Check for email auth token
  const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const isEmailAuthenticated = !!authToken;

  // ✅ Allow access if wallet connected OR email authenticated
  if (isConnected || isEmailAuthenticated) {
    return <Outlet />;
  }

  // ❌ Not authenticated → redirect to landing
  return <Navigate to="/" replace state={{ from: location }} />;
}
