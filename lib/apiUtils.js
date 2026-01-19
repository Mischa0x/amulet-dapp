/**
 * Shared API utilities for security
 */

import { kv } from '@vercel/kv';

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://amulet-dapp.vercel.app',
  'https://amulet-dapp-git-main-mischa0x.vercel.app',
];

// Add localhost for development
if (process.env.NODE_ENV !== 'production') {
  ALLOWED_ORIGINS.push('http://localhost:5173');
  ALLOWED_ORIGINS.push('http://localhost:3000');
}

/**
 * Set CORS headers with origin validation
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns {boolean} - Whether origin is allowed
 */
export function setCorsHeaders(req, res) {
  const origin = req.headers.origin;

  // Check if origin is in allowed list
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // Allow requests with no origin (same-origin, curl, etc.)
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
  }
  // If origin not allowed, don't set header (browser will block)

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  return !origin || ALLOWED_ORIGINS.includes(origin);
}

/**
 * Handle OPTIONS preflight request
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns {boolean} - Whether this was a preflight request
 */
export function handlePreflight(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(req, res);
    res.status(200).end();
    return true;
  }
  return false;
}

/**
 * Validate Ethereum address format
 * @param {string} address - Address to validate
 * @returns {string|null} - Normalized address or null if invalid
 */
export function validateAddress(address) {
  if (!address || typeof address !== 'string') {
    return null;
  }

  // Check Ethereum address format: 0x followed by 40 hex characters
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!ethAddressRegex.test(address)) {
    return null;
  }

  return address.toLowerCase();
}

/**
 * In-memory rate limiter (fallback)
 * Used when KV is unavailable or for local development
 */
const rateLimitMap = new Map();

/**
 * Check rate limit for an identifier (IP or wallet address)
 * Uses Vercel KV for persistence across serverless function instances.
 * Falls back to in-memory if KV is unavailable.
 *
 * @param {string} identifier - IP or wallet address
 * @param {number} maxRequests - Max requests allowed in window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Promise<object>} - { allowed: boolean, remaining: number, resetAt: number }
 */
export async function checkRateLimit(identifier, maxRequests = 60, windowMs = 60000) {
  const now = Date.now();
  const key = identifier.toLowerCase();
  const kvKey = `ratelimit:${key}`;
  const windowSeconds = Math.ceil(windowMs / 1000);

  try {
    // Try persistent KV-based rate limiting
    const record = await kv.get(kvKey);

    if (!record || now > record.resetAt) {
      // New window - set with TTL
      const newRecord = {
        count: 1,
        resetAt: now + windowMs,
      };
      await kv.set(kvKey, newRecord, { ex: windowSeconds + 1 });
      return { allowed: true, remaining: maxRequests - 1, resetAt: newRecord.resetAt };
    }

    if (record.count >= maxRequests) {
      return { allowed: false, remaining: 0, resetAt: record.resetAt };
    }

    // Increment count
    const updatedRecord = {
      count: record.count + 1,
      resetAt: record.resetAt,
    };
    const remainingTtl = Math.ceil((record.resetAt - now) / 1000);
    await kv.set(kvKey, updatedRecord, { ex: remainingTtl > 0 ? remainingTtl : 1 });

    return {
      allowed: true,
      remaining: maxRequests - updatedRecord.count,
      resetAt: record.resetAt
    };

  } catch (error) {
    // Fallback to in-memory if KV fails (e.g., local dev without KV)
    // Silently fallback - this is expected in local development
    return checkRateLimitInMemory(key, maxRequests, windowMs);
  }
}

/**
 * In-memory rate limiter fallback
 * @private
 */
function checkRateLimitInMemory(key, maxRequests, windowMs) {
  const now = Date.now();
  let record = rateLimitMap.get(key);

  // Clean up old entries periodically
  if (rateLimitMap.size > 10000) {
    for (const [k, v] of rateLimitMap) {
      if (now > v.resetAt) {
        rateLimitMap.delete(k);
      }
    }
  }

  if (!record || now > record.resetAt) {
    record = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitMap.set(key, record);
    return { allowed: true, remaining: maxRequests - 1, resetAt: record.resetAt };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetAt: record.resetAt };
}
