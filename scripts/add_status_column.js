// Script to add status column to users table
require('dotenv').config();
const { Client } = require('pg');
const config = require('../src/config/env');

async function addStatusColumn() {
  const client = new Client({
    host: config.DB_HOST,
    port: config.DB_PORT,
    database: config.DB_NAME,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Check if status column exists
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'status';
    `;
    const result = await client.query(checkQuery);

    if (result.rows.length > 0) {
      console.log('⚠️  Status column already exists');
      await client.end();
      return;
    }

    // Create ENUM type if it doesn't exist
    console.log('Creating status ENUM type...');
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE enum_users_status AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Add status column with default value
    console.log('Adding status column to users table...');
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN status enum_users_status NOT NULL DEFAULT 'ACTIVE';
    `);

    // Update existing users: if isActive is false, set status to SUSPENDED, else ACTIVE
    console.log('Updating existing users status based on isActive...');
    await client.query(`
      UPDATE users 
      SET status = CASE 
        WHEN "isActive" = false THEN 'SUSPENDED'::enum_users_status
        ELSE 'ACTIVE'::enum_users_status
      END;
    `);

    // Add deletedAt column if it doesn't exist (for soft deletes)
    const checkDeletedAtQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'deletedAt';
    `;
    const deletedAtResult = await client.query(checkDeletedAtQuery);
    
    if (deletedAtResult.rows.length === 0) {
      console.log('Adding deletedAt column for soft deletes...');
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN "deletedAt" TIMESTAMP NULL;
      `);
    }

    console.log('✅ Successfully added status and deletedAt columns to users table');
    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await client.end();
    process.exit(1);
  }
}

addStatusColumn();

