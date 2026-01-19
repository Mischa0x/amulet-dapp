/**
 * User registration endpoint
 * POST /api/auth/register
 * Connects to Neon PostgreSQL database
 */
import { db } from '../../lib/db.js';
import { users, signupWhitelist } from '../../lib/schema.js';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// Scrypt password hashing (same as DrPepe backend)
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });
  return { hash, salt };
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Check whitelist (optional - skip in dev)
    const isDev = process.env.NODE_ENV !== 'production';
    if (!isDev) {
      const whitelisted = await db
        .select()
        .from(signupWhitelist)
        .where(eq(signupWhitelist.email, email.toLowerCase()))
        .limit(1);

      if (whitelisted.length === 0) {
        return res.status(403).json({
          message: 'Your account is awaiting whitelist approval. Please contact the community for early beta access.'
        });
      }
    }

    // Hash password
    const { hash, salt } = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        username: username || email.split('@')[0],
        email: email.toLowerCase(),
        password: hash,
        passwordSalt: salt,
        firstName: firstName || null,
        lastName: lastName || null,
        emailVerified: isDev, // Auto-verify in dev
        accountStatus: isDev ? 'active' : 'pending',
        authProvider: 'local',
      })
      .returning({ id: users.id, email: users.email, username: users.username });

    return res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
