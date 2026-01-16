// Script to add role column to users table
require('dotenv').config();
const { Client } = require('pg');
const config = require('../src/config/env');

async function addRoleColumn() {
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

    // Check if role column exists
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'role';
    `;
    const result = await client.query(checkQuery);

    if (result.rows.length > 0) {
      console.log('⚠️  Role column already exists');
      await client.end();
      return;
    }

    // Create ENUM type if it doesn't exist
    console.log('Creating role ENUM type...');
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE enum_users_role AS ENUM ('user', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Add role column
    console.log('Adding role column to users table...');
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN role enum_users_role NOT NULL DEFAULT 'user';
    `);

    // Update admin user to have admin role
    console.log('Updating admin user role...');
    await client.query(`
      UPDATE users 
      SET role = 'admin' 
      WHERE email = 'admin@elcanadi.com';
    `);

    console.log('✅ Successfully added role column and updated admin user');
    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await client.end();
    process.exit(1);
  }
}

addRoleColumn();

