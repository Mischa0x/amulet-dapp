# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                    │
│                         React + TypeScript                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Landing   │  │    Shop     │  │    Agent    │  │    Token    │   │
│  │    Page     │  │   Catalog   │  │    Chat     │  │    Page     │   │
│  └─────────────┘  └─────────────┘  └──────┬──────┘  └──────┬──────┘   │
│                                           │                 │           │
│  ┌────────────────────────────────────────┴─────────────────┴────────┐ │
│  │                      React Contexts                                │ │
│  │   CartContext  │  CreditsContext  │  Web3Provider (Wagmi)         │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────┬────────────────────────────┘
                                             │
                                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        VERCEL SERVERLESS APIs                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │  /api/chat  │  │/api/credits │  │ /api/stripe │  │  /api/siwe  │   │
│  │  Claude AI  │  │  Balance    │  │  Payments   │  │    Auth     │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────────────┘   │
└─────────┼────────────────┼────────────────┼─────────────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Anthropic     │ │    Vercel KV    │ │     Stripe      │
│   Claude API    │ │     (Redis)     │ │   Payments      │
└─────────────────┘ └─────────────────┘ └─────────────────┘
          │
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           SEI BLOCKCHAIN                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  AMULET Token: 0xe8564273D6346Db0Ff54d3a6CCb1Dd12993A042c      │   │
│  │  (ERC-20 on Sei Testnet)                                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              via                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  RPC Proxy: https://sei-rpc-proxy.vercel.app/api/rpc            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite |
| Styling | CSS Modules, CSS Variables (theming) |
| State | React Context (Cart, Credits) |
| Web3 | Wagmi v2, RainbowKit v2, Viem |
| Backend | Vercel Serverless Functions |
| Database | Vercel KV (Redis) |
| AI | Anthropic Claude API |
| Payments | Stripe Checkout |
| Blockchain | Sei Testnet (EVM) |
| Hosting | Vercel |

## Directory Structure

```
amulet-dapp/
├── api/                          # Vercel Serverless Functions
│   ├── chat.js                   # Claude AI + credit deduction
│   ├── credits/
│   │   ├── index.js              # GET balance
│   │   ├── claim.js              # POST claim free credits
│   │   ├── use.js                # POST deduct credits
│   │   └── sync-stake.js         # POST sync staked credits
│   ├── stripe/
│   │   ├── checkout.js           # POST create payment session
│   │   └── webhook.js            # POST handle payment events
│   ├── siwe/                     # Sign-In With Ethereum (if enabled)
│   └── lib/
│       └── queryClassifier.js    # AI query tier detection
│
├── src/
│   ├── components/               # Shared UI components
│   │   ├── GhostBackground/      # Animated background
│   │   ├── ThemeToggle.jsx       # Light/dark mode
│   │   └── Header.jsx            # App header
│   │
│   ├── contexts/                 # React Contexts
│   │   └── CreditsContext.jsx    # Credit state management
│   │
│   ├── pages/                    # Route pages
│   │   ├── Agent/                # AI chat interface
│   │   │   ├── AgentChat.jsx     # Chat component
│   │   │   ├── AgentSidebar.jsx  # Navigation sidebar
│   │   │   └── AgentHeader.jsx   # Chat header
│   │   ├── Token/                # Credit management
│   │   │   └── TokenPage.jsx     # Buy/claim/stake credits
│   │   ├── Shop/                 # Product catalog
│   │   ├── Checkout/             # Cart & checkout
│   │   ├── Landing/              # Home page
│   │   └── Auth/                 # Authentication
│   │
│   ├── providers/
│   │   └── Web3Provider.tsx      # Wagmi + RainbowKit setup
│   │
│   ├── store/
│   │   └── CartContext.jsx       # Shopping cart state
│   │
│   ├── data/
│   │   └── products.json         # Product catalog data
│   │
│   └── shared/
│       └── constants.ts          # Contract addresses, ABIs
│
├── public/
│   └── assets/                   # Images, icons
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md           # This file
│   ├── CREDITS.md                # Credit system docs
│   ├── STRIPE.md                 # Payment integration
│   └── TOKEN.md                  # AMULET token docs
│
└── Configuration Files
    ├── vite.config.ts            # Vite bundler config
    ├── vercel.json               # Vercel deployment config
    ├── tsconfig.json             # TypeScript config
    └── package.json              # Dependencies
```

## Data Flow

### 1. AI Chat with Credits

```
User sends message
       │
       ▼
┌─────────────────────┐
│ AgentChat.jsx       │
│ POST /api/chat      │
│ { messages, addr }  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ api/chat.js         │
│ 1. Classify query   │
│ 2. Check balance    │
│ 3. Call Claude API  │
│ 4. Deduct credits   │
│ 5. Return response  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ CreditsContext      │
│ updateCredits()     │
│ UI shows new balance│
└─────────────────────┘
```

### 2. Credit Purchase

```
User clicks "Buy Now"
       │
       ▼
┌─────────────────────┐
│ TokenPage.jsx       │
│ POST /api/stripe/   │
│      checkout       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Stripe Checkout     │
│ (user pays)         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ /api/stripe/webhook │
│ Add credits to KV   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Redirect to /token  │
│ ?success=true       │
│ refetchCredits()    │
└─────────────────────┘
```

### 3. Wallet Connection

```
User clicks "Connect Wallet"
       │
       ▼
┌─────────────────────┐
│ RainbowKit Modal    │
│ Select wallet       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Wagmi Provider      │
│ Connect to Sei via  │
│ RPC Proxy           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ useAccount()        │
│ address available   │
│ throughout app      │
└─────────────────────┘
```

## Environment Variables

### Required (Vercel)

```env
# AI
ANTHROPIC_API_KEY=sk-ant-...

# Web3
VITE_WALLETCONNECT_PROJECT_ID=...

# Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Vercel KV (auto-populated)
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

### Optional

```env
# Token contracts
VITE_AMULET_TOKEN_ADDRESS=0xe8564273D6346Db0Ff54d3a6CCb1Dd12993A042c
VITE_STAKING_CONTRACT_ADDRESS=

# App URL
VITE_APP_URL=https://amulet-dapp.vercel.app
```

## Deployment

### Vercel (Production)

1. Connect GitHub repo to Vercel
2. Add environment variables
3. Deploy automatically on push to `main`

### Local Development

```bash
# Install dependencies
npm install

# Pull Vercel env vars
npx vercel env pull .env.local

# Run dev server
npm run dev

# Build for production
npm run build
```

## Key Design Decisions

1. **Off-chain Credits**: Credits stored in Vercel KV (not on-chain) for speed and cost efficiency. On-chain staking syncs to off-chain credits.

2. **Query Classification**: Server-side classification prevents gaming. Users can't choose their own tier.

3. **Wallet-based Identity**: No traditional accounts. Wallet address is the user identifier.

4. **CSS Variables Theming**: Light/dark mode via CSS variable swapping, not duplicate stylesheets.

5. **Serverless APIs**: All backend logic in Vercel Functions. No separate server to maintain.
