// App.jsx
import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { CartProvider } from './store/CartContext';
import './App.css';

// Critical path components loaded synchronously
import LandingPage from './pages/Landing/LandingPage';
import AgentPage from './pages/Agent/AgentPage';
import AgentChat from './pages/Agent/AgentChat';
import WalletGuard from './components/WalletGuard';
import ReferralHandler from './components/ReferralHandler';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-loaded components for code splitting
const ShopCatalog = lazy(() => import('./pages/Shop/ShopCatalog'));
const ProductPage = lazy(() => import('./pages/ProductPage/ProductPage'));
const Cart = lazy(() => import('./pages/Checkout/Cart'));
const Checkout = lazy(() => import('./pages/Checkout/Checkout'));
const OrderHistory = lazy(() => import('./pages/OrderHistory/OrderHistory'));
const Visits = lazy(() => import('./pages/Visits/Visits'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const TokenPage = lazy(() => import('./pages/Token/TokenPage'));
const RewardsPage = lazy(() => import('./pages/Rewards/RewardsPage'));
const BlogPage = lazy(() => import('./pages/Blog/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/Blog/BlogPostPage'));
const ReferralLanding = lazy(() => import('./pages/Referral/ReferralLanding'));
const AuthPage = lazy(() => import('./pages/Auth/AuthPage'));

// Simple loading fallback
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
    <div style={{ width: '32px', height: '32px', border: '3px solid var(--brand-blue-dark)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
  </div>
);

function App() {
  return (
    <div className="App">
      <main className="App-content">
        <ErrorBoundary>
        <CartProvider>
          {/* Handle referral registration on any page when wallet connects */}
          <ReferralHandler />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
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

              {/* Back-compat redirects */}
              <Route path="/agent/shop" element={<Navigate to="/shop" replace />} />
              <Route path="/agent/cart" element={<Navigate to="/cart" replace />} />
              <Route path="/agent/checkout" element={<Navigate to="/checkout" replace />} />
              <Route path="/agent/orderhistory" element={<Navigate to="/orderhistory" replace />} />
              <Route path="/agent/visits" element={<Navigate to="/visits" replace />} />
            </Routes>
          </Suspense>
        </CartProvider>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
