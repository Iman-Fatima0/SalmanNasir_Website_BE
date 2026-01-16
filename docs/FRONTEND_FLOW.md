# Frontend User Flow & URL Structure

## 🎯 Complete Frontend Flow

### **Public Flow (No Login Required)**

```
┌─────────────────┐
│   Homepage (/)  │
└────────┬────────┘
         │
         ├──→ Browse Courses (/courses)
         │    ├──→ Course Details (/courses/:id)
         │    └──→ Filter by: level, language, search
         │
         ├──→ Browse Instructors (/instructors)
         │    └──→ Instructor Profile (/instructors/:id)
         │
         └──→ Login/Signup
              ├──→ Sign Up (/signup)
              ├──→ Login (/login)
              └──→ OAuth Login (Google/Facebook/LinkedIn/Apple)
```

### **Authentication Flow**

```
┌──────────────────────┐
│   User Wants Access  │
└──────────┬───────────┘
           │
    ┌──────┴──────┐
    │             │
Sign Up        Login
    │             │
    ▼             ▼
POST /api/auth/signup  POST /api/auth/login
    │             │
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │ Get Token   │
    │ Store Token │
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │  Dashboard  │
    └─────────────┘
```

### **OAuth Flow**

```
User clicks "Sign in with Google"
         │
         ▼
Redirect to: /api/auth/google
         │
         ▼
Google OAuth Screen
         │
         ▼
Callback: /api/auth/google/callback
         │
         ▼
Backend redirects to:
/auth/callback?token=xxx&user=xxx
         │
         ▼
Frontend extracts token
         │
         ▼
Store token → Redirect to Dashboard
```

---

## 📋 Complete URL List

### **Frontend Routes (Your Frontend App)**

| Route | Description | API Calls |
|-------|-------------|-----------|
| `/` | Homepage | `GET /api/courses?limit=6&isPublished=true` |
| `/courses` | Browse all courses | `GET /api/courses?page=1&limit=12` |
| `/courses/:id` | Course details | `GET /api/courses/:id` |
| `/instructors` | Browse instructors | `GET /api/instructors?page=1&limit=12` |
| `/instructors/:id` | Instructor profile | `GET /api/instructors/:id?includeCourses=true` |
| `/login` | Login page | `POST /api/auth/login` |
| `/signup` | Sign up page | `POST /api/auth/signup` |
| `/forgot-password` | Forgot password | `POST /api/auth/forgot-password` |
| `/reset-password` | Reset password | `POST /api/auth/reset-password` |
| `/auth/callback` | OAuth callback handler | Extract token from URL params |
| `/dashboard` | User dashboard | `GET /api/auth/me` |
| `/admin/courses` | Admin: Manage courses | `GET /api/courses`, `POST /api/courses` |
| `/admin/instructors` | Admin: Manage instructors | `GET /api/instructors`, `POST /api/instructors` |

### **Backend API Endpoints (Your Backend)**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **Authentication** |
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user (requires token) |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/auth/google` | Google OAuth |
| GET | `/api/auth/facebook` | Facebook OAuth |
| GET | `/api/auth/linkedin` | LinkedIn OAuth |
| GET | `/api/auth/apple` | Apple OAuth |
| **Courses** |
| POST | `/api/courses` | Create course |
| GET | `/api/courses` | List courses (with filters) |
| GET | `/api/courses/:id` | Get course details |
| PUT | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Delete course |
| **Instructors** |
| POST | `/api/instructors` | Create instructor |
| GET | `/api/instructors` | List instructors |
| GET | `/api/instructors/:id` | Get instructor details |
| PUT | `/api/instructors/:id` | Update instructor |
| DELETE | `/api/instructors/:id` | Delete instructor |
| **Health** |
| GET | `/health` | Health check |

---

## 🔄 Typical User Journey

### **Scenario 1: New User Browsing Courses**

```
1. Visit Homepage (/)
   → API: GET /api/courses?limit=6&isPublished=true
   
2. Click "Browse All Courses"
   → Navigate to /courses
   → API: GET /api/courses?page=1&limit=12
   
3. Click on a course
   → Navigate to /courses/:id
   → API: GET /api/courses/:id
   
4. Click "Enroll" or "Sign Up"
   → Navigate to /signup
   → API: POST /api/auth/signup
   
5. After signup
   → Store token
   → Navigate to /dashboard
```

### **Scenario 2: User Login**

```
1. Visit /login
2. Enter credentials
   → API: POST /api/auth/login
3. Receive token
   → Store in localStorage
4. Redirect to /dashboard
   → API: GET /api/auth/me (to get user data)
```

### **Scenario 3: OAuth Login**

```
1. Click "Sign in with Google"
   → Redirect to: http://localhost:3000/api/auth/google
2. User authorizes on Google
3. Google redirects to: /api/auth/google/callback
4. Backend processes → Redirects to:
   http://localhost:3001/auth/callback?token=xxx&user=xxx
5. Frontend extracts token
   → Store in localStorage
   → Redirect to /dashboard
```

### **Scenario 4: Admin Creating Course**

```
1. Login as admin
2. Navigate to /admin/courses/create
3. Fill course form
4. Submit
   → API: POST /api/courses
   → Body: { title, description, price, chapters, ... }
5. Success → Redirect to /admin/courses
```

---

## 🛠️ Frontend Implementation Checklist

### **Phase 1: Setup**
- [ ] Choose framework (React/Vue/Next.js)
- [ ] Set up project structure
- [ ] Configure API client (Axios/Fetch)
- [ ] Set up routing
- [ ] Configure environment variables

### **Phase 2: Authentication**
- [ ] Login page
- [ ] Signup page
- [ ] Forgot password page
- [ ] Reset password page
- [ ] OAuth callback handler
- [ ] Token storage (localStorage/cookies)
- [ ] Protected route wrapper
- [ ] Auth context/state management

### **Phase 3: Public Pages**
- [ ] Homepage
- [ ] Course listing page
- [ ] Course details page
- [ ] Instructor listing page
- [ ] Instructor profile page

### **Phase 4: Authenticated Pages**
- [ ] User dashboard
- [ ] User profile
- [ ] Enrolled courses list

### **Phase 5: Admin Pages (Optional)**
- [ ] Course management
- [ ] Instructor management
- [ ] User management (if needed)

### **Phase 6: Features**
- [ ] Search functionality
- [ ] Filters (level, language)
- [ ] Pagination
- [ ] Loading states
- [ ] Error handling
- [ ] Responsive design

---

## 📝 Environment Variables for Frontend

Create a `.env` file in your frontend project:

```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_BACKEND_URL=http://localhost:3000
REACT_APP_FRONTEND_URL=http://localhost:3001
```

---

## 🔗 Important URLs to Remember

### **Backend URLs**
- API Base: `http://localhost:3000/api`
- Health Check: `http://localhost:3000/health`

### **OAuth Redirect URLs** (in your OAuth provider settings)
- Google Callback: `http://localhost:3000/api/auth/google/callback`
- Facebook Callback: `http://localhost:3000/api/auth/facebook/callback`
- LinkedIn Callback: `http://localhost:3000/api/auth/linkedin/callback`
- Apple Callback: `http://localhost:3000/api/auth/apple/callback`

### **Frontend OAuth Callback**
- OAuth Success: `http://localhost:3001/auth/callback` (or your frontend URL)

---

## 💡 Quick Start Example

### **1. Test API Connection**
```javascript
fetch('http://localhost:3000/health')
  .then(res => res.json())
  .then(data => console.log(data));
```

### **2. Get All Courses**
```javascript
fetch('http://localhost:3000/api/courses?page=1&limit=10')
  .then(res => res.json())
  .then(data => {
    console.log('Courses:', data.data.courses);
    console.log('Pagination:', data.data.pagination);
  });
```

### **3. Login and Store Token**
```javascript
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      console.log('Logged in!', data.data.user);
    }
  });
```

---

## 📚 Documentation Files

- **`FRONTEND_GUIDE.md`** - Complete frontend development guide
- **`API_ENDPOINTS_QUICK_REFERENCE.md`** - Quick API reference
- **`COURSES_API.md`** - Detailed course API documentation
- **`API.md`** - Authentication API documentation

All documentation is in the `docs/` folder.

