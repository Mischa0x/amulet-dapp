/**
 * Multi-Agent Chat API
 * POST /api/chat/agents
 * Connects to PeakHealth-Agents for multi-agent AI chat
 * Includes credit deduction
 */
import { kv } from '@vercel/kv';
import { classifyQuery } from '../../lib/queryClassifier.js';
import { recordQueryForRewards } from '../../lib/rewardsMiddleware.js';

const AGENTS_API_URL = process.env.AGENTS_API_URL || 'https://peakhealth-agents-production.railway.app';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, session_id, user_id, address, agent_type } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get wallet address for credits (from body or header)
    const walletAddress = address || req.headers['x-wallet-address'];

    // Credit check and deduction
    if (walletAddress) {
      const normalizedAddress = walletAddress.toLowerCase();
      const creditKey = `credits:${normalizedAddress}`;

      // Get current balance
      const creditData = await kv.get(creditKey) || { balance: 0 };
      const balance = Math.max(0, creditData.balance || 0);

      // Classify query to determine credit cost
      const classification = classifyQuery(message);
      const creditCost = classification.credits;

      if (balance < creditCost) {
        return res.status(402).json({
          error: 'Insufficient credits',
          required: creditCost,
          balance: balance,
          tier: classification.tier,
        });
      }

      // Deduct credits
      const newBalance = Math.max(0, balance - creditCost);
      await kv.set(creditKey, {
        ...creditData,
        balance: newBalance,
        lastUsed: Date.now(),
      });

      // Record for rewards
      try {
        await recordQueryForRewards(normalizedAddress, creditCost, classification.tier);
      } catch (e) {
        // Don't fail the request if rewards tracking fails
      }

      // Add credit info to response headers
      res.setHeader('X-Credits-Used', creditCost.toString());
      res.setHeader('X-Credits-Remaining', newBalance.toString());
    }

    // Determine which agent endpoint to use
    let agentEndpoint = '/integrated_chat';
    if (agent_type === 'research') {
      agentEndpoint = '/research_chat';
    } else if (agent_type === 'lab') {
      agentEndpoint = '/lab_chat';
    } else if (agent_type === 'order') {
      agentEndpoint = '/order_chat';
    }

    // Forward to PeakHealth-Agents
    const agentResponse = await fetch(`${AGENTS_API_URL}${agentEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: session_id || `session-${Date.now()}`,
        user_id: user_id || 1,
        message: message,
      }),
    });

    if (!agentResponse.ok) {
      const errorText = await agentResponse.text();
      console.error('Agent API error:', errorText);
      return res.status(agentResponse.status).json({
        error: 'Agent API error',
        details: errorText,
      });
    }

    const agentData = await agentResponse.json();

    return res.status(200).json({
      response: agentData.response,
      links: agentData.links || [],
      session_id: session_id,
      agent_type: agent_type || 'integrated',
    });

  } catch (error) {
    console.error('Multi-agent chat error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
