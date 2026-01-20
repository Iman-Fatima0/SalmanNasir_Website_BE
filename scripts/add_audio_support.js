// Script to add AUDIO type and audioUrl column to lessons table
require('dotenv').config();
const { Client } = require('pg');
const config = require('../src/config/env');

async function addAudioSupport() {
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

    // Check if audioUrl column exists
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'lessons' AND column_name = 'audioUrl';
    `;
    const columnResult = await client.query(checkColumnQuery);

    if (columnResult.rows.length > 0) {
      console.log('⚠️  audioUrl column already exists');
    } else {
      // Add audioUrl column
      console.log('Adding audioUrl column to lessons table...');
      await client.query(`
        ALTER TABLE lessons 
        ADD COLUMN "audioUrl" VARCHAR(255) NULL;
      `);
      console.log('✅ Added audioUrl column');
    }

    // Check if AUDIO is in the enum
    const checkEnumQuery = `
      SELECT unnest(enum_range(NULL::enum_lessons_type))::text as enum_value;
    `;
    const enumResult = await client.query(checkEnumQuery);
    const enumValues = enumResult.rows.map(row => row.enum_value);

    if (enumValues.includes('AUDIO')) {
      console.log('⚠️  AUDIO type already exists in enum');
    } else {
      // Add AUDIO to enum
      console.log('Adding AUDIO type to enum_lessons_type...');
      await client.query(`
        ALTER TYPE enum_lessons_type ADD VALUE IF NOT EXISTS 'AUDIO';
      `);
      console.log('✅ Added AUDIO type to enum');
    }

    console.log('✅ Audio support added successfully');
    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    await client.end();
    process.exit(1);
  }
}

addAudioSupport();

