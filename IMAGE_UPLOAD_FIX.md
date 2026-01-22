# Image Upload Fix - ERR_CONNECTION_RESET

## 🔧 Problem
Getting `ERR_CONNECTION_RESET` when uploading images to `/api/upload/image`

## ✅ Solution

### 1. **New Endpoint for Profile Images**
Added a new endpoint specifically for profile image uploads that allows **any authenticated user** (not just admin/instructor):

```
POST /api/upload/profile-image
Authorization: Bearer <token>
Content-Type: multipart/form-data
Body: { image: <file> }
```

### 2. **Original Endpoint (Admin/Instructor Only)**
The original endpoint still exists but requires admin/instructor role:

```
POST /api/upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data
Body: { image: <file> }
```

## 📋 Changes Made

1. **New Route**: `/api/upload/profile-image` - for regular users
2. **Separate Multer Config**: Profile images have 10MB limit (more reasonable)
3. **Better Error Handling**: Improved error messages for upload failures
4. **Increased Body Limits**: Increased Express body parsing limits to 50MB

## 🚀 How to Use

### For Profile Images (Regular Users)
```javascript
// Frontend code
const formData = new FormData();
formData.append('image', file);

const response = await fetch('/api/upload/profile-image', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
// Response: { success: true, data: { url: '/uploads/images/...', fullUrl: '...' } }
```

### For General Images (Admin/Instructor)
```javascript
// Frontend code
const formData = new FormData();
formData.append('image', file);

const response = await fetch('/api/upload/image', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

## 📝 Response Format

```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "data": {
    "filename": "profile-1234567890-987654321.jpg",
    "originalName": "my-photo.jpg",
    "size": 245678,
    "mimetype": "image/jpeg",
    "url": "/uploads/images/profile-1234567890-987654321.jpg",
    "fullUrl": "http://localhost:3000/uploads/images/profile-1234567890-987654321.jpg"
  }
}
```

## ⚠️ Important Notes

1. **File Size Limits**:
   - Profile images: 10MB max
   - General images: 500MB max (for admin/instructor)

2. **Allowed File Types**:
   - JPEG/JPG
   - PNG
   - GIF
   - WebP

3. **Authentication Required**: Both endpoints require a valid JWT token

4. **Field Name**: Must use `image` as the field name in FormData

## 🔍 Troubleshooting

### Still Getting ERR_CONNECTION_RESET?

1. **Check File Size**: Ensure image is under 10MB
2. **Check File Type**: Ensure it's a valid image format
3. **Check Authentication**: Ensure you're sending a valid JWT token
4. **Check Backend Logs**: Look for error messages in server console
5. **Check Upload Directory**: Ensure `uploads/images` directory exists and is writable

### Common Errors

**403 Forbidden**: 
- Using `/api/upload/image` without admin/instructor role
- Solution: Use `/api/upload/profile-image` instead

**400 Bad Request - File too large**:
- Image exceeds 10MB limit
- Solution: Compress or resize the image

**400 Bad Request - Invalid file type**:
- File is not a valid image format
- Solution: Convert to JPEG, PNG, GIF, or WebP

**401 Unauthorized**:
- Missing or invalid JWT token
- Solution: Ensure you're logged in and sending the token

## 🎯 Frontend Update Required

Update your frontend to use the new endpoint:

**Before:**
```javascript
POST /api/upload/image  // ❌ Requires admin/instructor role
```

**After:**
```javascript
POST /api/upload/profile-image  // ✅ Works for all authenticated users
```

## ✅ Testing

1. **Test Profile Image Upload**:
   ```bash
   curl -X POST http://localhost:3000/api/upload/profile-image \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -F "image=@/path/to/image.jpg"
   ```

2. **Verify Response**:
   - Should return 200 with image URL
   - Check that file exists in `uploads/images/` directory

3. **Test in Frontend**:
   - Upload a profile image
   - Verify it appears correctly
   - Check that URL is saved to user profile

---

**The connection reset error should now be fixed!** 🎉
