// Simple test endpoint
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // Test 1: Basic response
    const test1 = { step: 'basic', success: true };

    // Test 2: Check DATABASE_URL
    const test2 = {
      step: 'env_check',
      hasDbUrl: !!process.env.DATABASE_URL,
      dbUrlLength: process.env.DATABASE_URL?.length || 0
    };

    // Test 3: Import neon
    let test3 = { step: 'neon_import', success: false };
    try {
      const { neon } = await import('@neondatabase/serverless');
      test3.success = true;
    } catch (e) {
      test3.error = e.message;
    }

    // Test 4: Create connection
    let test4 = { step: 'neon_connection', success: false };
    try {
      const { neon } = await import('@neondatabase/serverless');
      const sql = neon(process.env.DATABASE_URL);
      const result = await sql`SELECT 1 as test`;
      test4.success = true;
      test4.result = result;
    } catch (e) {
      test4.error = e.message;
    }

    // Test 5: Drizzle import
    let test5 = { step: 'drizzle_import', success: false };
    try {
      const { db } = await import('../lib/db.js');
      test5.success = true;
    } catch (e) {
      test5.error = e.message;
    }

    // Test 6: Query users table
    let test6 = { step: 'users_query', success: false };
    try {
      const { db } = await import('../lib/db.js');
      const { users } = await import('../lib/schema.js');
      const result = await db.select().from(users).limit(1);
      test6.success = true;
      test6.count = result.length;
    } catch (e) {
      test6.error = e.message;
    }

    return res.status(200).json({ test1, test2, test3, test4, test5, test6 });
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
