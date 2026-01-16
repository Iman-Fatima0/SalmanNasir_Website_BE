# Courses and Instructors API Documentation

## Base URLs
- Courses: `/api/courses`
- Instructors: `/api/instructors`

---

## Course Endpoints

### 1. Create Course
**POST** `/api/courses`

Create a new course with chapters, lessons, and instructors.

**Request Body:**
```json
{
  "title": "Arabic A1 - Beginner Course",
  "subtitle": "Learn Arabic from scratch",
  "description": "Complete Arabic course for beginners...",
  "price": 99.99,
  "currency": "USD",
  "language": "ar",
  "level": "beginner",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "chapters": [
    {
      "title": "Introduction",
      "description": "Course introduction",
      "order": 1,
      "lessons": [
        {
          "title": "Welcome to Arabic",
          "description": "Overview of the course",
          "order": 1,
          "videoUrl": "https://example.com/video1.mp4",
          "durationMinutes": 10,
          "isPreview": true
        },
        {
          "title": "Arabic Alphabet",
          "description": "Learn the Arabic alphabet",
          "order": 2,
          "videoUrl": "https://example.com/video2.mp4",
          "durationMinutes": 15,
          "isPreview": false
        }
      ]
    },
    {
      "title": "Basic Grammar",
      "description": "Introduction to Arabic grammar",
      "order": 2,
      "lessons": [
        {
          "title": "Nouns and Verbs",
          "order": 1,
          "videoUrl": "https://example.com/video3.mp4",
          "durationMinutes": 20,
          "isPreview": false
        }
      ]
    }
  ],
  "instructorIds": ["instructor-uuid-1", "instructor-uuid-2"],
  "instructorRole": "primary"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": "course-uuid",
    "productId": "product-uuid",
    "totalChapters": 2,
    "totalLessons": 3,
    "language": "ar",
    "level": "beginner",
    "product": {
      "id": "product-uuid",
      "title": "Arabic A1 - Beginner Course",
      "subtitle": "Learn Arabic from scratch",
      "description": "Complete Arabic course...",
      "price": "99.99",
      "currency": "USD"
    },
    "chapters": [...],
    "instructors": [...]
  }
}
```

---

### 2. Get All Courses
**GET** `/api/courses`

Get paginated list of courses with optional filters.

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page
- `search` (optional) - Search in title/subtitle
- `level` (optional) - Filter by level (beginner, intermediate, advanced)
- `language` (optional) - Filter by language
- `isPublished` (optional, boolean) - Filter by published status

**Example:**
```
GET /api/courses?page=1&limit=10&level=beginner&isPublished=true
```

**Response:**
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": {
    "courses": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

### 3. Get Course by ID
**GET** `/api/courses/:id`

Get a single course with all details including chapters, lessons, and instructors.

**Response:**
```json
{
  "success": true,
  "message": "Course retrieved successfully",
  "data": {
    "id": "course-uuid",
    "product": {...},
    "chapters": [
      {
        "id": "chapter-uuid",
        "title": "Introduction",
        "order": 1,
        "lessons": [
          {
            "id": "lesson-uuid",
            "title": "Welcome to Arabic",
            "order": 1,
            "videoUrl": "...",
            "durationMinutes": 10,
            "isPreview": true
          }
        ]
      }
    ],
    "instructors": [...]
  }
}
```

---

### 4. Update Course
**PUT** `/api/courses/:id`

Update course details. Can update product info, course meta, chapters/lessons, and instructors.

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Course Title",
  "price": 149.99,
  "isPublished": true,
  "chapters": [...],  // Full replacement of chapters
  "instructorIds": ["new-instructor-uuid"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {...}
}
```

---

### 5. Delete Course
**DELETE** `/api/courses/:id`

Soft delete a course (archives it).

**Response:**
```json
{
  "success": true,
  "message": "Course deleted successfully",
  "data": null
}
```

---

## Instructor Endpoints

### 1. Create Instructor
**POST** `/api/instructors`

Create a new instructor.

**Request Body:**
```json
{
  "firstName": "Ali",
  "lastName": "Ahmed",
  "bio": "Native Arabic speaker with 10 years of teaching experience...",
  "avatarUrl": "https://example.com/avatar.jpg",
  "title": "Senior Arabic Instructor",
  "linkedinUrl": "https://linkedin.com/in/ali-ahmed",
  "twitterUrl": "https://twitter.com/ali_ahmed",
  "websiteUrl": "https://ali-ahmed.com",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Instructor created successfully",
  "data": {
    "id": "instructor-uuid",
    "firstName": "Ali",
    "lastName": "Ahmed",
    "bio": "...",
    "title": "Senior Arabic Instructor",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. Get All Instructors
**GET** `/api/instructors`

Get paginated list of instructors.

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)
- `search` (optional) - Search in name or title
- `isActive` (optional, boolean) - Filter by active status

**Example:**
```
GET /api/instructors?page=1&limit=10&isActive=true
```

**Response:**
```json
{
  "success": true,
  "message": "Instructors retrieved successfully",
  "data": {
    "instructors": [...],
    "pagination": {
      "total": 20,
      "page": 1,
      "limit": 10,
      "totalPages": 2
    }
  }
}
```

---

### 3. Get Instructor by ID
**GET** `/api/instructors/:id`

Get a single instructor.

**Query Parameters:**
- `includeCourses` (optional, boolean) - Include courses taught by instructor

**Example:**
```
GET /api/instructors/:id?includeCourses=true
```

**Response:**
```json
{
  "success": true,
  "message": "Instructor retrieved successfully",
  "data": {
    "id": "instructor-uuid",
    "firstName": "Ali",
    "lastName": "Ahmed",
    "bio": "...",
    "courses": [...]  // if includeCourses=true
  }
}
```

---

### 4. Update Instructor
**PUT** `/api/instructors/:id`

Update instructor details.

**Request Body:** (all fields optional)
```json
{
  "firstName": "Updated Name",
  "bio": "Updated bio...",
  "isActive": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Instructor updated successfully",
  "data": {...}
}
```

---

### 5. Delete Instructor
**DELETE** `/api/instructors/:id`

Soft delete an instructor (sets isActive to false).

**Response:**
```json
{
  "success": true,
  "message": "Instructor deleted successfully",
  "data": null
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []  // Optional, for validation errors
}
```

**Status Codes:**
- `400` - Bad Request (Validation errors)
- `404` - Not Found
- `500` - Internal Server Error

