const { Sequelize } = require('sequelize');
const { Client } = require('pg');
const config = require('./env');
const fs = require('fs');
const path = require('path');

// Function to create database if it doesn't exist
const ensureDatabaseExists = async () => {
  const adminClient = new Client({
    host: config.DB_HOST,
    port: config.DB_PORT,
    database: 'postgres', // Connect to default postgres database
    user: config.DB_USER,
    password: config.DB_PASSWORD,
  });

  try {
    await adminClient.connect();
    
    // Check if database exists
    const result = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [config.DB_NAME]
    );

    if (result.rows.length === 0) {
      console.log(`📦 Database '${config.DB_NAME}' does not exist. Creating...`);
      await adminClient.query(`CREATE DATABASE ${config.DB_NAME}`);
      console.log(`✅ Database '${config.DB_NAME}' created successfully.`);
    }
  } catch (error) {
    // If database creation fails, it might already exist or be a permission issue
    if (!error.message.includes('already exists')) {
      console.warn(`⚠️  Could not auto-create database: ${error.message}`);
      console.warn('   You may need to create it manually or run: npm run create-db');
    }
  } finally {
    await adminClient.end();
  }
};

const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    port: config.DB_PORT,
    dialect: 'postgres',
    logging: config.NODE_ENV === 'development' ? false : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Export sequelize immediately
module.exports = sequelize;

// Load all models and associations through the central model loader
// This ensures proper initialization order and eliminates circular dependencies
// #region agent log
try{const logPath=path.join(__dirname,'../../.cursor/debug.log');const logData={location:'database.js:beforeModels',message:'Before loading models via index.js',data:{sequelizeType:typeof sequelize,sequelizeDefined:!!sequelize},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'};fs.appendFileSync(logPath,JSON.stringify(logData)+'\n');}catch(e){}
// #endregion
require('../models/index');
// #region agent log
try{const logPath=path.join(__dirname,'../../.cursor/debug.log');const logData={location:'database.js:afterModels',message:'After loading models via index.js',data:{modelsLoaded:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'};fs.appendFileSync(logPath,JSON.stringify(logData)+'\n');}catch(e){}
// #endregion

// Test connection
const connectDB = async () => {
  try {
    // First, ensure database exists
    await ensureDatabaseExists();
    
    // Then connect
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established successfully.');
    
    // Sync models in development
    if (config.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false }); // Set to true for auto-migration in dev
    }
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL:', error.message);
    if (error.message.includes('does not exist')) {
      console.error('💡 Try running: npm run create-db');
    }
    process.exit(1);
  }
};

module.exports.connectDB = connectDB;
