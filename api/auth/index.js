/**
 * Auth API - Combined login/register endpoint
 * POST /api/auth?action=login
 * POST /api/auth?action=register
 */
import { db } from '../../lib/db.js';
import { users, signupWhitelist } from '../../lib/schema.js';
import { eq, or } from 'drizzle-orm';
import crypto from 'crypto';
import { SignJWT } from 'jose';

// Scrypt password hashing
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

// Handle registration
async function handleRegister(req, res) {
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
      emailVerified: isDev,
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
}

// Handle login
async function handleLogin(req, res) {
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
    const action = req.query.action || req.body.action;

    if (action === 'register') {
      return await handleRegister(req, res);
    } else if (action === 'login') {
      return await handleLogin(req, res);
    } else {
      return res.status(400).json({ message: 'Invalid action. Use ?action=login or ?action=register' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    // Temporarily show error for debugging
    return res.status(500).json({
      message: 'Internal server error',
      debug: error.message,
      stack: error.stack?.split('\n').slice(0, 3)
    });
  }
}
