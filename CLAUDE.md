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
- `/token` route with compute credits ideation
- Shows AMULET token balance and available credits
- Credit tiers: Explorer, Pioneer, Visionary, Immortal
- Staking bonus multipliers (1.1x to 2x)
- Usage guide for AI interactions

## Session History (2026-01-15)
1. Cloned wagmiSei repo to /home/mischa/amulet-dapp
2. Created GitHub repo: Mischa0x/amulet-dapp
3. Configured Vercel deployment
4. Removed SIWE auth (backend not deployed)
5. Added navigation to landing page cards
6. Integrated Claude AI for Dr. Alex assistant
7. Added ReactMarkdown for formatted responses
8. Fixed theme-aware text colors
9. Created /token page for compute credits ideation
