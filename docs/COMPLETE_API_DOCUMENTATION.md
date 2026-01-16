# Complete API Documentation - Frontend Integration Guide

## 📋 Table of Contents
1. [Base Configuration](#base-configuration)
2. [Authentication Routes](#authentication-routes)
3. [Course Routes](#course-routes)
4. [Instructor Routes](#instructor-routes)
5. [Health Check](#health-check)
6. [Frontend Integration Examples](#frontend-integration-examples)
7. [Error Handling](#error-handling)

---

## Base Configuration

### Base URL
```
Development: http://localhost:3000
Production: https://your-domain.com
```

### API Base Path
```
/api
```

### Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* response data */ }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ /* validation errors (optional) */ ]
}
```

### Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Routes

### Base Path: `/api/auth`

---

### 1. POST `/api/auth/signup`
**Purpose:** Register a new user account

**Request:**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"  // optional
}
```

**Response (201 Created):**
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
      "phone": "+1234567890",
      "isEmailVerified": false,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token-here"
  }
}
```

**Frontend Integration:**
```javascript
// Signup function
const signup = async (userData) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (result.success) {
      // Store token
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      // Handle error
      console.error(result.message);
    }
  } catch (error) {
    console.error('Signup error:', error);
  }
};

// Usage
signup({
  email: 'user@example.com',
  password: 'Password123!',
  firstName: 'John',
  lastName: 'Doe',
});
```

---

### 2. POST `/api/auth/login`
**Purpose:** Authenticate user and get JWT token

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isEmailVerified": true,
      "isActive": true
    },
    "token": "jwt-token-here"
  }
}
```

**Frontend Integration:**
```javascript
// Login function
const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.success) {
      // Store token and user
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
```

---

### 3. GET `/api/auth/me`
**Purpose:** Get current authenticated user information

**Request:**
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "isEmailVerified": true,
      "isActive": true,
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Frontend Integration:**
```javascript
// Get current user
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return null;
  }

  try {
    const response = await fetch('http://localhost:3000/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (result.success) {
      return result.data.user;
    } else {
      // Token might be invalid
      localStorage.removeItem('token');
      return null;
    }
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};
```

---

### 4. POST `/api/auth/forgot-password`
**Purpose:** Request password reset email

**Request:**
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset email sent",
  "data": {
    "message": "If an account exists with this email, a password reset link has been sent."
  }
}
```

**Frontend Integration:**
```javascript
// Forgot password
const forgotPassword = async (email) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};
```

---

### 5. POST `/api/auth/reset-password`
**Purpose:** Reset password using token from email

**Request:**
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "password": "NewPassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successful",
  "data": {
    "message": "Your password has been reset successfully"
  }
}
```

**Frontend Integration:**
```javascript
// Reset password
const resetPassword = async (token, password) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};
```

---

### 6. OAuth Routes

#### Google OAuth
**Purpose:** Login with Google account

**Request:**
```http
GET /api/auth/google
```

**Flow:**
1. User clicks "Login with Google"
2. Redirect to Google OAuth
3. User authorizes
4. Redirect to `/api/auth/google/callback`
5. Backend redirects to frontend: `/auth/callback?token=<jwt>&user=<user-data>`

**Frontend Integration:**
```javascript
// Google OAuth login
const loginWithGoogle = () => {
  window.location.href = 'http://localhost:3000/api/auth/google';
};

// Handle OAuth callback (in your callback page)
const handleOAuthCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const user = JSON.parse(decodeURIComponent(urlParams.get('user')));

  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    window.location.href = '/dashboard';
  } else {
    // Handle error
    const error = urlParams.get('error');
    console.error('OAuth error:', error);
  }
};
```

#### Facebook OAuth
```javascript
const loginWithFacebook = () => {
  window.location.href = 'http://localhost:3000/api/auth/facebook';
};
```

#### LinkedIn OAuth
```javascript
const loginWithLinkedIn = () => {
  window.location.href = 'http://localhost:3000/api/auth/linkedin';
};
```

#### Apple OAuth
```javascript
const loginWithApple = () => {
  window.location.href = 'http://localhost:3000/api/auth/apple';
};
```

---

## 📚 Course Routes

### Base Path: `/api/courses`

---

### 1. GET `/api/courses`
**Purpose:** Get all courses with pagination and filters

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10, max: 100) - Items per page
- `search` (string, optional) - Search in title/subtitle
- `level` (string, optional) - Filter by level (e.g., "Beginner", "Intermediate")
- `language` (string, optional) - Filter by language
- `isPublished` (boolean, optional) - Filter published courses

**Request:**
```http
GET /api/courses?page=1&limit=10&level=Beginner&isPublished=true&search=arabic
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": {
    "courses": [
      {
        "id": "uuid",
        "productId": "uuid",
        "totalChapters": 10,
        "totalLessons": 50,
        "language": "Arabic",
        "level": "Beginner to Intermediate",
        "thumbnailUrl": "https://...",
        "durationMinutes": 3000,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "product": {
          "id": "uuid",
          "type": "course",
          "title": "Complete Arabic Mastery Program",
          "subtitle": "From Zero to Fluency in Arabic",
          "description": "A comprehensive Arabic language course...",
          "price": "299.99",
          "currency": "USD",
          "isPublished": true,
          "isArchived": false,
          "slug": "complete-arabic-mastery-program"
        },
        "instructors": [
          {
            "id": "uuid",
            "firstName": "Dr. Khaled",
            "lastName": "Al-Mansouri",
            "title": "Professor of Arabic Linguistics",
            "avatarUrl": "https://...",
            "CourseInstructor": {
              "role": "primary"
            }
          }
        ]
      }
    ],
    "pagination": {
      "total": 6,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

**Frontend Integration:**
```javascript
// Get all courses
const getCourses = async (filters = {}) => {
  const queryParams = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 10,
    ...(filters.search && { search: filters.search }),
    ...(filters.level && { level: filters.level }),
    ...(filters.language && { language: filters.language }),
    ...(filters.isPublished !== undefined && { isPublished: filters.isPublished }),
  });

  try {
    const response = await fetch(`http://localhost:3000/api/courses?${queryParams}`);
    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Get courses error:', error);
    throw error;
  }
};

// Usage
const coursesData = await getCourses({
  page: 1,
  limit: 12,
  isPublished: true,
  level: 'Beginner',
});
```

**React Example:**
```jsx
import { useState, useEffect } from 'react';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/courses?page=1&limit=12&isPublished=true');
        const result = await response.json();

        if (result.success) {
          setCourses(result.data.courses);
          setPagination(result.data.pagination);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {courses.map((course) => {
        const product = course.product || {};
        return (
          <div key={course.id}>
            <h3>{product.title}</h3>
            <p>{product.subtitle}</p>
            <p>${product.price}</p>
          </div>
        );
      })}
    </div>
  );
};
```

---

### 2. GET `/api/courses/:id`
**Purpose:** Get single course by ID with all details (chapters, lessons, instructors)

**Request:**
```http
GET /api/courses/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Course retrieved successfully",
  "data": {
    "id": "uuid",
    "productId": "uuid",
    "totalChapters": 10,
    "totalLessons": 50,
    "language": "Arabic",
    "level": "Beginner to Intermediate",
    "thumbnailUrl": "https://...",
    "durationMinutes": 3000,
    "product": {
      "id": "uuid",
      "title": "Complete Arabic Mastery Program",
      "subtitle": "From Zero to Fluency in Arabic",
      "description": "A comprehensive Arabic language course...",
      "price": "299.99",
      "currency": "USD",
      "isPublished": true
    },
    "chapters": [
      {
        "id": "uuid",
        "courseId": "uuid",
        "title": "Introduction to Arabic",
        "description": "Learn the Arabic alphabet...",
        "order": 1,
        "lessons": [
          {
            "id": "uuid",
            "chapterId": "uuid",
            "title": "Lesson 1: Arabic Alphabet",
            "description": "Introduction to Arabic letters",
            "order": 1,
            "videoUrl": "https://...",
            "durationMinutes": 15,
            "isPreview": true
          }
        ]
      }
    ],
    "instructors": [
      {
        "id": "uuid",
        "firstName": "Dr. Khaled",
        "lastName": "Al-Mansouri",
        "title": "Professor of Arabic Linguistics",
        "avatarUrl": "https://...",
        "CourseInstructor": {
          "role": "primary"
        }
      }
    ]
  }
}
```

**Frontend Integration:**
```javascript
// Get course by ID
const getCourseById = async (courseId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/courses/${courseId}`);
    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Get course error:', error);
    throw error;
  }
};
```

**React Example:**
```jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/courses/${id}`);
        const result = await response.json();

        if (result.success) {
          setCourse(result.data);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  const product = course.product || {};

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.subtitle}</p>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      
      <h2>Chapters</h2>
      {course.chapters?.map((chapter) => (
        <div key={chapter.id}>
          <h3>{chapter.title}</h3>
          <ul>
            {chapter.lessons?.map((lesson) => (
              <li key={lesson.id}>
                {lesson.title} {lesson.isPreview && '(Preview)'}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
```

---

### 3. POST `/api/courses`
**Purpose:** Create a new course (Admin only - recommended)

**Request:**
```http
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Arabic A1",
  "subtitle": "Beginner Course",
  "description": "Complete course description...",
  "price": 99.99,
  "currency": "USD",
  "language": "Arabic",
  "level": "Beginner",
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

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    /* Full course object with all relations */
  }
}
```

---

### 4. PUT `/api/courses/:id`
**Purpose:** Update course (Admin only - recommended)

**Request:**
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

---

### 5. DELETE `/api/courses/:id`
**Purpose:** Delete course (Admin only - recommended)

**Request:**
```http
DELETE /api/courses/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Course deleted successfully",
  "data": null
}
```

---

## 👨‍🏫 Instructor Routes

### Base Path: `/api/instructors`

---

### 1. GET `/api/instructors`
**Purpose:** Get all instructors with pagination and search

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)
- `search` (string, optional) - Search in name, title, bio

**Request:**
```http
GET /api/instructors?page=1&limit=10&search=khaled
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Instructors retrieved successfully",
  "data": {
    "instructors": [
      {
        "id": "uuid",
        "firstName": "Dr. Khaled",
        "lastName": "Al-Mansouri",
        "title": "Professor of Arabic Linguistics",
        "bio": "Dr. Khaled Al-Mansouri is a renowned Arabic language expert...",
        "avatarUrl": "https://...",
        "linkedinUrl": "https://...",
        "twitterUrl": "https://...",
        "websiteUrl": "https://...",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

**Frontend Integration:**
```javascript
// Get all instructors
const getInstructors = async (filters = {}) => {
  const queryParams = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 10,
    ...(filters.search && { search: filters.search }),
  });

  try {
    const response = await fetch(`http://localhost:3000/api/instructors?${queryParams}`);
    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Get instructors error:', error);
    throw error;
  }
};
```

---

### 2. GET `/api/instructors/:id`
**Purpose:** Get instructor by ID with optional courses

**Query Parameters:**
- `includeCourses` (boolean, default: false) - Include instructor's courses

**Request:**
```http
GET /api/instructors/:id?includeCourses=true
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Instructor retrieved successfully",
  "data": {
    "id": "uuid",
    "firstName": "Dr. Khaled",
    "lastName": "Al-Mansouri",
    "title": "Professor of Arabic Linguistics",
    "bio": "...",
    "avatarUrl": "https://...",
    "isActive": true,
    "courses": [
      {
        "id": "uuid",
        "product": {
          "title": "Complete Arabic Mastery Program",
          "price": "299.99"
        },
        "CourseInstructor": {
          "role": "primary"
        }
      }
    ]
  }
}
```

**Frontend Integration:**
```javascript
// Get instructor by ID
const getInstructorById = async (instructorId, includeCourses = false) => {
  try {
    const url = `http://localhost:3000/api/instructors/${instructorId}${includeCourses ? '?includeCourses=true' : ''}`;
    const response = await fetch(url);
    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Get instructor error:', error);
    throw error;
  }
};
```

---

### 3. POST `/api/instructors`
**Purpose:** Create instructor (Admin only - recommended)

**Request:**
```http
POST /api/instructors
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Dr. Khaled",
  "lastName": "Al-Mansouri",
  "title": "Professor of Arabic Linguistics",
  "bio": "Dr. Khaled Al-Mansouri is a renowned expert...",
  "avatarUrl": "https://...",
  "linkedinUrl": "https://...",
  "twitterUrl": "https://...",
  "websiteUrl": "https://..."
}
```

---

### 4. PUT `/api/instructors/:id`
**Purpose:** Update instructor (Admin only - recommended)

---

### 5. DELETE `/api/instructors/:id`
**Purpose:** Delete instructor (Admin only - recommended)

---

## 🏥 Health Check

### GET `/health`
**Purpose:** Check if API is running

**Request:**
```http
GET /health
```

**Response (200 OK):**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🔧 Frontend Integration Examples

### Complete API Service Class

```javascript
// api.js
const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('token');
  }

  // Get auth headers
  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Generic fetch wrapper
  async fetch(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async signup(userData) {
    return this.fetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email, password) {
    const data = await this.fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  }

  async getCurrentUser() {
    return this.fetch('/auth/me');
  }

  async forgotPassword(email) {
    return this.fetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, password) {
    return this.fetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  // Course methods
  async getCourses(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.fetch(`/courses?${params}`);
  }

  async getCourseById(id) {
    return this.fetch(`/courses/${id}`);
  }

  async createCourse(courseData) {
    return this.fetch('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(id, courseData) {
    return this.fetch(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(id) {
    return this.fetch(`/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // Instructor methods
  async getInstructors(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.fetch(`/instructors?${params}`);
  }

  async getInstructorById(id, includeCourses = false) {
    const url = `/instructors/${id}${includeCourses ? '?includeCourses=true' : ''}`;
    return this.fetch(url);
  }
}

export default new ApiService();
```

### React Hook Example

```jsx
// useCourses.js
import { useState, useEffect } from 'react';
import api from './api';

export const useCourses = (filters = {}) => {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await api.getCourses(filters);
        setCourses(data.courses);
        setPagination(data.pagination);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [JSON.stringify(filters)]);

  return { courses, pagination, loading, error };
};
```

---

## ⚠️ Error Handling

### Common Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

### Error Response Example

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Frontend Error Handling

```javascript
try {
  const data = await api.getCourses();
} catch (error) {
  if (error.message.includes('401')) {
    // Unauthorized - redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login';
  } else if (error.message.includes('404')) {
    // Not found
    console.error('Resource not found');
  } else {
    // Other errors
    console.error('Error:', error.message);
  }
}
```

---

## 👨‍💼 Admin Routes

### Base Path: `/api/admin`

**⚠️ All admin routes require:**
1. Authentication (JWT token)
2. Admin role (currently: `admin@elcanadi.com`)

---

### Dashboard Statistics

#### GET `/api/admin/dashboard/stats`
Get dashboard statistics (users, courses, orders, revenue)

**Request:**
```http
GET /api/admin/dashboard/stats
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 5,
    "totalCourses": 6,
    "totalInstructors": 5,
    "totalOrders": 3,
    "totalRevenue": 749.97,
    "recentOrders": [ /* last 10 orders */ ]
  }
}
```

---

### User Management

#### GET `/api/admin/users`
List all users with pagination

**Query Params:** `page`, `limit`, `search`, `isActive`

#### GET `/api/admin/users/:id`
Get user by ID

#### PUT `/api/admin/users/:id`
Update user

#### DELETE `/api/admin/users/:id`
Delete user (soft delete)

---

### Order Management

#### GET `/api/admin/orders`
List all orders with pagination

**Query Params:** `page`, `limit`, `status`, `search`

#### GET `/api/admin/orders/:id`
Get order by ID with full details

#### PUT `/api/admin/orders/:id/status`
Update order status

**Body:**
```json
{
  "status": "completed",
  "notes": "Payment confirmed"
}
```

**Valid Statuses:** `pending`, `completed`, `cancelled`, `refunded`

---

### Course Management (Admin)

#### POST `/api/admin/courses`
Create course (same as regular create, but requires admin)

#### PUT `/api/admin/courses/:id`
Update course (requires admin)

#### DELETE `/api/admin/courses/:id`
Delete course (requires admin)

---

### Instructor Management (Admin)

#### POST `/api/admin/instructors`
Create instructor (requires admin)

#### PUT `/api/admin/instructors/:id`
Update instructor (requires admin)

#### DELETE `/api/admin/instructors/:id`
Delete instructor (requires admin)

---

**For detailed admin API documentation, see `ADMIN_DASHBOARD_API.md`**

---

## 📝 Complete Route Summary

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| **Authentication** |
| POST | `/api/auth/signup` | Register user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password | No |
| GET | `/api/auth/google` | Google OAuth | No |
| GET | `/api/auth/facebook` | Facebook OAuth | No |
| GET | `/api/auth/linkedin` | LinkedIn OAuth | No |
| GET | `/api/auth/apple` | Apple OAuth | No |
| **Courses** |
| GET | `/api/courses` | List courses | No |
| GET | `/api/courses/:id` | Get course details | No |
| POST | `/api/courses` | Create course | Recommended |
| PUT | `/api/courses/:id` | Update course | Recommended |
| DELETE | `/api/courses/:id` | Delete course | Recommended |
| **Instructors** |
| GET | `/api/instructors` | List instructors | No |
| GET | `/api/instructors/:id` | Get instructor details | No |
| POST | `/api/instructors` | Create instructor | Recommended |
| PUT | `/api/instructors/:id` | Update instructor | Recommended |
| DELETE | `/api/instructors/:id` | Delete instructor | Recommended |
| **Admin** |
| GET | `/api/admin/dashboard/stats` | Dashboard statistics | ✅ Admin |
| GET | `/api/admin/users` | List users | ✅ Admin |
| GET | `/api/admin/users/:id` | Get user | ✅ Admin |
| PUT | `/api/admin/users/:id` | Update user | ✅ Admin |
| DELETE | `/api/admin/users/:id` | Delete user | ✅ Admin |
| GET | `/api/admin/orders` | List orders | ✅ Admin |
| GET | `/api/admin/orders/:id` | Get order | ✅ Admin |
| PUT | `/api/admin/orders/:id/status` | Update order status | ✅ Admin |
| POST | `/api/admin/courses` | Create course | ✅ Admin |
| PUT | `/api/admin/courses/:id` | Update course | ✅ Admin |
| DELETE | `/api/admin/courses/:id` | Delete course | ✅ Admin |
| POST | `/api/admin/instructors` | Create instructor | ✅ Admin |
| PUT | `/api/admin/instructors/:id` | Update instructor | ✅ Admin |
| DELETE | `/api/admin/instructors/:id` | Delete instructor | ✅ Admin |
| **Health** |
| GET | `/health` | Health check | No |

---

**This documentation provides everything needed for frontend integration!**

