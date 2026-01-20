# Course Creation 400 Error - Fix Guide

## Issue
Getting `400 Bad Request` when creating a course via `POST /api/admin/courses`.

## Root Cause
The validation schema was requiring full URLs (with `http://` or `https://`) for:
- `videoUrl`
- `audioUrl`
- `contentUrl`
- `thumbnailUrl`

But file uploads return paths like `/uploads/videos/file.mp4` which are not full URLs.

## ✅ Fix Applied

Updated the validation schema in `src/validators/courseSchemas.js` to accept:
1. **Full URLs** (e.g., `https://example.com/video.mp4`)
2. **File paths** starting with `/uploads/` (e.g., `/uploads/videos/file.mp4`)
3. **Empty strings or null** (optional fields)

### Changes Made

1. **Lesson Schema** - Updated `videoUrl`, `audioUrl`, `contentUrl`:
   ```javascript
   videoUrl: Joi.alternatives()
     .try(
       Joi.string().uri(),
       Joi.string().pattern(/^\/uploads\//),
       Joi.string().allow(null, '')
     )
     .optional()
     .allow(null, '')
   ```

2. **Course Schema** - Updated `thumbnailUrl` in both `createCourseSchema` and `updateCourseSchema`:
   ```javascript
   thumbnailUrl: Joi.alternatives()
     .try(
       Joi.string().uri(),
       Joi.string().pattern(/^\/uploads\//),
       Joi.string().allow(null, '')
     )
     .optional()
     .allow(null, '')
   ```

## Testing

After the fix, course creation should work with:
- File paths: `/uploads/videos/lesson-123.mp4`
- Full URLs: `https://cdn.example.com/video.mp4`
- Empty/null values: `null` or `""`

## Next Steps

1. **Restart backend server** (if needed):
   ```bash
   npm run dev
   ```

2. **Try creating a course again** with file paths from uploads

3. **Check backend console** for any validation errors

## Common Validation Errors

If you still get 400 errors, check:

1. **Required fields missing:**
   - `title` (if no `productId`)
   - `description` (if no `productId`)
   - `price` (if no `productId`)

2. **Invalid UUIDs:**
   - `productId` must be valid UUID
   - `instructorIds` array must contain valid UUIDs

3. **Chapter/Lesson validation:**
   - Chapter `title` is required
   - Chapter `order` is required (integer >= 0)
   - Lesson `title` is required
   - Lesson `order` is required (integer >= 0)

## Debugging

To see exact validation errors, check the backend console. The validation middleware logs:
- Request body keys
- Validation errors with field names and messages

Look for logs like:
```
Validation middleware called
Validation failed
```

These will show exactly which fields are failing validation.

