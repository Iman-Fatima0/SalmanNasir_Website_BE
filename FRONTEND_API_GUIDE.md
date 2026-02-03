# Frontend API Integration Guide

## Authentication
All endpoints (except signup/login) require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Update User Profile

**Endpoint:** `PUT /api/auth/me`

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",        // Optional
  "lastName": "Doe",          // Optional
  "phone": "+201234567890",   // Optional, 11-15 digits (non-digits stripped)
  "profileImage": "url"       // Optional
}
```

**Validation Rules:**
- At least ONE field must be provided
- Phone number: 11-15 digits (can include formatting like +20, spaces, dashes - will be stripped)
- Phone format examples: `+201234567890`, `01234567890`, `+20 123 456 7890` (all valid)

**Success Response (200):**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "201234567890",  // Normalized (digits only)
  "profileImage": "url",
  "role": "student"
}
```

**Error Responses:**
- `400`: Validation error (phone invalid, no fields provided)
- `401`: Unauthorized (invalid/missing token)
- `404`: User not found

---

## 2. Get All Enrolled Courses

**Endpoint:** `GET /api/student/courses`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "courses": [
    {
      "id": "course-id",
      "productId": "product-id",
      "language": "ar",
      "level": "beginner",
      "thumbnailUrl": "url",
      "durationMinutes": 120,
      "totalChapters": 5,
      "totalLessons": 20,
      "product": {
        "id": "product-id",
        "title": "Arabic Course",
        "subtitle": "Learn Arabic",
        "description": "...",
        "price": 99.99,
        "currency": "USD",
        "isPublished": true
      },
      "chapters": [
        {
          "id": "chapter-id",
          "title": "Chapter 1",
          "description": "...",
          "order": 1,
          "lessons": [
            {
              "id": "lesson-id",
              "title": "Lesson 1",
              "order": 1,
              "durationMinutes": 10,
              "isPreview": false
            }
          ]
        }
      ],
      "enrollment": {
        "id": "enrollment-id",
        "status": "active",
        "enrolledAt": "2024-01-01T00:00:00.000Z",
        "lastAccessedAt": "2024-01-02T00:00:00.000Z",
        "completionPercentage": 25
      },
      "progress": {
        "totalLessons": 20,
        "completedLessons": 5,
        "completionPercentage": 25,
        "quizAttempts": 3,
        "passedQuizzes": 2
      }
    }
  ],
  "total": 1
}
```

**Empty Response (200):**
```json
{
  "courses": [],
  "total": 0
}
```

**Error Responses:**
- `401`: Unauthorized
- `500`: Server error (check backend logs)

---

## 3. Get Single Enrolled Course Details

**Endpoint:** `GET /api/student/courses/:id`

**Request Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Course ID (UUID)

**Success Response (200):**
```json
{
  "id": "course-id",
  "productId": "product-id",
  "language": "ar",
  "level": "beginner",
  "thumbnailUrl": "url",
  "durationMinutes": 120,
  "totalChapters": 5,
  "totalLessons": 20,
  "product": {
    "id": "product-id",
    "title": "Arabic Course",
    "subtitle": "Learn Arabic",
    "description": "...",
    "price": 99.99,
    "currency": "USD",
    "isPublished": true
  },
  "chapters": [
    {
      "id": "chapter-id",
      "title": "Chapter 1",
      "description": "...",
      "order": 1,
      "lessons": [
        {
          "id": "lesson-id",
          "title": "Lesson 1",
          "description": "...",
          "order": 1,
          "durationMinutes": 10,
          "isPreview": false,
          "type": "VIDEO",
          "videoUrl": "url",
          "audioUrl": null,
          "contentUrl": null,
          "textContent": null
        }
      ]
    }
  ],
  "enrollment": {
    "id": "enrollment-id",
    "status": "active",
    "enrolledAt": "2024-01-01T00:00:00.000Z",
    "lastAccessedAt": "2024-01-02T00:00:00.000Z",
    "completionPercentage": 25
  },
  "progress": {
    "totalLessons": 20,
    "completedLessons": 5,
    "completionPercentage": 25,
    "quizAttempts": 3,
    "passedQuizzes": 2
  }
}
```

**Displaying lesson content:** Each lesson has `type` (`VIDEO`, `AUDIO`, `PDF`, `TEXT`, `QUIZ`) and the matching content field (`videoUrl`, `audioUrl`, `contentUrl`, `textContent`). See **LESSON_CONTENT_DISPLAY.md** for how to render each type on the learn page.

**Error Responses:**
- `401`: Unauthorized
- `404`: Course not found or user not enrolled
- `500`: Server error

---

## 4. Get All Orders (Purchase History)

**Endpoint:** `GET /api/student/orders`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "id": "order-id",
    "userId": "user-id",
    "productId": "product-id",
    "courseId": "course-id",
    "amount": 99.99,
    "currency": "USD",
    "status": "approved",  // "pending" or "approved"
    "paymentMethod": "credit_card",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "product": {
      "id": "product-id",
      "title": "Arabic Course",
      "subtitle": "Learn Arabic",
      "description": "...",
      "price": 99.99,
      "currency": "USD",
      "isPublished": true
    },
    "course": {
      "id": "course-id",
      "language": "ar",
      "level": "beginner",
      "thumbnailUrl": "url",
      "durationMinutes": 120,
      "totalChapters": 5,
      "totalLessons": 20
    },
    "enrollment": {
      "id": "enrollment-id",
      "status": "active",
      "completionPercentage": 25
    }  // null if order is still pending
  }
]
```

**Empty Response (200):**
```json
[]
```

**Error Responses:**
- `401`: Unauthorized
- `500`: Server error (check backend logs)

**Notes:**
- Orders are sorted by `createdAt` DESC (newest first)
- `enrollment` will be `null` for pending orders
- `course` may be `null` if course was deleted (use `product` info as fallback)

---

## 5. Get All Enrollments

**Endpoint:** `GET /api/student/enrollments`

**Request Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "id": "enrollment-id",
    "userId": "user-id",
    "courseId": "course-id",
    "orderId": "order-id",
    "status": "active",
    "completionPercentage": 25,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastAccessedAt": "2024-01-02T00:00:00.000Z",
    "course": {
      "id": "course-id",
      "productId": "product-id",
      "language": "ar",
      "level": "beginner",
      "thumbnailUrl": "url",
      "durationMinutes": 120,
      "totalChapters": 5,
      "totalLessons": 20,
      "product": {
        "id": "product-id",
        "title": "Arabic Course",
        "subtitle": "Learn Arabic",
        "description": "...",
        "price": 99.99,
        "currency": "USD",
        "isPublished": true
      }
    }
  }
]
```

**Empty Response (200):**
```json
[]
```

**Error Responses:**
- `401`: Unauthorized
- `500`: Server error

---

## Error Handling Best Practices

### 1. Always Check Response Status
```javascript
if (response.status === 200) {
  // Success
} else if (response.status === 401) {
  // Redirect to login
} else if (response.status === 404) {
  // Show "not found" message
} else if (response.status === 500) {
  // Show "server error" message
}
```

### 2. Handle Empty Responses
- `/api/student/courses` returns `{ courses: [], total: 0 }` when no courses
- `/api/student/orders` returns `[]` when no orders
- `/api/student/enrollments` returns `[]` when no enrollments

### 3. Phone Number Validation (Frontend)
Before sending to backend, validate:
- Minimum 11 digits (after stripping non-digits)
- Maximum 15 digits (after stripping non-digits)
- Can accept formatted input: `+20 123 456 7890`, `01234567890`, etc.
- Backend will normalize to digits only

**Example Frontend Validation:**
```javascript
const validatePhone = (phone) => {
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 11 && digitsOnly.length <= 15;
};
```

### 4. Display User Phone Number
The user object from `/api/auth/me` includes `phone` field (normalized, digits only).
Display it with formatting if needed:
```javascript
const formatPhone = (phone) => {
  if (!phone) return '';
  // Format as needed, e.g., +20 123 456 7890
  return phone.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
};
```

---

## Example Frontend Code

### Update Profile
```javascript
const updateProfile = async (data) => {
  const response = await axios.put('/api/auth/me', data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};
```

### Get Courses
```javascript
const getCourses = async () => {
  const response = await axios.get('/api/student/courses', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.courses;
};
```

### Get Single Course
```javascript
const getCourse = async (courseId) => {
  const response = await axios.get(`/api/student/courses/${courseId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
```

### Get Orders
```javascript
const getOrders = async () => {
  const response = await axios.get('/api/student/orders', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
```

---

## Testing Checklist

- [ ] Profile update with phone number (11-15 digits)
- [ ] Profile update without phone number
- [ ] Get courses when user has enrollments
- [ ] Get courses when user has no enrollments
- [ ] Get single course details
- [ ] Get orders (pending and approved)
- [ ] Get orders when user has no orders
- [ ] Error handling for 401 (unauthorized)
- [ ] Error handling for 404 (not found)
- [ ] Error handling for 500 (server error)
- [ ] Phone number display in user profile
