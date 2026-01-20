// Database test endpoint
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const sql = neon(process.env.DATABASE_URL);
    const results = {};

    // Check for existing user
    const email = req.query.email || 'amanhasan518@gmail.com';
    try {
      const user = await sql`SELECT id, username, email FROM users WHERE email = ${email}`;
      results.existing_user = user;
    } catch (e) {
      results.existing_user = { error: e.message };
    }

    // Try raw insert
    if (req.query.test === 'insert') {
      try {
        const result = await sql`
          INSERT INTO users (username, email, password_hash, password_salt, email_verified, created_at)
          VALUES ('testuser123', 'test123@example.com', 'hash', 'salt', true, NOW())
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
