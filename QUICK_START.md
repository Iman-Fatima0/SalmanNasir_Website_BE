# Quick Start Guide

## ✅ Automatic Database Creation

**Good news!** The database can now be created automatically! No need to use SQL commands manually.

## Quick Setup (3 Steps)

### Step 1: Create the Database Automatically

Simply run this command:

```powershell
cd Elcandi_Website_BE
npm run create-db
```

This will:
- ✅ Connect to PostgreSQL
- ✅ Check if the database exists
- ✅ Create it automatically if it doesn't exist

**That's it!** No SQL commands needed.

### Step 2: Test the Connection (Optional)

Verify everything is working:

```powershell
npm run test-db
```

You should see: ✅ SUCCESS: Database connection successful!

### Step 3: Start Your Server

```powershell
npm start
```

Or for development with auto-reload:

```powershell
npm run dev
```

**Note:** The server will also automatically try to create the database when it starts (if it doesn't exist), so you can skip Step 1 if you prefer.

## Available Commands

- `npm run create-db` - Create the database automatically
- `npm run test-db` - Test database connection
- `npm start` - Start the server
- `npm run dev` - Start server with auto-reload

## Manual Database Creation (Alternative)

If you prefer to create it manually:

1. Open **"SQL Shell (psql)"** from Start Menu
2. Press `Enter` for all defaults
3. Enter your password when prompted
4. Run: `CREATE DATABASE elcandi_db;`
5. Exit: Type `\q`

## Summary

- ✅ Database can be created automatically with `npm run create-db`
- ✅ Server will also auto-create database on startup
- ✅ No manual SQL commands needed!

