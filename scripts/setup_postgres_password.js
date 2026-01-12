// Script to help set PostgreSQL password
// This will guide you through setting a password for the postgres user

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('========================================');
console.log('PostgreSQL Password Setup Helper');
console.log('========================================\n');

console.log('If PostgreSQL was installed without a password, you have a few options:\n');

console.log('OPTION 1: Set a password for postgres user (Recommended)');
console.log('----------------------------------------');
console.log('1. Open "SQL Shell (psql)" from Start Menu');
console.log('2. Press Enter for all defaults (server, database, port, username)');
console.log('3. When it asks for password, just press Enter (if no password is set)');
console.log('4. Once connected, run this SQL command:');
console.log('   ALTER USER postgres WITH PASSWORD \'your_new_password\';');
console.log('5. Update your .env file with this password\n');

console.log('OPTION 2: Use pgAdmin (GUI)');
console.log('----------------------------------------');
console.log('1. Open pgAdmin (installed with PostgreSQL)');
console.log('2. Connect to your PostgreSQL server');
console.log('3. Right-click on "Login/Group Roles" → "postgres" → "Properties"');
console.log('4. Go to "Definition" tab → Set password');
console.log('5. Click "Save"\n');

console.log('OPTION 3: Reset via Command Line');
console.log('----------------------------------------');
console.log('If you have admin access, you can reset the password:');
console.log('1. Open Command Prompt as Administrator');
console.log('2. Navigate to PostgreSQL bin folder (usually):');
console.log('   cd "C:\\Program Files\\PostgreSQL\\[version]\\bin"');
console.log('3. Run:');
console.log('   psql -U postgres');
console.log('4. Then run: ALTER USER postgres WITH PASSWORD \'newpassword\';\n');

console.log('OPTION 4: Check if PostgreSQL uses trust authentication');
console.log('----------------------------------------');
console.log('If PostgreSQL is configured for "trust" authentication,');
console.log('you might be able to leave DB_PASSWORD empty or use an empty string.');
console.log('However, this is NOT recommended for security.\n');

console.log('========================================');
console.log('Quick Test:');
console.log('========================================');
console.log('Try connecting with an empty password first:');
console.log('In your .env file, try:');
console.log('DB_PASSWORD=');
console.log('\nIf that doesn\'t work, you MUST set a password using one of the options above.\n');

rl.question('Do you want to test the connection now? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    console.log('\nTesting connection...');
    console.log('Make sure your .env file has the database credentials set.');
    console.log('Run: node test-db.js (if you have a test file)');
  }
  rl.close();
});

