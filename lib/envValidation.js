/**
 * Environment Variable Validation
 *
 * Validates required environment variables at startup to fail fast
 * rather than encountering missing config at runtime.
 */

/**
 * Required environment variables for backend API
 */
const REQUIRED_API_ENV_VARS = [
  'KV_REST_API_URL',
  'KV_REST_API_TOKEN',
];

/**
 * Optional but recommended environment variables for backend
 */
const OPTIONAL_API_ENV_VARS = [
  { name: 'ANTHROPIC_API_KEY', feature: 'AI Chat' },
  { name: 'STRIPE_SECRET_KEY', feature: 'Credit purchases' },
  { name: 'STRIPE_WEBHOOK_SECRET', feature: 'Stripe webhooks' },
  { name: 'VITE_STAKING_CONTRACT_ADDRESS', feature: 'Token staking' },
  { name: 'MAINNET_RPC_URL', feature: 'On-chain stake sync' },
];

/**
 * Validate backend environment variables
 * Call this at the top of each API route
 *
 * @param {string[]} additional - Additional required vars for specific routes
 * @returns {{ valid: boolean, missing: string[], warnings: string[] }}
 */
export function validateApiEnv(additional = []) {
  const required = [...REQUIRED_API_ENV_VARS, ...additional];
  const missing = [];
  const warnings = [];

  // Check required vars
  for (const varName of required) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  // Check optional vars and collect warnings
  for (const { name, feature } of OPTIONAL_API_ENV_VARS) {
    if (!process.env[name]) {
      warnings.push(`${name} not set - ${feature} will be unavailable`);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Get environment variable with validation
 * @param {string} name - Environment variable name
 * @param {string|null} defaultValue - Default value if not set (null = required)
 * @returns {string}
 * @throws {Error} If required variable is missing
 */
export function getEnv(name, defaultValue = null) {
  const value = process.env[name];

  if (!value && defaultValue === null) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value || defaultValue;
}

/**
 * Get optional environment variable
 * @param {string} name - Environment variable name
 * @param {string} defaultValue - Default value
 * @returns {string}
 */
export function getEnvOptional(name, defaultValue = '') {
  return process.env[name] || defaultValue;
}

/**
 * Check if a feature is enabled based on env vars
 * @param {string} feature - Feature name
 * @returns {boolean}
 */
export function isFeatureEnabled(feature) {
  const featureEnvMap = {
    chat: 'ANTHROPIC_API_KEY',
    stripe: 'STRIPE_SECRET_KEY',
    staking: 'VITE_STAKING_CONTRACT_ADDRESS',
  };

  const envVar = featureEnvMap[feature];
  return envVar ? !!process.env[envVar] : false;
}
