/**
 * User login endpoint
 * POST /api/auth/login
 * Connects to Neon PostgreSQL database
 */
import { db } from '../../lib/db.js';
import { users } from '../../lib/schema.js';
import { eq, or } from 'drizzle-orm';
import crypto from 'crypto';
import { SignJWT } from 'jose';

// Verify password against stored hash
async function verifyPassword(password, storedHash, salt) {
  const hash = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });
  return hash === storedHash;
}

// Generate JWT token
async function generateToken(user) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'amulet-secret-key');
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    username: user.username
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
  return token;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, email, password } = req.body;
    const identifier = username || email;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email/username and password are required' });
    }

    // Find user by email or username
    const [user] = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, identifier.toLowerCase()),
          eq(users.username, identifier)
        )
      )
      .limit(1);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check email verification
    if (!user.emailVerified) {
      return res.status(401).json({
        message: 'Please verify your email before logging in',
        emailVerified: false
      });
    }

    // Check account status
    if (user.accountStatus !== 'active') {
      return res.status(401).json({
        message: 'Account is not active',
        accountStatus: user.accountStatus
      });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password, user.passwordSalt);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    // Generate token
    const token = await generateToken(user);

    // Set cookie
    res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
