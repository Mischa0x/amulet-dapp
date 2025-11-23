// pages/Agent/AgentPage.jsx
import { Outlet, useNavigate } from "react-router-dom";
import layout from "./AgentPage.module.css";
import AgentSidebar from "./AgentSidebar";
import AgentHeader from "./AgentHeader";
import WalletBar from "../../components/WalletBar";


export default function AgentPage() {
  const navigate = useNavigate();

  const handleNavigate = (target) => {
    // map sidebar intents to pretty URLs
    if (target === "chat") navigate("/agent");
    else if (target === "shop") navigate("/shop");
    else navigate(target); // e.g. "/orders" later
  };

  return (
    <div className={layout.agentLightMode}>
      <WalletBar />
      <div className={layout.grid}>
        <aside className={layout.sidebar}>
          <AgentSidebar onNavigate={handleNavigate} />
        </aside>

        <header className={layout.headerBar}>
          <AgentHeader />
        </header>

        <main className={layout.main}>
          {/* Child routes render here */}
          <Outlet />
        </main>

        <div className={layout.drawerBackdrop} />
      </div>
    </div>
  );
}
