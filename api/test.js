// Simple test endpoint - inline dependencies
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Inline users table definition for testing
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username'),
  email: text('email'),
  createdAt: timestamp('created_at'),
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const results = {};

    // Test 1: Basic
    results.basic = { success: true };

    // Test 2: Env
    results.env = {
      hasDbUrl: !!process.env.DATABASE_URL,
      dbUrlLength: process.env.DATABASE_URL?.length || 0
    };

    // Test 3: Neon direct
    try {
      const sql = neon(process.env.DATABASE_URL);
      const result = await sql`SELECT 1 as test`;
      results.neon = { success: true, result };
    } catch (e) {
      results.neon = { success: false, error: e.message };
    }

    // Test 4: Drizzle
    try {
      const sql = neon(process.env.DATABASE_URL);
      const db = drizzle(sql);
      const result = await db.select().from(users).limit(1);
      results.drizzle = { success: true, count: result.length };
    } catch (e) {
      results.drizzle = { success: false, error: e.message };
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
