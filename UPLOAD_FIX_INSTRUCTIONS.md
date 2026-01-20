# 🔧 File Upload Fix Instructions

## Issue
`ERR_CONNECTION_RESET` when uploading files - server needs to be restarted to load new routes.

## ✅ Solution

### Step 1: Restart Backend Server

**Stop the current server:**
- Press `Ctrl+C` in the terminal where the server is running

**Start the server again:**
```bash
cd Elcandi_Website_BE
npm run dev
```

You should see:
```
🚀 Server running on port 3000
📝 Environment: development
🌐 CORS enabled for: http://localhost:3001
✅ PostgreSQL connection established successfully.
```

### Step 2: Verify Upload Routes

The server should now have these routes:
- `POST /api/upload/video`
- `POST /api/upload/audio`
- `POST /api/upload/pdf`
- `POST /api/upload/image`
- `POST /api/upload/lesson`
- `GET /api/upload/preview/:type/:filename`

### Step 3: Test Upload

Try uploading a file again. The connection should work now.

## 🔍 If Still Not Working

### Check Backend Console
Look for any errors when you try to upload. Common issues:

1. **Authentication Error:**
   - Make sure you're logged in
   - Check token is valid

2. **Role Error:**
   - User must have `admin` or `instructor` role
   - Check: `SELECT email, role FROM users WHERE email = 'admin@elcanadi.com';`

3. **File Size Error:**
   - Max file size: 500MB
   - Try with a smaller file first

4. **Directory Permissions:**
   - Ensure server can write to `uploads/` directory
   - The directory is created automatically on first upload

## 📝 Quick Test

Test with a small file first (e.g., 1MB image):

```javascript
const formData = new FormData();
formData.append('video', smallVideoFile); // Start with small file

const response = await fetch('http://localhost:3000/api/upload/video', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});
```

## ✅ Expected Behavior After Fix

1. File uploads successfully
2. Returns file URL in response
3. File is accessible via `/uploads/videos/filename.mp4`
4. Preview works via `/api/upload/preview/video/filename.mp4`

---

**Most Important:** Restart the backend server to load the new upload routes!

