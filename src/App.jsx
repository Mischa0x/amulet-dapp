// App.jsx
import { Route, Routes, Navigate } from 'react-router-dom';
import AgentPage from './pages/Agent/AgentPage';
import LandingPage from './pages/Landing/LandingPage';
import AgentChat from './pages/Agent/AgentChat';
import ShopCatalog from './pages/Shop/ShopCatalog';
import ProductPage from './pages/ProductPage/ProductPage';
import Cart from './pages/Checkout/Cart';
import Checkout from './pages/Checkout/Checkout';
import { CartProvider } from './store/CartContext';
import './App.css';
import OrderHistory from './pages/OrderHistory/OrderHistory';
import Visits from './pages/Visits/Visits';
import Dashboard from './components/Dashboard';
import WalletGuard from './components/WalletGuard';
import TokenPage from './pages/Token/TokenPage';
import RewardsPage from './pages/Rewards/RewardsPage';
import BlogPage from './pages/Blog/BlogPage';
import BlogPostPage from './pages/Blog/BlogPostPage';
import ReferralLanding from './pages/Referral/ReferralLanding';
import ReferralHandler from './components/ReferralHandler';

function App() {
  return (
    <div className="App">
      <main className="App-content">
        <CartProvider>
          {/* Handle referral registration on any page when wallet connects */}
          <ReferralHandler />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/ref/:address" element={<ReferralLanding />} />

            {/* Protected routes → only visible when wallet is connected */}



            <Route element={<WalletGuard />}>

              {/* Agent layout wraps main app pages */}
              <Route element={<AgentPage />}>
                <Route path="/agent" element={<AgentChat />} />
                <Route path="/shop" element={<ShopCatalog />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orderhistory" element={<OrderHistory />} />
                <Route path="/visits" element={<Visits />} />
                <Route path="/token" element={<TokenPage />} />
                <Route path="/rewards" element={<RewardsPage />} />
              </Route>
              <Route path="/dashboard" element={<Dashboard />} />

            </Route>
          

            {/* Back-compat redirects (these will still end up on protected routes) */}
            <Route path="/agent/shop" element={<Navigate to="/shop" replace />} />
            <Route path="/agent/cart" element={<Navigate to="/cart" replace />} />
            <Route path="/agent/checkout" element={<Navigate to="/checkout" replace />} />
            <Route path="/agent/orderhistory" element={<Navigate to="/orderhistory" replace />} />
            <Route path="/agent/visits" element={<Navigate to="/visits" replace />} />
          </Routes>
        </CartProvider>
      </main>
    </div>
  );
}

export default App;
