// Script to automatically create the database if it doesn't exist
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Client } = require('pg');

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'postgres', // Connect to default 'postgres' database first
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

const targetDatabase = process.env.DB_NAME || 'elcandi_db';

console.log('========================================');
console.log('Auto Database Creation Script');
console.log('========================================\n');

console.log('Configuration:');
console.log(`  Host: ${config.host}`);
console.log(`  Port: ${config.port}`);
console.log(`  Target Database: ${targetDatabase}`);
console.log(`  Username: ${config.user}\n`);

async function createDatabase() {
  const client = new Client(config);

  try {
    // Connect to PostgreSQL server (using default 'postgres' database)
    console.log('Connecting to PostgreSQL server...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL server\n');

    // Check if database already exists
    console.log(`Checking if database '${targetDatabase}' exists...`);
    const checkQuery = `
      SELECT 1 FROM pg_database WHERE datname = $1
    `;
    const result = await client.query(checkQuery, [targetDatabase]);

    if (result.rows.length > 0) {
      console.log(`✅ Database '${targetDatabase}' already exists!\n`);
      console.log('No action needed. You can start your server with: npm start\n');
      await client.end();
      return;
    }

    // Create the database
    console.log(`Database '${targetDatabase}' does not exist.`);
    console.log(`Creating database '${targetDatabase}'...\n`);
    
    // Note: CREATE DATABASE cannot be run in a transaction, so we use a template
    await client.query(`CREATE DATABASE ${targetDatabase}`);
    
    console.log(`✅ SUCCESS: Database '${targetDatabase}' created successfully!\n`);
    console.log('You can now start your server with: npm start\n');

    await client.end();
  } catch (error) {
    console.error('❌ ERROR: Failed to create database\n');
    console.error('Error details:');
    console.error(`  Message: ${error.message}\n`);

    if (error.message.includes('password authentication failed')) {
      console.log('💡 SOLUTION:');
      console.log('  Your PostgreSQL password is incorrect.');
      console.log('  Update DB_PASSWORD in your .env file.\n');
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('connect')) {
      console.log('💡 SOLUTION:');
      console.log('  PostgreSQL service is not running.');
      console.log('  Start PostgreSQL service and try again.\n');
    } else if (error.message.includes('permission denied')) {
      console.log('💡 SOLUTION:');
      console.log('  Your user does not have permission to create databases.');
      console.log('  You may need to use the postgres superuser or grant permissions.\n');
    } else {
      console.log('💡 Check the error message above for specific guidance.\n');
    }

    process.exit(1);
  }
}

createDatabase();

