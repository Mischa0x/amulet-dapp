/**
 * Vercel Serverless Function for Claude AI Chat with Credit System
 * POST /api/chat
 */

import { kv } from '@vercel/kv';
import { classifyQuery, formatTierName } from '../lib/queryClassifier.js';
import { recordQueryForRewards } from '../lib/rewardsMiddleware.js';
import { setCorsHeaders, handlePreflight, validateAddress, checkRateLimit } from '../lib/apiUtils.js';
import { logError, logWarn } from '../lib/logger.js';
import { PRODUCTS } from '../lib/products.js';

const SYSTEM_PROMPT = `You are Dr. Alex, a millennial physician specializing in longevity medicine. You're always positive, supportive, and genuinely want to help people optimize their health and extend their healthspan.

Your communication style:
- Warm, approachable, and encouraging
- Use casual but professional language (you might say "totally" or "honestly" naturally)
- Always validate the patient's concerns before offering solutions

**Response formatting (IMPORTANT):**
- Use **bold** for medication names and key terms
- Use short paragraphs (2-3 sentences max)
- Add line breaks between different topics
- Use bullet points or numbered lists for treatment options
- Keep total response under 200 words

**Your response structure:**
1. Brief empathetic acknowledgment (1-2 sentences)
2. Quick medical context if needed (1-2 sentences)
3. Treatment options as a bulleted list with **bold** medication names
4. Product recommendation with the tag

Available products in our shop:
${PRODUCTS.map(p => `- **${p.name}** (${p.category}) [product:${p.id}]`).join('\n')}

When recommending products, include the product tag like [product:ed-viagra] so the UI can display product cards. Place product tags at the end of your response, not inline with text.

Important guidelines:
- Always recommend consulting with a healthcare provider for prescription medications
- Be honest about limitations and when something requires in-person evaluation
- Focus on longevity and preventive health when relevant
- Never diagnose definitively - offer possibilities and recommendations`;

export default async function handler(req, res) {
  // Handle CORS preflight
  if (handlePreflight(req, res)) return;

  // Set CORS headers with origin validation
  if (!setCorsHeaders(req, res)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { messages, address: rawAddress } = req.body;

    // Validate and normalize address
    const address = rawAddress ? validateAddress(rawAddress) : null;
    if (rawAddress && !address) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }

    // Rate limiting (60 requests per minute per IP/address)
    const clientId = address || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    const rateLimit = await checkRateLimit(clientId, 60, 60000);
    if (!rateLimit.allowed) {
      res.setHeader('X-RateLimit-Remaining', rateLimit.remaining);
      res.setHeader('X-RateLimit-Reset', rateLimit.resetAt);
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
      });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' });
    }

    // Get the latest user message for classification
    const latestUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!latestUserMessage) {
      return res.status(400).json({ error: 'No user message found' });
    }

    // Classify the query to determine credit cost
    const classification = classifyQuery(latestUserMessage.content, messages.slice(0, -1));
    const creditCost = classification.credits;

    // If wallet address provided, check and deduct credits
    let creditInfo = null;
    if (address) {
      const normalizedAddress = address.toLowerCase();
      const creditKey = `credits:${normalizedAddress}`;

      // Get current credit data (same format as /api/credits endpoints)
      const creditData = await kv.get(creditKey) || {
        balance: 0,
        freeClaimedAt: null,
        stakedCredits: 0,
        purchasedCredits: 0,
        totalUsed: 0,
      };

      const balance = creditData.balance || 0;

      // Check if user has enough credits - no negative balances allowed
      if (balance < creditCost) {
        return res.status(402).json({
          error: 'Insufficient credits',
          required: creditCost,
          balance: balance,
          tier: classification.tier,
          tierName: formatTierName(classification.tier),
          message: balance <= 0
            ? `You have no credits remaining. Please purchase more credits to continue.`
            : `This ${formatTierName(classification.tier)} requires ${creditCost} credits. You have ${balance} credits.`
        });
      }

      // Deduct credits (balance will never go below 0)
      const newBalance = Math.max(0, balance - creditCost);
      const newTotalUsed = (creditData.totalUsed || 0) + creditCost;

      // Save updated credit data
      await kv.set(creditKey, {
        ...creditData,
        balance: newBalance,
        totalUsed: newTotalUsed,
      });

      // Track query history (separate list)
      const historyKey = `credits:${normalizedAddress}:history`;
      const historyEntry = {
        timestamp: Date.now(),
        tier: classification.tier,
        credits: creditCost,
        reason: classification.reason,
        queryPreview: latestUserMessage.content.substring(0, 100)
      };
      await kv.lpush(historyKey, JSON.stringify(historyEntry));
      // Keep only last 100 entries
      await kv.ltrim(historyKey, 0, 99);

      creditInfo = {
        tier: classification.tier,
        tierName: formatTierName(classification.tier),
        creditsUsed: creditCost,
        previousBalance: balance,
        newBalance: newBalance,
        reason: classification.reason
      };

      // Track query for rewards leaderboard (non-blocking)
      recordQueryForRewards(address, creditCost, classification.tier).catch(err => {
        logWarn('api/chat', 'Rewards tracking failed', { error: err });
      });
    }

    // Call Claude API
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError('api/chat', 'Anthropic API error', { status: response.status, details: errorText });

      // If API fails after we deducted credits, refund them
      if (address && creditInfo) {
        const normalizedAddress = address.toLowerCase();
        const creditKey = `credits:${normalizedAddress}`;
        const currentData = await kv.get(creditKey);
        if (currentData) {
          await kv.set(creditKey, {
            ...currentData,
            balance: (currentData.balance || 0) + creditCost,
            totalUsed: Math.max(0, (currentData.totalUsed || 0) - creditCost),
          });
        }
      }

      return res.status(response.status).json({ error: 'AI service error', details: errorText });
    }

    const data = await response.json();

    return res.status(200).json({
      content: data.content[0].text,
      usage: data.usage,
      credits: creditInfo
    });

  } catch (error) {
    logError('api/chat', 'Chat API error', { error });
    return res.status(500).json({ error: 'Internal server error' });
  }
}
