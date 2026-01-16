# Quick Start - Backend Server

## 🚀 Start Backend Server

### Step 1: Navigate to Backend Directory
```bash
cd Elcandi_Website_BE
```

### Step 2: Install Dependencies (if not already done)
```bash
npm install
```

### Step 3: Start the Server

**Development Mode (Recommended):**
```bash
npm run dev
```

**OR Production Mode:**
```bash
npm start
```

### Step 4: Verify Server is Running

You should see:
```
✅ PostgreSQL connection established successfully.
🚀 Server running on port 3000
📝 Environment: development
🌐 CORS enabled for: http://localhost:3001
```

---

## ✅ Test the Server

### Option 1: Browser
Open: `http://localhost:3000/health`

### Option 2: PowerShell
```powershell
Invoke-WebRequest -Uri http://localhost:3000/health
```

### Option 3: Test API Endpoint
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/courses?limit=1"
```

---

## 🔧 If Server Won't Start

### 1. Check PostgreSQL is Running
```powershell
Get-Service -Name postgresql*
```

If not running:
```powershell
Start-Service postgresql-x64-15  # Replace with your version
```

### 2. Check .env File Exists
```powershell
Test-Path .env
```

If false, copy from template:
```powershell
Copy-Item env.template .env
```

Then edit `.env` and fill in your database credentials.

### 3. Create Database if Needed
```bash
npm run create-db
```

### 4. Check for Port Conflicts
If port 3000 is in use, change PORT in `.env`:
```env
PORT=3001
```

---

## 📋 Server Status Check

**Server Running?**
- ✅ Check: `http://localhost:3000/health` returns OK
- ❌ If connection refused: Server is not running

**Database Connected?**
- ✅ Server logs show: "PostgreSQL connection established successfully"
- ❌ If error: Check database credentials in `.env`

---

## 🎯 Frontend Connection

Once backend is running on `http://localhost:3000`, your frontend should be able to connect.

**Make sure your Vite proxy is configured:**
```javascript
// vite.config.js
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

**Keep the server running in a terminal window while developing!**

