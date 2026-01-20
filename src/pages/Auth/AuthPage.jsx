// pages/Auth/AuthPage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import styles from "./AuthPage.module.css";
import logo from "/assets/blue_logo_transparent_square.png";

// API URL - empty string uses same origin (Vercel Functions)
const API_URL = import.meta.env.VITE_API_URL || "";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();

  // Redirect to agent page when wallet connects
  useEffect(() => {
    if (isConnected) {
      navigate("/agent");
    }
  }, [isConnected, navigate]);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        // Validate passwords match
        if (formData.password !== formData.passwordConfirm) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        // Register
        const response = await fetch(`${API_URL}/api/auth?action=register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: formData.username || formData.email.split("@")[0],
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        // Registration successful - switch to login
        setMode("login");
        setError("");
        alert("Account created! Please log in.");
      } else {
        // Login
        const response = await fetch(`${API_URL}/api/auth?action=login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: formData.email, // Backend accepts email as username
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.emailVerified === false) {
            throw new Error("Please verify your email before logging in");
          }
          throw new Error(data.message || "Login failed");
        }

        // Store token and user info
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        // Login successful - redirect to dashboard/agent
        navigate("/agent");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageRoot}>
      {/* BACKGROUND */}
      <div className={styles.bgWrap} aria-hidden="true">
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
                onClick={() => { setMode("login"); setError(""); }}
              >
                LOGIN
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signup"}
                className={`${styles.tab} ${mode === "signup" ? styles.tabActive : ""}`}
                onClick={() => { setMode("signup"); setError(""); }}
              >
                SIGN UP
              </button>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="username">Username</label>
                  <input
                    id="username"
                    name="username"
                    className={styles.input}
                    type="text"
                    autoComplete="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  className={styles.input}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
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
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {mode === "signup" && (
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="passwordConfirm">Confirm password</label>
                  <input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    className={styles.input}
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={formData.passwordConfirm}
                    onChange={handleInputChange}
                    required
                  />
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

              <button
                type="submit"
                className={styles.primaryButton}
                disabled={loading}
              >
                {loading ? "Please wait..." : (mode === "login" ? "Log in" : "Create account")}
              </button>

              <div className={styles.dividerRow}>
                <span className={styles.dividerLine} />
                <span className={styles.dividerText}>or</span>
                <span className={styles.dividerLine} />
              </div>

              <button
                type="button"
                className={styles.secondaryButton}
                onClick={openConnectModal}
              >
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
          </div>
        </aside>

        <Link to="/" className={styles.logoLink}>
          <img src={logo} alt="logo" className={styles.logoInfinite} />
        </Link>
      </div>
    </div>
  );
}
