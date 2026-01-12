// Test PostgreSQL database connection
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Sequelize } = require('sequelize');

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'elcandi_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

console.log('========================================');
console.log('Testing PostgreSQL Connection');
console.log('========================================\n');
console.log('Configuration:');
console.log(`  Host: ${config.host}`);
console.log(`  Port: ${config.port}`);
console.log(`  Database: ${config.database}`);
console.log(`  Username: ${config.username}`);
console.log(`  Password: ${config.password ? '***' + config.password.slice(-2) : '(empty)'}\n`);

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: 'postgres',
    logging: false,
  }
);

async function testConnection() {
  try {
    console.log('Attempting to connect...\n');
    await sequelize.authenticate();
    console.log('✅ SUCCESS: Database connection successful!\n');
    console.log('Your database credentials are working correctly.');
    console.log('You can now start your server with: npm start\n');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.log('❌ ERROR: Database connection failed!\n');
    console.log('Error details:');
    console.log(`  Message: ${error.message}\n`);
    
    if (error.message.includes('password authentication failed')) {
      console.log('💡 SOLUTION:');
      console.log('  1. Set a password for the postgres user:');
      console.log('     - Open "SQL Shell (psql)" from Start Menu');
      console.log('     - Press Enter for defaults');
      console.log('     - Run: ALTER USER postgres WITH PASSWORD \'your_password\';');
      console.log('  2. Update DB_PASSWORD in your .env file\n');
    } else if (error.message.includes('does not exist')) {
      console.log('💡 SOLUTION:');
      console.log('  1. Create the database:');
      console.log('     - Open "SQL Shell (psql)"');
      console.log('     - Run: CREATE DATABASE elcandi_db;');
      console.log('  2. Update DB_NAME in your .env file if different\n');
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('connect')) {
      console.log('💡 SOLUTION:');
      console.log('  1. Make sure PostgreSQL service is running');
      console.log('  2. Check if PostgreSQL is installed');
      console.log('  3. Verify DB_HOST and DB_PORT in .env file\n');
    } else {
      console.log('💡 Check the error message above for specific guidance.\n');
    }
    
    process.exit(1);
  }
}

testConnection();

