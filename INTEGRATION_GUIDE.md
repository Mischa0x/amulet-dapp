# Amulet DApp Integration Guide

**Source:** `github.com/Mischa0x/amulet-dapp`
**Target:** `github.com/mszsorondo/amulet.ai` (branch: `new_frontend`)
**Date:** 2026-01-20 (Updated with auth improvements & admin dashboard)

---

## Table of Contents

1. [Conflict Analysis](#1-conflict-analysis)
2. [Security Architecture](#2-security-architecture)
3. [Blog System](#3-blog-system)
4. [Compute Credits Methodology](#4-compute-credits-methodology)
5. [Query Credit Tracking System](#5-query-credit-tracking-system)
6. [Stripe Integration](#6-stripe-integration)
7. [Referral System](#7-referral-system)
8. [View Visits Page (Beluga Integration)](#8-view-visits-page-beluga-integration)
9. [Order History Page (Beluga Integration)](#9-order-history-page-beluga-integration)
10. [Shop Supplements Page (Beluga Integration)](#10-shop-supplements-page-beluga-integration)
11. [Environment Variables](#11-environment-variables)
12. [Authentication & Admin System](#12-authentication--admin-system) *(NEW)*
13. [Migration Checklist](#13-migration-checklist)

---

## 1. Conflict Analysis

### Backend Endpoints - NO CONFLICTS

| Existing Backend (mszsorondo) | New Frontend (Mischa0x) | Conflict? |
|-------------------------------|-------------------------|-----------|
| `/api/chat/integrated_chat` | `/api/chat` | **NO** - Different paths |
| `/api/checkout/create-session` | `/api/stripe/checkout` | **NO** - Different paths |
| — | `/api/credits/*` | **NO** - New endpoints |
| — | `/api/stripe/webhook` | **NO** - New endpoint |

### Key Isolation Points

1. **Chat API**: The new `/api/chat` endpoint is standalone and does NOT call the existing `/api/chat/integrated_chat`. They can coexist or be merged later.

2. **Checkout/Stripe**: The new Stripe integration uses `/api/stripe/*` paths, completely separate from `/api/checkout/*`.

3. **Credits System**: Entirely new - uses Vercel KV, no database dependencies on existing backend.

4. **Frontend Pages**: All new pages (Blog, Token, Visits, OrderHistory, Shop) are additive and don't modify existing components.

---

## 2. Security Architecture

### Overview
A 4-phase security audit was conducted on 2026-01-19. All critical and high-severity issues have been addressed.

### Security Features Implemented

#### Persistent Rate Limiting (Vercel KV)
Rate limiting now uses Vercel KV for persistence across serverless cold starts.

**Location:** `lib/apiUtils.js`

```javascript
// Rate limiting is now async and persistent
const rateLimit = await checkRateLimit(identifier, maxRequests, windowMs);
```

**Key Features:**
- Persists across serverless function instances
- Uses TTL-based automatic cleanup
- Graceful fallback to in-memory if KV unavailable
- All API endpoints updated to use `await`

#### CORS Origin Validation
All API endpoints validate request origins against an allowlist.

**Allowed Origins:**
- `https://amulet-dapp.vercel.app`
- `https://amulet-dapp-git-main-mischa0x.vercel.app`
- `http://localhost:5173` (dev only)
- `http://localhost:3000` (dev only)

#### Input Validation
- Ethereum addresses validated with regex: `/^0x[a-fA-F0-9]{40}$/`
- All user inputs sanitized before use
- DOMPurify used for HTML content (blog posts)

#### Stripe Security
- Webhook signature verification required
- Server-side package validation (prevents credit manipulation)
- `VITE_APP_URL` prevents open redirect in checkout

### Shared Utilities

**Location:** `lib/` (outside `/api/` to reduce Vercel function count)

```
lib/
├── apiUtils.js          # CORS, rate limiting, address validation
├── logger.js            # Structured logging
├── queryClassifier.js   # Query tier classification
└── rewardsMiddleware.js # Rewards tracking
```

### Smart Contract Security

**TestAmulet.sol** - Contains unrestricted `faucet()` function.
- ⚠️ **TESTNET ONLY** - Never deploy to mainnet
- Prominent warning added in contract comments

**AmuletStaking.sol** - Production-ready
- Uses OpenZeppelin's `ReentrancyGuard`
- Uses `SafeERC20` for token transfers
- Access control via `Ownable`

### Dependencies
All dependency vulnerabilities resolved via `npm audit fix`:
- h3: Request Smuggling (TE.TE) - Fixed
- hono: JWT Algorithm Confusion - Fixed
- react-router: CSRF/XSS issues - Fixed

---

## 3. Blog System

### Overview
A markdown-based blog system with category filtering, inspired by Hemi.xyz.

### Files to Copy

```
src/pages/Blog/
├── BlogPage.jsx           # List view with category filtering
├── BlogPage.module.css
├── BlogPostPage.jsx       # Individual post view
└── BlogPostPage.module.css

src/components/blog/
├── BlogCard.jsx           # Post card component
├── BlogCard.module.css
├── BlogGrid.jsx           # Responsive grid layout
├── BlogGrid.module.css
├── CategoryPills.jsx      # Filter pills (sticky on desktop)
├── CategoryPills.module.css
├── SubscribeBlock.jsx     # Email capture block
└── SubscribeBlock.module.css

src/data/
└── blogPosts.js           # Generated post data (auto-generated)

scripts/
└── process-blog-posts.js  # Markdown processor

content/blog/
├── *.md                   # Markdown blog posts
└── (add new posts here)

public/blog/
└── *.jpg/png/svg          # Hero images
```

### Routes to Add

```jsx
// In your router (App.jsx or similar)
<Route path="/blog" element={<BlogPage />} />
<Route path="/blog/:slug" element={<BlogPostPage />} />
```

### Build Script

Add to `package.json`:
```json
{
  "scripts": {
    "blog:process": "node scripts/process-blog-posts.js"
  }
}
```

### Workflow
1. Write markdown files in `/content/blog/`
2. Run `npm run blog:process` to generate `blogPosts.js`
3. Deploy - posts are statically included

### Markdown Format
```markdown
---
title: Your Post Title
publishedAt: 2026-01-20
heroImage: /blog/your-image.jpg
categories:
  - AI
  - Longevity
readingTime: 8 min read
author: Your Name
---

Content with **bold**, *italic*, ## headings.
URLs are auto-linked: https://example.com
```

### Categories
- AI, Longevity, Treatments, Supplements, Tokens
- Colors defined in `CATEGORY_COLORS` in `blogPosts.js`

### Dependencies
- None external - pure React + CSS Modules
- No backend required - static content

---

## 4. Compute Credits Methodology

### Overview
A tokenomics system where users pay for AI queries using credits. Credits can be obtained via:
1. **Free tier**: 40 credits every 30 days
2. **Fiat purchase**: Via Stripe ($0.035-$0.05 per credit)
3. **Token staking**: Lock AMULET tokens for 2x credits

### Design Document
See `COMPUTE_CREDITS_DESIGN.md` for full specification.

### Credit Packages

| Tier | Credits | Price | Per Credit | Discount |
|------|---------|-------|------------|----------|
| Mortal | 100 | $5.00 | $0.050 | — |
| Awakened | 500 | $22.50 | $0.045 | 10% |
| Transcendent | 2,000 | $80.00 | $0.040 | 20% |
| Immortal | 10,000 | $350.00 | $0.035 | 30% |

### Query Costs

| Query Type | Credits | Trigger |
|------------|---------|---------|
| Basic | 1 | Simple questions, <100 chars |
| Standard | 3 | Comparisons, 100-500 chars |
| Deep Research | 25 | Research keywords, >500 chars |

### Files to Copy

```
src/pages/Token/
├── TokenPage.jsx          # Credits dashboard + purchase
└── TokenPage.module.css

src/contexts/
└── CreditsContext.jsx     # React context for credits state

COMPUTE_CREDITS_DESIGN.md  # Full design specification
```

### Frontend Integration

Wrap your app with the credits provider:
```jsx
// main.tsx or App.jsx
import { CreditsProvider } from './contexts/CreditsContext';

<CreditsProvider>
  <App />
</CreditsProvider>
```

Use the hook in components:
```jsx
import { useCredits } from '../contexts/CreditsContext';

function MyComponent() {
  const { creditData, loading, refetchCredits } = useCredits();
  // creditData.balance, creditData.totalUsed, etc.
}
```

### Dependencies
- Vercel KV (or compatible Redis)
- Stripe (for purchases)
- wagmi/viem (for staking - optional)

---

## 5. Query Credit Tracking System

### Overview
Automatic credit deduction integrated into the chat API. Classifies queries and charges accordingly.

### Files to Copy

```
api/
├── chat.js                    # Chat endpoint with credit integration
└── credits/
    ├── index.js               # GET /api/credits - fetch balance
    ├── claim.js               # POST /api/credits/claim - free credits
    └── sync-stake.js          # POST /api/credits/sync-stake - blockchain

lib/
├── apiUtils.js                # CORS, rate limiting, address validation
├── logger.js                  # Structured logging
├── queryClassifier.js         # Query tier classification
└── rewardsMiddleware.js       # Rewards tracking
```

### API Endpoints

#### GET `/api/credits?address=0x...`
Returns user's credit balance.

**Response:**
```json
{
  "address": "0x...",
  "balance": 127,
  "freeClaimedAt": 1705420800000,
  "stakedCredits": 0,
  "purchasedCredits": 100,
  "totalUsed": 13
}
```

#### POST `/api/credits/claim`
Claim 40 free credits (30-day cooldown).

**Request:** `{ "address": "0x..." }`

**Response:**
```json
{
  "success": true,
  "creditsClaimed": 40,
  "newBalance": 167,
  "nextClaimAt": 1708012800000
}
```

#### POST `/api/chat`
Chat with AI, auto-deducts credits.

**Request:**
```json
{
  "messages": [{ "role": "user", "content": "..." }],
  "address": "0x..."
}
```

**Response includes:**
```json
{
  "content": "AI response...",
  "credits": {
    "tier": "standard",
    "tierName": "Standard Analysis",
    "creditsUsed": 3,
    "previousBalance": 127,
    "newBalance": 124,
    "reason": "Message length and context indicate moderate complexity"
  }
}
```

### Query Classification Logic

Located in `api/lib/queryClassifier.js`:

```javascript
// Deep Research (25 credits)
- Keywords: "research", "comprehensive", "studies show", "evidence"
- Message length > 500 characters
- Long conversation history

// Standard Analysis (3 credits)
- Keywords: "compare", "vs", "recommend", "personalized"
- Message length > 100 characters with follow-ups

// Basic Query (1 credit)
- Everything else
```

### KV Data Model

```javascript
// Key: credits:{address}
{
  balance: 127,
  freeClaimedAt: 1705420800000,
  stakedCredits: 0,
  purchasedCredits: 100,
  totalUsed: 13,
  stakeExpiresAt: null,
  lastStakeSyncAt: null
}

// Key: transactions:{address} (list)
[
  { type: "free_claim", amount: 40, timestamp: ... },
  { type: "purchase", amount: 100, packageId: "starter", ... },
  { type: "use", amount: 3, queryType: "standard", ... }
]
```

### Credit Rules (Updated 2026-01-18)
- **No negative balances allowed** - queries blocked when `balance < creditCost`
- Balance never goes below 0
- Users must purchase more credits or claim free tier to continue

### Dependencies
- `@vercel/kv` package
- Vercel KV database (Upstash Redis)

---

## 6. Stripe Integration

### Overview
Payment processing for credit purchases with webhook verification.

### Files to Copy

```
api/stripe/
├── checkout.js            # Creates Stripe checkout session
└── webhook.js             # Handles payment completion
```

### Endpoints

#### POST `/api/stripe/checkout`
Creates checkout session and returns redirect URL.

**Request:**
```json
{
  "packageId": "awakened",
  "address": "0x..."
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

#### POST `/api/stripe/webhook`
Called by Stripe on payment completion.

**Event:** `checkout.session.completed`

**Actions:**
1. Verify webhook signature
2. Extract wallet address from metadata
3. Add credits to user's balance
4. Log transaction

### Webhook Setup in Stripe Dashboard

1. Go to Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select event: `checkout.session.completed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### Frontend Integration

```jsx
const handlePurchase = async (packageId) => {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ packageId, address: walletAddress }),
  });
  const { url } = await res.json();
  window.location.href = url; // Redirect to Stripe
};
```

### Success/Cancel Redirects
- Success: `/token?success=true`
- Cancel: `/token?canceled=true`

### Dependencies
- `stripe` npm package
- Stripe account (test or live)

---

## 6.5 Rewards Tracking System

### Overview
Gamified leaderboard tracking user compute credit usage. Tracks queries, calculates ranks, and displays social proof metrics.

### Files to Copy

```
api/rewards/
├── middleware.js          # Core tracking logic (recordQueryForRewards)
├── leaderboard.js         # GET /api/rewards/leaderboard
├── personal.js            # GET /api/rewards/personal
└── social-proof.js        # GET /api/rewards/social-proof

src/pages/Rewards/
├── RewardsPage.jsx        # Main rewards dashboard
└── RewardsPage.module.css

src/components/rewards/
├── PersonalSummaryCard.jsx/.css    # User stats card
├── LeaderboardTable.jsx/.css       # Top 50 leaderboard
├── EpochTabs.jsx/.css              # Time period selector
├── SocialProofStrip.jsx/.css       # Platform totals
├── RewardsInfoAccordion.jsx/.css   # How it works info
└── ProgressRing.jsx/.css           # Progress indicator

src/lib/rewards/
├── api.ts                 # Frontend API client with mock fallback
└── mockData.ts            # Demo data for empty states
```

### Route

```jsx
<Route path="/rewards" element={<RewardsPage />} />
```

### API Endpoints

#### GET `/api/rewards/leaderboard?epoch={24h|7d|30d|all}`
Returns top 50 wallets by compute usage.

**Response:**
```json
[
  {
    "wallet": "0x1234...",
    "rank": 1,
    "totalComputeUsed": 547,
    "queriesRun": 312,
    "activeDays": 14,
    "currentStreak": 7
  }
]
```

#### GET `/api/rewards/personal?epoch={epoch}&wallet={address}`
Returns user's personal stats and rank.

**Response:**
```json
{
  "rank": 12,
  "totalComputeUsed": 89,
  "queriesRun": 47,
  "activeDays": 5,
  "currentStreak": 3,
  "longestStreak": 5,
  "percentile": 85
}
```

#### GET `/api/rewards/social-proof?epoch={epoch}`
Returns platform-wide aggregates.

**Response:**
```json
{
  "activeWallets": 234,
  "totalComputeUsed": 12547,
  "totalQueries": 8234
}
```

### Integration with Chat API

The middleware is called automatically in `api/chat.js` after successful credit deduction:

```javascript
// In chat.js (already integrated)
import { recordQueryForRewards } from './rewards/middleware.js';

// After deducting credits:
recordQueryForRewards(address, creditCost, classification.tier).catch(err => {
  console.error('Rewards tracking failed:', err);
});
```

**Key:** The rewards tracking is non-blocking - it won't slow down chat responses or cause errors if it fails.

### KV Data Model

```javascript
// Per-wallet daily aggregates (90-day TTL)
rewards:{wallet}:daily:{YYYY-MM-DD}
{
  computeUsed: 15,
  queriesRun: 8,
  queryTiers: { basic: 5, standard: 2, deep_research: 1 }
}

// Per-wallet all-time stats
rewards:{wallet}:alltime
{
  computeUsed: 547,
  queriesRun: 312,
  firstQueryAt: timestamp,
  lastQueryAt: timestamp
}

// Active wallets per day (set)
rewards:active:{YYYY-MM-DD}

// Cached leaderboard (5-min TTL)
rewards:leaderboard:{epoch}

// Platform totals (5-min TTL)
rewards:global:{epoch}
```

### Mock Data Fallback

The frontend (`src/lib/rewards/api.ts`) automatically uses mock data when:
- API returns empty results
- No real users have queried yet

Once real usage occurs, mock data is replaced with live data.

### Dependencies
- `@vercel/kv` package (shared with credits system)
- No additional database setup required

---

## 7. Referral System

### Overview
Simple referral system where users earn points for inviting others.

**Rewards:**
- +1 point for referrer when someone uses their link
- +1 point for referee for signing up via referral

### Files

```
api/refs/
└── index.js           # Combined GET/POST referral API

src/components/
├── ReferralHandler.jsx    # App-level auto-registration
└── rewards/ReferAndEarn.jsx  # Share link UI

src/pages/Referral/
└── ReferralLanding.jsx    # Captures referrer from URL
```

### API Endpoints

#### GET `/api/refs?address=0x...`
Returns referral stats for a wallet.

**Response:**
```json
{
  "address": "0x...",
  "referralCount": 5,
  "referralPoints": 5,
  "referredBy": "0x..." | null
}
```

#### POST `/api/refs`
Registers a new referral.

**Request:**
```json
{
  "referrer": "0x...",
  "referee": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "referrer": "0x...",
  "referee": "0x...",
  "referrerTotalReferrals": 6
}
```

### Referral Flow
1. User copies referral link: `https://amulet-dapp.vercel.app/ref/{address}`
2. Friend clicks link → `ReferralLanding.jsx` stores referrer in localStorage
3. Friend connects wallet on any page
4. `ReferralHandler.jsx` (app-level) POSTs to `/api/refs`
5. Both parties receive +1 referral point

### KV Storage
```
referrals:{wallet}:count   - Number of people referred
referrals:{wallet}:points  - Referral points earned
referrals:{wallet}:list    - Set of referred addresses
referred_by:{wallet}       - Who referred this wallet
```

### Anti-Abuse
- Self-referral blocked (`referrer === referee`)
- One referrer per wallet (can't change after first registration)
- Rate limited (20 POST requests per minute)

---

## 8. View Visits Page (Beluga Integration)

### Overview
Medical consultation tracking with doctor visits, status tracking, and questionnaire tabs.

### Files to Copy

```
src/pages/Visits/
├── Visits.jsx             # Main visits page
└── Visits.module.css
```

### Route

```jsx
<Route path="/visits" element={<Visits />} />
```

### Features
- Two-column layout: visits list + detail panel
- Visit status badges: pending (yellow), approved (green), denied (red)
- Right panel shows:
  - Status with icon
  - Order items
  - Tabbed questionnaires (Privacy, Consent, Health, Personal)
- Mock data currently - **replace with Beluga API calls**

### Beluga Integration Points

Replace mock data in `Visits.jsx`:

```jsx
// Current mock data at line ~10-40
const MOCK_VISITS = [...];

// Replace with API call:
const [visits, setVisits] = useState([]);

useEffect(() => {
  fetch('/api/beluga/visits', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(setVisits);
}, []);
```

### Visit Data Schema

```javascript
{
  id: "visit-001",
  doctorName: "Dr. Sarah Mitchell",
  specialization: "Internal Medicine",
  date: "2026-01-15",
  status: "pending" | "approved" | "denied",
  consultationName: "Erectile Dysfunction Consultation",
  consultationPrice: 49.99,
  visitReason: "Initial consultation for ED medication",
  statusMessage: "Awaiting physician review"
}
```

### Dependencies
- None external for UI
- Beluga API for real data

---

## 9. Order History Page (Beluga Integration)

### Overview
Paginated, sortable order history table with status tracking.

### Files to Copy

```
src/pages/OrderHistory/
├── OrderHistory.jsx       # Orders table with pagination
└── OrderHistory.module.css
```

### Route

```jsx
<Route path="/orderhistory" element={<OrderHistory />} />
```

### Features
- Sortable columns: #, Type, Description, Order Status, Payment Status, Date
- Pagination: 20 orders per page
- Status badges with color coding
- "View Details" action buttons
- Responsive: hides columns on mobile/tablet

### Beluga Integration Points

Replace mock data:

```jsx
// Current mock at line ~5-50
const MOCK_ORDERS = [...];

// Replace with:
const [orders, setOrders] = useState([]);

useEffect(() => {
  fetch('/api/beluga/orders', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(setOrders);
}, []);
```

### Order Data Schema

```javascript
{
  id: "ORD-001",
  type: "Medication" | "Supplement",
  description: "Sildenafil 50mg x 30 tablets",
  orderStatus: "SENT" | "PROCESSING",
  paymentStatus: "PAID" | "PENDING" | "FAILED",
  date: "2026-01-15",
  total: 29.99
}
```

### Dependencies
- None external for UI
- Beluga API for real data

---

## 10. Shop Supplements Page (Beluga Integration)

### Overview
Product catalog with category filtering, search, and cart integration.

### Files to Copy

```
src/pages/Shop/
├── ShopCatalog.jsx        # Main container
├── ShopCatalog.module.css
├── ShopProductGrid.jsx    # Product grid
├── ShopProductGrid.module.css
├── ShopFilters.jsx        # Search + category tabs
├── ShopFilters.module.css
├── ShopHeader.jsx         # Title + cart icon
├── ShopHeader.module.css
├── ShopCategoryFilter.jsx # Individual filter tab
└── ShopCategoryFilter.module.css

src/pages/ProductPage/
├── ProductPage.jsx        # Product detail page
└── ProductPage.module.css

src/data/
└── products.json          # Product catalog (26 items)

src/services/
└── ProductsService.jsx    # Product data access

src/store/
└── CartContext.jsx        # Shopping cart state

public/assets/
└── skill-*.svg            # Category icons (9 files)
```

### Routes

```jsx
<Route path="/shop" element={<ShopCatalog />} />
<Route path="/product/:productId" element={<ProductPage />} />
```

### Categories (Skills)
- RESTORATION, VITALITY, REGEN, HORMONAL, CLARITY
- ALTERNATIVE, METABOLICS, LONGEVITY, STRUCTURE

### Beluga Integration Points

Option A: **Keep static products.json** (current)
- Products are static, orders go to Beluga

Option B: **Fetch from Beluga API**
```jsx
// Replace ProductsService.jsx
export async function listProducts() {
  const res = await fetch('/api/beluga/products');
  return res.json();
}
```

### Cart Integration
The `CartContext.jsx` manages cart state with localStorage persistence.

For Beluga checkout:
```jsx
const handleCheckout = async () => {
  const res = await fetch('/api/beluga/checkout', {
    method: 'POST',
    body: JSON.stringify({
      items: cartItems,
      shippingAddress: formData,
      walletAddress: address
    })
  });
  // Handle Beluga checkout response
};
```

### Product Schema

```javascript
{
  "id": "ed-viagra",
  "slug": "sildenafil-viagra",
  "category": "Erectile Dysfunction",
  "name": "Sildenafil (Viagra)",
  "description": "FDA-approved medication...",
  "status": "Top seller",
  "price": 19.99,
  "skill": "RESTORATION"
}
```

### Dependencies
- None external for UI
- Beluga API for real orders/checkout

---

## 11. Environment Variables

### Required Variables

```bash
# ========== EXISTING (keep these) ==========
# Your existing backend variables...

# ========== NEW - Add these ==========

# AI (Claude API)
ANTHROPIC_API_KEY=sk-ant-api03-...

# Vercel KV (Credits Storage)
KV_URL=redis://...
KV_REST_API_URL=https://...upstash.io
KV_REST_API_TOKEN=AX...

# Stripe (Credit Purchases)
STRIPE_SECRET_KEY=sk_test_...           # or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... # or pk_live_...

# Smart Contracts (Optional - for staking)
VITE_AMULET_TOKEN_ADDRESS=0xe8564273D6346Db0Ff54d3a6CCb1Dd12993A042c
VITE_STAKING_CONTRACT_ADDRESS=0x...     # After deployment

# App URL (REQUIRED for Stripe redirects - prevents open redirect)
VITE_APP_URL=https://your-domain.com

# WalletConnect
VITE_WALLETCONNECT_PROJECT_ID=your_project_id

# Admin Dashboard (optional)
ADMIN_SECRET=your_secure_admin_key
```

### Vercel KV Setup

1. Go to Vercel Dashboard → Storage → Create Database
2. Select "KV" (Upstash Redis)
3. Name it (e.g., `amulet-credits`)
4. Connect to your project
5. Pull env vars: `npx vercel env pull .env.local`

---

## 12. Authentication & Admin System

### Overview (Updated 2026-01-20)
The app supports dual authentication: Web3 wallet connection AND email/password login.

### Authentication Modes

| Mode | Access | Features |
|------|--------|----------|
| **Wallet Only** | All pages except Visits/OrderHistory | AI chat (requires wallet for credits), Shop, Rewards |
| **Email Auth** | All pages | Visits, Order History, Logout button visible |
| **Both** | Full access | Recommended for full functionality |

### Logout Button
- Only visible when user is logged in with email (not wallet-only)
- Located in sidebar footer (bottom left)
- Clears `authToken` and `user` from localStorage
- Redirects to landing page

### Query Blocking (Wallet Required)
- AI chat queries require a connected wallet
- When wallet disconnected:
  - Input shows "Connect wallet to chat..."
  - Send button disabled
  - Welcome message shows connection prompt
- Users can still browse shop, rewards, blog, etc.

### Menu Visibility
| Menu Item | Wallet Only | Email Auth |
|-----------|-------------|------------|
| Shop Supplements | ✅ | ✅ |
| Get Tokens | ✅ | ✅ |
| Rewards | ✅ | ✅ |
| Blog | ✅ | ✅ |
| Order History | ❌ | ✅ |
| View Visits | ❌ | ✅ |

### Admin Dashboard

**Route:** `/admin`

**Features:**
- View all users with credit balances
- Summary stats: total users, credits in circulation, credits used
- Search users by wallet address
- Adjust credits (add/subtract) with reason tracking
- Transaction history per user

**Access Control:**
Set `ADMIN_SECRET` in Vercel environment variables, then:
1. Go to `/admin`
2. Enter admin key in the input field
3. Key is stored in localStorage for session

**API Endpoints (merged into credits API):**
```
GET  /api/credits?action=admin-list     - List all users (admin only)
POST /api/credits?action=admin-adjust   - Adjust user credits (admin only)
```

**Request Headers:**
```
x-admin-key: {ADMIN_SECRET value}
```

### Files Modified

```
src/pages/Agent/AgentSidebar.jsx    - Logout button, menu visibility
src/pages/Agent/AgentSidebar.module.css
src/pages/Agent/AgentChat.jsx       - Query blocking when wallet disconnected
src/pages/Agent/AgentChat.module.css
src/pages/Admin/AdminPage.jsx       - New admin dashboard
src/pages/Admin/AdminPage.module.css
api/credits/index.js                - Admin endpoints added
public/assets/logout-icon.svg       - New icon
```

---

## 13. Migration Checklist

### Phase 0: Security Setup (Do This First)

- [ ] Run `npm audit fix` to resolve dependency vulnerabilities
- [ ] Copy `lib/` folder (apiUtils.js, logger.js, queryClassifier.js, rewardsMiddleware.js)
- [ ] Set `VITE_APP_URL` in Vercel environment variables
- [ ] Verify CORS origins in `lib/apiUtils.js` match your domains
- [ ] **Never deploy TestAmulet.sol to mainnet** (testnet only!)

### Phase 1: Core Pages (No Backend Dependencies)

- [ ] Copy Blog system files
- [ ] Copy Shop pages and products.json
- [ ] Copy OrderHistory page (with mock data)
- [ ] Copy Visits page (with mock data)
- [ ] Add routes to router
- [ ] Copy skill icons to `/public/assets/`
- [ ] Test pages render correctly

### Phase 2: Credits System

- [ ] Set up Vercel KV database
- [ ] Add KV environment variables
- [ ] Copy `/api/credits/*` endpoints
- [ ] Copy `/api/lib/queryClassifier.js`
- [ ] Copy `CreditsContext.jsx`
- [ ] Wrap app with `CreditsProvider`
- [ ] Copy TokenPage
- [ ] Test free credit claim

### Phase 3: Stripe Integration

- [ ] Create Stripe account (or use existing)
- [ ] Add Stripe environment variables
- [ ] Copy `/api/stripe/*` endpoints
- [ ] Configure webhook in Stripe Dashboard
- [ ] Test purchase flow (use test cards)

### Phase 4: Chat Integration

- [ ] Copy `/api/chat.js` (or merge with existing)
- [ ] Ensure ANTHROPIC_API_KEY is set
- [ ] Test chat with credit deduction
- [ ] Verify query classification working

### Phase 5: Beluga Integration

- [ ] Replace mock data in Visits.jsx with API calls
- [ ] Replace mock data in OrderHistory.jsx with API calls
- [ ] Connect Shop checkout to Beluga API
- [ ] Test full order flow

### Phase 6: Referral System

- [ ] Copy `/api/refs/index.js`
- [ ] Copy `src/components/ReferralHandler.jsx`
- [ ] Copy `src/components/rewards/ReferAndEarn.jsx`
- [ ] Copy `src/pages/Referral/ReferralLanding.jsx`
- [ ] Add routes: `/ref/:address`
- [ ] Add `ReferralHandler` to App.jsx (app-level)
- [ ] Test referral flow

### Phase 7: Staking (Optional)

- [ ] Deploy AmuletStaking.sol contract
- [ ] Add contract address to env
- [ ] Copy `/api/credits/sync-stake.js`
- [ ] Test staking flow

---

## Summary of Non-Conflicting Additions

| Component | New Paths | Existing Conflicts |
|-----------|-----------|-------------------|
| Blog | `/blog`, `/blog/:slug` | None |
| Credits API | `/api/credits/*` | None |
| Stripe API | `/api/stripe/*` | None (different from `/api/checkout`) |
| Chat API | `/api/chat` | None (different from `/api/chat/integrated_chat`) |
| Rewards API | `/api/rewards/*` | None |
| **Referral API** | `/api/refs` | None |
| Token Page | `/token` | None |
| Rewards Page | `/rewards` | None |
| **Referral Landing** | `/ref/:address` | None |
| Visits | `/visits` | None |
| Order History | `/orderhistory` | None |
| Shop | `/shop`, `/product/:id` | None |

All additions are **purely additive** with no modifications to existing code.

### Key Architectural Decisions

1. **Self-contained storage** - All credits/rewards data in Vercel KV, not touching main database
2. **Non-blocking middleware** - Rewards tracking won't break chat if it fails
3. **Consume, don't modify** - Frontend can call main backend APIs, but doesn't change them
4. **Graceful fallbacks** - Mock data shown when APIs return empty results
5. **Persistent rate limiting** - Uses Vercel KV instead of in-memory (survives cold starts)
6. **Shared utilities in `/lib/`** - Outside `/api/` to reduce Vercel function count (12 limit on Hobby)
