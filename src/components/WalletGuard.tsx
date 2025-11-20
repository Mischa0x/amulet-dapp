import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";
import { useAmuletAuthStatus } from "../providers/useAmuletAuthStatus";

export default function WalletGuard() {
  const { isConnected } = useAccount();
  const authStatus = useAmuletAuthStatus();
  const location = useLocation();

  if (authStatus === "loading") {
    return <div>Checking secure session…</div>;
  }

  if (!isConnected || authStatus !== "authenticated") {
    return (
      <Navigate to="/auth" replace state={{ from: location }} />
    );
  }

  return <Outlet />;
}
