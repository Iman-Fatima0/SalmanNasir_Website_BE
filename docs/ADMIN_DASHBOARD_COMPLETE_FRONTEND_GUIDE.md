# Complete Admin Dashboard - Frontend Integration Guide

## 🎯 Overview

This document provides **complete details** of everything the backend provides for the admin dashboard. Use this as your frontend development reference.

**Base URL:** `http://localhost:3000/api/admin`  
**All routes require:** `Authorization: Bearer <jwt-token>`

---

## 📊 1. DASHBOARD STATISTICS

### GET `/api/admin/dashboard/stats`

**What it does:**
- Returns overview statistics for the admin dashboard
- Calculates totals: users, courses, instructors, orders, revenue
- Gets the 10 most recent orders with user and product details

**Request:**
```javascript
GET /api/admin/dashboard/stats
Headers: { Authorization: 'Bearer <token>' }
```

**Response:**
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalUsers": 150,
    "totalCourses": 25,
    "totalInstructors": 12,
    "totalOrders": 340,
    "totalRevenue": 85420.50,
    "recentOrders": [
      {
        "id": "uuid",
        "amount": "299.99",
        "currency": "USD",
        "status": "completed",
        "createdAt": "2024-01-15T10:30:00Z",
        "user": {
          "id": "uuid",
          "email": "student@example.com",
          "firstName": "John",
          "lastName": "Doe"
        },
        "product": {
          "id": "uuid",
          "title": "Complete Arabic Course",
          "price": "299.99"
        }
      }
    ]
  }
}
```

**Frontend Usage:**
- Display stats cards: Total Users, Total Courses, Total Instructors, Total Orders, Total Revenue
- Show recent orders table/list
- Use for dashboard overview page

---

## 👥 2. USER MANAGEMENT

### 2.1 GET `/api/admin/users`

**What it does:**
- Lists all users with pagination
- Supports search (email, firstName, lastName)
- Filters by active/inactive status
- Returns pagination metadata

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10, max: 100) - Items per page
- `search` (string, optional) - Search in email, firstName, lastName
- `isActive` (boolean, optional) - Filter by active status (true/false)

**Request:**
```javascript
GET /api/admin/users?page=1&limit=20&search=john&isActive=true
```

**Response:**
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
        "status": "ACTIVE",
        "role": "user",
        "profileImage": "https://...",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    }
  }
}
```

**Frontend Usage:**
- User list table with pagination
- Search bar for finding users
- Filter toggle for active/inactive users
- Edit/Delete buttons per user

---

### 2.2 GET `/api/admin/users/:id`

**What it does:**
- Gets detailed information for a specific user
- Excludes sensitive fields (password, tokens)

**Request:**
```javascript
GET /api/admin/users/uuid-here
```

**Response:**
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
      "status": "ACTIVE",
      "role": "user",
      "profileImage": "https://...",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

**Frontend Usage:**
- User detail/edit page
- Modal for viewing user information
- Pre-fill form for editing

---

### 2.3 PUT `/api/admin/users/:id`

**What it does:**
- Updates user information
- Cannot update password (password changes use separate endpoint)
- Can update: firstName, lastName, phone, isActive, isEmailVerified, status, role

**Request:**
```javascript
PUT /api/admin/users/uuid-here
Body: {
  "firstName": "Updated Name",
  "lastName": "Updated Last",
  "isActive": false,
  "status": "SUSPENDED",
  "isEmailVerified": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": { /* updated user object */ }
  }
}
```

**Frontend Usage:**
- Edit user form
- Suspend/activate user toggle
- Update user details

---

### 2.4 DELETE `/api/admin/users/:id`

**What it does:**
- Soft deletes a user (deactivates account)
- Sets `isActive: false` and `status: 'SUSPENDED'`
- Does NOT permanently delete from database

**Request:**
```javascript
DELETE /api/admin/users/uuid-here
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null
}
```

**Frontend Usage:**
- Delete button in user list
- Confirmation dialog before deletion
- Refresh user list after deletion

---

## 📦 3. ORDER MANAGEMENT

### 3.1 GET `/api/admin/orders`

**What it does:**
- Lists all orders with pagination
- Filters by order status
- Searches by user email/name
- Includes user, product, and course information

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)
- `status` (string, optional) - Filter: `pending`, `completed`, `cancelled`, `refunded`
- `search` (string, optional) - Search in user email, firstName, lastName

**Request:**
```javascript
GET /api/admin/orders?page=1&limit=20&status=completed&search=john
```

**Response:**
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
        "notes": "Payment confirmed",
        "createdAt": "2024-01-15T10:30:00Z",
        "user": {
          "id": "uuid",
          "email": "student@example.com",
          "firstName": "John",
          "lastName": "Doe"
        },
        "product": {
          "id": "uuid",
          "title": "Complete Arabic Course",
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
      "total": 340,
      "page": 1,
      "limit": 20,
      "totalPages": 17
    }
  }
}
```

**Frontend Usage:**
- Orders table/list
- Status filter dropdown
- Search by customer name/email
- View order details button
- Update status button

---

### 3.2 GET `/api/admin/orders/:id`

**What it does:**
- Gets complete order details including:
  - Full user information
  - Full product information
  - Full course information with instructors

**Request:**
```javascript
GET /api/admin/orders/uuid-here
```

**Response:**
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
      "paymentId": "pay_123",
      "transactionId": "txn_123",
      "notes": "Customer requested invoice",
      "createdAt": "2024-01-15T10:30:00Z",
      "user": {
        "id": "uuid",
        "email": "student@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "phone": "+1234567890"
      },
      "product": {
        "id": "uuid",
        "title": "Complete Arabic Course",
        "subtitle": "Master Arabic in 30 days",
        "description": "...",
        "price": "299.99",
        "currency": "USD"
      },
      "course": {
        "id": "uuid",
        "level": "Beginner to Intermediate",
        "language": "Arabic",
        "instructors": [
          {
            "id": "uuid",
            "firstName": "Dr. Ahmed",
            "lastName": "Al-Saud",
            "title": "Professor",
            "CourseInstructor": {
              "role": "primary"
            }
          }
        ]
      }
    }
  }
}
```

**Frontend Usage:**
- Order detail page/modal
- View full order information
- Customer details
- Course and instructor information

---

### 3.3 PUT `/api/admin/orders/:id/status`

**What it does:**
- Updates order status
- Valid statuses: `pending`, `completed`, `cancelled`, `refunded`
- Optionally adds notes to the order

**Request:**
```javascript
PUT /api/admin/orders/uuid-here/status
Body: {
  "status": "completed",
  "notes": "Payment confirmed via bank transfer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "order": { /* updated order object */ }
  }
}
```

**Frontend Usage:**
- Status dropdown in order list
- Status update form in order detail page
- Notes textarea for admin comments
- Update button with confirmation

---

## 📚 4. COURSE MANAGEMENT (Admin)

**Note:** These endpoints are admin-only. Regular course listing uses `/api/courses` (public endpoint).

### 4.1 POST `/api/admin/courses`

**What it does:**
- Creates a new course with full details
- Creates product, course, chapters, lessons, and assigns instructors
- Handles nested course structure (product → course → chapters → lessons)

**Request:**
```javascript
POST /api/admin/courses
Body: {
  // Option 1: Link to existing product
  "productId": "uuid-of-existing-product",
  
  // Option 2: Create new product (if productId not provided)
  "title": "New Arabic Course",
  "subtitle": "Advanced Level",
  "description": "Complete course description...",
  "price": 199.99,
  "currency": "USD",
  
  // Course details
  "language": "Arabic",
  "level": "Advanced",
  "thumbnailUrl": "https://...",
  
  // Nested chapters and lessons
  "chapters": [
    {
      "title": "Chapter 1: Introduction",
      "description": "Chapter description",
      "order": 1,
      "lessons": [
        {
          "title": "Lesson 1: Basics",
          "description": "Lesson description",
          "order": 1,
          "videoUrl": "https://...",
          "durationMinutes": 15,
          "isPreview": true
        }
      ]
    }
  ],
  
  // Assign instructors
  "instructorIds": ["instructor-uuid-1", "instructor-uuid-2"]
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
    "totalChapters": 1,
    "totalLessons": 1,
    "product": { /* product object */ },
    "chapters": [ /* chapters with lessons */ ],
    "instructors": [ /* instructor objects */ ]
  }
}
```

**Frontend Usage:**
- Course creation form with:
  - Product information fields
  - Course details fields
  - Chapter/lesson builder (nested structure)
  - Instructor selection (multi-select)
  - Preview toggle for lessons
- Form validation
- Submit button

---

### 4.2 PUT `/api/admin/courses/:id`

**What it does:**
- Updates course information
- Can update product details, course details, publish status

**Request:**
```javascript
PUT /api/admin/courses/uuid-here
Body: {
  "title": "Updated Course Title",
  "price": 249.99,
  "isPublished": true,
  "level": "Intermediate"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": { /* updated course object */ }
}
```

**Frontend Usage:**
- Edit course form
- Pre-fill with existing course data
- Update button

---

### 4.3 DELETE `/api/admin/courses/:id`

**What it does:**
- Deletes a course permanently
- Cascades to chapters and lessons
- Does NOT delete the product (product can have multiple courses)

**Request:**
```javascript
DELETE /api/admin/courses/uuid-here
```

**Response:**
```json
{
  "success": true,
  "message": "Course deleted successfully",
  "data": null
}
```

**Frontend Usage:**
- Delete button in course list
- Confirmation dialog ("Are you sure? This will delete the course and all its content.")
- Refresh course list after deletion

---

## 👨‍🏫 5. INSTRUCTOR MANAGEMENT (Admin)

### 5.1 POST `/api/admin/instructors`

**What it does:**
- Creates a new instructor profile

**Request:**
```javascript
POST /api/admin/instructors
Body: {
  "firstName": "Dr. Ahmed",
  "lastName": "Al-Saud",
  "title": "Professor of Arabic Literature",
  "bio": "Dr. Ahmed Al-Saud is an expert in...",
  "avatarUrl": "https://...",
  "linkedinUrl": "https://linkedin.com/...",
  "twitterUrl": "https://twitter.com/...",
  "websiteUrl": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Instructor created successfully",
  "data": {
    "id": "uuid",
    "firstName": "Dr. Ahmed",
    "lastName": "Al-Saud",
    "title": "Professor of Arabic Literature",
    "bio": "...",
    "avatarUrl": "https://...",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Frontend Usage:**
- Instructor creation form
- Fields: name, title, bio, avatar upload, social links
- Submit button

---

### 5.2 PUT `/api/admin/instructors/:id`

**What it does:**
- Updates instructor information

**Request:**
```javascript
PUT /api/admin/instructors/uuid-here
Body: {
  "title": "Updated Title",
  "bio": "Updated bio...",
  "isActive": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Instructor updated successfully",
  "data": { /* updated instructor object */ }
}
```

**Frontend Usage:**
- Edit instructor form
- Pre-fill with existing data
- Update button

---

### 5.3 DELETE `/api/admin/instructors/:id`

**What it does:**
- Soft deletes instructor (sets `isActive: false`)
- Does NOT remove instructor from existing courses

**Request:**
```javascript
DELETE /api/admin/instructors/uuid-here
```

**Response:**
```json
{
  "success": true,
  "message": "Instructor deleted successfully",
  "data": null
}
```

**Frontend Usage:**
- Delete button in instructor list
- Confirmation dialog
- Refresh list after deletion

---

## 🔒 6. AUTHENTICATION & AUTHORIZATION

### Required Headers
```javascript
{
  "Authorization": "Bearer <jwt-token>",
  "Content-Type": "application/json"
}
```

### How to Get Token
1. User logs in via `/api/auth/login`
2. Response contains `token` in `data.token`
3. Store token (localStorage, sessionStorage, etc.)
4. Include in all admin API requests

### Error Responses

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Authentication required"
}
```

**403 Forbidden (Not Admin):**
```json
{
  "success": false,
  "message": "Admin access required"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**400 Bad Request (Validation Error):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["field1 is required", "field2 must be a number"]
}
```

---

## 📋 7. COMPLETE API ENDPOINT SUMMARY

| Feature | Method | Endpoint | Purpose |
|---------|--------|----------|---------|
| **Dashboard** |
| Stats | GET | `/api/admin/dashboard/stats` | Get dashboard statistics |
| **Users** |
| List | GET | `/api/admin/users` | List all users (paginated, searchable) |
| Detail | GET | `/api/admin/users/:id` | Get user details |
| Update | PUT | `/api/admin/users/:id` | Update user |
| Delete | DELETE | `/api/admin/users/:id` | Deactivate user |
| **Orders** |
| List | GET | `/api/admin/orders` | List all orders (paginated, filterable) |
| Detail | GET | `/api/admin/orders/:id` | Get order details |
| Update Status | PUT | `/api/admin/orders/:id/status` | Update order status |
| **Courses** |
| Create | POST | `/api/admin/courses` | Create course with full structure |
| Update | PUT | `/api/admin/courses/:id` | Update course |
| Delete | DELETE | `/api/admin/courses/:id` | Delete course |
| **Instructors** |
| Create | POST | `/api/admin/instructors` | Create instructor |
| Update | PUT | `/api/admin/instructors/:id` | Update instructor |
| Delete | DELETE | `/api/admin/instructors/:id` | Delete instructor |

---

## 🎨 8. FRONTEND IMPLEMENTATION RECOMMENDATIONS

### Dashboard Page Structure

```
Admin Dashboard
├── Stats Cards Row
│   ├── Total Users Card
│   ├── Total Courses Card
│   ├── Total Instructors Card
│   ├── Total Orders Card
│   └── Total Revenue Card
├── Recent Orders Table
│   ├── Order ID
│   ├── Customer Name
│   ├── Product/Course
│   ├── Amount
│   ├── Status
│   └── Date
└── Quick Actions
    ├── Create Course Button
    ├── Create Instructor Button
    └── View All Orders Button
```

### Navigation Structure

```
Admin Dashboard
├── Dashboard (Overview)
├── Users
│   ├── List Users
│   └── Create/Edit User
├── Courses
│   ├── List Courses
│   ├── Create Course
│   └── Edit Course
├── Instructors
│   ├── List Instructors
│   ├── Create Instructor
│   └── Edit Instructor
└── Orders
    ├── List Orders
    └── Order Details
```

### Data Flow Example

```javascript
// 1. On Dashboard Load
useEffect(() => {
  const loadDashboard = async () => {
    const stats = await fetch('/api/admin/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());
    
    setDashboardData(stats.data);
  };
  loadDashboard();
}, []);

// 2. User Management
const loadUsers = async (page, search, isActive) => {
  const params = new URLSearchParams({
    page,
    limit: 20,
    ...(search && { search }),
    ...(isActive !== undefined && { isActive })
  });
  
  const response = await fetch(`/api/admin/users?${params}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
};

// 3. Update Order Status
const updateOrderStatus = async (orderId, status, notes) => {
  const response = await fetch(`/api/admin/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status, notes })
  });
  return response.json();
};
```

---

## ✅ 9. CHECKLIST FOR FRONTEND DEVELOPMENT

### Dashboard Page
- [ ] Display stats cards (users, courses, instructors, orders, revenue)
- [ ] Show recent orders table
- [ ] Auto-refresh stats every 30 seconds (optional)

### User Management
- [ ] User list table with pagination
- [ ] Search bar
- [ ] Active/Inactive filter
- [ ] View user details modal/page
- [ ] Edit user form
- [ ] Delete user with confirmation

### Order Management
- [ ] Orders table with pagination
- [ ] Status filter dropdown
- [ ] Search by customer
- [ ] View order details modal/page
- [ ] Update order status form
- [ ] Status change confirmation

### Course Management
- [ ] Course list (use `/api/courses` for listing)
- [ ] Create course form (nested chapters/lessons builder)
- [ ] Edit course form
- [ ] Delete course with confirmation
- [ ] Publish/Unpublish toggle

### Instructor Management
- [ ] Instructor list (use `/api/instructors` for listing)
- [ ] Create instructor form
- [ ] Edit instructor form
- [ ] Delete instructor with confirmation

### Common UI Elements
- [ ] Loading states
- [ ] Error handling/display
- [ ] Success notifications
- [ ] Confirmation dialogs
- [ ] Form validation
- [ ] Pagination controls

---

## 🚀 Quick Start Code

### Admin API Service Class

```javascript
class AdminApi {
  constructor() {
    this.baseURL = 'http://localhost:3000/api/admin';
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: { ...this.getHeaders(), ...options.headers }
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  }

  // Dashboard
  getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // Users
  getUsers(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/users?${params}`);
  }

  getUser(id) {
    return this.request(`/users/${id}`);
  }

  updateUser(id, data) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  deleteUser(id) {
    return this.request(`/users/${id}`, { method: 'DELETE' });
  }

  // Orders
  getOrders(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/orders?${params}`);
  }

  getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  updateOrderStatus(id, status, notes) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes })
    });
  }

  // Courses
  createCourse(data) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  updateCourse(id, data) {
    return this.request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  deleteCourse(id) {
    return this.request(`/courses/${id}`, { method: 'DELETE' });
  }

  // Instructors
  createInstructor(data) {
    return this.request('/instructors', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  updateInstructor(id, data) {
    return this.request(`/instructors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  deleteInstructor(id) {
    return this.request(`/instructors/${id}`, { method: 'DELETE' });
  }
}

export default new AdminApi();
```

---

**Use this guide to build your complete admin dashboard frontend!** All endpoints are ready and fully functional.

