/**
 * Import closed beta emails to signup_whitelist
 * Usage: node scripts/import-beta-emails.js
 *
 * Requires DATABASE_URL environment variable (loaded from .env.local)
 */
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables - try production first, then local
dotenv.config({ path: path.join(__dirname, '../.env.production.local') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Table definition
const signupWhitelist = pgTable('signup_whitelist', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

// CSV path
const CSV_PATH = path.join(__dirname, '../public/Email List/Close Beta Responses.csv');

async function main() {
  // Check for DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is required');
    process.exit(1);
  }

  // Connect to database
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  // Read CSV file
  console.log(`Reading CSV from: ${CSV_PATH}`);
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = csvContent.split('\n');

  // Parse header to find email column
  const header = lines[0].split(',');
  const emailIndex = header.findIndex(col => col.toLowerCase().includes('email'));

  if (emailIndex === -1) {
    console.error('ERROR: Could not find email column in CSV');
    process.exit(1);
  }

  console.log(`Email column found at index ${emailIndex}`);

  // Extract emails (skip header)
  const emails = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle CSV parsing (basic - assumes no commas in email values)
    const columns = line.split(',');
    const email = columns[emailIndex]?.trim().toLowerCase();

    if (email && emailRegex.test(email)) {
      emails.push(email);
    }
  }

  // Remove duplicates
  const uniqueEmails = [...new Set(emails)];
  console.log(`Found ${uniqueEmails.length} unique valid emails`);

  // Get existing emails to avoid duplicates
  const existing = await db.select({ email: signupWhitelist.email }).from(signupWhitelist);
  const existingSet = new Set(existing.map(e => e.email.toLowerCase()));

  // Filter to only new emails
  const newEmails = uniqueEmails.filter(email => !existingSet.has(email));
  console.log(`${newEmails.length} new emails to add (${uniqueEmails.length - newEmails.length} already exist)`);

  if (newEmails.length === 0) {
    console.log('No new emails to add. Done.');
    return;
  }

  // Insert in batches
  const BATCH_SIZE = 100;
  let added = 0;
  let errors = 0;

  for (let i = 0; i < newEmails.length; i += BATCH_SIZE) {
    const batch = newEmails.slice(i, i + BATCH_SIZE);

    try {
      await db.insert(signupWhitelist).values(
        batch.map(email => ({ email }))
      ).onConflictDoNothing();

      added += batch.length;
      console.log(`Progress: ${added}/${newEmails.length} emails added`);
    } catch (error) {
      console.error(`Error inserting batch starting at ${i}:`, error.message);
      errors += batch.length;
    }
  }

  console.log('\n=== Import Complete ===');
  console.log(`Total emails processed: ${uniqueEmails.length}`);
  console.log(`Already existed: ${uniqueEmails.length - newEmails.length}`);
  console.log(`Successfully added: ${added - errors}`);
  if (errors > 0) console.log(`Errors: ${errors}`);
}

main().catch(console.error);
