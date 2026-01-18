// AgentSidebar.jsx
import { useEffect, useCallback, useRef } from "react";
import styles from "./AgentSidebar.module.css";
import ThemeToggle from "../../components/ThemeToggle";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const isDesktop = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(min-width: 769px)").matches;

export default function AgentSidebar({
  onNavigate,
  drawerOpen,
  setDrawerOpen,
}) {
  const panelRef = useRef(null);

  // Reflect state on body
  useEffect(() => {
    const body = document.body;
    if (drawerOpen) {
      body.classList.add("drawer-open");
    } else {
      body.classList.remove("drawer-open");
    }
    return () => {
      body.classList.remove("drawer-open");
    };
  }, [drawerOpen]);

  // Close on Escape (mobile only)
  useEffect(() => {
    if (!drawerOpen || isDesktop()) return;
    const onKey = (e) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, setDrawerOpen]);

  // Close when clicking/touching anywhere outside the sidebar (mobile only)
  useEffect(() => {
    if (!drawerOpen || isDesktop()) return;

    const handlePointerDown = (e) => {
      const el = panelRef.current;
      if (!el) return;

      const path =
        typeof e.composedPath === "function" ? e.composedPath() : [];
      const clickedInside = path.length
        ? path.includes(el)
        : el.contains(e.target);

      if (!clickedInside) {
        setDrawerOpen(false);
      }
    };

    // capture phase so inside clicks don't need to stopPropagation
    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [drawerOpen, setDrawerOpen]);

  const toggleLogo = () => {
    if (isDesktop()) {
      document.body.classList.toggle("sidebar-collapsed");
    } else {
      setDrawerOpen((v) => !v);
    }
  };

  const closeDrawerIfMobile = () => {
    if (!isDesktop()) setDrawerOpen(false);
  };

  const onNewChat = useCallback(() => {
    onNavigate?.("chat");
    closeDrawerIfMobile();
  }, [onNavigate]);

  return (
    <>
      {/* Backdrop (mobile): purely visual, logic handled by document pointerdown */}
      {drawerOpen && !isDesktop() && (
        <div className={styles.drawerBackdrop} role="presentation" />
      )}

      {/* Sidebar panel */}
      <div className={styles.sidebarInner} ref={panelRef}>
        <div className={styles.logoBar}>
          <button
            className={styles.logoButton}
            onClick={toggleLogo}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <img
              src="/assets/blue_logo_transparent_square.png"
              alt=""
              className={styles.logoIcon}
            />
          </button>

          <button
            className={styles.logoButtonBar}
            onClick={toggleLogo}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <img
              src="/assets/right-bar.svg"
              alt=""
              className={styles.rightBarButton}
            />
          </button>
        </div>

        {/* Top CTA */}
        <button className={styles.primaryButton} onClick={onNewChat}>
          <img className={styles.plus} src="/assets/plus.svg" alt="" />
          <span className={styles.primaryButtonLabel}>New Chat</span>
        </button>

        {/* Scrollable area (Recent Chats) */}
        <div className={styles.scrollArea}>
          <div className={styles.sectionTitleRow}>
            <img className={styles.icon16} src="/assets/history.svg" alt="" />
            <div className={styles.textWrapper}>Recent Chats</div>
          </div>

          <div className={styles.chatCards}>
            <div
              className={`${styles.chatCard} ${styles.chatCardActive}`}
              onClick={onNewChat}
              role="button"
              tabIndex={0}
            >
              <div className={styles.chatTextBlock}>
                <div className={styles.chatTitle}>Longevity Optimization</div>
              </div>
            </div>

            <div
              className={styles.chatCard}
              onClick={onNewChat}
              role="button"
              tabIndex={0}
            >
              <div className={styles.chatTextBlock}>
                <div className={styles.chatTitle}>Supplements for sleep</div>
              </div>
            </div>

            <div
              className={styles.chatCard}
              onClick={onNewChat}
              role="button"
              tabIndex={0}
            >
              <div className={styles.chatTextBlock}>
                <div className={styles.chatTitle}>Workout plan – week 4</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom dock */}
        <div className={styles.bottomDock}>
          <div className={styles.sectionTitleRow}>
            <img
              className={styles.icon16}
              src="/assets/sparkles-outline.svg"
              alt=""
            />
            <div className={styles.textWrapper}>Quick Actions</div>
          </div>

          <div className={styles.cardGroup}>
            <div
              className={styles.buttonCardTeal}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                onNavigate?.("shop");
                closeDrawerIfMobile();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onNavigate?.("shop");
                  closeDrawerIfMobile();
                }
              }}
              aria-label="Open Shop Catalog"
              title="Shop Supplements"
            >
              <img
                className={styles.icon24}
                src="/assets/shopSupplementsIcon.svg"
                alt=""
              />
              <div className={styles.frame}>
                <div className={styles.textWrapper2}>Shop Supplements</div>
                <div className={styles.textWrapper3}>
                  Longevity-enhaced products
                </div>
              </div>
            </div>

            <div
              className={styles.buttonCardTeal2}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                onNavigate?.("/orderhistory");
                closeDrawerIfMobile();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onNavigate?.("/orderhistory");
                  closeDrawerIfMobile();
                }
              }}
              aria-label="Open Order History"
              title="Order History"
            >
              <img
                className={styles.icon24}
                src="/assets/orderHistoryIcon.svg"
                alt=""
              />
              <div className={styles.frame}>
                <div className={styles.shopSupplements}>Order History</div>
                <div className={styles.longevityEnhaced}>
                  Check your orders
                </div>
              </div>
            </div>

            <div
              className={styles.buttonCardTeal3}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                onNavigate?.("/visits");
                closeDrawerIfMobile();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onNavigate?.("/visits");
                  closeDrawerIfMobile();
                }
              }}
              aria-label="Open Visits"
              title="View Visits"
            >
              <img
                className={styles.icon24}
                src="/assets/viewVisitsIcon.svg"
                alt=""
              />
              <div className={styles.frame}>
                <div className={styles.shopSupplements2}>View Visits</div>
                <div className={styles.longevityEnhaced2}>
                  Track medical history
                </div>
              </div>
            </div>

            <div
              className={styles.buttonCardGold}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                onNavigate?.("/token");
                closeDrawerIfMobile();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onNavigate?.("/token");
                  closeDrawerIfMobile();
                }
              }}
              aria-label="Get Tokens"
              title="Get Tokens"
            >
              <img
                className={styles.icon24}
                src="/assets/token-icon.svg"
                alt=""
              />
              <div className={styles.frame}>
                <div className={styles.tokenTitle}>Get Tokens</div>
                <div className={styles.tokenSubtitle}>
                  For Compute Credits
                </div>
              </div>
            </div>

            <div
              className={styles.buttonCardRewards}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                onNavigate?.("/rewards");
                closeDrawerIfMobile();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onNavigate?.("/rewards");
                  closeDrawerIfMobile();
                }
              }}
              aria-label="View Rewards"
              title="Rewards"
            >
              <img
                className={styles.icon24}
                src="/assets/rewards-icon.svg"
                alt=""
              />
              <div className={styles.frame}>
                <div className={styles.rewardsTitle}>Rewards</div>
                <div className={styles.rewardsSubtitle}>
                  Leaderboard & stats
                </div>
              </div>
            </div>

            <div
              className={styles.buttonCardBlog}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                onNavigate?.("/blog");
                closeDrawerIfMobile();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onNavigate?.("/blog");
                  closeDrawerIfMobile();
                }
              }}
              aria-label="Read Blog"
              title="Blog"
            >
              <img
                className={styles.icon24}
                src="/assets/blog-icon.svg"
                alt=""
              />
              <div className={styles.frame}>
                <div className={styles.blogTitle}>Blog</div>
                <div className={styles.blogSubtitle}>
                  Research & insights
                </div>
              </div>
            </div>
          </div>

          <div className={styles.sidebarFooter}>
            <ThemeToggle />
            <div className={styles.connectWrapper}>
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
