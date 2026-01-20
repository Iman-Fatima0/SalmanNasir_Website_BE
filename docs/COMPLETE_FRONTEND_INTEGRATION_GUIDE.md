# Complete Frontend Integration Guide

## 📋 Overview

This document contains **everything** the frontend team needs to integrate with the backend API.

---

## 🔌 API Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api (configure in .env)
```

---

## 🔐 Authentication

### Base Configuration

**All protected routes require:**
```
Headers: {
  "Authorization": "Bearer <jwt-token>",
  "Content-Type": "application/json"
}
```

### Authentication Endpoints

#### 1. Sign Up
```
POST /api/auth/signup
Body: {
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890" (optional)
}
Response: {
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": { "id": "...", "email": "...", ... },
    "token": "jwt-token-here"
  }
}
```

#### 2. Login
```
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}
Response: {
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "...", "email": "...", ... },
    "token": "jwt-token-here"
  }
}
```

#### 3. OAuth Login (Google, Facebook, LinkedIn, Apple)
```
GET /api/auth/google
GET /api/auth/facebook
GET /api/auth/linkedin
GET /api/auth/apple

Redirects to OAuth provider, then callback
Response: Same as login (user + token)
```

#### 4. Forgot Password
```
POST /api/auth/forgot-password
Body: {
  "email": "user@example.com"
}
Response: {
  "success": true,
  "message": "Password reset email sent"
}
```

#### 5. Reset Password
```
POST /api/auth/reset-password
Body: {
  "token": "reset-token-from-email",
  "password": "newPassword123"
}
Response: {
  "success": true,
  "message": "Password reset successfully"
}
```

#### 6. Get Current User
```
GET /api/auth/me
Headers: { Authorization: "Bearer <token>" }
Response: {
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", ... }
  }
}
```

---

## 📚 Public Course Endpoints

### Get All Courses
```
GET /api/courses?page=1&limit=12&isPublished=true&search=arabic&level=Beginner&language=Arabic

Query Parameters:
- page (number, default: 1)
- limit (number, default: 10, max: 100)
- search (string, optional) - Search in title/subtitle
- level (string, optional) - Filter by level
- language (string, optional) - Filter by language
- isPublished (boolean, optional) - Filter by published status

Response: {
  "success": true,
  "data": {
    "courses": [
      {
        "id": "uuid",
        "productId": "uuid",
        "level": "Beginner",
        "language": "Arabic",
        "thumbnailUrl": "https://...",
        "product": {
          "id": "uuid",
          "title": "Complete Arabic Course",
          "subtitle": "Master Arabic in 30 days",
          "description": "...",
          "price": "299.99",
          "currency": "USD",
          "isPublished": true
        },
        "instructors": [
          {
            "id": "uuid",
            "firstName": "Dr. Ahmed",
            "lastName": "Al-Saud",
            "title": "Professor",
            "avatarUrl": "https://..."
          }
        ],
        "chapters": [ /* array of chapters */ ]
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

### Get Course by ID
```
GET /api/courses/:id

Response: {
  "success": true,
  "data": {
    "course": {
      "id": "uuid",
      "product": { /* product details */ },
      "chapters": [
        {
          "id": "uuid",
          "title": "Chapter 1",
          "order": 1,
          "lessons": [
            {
              "id": "uuid",
              "title": "Lesson 1",
              "type": "VIDEO", // VIDEO, PDF, TEXT, QUIZ
              "videoUrl": "https://...",
              "contentUrl": "https://...", // for PDF type
              "textContent": "...", // for TEXT type
              "durationMinutes": 15,
              "isPreview": true,
              "order": 1,
              "quiz": { /* quiz details if type is QUIZ */ }
            }
          ]
        }
      ],
      "instructors": [ /* instructor array */ ]
    }
  }
}
```

---

## 👨‍🎓 Student Endpoints

**Base Path:** `/api/student`  
**Auth Required:** Yes (any authenticated user)

### Enrollments

#### Get All Enrollments
```
GET /api/student/enrollments

Response: {
  "success": true,
  "data": [
    {
      "id": "uuid",
      "courseId": "uuid",
      "status": "enrolled", // enrolled, completed, dropped
      "completionPercentage": 45.5,
      "enrolledAt": "2024-01-15T10:30:00Z",
      "lastAccessedAt": "2024-01-20T14:20:00Z",
      "course": { /* course details */ },
      "progress": {
        "totalLessons": 50,
        "completedLessons": 23,
        "completionPercentage": 46.0,
        "quizAttempts": 5,
        "passedQuizzes": 4
      }
    }
  ]
}
```

#### Get Enrollment by ID
```
GET /api/student/enrollments/:id

Response: {
  "success": true,
  "data": {
    "enrollment": { /* full enrollment details with course, progress */ }
  }
}
```

#### Create Enrollment (Enroll in Course)
```
POST /api/student/enrollments
Body: {
  "courseId": "uuid",
  "orderId": "uuid" (optional, if from purchase)
}

Response: {
  "success": true,
  "data": { /* enrollment object */ }
}
```

### Progress

#### Get Progress for Enrollment
```
GET /api/student/progress/:enrollmentId

Response: {
  "success": true,
  "data": {
    "totalLessons": 50,
    "completedLessons": 23,
    "completionPercentage": 46.0,
    "quizAttempts": 5,
    "passedQuizzes": 4
  }
}
```

#### Update Lesson Progress
```
PUT /api/student/progress/:enrollmentId/lessons/:lessonId
Body: {
  "isCompleted": true,
  "timeSpentSeconds": 900
}

Response: {
  "success": true,
  "data": {
    "id": "uuid",
    "enrollmentId": "uuid",
    "lessonId": "uuid",
    "isCompleted": true,
    "completedAt": "2024-01-20T14:20:00Z",
    "timeSpentSeconds": 900
  }
}
```

#### Submit Quiz Attempt
```
POST /api/student/progress/:enrollmentId/quizzes/:quizId/attempt
Body: {
  "answers": {
    "question-uuid-1": "answer-uuid-1",
    "question-uuid-2": "answer-uuid-2"
  },
  "startedAt": "2024-01-20T14:00:00Z" (optional)
}

Response: {
  "success": true,
  "data": {
    "id": "uuid",
    "enrollmentId": "uuid",
    "quizId": "uuid",
    "score": 85.5,
    "isPassed": true,
    "attemptNumber": 1,
    "startedAt": "...",
    "completedAt": "...",
    "answers": { /* user answers */ }
  }
}
```

### Certificates

#### Get All Certificates
```
GET /api/student/certificates

Response: {
  "success": true,
  "data": [
    {
      "id": "uuid",
      "enrollmentId": "uuid",
      "courseId": "uuid",
      "issueDate": "2024-01-20T14:20:00Z",
      "verificationCode": "ABC123XYZ",
      "grade": 92.5,
      "course": { /* course details */ },
      "enrollment": { /* enrollment details */ }
    }
  ]
}
```

#### Get Certificate by ID
```
GET /api/student/certificates/:id

Response: {
  "success": true,
  "data": {
    "certificate": { /* full certificate details */ }
  }
}
```

#### Verify Certificate (Public - No Auth Required)
```
GET /api/student/certificates/verify/:code

Response: {
  "success": true,
  "data": {
    "certificate": {
      "id": "uuid",
      "verificationCode": "ABC123XYZ",
      "issueDate": "2024-01-20T14:20:00Z",
      "grade": 92.5,
      "course": { /* course details */ },
      "user": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      }
    }
  }
}
```

---

## 👨‍🏫 Instructor Endpoints

**Base Path:** `/api/instructor`  
**Auth Required:** Yes (Instructor role)

### Analytics

#### Get Analytics Overview
```
GET /api/instructor/analytics/overview

Response: {
  "success": true,
  "data": {
    "totalCourses": 5,
    "totalEnrollments": 120,
    "totalStudents": 95,
    "averageCompletionRate": 65.5,
    "completedEnrollments": 30,
    "totalRevenue": 12500.00
  }
}
```

#### Get Course Analytics
```
GET /api/instructor/analytics/courses/:courseId

Response: {
  "success": true,
  "data": {
    "course": { /* course details */ },
    "statistics": {
      "totalEnrollments": 45,
      "totalLessons": 50,
      "completedEnrollments": 12,
      "averageCompletion": 65.5
    },
    "enrollments": [
      {
        "enrollment": { /* enrollment details */ },
        "progress": {
          "totalLessons": 50,
          "completedLessons": 35,
          "completionPercentage": 70.0
        }
      }
    ]
  }
}
```

### Course Management

#### Get My Courses
```
GET /api/instructor/courses

Response: {
  "success": true,
  "data": [
    { /* course objects */ }
  ]
}
```

#### Get Course by ID
```
GET /api/instructor/courses/:id

Response: {
  "success": true,
  "data": {
    "course": { /* full course details */ }
  }
}
```

#### Update Course
```
PUT /api/instructor/courses/:id
Body: {
  "level": "Intermediate",
  "language": "Arabic"
  // Only allowed fields for instructors
}

Response: {
  "success": true,
  "data": { /* updated course */ }
}
```

### Student Management

#### Get All Students
```
GET /api/instructor/students

Response: {
  "success": true,
  "data": [
    {
      "user": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "enrollments": [
        {
          "id": "uuid",
          "course": { /* course details */ },
          "status": "enrolled",
          "completionPercentage": 45.5
        }
      ]
    }
  ]
}
```

#### Get Course Students
```
GET /api/instructor/courses/:courseId/students

Response: {
  "success": true,
  "data": [
    {
      "enrollment": { /* enrollment details */ },
      "progress": {
        "totalLessons": 50,
        "completedLessons": 23,
        "completionPercentage": 46.0
      }
    }
  ]
}
```

#### Get Student Progress
```
GET /api/instructor/courses/:courseId/students/:studentId

Response: {
  "success": true,
  "data": {
    "enrollment": { /* enrollment details */ },
    "progress": { /* progress details */ },
    "lessonProgresses": [ /* array of lesson progress */ ],
    "quizAttempts": [ /* array of quiz attempts */ ]
  }
}
```

---

## 👑 Admin Endpoints

**Base Path:** `/api/admin`  
**Auth Required:** Yes (Admin role)

### Dashboard Statistics

#### Get Dashboard Stats
```
GET /api/admin/dashboard/stats

Response: {
  "success": true,
  "data": {
    "totalRevenue": 125000,
    "totalUsers": 450,
    "totalOrders": 320,
    "refundRate": 2.3,
    "revenueTrend": {
      "direction": "up",
      "value": "12%",
      "previousPeriodValue": 111607.14
    },
    "usersTrend": {
      "direction": "up",
      "value": "5%",
      "previousPeriodValue": 428
    },
    "ordersTrend": {
      "direction": "up",
      "value": "8%",
      "previousPeriodValue": 296
    },
    "refundRateTrend": {
      "direction": "down",
      "value": "0.5%",
      "previousPeriodValue": 2.8
    },
    "revenueData": [
      {
        "date": "Jan",
        "revenue": 45000,
        "orders": 120
      }
      // ... 11 more months
    ],
    "enrollmentsData": [
      {
        "course": "React 101",
        "enrollments": 120
      }
      // ... top 10 courses
    ],
    "recentOrders": [
      {
        "id": "uuid",
        "user": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "course": {
          "title": "Arabic 101"
        },
        "status": "completed",
        "totalAmount": 99.99,
        "createdAt": "2024-01-15T10:30:00Z",
        "paymentMethod": "Stripe"
      }
      // ... last 20 orders
    ]
  }
}
```

### User Management

#### Get All Users
```
GET /api/admin/users?page=1&limit=20&search=john&isActive=true

Response: {
  "success": true,
  "data": {
    "users": [ /* user array */ ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    }
  }
}
```

#### Get User by ID
```
GET /api/admin/users/:id

Response: {
  "success": true,
  "data": {
    "user": { /* user details */ }
  }
}
```

#### Update User
```
PUT /api/admin/users/:id
Body: {
  "firstName": "Updated",
  "isActive": false,
  "status": "SUSPENDED"
}

Response: {
  "success": true,
  "data": {
    "user": { /* updated user */ }
  }
}
```

#### Delete User
```
DELETE /api/admin/users/:id

Response: {
  "success": true,
  "message": "User deleted successfully"
}
```

### Order Management

#### Get All Orders
```
GET /api/admin/orders?page=1&limit=20&status=completed&search=john

Response: {
  "success": true,
  "data": {
    "orders": [ /* order array with user and product details */ ],
    "pagination": { /* pagination info */ }
  }
}
```

#### Get Order by ID
```
GET /api/admin/orders/:id

Response: {
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "user": { /* user details */ },
      "product": { /* product details */ },
      "course": { /* course details with instructors */ },
      "status": "completed",
      "amount": 99.99,
      "createdAt": "..."
    }
  }
}
```

#### Update Order Status
```
PUT /api/admin/orders/:id/status
Body: {
  "status": "completed",
  "notes": "Payment confirmed"
}

Response: {
  "success": true,
  "data": {
    "order": { /* updated order */ }
  }
}

Valid statuses: "pending", "completed", "cancelled", "refunded"
Note: State machine validates transitions (e.g., cannot go from "pending" to "refunded")
```

### Course Management (Admin)

#### Create Course
```
POST /api/admin/courses
Body: {
  "title": "New Course",
  "subtitle": "Course subtitle",
  "description": "Course description",
  "price": 199.99,
  "currency": "USD",
  "language": "Arabic",
  "level": "Beginner",
  "thumbnailUrl": "https://...",
  "chapters": [
    {
      "title": "Chapter 1",
      "description": "Chapter description",
      "order": 1,
      "lessons": [
        {
          "title": "Lesson 1",
          "type": "VIDEO", // VIDEO, PDF, TEXT, QUIZ
          "description": "Lesson description",
          "order": 1,
          "videoUrl": "https://...",
          "durationMinutes": 15,
          "isPreview": true
        }
      ]
    }
  ],
  "instructorIds": ["uuid1", "uuid2"]
}

Response: {
  "success": true,
  "data": { /* created course with all nested data */ }
}
```

#### Update Course
```
PUT /api/admin/courses/:id
Body: {
  "title": "Updated Title",
  "price": 249.99,
  "isPublished": true
}

Response: {
  "success": true,
  "data": { /* updated course */ }
}
```

#### Delete Course
```
DELETE /api/admin/courses/:id

Response: {
  "success": true,
  "message": "Course deleted successfully"
}
```

### Instructor Management (Admin)

#### Create Instructor
```
POST /api/admin/instructors
Body: {
  "firstName": "Dr. Ahmed",
  "lastName": "Al-Saud",
  "title": "Professor",
  "bio": "Instructor bio...",
  "avatarUrl": "https://...",
  "linkedinUrl": "https://...",
  "twitterUrl": "https://...",
  "websiteUrl": "https://..."
}

Response: {
  "success": true,
  "data": { /* instructor object */ }
}
```

#### Update Instructor
```
PUT /api/admin/instructors/:id
Body: {
  "title": "Updated Title",
  "bio": "Updated bio",
  "isActive": false
}

Response: {
  "success": true,
  "data": { /* updated instructor */ }
}
```

#### Delete Instructor
```
DELETE /api/admin/instructors/:id

Response: {
  "success": true,
  "message": "Instructor deleted successfully"
}
```

---

## 📊 Instructor Endpoints

**Base Path:** `/api/instructors` (Public endpoints for listing instructors)

### Get All Instructors
```
GET /api/instructors?page=1&limit=10&search=ahmed&isActive=true

Response: {
  "success": true,
  "data": {
    "instructors": [ /* instructor array */ ],
    "pagination": { /* pagination info */ }
  }
}
```

### Get Instructor by ID
```
GET /api/instructors/:id

Response: {
  "success": true,
  "data": {
    "instructor": { /* instructor details with courses */ }
  }
}
```

---

## 🔄 Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": ["Field 1 error", "Field 2 error"] // Optional, for validation errors
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔑 Environment Variables (Frontend)

```env
REACT_APP_API_BASE_URL=http://localhost:3000/api
REACT_APP_ENVIRONMENT=development
```

**Or for Vite:**
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENVIRONMENT=development
```

---

## 💻 Frontend API Service Example

### TypeScript/JavaScript API Service

```typescript
// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data.data;
  }

  // Auth
  async login(email: string, password: string) {
    const response = await this.request<{ user: any; token: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    localStorage.setItem('token', response.token);
    return response;
  }

  async signup(userData: any) {
    const response = await this.request<{ user: any; token: string }>(
      '/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );
    localStorage.setItem('token', response.token);
    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async logout() {
    localStorage.removeItem('token');
  }

  // Courses (Public)
  async getCourses(filters: any = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/courses?${params}`);
  }

  async getCourseById(id: string) {
    return this.request(`/courses/${id}`);
  }

  // Student
  async getEnrollments() {
    return this.request('/student/enrollments');
  }

  async createEnrollment(courseId: string, orderId?: string) {
    return this.request('/student/enrollments', {
      method: 'POST',
      body: JSON.stringify({ courseId, orderId }),
    });
  }

  async getProgress(enrollmentId: string) {
    return this.request(`/student/progress/${enrollmentId}`);
  }

  async updateLessonProgress(
    enrollmentId: string,
    lessonId: string,
    data: any
  ) {
    return this.request(
      `/student/progress/${enrollmentId}/lessons/${lessonId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  async submitQuizAttempt(
    enrollmentId: string,
    quizId: string,
    answers: any
  ) {
    return this.request(
      `/student/progress/${enrollmentId}/quizzes/${quizId}/attempt`,
      {
        method: 'POST',
        body: JSON.stringify({ answers }),
      }
    );
  }

  async getCertificates() {
    return this.request('/student/certificates');
  }

  // Instructor
  async getInstructorAnalytics() {
    return this.request('/instructor/analytics/overview');
  }

  async getCourseAnalytics(courseId: string) {
    return this.request(`/instructor/analytics/courses/${courseId}`);
  }

  async getMyCourses() {
    return this.request('/instructor/courses');
  }

  async getInstructorStudents() {
    return this.request('/instructor/students');
  }

  // Admin
  async getDashboardStats() {
    return this.request('/admin/dashboard/stats');
  }

  async getUsers(filters: any = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/admin/users?${params}`);
  }

  async getOrders(filters: any = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/admin/orders?${params}`);
  }

  async updateOrderStatus(orderId: string, status: string, notes?: string) {
    return this.request(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  async createCourse(courseData: any) {
    return this.request('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(id: string, courseData: any) {
    return this.request(`/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(id: string) {
    return this.request(`/admin/courses/${id}`, {
      method: 'DELETE',
    });
  }

  async createInstructor(instructorData: any) {
    return this.request('/admin/instructors', {
      method: 'POST',
      body: JSON.stringify(instructorData),
    });
  }
}

export default new ApiService();
```

---

## 🔐 Authentication Flow (Frontend)

### 1. Login Flow

```typescript
// Login component
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await apiService.login(email, password);
    // response.token is stored automatically
    // response.user contains user data
    setUser(response.user);
    navigate('/dashboard');
  } catch (error) {
    setError(error.message);
  }
};
```

### 2. Protected Routes

```typescript
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
```

### 3. Token Refresh (Optional)

```typescript
// Interceptor for 401 errors
apiService.request = async (endpoint, options) => {
  // ... existing code ...
  
  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Session expired');
  }
  
  // ... rest of code ...
};
```

---

## 📦 Data Structures

### User Object
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImage?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  role?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Course Object
```typescript
interface Course {
  id: string;
  productId: string;
  level: string;
  language: string;
  thumbnailUrl?: string;
  product: {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    price: string;
    currency: string;
    isPublished: boolean;
  };
  instructors: Instructor[];
  chapters: Chapter[];
}
```

### Chapter Object
```typescript
interface Chapter {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}
```

### Lesson Object
```typescript
interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  description?: string;
  type: 'VIDEO' | 'PDF' | 'TEXT' | 'QUIZ';
  videoUrl?: string; // For VIDEO type
  contentUrl?: string; // For PDF type
  textContent?: string; // For TEXT type
  durationMinutes?: number;
  isPreview: boolean;
  order: number;
  quiz?: Quiz; // If type is QUIZ
}
```

### Enrollment Object
```typescript
interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  orderId?: string;
  status: 'enrolled' | 'completed' | 'dropped';
  completionPercentage: number;
  enrolledAt: string;
  lastAccessedAt?: string;
  course: Course;
  progress?: {
    totalLessons: number;
    completedLessons: number;
    completionPercentage: number;
    quizAttempts: number;
    passedQuizzes: number;
  };
}
```

### Order Object
```typescript
interface Order {
  id: string;
  userId: string;
  productId: string;
  courseId?: string;
  amount: string;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod?: string;
  paymentId?: string;
  transactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  product?: Product;
  course?: Course;
}
```

---

## 🎯 Quick Reference: All Endpoints

| Feature | Method | Endpoint | Auth | Role |
|---------|--------|----------|------|------|
| **Auth** |
| Sign Up | POST | `/api/auth/signup` | No | - |
| Login | POST | `/api/auth/login` | No | - |
| Google OAuth | GET | `/api/auth/google` | No | - |
| Facebook OAuth | GET | `/api/auth/facebook` | No | - |
| LinkedIn OAuth | GET | `/api/auth/linkedin` | No | - |
| Apple OAuth | GET | `/api/auth/apple` | No | - |
| Forgot Password | POST | `/api/auth/forgot-password` | No | - |
| Reset Password | POST | `/api/auth/reset-password` | No | - |
| Get Current User | GET | `/api/auth/me` | Yes | Any |
| **Courses (Public)** |
| Get All Courses | GET | `/api/courses` | No | - |
| Get Course by ID | GET | `/api/courses/:id` | No | - |
| **Instructors (Public)** |
| Get All Instructors | GET | `/api/instructors` | No | - |
| Get Instructor by ID | GET | `/api/instructors/:id` | No | - |
| **Student** |
| Get Enrollments | GET | `/api/student/enrollments` | Yes | Any |
| Get Enrollment | GET | `/api/student/enrollments/:id` | Yes | Any |
| Create Enrollment | POST | `/api/student/enrollments` | Yes | Any |
| Get Progress | GET | `/api/student/progress/:enrollmentId` | Yes | Any |
| Update Lesson Progress | PUT | `/api/student/progress/:enrollmentId/lessons/:lessonId` | Yes | Any |
| Submit Quiz | POST | `/api/student/progress/:enrollmentId/quizzes/:quizId/attempt` | Yes | Any |
| Get Certificates | GET | `/api/student/certificates` | Yes | Any |
| Get Certificate | GET | `/api/student/certificates/:id` | Yes | Any |
| Verify Certificate | GET | `/api/student/certificates/verify/:code` | No | - |
| **Instructor** |
| Get Analytics | GET | `/api/instructor/analytics/overview` | Yes | Instructor |
| Get Course Analytics | GET | `/api/instructor/analytics/courses/:courseId` | Yes | Instructor |
| Get My Courses | GET | `/api/instructor/courses` | Yes | Instructor |
| Get Course | GET | `/api/instructor/courses/:id` | Yes | Instructor |
| Update Course | PUT | `/api/instructor/courses/:id` | Yes | Instructor |
| Get Students | GET | `/api/instructor/students` | Yes | Instructor |
| Get Course Students | GET | `/api/instructor/courses/:courseId/students` | Yes | Instructor |
| Get Student Progress | GET | `/api/instructor/courses/:courseId/students/:studentId` | Yes | Instructor |
| **Admin** |
| Get Dashboard Stats | GET | `/api/admin/dashboard/stats` | Yes | Admin |
| Get Users | GET | `/api/admin/users` | Yes | Admin |
| Get User | GET | `/api/admin/users/:id` | Yes | Admin |
| Update User | PUT | `/api/admin/users/:id` | Yes | Admin |
| Delete User | DELETE | `/api/admin/users/:id` | Yes | Admin |
| Get Orders | GET | `/api/admin/orders` | Yes | Admin |
| Get Order | GET | `/api/admin/orders/:id` | Yes | Admin |
| Update Order Status | PUT | `/api/admin/orders/:id/status` | Yes | Admin |
| Create Course | POST | `/api/admin/courses` | Yes | Admin |
| Update Course | PUT | `/api/admin/courses/:id` | Yes | Admin |
| Delete Course | DELETE | `/api/admin/courses/:id` | Yes | Admin |
| Create Instructor | POST | `/api/admin/instructors` | Yes | Admin |
| Update Instructor | PUT | `/api/admin/instructors/:id` | Yes | Admin |
| Delete Instructor | DELETE | `/api/admin/instructors/:id` | Yes | Admin |

---

## 🚀 Testing Credentials

### Admin User
```
Email: admin@elcanadi.com
Password: Admin@123456
```

### Regular User
```
Email: student1@example.com
Password: Student123!
```

**Note:** Run `npm run seed` to populate test data.

---

## 📝 Important Notes

1. **Token Storage:** Store JWT token in `localStorage` or `sessionStorage`
2. **Token Expiration:** Tokens expire after configured time. Handle 401 errors.
3. **State Machine:** Order status changes are validated. Invalid transitions return 400 error.
4. **Pagination:** Most list endpoints support pagination with `page` and `limit` parameters.
5. **Search:** Many endpoints support `search` parameter for filtering.
6. **Date Format:** All dates are in ISO 8601 format (`2024-01-15T10:30:00Z`)
7. **Amount Format:** Money amounts are strings (e.g., `"99.99"`) to preserve precision.
8. **UUIDs:** All IDs are UUIDs (strings).
9. **Soft Deletes:** Some models support soft deletes (not permanently deleted).
10. **CORS:** Backend is configured to accept requests from frontend origin.

---

## 🎨 Frontend Implementation Checklist

- [ ] Set up API base URL in environment variables
- [ ] Create API service class/utility
- [ ] Implement authentication (login, signup, OAuth)
- [ ] Implement token storage and retrieval
- [ ] Implement protected routes
- [ ] Implement error handling
- [ ] Implement loading states
- [ ] Implement Admin Dashboard
  - [ ] Dashboard stats cards
  - [ ] Revenue chart
  - [ ] Enrollments chart
  - [ ] Recent orders table
- [ ] Implement Student Dashboard
  - [ ] My enrollments
  - [ ] Course progress tracking
  - [ ] Certificates
- [ ] Implement Instructor Dashboard
  - [ ] Analytics overview
  - [ ] Course management
  - [ ] Student management
- [ ] Implement Course browsing
- [ ] Implement Course detail page
- [ ] Implement Lesson player
- [ ] Implement Quiz interface

---

**Use this guide as your complete reference for frontend integration!**

