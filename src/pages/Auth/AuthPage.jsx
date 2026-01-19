// pages/Auth/AuthPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AuthPage.module.css";
//import GhostBackground from "../../components/GhostBackground/GhostBackground"; // 👈 igual que en Landing
import logo from "/assets/blue_logo_transparent_square.png"


export default function AuthPage() {
  const [mode, setMode] = useState("login");

  return (
    <div className={styles.pageRoot}>
      {/* BACKGROUND */}
      <div className={styles.bgWrap} aria-hidden="true">
        {/*  <GhostBackground /> */}
        {/* opcional: velo para contraste */}
        <div className={styles.bgOverlay} />
      </div>

      {/* CONTENT */}
      <div className={styles.authShell}>
        {/* LEFT: Auth Card */}
        <div className={styles.leftCol}>
          <div className={styles.authCard}>
            <header className={styles.header}>
              <Link to="/" className={styles.brand}>AMULET.AI</Link>
              <p className={styles.tagline}>
                Longevity intelligence for your health journey.
              </p>
            </header>

            <div className={styles.tabs} role="tablist" aria-label="Auth mode">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                className={`${styles.tab} ${mode === "login" ? styles.tabActive : ""}`}
                onClick={() => setMode("login")}
              >
                LOGIN
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signup"}
                className={`${styles.tab} ${mode === "signup" ? styles.tabActive : ""}`}
                onClick={() => setMode("signup")}
              >
                SIGN UP
              </button>
            </div>

            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault();
                // Auth handled by Web3 wallet connection - this form is a placeholder
              }}
            >
              {mode === "signup" && (
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="name">Full name</label>
                  <input id="name" name="name" className={styles.input} type="text" autoComplete="name" placeholder="Your name" />
                </div>
              )}

              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">Email</label>
                <input id="email" name="email" className={styles.input} type="email" autoComplete="email" placeholder="you@example.com" />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  className={styles.input}
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="••••••••"
                />
              </div>

              {mode === "signup" && (
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="passwordConfirm">Confirm password</label>
                  <input id="passwordConfirm" name="passwordConfirm" className={styles.input} type="password" autoComplete="new-password" placeholder="••••••••" />
                </div>
              )}

              {mode === "login" && (
                <div className={styles.formRow}>
                  <label className={styles.rememberLabel}>
                    <input type="checkbox" className={styles.checkbox} />
                    <span>Remember me</span>
                  </label>
                  <button type="button" className={styles.linkButton}>Forgot password?</button>
                </div>
              )}

              <button type="submit" className={styles.primaryButton}>
                {mode === "login" ? "Log in" : "Create account"}
              </button>

              <div className={styles.dividerRow}>
                <span className={styles.dividerLine} />
                <span className={styles.dividerText}>or</span>
                <span className={styles.dividerLine} />
              </div>

              <button type="button" className={styles.secondaryButton}>
               CONNECT WALLET
              </button>

              <p className={styles.metaText}>
                By continuing, you agree to our{" "}
                <Link to="/terms" className={styles.inlineLink}>Terms</Link> and{" "}
                <Link to="/privacy" className={styles.inlineLink}>Privacy Policy</Link>.
              </p>
            </form>
          </div>
        </div>

        {/* RIGHT: Marketing Panel (desktop only) */}
        <aside className={styles.rightCol} aria-hidden="true">
          <div className={styles.sidePanel}>
            <h2 className={styles.sideTitle}>Live longer, live better</h2>
           
                           {/* <GhostBackground />*/}
         
          </div>
        </aside>
<Link to="/" className={styles.logoLink}>
  <img src={logo} alt="logo" className={styles.logoInfinite} />
</Link>
      </div>





    </div>
  );
}
