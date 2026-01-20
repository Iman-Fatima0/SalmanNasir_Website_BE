# Course Creation 400 Error - Debug Guide

## Error Observed
```
:3001/api/admin/courses:1  Failed to load resource: the server responded with a status of 400 (Bad Request)
```

## Possible Causes

### 1. Missing Required Fields
When creating a course **without** providing `productId`, the following fields are **required**:
- `title` (string) - Course title
- `description` (string) - Course description  
- `price` (number, min 0) - Course price

### 2. Invalid Data Format
- `price` must be a number (not string)
- `productId` must be a valid UUID if provided
- `instructorIds` must be an array of UUIDs
- `chapters` must be an array with valid structure

### 3. Query Parameter Issues (for GET requests)
If the error occurs on a GET request to list courses, check:
- `page` must be an integer >= 1
- `limit` must be an integer between 1 and 100

## Request Format for Creating Course

### POST /api/admin/courses
**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Body (Option 1 - Create new product):**
```json
{
  "title": "Advanced Arabic Grammar",
  "description": "Learn advanced Arabic grammar concepts",
  "price": 199.99,
  "currency": "USD",
  "language": "Arabic",
  "level": "advanced",
  "subtitle": "Master complex grammar rules",
  "thumbnailUrl": "https://example.com/image.jpg",
  "chapters": [
    {
      "title": "Chapter 1",
      "description": "Introduction",
      "order": 1,
      "lessons": [
        {
          "title": "Lesson 1.1",
          "description": "Basic concepts",
          "order": 1,
          "videoUrl": "https://example.com/video.mp4",
          "durationMinutes": 30
        }
      ]
    }
  ],
  "instructorIds": ["instructor-uuid-1", "instructor-uuid-2"]
}
```

**Body (Option 2 - Link to existing product):**
```json
{
  "productId": "existing-product-uuid",
  "language": "Arabic",
  "level": "advanced",
  "chapters": [...]
}
```

## How to Debug

1. **Check the actual error response:**
   Open browser DevTools → Network tab → Find the failed request → Click it → Check the Response tab for error details.

2. **Check request payload:**
   In Network tab → Click the request → Check the Payload tab to see what was sent.

3. **Backend logs:**
   Check the backend terminal/console for validation error messages.

## Instrumentation Added

I've added logging to capture:
- Request method and path
- Request body keys
- Validation errors (if any)
- Error details in error handler

The logs will help identify exactly what validation is failing.

## Common Issues

1. **Frontend sending `price` as string:** Convert to number before sending
2. **Missing required fields:** Ensure `title`, `description`, `price` are included when not using `productId`
3. **Invalid UUID format:** Check that `productId` and `instructorIds` are valid UUIDs
4. **Empty chapters array:** Chapters array is optional, but if included, each chapter needs `title` and `order`

## Next Steps

1. Try creating a course again
2. Check browser Network tab for the actual error response
3. Check backend console for validation error logs
4. Share the error response body to get more specific help

