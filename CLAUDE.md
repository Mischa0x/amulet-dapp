# Amulet DApp - Project Memory

## Project Overview
A decentralized application (DApp) for longevity science built with React, TypeScript, and Web3 technologies on the Sei Testnet blockchain.

**Live URL:** https://amulet-dapp.vercel.app/
**GitHub:** https://github.com/Mischa0x/amulet-dapp

## Tech Stack
- React 19 + TypeScript + Vite
- Wagmi + RainbowKit (wallet connection)
- Sei Testnet blockchain
- Vercel deployment
- Claude AI (Anthropic) for AI agent

## Key Configurations

### Environment Variables (Vercel)
- `VITE_WALLETCONNECT_PROJECT_ID` = `43747beaf70d5c126952c33aaf0385da`
- `ANTHROPIC_API_KEY` = (user's key)

### AMULET Token
- Contract: `0xe8564273D6346Db0Ff54d3a6CCb1Dd12993A042c` (Sei Testnet)
- ERC20 token for platform transactions

## Features Implemented

### 1. Wallet Connection
- RainbowKit integration (no SIWE - simplified)
- Sei Testnet chain configuration
- WalletGuard for protected routes

### 2. AI Agent (Dr. Alex)
- `/api/chat.js` - Vercel serverless function calling Claude API
- Personality: Millennial physician, always positive, longevity-focused
- Response pattern: Treatment options → Product recommendations
- Uses `[product:id]` tags to display product cards
- ReactMarkdown for formatted responses

### 3. Theme System
- ThemeToggle component swaps CSS variables
- Light mode ↔ Dark mode
- Key variables: `--brand-black`, `--brand-white`, `--brand-blue-dark`
- All markdown text uses `var(--brand-black)` for consistent theming

### 4. Navigation
- Landing page action cards navigate to `/shop`, `/orderhistory`, `/visits`
- Requires wallet connection before navigation

## File Structure Highlights
```
/api/chat.js          - Claude AI serverless function
/src/providers/Web3Provider.tsx - Simplified (no SIWE)
/src/pages/Agent/AgentChat.jsx - AI chat component
/src/pages/Agent/AgentChat.module.css - Markdown styling
/src/components/ThemeToggle.jsx - Theme switching
/src/data/products.json - 26 longevity products
```

## Styling Notes
- Markdown content uses theme variables for automatic light/dark adaptation
- Bold text: same color as body text (user preference)
- Bullet points: 12px margin, 1.7 line-height for readability
- All colors use CSS variables that swap with theme

### 5. Token/Compute Credits Page
- `/token` route - clean design inspired by Debank & Claude Console
- Stats row with large numbers: AMULET Balance, Available Credits, Credits Used
- Cards grid: AMULET Faucet, Conversion Rate, What are Compute Credits
- Theme-aware colors using `var(--brand-black)` with opacity
- Responsive layout (stacks on mobile)
- Definition: "Compute credits are the fuel that powers Amulet.ai. Each interaction with the AI assistant consumes credits based on complexity. Hold AMULET tokens to access credits at preferential rates."

### 6. Sidebar Quick Actions
- 4 cards: Shop Supplements, Order History, View Visits, Get Tokens
- Get Tokens card (gold theme) navigates to `/token`
- Uses gold infinity icon (`/assets/infinite-outline-gold.svg`)
- Mobile: 4 cards at 25% width each

## UI/UX Design References
- Token page inspired by: Debank (large numbers, stats row) + Claude Console (clean bordered cards)
- Reference images stored in `/public/assets/`:
  - `Debank.png` - Debank portfolio layout
  - `Claude.png` - Claude Console cost dashboard
  - `UI reference.jpg` - Purple gradient glassmorphism reference
  - `Shop.png` - Shop page snapshot
  - `Visits.png` - Visits page snapshot

## Session History (2026-01-15) - Initial Setup
1. Cloned wagmiSei repo to /home/mischa/amulet-dapp
2. Created GitHub repo: Mischa0x/amulet-dapp
3. Configured Vercel deployment
4. Removed SIWE auth (backend not deployed)
5. Added navigation to landing page cards
6. Integrated Claude AI for Dr. Alex assistant
7. Added ReactMarkdown for formatted responses
8. Fixed theme-aware text colors
9. Created /token page for compute credits ideation

## Session History (2026-01-15) - UI/UX Polish Session
1. Fixed App.tsx routing - added Routes/Route for `/token` page
2. Added "Get Tokens" card to sidebar (gold theme, navigates to /token)
3. Created gold infinity icon (`infinite-outline-gold.svg`)
4. UI/UX review of Shop and Visits pages:
   - Fixed product card icon centering (moved inside mediaRect with flexbox)
   - Standardized category badge positioning (18px from edges)
   - Increased grid spacing to 20px
   - Fixed Visits page tabs spacing and hover states
   - Increased sidebar card spacing (12px → 14px)
5. Made theme toggle and wallet connect buttons 2x smaller
6. Redesigned Token page multiple times:
   - First: Purple gradient glassmorphism (didn't work for dark mode)
   - Second: Theme-aware variables (colors still off)
   - Final: Clean Debank/Claude Console inspired design
     - Stats row with 32px numbers
     - 3-column cards grid
     - Uses opacity (0.5, 0.6) for secondary text
     - All text uses `var(--brand-black)` for theme compatibility

## Key CSS Patterns
- Theme-aware text: `color: var(--brand-black); opacity: 0.5;`
- Theme-aware backgrounds: `var(--brand-white)`, `var(--brand-neon-cards-surface-light-blue)`
- Theme-aware borders: `var(--mapped-border-and-dividers-primary)`
- Ghost background gradient: `var(--brand-ghostbackground-bg1)` through `c5`
- Icon color inversion (dark mode): `filter: var(--icon-filter)` with `brightness(0) invert(1)`

## Session History (2026-01-15) - Header & Dark Mode Icons
1. Removed "AMULET.AI" brand text from AgentHeader.jsx
2. Added dark mode icon support for shop product icons:
   - Added `--icon-filter: none` and `--icon-filter-inverted: brightness(0) invert(1)` to styleguide.css
   - Added icon filter variables to VAR_SWAP in ThemeToggle.jsx
   - Applied `filter: var(--icon-filter)` to `.skillIcon` in ShopProductGrid.module.css
   - Icons now appear white/inverted in dark mode

## Session History (2026-01-16) - Compute Credits Tokenomics Design

**Status:** Design complete, awaiting confirmation before implementation

### Research Completed
- ChatGPT API pricing (GPT-5: $1.25/$10 per 1M tokens)
- Claude API pricing (Opus 4.5: $5/$25 per 1M tokens)
- Perplexity API pricing (Sonar Pro: $3/$15 per 1M tokens + request fees)

### System Design Decisions
1. **Query tiers:** Basic (1 credit), Standard (3 credits), Deep Research (25 credits)
2. **Pricing:** 1 credit = $0.05 fiat, 1 AMULET = 2 credits (50% discount)
3. **AMULET handling:** Staked (locked while credits active)
4. **Credit expiration:** 12 months from purchase/stake
5. **Free tier:** 40 credits per wallet (30-day expiry)
6. **Mid-query depletion:** Grace completion (max -25 credits)
7. **Credit tracking:** Vercel KV (off-chain)
8. **Fiat payments:** Stripe integration

### Architecture
- On-chain: AmuletStaking.sol contract for staking AMULET
- Off-chain: Vercel KV for credit usage, free tier claims, purchases
- APIs: /api/credits, /api/stripe/checkout, /api/stripe/webhook
- Frontend: TokenPage.jsx overhaul with staking + Stripe

### Full Design Document
See: `COMPUTE_CREDITS_DESIGN.md`

### Questions Pending User Confirmation
1. Stripe account ready or use test keys?
2. Vercel KV already enabled or need setup instructions?
3. Include Hardhat/Foundry for contract deployment?

### To Resume
```
Resume implementing the compute credits system from COMPUTE_CREDITS_DESIGN.md
```

## Session History (2026-01-16) - Infrastructure Setup

### Completed
1. ✅ Stripe account created (test mode)
2. ✅ Vercel KV database created (`amulet-credits`, Upstash Redis, prefix: `KV`)
3. ✅ Vercel KV connected to amulet-dapp project

### Pending Setup (User to Complete)
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

# 6. Add Stripe env vars to Vercel
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### To Resume
```
Resume implementing the compute credits system - I've completed the setup steps
```

## Session History (2026-01-16) - Shop & Product Page UI Fixes

### Shop Page Fixes
1. **Card alignment** - Added `.cardLink` and `.cardContent` flexbox styles to ensure "Add to Cart" buttons align at bottom of all cards
2. **Missing category tabs** - Added ALTERNATIVE, CLARITY, HORMONAL tabs to ShopFilters.jsx
3. **Alphabetical tab order** - Reordered tabs: ALL, ALTERNATIVE, CLARITY, HORMONAL, LONGEVITY, METABOLICS, REGEN, RESTORATION, STRUCTURE, VITALITY
4. **Verified category icons** - All icons correctly mapped (metabolics=droplet, vitality=lightning, etc.)

### Product Page Fixes
1. **Compact layout** - Replaced large hero image (`FuturisticPillProductPage.png`) with small category icon (140x140px)
2. **Single viewport** - All content now fits on one screen without scrolling:
   - Icon + skill badge (left)
   - Title, description, metrics, specs, purchase button (right)
3. **Streamlined design** - Removed redundant sections, simplified metrics display

### Files Modified
- `src/pages/Shop/ShopFilters.jsx` - Added missing tabs, alphabetical order
- `src/pages/Shop/ShopProductGrid.module.css` - Card alignment flexbox
- `src/pages/ProductPage/ProductPage.jsx` - Compact icon-based layout
- `src/pages/ProductPage/ProductPage.module.css` - Simplified styles

### Commits
- `88b4ede` - fix(shop): Align cards and add missing category tabs
- `57dd3f9` - fix(product): Compact product page layout to fit viewport

## Session History (2026-01-17) - Credit System Implementation

### Credit System Architecture
Implemented off-chain credit tracking using Vercel KV with three tiers:
- **Basic Query**: 1 credit (simple questions)
- **Standard Analysis**: 3 credits (comparisons, personalized advice)
- **Deep Research**: 25 credits (comprehensive research)

### Files Created
- `api/lib/queryClassifier.js` - Keyword-based query classification
- `src/contexts/CreditsContext.jsx` - Shared React context for credits

### Files Modified
- `api/chat.js` - Credit deduction integrated with Claude API calls
- `src/pages/Token/TokenPage.jsx` - Added tier definitions with descriptions
- `src/pages/Token/TokenPage.module.css` - Fixed 10k credits card text wrapping
- `src/pages/Agent/AgentChat.jsx` - Credit balance display and real-time updates
- `src/pages/Agent/AgentChat.module.css` - Credit UI styles
- `src/main.tsx` - Added CreditsProvider

### Critical Bug Fix: KV Key Format Mismatch
**Problem**: `chat.js` used `credits:address:balance` (separate keys) while `claim.js` and `index.js` used `credits:address` (single object). Credits were stored in one location but read from another.

**Solution**: Updated `chat.js` to use consistent object format:
```javascript
const creditKey = `credits:${normalizedAddress}`;
const creditData = await kv.get(creditKey) || { balance: 0, ... };
```

### Backend Compatibility
Verified no conflicts with `mszsorondo/amulet.ai` new_frontend branch:
- Backend: `/api/chat/integrated_chat`, `/api/checkout/create-session`
- Frontend: `/api/chat`, `/api/credits`, `/api/stripe/checkout`

### Commits
- `b8a3191` - feat(credits): Add query classification and credit tracking system
- `5673410` - fix(credits): Add shared context and UI improvements
- `6ae2552` - fix(credits): Use consistent KV key format in chat API

### Testing
```bash
# Check balance
curl "https://amulet-dapp.vercel.app/api/credits?address=YOUR_ADDRESS"

# Test query with credit deduction
curl -X POST "https://amulet-dapp.vercel.app/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}],"address":"YOUR_ADDRESS"}'
```

## Session History (2026-01-18) - Blog System & Logo Update

### Blog System Implementation
Created a full blog system inspired by Hemi.xyz with markdown-based content management.

#### Blog Features
- **Routes**: `/blog` (index) and `/blog/:slug` (individual posts)
- **Categories**: AI, Longevity, Treatments, Supplements, Tokens
- **URL filtering**: `/blog?category=AI`
- **Responsive grid**: 1→2→3 columns
- **Sticky category pills** with horizontal scroll on mobile
- **Subscribe block** for email capture
- **Auto-linking** bare URLs in posts
- **Blockquote support**

#### Blog Workflow
1. Write markdown files in `/content/blog/`
2. Run `npm run blog:process` to generate `src/data/blogPosts.js`
3. Posts auto-deploy via Vercel

#### Markdown Format
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

Your content here with **bold**, *italic*, and ## headings.
URLs are auto-linked: https://example.com
```

#### Files Created
- `content/blog/*.md` - Markdown blog posts
- `scripts/process-blog-posts.js` - Markdown processor
- `src/data/blogPosts.js` - Generated post data
- `src/components/blog/` - BlogCard, CategoryPills, BlogGrid, SubscribeBlock
- `src/pages/Blog/` - BlogPage, BlogPostPage
- `public/blog/` - Hero images and placeholders

#### First Blog Post
- "Origins of DrPepe.ai: An Emergent Signal in Longevity Research"
- Hero image: `/blog/DrPepe Heroimage.jpg`

### Logo Update
Replaced all logos with `blue_logo_transparent_square.png`:
- Landing page top left (48x48px)
- Sidebar logo (48x48px)
- Mobile header (48x48px)
- Auth pages

#### Files Modified for Logo
- `src/pages/Landing/LandingPage.jsx`
- `src/pages/Landing/LandingPage.module.css`
- `src/pages/Agent/AgentSidebar.jsx`
- `src/pages/Agent/AgentSidebar.module.css`
- `src/pages/Agent/AgentHeader.jsx`
- `src/pages/Agent/AgentHeader.module.css`
- `src/components/Header.jsx`
- `src/pages/Auth/AuthPage.jsx`
- `src/pages/Auth/AuthPageWeb3.jsx`

### Commits
- `5f8d936` - feat: Add blog system with markdown processing
- `3a149d6` - fix: Remove quotation marks from blog titles
- `21e5429` - feat: Replace all logos with blue_logo_transparent_square.png
- `01248cf` - fix: Size logo properly in top left corner
- `681658d` - fix: Increase logo size to 48px on all pages
- `b6dcbfd` - feat: Add Blog link to landing page top right
- `33a2da2` - fix: Make Blog link more visible with button style
- `a021803` - feat: Add Blog link to sidebar Quick Actions
- `878e37d` - fix: Add pointer cursor to landing page action cards
- `182471b` - fix: Add stronger pop-out hover effect and inline cursor to action cards

### Blog Navigation
Added blog links in two locations:
1. **Landing page top right** - Pill-shaped "Blog" button next to Connect Wallet
2. **Sidebar Quick Actions** - Blue "Blog" card with book icon (`/assets/blog-icon.svg`)

### UI Improvements
- Action cards on landing page now have pointer cursor and pop-out hover effect
- Cards lift 8px and scale 1.02x on hover with enhanced shadow
- Inline `style={{ cursor: 'pointer' }}` added as fallback

### To Resume
```
Continue working on the Amulet DApp blog or other features
```
