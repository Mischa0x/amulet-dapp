// Database test and schema check endpoint
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const sql = neon(process.env.DATABASE_URL);
    const results = {};

    // Test 1: Get all tables
    try {
      const tables = await sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;
      results.tables = tables.map(t => t.table_name);
    } catch (e) {
      results.tables = { error: e.message };
    }

    // Test 2: Check signup_whitelist
    try {
      const cols = await sql`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'signup_whitelist'
        ORDER BY ordinal_position
      `;
      results.whitelist_columns = cols;
    } catch (e) {
      results.whitelist_columns = { error: e.message };
    }

    // Test 3: Count whitelist entries
    try {
      const result = await sql`SELECT COUNT(*) as count FROM signup_whitelist`;
      results.whitelist_count = result[0].count;
    } catch (e) {
      results.whitelist_count = { error: e.message };
    }

    // Test 4: Sample whitelist entry
    try {
      const sample = await sql`SELECT * FROM signup_whitelist LIMIT 3`;
      results.whitelist_sample = sample;
    } catch (e) {
      results.whitelist_sample = { error: e.message };
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
