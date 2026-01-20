# ⚠️ IMPORTANT: Check Backend Console for Validation Errors

## The Problem
You're getting a **400 Bad Request** when creating a course, which means **validation is failing**.

## The Solution
**Check your backend console** (where `npm run dev` is running) - it will show you **exactly which fields are failing validation**.

## What You'll See

When you try to create a course, the backend console will display:

```
=== VALIDATION ERRORS ===
Message: Validation failed
Status Code: 400
Errors: [
  {
    "field": "title",
    "message": "Course title is required when creating a new product"
  },
  {
    "field": "chapters.0.lessons.0.videoUrl",
    "message": "Video URL must be a valid URL or file path starting with /uploads/"
  }
]
Request Method: POST
Request Path: /api/admin/courses
Request Body: {
  "subtitle": "...",
  "description": "...",
  ...
}
========================
```

## Common Issues

### 1. Missing Required Fields
If you're NOT providing `productId`, you MUST provide:
- `title` ✅
- `description` ✅
- `price` ✅ (must be a number >= 0)

### 2. Invalid File Paths
File paths must:
- Start with `/uploads/` (e.g., `/uploads/videos/file.mp4`)
- OR be a full URL (e.g., `https://example.com/video.mp4`)
- OR be empty/null

### 3. Invalid Data Types
- `price` must be a **number**, not a string
- `order` (for chapters/lessons) must be a **number** >= 0
- `durationMinutes` must be a **number** or null

### 4. Chapter/Lesson Structure
Each chapter must have:
- `title` (string, required)
- `order` (number, required)
- `lessons` (array, optional)

Each lesson must have:
- `title` (string, required)
- `order` (number, required)
- `type` (optional, defaults to 'VIDEO')

## Action Required

1. **Open your backend terminal** (where `npm run dev` is running)
2. **Try to create a course** from the frontend
3. **Look at the backend console** - you'll see the validation errors
4. **Fix the fields** mentioned in the errors
5. **Try again**

---

**The backend console has all the answers! Check it now!** 🔍

