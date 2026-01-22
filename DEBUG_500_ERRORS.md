# Debugging 500 Errors on Student Endpoints

## Current Issue
Getting 500 errors on:
- `GET /api/student/courses`
- `GET /api/student/enrollments`

## Steps to Debug

### 1. Check Backend Console Logs
The backend should now be logging detailed error information. Look for:
- Error name
- Error message
- Stack trace
- Request details

### 2. Common Causes

#### A. Database Connection Issue
**Symptoms:**
- Error mentions "connection", "ECONNREFUSED", or "timeout"
- Database not running

**Solution:**
```bash
# Check if PostgreSQL is running
# Windows: Check Services → PostgreSQL
# Or test connection:
npm run test-db
```

#### B. Missing Database Tables
**Symptoms:**
- Error mentions "relation does not exist" or "table does not exist"

**Solution:**
```bash
# Run migrations if you have them
npm run migrate

# Or check if tables exist in database
```

#### C. Missing Model Associations
**Symptoms:**
- Error mentions "is not associated" or "association"

**Solution:**
- Check that all models are properly loaded
- Verify associations in `src/models/associations.js`

#### D. Authentication Issue
**Symptoms:**
- Error in authentication middleware
- Token validation failing

**Solution:**
- Check that JWT token is valid
- Verify `req.user` is set correctly

### 3. Quick Test

Test the endpoint directly with curl or Postman:

```bash
# Replace YOUR_TOKEN with actual JWT token
curl -X GET http://localhost:3000/api/student/courses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### 4. Check Server Logs

The improved error handler should show:
```
=== ERROR ===
Name: [Error Name]
Message: [Error Message]
Stack: [Stack Trace]
Request Method: GET
Request Path: /api/student/courses
================
```

### 5. Verify Code Changes

Make sure you've:
1. ✅ Restarted the backend server after code changes
2. ✅ All files are saved
3. ✅ No syntax errors (check with `node -c src/services/studentService.js`)

### 6. Test Database Query Directly

If you have database access, test the query:

```sql
-- Check if enrollments table exists
SELECT * FROM enrollments LIMIT 1;

-- Check if courses table exists  
SELECT * FROM courses LIMIT 1;

-- Check if products table exists
SELECT * FROM products LIMIT 1;
```

## Next Steps

1. **Check backend console** - Look for the detailed error message
2. **Share the error** - Copy the error from backend console
3. **Check database** - Verify tables exist and are accessible
4. **Verify authentication** - Make sure the JWT token is valid

## Temporary Workaround

If you need a quick fix, you can return empty results:

```javascript
// In studentService.js getCourses method
// Add at the very beginning:
if (!userId) {
  return { courses: [], total: 0 };
}
```

But this is just a workaround - we need to find the root cause from the backend logs.
