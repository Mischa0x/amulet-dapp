# Amulet.ai Compute Credits System Design

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
**Status:** Infrastructure setup in progress

---

## Overview

A compute credit system where users pay for AI queries using credits. Credits can be obtained by:
1. **Staking AMULET tokens** (50% discount: 1 AMULET = 2 credits)
2. **Purchasing with fiat via Stripe** (1 credit = $0.05)
3. **Free tier** (40 credits for new users, 30-day expiry)

---

## Query Pricing

| Tier | Description | Credits |
|------|-------------|---------|
| **Basic** | Quick answers, simple lookups | 1 |
| **Standard** | Responses with recommendations | 3 |
| **Deep Research** | Multi-source analysis, web search | 25 |

---

## Key Decisions Made

| Decision | Choice |
|----------|--------|
| AMULET token handling | **Staked** (locked while credits active) |
| Credit expiration | **12 months** from purchase/stake |
| Free tier | **40 credits** per wallet (30-day expiry) |
| Mid-query depletion | **Grace completion** (query finishes, max -25 balance) |
| Credit usage tracking | **Vercel KV** (off-chain, fast) |
| Free tier tracking | **Vercel KV** (not on-chain) |
| Fiat payments | **Stripe** integration required |
| Staking contract | **On-chain** (Sei Testnet) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ON-CHAIN (Staking Contract)              │
│  • stake(amount) - Lock AMULET, get 2x credits              │
│  • unstake() - Unlock AMULET, forfeit remaining credits     │
│  • getStakeInfo(address) - Returns amount + timestamp       │
│  • 12-month expiration enforced in contract                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL KV (Off-chain State)              │
│  • credits:{wallet} → { used: number, lastReset: timestamp }│
│  • freetier:{wallet} → { claimed: boolean, claimedAt: ts }  │
│  • purchases:{wallet} → [{ credits, paidUSD, timestamp }]   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         API ENDPOINTS                        │
├─────────────────────────────────────────────────────────────┤
│  GET  /api/credits          → User's credit balance          │
│  POST /api/credits/use      → Deduct credits after query     │
│  POST /api/credits/claim    → Claim 40 free credits          │
├─────────────────────────────────────────────────────────────┤
│  POST /api/stripe/checkout  → Create Stripe checkout session │
│  POST /api/stripe/webhook   → Handle payment success         │
├─────────────────────────────────────────────────────────────┤
│  POST /api/chat             → (existing) Add credit check    │
└─────────────────────────────────────────────────────────────┘
```

---

## Credit Balance Calculation

```
Total Credits = Staked Credits + Purchased Credits + Free Tier - Used Credits

Where:
├── Staked Credits = stakedAMULET × 2 (if not expired)
├── Purchased Credits = sum of fiat purchases (from KV)
├── Free Tier = 40 (if claimed and not expired, from KV)
└── Used Credits = total consumed (from KV)
```

---

## Stripe Credit Packages

| Package | Credits | Fiat Price | AMULET Stake | Validity |
|---------|---------|------------|--------------|----------|
| **Free Tier** | 40 | $0 | 0 | 30 days |
| **Starter** | 100 | $5.00 | 50 AMULET | 12 months |
| **Builder** | 500 | $25.00 | 250 AMULET | 12 months |
| **Pro** | 2,000 | $100.00 | 1,000 AMULET | 12 months |
| **Enterprise** | 10,000 | $500.00 | 5,000 AMULET | 12 months |

---

## Data Models (Vercel KV)

```typescript
// Key: credits:{walletAddress}
{
  used: 127,                    // Total credits consumed
  lastQueryAt: 1705420800000    // Last activity timestamp
}

// Key: freetier:{walletAddress}
{
  claimed: true,
  claimedAt: 1705420800000,
  expiresAt: 1708012800000      // 30 days from claim
}

// Key: purchases:{walletAddress}
[
  { credits: 100, usd: 5.00, timestamp: 1705420800000, expiresAt: 1736956800000 },
  { credits: 500, usd: 25.00, timestamp: 1705420800000, expiresAt: 1736956800000 }
]
```

---

## Required Environment Variables

```env
# Existing
VITE_WALLETCONNECT_PROJECT_ID=...
ANTHROPIC_API_KEY=...

# New - Vercel KV
KV_REST_API_URL=...
KV_REST_API_TOKEN=...

# New - Stripe
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
VITE_STRIPE_PUBLISHABLE_KEY=...

# New - Staking Contract (after deployment)
VITE_STAKING_CONTRACT_ADDRESS=...
```

---

## Implementation Checklist

| # | Component | Type | Status |
|---|-----------|------|--------|
| 1 | `AmuletStaking.sol` | Smart Contract | Pending |
| 2 | Vercel KV setup | Infrastructure | Pending |
| 3 | `/api/credits.js` | API | Pending |
| 4 | `/api/credits/claim.js` | API | Pending |
| 5 | `/api/credits/use.js` | API | Pending |
| 6 | `/api/stripe/checkout.js` | API | Pending |
| 7 | `/api/stripe/webhook.js` | API | Pending |
| 8 | Update `/api/chat.js` | API | Pending |
| 9 | `TokenPage.jsx` overhaul | Frontend | Pending |
| 10 | Staking contract ABI + hooks | Frontend | Pending |

---

## SETUP PROGRESS

### 1. Stripe Account ✅ DONE
- Test mode account created
- Need to add env vars to Vercel after getting keys

### 2. Vercel KV ✅ DONE
- Database: `amulet-credits` (Upstash Redis)
- Prefix: `KV`
- Connected to amulet-dapp project

### 3. Hardhat Setup ⏳ PENDING
- Not yet installed

---

## NEXT STEPS (Resume Here)

```bash
# 1. Pull env vars locally
cd /home/mischa/amulet-dapp
npx vercel env pull .env.local

# 2. Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# 3. Initialize Hardhat (select JavaScript project)
npx hardhat init

# 4. Install OpenZeppelin
npm install @openzeppelin/contracts

# 5. Get Sei Testnet funds
# Visit: https://atlantic-2.app.sei.io/faucet
```

## Environment Variables to Add to Vercel

```env
# Stripe (get from Stripe Dashboard → Developers → API keys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Staking Contract (after deployment)
VITE_STAKING_CONTRACT_ADDRESS=0x...
```

---

## To Resume Implementation

Run Claude Code and say:
```
Resume implementing the compute credits system - I've completed the setup steps
```
