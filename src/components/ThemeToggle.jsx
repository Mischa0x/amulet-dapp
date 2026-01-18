/* ThemeToggle.jsx */

import { useEffect, useRef, useState } from "react";

/**
 * LEFT: light-theme var you already use.
 * RIGHT: the var whose LIGHT value should be used in DARK mode.
 */
const VAR_SWAP = {
  /* Base white/black */
  "--brand-white": "--brand-black",
  "--brand-black": "--brand-white",

  /* Blue lighter ↔ transparency */
  "--brand-blue-lighter":
    "--brand-neon-cards-surface-light-blue-transparency",
  "--brand-neon-cards-surface-light-blue-transparency":
    "--brand-blue-lighter",

  /* Blue main ↔ transparency-cards */
  "--brand-neon-cards-surface-light-blue":
    "--brand-neon-cards-surface-light-blue-transparency-cards",
  "--brand-neon-cards-surface-light-blue-transparency-cards":
    "--brand-neon-cards-surface-light-blue",

  /* Green surface ↔ green transparent */
  "--brand-neon-cards-surface-light-green":
    "--brand-neon-cards-surface-light-green-transparency",
  "--brand-neon-cards-surface-light-green-transparency":
    "--brand-neon-cards-surface-light-green",

  /* Green darker ↔ green lighter */
  "--brand-green-darker": "--brand-green-lighter",
  "--brand-green-lighter": "--brand-green-darker",

  /* Green dark ↔ green lighter (Your original mapping) */
  "--brand-green-dark": "--brand-green-lighter",
  "--brand-green-lighter": "--brand-green-dark",

  /* Purple surface ↔ purple transparent */
  "--brand-neon-cards-surface-light-purple":
    "--brand-neon-cards-surface-light-purple-transparency",
  "--brand-neon-cards-surface-light-purple-transparency":
    "--brand-neon-cards-surface-light-purple",

  /* Yellow surface ↔ yellow transparent */
  "--brand-neon-cards-surface-light-yellow":
    "--brand-neon-cards-surface-light-yellow-transparency",
  "--brand-neon-cards-surface-light-yellow-transparency":
    "--brand-neon-cards-surface-light-yellow",

  /* Teal surface ↔ teal transparent */
  "--brand-neon-cards-surface-light-teal":
    "--brand-neon-cards-surface-light-teal-transparency",
  "--brand-neon-cards-surface-light-teal-transparency":
    "--brand-neon-cards-surface-light-teal",

  /* Yellow light ↔ yellow dark */
  "--brand-yellow-light": "--brand-yellow-dark",
  "--brand-yellow-dark": "--brand-yellow-light",

  /* Teal light ↔ teal dark */
  "--brand-teal-light": "--brand-teal-dark",
  "--brand-teal-dark": "--brand-teal-light",

  /* Teal lighter ↔ teal darker */
  "--brand-teal-lighter": "--brand-teal-darker",
  "--brand-teal-darker": "--brand-teal-lighter",

  /* Purple darker ↔ purple lighter */
  "--brand-purple-darker": "--brand-purple-lighter",
  "--brand-purple-lighter": "--brand-purple-darker",

  /* Purple dark ↔ purple lighter */
  "--brand-purple-dark": "--brand-purple-lighter",
  "--brand-purple-lighter": "--brand-purple-dark",

  /* Blue darker ↔ blue lighter */
  "--brand-blue-darker": "--brand-blue-lighter",
  "--brand-blue-lighter": "--brand-blue-darker",

  /* Blue dark ↔ blue lighter */
  "--brand-blue-dark": "--brand-blue-lighter",
  "--brand-blue-lighter": "--brand-blue-dark",

  /* Grey lighter ↔ black (your mapping) */
  "--brand-grey-lighter-2": "--brand-black",
  "--brand-black": "--brand-grey-lighter-2",

  /* Checkout page grey ↔ blue */
  "--brand-checkoutpage-bg-grey": "--brand-checkoutpage-bg-blue",
  "--brand-checkoutpage-bg-blue": "--brand-checkoutpage-bg-grey",

  /* Ghost background main */
  "--brand-ghostbackground-bg1": "--brand-ghostbackground-bg1-inverted",
  "--brand-ghostbackground-bg1-inverted": "--brand-ghostbackground-bg1",

  "--brand-ghostbackground-bg2": "--brand-ghostbackground-bg2-inverted",
  "--brand-ghostbackground-bg2-inverted": "--brand-ghostbackground-bg2",

  /* Ghost background colors c1–c5 */
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

  /* Ghost interactive */
  "--brand-ghostbackground-interactive":
    "--brand-ghostbackground-interactive-inverted",
  "--brand-ghostbackground-interactive-inverted":
    "--brand-ghostbackground-interactive",

  /* Icon filter for dark mode */
  "--icon-filter": "--icon-filter-inverted",
  "--icon-filter-inverted": "--icon-filter",

  /* Border colors */
  "--mapped-border-and-dividers-primary": "--mapped-border-and-dividers-primary-dark",
  "--mapped-border-and-dividers-primary-dark": "--mapped-border-and-dividers-primary",
};


/** Inline SVG icons */
const MoonSVG = () => (
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 12C1.9999 13.5702 2.36955 15.1183 3.07901 16.519C3.78847 17.9197 4.8178 19.1337 6.08367 20.0627C7.34955 20.9916 8.81638 21.6095 10.3654 21.8661C11.9145 22.1228 13.5022 22.011 15 21.54C12.9696 20.9019 11.1957 19.6327 9.93641 17.9169C8.67711 16.2011 7.99807 14.1283 7.99807 12C7.99807 9.87168 8.67711 7.79888 9.93641 6.0831C11.1957 4.36733 12.9696 3.09808 15 2.46C13.5022 1.98895 11.9145 1.87723 10.3654 2.13389C8.81638 2.39054 7.34955 3.00836 6.08367 3.93731C4.8178 4.86627 3.78847 6.08026 3.07901 7.48099C2.36955 8.88173 1.9999 10.4298 2 12V12Z" fill="currentColor"/>
</svg>
);
const SunSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.998 5.528C11.7245 5.528 11.4622 5.41936 11.2688 5.22597C11.0754 5.03259 10.9668 4.77031 10.9668 4.49682V2.24699C10.9668 1.97351 11.0754 1.71123 11.2688 1.51784C11.4622 1.32446 11.7245 1.21582 11.998 1.21582C12.2715 1.21582 12.5337 1.32446 12.7271 1.51784C12.9205 1.71123 13.0291 1.97351 13.0291 2.24699V4.49682C13.0291 4.77031 12.9205 5.03259 12.7271 5.22597C12.5337 5.41936 12.2715 5.528 11.998 5.528Z" fill="currentColor"/>
<path d="M11.998 22.7768C11.7245 22.7768 11.4622 22.6681 11.2688 22.4748C11.0754 22.2814 10.9668 22.0191 10.9668 21.7456V19.4958C10.9668 19.2223 11.0754 18.96 11.2688 18.7666C11.4622 18.5732 11.7245 18.4646 11.998 18.4646C12.2715 18.4646 12.5337 18.5732 12.7271 18.7666C12.9205 18.96 13.0291 19.2223 13.0291 19.4958V21.7456C13.0291 22.0191 12.9205 22.2814 12.7271 22.4748C12.5337 22.6681 12.2715 22.7768 11.998 22.7768Z" fill="currentColor"/>
<path d="M17.3025 7.72462C17.0986 7.7246 16.8993 7.66413 16.7298 7.55085C16.5602 7.43757 16.4281 7.27657 16.35 7.0882C16.272 6.89983 16.2515 6.69255 16.2912 6.49256C16.331 6.29257 16.4291 6.10884 16.5732 5.9646L18.164 4.37378C18.3583 4.18461 18.6192 4.07954 18.8903 4.08132C19.1614 4.08311 19.4209 4.1916 19.6127 4.38332C19.8044 4.57504 19.9129 4.83455 19.9147 5.10568C19.9164 5.37681 19.8114 5.63773 19.6222 5.83195L18.0314 7.42277C17.9358 7.5186 17.8221 7.5946 17.6971 7.6464C17.572 7.6982 17.4379 7.72479 17.3025 7.72462V7.72462Z" fill="currentColor"/>
<path d="M5.10331 19.9211C4.89936 19.921 4.69999 19.8605 4.53042 19.7472C4.36085 19.6338 4.22871 19.4728 4.15069 19.2843C4.07267 19.0959 4.05229 18.8885 4.09212 18.6885C4.13195 18.4885 4.23021 18.3047 4.37446 18.1606L5.96528 16.5697C6.06056 16.4719 6.17432 16.394 6.29996 16.3405C6.4256 16.287 6.56062 16.259 6.69718 16.2581C6.83373 16.2572 6.96911 16.2834 7.09544 16.3353C7.22177 16.3871 7.33655 16.4635 7.43311 16.5601C7.52968 16.6566 7.6061 16.7714 7.65794 16.8978C7.70978 17.0241 7.73601 17.1595 7.73512 17.296C7.73422 17.4326 7.7062 17.5676 7.6527 17.6932C7.5992 17.8189 7.52127 17.9326 7.42345 18.0279L5.83263 19.6187C5.73698 19.7147 5.6233 19.7908 5.49814 19.8427C5.37298 19.8946 5.2388 19.9212 5.10331 19.9211V19.9211Z" fill="currentColor"/>
<path d="M21.7458 13.0274H19.496C19.2225 13.0274 18.9602 12.9188 18.7669 12.7254C18.5735 12.532 18.4648 12.2697 18.4648 11.9963C18.4648 11.7228 18.5735 11.4605 18.7669 11.2671C18.9602 11.0737 19.2225 10.9651 19.496 10.9651H21.7458C22.0193 10.9651 22.2816 11.0737 22.475 11.2671C22.6684 11.4605 22.777 11.7228 22.777 11.9963C22.777 12.2697 22.6684 12.532 22.475 12.7254C22.2816 12.9188 22.0193 13.0274 21.7458 13.0274Z" fill="currentColor"/>
<path d="M4.4978 13.0274H2.24797C1.97449 13.0274 1.7122 12.9188 1.51882 12.7254C1.32544 12.532 1.2168 12.2697 1.2168 11.9963C1.2168 11.7228 1.32544 11.4605 1.51882 11.2671C1.7122 11.0737 1.97449 10.9651 2.24797 10.9651H4.4978C4.77128 10.9651 5.03357 11.0737 5.22695 11.2671C5.42033 11.4605 5.52897 11.7228 5.52897 11.9963C5.52897 12.2697 5.42033 12.532 5.22695 12.7254C5.03357 12.9188 4.77128 13.0274 4.4978 13.0274Z" fill="currentColor"/>
<path d="M18.8939 19.9216C18.7584 19.9218 18.6242 19.8951 18.499 19.8432C18.3739 19.7914 18.2602 19.7153 18.1645 19.6193L16.5737 18.0285C16.3846 17.8343 16.2795 17.5733 16.2813 17.3022C16.2831 17.0311 16.3916 16.7716 16.5833 16.5799C16.775 16.3881 17.0345 16.2796 17.3056 16.2779C17.5768 16.2761 17.8377 16.3811 18.0319 16.5703L19.6227 18.1611C19.767 18.3053 19.8652 18.489 19.9051 18.6891C19.9449 18.8891 19.9245 19.0965 19.8465 19.2849C19.7685 19.4733 19.6363 19.6344 19.4668 19.7478C19.2972 19.8611 19.0978 19.9216 18.8939 19.9216V19.9216Z" fill="currentColor"/>
<path d="M6.69614 7.72462C6.56074 7.72489 6.42663 7.69835 6.30154 7.64655C6.17645 7.59474 6.06285 7.51869 5.96729 7.42277L4.37647 5.83195C4.18729 5.63773 4.08222 5.37681 4.08401 5.10568C4.08579 4.83455 4.19429 4.57504 4.38601 4.38332C4.57773 4.1916 4.83724 4.08311 5.10837 4.08132C5.37949 4.07954 5.64041 4.18461 5.83464 4.37378L7.42546 5.9646C7.56958 6.10884 7.6677 6.29257 7.70742 6.49256C7.74715 6.69255 7.72669 6.89983 7.64863 7.0882C7.57058 7.27657 7.43843 7.43757 7.26889 7.55085C7.09935 7.66413 6.90004 7.7246 6.69614 7.72462V7.72462Z" fill="currentColor"/>
<path d="M11.9957 16.7771C11.0502 16.7771 10.1258 16.4967 9.33961 15.9714C8.5534 15.4461 7.94062 14.6994 7.57877 13.8258C7.21692 12.9522 7.12224 11.9909 7.30671 11.0635C7.49118 10.1361 7.94652 9.28424 8.61514 8.61562C9.28375 7.947 10.1356 7.49167 11.063 7.3072C11.9904 7.12273 12.9517 7.2174 13.8253 7.57926C14.6989 7.94111 15.4456 8.55389 15.9709 9.3401C16.4962 10.1263 16.7766 11.0507 16.7766 11.9962C16.7751 13.2637 16.271 14.4789 15.3747 15.3752C14.4784 16.2714 13.2632 16.7756 11.9957 16.7771V16.7771Z" fill="currentColor"/>
</svg>

);

/** Helpers */
const readToken = (el, name) => {
  const sEl = getComputedStyle(el);
  const sRoot = getComputedStyle(document.documentElement);
  return (sEl.getPropertyValue(name).trim() || sRoot.getPropertyValue(name).trim() || "");
};

export default function ColorToggle({ targetId = "theme-root", storageKey = "isDarkTheme" }) {
  const [isDark, setIsDark] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Cache literal colors so we never re-reference variables
  // { lightTargets: { "--brand-white": "#fff", ... }, darkTargets: { "--brand-white": "#000", ... } }
  const cacheRef = useRef(null);

  const ensureCache = (el) => {
    if (cacheRef.current) return cacheRef.current;

    // Snapshot current (light) literal value for every LEFT key and RIGHT token
    const base = {};
    Object.entries(VAR_SWAP).forEach(([leftVar, rightToken]) => {
      base[leftVar] = readToken(el, leftVar);
      base[rightToken] = readToken(el, rightToken);
    });

    // Build static literal targets
    const lightTargets = {};
    const darkTargets = {};
    Object.entries(VAR_SWAP).forEach(([leftVar, rightToken]) => {
      lightTargets[leftVar] = base[leftVar];
      darkTargets[leftVar] = base[rightToken];
    });

    cacheRef.current = { lightTargets, darkTargets };
    return cacheRef.current;
  };

  const applyTargets = (el, targets) => {
    Object.entries(targets).forEach(([name, literal]) => {
      el.style.setProperty(name, literal);
    });
  };

  const handleToggle = () => {
    const el = document.getElementById(targetId) || document.documentElement;
    const { lightTargets, darkTargets } = ensureCache(el);
    const next = !isDark;
    applyTargets(el, next ? darkTargets : lightTargets);
    setIsDark(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
  };

  // On mount: read saved preference (fallback to prefers-color-scheme), apply immediately
  useEffect(() => {
    const el = document.getElementById(targetId) || document.documentElement;
    const cached = ensureCache(el);

    let initial = false;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) initial = JSON.parse(saved) === true;
      else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        initial = true;
      }
    } catch {}

    applyTargets(el, initial ? cached.darkTargets : cached.lightTargets);
    setIsDark(initial);
  }, [storageKey, targetId]);

  const buttonStyle = {
    backgroundColor: "transparent",
    border: "none",
    color: "var(--brand-black)",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s ease",
  };

  const hoverStyle = {
    ...buttonStyle,
    backgroundColor: "var(--brand-neon-cards-surface-light-blue)",
  };

  return (
    <button
      onClick={handleToggle}
      style={hovered ? hoverStyle : buttonStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? <SunSVG /> : <MoonSVG />}
    </button>
  );
}
