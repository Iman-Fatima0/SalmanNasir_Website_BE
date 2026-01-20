# Frontend Quick Start Guide

## 🚀 Quick Setup

### 1. Environment Variables

Create `.env` file in your frontend project:

```env
VITE_API_BASE_URL=http://localhost:3000/api
# or
REACT_APP_API_BASE_URL=http://localhost:3000/api
```

### 2. Install Dependencies (if needed)

```bash
npm install axios  # or use fetch
```

### 3. Create API Service

```typescript
// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiService {
  private getToken() {
    return localStorage.getItem('token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data.data;
  }

  // Auth
  login = (email: string, password: string) =>
    this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

  signup = (userData: any) =>
    this.request('/auth/signup', {
      method: 'POST',
      body: userData,
    });

  // Courses
  getCourses = (filters: any = {}) => {
    const params = new URLSearchParams(filters);
    return this.request(`/courses?${params}`);
  };

  // Student
  getEnrollments = () => this.request('/student/enrollments');
  
  // Admin
  getDashboardStats = () => this.request('/admin/dashboard/stats');
}

export default new ApiService();
```

### 4. Basic Usage

```typescript
// Login
const handleLogin = async () => {
  const { token, user } = await apiService.login(email, password);
  localStorage.setItem('token', token);
  setUser(user);
};

// Get courses
const courses = await apiService.getCourses({ page: 1, limit: 12 });

// Get dashboard stats
const stats = await apiService.getDashboardStats();
```

---

## 📦 Complete API Reference

See `COMPLETE_FRONTEND_INTEGRATION_GUIDE.md` for full API documentation.

---

## 🔑 Test Credentials

```
Admin: admin@elcanadi.com / Admin@123456
Student: student1@example.com / Student123!
```

---

## 📝 Quick Reference Card

### Authentication
```
POST /api/auth/signup - Register
POST /api/auth/login - Login
GET /api/auth/me - Get current user
```

### Courses (Public)
```
GET /api/courses - List courses
GET /api/courses/:id - Get course details
```

### Student
```
GET /api/student/enrollments - My enrollments
POST /api/student/enrollments - Enroll in course
GET /api/student/progress/:id - Get progress
PUT /api/student/progress/:id/lessons/:lessonId - Update lesson progress
```

### Instructor
```
GET /api/instructor/analytics/overview - Analytics
GET /api/instructor/courses - My courses
GET /api/instructor/students - My students
```

### Admin
```
GET /api/admin/dashboard/stats - Dashboard stats
GET /api/admin/users - All users
GET /api/admin/orders - All orders
PUT /api/admin/orders/:id/status - Update order status
POST /api/admin/courses - Create course
```

---

**Ready to integrate!** 🎉

