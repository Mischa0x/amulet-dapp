// AgentHeader.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useCartCount } from "../../store/CartContext";
import styles from "./AgentHeader.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";


export default function AgentHeader({ placeholder = "LONGEVITY SEARCH" }) {
  const [credits] = useState({ total: 32, free: 4 });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const cartCount = useCartCount();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = useCallback(() => {
    document.body.classList.toggle("drawer-open");
  }, []);
  const toggleSearch = () => setIsSearchOpen((v) => !v);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setQuery(q);
  }, [location.search]);

  useEffect(() => {
    if (isSearchOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isSearchOpen]);

  const onType = (e) => {
    const next = e.target.value;
    setQuery(next);
    const q = next.trim();
    const search = q ? `?q=${encodeURIComponent(q)}` : "";
    navigate(`/shop${search}`, { replace: location.pathname.startsWith("/shop") });
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header className={styles.headerInner}>
        <button
          type="button"
          className={styles.mobileToggle}
          onClick={toggleDrawer}
          aria-label="Open sidebar"
        >
          <img src="/assets/infinite-ouline-blue.svg" alt="" className={styles.icon24} />
        </button>

        <section className={styles.headerSection}>
          <Link to="/" className={styles.brand} aria-label="Go to chat home">
            AMULET.AI
          </Link>

          <div className={styles.rightSide}>
            <button
              type="button"
              className={styles.searchButton}
              onClick={toggleSearch}
              aria-expanded={isSearchOpen}
              aria-controls="inline-search"
              aria-label="Toggle search"
            >
              <img src="/assets/magnify.svg" alt="" className={styles.icon24} />
            </button>

            {/* Desktop inline search (unchanged) */}
            <div
              id="inline-search"
              className={`${styles.inlineSearch} ${isSearchOpen ? styles.inlineSearchOpen : ""}`}
              role="search"
              aria-hidden={!isSearchOpen}
            >
              <form className={styles.inlineSearchField} onSubmit={(e) => e.preventDefault()}>
                <input
                  ref={inputRef}
                  type="search"
                  className={styles.inlineSearchInput}
                  placeholder={placeholder}
                  value={query}
                  onChange={onType}
                  onKeyDown={onKeyDown}
                  aria-label="Search site"
                />
              </form>
            </div>

            <div className={styles.goldContainer} aria-label={`${credits.total} credits`} title="Credits">
              <div className={styles.gold}>
                <img className={styles.vector} src="/assets/gold.svg" alt="" />
              </div>
              <div className={styles.counterText}>{credits.total}</div>
            </div>

            <button
              type="button"
              className={`${styles.cartButton} ${cartCount > 0 ? styles.cartHasItems : ""}`}
              onClick={() => navigate("/cart")}
              aria-label={`View cart, ${cartCount} items`}
              data-count={cartCount}
            >
              <img src="/assets/cartblue.svg" alt="" className={styles.cartIcon} />
            </button>

    <ConnectButton />
            
          </div>
        </section>
      </header>

      {/* Mobile full-width search bar under the header */}
      <div
        className={`${styles.mobileSearch} ${isSearchOpen ? styles.mobileSearchOpen : ""}`}
        role="search"
        aria-hidden={!isSearchOpen}
      >
        <form className={styles.mobileSearchField} onSubmit={(e) => e.preventDefault()}>
          <input
            ref={inputRef}
            type="search"
            className={styles.mobileSearchInput}
            placeholder={placeholder}
            value={query}
            onChange={onType}
            onKeyDown={onKeyDown}
            aria-label="Search site"
          />
      
        </form>
      </div>
    </>
  );
}
