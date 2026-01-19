/**
 * Database connection for Neon PostgreSQL
 * Uses Drizzle ORM with serverless driver
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

// Create database connection
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Export schema for convenience
export { schema };
