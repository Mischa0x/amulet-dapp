# Compute Credits System

## Overview

The Amulet AI platform uses a **compute credits** system to meter AI agent interactions. Credits are consumed when users interact with the AI assistant, with costs varying by query complexity.

## Credit Tiers

| Tier | Credits | Description | Example Queries |
|------|---------|-------------|-----------------|
| **Basic Query** | 1 | Simple questions, quick answers | "What is vitamin D?", "How much sleep do I need?" |
| **Standard Analysis** | 3 | Comparisons, personalized advice | "Compare NAD+ vs NMN", "Should I take creatine?" |
| **Deep Research** | 25 | Comprehensive, evidence-based analysis | "Research longevity protocols for my age group" |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ AgentChat   │    │ TokenPage   │    │ Credits     │     │
│  │ (uses ctx)  │    │ (buy/claim) │    │ Context     │     │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘     │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Serverless APIs                    │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ /api/chat   │    │ /api/credits│    │ /api/stripe │     │
│  │ (deducts)   │    │ (balance)   │    │ (purchase)  │     │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘     │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      Vercel KV (Redis)                       │
│         Key: credits:{walletAddress}                         │
│         Value: { balance, freeClaimedAt, totalUsed, ... }   │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

### GET `/api/credits?address={walletAddress}`

Returns the credit balance for a wallet.

**Response:**
```json
{
  "balance": 40,
  "freeClaimedAt": 1705500000000,
  "stakedCredits": 0,
  "purchasedCredits": 0,
  "totalUsed": 12
}
```

### POST `/api/credits/claim`

Claims free credits (40 credits every 30 days).

**Request:**
```json
{
  "address": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "newBalance": 40,
  "message": "Successfully claimed 40 free credits"
}
```

### POST `/api/chat`

Sends a message to the AI agent. Automatically deducts credits based on query classification.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "What supplements help with sleep?" }
  ],
  "address": "0x..."
}
```

**Response:**
```json
{
  "content": "AI response here...",
  "creditInfo": {
    "tier": "standard",
    "creditsUsed": 3,
    "newBalance": 37
  }
}
```

## Query Classification Logic

Located in `api/lib/queryClassifier.js`:

```javascript
// Keywords that trigger Standard Analysis (3 credits)
const STANDARD_KEYWORDS = [
  'compare', 'recommend', 'should i', 'pros and cons',
  'best', 'versus', 'vs', 'difference between', 'personalized'
];

// Keywords that trigger Deep Research (25 credits)
const DEEP_RESEARCH_KEYWORDS = [
  'research', 'comprehensive', 'clinical trials', 'evidence',
  'long-term', 'meta-analysis', 'systematic', 'in-depth'
];
```

## KV Data Structure

Each wallet has a single key in Vercel KV:

```
Key: credits:{normalizedAddress}
Value: {
  balance: number,           // Current available credits
  freeClaimedAt: number,     // Timestamp of last free claim
  stakedCredits: number,     // Credits from AMULET staking
  purchasedCredits: number,  // Credits bought via Stripe
  totalUsed: number          // Lifetime credits consumed
}
```

## Frontend Integration

### CreditsContext (`src/contexts/CreditsContext.jsx`)

Provides shared credit state across the app:

```jsx
import { useCredits } from '../contexts/CreditsContext';

function MyComponent() {
  const { creditData, loading, refetchCredits, updateCredits } = useCredits();

  // creditData.balance - current balance
  // refetchCredits() - refresh from server
  // updateCredits(info) - update after chat response
}
```

### AgentChat Credit Display

The chat interface shows:
- Current credit balance in header bar
- Credit cost after each AI response
- "Out of credits" error with buy/claim options

### TokenPage Credit Management

Users can:
- View current balance and usage stats
- Claim free credits (40 every 30 days)
- Purchase credit packages via Stripe
- Stake AMULET tokens for 2x credits (future)

## Files

| File | Purpose |
|------|---------|
| `api/credits/index.js` | GET balance endpoint |
| `api/credits/claim.js` | POST free credit claim |
| `api/credits/use.js` | POST manual credit deduction |
| `api/credits/sync-stake.js` | POST sync staked credits |
| `api/chat.js` | Chat with auto credit deduction |
| `api/lib/queryClassifier.js` | Query tier classification |
| `src/contexts/CreditsContext.jsx` | React context for credits |
| `src/pages/Token/TokenPage.jsx` | Credit management UI |
| `src/pages/Agent/AgentChat.jsx` | Chat with credit display |

## Environment Variables

```env
# Vercel KV (auto-populated by Vercel)
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
KV_URL=
```

## Testing

```bash
# Check balance
curl "https://amulet-dapp.vercel.app/api/credits?address=0x..."

# Claim free credits
curl -X POST "https://amulet-dapp.vercel.app/api/credits/claim" \
  -H "Content-Type: application/json" \
  -d '{"address":"0x..."}'

# Test chat with credit deduction
curl -X POST "https://amulet-dapp.vercel.app/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}],"address":"0x..."}'
```
