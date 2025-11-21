// pages/Auth/AuthPage.jsx
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import styles from "./AuthPage.module.css";
//import GhostBackground from "../../components/GhostBackground/GhostBackground";
import logo from "../Auth/infinite-ouline-blue.svg";

export default function AuthPageWeb3() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const navigate = useNavigate();
  const location = useLocation();

  // When the user connects, send them back where they came from, or /dashboard
  useEffect(() => {
    if (!isConnected) return;

    const from = location.state?.from?.pathname || "/dashboard";
    navigate(from, { replace: true });
  }, [isConnected, location, navigate]);

  // Auto-open the RainbowKit "Connect Wallet" modal when this page mounts
    {/*useEffect(() => {
    if (openConnectModal) {
      openConnectModal();
    }
  }, [openConnectModal]); */}

  return (
    <div className={styles.pageRoot}>
      {/* BACKGROUND */}
      <div className={styles.bgWrap} aria-hidden="true">
          {/*<GhostBackground />*/}
        <div className={styles.bgOverlay} />
      </div>

      {/* CONTENT */}
      <div className={styles.authShell}>
        {/* LEFT: Web3 Auth Card */}
        <div className={styles.leftCol}>
          <div className={styles.authCard}>
            <header className={styles.header}>
              <Link to="/" className={styles.brand}>
                AMULET.AI
              </Link>
              <p className={styles.tagline}>
                Longevity intelligence for your health journey.
              </p>
            </header>

            {/* Simple copy – no email/password, only wallet connect */}
            <div className={styles.copyBlock}>
              <h2 className={styles.mainTitle}>Connect your wallet</h2>
              <p className={styles.subtitle}>
                Access your longevity dashboard, agent and shop by connecting a
                compatible Ethereum wallet. No passwords, just your wallet.
              </p>
            </div>

            <div className={styles.dividerRow}>
              <span className={styles.dividerLine} />
              <span className={styles.dividerText}>Web3 access</span>
              <span className={styles.dividerLine} />
            </div>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => openConnectModal && openConnectModal()}
            >
              CONNECT WALLET
            </button>

            <p className={styles.metaText}>
              By continuing, you agree to our{" "}
              <Link to="/terms" className={styles.inlineLink}>
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className={styles.inlineLink}>
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        {/* RIGHT: Marketing Panel (desktop only) */}
        <aside className={styles.rightCol} aria-hidden="true">
          <div className={styles.sidePanel}>
            <h2 className={styles.sideTitle}>Live longer, live better</h2>
            {/* <GhostBackground /> */}
          </div>
        </aside>

        <Link to="/" className={styles.logoLink}>
          <img src={logo} alt="logo" className={styles.logoInfinite} />
        </Link>
      </div>
    </div>
  );
}
