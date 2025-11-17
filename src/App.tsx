// src/App.tsx
import './App.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <div className="app-container">
      <header className="topbar">
        <div className="brand">
          <span className="brand-title">Amulet AI</span>
          <span className="brand-badge">Sei Testnet</span>
        </div>

        <ConnectButton
          chainStatus={{
            smallScreen: 'icon',
            largeScreen: 'full',
          }}
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
          }}
          showBalance={{ smallScreen: false, largeScreen: true }}
        />
      </header>

      <main className="main">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
