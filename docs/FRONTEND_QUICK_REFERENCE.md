# 🚀 Frontend Quick Reference Card

## Base URL
```
http://localhost:3000/api
```

## 🔐 Auth Endpoints
```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me                    (requires token)
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/google|facebook|linkedin|apple
```

## 📚 Course Endpoints
```
GET    /api/courses                    ?page=1&limit=12&level=beginner&language=ar&isPublished=true&search=...
GET    /api/courses/:id
POST   /api/courses                    (requires token)
PUT    /api/courses/:id                (requires token)
DELETE /api/courses/:id                (requires token)
```

## 👨‍🏫 Instructor Endpoints
```
GET    /api/instructors                ?page=1&limit=12&search=...
GET    /api/instructors/:id            ?includeCourses=true
POST   /api/instructors                (requires token)
PUT    /api/instructors/:id            (requires token)
DELETE /api/instructors/:id            (requires token)
```

## 👤 Student Endpoints
```
GET    /api/student/enrollments        (requires token)
GET    /api/student/enrollments/:id    (requires token)
GET    /api/student/progress/:enrollmentId  (requires token)
GET    /api/student/certificates       (requires token)
```

## 🛠️ Admin Endpoints
```
GET    /api/admin/dashboard/stats      (admin only)
GET    /api/admin/analytics/revenue    ?period=monthly
GET    /api/admin/analytics/courses    (admin only)
GET    /api/admin/analytics/students   (admin only)
GET    /api/admin/analytics/funnels    (admin only)
GET    /api/admin/courses              ?page=1&limit=100
POST   /api/admin/courses              (admin only)
GET    /api/admin/courses/:id          (admin only)
PUT    /api/admin/courses/:id           (admin only)
DELETE /api/admin/courses/:id           (admin only)
GET    /api/admin/instructors          ?page=1&limit=100
POST   /api/admin/instructors           (admin only)
GET    /api/admin/instructors/:id      (admin only)
PUT    /api/admin/instructors/:id       (admin only)
DELETE /api/admin/instructors/:id       (admin only)
GET    /api/admin/users                ?page=1&limit=100
GET    /api/admin/users/:id             (admin only)
PUT    /api/admin/users/:id              (admin only)
DELETE /api/admin/users/:id              (admin only)
GET    /api/admin/orders                ?page=1&limit=100
GET    /api/admin/orders/:id             (admin only)
PUT    /api/admin/orders/:id             (admin only)
```

## 📝 Request Headers
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <token>'  // for authenticated endpoints
}
```

## 📦 Response Format
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* response data */ }
}
```

## ⚠️ Error Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ /* validation errors */ ]
}
```

## 🔑 Test Credentials
```
Admin: admin@elcanadi.com / Admin123!
User: user@example.com / Password123!
```

## 📚 Full Documentation
See `docs/FRONTEND_INTEGRATION_COMPLETE.md` for detailed examples and integration guides.

