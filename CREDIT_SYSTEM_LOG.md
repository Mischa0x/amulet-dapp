# Credit System Implementation Log

## Date: 2026-01-17

## Summary
Implemented a compute credits system for the Amulet AI agent chat that tracks credit usage per wallet address.

## Credit Tiers
- **Basic Query**: 1 credit - Simple questions, quick answers
- **Standard Analysis**: 3 credits - Comparisons, personalized advice (keywords: compare, recommend, should I, pros and cons, etc.)
- **Deep Research**: 25 credits - Comprehensive, evidence-based analysis (keywords: research, comprehensive, clinical trials, long-term, etc.)

## Files Created/Modified

### New Files
- `api/lib/queryClassifier.js` - Query classification system for credit tiers
- `src/contexts/CreditsContext.jsx` - Shared React context for credit state across pages

### Modified Files
- `api/chat.js` - Integrated credit checking and deduction
- `api/credits/index.js` - GET endpoint for credit balance
- `api/credits/claim.js` - POST endpoint for claiming free credits
- `src/pages/Agent/AgentChat.jsx` - Credit display in chat UI
- `src/pages/Agent/AgentChat.module.css` - Credit UI styling
- `src/pages/Token/TokenPage.jsx` - Credit pricing definitions with descriptions
- `src/pages/Token/TokenPage.module.css` - Fixed button alignment
- `src/main.tsx` - Added CreditsProvider wrapper

## Key Bug Fixes

### KV Key Format Mismatch (Critical)
**Problem**: `chat.js` used separate keys (`credits:address:balance`) while other endpoints used a single object (`credits:address`). This caused credits to not be deducted from the correct location.

**Symptom**: User had 40 credits but after one query showed -3.

**Solution**: Updated `chat.js` to use the same object format:
```javascript
// Before (WRONG)
const balanceKey = `credits:${normalizedAddress}:balance`;
let balance = await kv.get(balanceKey) || 0;

// After (CORRECT)
const creditKey = `credits:${normalizedAddress}`;
const creditData = await kv.get(creditKey) || { balance: 0, ... };
const balance = creditData.balance || 0;
```

## Backend Compatibility
Verified no conflicts with main backend repo (mszsorondo/amulet.ai/new_frontend):
- Backend uses: `/api/chat/integrated_chat`, `/api/checkout/create-session`
- Frontend uses: `/api/chat`, `/api/credits`, `/api/stripe/checkout`
- No overlap in endpoints

## Testing Commands
```bash
# Check credit balance
curl "https://amulet-dapp.vercel.app/api/credits?address=YOUR_ADDRESS"

# Test chat with credits
curl -X POST "https://amulet-dapp.vercel.app/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What is vitamin D?"}],"address":"YOUR_ADDRESS"}'
```

## Live URL
https://amulet-dapp.vercel.app/agent
