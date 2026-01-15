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
