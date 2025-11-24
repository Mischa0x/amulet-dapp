// pages/Agent/AgentPage.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import layout from "./AgentPage.module.css";
import AgentSidebar from "./AgentSidebar";
import AgentHeader from "./AgentHeader";

export default function AgentPage() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavigate = (target) => {
    // map sidebar intents to pretty URLs
    if (target === "chat") navigate("/agent");
    else if (target === "shop") navigate("/shop");
    else navigate(target); // e.g. "/orders" later
  };

  const toggleSidebar = useCallback(() => {
    setDrawerOpen((v) => !v);
  }, []);

  return (
    <div className={layout.agentLightMode}>
      <div className={layout.grid}>
        <aside className={layout.sidebar}>
          <AgentSidebar
            onNavigate={handleNavigate}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
          />
        </aside>

        <header className={layout.headerBar}>
          <AgentHeader onToggleSidebar={toggleSidebar} />
        </header>

        <main className={layout.main}>
          {/* Child routes render here */}
          <Outlet />
        </main>

        {/* Optional: if you had a global backdrop here, you can remove it 
            because the sidebar now renders its own mobile backdrop */}
        {/* <div className={layout.drawerBackdrop} /> */}
      </div>
    </div>
  );
}
