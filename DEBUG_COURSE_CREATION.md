# 🔍 Debug Course Creation 400 Error

## How to See Validation Errors

The backend is now logging detailed validation errors. **Check your backend console** (where `npm run dev` is running) to see:

1. **Validation errors** - Which fields are failing
2. **Request body** - What data is being sent
3. **Field names** - Exact field paths that are invalid

## What to Look For

When you try to create a course, you should see in the backend console:

```
=== VALIDATION ERRORS ===
Message: Validation failed
Errors: [
  {
    "field": "title",
    "message": "Course title is required when creating a new product"
  }
]
Request body: {
  "subtitle": "...",
  ...
}
========================
```

## Common Validation Issues

### 1. Missing Required Fields
If `productId` is NOT provided, these are required:
- ✅ `title` - Course title
- ✅ `description` - Course description  
- ✅ `price` - Course price (number >= 0)

### 2. Invalid File Paths
File paths must:
- Start with `/uploads/` (e.g., `/uploads/videos/file.mp4`)
- OR be a full URL (e.g., `https://example.com/video.mp4`)
- OR be empty/null

### 3. Invalid UUIDs
- `productId` must be a valid UUID format
- `instructorIds` array must contain valid UUIDs

### 4. Chapter/Lesson Validation
- Chapter `title` is required
- Chapter `order` is required (integer >= 0)
- Lesson `title` is required
- Lesson `order` is required (integer >= 0)

## Quick Fix Checklist

1. ✅ **Check backend console** for validation errors
2. ✅ **Verify required fields** are present:
   - `title` (if no `productId`)
   - `description` (if no `productId`)
   - `price` (if no `productId`)
3. ✅ **Check file paths** format:
   - Should be `/uploads/videos/...` or full URL
4. ✅ **Verify UUIDs** are valid format
5. ✅ **Check chapter/lesson** data structure

## Next Steps

1. **Look at backend console** when you try to create a course
2. **Copy the validation errors** you see
3. **Fix the fields** mentioned in the errors
4. **Try again**

---

**The backend console will show you exactly what's wrong!**

