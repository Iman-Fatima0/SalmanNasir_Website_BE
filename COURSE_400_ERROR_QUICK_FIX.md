# 🔧 Course Creation 400 Error - Quick Fix

## ✅ Fix Applied

The validation schema has been updated to accept **file paths** (like `/uploads/videos/file.mp4`) in addition to full URLs.

### What Was Fixed:
- ✅ `videoUrl` - Now accepts `/uploads/videos/...` paths
- ✅ `audioUrl` - Now accepts `/uploads/audio/...` paths  
- ✅ `contentUrl` - Now accepts `/uploads/pdfs/...` paths
- ✅ `thumbnailUrl` - Now accepts `/uploads/images/...` paths

## 🚀 Next Steps

1. **Restart backend server** (if it's running):
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Try creating the course again**

3. **If still getting 400 error**, check the backend console for specific validation errors

## 🔍 Debugging

The validation middleware logs detailed errors. Look in your backend console for:
- `Validation middleware called` - Shows request received
- `Validation failed` - Shows which fields failed

Common validation errors:
- Missing required fields: `title`, `description`, `price` (if no `productId`)
- Invalid UUIDs: `productId`, `instructorIds`
- Missing chapter/lesson fields: `title`, `order`

## 📝 Required Fields

When creating a course **without** `productId`:
- ✅ `title` - Required
- ✅ `description` - Required
- ✅ `price` - Required (number >= 0)

When creating a course **with** `productId`:
- ✅ `productId` - Must be valid UUID
- ⚪ `title`, `description`, `price` - Optional (will use product values)

## ✅ Expected Behavior

After the fix, course creation should work with:
- File paths: `/uploads/videos/lesson-123.mp4`
- Full URLs: `https://cdn.example.com/video.mp4`
- Empty/null: `null` or `""`

---

**The validation schema is now fixed. Restart the server and try again!**

