// src/wagmi.ts
import { http } from 'wagmi';
import type { Chain } from '@rainbow-me/rainbowkit';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

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
      http: ['https://evm-rpc-testnet.sei-apis.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Seiscan',
      url: 'https://testnet.seiscan.io',
    },
  },
  iconBackground: '#050816',
  // Optional: put a real icon in /public
  // iconUrl: '/sei-logo.svg',
} as const;

// 2) Use RainbowKit’s helper to create the wagmi config
export const config = getDefaultConfig({
  appName: 'Amulet AI',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!,
  chains: [seiTestnet],
  transports: {
    [seiTestnet.id]: http(),
  },
});
