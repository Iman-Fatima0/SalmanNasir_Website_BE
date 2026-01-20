// Script to add type column to lessons table
require('dotenv').config();
const { Client } = require('pg');
const config = require('../src/config/env');

async function addLessonTypeColumn() {
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

    // Check if type column exists
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'lessons' AND column_name = 'type';
    `;
    const result = await client.query(checkQuery);

    if (result.rows.length > 0) {
      console.log('⚠️  Type column already exists in lessons table');
      await client.end();
      return;
    }

    // Create ENUM type if it doesn't exist
    console.log('Creating lesson_type ENUM type...');
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE enum_lessons_type AS ENUM ('VIDEO', 'PDF', 'TEXT', 'QUIZ');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Add type column with default value
    console.log('Adding type column to lessons table...');
    await client.query(`
      ALTER TABLE lessons 
      ADD COLUMN type enum_lessons_type NOT NULL DEFAULT 'VIDEO';
    `);

    console.log('✅ Successfully added type column to lessons table');
    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await client.end();
    process.exit(1);
  }
}

addLessonTypeColumn();

