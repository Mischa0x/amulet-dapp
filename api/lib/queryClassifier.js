// Query Classification System for Credit Tiers
// Basic Query = 1 credit
// Standard Analysis = 3 credits
// Deep Research = 25 credits

// Keywords that indicate different query complexity levels
const DEEP_RESEARCH_KEYWORDS = [
  'research', 'in-depth', 'comprehensive', 'detailed analysis',
  'all options', 'full comparison', 'explain everything', 'thorough',
  'evidence-based', 'studies show', 'clinical trials', 'long-term',
  'complete guide', 'everything about', 'deep dive', 'extensive'
];

const STANDARD_ANALYSIS_KEYWORDS = [
  'compare', 'versus', 'vs', 'recommend', 'should i', 'which is better',
  'my situation', 'personalized', 'options for', 'what are my',
  'pros and cons', 'side effects', 'interactions', 'alternatives',
  'based on my', 'considering my', 'for someone like me'
];

/**
 * Classify a query into a credit tier
 * @param {string} userMessage - The user's current message
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @returns {{ tier: string, credits: number, reason: string }}
 */
export function classifyQuery(userMessage, conversationHistory = []) {
  const messageLower = userMessage.toLowerCase();
  const messageLength = userMessage.length;
  const conversationLength = conversationHistory.length;

  // Count user messages in conversation (excluding current)
  const userMessageCount = conversationHistory.filter(m => m.role === 'user').length;

  // Check for deep research indicators
  const hasDeepKeywords = DEEP_RESEARCH_KEYWORDS.some(kw => messageLower.includes(kw));
  const isVeryLongMessage = messageLength > 500;
  const isLongConversation = userMessageCount >= 5;

  // Deep Research: complex queries requiring extensive analysis
  if (hasDeepKeywords || isVeryLongMessage || (isLongConversation && messageLength > 200)) {
    return {
      tier: 'deep',
      credits: 25,
      reason: hasDeepKeywords
        ? 'Query contains deep research keywords'
        : isVeryLongMessage
          ? 'Very detailed query (500+ characters)'
          : 'Extended conversation with detailed follow-up'
    };
  }

  // Check for standard analysis indicators
  const hasStandardKeywords = STANDARD_ANALYSIS_KEYWORDS.some(kw => messageLower.includes(kw));
  const isMediumMessage = messageLength > 100;
  const hasFollowUp = userMessageCount >= 2;

  // Standard Analysis: moderate complexity, comparisons, personalized advice
  if (hasStandardKeywords || (isMediumMessage && hasFollowUp) || messageLength > 300) {
    return {
      tier: 'standard',
      credits: 3,
      reason: hasStandardKeywords
        ? 'Query requests comparison or personalized analysis'
        : 'Moderate complexity query with context'
    };
  }

  // Basic Query: simple questions, short messages
  return {
    tier: 'basic',
    credits: 1,
    reason: 'Simple query'
  };
}

/**
 * Get the credit cost for a tier
 * @param {string} tier - 'basic', 'standard', or 'deep'
 * @returns {number}
 */
export function getCreditCost(tier) {
  const costs = {
    basic: 1,
    standard: 3,
    deep: 25
  };
  return costs[tier] || 1;
}

/**
 * Format tier name for display
 * @param {string} tier
 * @returns {string}
 */
export function formatTierName(tier) {
  const names = {
    basic: 'Basic Query',
    standard: 'Standard Analysis',
    deep: 'Deep Research'
  };
  return names[tier] || 'Basic Query';
}
