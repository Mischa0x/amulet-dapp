/* ThemeToggle.jsx — Option A (recommended: theme <html>) */

import { useEffect, useRef, useState } from "react";

/**
 * DEFINE YOUR SYMMETRICAL VAR_SWAP HERE
 * (I’m using your new stable system — 1:1 pairs only)
 */
const VAR_SWAP = {
  "--brand-white": "--brand-black",
  "--brand-black": "--brand-white",

  "--brand-blue-lighter":
    "--brand-neon-cards-surface-light-blue-transparency",
  "--brand-neon-cards-surface-light-blue-transparency":
    "--brand-blue-lighter",

  "--brand-neon-cards-surface-light-blue":
    "--brand-neon-cards-surface-light-blue-transparency-cards",
  "--brand-neon-cards-surface-light-blue-transparency-cards":
    "--brand-neon-cards-surface-light-blue",

  "--brand-neon-cards-surface-light-green":
    "--brand-neon-cards-surface-light-green-transparency",
  "--brand-neon-cards-surface-light-green-transparency":
    "--brand-neon-cards-surface-light-green",

  "--brand-green-darker": "--brand-green-lighter",
  "--brand-green-lighter": "--brand-green-darker",

  "--brand-green-dark": "--brand-green-lighter",
  "--brand-lighter": "--brand-green-dark",

  "--brand-neon-cards-surface-light-purple":
    "--brand-neon-cards-surface-light-purple-transparency",
  "--brand-neon-cards-surface-light-purple-transparency":
    "--brand-neon-cards-surface-light-purple",

  "--brand-purple-darker": "--brand-purple-lighter",
  "--brand-purple-lighter": "--brand-purple-darker",

  "--brand-purple-dark": "--brand-purple-lighter",
  "--brand-lighter-2": "--brand-purple-dark",

  "--brand-blue-darker": "--brand-blue-lighter",
  "--brand-blue-lighter": "--brand-blue-darker",

  "--brand-blue-dark": "--brand-blue-lighter",
  "--brand-lighter-3": "--brand-blue-dark",

  "--brand-grey-lighter-2": "--brand-black",
  "--brand-black-2": "--brand-grey-lighter-2",

  "--brand-checkoutpage-bg-grey": "--brand-checkoutpage-bg-blue",
  "--brand-checkoutpage-bg-blue": "--brand-checkoutpage-bg-grey",

  "--brand-ghostbackground-bg1": "--brand-ghostbackground-bg1-inverted",
  "--brand-ghostbackground-bg1-inverted": "--brand-ghostbackground-bg1",

  "--brand-ghostbackground-bg2": "--brand-ghostbackground-bg2-inverted",
  "--brand-ghostbackground-bg2-inverted": "--brand-ghostbackground-bg2",

  "--brand-ghostbackground-c1": "--brand-ghostbackground-c1-inverted",
  "--brand-ghostbackground-c1-inverted": "--brand-ghostbackground-c1",

  "--brand-ghostbackground-c2": "--brand-ghostbackground-c2-inverted",
  "--brand-ghostbackground-c2-inverted": "--brand-ghostbackground-c2",

  "--brand-ghostbackground-c3": "--brand-ghostbackground-c3-inverted",
  "--brand-ghostbackground-c3-inverted": "--brand-ghostbackground-c3",

  "--brand-ghostbackground-c4": "--brand-ghostbackground-c4-inverted",
  "--brand-ghostbackground-c4-inverted": "--brand-ghostbackground-c4",

  "--brand-ghostbackground-c5": "--brand-ghostbackground-c5-inverted",
  "--brand-ghostbackground-c5-inverted": "--brand-ghostbackground-c5",

  "--brand-ghostbackground-interactive":
    "--brand-ghostbackground-interactive-inverted",
  "--brand-ghostbackground-interactive-inverted":
    "--brand-ghostbackground-interactive",
};

/** Read literal property values from CSS */
const readToken = (el, name) => {
  const sEl = getComputedStyle(el);
  const sRoot = getComputedStyle(document.documentElement);
  return (
    sEl.getPropertyValue(name).trim() ||
    sRoot.getPropertyValue(name).trim() ||
    ""
  );
};

/** Simple icons */
const MoonSVG = ({ style }) => (
  <svg
    style={style}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 12C1.9999 13.5702 2.36955 15.1183 3.07901 16.519C3.78847 17.9197 4.8178 19.1337 6.08367 20.0627C7.34955 20.9916 8.81638 21.6095 10.3654 21.8661C11.9145 22.1228 13.5022 22.011 15 21.54C12.9696 20.9019 11.1957 19.6327 9.93641 17.9169C8.67711 16.2011 7.99807 14.1283 7.99807 12C7.99807 9.87168 8.67711 7.79888 9.93641 6.0831C11.1957 4.36733 12.9696 3.09808 15 2.46C13.5022 1.98895 11.9145 1.87723 10.3654 2.13389C8.81638 2.39054 7.34955 3.00836 6.08367 3.93731C4.8178 4.86627 3.78847 6.08026 3.07901 7.48099C2.36955 8.88173 1.9999 10.4298 2 12V12Z"
      fill="#1D7AFC"
    />
  </svg>
);

const SunSVG = ({ style }) => (
  <svg
    style={style}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="5" fill="white" />
  </svg>
);

export default function ColorToggle({ storageKey = "isDarkTheme" }) {
  const [isDark, setIsDark] = useState(false);
  const cacheRef = useRef(null);

  /** Cache original light values + dark replacement values */
  const ensureCache = (el) => {
    if (cacheRef.current) return cacheRef.current;

    const base = {};
    Object.entries(VAR_SWAP).forEach(([left, right]) => {
      const leftV = readToken(el, left);
      const rightV = readToken(el, right);
      if (leftV) base[left] = leftV;
      if (rightV) base[right] = rightV;
    });

    const lightTargets = {};
    const darkTargets = {};

    Object.entries(VAR_SWAP).forEach(([left, right]) => {
      if (base[left]) lightTargets[left] = base[left];
      if (base[right]) darkTargets[left] = base[right];
    });

    cacheRef.current = { lightTargets, darkTargets };
    return cacheRef.current;
  };

  /** Apply literal colors to <html> */
  const applyTargets = (targets) => {
    const el = document.documentElement;
    Object.entries(targets).forEach(([name, literal]) => {
      el.style.setProperty(name, literal);
    });
  };

  /** Handle toggle click */
  const handleToggle = () => {
    const { lightTargets, darkTargets } = ensureCache(document.documentElement);
    const next = !isDark;
    applyTargets(next ? darkTargets : lightTargets);
    setIsDark(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  /** Initialize theme on mount */
  useEffect(() => {
    const el = document.documentElement;
    const cached = ensureCache(el);

    let initial = false;
    const saved = localStorage.getItem(storageKey);

    if (saved !== null) {
      initial = JSON.parse(saved) === true;
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      initial = true;
    }

    applyTargets(initial ? cached.darkTargets : cached.lightTargets);
    setIsDark(initial);
  }, [storageKey]);

  /** Button styling */
  const buttonStyle = {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 0,
  };

  const iconStyle = {
    width: "24px",
    height: "24px",
    transition: "transform .2s ease",
  };

  return (
    <button onClick={handleToggle} style={buttonStyle}>
      {isDark ? <SunSVG style={iconStyle} /> : <MoonSVG style={iconStyle} />}
    </button>
  );
}
