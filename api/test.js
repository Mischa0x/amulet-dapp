// Database test endpoint
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const sql = neon(process.env.DATABASE_URL);
    const results = {};

    // Get enum values for account_status
    try {
      const enums = await sql`
        SELECT e.enumlabel
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE t.typname = 'account_status'
      `;
      results.account_status_values = enums.map(e => e.enumlabel);
    } catch (e) {
      results.account_status_values = { error: e.message };
    }

    // Get enum values for auth_provider
    try {
      const enums = await sql`
        SELECT e.enumlabel
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE t.typname = 'auth_provider'
      `;
      results.auth_provider_values = enums.map(e => e.enumlabel);
    } catch (e) {
      results.auth_provider_values = { error: e.message };
    }

    // Try insert with account_status
    if (req.query.test === 'insert') {
      try {
        const result = await sql`
          INSERT INTO users (username, email, password_hash, password_salt, email_verified, created_at, account_status, auth_provider)
          VALUES ('testuser999', 'test999@example.com', 'hash', 'salt', true, NOW(), 'active', 'local')
          RETURNING id, username, email
        `;
        results.insert_test = result;
      } catch (e) {
        results.insert_test = { error: e.message };
      }
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
