# Admin Dashboard API Documentation

## 🔐 Authentication

All admin routes require:
1. **Authentication** - Valid JWT token
2. **Admin Role** - User must be admin (currently: `admin@elcanadi.com`)

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

---

## 📊 Base Path

```
/api/admin
```

---

## 🎯 Dashboard Statistics

### GET `/api/admin/dashboard/stats`

**Purpose:** Get dashboard statistics (total users, courses, orders, revenue, etc.)

**Request:**
```http
GET /api/admin/dashboard/stats
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalUsers": 5,
    "totalCourses": 6,
    "totalInstructors": 5,
    "totalOrders": 0,
    "totalRevenue": 0,
    "recentOrders": []
  }
}
```

**Frontend Integration:**
```javascript
const getDashboardStats = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/api/admin/dashboard/stats', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const result = await response.json();
  return result.data;
};
```

---

## 👥 User Management

### GET `/api/admin/users`

**Purpose:** Get all users with pagination and filters

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)
- `search` (string, optional) - Search in email, firstName, lastName
- `isActive` (boolean, optional) - Filter by active status

**Request:**
```http
GET /api/admin/users?page=1&limit=10&search=john&isActive=true
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "phone": "+1234567890",
        "isEmailVerified": true,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
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

---

### GET `/api/admin/users/:id`

**Purpose:** Get user by ID

**Request:**
```http
GET /api/admin/users/:id
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
      "isActive": true
    }
  }
}
```

---

### PUT `/api/admin/users/:id`

**Purpose:** Update user information

**Request:**
```http
PUT /api/admin/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Updated Name",
  "isActive": false,
  "isEmailVerified": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": { /* updated user object */ }
  }
}
```

---

### DELETE `/api/admin/users/:id`

**Purpose:** Delete user (soft delete - deactivates account)

**Request:**
```http
DELETE /api/admin/users/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null
}
```

---

## 📦 Order Management

### GET `/api/admin/orders`

**Purpose:** Get all orders with pagination and filters

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)
- `status` (string, optional) - Filter by status: `pending`, `completed`, `cancelled`, `refunded`
- `search` (string, optional) - Search in user email/name

**Request:**
```http
GET /api/admin/orders?page=1&limit=10&status=completed
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [
      {
        "id": "uuid",
        "userId": "uuid",
        "productId": "uuid",
        "courseId": "uuid",
        "amount": "299.99",
        "currency": "USD",
        "status": "completed",
        "paymentMethod": "credit_card",
        "transactionId": "txn_123",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "user": {
          "id": "uuid",
          "email": "user@example.com",
          "firstName": "John",
          "lastName": "Doe"
        },
        "product": {
          "id": "uuid",
          "title": "Complete Arabic Mastery Program",
          "price": "299.99",
          "currency": "USD"
        },
        "course": {
          "id": "uuid",
          "level": "Beginner to Intermediate",
          "language": "Arabic"
        }
      }
    ],
    "pagination": {
      "total": 10,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

### GET `/api/admin/orders/:id`

**Purpose:** Get order by ID with full details

**Request:**
```http
GET /api/admin/orders/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "order": {
      "id": "uuid",
      "userId": "uuid",
      "productId": "uuid",
      "courseId": "uuid",
      "amount": "299.99",
      "currency": "USD",
      "status": "completed",
      "paymentMethod": "credit_card",
      "transactionId": "txn_123",
      "notes": "Customer requested invoice",
      "user": { /* full user object */ },
      "product": { /* full product object */ },
      "course": {
        "id": "uuid",
        "level": "Beginner to Intermediate",
        "language": "Arabic",
        "instructors": [ /* instructors array */ ]
      }
    }
  }
}
```

---

### PUT `/api/admin/orders/:id/status`

**Purpose:** Update order status

**Request:**
```http
PUT /api/admin/orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed",
  "notes": "Payment confirmed"
}
```

**Valid Statuses:**
- `pending`
- `completed`
- `cancelled`
- `refunded`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "order": { /* updated order object */ }
  }
}
```

---

## 📚 Course Management (Admin)

### POST `/api/admin/courses`

**Purpose:** Create new course with all details

**Request:**
```http
POST /api/admin/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Arabic Course",
  "subtitle": "Advanced Level",
  "description": "Complete course description...",
  "price": 199.99,
  "currency": "USD",
  "language": "Arabic",
  "level": "Advanced",
  "thumbnailUrl": "https://...",
  "chapters": [
    {
      "title": "Chapter 1",
      "description": "Chapter description",
      "order": 1,
      "lessons": [
        {
          "title": "Lesson 1",
          "description": "Lesson description",
          "order": 1,
          "videoUrl": "https://...",
          "durationMinutes": 15,
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
  "data": { /* full course object with chapters, lessons, instructors */ }
}
```

---

### PUT `/api/admin/courses/:id`

**Purpose:** Update course

**Request:**
```http
PUT /api/admin/courses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Course Title",
  "price": 249.99,
  "isPublished": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": { /* updated course object */ }
}
```

---

### DELETE `/api/admin/courses/:id`

**Purpose:** Delete course

**Request:**
```http
DELETE /api/admin/courses/:id
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

## 👨‍🏫 Instructor Management (Admin)

### POST `/api/admin/instructors`

**Purpose:** Create new instructor

**Request:**
```http
POST /api/admin/instructors
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Dr. Ahmed",
  "lastName": "Al-Saud",
  "title": "Professor of Arabic Literature",
  "bio": "Dr. Ahmed Al-Saud is an expert in...",
  "avatarUrl": "https://...",
  "linkedinUrl": "https://...",
  "twitterUrl": "https://...",
  "websiteUrl": "https://..."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Instructor created successfully",
  "data": { /* instructor object */ }
}
```

---

### PUT `/api/admin/instructors/:id`

**Purpose:** Update instructor

**Request:**
```http
PUT /api/admin/instructors/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "bio": "Updated bio..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Instructor updated successfully",
  "data": { /* updated instructor object */ }
}
```

---

### DELETE `/api/admin/instructors/:id`

**Purpose:** Delete instructor (soft delete)

**Request:**
```http
DELETE /api/admin/instructors/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Instructor deleted successfully",
  "data": null
}
```

---

## 🎨 Frontend Integration Examples

### Complete Admin API Service

```javascript
// adminApi.js
const API_BASE_URL = 'http://localhost:3000/api';

class AdminApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`,
    };
  }

  async fetch(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
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
      console.error('Admin API Error:', error);
      throw error;
    }
  }

  // Dashboard
  async getDashboardStats() {
    return this.fetch('/admin/dashboard/stats');
  }

  // Users
  async getUsers(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.fetch(`/admin/users?${params}`);
  }

  async getUserById(id) {
    return this.fetch(`/admin/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.fetch(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.fetch(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.fetch(`/admin/orders?${params}`);
  }

  async getOrderById(id) {
    return this.fetch(`/admin/orders/${id}`);
  }

  async updateOrderStatus(id, status, notes = null) {
    return this.fetch(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  // Courses
  async createCourse(courseData) {
    return this.fetch('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(id, courseData) {
    return this.fetch(`/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(id) {
    return this.fetch(`/admin/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // Instructors
  async createInstructor(instructorData) {
    return this.fetch('/admin/instructors', {
      method: 'POST',
      body: JSON.stringify(instructorData),
    });
  }

  async updateInstructor(id, instructorData) {
    return this.fetch(`/admin/instructors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(instructorData),
    });
  }

  async deleteInstructor(id) {
    return this.fetch(`/admin/instructors/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new AdminApiService();
```

---

## 📋 Complete Route Summary

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| **Dashboard** |
| GET | `/api/admin/dashboard/stats` | Get dashboard statistics | ✅ Admin |
| **Users** |
| GET | `/api/admin/users` | List all users | ✅ Admin |
| GET | `/api/admin/users/:id` | Get user by ID | ✅ Admin |
| PUT | `/api/admin/users/:id` | Update user | ✅ Admin |
| DELETE | `/api/admin/users/:id` | Delete user | ✅ Admin |
| **Orders** |
| GET | `/api/admin/orders` | List all orders | ✅ Admin |
| GET | `/api/admin/orders/:id` | Get order by ID | ✅ Admin |
| PUT | `/api/admin/orders/:id/status` | Update order status | ✅ Admin |
| **Courses** |
| POST | `/api/admin/courses` | Create course | ✅ Admin |
| PUT | `/api/admin/courses/:id` | Update course | ✅ Admin |
| DELETE | `/api/admin/courses/:id` | Delete course | ✅ Admin |
| **Instructors** |
| POST | `/api/admin/instructors` | Create instructor | ✅ Admin |
| PUT | `/api/admin/instructors/:id` | Update instructor | ✅ Admin |
| DELETE | `/api/admin/instructors/:id` | Delete instructor | ✅ Admin |

---

## ⚠️ Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

---

**All admin routes are protected and require admin authentication!**

