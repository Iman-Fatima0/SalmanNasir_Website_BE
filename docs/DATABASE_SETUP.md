# PostgreSQL Database Setup Guide

## Database Credentials (Lines 16-21 in .env)

These are your **PostgreSQL database connection credentials**:

```env
DB_HOST=localhost          # Database server address (usually localhost)
DB_PORT=5432              # PostgreSQL default port
DB_NAME=elcandi_db        # Your database name (create this)
DB_USER=postgres          # Database username (default is 'postgres')
DB_PASSWORD=your_password # Database password (set during PostgreSQL installation)
```

## Step-by-Step Setup

### Option 1: Using PostgreSQL (Recommended)

#### 1. Install PostgreSQL

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Or use installer: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
- During installation, remember the password you set for the `postgres` user

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

#### 2. Start PostgreSQL Service

**Windows:**
- PostgreSQL service should start automatically
- Check in Services: `services.msc` → Look for "postgresql"

**macOS/Linux:**
```bash
# Check if running
sudo systemctl status postgresql

# Start if not running
sudo systemctl start postgresql
```

#### 3. Create Your Database

**Using psql (Command Line):**

```bash
# Connect to PostgreSQL (will prompt for password)
psql -U postgres

# Or on Windows, use:
# "SQL Shell (psql)" from Start Menu
```

Once connected, run:

```sql
-- Create database
CREATE DATABASE elcandi_db;

-- Create a new user (optional, or use 'postgres')
CREATE USER elcandi_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE elcandi_db TO elcandi_user;

-- Exit psql
\q
```

**Using pgAdmin (GUI):**
1. Open pgAdmin (installed with PostgreSQL)
2. Connect to your PostgreSQL server
3. Right-click "Databases" → "Create" → "Database"
4. Name: `elcandi_db`
5. Click "Save"

#### 4. Update Your .env File

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elcandi_db
DB_USER=postgres              # or elcandi_user if you created one
DB_PASSWORD=your_actual_password  # The password you set during installation
```

### Option 2: Using Docker (Quick Setup)

If you have Docker installed:

```bash
# Run PostgreSQL in Docker
docker run --name elcandi-postgres \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=elcandi_db \
  -p 5432:5432 \
  -d postgres:14

# Your .env would be:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elcandi_db
DB_USER=postgres
DB_PASSWORD=your_password
```

### Option 3: Using Cloud Database (Production)

For production, you can use:
- **AWS RDS**: https://aws.amazon.com/rds/postgresql/
- **Heroku Postgres**: https://www.heroku.com/postgres
- **ElephantSQL**: https://www.elephantsql.com/
- **Supabase**: https://supabase.com/

They will provide connection strings like:
```
postgres://username:password@host:port/database
```

Extract the values:
- `DB_HOST`: The hostname from the connection string
- `DB_PORT`: Usually 5432
- `DB_NAME`: Database name
- `DB_USER`: Username
- `DB_PASSWORD`: Password

## Verify Your Setup

### Test Connection

Create a test file `test-db.js`:

```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();
```

Run it:
```bash
node test-db.js
```

## Common Issues

### 1. "Connection refused" or "Cannot connect"
- **Solution**: Make sure PostgreSQL service is running
- Windows: Check Services → PostgreSQL
- Linux/Mac: `sudo systemctl status postgresql`

### 2. "Password authentication failed"
- **Solution**: Double-check your password in `.env`
- Try resetting PostgreSQL password:
  ```sql
  ALTER USER postgres WITH PASSWORD 'new_password';
  ```

### 3. "Database does not exist"
- **Solution**: Create the database first (see Step 3 above)

### 4. "Permission denied"
- **Solution**: Make sure your user has privileges:
  ```sql
  GRANT ALL PRIVILEGES ON DATABASE elcandi_db TO postgres;
  ```

## Quick Reference

| Credential | Default Value | Description |
|------------|---------------|-------------|
| `DB_HOST` | `localhost` | Database server address |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `elcandi_db` | Your database name (create this) |
| `DB_USER` | `postgres` | Database username |
| `DB_PASSWORD` | (set during install) | Password you set during PostgreSQL installation |

## Next Steps

After setting up your database:

1. ✅ Update `.env` with your credentials
2. ✅ Test connection (use test-db.js above)
3. ✅ Run migrations: `npm run migrate` (if you have migration scripts)
4. ✅ Start server: `npm start`

The application will automatically create tables when it starts (in development mode).

