/**
 * Auth API - Combined login/register endpoint
 * POST /api/auth?action=login
 * POST /api/auth?action=register
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { eq, or } from 'drizzle-orm';
import crypto from 'crypto';
import { SignJWT } from 'jose';

// Inline table definitions for Vercel bundling
const userGroups = pgTable('user_groups', {
  id: serial('id').primaryKey(),
  collectionName: text('collection_name').notNull(),
});

// Minimal users table for auth - only columns we need
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  email: text('email').notNull(),
  password: text('password_hash').notNull(),
  passwordSalt: text('password_salt'),
  lastLogin: timestamp('last_login'),
  emailVerified: boolean('email_verified'),
  createdAt: timestamp('created_at'),
  accountStatus: text('account_status'),
  authProvider: text('auth_provider'),
});

const signupWhitelist = pgTable('signup_whitelist', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at'),
});

// Create DB connection
function getDb() {
  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql);
}

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

// Create JWT token
async function createToken(userId, email) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
  return token;
}

// CORS headers
function setCors(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

// ============ REGISTER ============
async function handleRegister(req, res) {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: 'Email, password, and username are required' });
  }

  const db = getDb();

  // Check if email is whitelisted
  const whitelist = await db.select().from(signupWhitelist)
    .where(eq(signupWhitelist.email, email.toLowerCase()));

  if (whitelist.length === 0) {
    return res.status(403).json({ message: 'Email not whitelisted. Please request access.' });
  }

  // Check if user already exists
  const existing = await db.select().from(users)
    .where(or(eq(users.email, email.toLowerCase()), eq(users.username, username)));

  if (existing.length > 0) {
    return res.status(409).json({ message: 'User with this email or username already exists' });
  }

  // Hash password
  const { hash, salt } = await hashPassword(password);

  // Create user
  const [newUser] = await db.insert(users).values({
    email: email.toLowerCase(),
    username,
    password: hash,
    passwordSalt: salt,
    emailVerified: true,
    createdAt: new Date(),
    accountStatus: 'active',
    authProvider: 'local',
  }).returning();

  return res.status(201).json({
    message: 'Account created successfully',
    user: { id: newUser.id, email: newUser.email, username: newUser.username }
  });
}

// ============ LOGIN ============
async function handleLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const db = getDb();

  // Find user
  const [user] = await db.select().from(users)
    .where(eq(users.email, email.toLowerCase()));

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Verify password
  const isValid = await verifyPassword(password, user.password, user.passwordSalt);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Update last login
  await db.update(users)
    .set({ lastLogin: new Date() })
    .where(eq(users.id, user.id));

  // Create token
  const token = await createToken(user.id, user.email);

  // Set cookie
  res.setHeader('Set-Cookie', `auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`);

  return res.status(200).json({
    message: 'Login successful',
    user: { id: user.id, email: user.email, username: user.username },
    token
  });
}

// ============ MAIN HANDLER ============
export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const action = req.query.action;

  try {
    switch (action) {
      case 'register':
        return await handleRegister(req, res);
      case 'login':
        return await handleLogin(req, res);
      default:
        return res.status(400).json({ message: 'Invalid action. Use ?action=register or ?action=login' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      debug: error.message
    });
  }
}
