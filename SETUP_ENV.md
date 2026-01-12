# Environment Variables Setup Guide

## Quick Setup

1. **Copy the template file:**
   ```bash
   # Windows PowerShell
   Copy-Item env.template .env
   
   # Or manually create .env file and copy content from env.template
   ```

2. **Fill in your values** in the `.env` file

3. **Generate JWT Secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and paste it as `JWT_SECRET` in your `.env` file.

## Required Variables

These variables are **REQUIRED** for the application to start:

- `DB_HOST` - PostgreSQL host (usually `localhost`)
- `DB_PORT` - PostgreSQL port (usually `5432`)
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT tokens (minimum 32 characters)
- `JWT_EXPIRES_IN` - Token expiration (e.g., `7d`, `24h`)

## Optional Variables

These are optional but recommended:

### OAuth Providers
- Google, Facebook, LinkedIn, Apple OAuth credentials
- Only configure the providers you want to use
- If not configured, those OAuth endpoints will not work

### Email (SMTP)
- Required for password reset functionality
- If not configured, password reset emails will be logged to console in development
- For Gmail, you need to:
  1. Enable 2-Factor Authentication
  2. Generate an App Password: https://myaccount.google.com/apppasswords
  3. Use the App Password (not your regular password)

## Example .env File

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=elcandi_db
DB_USER=postgres
DB_PASSWORD=mypassword123

JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
JWT_EXPIRES_IN=7d

# OAuth (optional - only add if you're using them)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (optional - only add if you want password reset emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

## Security Notes

- ⚠️ **NEVER commit `.env` to version control**
- ✅ The `.env` file is already in `.gitignore`
- ✅ Use strong, unique values for `JWT_SECRET`
- ✅ Use App Passwords for Gmail (not your regular password)
- ✅ Keep OAuth credentials secure

