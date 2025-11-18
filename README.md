# AMULET-DAPP

Project Overview

A decentralized application (DApp) built with React, TypeScript, and Web3 technologies, connecting to the Sei Testnet blockchain. The platform centers around longevity science, offering users advanced tools and services to enhance their health and wellness journey.

Core Features

Longevity Science Concept: The app is dedicated to exploring and promoting longevity, providing users with innovative solutions and insights to extend healthspan and lifespan.

AI Agent for Longevity Guidance: An intelligent AI-powered assistant that offers personalized advice, insights, and information related to longevity science, helping users make informed health decisions.

E-commerce Platform: A marketplace showcasing products designed to promote longevity. Users can browse, purchase, and manage longevity-focused products directly within the app.

Medical Services Integration:

- Online Doctor Consultations: Users can schedule and conduct virtual visits with doctors.
- Medical Approvals: Receive approval for treatments or tests from licensed medical professionals within the platform.
- Medical Data Uploads: Upload and manage medical test results such as blood tests, health reports, etc.
- Token and Trading: The app currently features a "dummy token" called AMULET AI, which is already tradable on the Sei testnet. This token will soon be available on the mainnet, enabling real-world transactions and asset management.

Blockchain Connectivity: All features operate seamlessly alongside the Sei blockchain (currently on testnet, with plans for mainnet deployment), ensuring security, transparency, and decentralization.

Identity & Asset Management: The platform leverages Reown for on-chain identity and asset management, enhancing user security and data control.

## Project Structure

```plaintext
AMULET-DAPP/
├── node_modules/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── GhostBackground/
│   │   ├── Dashboard.css
│   │   ├── Dashboard.tsx
│   │   ├── Footer.js
│   │   ├── Header.jsx
│   │   ├── RotatingSubtitle.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── WagmiInterface.tsx
│   ├── data/
│   │   └── products.json
│   ├── pages/
│   │   ├── Agent/
│   │   ├── Auth/
│   │   ├── Checkout/
│   │   ├── Landing/
│   │   ├── OrderHistory/
│   │   ├── ProductPage/
│   │   ├── Shop/
│   │   └── Visits/
│   ├── providers/
│   │   └── Web3Provider.tsx
│   ├── services/
│   │   └── ProductsService.tsx
│   ├── shared/
│   │   └── constants.ts
│   ├── store/
│   │   └── CartContext.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── App.tsx
│   ├── index.css
│   ├── index.jsx
│   └── main.tsx
├── .env
├── .gitignore
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```
---

## Reown Integration

This project integrates **Reown**, an on-chain UX platform, to facilitate secure and user-friendly interactions with blockchain assets and identities. The core of this integration is handled through the `@reown/appkit` and `@reown/appkit-adapter-wagmi` packages, which provide essential tools for managing on-chain identities and assets seamlessly.

### How it works:

- **Reown AppKit** (`@reown/appkit`) provides the main SDK for interacting with Reown's on-chain identity and assets management features.
- **Reown Wagmi Adapter** (`@reown/appkit-adapter-wagmi`) bridges Reown with the Wagmi library, enabling smooth integration with Ethereum wallets and providers.
- **Wagmi** and **Viem** are used for connecting to Ethereum networks, managing wallet connections, and performing blockchain operations.
- **React Query** (`@tanstack/react-query`) handles data fetching, caching, and synchronization for a responsive user experience.

### Usage with Project ID

Your project is identified with a unique **project ID** (please replace `<YOUR_PROJECT_ID>` with your actual ID). This ID links your application to your specific Reown project, enabling features like identity verification and asset management.

```js
export const config = getDefaultConfig({
  appName: 'Amulet AI',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!,
  chains: [seiTestnet],
  transports: {
    [seiTestnet.id]: http(),
  },
});
```

This setup allows the app to leverage Reown’s decentralized identity and asset features, providing users with a secure and transparent experience.

## Blockchain & Token Details

- The app connects to the **Sei Testnet** blockchain using RainbowKit and wagmi libraries, configured in `src/wagmi.ts`.
- The `VITE_WALLETCONNECT_PROJECT_ID` environment variable is required for wallet connection.
- The app interacts with a specific ERC20 token at address:  
  **`0xe8564273D6346Db0Ff54d3a6CCb1Dd12993A042c`** (Sei Testnet ERC20 token).

### Constants & Token Contract

- The app uses a minimal ERC20 ABI for token interactions, including functions like `name`, `symbol`, `decimals`, `balanceOf`, and `transfer`.
- These constants are stored in `src/shared/constants.ts` for easy reuse across the codebase.

## Features

- Modular React components for UI
- Blockchain connectivity to Sei Testnet
- Wallet integration via RainbowKit
- Token interaction capabilities
- Organized pages for user activities like authentication, shopping, and order history
- Static data management with JSON

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/amulet-dapp.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add your WalletConnect project ID:
     ```
     VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
     ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## License

This project is licensed under the MIT License.
