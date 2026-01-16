# Troubleshooting Guide

## 🔧 Common Issues and Solutions

---

## ❌ Error: `connect ECONNREFUSED ::1:3000` or `ECONNREFUSED localhost:3000`

### Problem
Frontend cannot connect to backend API. The backend server is not running.

### Solution

#### 1. Start the Backend Server

**Option A: Development Mode (with auto-reload)**
```bash
cd Elcandi_Website_BE
npm run dev
```

**Option B: Production Mode**
```bash
cd Elcandi_Website_BE
npm start
```

#### 2. Verify Server is Running

You should see:
```
✅ PostgreSQL connection established successfully.
🚀 Server running on port 3000
📝 Environment: development
🌐 CORS enabled for: http://localhost:3001
```

#### 3. Test the Connection

Open browser or use curl:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## ❌ Error: Database Connection Failed

### Problem
Backend cannot connect to PostgreSQL database.

### Solutions

#### 1. Check PostgreSQL is Running

**Windows:**
```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*
```

**Start PostgreSQL if not running:**
```powershell
Start-Service postgresql-x64-15  # Replace with your version
```

**Mac/Linux:**
```bash
# Check status
sudo systemctl status postgresql

# Start if needed
sudo systemctl start postgresql
```

#### 2. Verify Database Credentials

Check your `.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elcandi_db
DB_USER=postgres
DB_PASSWORD=your_password
```

#### 3. Create Database if Missing

```bash
npm run create-db
```

#### 4. Test Database Connection

```bash
npm run test-db
```

---

## ❌ Error: `Missing required environment variables`

### Problem
Required environment variables are not set.

### Solution

1. **Check if `.env` file exists:**
   ```bash
   ls -la .env
   ```

2. **Copy from template if missing:**
   ```bash
   cp env.template .env
   ```

3. **Fill in all required variables in `.env`:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=elcandi_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   ```

4. **Restart the server**

---

## ❌ Error: Port 3000 Already in Use

### Problem
Another process is already using port 3000.

### Solutions

#### Option 1: Change Backend Port

Update `.env`:
```env
PORT=3001
```

Update frontend proxy config to match.

#### Option 2: Kill Process on Port 3000

**Windows:**
```powershell
# Find process
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
```

---

## ❌ Error: CORS Error in Browser

### Problem
Frontend and backend are on different ports/origins.

### Solution

1. **Check CORS_ORIGIN in `.env`:**
   ```env
   CORS_ORIGIN=http://localhost:3001
   # Or use * for development (not recommended for production)
   CORS_ORIGIN=*
   ```

2. **Restart backend server**

3. **Verify frontend URL matches CORS_ORIGIN**

---

## ❌ Error: `Cannot find module` Errors

### Problem
Dependencies are not installed.

### Solution

```bash
cd Elcandi_Website_BE
npm install
```

---

## ❌ Error: `Admin access required` (403)

### Problem
Trying to access admin routes without admin credentials.

### Solution

1. **Login as admin:**
   - Email: `admin@elcanadi.com`
   - Password: `Admin123!`

2. **Use the JWT token from login response in Authorization header:**
   ```
   Authorization: Bearer <token>
   ```

3. **Verify you're logged in as admin:**
   ```javascript
   // Check current user
   GET /api/auth/me
   // Should return user with email: admin@elcanadi.com
   ```

---

## ✅ Quick Health Check

Run these commands to verify everything is working:

```bash
# 1. Check database connection
npm run test-db

# 2. Start server
npm run dev

# 3. Test API (in another terminal)
curl http://localhost:3000/health

# 4. Test courses endpoint
curl http://localhost:3000/api/courses?limit=1
```

---

## 🔍 Debugging Tips

### 1. Check Server Logs

Look for error messages in the terminal where the server is running.

### 2. Enable SQL Logging (Development Only)

In `src/config/database.js`, temporarily change:
```javascript
logging: console.log, // Shows all SQL queries
```

### 3. Test API Endpoints Directly

Use Postman, curl, or browser:
```bash
# Health check
curl http://localhost:3000/health

# Get courses
curl http://localhost:3000/api/courses?limit=1

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@elcanadi.com","password":"Admin123!"}'
```

### 4. Check Frontend Proxy Configuration

If using Vite, check `vite.config.js`:
```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
};
```

---

## 📋 Common Startup Checklist

- [ ] PostgreSQL is running
- [ ] `.env` file exists and is configured
- [ ] Database exists (`npm run create-db`)
- [ ] Dependencies installed (`npm install`)
- [ ] Backend server is running (`npm run dev`)
- [ ] Server is accessible at `http://localhost:3000`
- [ ] Health check returns OK (`/health`)

---

## 🆘 Still Having Issues?

1. **Check all logs** - Server, database, frontend console
2. **Verify environment** - All `.env` variables are set
3. **Test endpoints** - Use curl/Postman to test API directly
4. **Check ports** - Ensure no port conflicts
5. **Restart services** - Restart PostgreSQL and backend server

---

**If the problem persists, check the error message carefully and search for specific error codes online!**

