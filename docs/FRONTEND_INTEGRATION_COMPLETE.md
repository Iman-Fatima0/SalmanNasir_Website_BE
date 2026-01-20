# 🚀 Complete Frontend Integration Guide

## 📍 Base Configuration

### Backend URL
```
Development: http://localhost:3000
API Base: http://localhost:3000/api
```

### Response Format
All responses follow this structure:
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* response data */ }
}
```

### Error Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ /* validation errors (optional) */ ]
}
```

### Authentication Header
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## 🔐 Authentication Endpoints

### 1. Signup
```http
POST /api/auth/signup
```
**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"  // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "status": "ACTIVE"
    },
    "token": "jwt-token-here"
  }
}
```

### 2. Login
```http
POST /api/auth/login
```
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as signup

### 3. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "status": "ACTIVE"
  }
}
```

### 4. Forgot Password
```http
POST /api/auth/forgot-password
```
**Request:**
```json
{
  "email": "user@example.com"
}
```

### 5. Reset Password
```http
POST /api/auth/reset-password
```
**Request:**
```json
{
  "token": "reset-token-from-email",
  "password": "newPassword123"
}
```

### 6. OAuth Login
```http
GET /api/auth/google
GET /api/auth/facebook
GET /api/auth/linkedin
GET /api/auth/apple
```
**Note:** These redirect to OAuth provider, then callback returns token in URL params

---

## 📚 Course Endpoints

### 1. Get All Courses
```http
GET /api/courses?page=1&limit=12&level=beginner&language=ar&isPublished=true&search=arabic
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `level` (string: beginner, intermediate, advanced)
- `language` (string: ar, en, etc.)
- `isPublished` (boolean: true/false)
- `search` (string: search in title/subtitle)

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "uuid",
        "productId": "uuid",
        "totalChapters": 5,
        "totalLessons": 30,
        "language": "ar",
        "level": "beginner",
        "thumbnailUrl": "https://...",
        "durationMinutes": 300,
        "product": {
          "id": "uuid",
          "title": "Arabic A1",
          "subtitle": "Beginner Course",
          "description": "Complete course...",
          "price": 99.99,
          "currency": "USD",
          "isPublished": true
        },
        "instructors": [
          {
            "id": "uuid",
            "firstName": "Ahmed",
            "lastName": "Ali",
            "avatarUrl": "https://...",
            "CourseInstructor": {
              "role": "primary"
            }
          }
        ]
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 12,
      "totalPages": 5
    }
  }
}
```

### 2. Get Course by ID
```http
GET /api/courses/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "productId": "uuid",
    "totalChapters": 5,
    "totalLessons": 30,
    "language": "ar",
    "level": "beginner",
    "thumbnailUrl": "https://...",
    "durationMinutes": 300,
    "product": {
      "id": "uuid",
      "title": "Arabic A1",
      "subtitle": "Beginner Course",
      "description": "Complete course...",
      "price": 99.99,
      "currency": "USD",
      "isPublished": true
    },
    "chapters": [
      {
        "id": "uuid",
        "title": "Introduction",
        "description": "Course intro",
        "order": 1,
        "lessons": [
          {
            "id": "uuid",
            "title": "Welcome",
            "description": "Overview",
            "order": 1,
            "type": "VIDEO",
            "videoUrl": "https://...",
            "contentUrl": null,
            "textContent": null,
            "durationMinutes": 10,
            "isPreview": true
          }
        ]
      }
    ],
    "instructors": [
      {
        "id": "uuid",
        "firstName": "Ahmed",
        "lastName": "Ali",
        "bio": "Expert in Arabic...",
        "avatarUrl": "https://...",
        "CourseInstructor": {
          "role": "primary"
        }
      }
    ]
  }
}
```

### 3. Create Course (Admin/Instructor)
```http
POST /api/courses
Authorization: Bearer <token>
```

**Request:**
```json
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
          "type": "VIDEO",
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

**Lesson Types:** `VIDEO`, `PDF`, `TEXT`, `QUIZ`

### 4. Update Course
```http
PUT /api/courses/:id
Authorization: Bearer <token>
```

### 5. Delete Course
```http
DELETE /api/courses/:id
Authorization: Bearer <token>
```

---

## 👨‍🏫 Instructor Endpoints

### 1. Get All Instructors (Public)
```http
GET /api/instructors?page=1&limit=12&search=ahmed
```

**Response:**
```json
{
  "success": true,
  "data": {
    "instructors": [
      {
        "id": "uuid",
        "firstName": "Ahmed",
        "lastName": "Ali",
        "bio": "Expert in Arabic language...",
        "avatarUrl": "https://...",
        "title": "Senior Instructor",
        "linkedinUrl": "https://...",
        "twitterUrl": "https://...",
        "websiteUrl": "https://...",
        "isActive": true
      }
    ],
    "pagination": {
      "total": 20,
      "page": 1,
      "limit": 12,
      "totalPages": 2
    }
  }
}
```

### 2. Get Instructor by ID
```http
GET /api/instructors/:id?includeCourses=true
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Ahmed",
    "lastName": "Ali",
    "bio": "Expert in Arabic...",
    "avatarUrl": "https://...",
    "courses": [ /* if includeCourses=true */ ]
  }
}
```

### 3. Create Instructor (Admin)
```http
POST /api/instructors
Authorization: Bearer <token>
```

**Request:**
```json
{
  "firstName": "Ahmed",
  "lastName": "Ali",
  "bio": "Expert in Arabic language...",
  "avatarUrl": "https://...",
  "title": "Senior Instructor",
  "linkedinUrl": "https://...",
  "twitterUrl": "https://...",
  "websiteUrl": "https://..."
}
```

---

## 👤 Student Endpoints

### 1. Get My Enrollments
```http
GET /api/student/enrollments
Authorization: Bearer <token>
```

### 2. Get Enrollment Details
```http
GET /api/student/enrollments/:id
Authorization: Bearer <token>
```

### 3. Get My Progress
```http
GET /api/student/progress/:enrollmentId
Authorization: Bearer <token>
```

### 4. Get My Certificates
```http
GET /api/student/certificates
Authorization: Bearer <token>
```

---

## 🛠️ Admin Endpoints

### 1. Dashboard Stats
```http
GET /api/admin/dashboard/stats
Authorization: Bearer <token> (Admin only)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "kpis": {
      "totalRevenue": 50000.00,
      "activeStudents": 150,
      "totalEnrollments": 300,
      "refundRate": 2.5
    },
    "trends": {
      "revenue": { "value": 5000.00, "percentage": 10.5, "direction": "up" },
      "students": { "value": 15, "percentage": 11.1, "direction": "up" },
      "enrollments": { "value": 30, "percentage": 12.0, "direction": "up" },
      "refundRate": { "value": 0.5, "percentage": -16.7, "direction": "down" }
    },
    "revenueChart": [
      { "date": "2024-01", "revenue": 10000 },
      { "date": "2024-02", "revenue": 12000 }
    ],
    "enrollmentsChart": [
      { "date": "2024-01", "enrollments": 50 },
      { "date": "2024-02", "enrollments": 60 }
    ],
    "recentOrders": [ /* ... */ ]
  }
}
```

### 2. Analytics - Revenue
```http
GET /api/admin/analytics/revenue?period=monthly
Authorization: Bearer <token> (Admin only)
```

**Query Parameters:**
- `period`: `daily`, `weekly`, `monthly`, `yearly` (default: `monthly`)
- `startDate`: ISO date string (optional)
- `endDate`: ISO date string (optional)

### 3. Analytics - Courses
```http
GET /api/admin/analytics/courses
Authorization: Bearer <token> (Admin only)
```

### 4. Analytics - Students
```http
GET /api/admin/analytics/students
Authorization: Bearer <token> (Admin only)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "growthTrends": [
      { "month": "2024-01", "newUsers": 50 }
    ],
    "engagement": {
      "highlyEngaged": 100,
      "moderatelyEngaged": 30,
      "lowEngaged": 15,
      "inactive": 5
    },
    "engagementData": [
      { "label": "Highly Engaged", "value": 100, "type": "highlyEngaged" },
      { "label": "Moderately Engaged", "value": 30, "type": "moderatelyEngaged" },
      { "label": "Low Engaged", "value": 15, "type": "lowEngaged" },
      { "label": "Inactive", "value": 5, "type": "inactive" }
    ],
    "activityByDay": [
      { "day": "Monday", "dayOfWeek": 1, "activeUsers": 20, "activities": 150 }
    ]
  }
}
```

### 5. Analytics - Funnels
```http
GET /api/admin/analytics/funnels
Authorization: Bearer <token> (Admin only)
```

### 6. Manage Courses (Admin)
```http
GET /api/admin/courses?page=1&limit=100
POST /api/admin/courses
GET /api/admin/courses/:id
PUT /api/admin/courses/:id
DELETE /api/admin/courses/:id
Authorization: Bearer <token> (Admin only)
```

### 7. Manage Instructors (Admin)
```http
GET /api/admin/instructors?page=1&limit=100
POST /api/admin/instructors
GET /api/admin/instructors/:id
PUT /api/admin/instructors/:id
DELETE /api/admin/instructors/:id
Authorization: Bearer <token> (Admin only)
```

### 8. Manage Users (Admin)
```http
GET /api/admin/users?page=1&limit=100
GET /api/admin/users/:id
PUT /api/admin/users/:id
DELETE /api/admin/users/:id
Authorization: Bearer <token> (Admin only)
```

### 9. Manage Orders (Admin)
```http
GET /api/admin/orders?page=1&limit=100
GET /api/admin/orders/:id
PUT /api/admin/orders/:id
Authorization: Bearer <token> (Admin only)
```

---

## 📝 Frontend Integration Examples

### React/JavaScript Example

```javascript
// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await response.json();
  
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Request failed');
  }
  
  return data.data;
}

// Example: Get all courses
async function getCourses(filters = {}) {
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 12,
    ...(filters.level && { level: filters.level }),
    ...(filters.language && { language: filters.language }),
    ...(filters.isPublished !== undefined && { isPublished: filters.isPublished }),
    ...(filters.search && { search: filters.search }),
  });
  
  return await apiCall(`/courses?${params}`);
}

// Example: Get course by ID
async function getCourseById(id) {
  return await apiCall(`/courses/${id}`);
}

// Example: Login
async function login(email, password) {
  const data = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  // Store token
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
}

// Example: Get current user
async function getCurrentUser() {
  return await apiCall('/auth/me');
}

// Example: Get admin dashboard stats
async function getAdminStats() {
  return await apiCall('/admin/dashboard/stats');
}

// Example: Get student analytics
async function getStudentAnalytics() {
  return await apiCall('/admin/analytics/students');
}
```

### Axios Example

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => {
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },
  (error) => {
    throw error;
  }
);

// Usage
const courses = await api.get('/courses', { params: { page: 1, limit: 12 } });
const course = await api.get(`/courses/${courseId}`);
const stats = await api.get('/admin/dashboard/stats');
```

---

## ⚠️ Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Example
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## 🔑 Test Credentials

### Admin User
```
Email: admin@elcanadi.com
Password: Admin123!
```

### Regular User
```
Email: user@example.com
Password: Password123!
```

---

## 📦 Course Data Structure

### Complete Course Object
```typescript
interface Course {
  id: string;
  productId: string;
  totalChapters: number;
  totalLessons: number;
  language: string;
  level: string;
  thumbnailUrl: string;
  durationMinutes: number;
  product: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    price: number;
    currency: string;
    isPublished: boolean;
  };
  chapters: Array<{
    id: string;
    title: string;
    description: string;
    order: number;
    lessons: Array<{
      id: string;
      title: string;
      description: string;
      order: number;
      type: 'VIDEO' | 'PDF' | 'TEXT' | 'QUIZ';
      videoUrl: string | null;
      contentUrl: string | null;
      textContent: string | null;
      durationMinutes: number;
      isPreview: boolean;
    }>;
  }>;
  instructors: Array<{
    id: string;
    firstName: string;
    lastName: string;
    bio: string;
    avatarUrl: string;
    CourseInstructor: {
      role: string;
    };
  }>;
}
```

---

## 🚀 Quick Start Checklist

- [ ] Set API base URL: `http://localhost:3000/api`
- [ ] Implement authentication (login/signup)
- [ ] Store JWT token in localStorage/sessionStorage
- [ ] Add Authorization header to all authenticated requests
- [ ] Implement course listing page
- [ ] Implement course detail page
- [ ] Implement instructor pages
- [ ] Implement admin dashboard (if admin user)
- [ ] Handle error responses
- [ ] Implement loading states

---

## 📞 Support

For questions or issues, refer to:
- `docs/COMPLETE_API_DOCUMENTATION.md` - Detailed API docs
- `docs/FRONTEND_GUIDE.md` - Frontend flow guide
- `docs/ADMIN_DASHBOARD_COMPLETE_FRONTEND_GUIDE.md` - Admin dashboard guide

