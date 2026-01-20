# File Upload Troubleshooting Guide

## Common Issues

### 1. ERR_CONNECTION_RESET

**Symptoms:**
- Upload fails with "Network error: Could not connect to server"
- `ERR_CONNECTION_RESET` in browser console

**Possible Causes:**
1. Backend server not running
2. Server crashing during upload
3. Middleware error before file processing
4. File size too large
5. Multer configuration issue

**Solutions:**

#### Check if server is running:
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Or restart the server
npm run dev
```

#### Check server logs:
Look for errors in the backend console when uploading.

#### Verify file size:
- Maximum file size: 500MB
- If file is larger, it will be rejected

#### Check authentication:
- Ensure you're logged in as admin or instructor
- Check that the JWT token is valid
- Verify the token is sent in the Authorization header

### 2. 401 Unauthorized

**Solution:**
- Make sure you're logged in
- Check that the token is being sent: `Authorization: Bearer <token>`
- Verify user has admin or instructor role

### 3. 403 Forbidden

**Solution:**
- User must have `admin` or `instructor` role
- Check user role in database: `SELECT email, role FROM users WHERE email = 'your@email.com';`

### 4. File Upload Succeeds but Preview Doesn't Work

**Solution:**
- Check if file exists in `uploads/` directory
- Verify file path is correct
- Check server has read permissions for uploads directory

### 5. Multer Errors

**Common Multer Errors:**

#### "Unexpected field"
- **Cause:** Form field name doesn't match expected name
- **Solution:** Use correct field names:
  - Video: `video`
  - Audio: `audio`
  - PDF: `pdf`
  - Image: `image`

#### "File too large"
- **Cause:** File exceeds 500MB limit
- **Solution:** Compress file or increase limit in `src/middleware/upload.js`

#### "Invalid file type"
- **Cause:** File MIME type not allowed
- **Solution:** Check allowed file types in `src/middleware/upload.js`

## Testing Upload Endpoint

### Using cURL:
```bash
curl -X POST http://localhost:3000/api/upload/video \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "video=@/path/to/video.mp4"
```

### Using Postman:
1. Method: POST
2. URL: `http://localhost:3000/api/upload/video`
3. Headers:
   - `Authorization: Bearer YOUR_TOKEN`
4. Body: form-data
   - Key: `video` (type: File)
   - Value: Select your video file

### Using JavaScript:
```javascript
const formData = new FormData();
formData.append('video', file);

const response = await fetch('http://localhost:3000/api/upload/video', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    // Don't set Content-Type - browser will set it with boundary
  },
  body: formData,
});
```

## Server Restart Required

After adding upload routes, **restart the backend server**:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Verify Upload Routes Are Working

1. Check server logs for route registration
2. Test health endpoint: `GET http://localhost:3000/health`
3. Test upload endpoint with a small file first

## File Storage Location

Files are stored in:
```
Elcandi_Website_BE/uploads/
├── videos/
├── audio/
├── pdfs/
├── images/
└── thumbnails/
```

## Permissions

Ensure the server has:
- **Write permissions** to create `uploads/` directory
- **Read permissions** to serve files
- **Delete permissions** to remove files

## Next Steps

1. **Restart backend server** to load new routes
2. **Check server console** for any errors
3. **Test with a small file first** (e.g., 1MB image)
4. **Verify authentication token** is valid
5. **Check user role** in database

