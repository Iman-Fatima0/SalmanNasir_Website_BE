# API Endpoints Quick Reference

## Base URL
```
http://localhost:3000/api
```

---

## 🔐 Authentication (`/api/auth`)

### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"  // optional
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "password": "newPassword123"
}
```

### OAuth Login (Redirect URLs)
```
GET /api/auth/google
GET /api/auth/facebook
GET /api/auth/linkedin
GET /api/auth/apple
```

---

## 📚 Courses (`/api/courses`)

### Create Course
```http
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "uuid",  // optional - link to existing product
  "title": "Arabic A1",
  "subtitle": "Beginner Course",
  "description": "Complete course description...",
  "price": 99.99,
  "currency": "USD",
  "language": "ar",
  "level": "beginner",
  "thumbnailUrl": "https://...",
  "chapters": [
    {
      "title": "Introduction",
      "description": "Course intro",
      "order": 1,
      "lessons": [
        {
          "title": "Welcome",
          "description": "Overview",
          "order": 1,
          "videoUrl": "https://...",
          "durationMinutes": 10,
          "isPreview": true
        }
      ]
    }
  ],
  "instructorIds": ["instructor-uuid-1", "instructor-uuid-2"]
}
```

### Get All Courses
```http
GET /api/courses?page=1&limit=10&level=beginner&language=ar&isPublished=true&search=arabic
```

### Get Course by ID
```http
GET /api/courses/:id
```

### Update Course
```http
PUT /api/courses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 149.99,
  "isPublished": true
}
```

### Delete Course
```http
DELETE /api/courses/:id
Authorization: Bearer <token>
```

---

## 👨‍🏫 Instructors (`/api/instructors`)

### Create Instructor
```http
POST /api/instructors
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Ali",
  "lastName": "Ahmed",
  "bio": "Native Arabic speaker...",
  "avatarUrl": "https://...",
  "title": "Senior Instructor",
  "linkedinUrl": "https://linkedin.com/...",
  "twitterUrl": "https://twitter.com/...",
  "websiteUrl": "https://..."
}
```

### Get All Instructors
```http
GET /api/instructors?page=1&limit=10&search=ali&isActive=true
```

### Get Instructor by ID
```http
GET /api/instructors/:id
GET /api/instructors/:id?includeCourses=true
```

### Update Instructor
```http
PUT /api/instructors/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Updated Name",
  "bio": "Updated bio..."
}
```

### Delete Instructor
```http
DELETE /api/instructors/:id
Authorization: Bearer <token>
```

---

## Response Examples

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## Query Parameters

### Courses List
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in title/subtitle
- `level` - Filter by level (beginner, intermediate, advanced)
- `language` - Filter by language
- `isPublished` - Filter by published status (true/false)

### Instructors List
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in name/title
- `isActive` - Filter by active status (true/false)

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized (Invalid/missing token)
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

