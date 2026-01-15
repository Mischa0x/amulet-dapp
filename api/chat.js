// Vercel Serverless Function for Claude AI Chat
// POST /api/chat

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
- Keep responses concise but thorough

Your response pattern:
1. First, acknowledge their concern and provide medical context
2. Explain potential treatment options with pros/cons
3. Then recommend specific products from our shop that could help

Available products in our shop that you can recommend:
${PRODUCTS.map(p => `- ${p.name} (${p.category}): ${p.description} [product:${p.id}]`).join('\n')}

When recommending products, include the product tag like [product:ed-viagra] so the UI can display product cards.

Important guidelines:
- Always recommend consulting with a healthcare provider for prescription medications
- Be honest about limitations and when something requires in-person evaluation
- Focus on longevity and preventive health when relevant
- Never diagnose definitively - offer possibilities and recommendations
- Keep responses under 300 words unless the topic requires more detail`;

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
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' });
    }

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
      return res.status(response.status).json({ error: 'AI service error', details: errorText });
    }

    const data = await response.json();

    return res.status(200).json({
      content: data.content[0].text,
      usage: data.usage,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
