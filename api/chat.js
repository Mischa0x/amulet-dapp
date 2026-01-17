// Vercel Serverless Function for Claude AI Chat with Credit System
// POST /api/chat

import { kv } from '@vercel/kv';
import { classifyQuery, formatTierName } from './lib/queryClassifier.js';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// Product catalog for recommendations
const PRODUCTS = [
  { id: "ed-viagra", name: "Sildenafil (Viagra)", category: "Erectile Dysfunction", description: "Fast-acting ED medication" },
  { id: "ed-cialis", name: "Tadalafil (Cialis)", category: "Erectile Dysfunction", description: "Long-acting ED treatment, ~36-hour window" },
  { id: "hair-finasteride", name: "Finasteride (Propecia)", category: "Hair Loss", description: "Blocks DHT to slow hair loss" },
  { id: "hair-minoxidil", name: "Minoxidil", category: "Hair Loss", description: "Topical treatment for hair growth" },
  { id: "weight-ozempic", name: "Semaglutide (Ozempic, Wegovy)", category: "Weight Loss", description: "GLP-1 for weight loss" },
  { id: "weight-mounjaro", name: "Tirzepatide (Mounjaro)", category: "Weight Loss", description: "Dual GLP-1/GIP for weight loss" },
  { id: "mental-ssri", name: "SSRIs/SNRIs", category: "Mental Health", description: "Antidepressants like sertraline, fluoxetine" },
  { id: "mental-bupropion", name: "Bupropion", category: "Mental Health", description: "Antidepressant, fewer sexual side effects" },
  { id: "mental-propranolol", name: "Propranolol", category: "Mental Health", description: "Beta-blocker for performance anxiety" },
  { id: "sleep-trazodone", name: "Trazodone", category: "Sleep", description: "Low-dose for insomnia" },
  { id: "sleep-melatonin", name: "Melatonin", category: "Sleep", description: "OTC supplement for sleep" },
  { id: "focus-modafinil", name: "Modafinil", category: "Focus", description: "Wakefulness-promoting for focus" },
  { id: "hrt-testosterone", name: "Testosterone", category: "HRT", description: "For hypogonadism in men" },
  { id: "hrt-estrogen", name: "Estrogen / Progesterone", category: "HRT", description: "Women's HRT for menopause" },
  { id: "ketamine", name: "Ketamine", category: "Mental Health", description: "Therapeutic use for depression" },
];

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

// Grace credits for mid-query depletion (max negative balance allowed)
const GRACE_CREDITS = 25;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { messages, address } = req.body;

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

      // Check if user has enough credits (with grace period)
      if (balance < creditCost && balance < -GRACE_CREDITS) {
        return res.status(402).json({
          error: 'Insufficient credits',
          required: creditCost,
          balance: balance,
          tier: classification.tier,
          tierName: formatTierName(classification.tier),
          message: `This ${formatTierName(classification.tier)} requires ${creditCost} credits. You have ${balance} credits.`
        });
      }

      // Deduct credits and update total used
      const newBalance = balance - creditCost;
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
      console.error('Anthropic API error:', response.status, errorText);

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
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
