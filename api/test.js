// Database test endpoint
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const sql = neon(process.env.DATABASE_URL);
    const results = {};

    // Add email to whitelist
    const emailToAdd = req.query.whitelist;
    if (emailToAdd) {
      try {
        const result = await sql`
          INSERT INTO signup_whitelist (email, created_at)
          VALUES (${emailToAdd.toLowerCase()}, NOW())
          ON CONFLICT (email) DO NOTHING
          RETURNING id, email
        `;
        results.whitelist_added = result.length > 0 ? result[0] : { message: 'Already whitelisted' };
      } catch (e) {
        results.whitelist_added = { error: e.message };
      }
    }

    // Check whitelist
    const checkEmail = req.query.check;
    if (checkEmail) {
      const found = await sql`SELECT * FROM signup_whitelist WHERE email = ${checkEmail.toLowerCase()}`;
      results.whitelist_check = found.length > 0 ? found[0] : { found: false };
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
