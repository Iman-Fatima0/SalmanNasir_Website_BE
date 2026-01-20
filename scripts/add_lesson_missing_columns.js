// Script to add missing columns to lessons table
require('dotenv').config();
const { Client } = require('pg');
const config = require('../src/config/env');

async function addLessonMissingColumns() {
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

    // Check existing columns
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'lessons';
    `;
    const result = await client.query(checkQuery);
    const existingColumns = result.rows.map(row => row.column_name);
    console.log('Existing columns:', existingColumns.join(', '));

    // Add contentUrl if missing
    if (!existingColumns.includes('contentUrl')) {
      console.log('Adding contentUrl column...');
      await client.query(`
        ALTER TABLE lessons 
        ADD COLUMN "contentUrl" VARCHAR(255) NULL;
      `);
      console.log('✅ Added contentUrl column');
    } else {
      console.log('⚠️  contentUrl column already exists');
    }

    // Add textContent if missing
    if (!existingColumns.includes('textContent')) {
      console.log('Adding textContent column...');
      await client.query(`
        ALTER TABLE lessons 
        ADD COLUMN "textContent" TEXT NULL;
      `);
      console.log('✅ Added textContent column');
    } else {
      console.log('⚠️  textContent column already exists');
    }

    // Add videoUrl if missing
    if (!existingColumns.includes('videoUrl')) {
      console.log('Adding videoUrl column...');
      await client.query(`
        ALTER TABLE lessons 
        ADD COLUMN "videoUrl" VARCHAR(255) NULL;
      `);
      console.log('✅ Added videoUrl column');
    } else {
      console.log('⚠️  videoUrl column already exists');
    }

    // Add durationMinutes if missing
    if (!existingColumns.includes('durationMinutes')) {
      console.log('Adding durationMinutes column...');
      await client.query(`
        ALTER TABLE lessons 
        ADD COLUMN "durationMinutes" INTEGER NULL;
      `);
      console.log('✅ Added durationMinutes column');
    } else {
      console.log('⚠️  durationMinutes column already exists');
    }

    // Add isPreview if missing
    if (!existingColumns.includes('isPreview')) {
      console.log('Adding isPreview column...');
      await client.query(`
        ALTER TABLE lessons 
        ADD COLUMN "isPreview" BOOLEAN NOT NULL DEFAULT false;
      `);
      console.log('✅ Added isPreview column');
    } else {
      console.log('⚠️  isPreview column already exists');
    }

    console.log('✅ All missing columns have been added to lessons table');
    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    await client.end();
    process.exit(1);
  }
}

addLessonMissingColumns();

