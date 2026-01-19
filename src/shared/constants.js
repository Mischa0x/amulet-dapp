/**
 * Shared constants for the Amulet DApp
 * Centralizes magic values to improve maintainability
 */

// Local storage keys
export const STORAGE_KEYS = {
  REFERRER: 'amulet_referrer',
  THEME: 'isDarkTheme',
  WALLET: 'amulet-wallet',
};

// UI defaults
export const UI_DEFAULTS = {
  TEXTAREA_MIN_HEIGHT: '44px',
  LEADERBOARD_INITIAL_ROWS: 5,
  LEADERBOARD_TOP_LIMIT: 50,
};

// Epoch configuration for rewards
export const EPOCH_CONFIG = {
  '24h': { days: 1, label: '24H' },
  '7d': { days: 7, label: '7D' },
  '30d': { days: 30, label: '30D' },
  'all': { days: 90, label: 'ALL' },
};

// Credit tiers
export const CREDIT_TIERS = {
  BASIC: { credits: 1, name: 'Basic Query' },
  STANDARD: { credits: 3, name: 'Standard Analysis' },
  DEEP: { credits: 25, name: 'Deep Research' },
};

// Credit packages for purchase
export const CREDIT_PACKAGES = {
  mortal: { credits: 100, price: 500, name: 'Mortal', discount: null },
  awakened: { credits: 500, price: 2250, name: 'Awakened', discount: 10 },
  transcendent: { credits: 2000, price: 8000, name: 'Transcendent', discount: 20 },
  immortal: { credits: 10000, price: 35000, name: 'Immortal', discount: 30 },
};

// Free credits configuration
export const FREE_CREDITS = {
  AMOUNT: 40,
  COOLDOWN_DAYS: 30,
  COOLDOWN_MS: 30 * 24 * 60 * 60 * 1000,
};

// User-facing messages
export const MESSAGES = {
  CHAT_ERROR: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
  INSUFFICIENT_CREDITS: 'You have no credits remaining. Please purchase more credits to continue.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
  INVALID_ADDRESS: 'Invalid wallet address format.',
};

// API rate limits (requests per minute)
export const RATE_LIMITS = {
  CHAT: 60,
  CREDITS_READ: 120,
  CREDITS_CLAIM: 10,
  REFERRALS_READ: 120,
  REFERRALS_WRITE: 20,
  STRIPE_CHECKOUT: 10,
  REWARDS: 60,
};

// Placeholder text
export const PLACEHOLDERS = {
  LANDING_SEARCH: 'How can I live forever?',
  CHAT_INPUT: 'Ask Dr. Alex anything about longevity...',
};

// External URLs
export const EXTERNAL_URLS = {
  DOCS: 'https://docs.amulet.ai',
  SUPPORT: 'https://support.amulet.ai',
  TWITTER: 'https://twitter.com/amulet_ai',
};

// Token contract address (Sei Testnet)
// Set VITE_AMULET_TOKEN_ADDRESS in production environment
export const TOKEN_CONTRACT_ADDRESS = /** @type {`0x${string}`} */ (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AMULET_TOKEN_ADDRESS) ||
  '0xe8564273D6346Db0Ff54d3a6CCb1Dd12993A042c'
);

// ERC20 ABI (minimal for balance and approve)
export const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
];
