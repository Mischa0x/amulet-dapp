// src/wagmi.ts
import { http, createStorage, createConfig } from 'wagmi';
import type { Chain } from '@rainbow-me/rainbowkit';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';

// 1) Define Sei Testnet as a RainbowKit/Wagmi chain
export const seiTestnet: Chain = {
  id: 1328,
  name: 'Sei Testnet',
  nativeCurrency: {
    name: 'Sei',
    symbol: 'SEI',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://sei-rpc-proxy.vercel.app/api/rpc'], // using proxy
    },
  },
  blockExplorers: {
    default: {
      name: 'Seiscan',
      url: 'https://testnet.seiscan.io',
    },
  },
  iconBackground: '#050816',
} as const;

// 2) Set up wallet connectors for RainbowKit
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!;

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet,
        coinbaseWallet,
        walletConnectWallet,
        rainbowWallet,
      ],
    },
  ],
  {
    appName: 'Amulet AI',
    projectId,
  }
);

// 3) Create wagmi config with explicit storage for persistence
export const config = createConfig({
  chains: [seiTestnet],
  connectors,
  transports: {
    [seiTestnet.id]: http('https://sei-rpc-proxy.vercel.app/api/rpc'),
  },
  // Persist wallet connection across page refreshes and redirects
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    key: 'amulet-wallet',
  }),
  // Automatically reconnect on page load
  syncConnectedChain: true,
});
