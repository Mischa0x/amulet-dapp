# AMULET-DAPP

A decentralized AI health platform built with React, TypeScript, and Web3 technologies on Sei blockchain.

**Live:** https://amulet-dapp.vercel.app

## Quick Links

| Documentation | Description |
|--------------|-------------|
| [Architecture](docs/ARCHITECTURE.md) | System design, tech stack, data flow |
| [Credit System](docs/CREDITS.md) | Compute credits, tiers, APIs |
| [Stripe Integration](docs/STRIPE.md) | Payment flow, webhooks |
| [AMULET Token](docs/TOKEN.md) | Token utility, staking, contracts |

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Web3:** Wagmi v2 + RainbowKit v2 + Viem
- **Backend:** Vercel Serverless Functions
- **Database:** Vercel KV (Redis)
- **AI:** Anthropic Claude API
- **Payments:** Stripe Checkout
- **Blockchain:** Sei Testnet (EVM)

## Key Systems

### Compute Credits
AI interactions are metered via compute credits:
- **Basic Query:** 1 credit (simple questions)
- **Standard Analysis:** 3 credits (comparisons, advice)
- **Deep Research:** 25 credits (comprehensive analysis)

Credits can be obtained via:
- Free claim (40 credits every 30 days)
- Stripe purchase ($0.05/credit)
- AMULET staking (2x value - planned)

### AMULET Token
- Contract: `0xe8564273D6346Db0Ff54d3a6CCb1Dd12993A042c` (Sei Testnet)
- Utility: Stake for discounted credits, governance (future)

### Rewards Tracking System

The platform tracks user activity for a competitive leaderboard. This is implemented via middleware that records queries in Vercel KV.

**How It Works:**
1. User sends a chat message → `POST /api/chat`
2. Chat API classifies query tier and deducts credits
3. **If successful:** `recordQueryForRewards()` is called (non-blocking)
4. Rewards data is aggregated for leaderboard display

**Credit Rules:**
- Users must have sufficient credits to make queries
- **No negative balances allowed** - queries are blocked at 0 credits
- Balance never goes below 0

**API Endpoints:**
| Endpoint | Description |
|----------|-------------|
| `GET /api/rewards/leaderboard?epoch={24h\|7d\|30d\|all}` | Top 50 wallets by compute |
| `GET /api/rewards/personal?epoch={epoch}&wallet={addr}` | User's stats |
| `GET /api/rewards/social-proof?epoch={epoch}` | Platform totals |

**Storage Structure (Vercel KV):**
```
rewards:{wallet}:daily:{YYYY-MM-DD}  → Daily aggregates (90-day TTL)
rewards:{wallet}:alltime             → All-time stats
rewards:active:{YYYY-MM-DD}          → Set of active wallets per day
rewards:leaderboard:{epoch}          → Cached leaderboard (5-min TTL)
rewards:global:{epoch}               → Platform totals (5-min TTL)
```

**Anti-Gaming Measures (documented in code):**
- Streak weighting: Require minimum 5 credits/day to count as active
- Query spam caps: Rate limits via credit system
- Burst detection: Flag 10x spikes vs 7-day average
- Credit diversity: Track query tier distribution

**Swapping Mock to Real Data:**
The frontend (`src/lib/rewards/api.ts`) automatically falls back to mock data when API returns empty results. Once real users start using the platform, real data is used.

---

# Project Overview

A decentralized application (DApp) built with React, TypeScript, and Web3 technologies, connecting to the Sei Testnet blockchain. The platform centers around longevity science, offering users advanced tools and services to enhance their health and wellness journey.

## Core Features

### Longevity Science Concept  
The app is dedicated to exploring and promoting longevity, providing users with innovative solutions and insights to extend healthspan and lifespan.

### AI Agent for Longevity Guidance  
An intelligent AI-powered assistant that offers personalized advice, insights, and information related to longevity science, helping users make informed health decisions.

### E-commerce Platform  
A marketplace showcasing products designed to promote longevity. Users can browse, purchase, and manage longevity-focused products directly within the app.

### Medical Services Integration

- **Online Doctor Consultations:** Users can schedule and conduct virtual visits with doctors.  
- **Medical Approvals:** Receive approval for treatments or tests from licensed medical professionals within the platform.  
- **Medical Data Uploads:** Upload and manage medical test results such as blood tests, health reports, etc.

### Token and Trading  
The app currently features a *dummy token* called **AMULET AI**, which is already tradable on the Sei testnet. This token will soon be available on the mainnet, enabling real-world transactions and asset management.

### Blockchain Connectivity  
All features operate seamlessly alongside the Sei blockchain (currently on testnet, with plans for mainnet deployment), ensuring security, transparency, and decentralization.

### Identity & Asset Management  
The platform leverages **Reown** for on-chain identity and asset management, enhancing user security and data control.

### SIWE Authentication (Sign-In With Ethereum)  
The project uses **SIWE** to provide secure, passwordless authentication through users’ crypto wallets. SIWE enables:

- Secure login via wallet signature  
- Session persistence with secure cookies  
- Protection of authenticated routes  
- Seamless integration with React, Wagmi, and modern Web3 UX  
- A fully Web3-native onboarding experience  


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

# 🪪 Sign-In With Ethereum (SIWE) Authentication

This project implements **SIWE (Sign-In With Ethereum)** to authenticate users using their crypto wallet instead of traditional credentials.  
Authentication is handled through an **EIP-4361 signed message**, verified server-side, and stored in a **secure session cookie**.

## Why SIWE?

- 🔐 Passwordless authentication  
- 🦄 Integrates seamlessly with RainbowKit + Wagmi  
- 🍪 Uses secure, HTTP-only cookies for sessions  
- 🧱 Protects dApp routes  
- ⚡ Works across page reloads

---

# ✨ Architecture Overview

SIWE authentication consists of:

| Layer | Responsibility |
|-------|----------------|
| **Frontend (React)** | Builds + signs EIP-4361 message, manages auth state, RainbowKit integration |
| **Backend (Vercel Serverless)** | Generates nonce, verifies signatures, stores secure cookies |

The frontend signs messages; the backend verifies them.

---

# 🏗 Backend (Vercel Serverless Functions)

Backend code lives under:

```
/api/siwe/
  - nonce.ts
  - verify.ts
  - me.ts
  - logout.ts
```

All endpoints include proper CORS headers and use secure cookies (`HttpOnly`, `Secure`, `SameSite=None`).

---

## 1. `GET /api/siwe/nonce`

Generates a secure SIWE nonce using the official SIWE helper:

```ts
import { generateNonce } from "siwe";

const nonce = generateNonce();
// Stores it in a cookie:
document.cookie = "siwe-nonce=<nonce>; HttpOnly; Secure; SameSite=None";

// Returns the nonce to the frontend.
```

## 2. POST /api/siwe/verify

Payload:
```json
{
  "message": "<prepared EIP-4361 message>",
  "signature": "<wallet signature>"
}
```

Verification steps:
- Read `siwe-nonce` cookie
- Construct `SiweMessage(message)`
- Verify signature + nonce

If valid → create session cookie:

```ts
// Example of setting session cookie:
document.cookie = "siwe-session={\"address\":\"0x...\",\"chainId\":...}; HttpOnly; Secure; SameSite=None";
```

## 3. GET /api/siwe/me

Restores existing session:

**Authenticated:**
```json
{ "address": "0x1234..." }
```

**Not authenticated:**
```json
{ "address": null }
```

Used by the frontend on page load.

## 4. POST /api/siwe/logout

Clears authentication:

```ts
// Clear session cookie:
document.cookie = "siwe-session=; Max-Age=0; HttpOnly; Secure; SameSite=None";
```

Session removed.

---

# 💻 Frontend (React + Wagmi + RainbowKit)

Frontend SIWE files:

```plaintext
src/auth/siwe.ts
src/providers/Web3Provider.tsx
src/providers/AuthStatusContext.ts
src/providers/useAmuletAuthStatus.ts
```

🔹 **src/auth/siwe.ts** — SIWE Adapter  
Implements RainbowKit’s `createAuthenticationAdapter()`:

- `getNonce()` → calls backend
- `createMessage()` → builds SIWE message
- `verify()` → POST `/verify`
- `signOut()` → POST `/logout`

All requests use:

```ts
credentials: "include"
```

🔹 **Web3Provider.tsx** — Global Web3 + SIWE Wrapper  
Wraps the app with:

- `WagmiProvider`
- `RainbowKitProvider`
- `RainbowKitAuthenticationProvider`
- `AuthStatusContext`

On load, it calls:

```ts
GET /api/siwe/me
```

to restore previous sessions.

Maintains SIWE state:

```plaintext
"loading" | "unauthenticated" | "authenticated"
```

🔹 **AuthStatusContext.ts**  
Simple global context:

```ts
export const AuthStatusContext = createContext<AuthStatus>("loading");
```

Stores SIWE authentication status across the app.

🔹 **useAmuletAuthStatus.ts**  
Small hook:

```ts
const status = useAmuletAuthStatus();
```

Used in components + guards to check whether the user is authenticated.

---

# 🔐 Route Protection (WalletGuard)

Routes are only accessible when:

- Wallet is connected
- SIWE session is authenticated

Otherwise users are redirected to `/auth`.



---

🛰️ Blockchain RPC Access (via Serverless Proxy)

To protect our private Sei RPC endpoint and avoid exposing it directly to the frontend, the DApp connects to the blockchain through a dedicated serverless RPC proxy deployed on Vercel:

https://sei-rpc-proxy.vercel.app/api/rpc

Why a Proxy?

Hides the real RPC URL

Prevents exposing API keys or private nodes

Adds a security layer between users and the blockchain

Avoids rate-limit or misuse of upstream RPC endpoints

Allows future middleware such as caching, method filtering, or request logging

How It Works

All blockchain calls go through a tiny backend service located in:

/api/rpc.ts  (in the sei-rpc-proxy project)


This serverless function:

Receives JSON-RPC requests from the frontend

Forwards them to the upstream Sei RPC defined in the server’s environment variable (SEI_RPC_URL)

Returns the response back to the DApp

The actual RPC used is not exposed to the browser.

Frontend Configuration (Wagmi)

In src/wagmi.ts, the DApp is configured to use the proxy instead of a direct blockchain URL:

export const config = getDefaultConfig({
  appName: 'Amulet AI',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!,
  chains: [seiTestnet],
  transports: {
    [seiTestnet.id]: http('https://sei-rpc-proxy.vercel.app/api/rpc'),
  },
});

Backend Environment Variable

On the RPC proxy server (Vercel project), you must define:

SEI_RPC_URL=https://evm-rpc-testnet.sei-apis.com


This variable is never exposed to the client.
---

# 🔁 Full SIWE Flow Summary

1. **Connect Wallet**  
User selects wallet via RainbowKit.

2. **Request Nonce**  
Frontend sends `GET /api/siwe/nonce`  
Nonce stored in secure cookie.

3. **Build SIWE Message**  
Created using:

- domain
- wallet address
- chainId
- URI
- version
- statement
- nonce

4. **Sign Message**  
Wallet shows signature popup.

5. **Verify Signature**  
Frontend sends:

```bash
POST /api/siwe/verify
```

Backend verifies and sets session cookie.

6. **App Unlocks**  
Frontend updates state to:

```plaintext
"authenticated"
```

User can now access protected routes.

---

# 🎉 Final Result

With SIWE fully implemented:

- Users log in using their wallet
- No passwords or email required
- Full Web3-native authentication
- Sessions persist via secure cookies
- Works with Wagmi v2 + RainbowKit v2
- Fully deployed and working on Vercel



## Project Features

- Modular React components for UI
- Blockchain connectivity to Sei Testnet
- Wallet integration via RainbowKit / SIWE
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
