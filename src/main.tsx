// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { Buffer } from 'buffer';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@rainbow-me/rainbowkit/styles.css';



import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import type { Theme } from '@rainbow-me/rainbowkit';

import { config } from './wagmi';

// --- Buffer polyfill (no any) ---
(globalThis as unknown as { Buffer?: typeof Buffer }).Buffer ??= Buffer;

// --- Query client for wagmi/react-query ---
const queryClient = new QueryClient();

// --- Amulet-themed RainbowKit dark theme ---
const amuletTheme: Theme = darkTheme({
  accentColor: '#8A2BE2', // Amulet purple
  accentColorForeground: '#ffffff',
  borderRadius: 'large',
  fontStack: 'rounded',
  overlayBlur: 'small',
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={amuletTheme}
          modalSize="compact"
          appInfo={{
            appName: 'Amulet AI',
            learnMoreUrl: 'https://example.com', // swap to your site


disclaimer: ({ Text, Link }) => (
  <Text>
    By connecting a wallet you agree to the{' '}
    <Link href="https://example.com/terms">
      Amulet AI Terms of Service
    </Link>
    . Need test SEI? Use the{' '}
    <Link href="https://sei-faucet.com">
      Sei testnet faucet
    </Link>
    .
  </Text>
),





          }}



        >
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
