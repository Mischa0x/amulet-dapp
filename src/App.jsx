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
import AuthPage from './pages/Auth/AuthPage';
import Dashboard from './components/Dashboard';


function App() {
  return (
    <div className="App">
      <main className="App-content">
        <CartProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<Dashboard />} />   



            {/* Agent layout wraps main app pages */}
            <Route element={<AgentPage />}>
              <Route path="/agent" element={<AgentChat />} />
              <Route path="/shop" element={<ShopCatalog />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orderhistory" element={<OrderHistory />} /> 
              <Route path="/visits" element={<Visits />} /> 



            </Route>

            {/* Back-compat redirects */}
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
