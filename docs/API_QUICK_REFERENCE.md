# API Quick Reference Card

## 🔗 Base URL
```
http://localhost:3000/api
```

## 📋 All Routes at a Glance

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/signup` | Register user | ❌ |
| POST | `/login` | Login user | ❌ |
| GET | `/me` | Get current user | ✅ |
| POST | `/forgot-password` | Request reset | ❌ |
| POST | `/reset-password` | Reset password | ❌ |
| GET | `/google` | Google OAuth | ❌ |
| GET | `/facebook` | Facebook OAuth | ❌ |
| GET | `/linkedin` | LinkedIn OAuth | ❌ |
| GET | `/apple` | Apple OAuth | ❌ |

### 📚 Courses (`/api/courses`)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/` | List all courses | ❌ |
| GET | `/:id` | Get course details | ❌ |
| POST | `/` | Create course | ⚠️ |
| PUT | `/:id` | Update course | ⚠️ |
| DELETE | `/:id` | Delete course | ⚠️ |

**Query Params for GET `/`:**
- `page`, `limit`, `search`, `level`, `language`, `isPublished`

### 👨‍🏫 Instructors (`/api/instructors`)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/` | List all instructors | ❌ |
| GET | `/:id` | Get instructor details | ❌ |
| POST | `/` | Create instructor | ⚠️ |
| PUT | `/:id` | Update instructor | ⚠️ |
| DELETE | `/:id` | Delete instructor | ⚠️ |

**Query Params for GET `/`:**
- `page`, `limit`, `search`

**Query Params for GET `/:id`:**
- `includeCourses=true` (optional)

### 🏥 Health Check

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Check API status |

---

## 🚀 Quick Code Examples

### Login
```javascript
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
```

### Get Courses
```javascript
fetch('http://localhost:3000/api/courses?page=1&limit=10&isPublished=true')
```

### Get Course Details
```javascript
fetch('http://localhost:3000/api/courses/:id')
```

### Get Current User
```javascript
fetch('http://localhost:3000/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

---

## 📦 Response Format

**Success:**
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* response data */ }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ /* validation errors */ ]
}
```

---

## 🔑 Authentication Header

```
Authorization: Bearer <your-jwt-token>
```

---

**For detailed documentation, see `COMPLETE_API_DOCUMENTATION.md`**

