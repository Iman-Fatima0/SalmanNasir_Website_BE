# Admin Dashboard - Complete Guide

## 🎯 Overview

The admin dashboard provides complete CRUD operations for managing:
- **Users** - View, update, delete users
- **Courses** - Create, update, delete courses with chapters and lessons
- **Instructors** - Create, update, delete instructors
- **Orders** - View and manage orders, update order status
- **Dashboard Statistics** - View overall website statistics

---

## 🔐 Admin Access

### Admin Credentials
- **Email:** `admin@elcanadi.com`
- **Password:** `Admin123!`

### Admin Check
Currently, admin access is determined by email (`admin@elcanadi.com`). You can extend this by adding a `role` field to the User model.

---

## 📊 Dashboard Features

### 1. Dashboard Statistics
- Total Users
- Total Courses
- Total Instructors
- Total Orders
- Total Revenue
- Recent Orders (last 10)

### 2. User Management
- View all users with pagination
- Search users by email/name
- Filter by active status
- View user details
- Update user information
- Delete/deactivate users

### 3. Course Management
- Create courses with:
  - Product information (title, price, description)
  - Course details (level, language, thumbnail)
  - Chapters with lessons
  - Instructor assignments
- Update course information
- Delete courses
- Publish/unpublish courses

### 4. Instructor Management
- Create instructors with:
  - Personal information
  - Bio and title
  - Social media links
  - Avatar image
- Update instructor information
- Delete/deactivate instructors

### 5. Order Management
- View all orders with pagination
- Filter by order status
- Search orders by user
- View order details
- Update order status:
  - `pending` - Order placed, payment pending
  - `completed` - Payment confirmed
  - `cancelled` - Order cancelled
  - `refunded` - Order refunded
- Add notes to orders

---

## 🚀 Frontend Implementation Guide

### 1. Admin Dashboard Layout

```jsx
// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import AdminApi from './services/adminApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await AdminApi.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Courses</h3>
          <p>{stats.totalCourses}</p>
        </div>
        <div className="stat-card">
          <h3>Total Instructors</h3>
          <p>{stats.totalInstructors}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${stats.totalRevenue}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="admin-nav">
        <a href="/admin/users">Users</a>
        <a href="/admin/courses">Courses</a>
        <a href="/admin/instructors">Instructors</a>
        <a href="/admin/orders">Orders</a>
      </nav>
    </div>
  );
};

export default AdminDashboard;
```

### 2. Course Management Component

```jsx
// AdminCourses.jsx
import React, { useState, useEffect } from 'react';
import AdminApi from './services/adminApi';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // Use regular courses API for listing
      const response = await fetch('http://localhost:3000/api/courses');
      const result = await response.json();
      if (result.success) {
        setCourses(result.data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCreateCourse = async (courseData) => {
    try {
      await AdminApi.createCourse(courseData);
      setShowForm(false);
      fetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleUpdateCourse = async (id, courseData) => {
    try {
      await AdminApi.updateCourse(id, courseData);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await AdminApi.deleteCourse(id);
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  return (
    <div className="admin-courses">
      <div className="header">
        <h2>Course Management</h2>
        <button onClick={() => setShowForm(true)}>Create New Course</button>
      </div>

      {showForm && (
        <CourseForm
          onSubmit={handleCreateCourse}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingCourse && (
        <CourseForm
          course={editingCourse}
          onSubmit={(data) => handleUpdateCourse(editingCourse.id, data)}
          onCancel={() => setEditingCourse(null)}
        />
      )}

      <div className="courses-list">
        {courses.map((course) => {
          const product = course.product || {};
          return (
            <div key={course.id} className="course-card">
              <h3>{product.title}</h3>
              <p>{product.subtitle}</p>
              <p>Price: ${product.price}</p>
              <p>Status: {product.isPublished ? 'Published' : 'Draft'}</p>
              <div className="actions">
                <button onClick={() => setEditingCourse(course)}>Edit</button>
                <button onClick={() => handleDeleteCourse(course.id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminCourses;
```

### 3. Order Management Component

```jsx
// AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import AdminApi from './services/adminApi';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ status: '', page: 1 });

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      const data = await AdminApi.getOrders(filters);
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await AdminApi.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="admin-orders">
      <h2>Order Management</h2>

      {/* Filters */}
      <div className="filters">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Orders Table */}
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id.substring(0, 8)}...</td>
              <td>
                {order.user?.firstName} {order.user?.lastName}
                <br />
                <small>{order.user?.email}</small>
              </td>
              <td>{order.product?.title}</td>
              <td>${order.amount}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => viewOrderDetails(order.id)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination && (
        <div className="pagination">
          <button
            disabled={pagination.page === 1}
            onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page === pagination.totalPages}
            onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
```

---

## 📋 Complete Admin Routes Summary

| Feature | Route | Method | Purpose |
|---------|-------|--------|---------|
| **Dashboard** |
| Statistics | `/api/admin/dashboard/stats` | GET | Get dashboard stats |
| **Users** |
| List Users | `/api/admin/users` | GET | Get all users |
| User Details | `/api/admin/users/:id` | GET | Get user by ID |
| Update User | `/api/admin/users/:id` | PUT | Update user |
| Delete User | `/api/admin/users/:id` | DELETE | Delete user |
| **Orders** |
| List Orders | `/api/admin/orders` | GET | Get all orders |
| Order Details | `/api/admin/orders/:id` | GET | Get order by ID |
| Update Status | `/api/admin/orders/:id/status` | PUT | Update order status |
| **Courses** |
| Create Course | `/api/admin/courses` | POST | Create new course |
| Update Course | `/api/admin/courses/:id` | PUT | Update course |
| Delete Course | `/api/admin/courses/:id` | DELETE | Delete course |
| **Instructors** |
| Create Instructor | `/api/admin/instructors` | POST | Create instructor |
| Update Instructor | `/api/admin/instructors/:id` | PUT | Update instructor |
| Delete Instructor | `/api/admin/instructors/:id` | DELETE | Delete instructor |

---

## 🎨 Recommended Admin Dashboard Layout

```
┌─────────────────────────────────────────────────┐
│  Admin Dashboard                                │
├─────────────────────────────────────────────────┤
│  [Stats Cards: Users, Courses, Orders, Revenue]│
├─────────────────────────────────────────────────┤
│  Navigation:                                     │
│  [Dashboard] [Users] [Courses] [Instructors]    │
│  [Orders]                                       │
├─────────────────────────────────────────────────┤
│  Content Area (changes based on selection)      │
│  - Users List/Form                              │
│  - Courses List/Form                            │
│  - Instructors List/Form                        │
│  - Orders Table                                 │
└─────────────────────────────────────────────────┘
```

---

## ✅ Testing Admin Dashboard

1. **Login as Admin:**
   - Email: `admin@elcanadi.com`
   - Password: `Admin123!`

2. **Access Admin Routes:**
   - All routes under `/api/admin/*` require admin authentication
   - Use the JWT token from login response

3. **Test Features:**
   - View dashboard statistics
   - Manage users
   - Create/update/delete courses
   - Create/update/delete instructors
   - View and manage orders

---

**The admin dashboard is now fully functional with complete CRUD operations!**

