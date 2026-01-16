# Frontend Development Guide

## Backend Base URL
```
http://localhost:3000
```

## Complete API Endpoints Reference

### 🔐 Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password with token | No |
| GET | `/api/auth/google` | Google OAuth login | No |
| GET | `/api/auth/facebook` | Facebook OAuth login | No |
| GET | `/api/auth/linkedin` | LinkedIn OAuth login | No |
| GET | `/api/auth/apple` | Apple OAuth login | No |

### 📚 Course Endpoints (`/api/courses`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/api/courses` | Create new course | Yes* |
| GET | `/api/courses` | List all courses (with filters) | No |
| GET | `/api/courses/:id` | Get course by ID | No |
| PUT | `/api/courses/:id` | Update course | Yes* |
| DELETE | `/api/courses/:id` | Delete course | Yes* |

### 👨‍🏫 Instructor Endpoints (`/api/instructors`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/api/instructors` | Create instructor | Yes* |
| GET | `/api/instructors` | List all instructors | No |
| GET | `/api/instructors/:id` | Get instructor by ID | No |
| PUT | `/api/instructors/:id` | Update instructor | Yes* |
| DELETE | `/api/instructors/:id` | Delete instructor | Yes* |

*Auth may be required based on your business logic (currently not enforced, but recommended)

---

## Frontend Flow & User Journey

### 1. **Public Pages (No Authentication)**

#### Homepage (`/`)
- Display featured courses
- Show popular instructors
- Call-to-action buttons (Sign Up / Login)

#### Browse Courses (`/courses`)
- List all published courses
- Filters: Level, Language, Search
- Pagination
- Course cards with: thumbnail, title, price, instructor, rating (if you add it)

#### Course Details (`/courses/:id`)
- Full course information
- Course description
- Chapters and lessons list
- Instructor profiles
- Enroll button (if not enrolled)
- Preview lessons (if `isPreview: true`)

#### Instructor Profile (`/instructors/:id`)
- Instructor bio and details
- List of courses they teach
- Social media links

#### Instructor List (`/instructors`)
- Grid/list of all instructors
- Search functionality

---

### 2. **Authentication Flow**

#### Sign Up (`/signup`)
```
User fills form → POST /api/auth/signup
  ↓
Success → Store token → Redirect to dashboard
  ↓
Error → Show validation errors
```

#### Login (`/login`)
```
User fills form → POST /api/auth/login
  ↓
Success → Store token in localStorage/cookies → Redirect
  ↓
Error → Show error message
```

#### OAuth Login
```
User clicks "Sign in with Google" → Redirect to /api/auth/google
  ↓
User authorizes on Google → Callback to /api/auth/google/callback
  ↓
Backend redirects to: /auth/callback?token=xxx&user=xxx
  ↓
Frontend extracts token → Store → Redirect to dashboard
```

#### Forgot Password (`/forgot-password`)
```
User enters email → POST /api/auth/forgot-password
  ↓
Success message (don't reveal if email exists)
  ↓
User checks email → Clicks reset link
  ↓
Redirects to /reset-password?token=xxx
```

#### Reset Password (`/reset-password`)
```
User enters new password → POST /api/auth/reset-password
  ↓
Success → Auto-login → Redirect to dashboard
```

---

### 3. **Authenticated Pages**

#### User Dashboard (`/dashboard`)
- User profile information
- Enrolled courses
- Learning progress
- GET `/api/auth/me` to get user data

#### Course Management (Admin/Instructor)
- Create Course (`/admin/courses/create`)
- Edit Course (`/admin/courses/:id/edit`)
- Course List (`/admin/courses`)

#### Instructor Management (Admin)
- Create Instructor (`/admin/instructors/create`)
- Edit Instructor (`/admin/instructors/:id/edit`)
- Instructor List (`/admin/instructors`)

---

## Frontend Structure Recommendation

```
frontend/
├── src/
│   ├── api/              # API service layer
│   │   ├── auth.js       # Auth API calls
│   │   ├── courses.js    # Course API calls
│   │   └── instructors.js # Instructor API calls
│   ├── components/       # Reusable components
│   │   ├── CourseCard.js
│   │   ├── InstructorCard.js
│   │   ├── LessonList.js
│   │   └── ...
│   ├── pages/           # Page components
│   │   ├── Home.js
│   │   ├── Courses.js
│   │   ├── CourseDetail.js
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   └── ...
│   ├── context/         # React Context (if using React)
│   │   └── AuthContext.js
│   ├── hooks/           # Custom hooks
│   │   └── useAuth.js
│   ├── utils/           # Utilities
│   │   ├── api.js       # Axios/fetch config
│   │   └── storage.js   # Token storage
│   └── App.js
└── package.json
```

---

## API Integration Examples

### 1. API Service Setup (Axios Example)

```javascript
// src/utils/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
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

export default api;
```

### 2. Authentication Service

```javascript
// src/api/auth.js
import api from '../utils/api';

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => 
    api.post('/auth/reset-password', { token, password }),
  
  // OAuth URLs (redirect user to these)
  googleLogin: () => window.location.href = `${API_BASE_URL}/auth/google`,
  facebookLogin: () => window.location.href = `${API_BASE_URL}/auth/facebook`,
  linkedinLogin: () => window.location.href = `${API_BASE_URL}/auth/linkedin`,
  appleLogin: () => window.location.href = `${API_BASE_URL}/auth/apple`,
};
```

### 3. Course Service

```javascript
// src/api/courses.js
import api from '../utils/api';

export const coursesAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};
```

### 4. Instructor Service

```javascript
// src/api/instructors.js
import api from '../utils/api';

export const instructorsAPI = {
  getAll: (params) => api.get('/instructors', { params }),
  getById: (id, includeCourses = false) => 
    api.get(`/instructors/${id}`, { params: { includeCourses } }),
  create: (data) => api.post('/instructors', data),
  update: (id, data) => api.put(`/instructors/${id}`, data),
  delete: (id) => api.delete(`/instructors/${id}`),
};
```

---

## Complete URL Reference

### Base URLs
```
Backend: http://localhost:3000
API Base: http://localhost:3000/api
```

### Full Endpoint URLs

#### Authentication
```
POST   http://localhost:3000/api/auth/signup
POST   http://localhost:3000/api/auth/login
GET    http://localhost:3000/api/auth/me
POST   http://localhost:3000/api/auth/forgot-password
POST   http://localhost:3000/api/auth/reset-password
GET    http://localhost:3000/api/auth/google
GET    http://localhost:3000/api/auth/google/callback
GET    http://localhost:3000/api/auth/facebook
GET    http://localhost:3000/api/auth/facebook/callback
GET    http://localhost:3000/api/auth/linkedin
GET    http://localhost:3000/api/auth/linkedin/callback
GET    http://localhost:3000/api/auth/apple
POST   http://localhost:3000/api/auth/apple/callback
```

#### Courses
```
POST   http://localhost:3000/api/courses
GET    http://localhost:3000/api/courses
GET    http://localhost:3000/api/courses?page=1&limit=10&level=beginner&language=ar
GET    http://localhost:3000/api/courses/:id
PUT    http://localhost:3000/api/courses/:id
DELETE http://localhost:3000/api/courses/:id
```

#### Instructors
```
POST   http://localhost:3000/api/instructors
GET    http://localhost:3000/api/instructors
GET    http://localhost:3000/api/instructors?page=1&limit=10&search=ali
GET    http://localhost:3000/api/instructors/:id
GET    http://localhost:3000/api/instructors/:id?includeCourses=true
PUT    http://localhost:3000/api/instructors/:id
DELETE http://localhost:3000/api/instructors/:id
```

#### Health Check
```
GET    http://localhost:3000/health
```

---

## Frontend Routes Structure

### Recommended Frontend Routes

```
/                           → Homepage
/courses                    → Browse all courses
/courses/:id                → Course details page
/instructors                → Browse instructors
/instructors/:id            → Instructor profile
/login                      → Login page
/signup                     → Sign up page
/forgot-password            → Forgot password
/reset-password             → Reset password (with token query param)
/auth/callback              → OAuth callback handler
/dashboard                  → User dashboard (protected)
/admin/courses              → Admin: Course management (protected)
/admin/courses/create       → Admin: Create course (protected)
/admin/courses/:id/edit     → Admin: Edit course (protected)
/admin/instructors           → Admin: Instructor management (protected)
/admin/instructors/create    → Admin: Create instructor (protected)
/admin/instructors/:id/edit → Admin: Edit instructor (protected)
```

---

## Example API Calls

### 1. User Signup
```javascript
const response = await fetch('http://localhost:3000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe'
  })
});
const data = await response.json();
// Store token: localStorage.setItem('token', data.data.token);
```

### 2. Get All Courses with Filters
```javascript
const response = await fetch(
  'http://localhost:3000/api/courses?page=1&limit=12&level=beginner&isPublished=true'
);
const data = await response.json();
// data.data.courses - array of courses
// data.data.pagination - pagination info
```

### 3. Get Course Details
```javascript
const response = await fetch(`http://localhost:3000/api/courses/${courseId}`);
const data = await response.json();
// data.data - full course with chapters, lessons, instructors
```

### 4. Create Course (Authenticated)
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:3000/api/courses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Arabic A1',
    description: 'Beginner Arabic course',
    price: 99.99,
    language: 'ar',
    level: 'beginner',
    chapters: [...]
  })
});
```

### 5. OAuth Login Flow
```javascript
// Redirect user to OAuth provider
window.location.href = 'http://localhost:3000/api/auth/google';

// Handle callback (on /auth/callback page)
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const user = JSON.parse(decodeURIComponent(urlParams.get('user')));
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
// Redirect to dashboard
```

---

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [  // Optional, for validation errors
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## Authentication Token Handling

1. **Store token after login/signup:**
   ```javascript
   localStorage.setItem('token', token);
   // or use cookies for better security
   ```

2. **Include token in requests:**
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```

3. **Check authentication:**
   ```javascript
   const token = localStorage.getItem('token');
   if (!token) {
     // Redirect to login
   }
   ```

4. **Handle token expiration:**
   - Check for 401 responses
   - Clear token and redirect to login

---

## Next Steps

1. **Choose Frontend Framework:**
   - React (recommended)
   - Vue.js
   - Next.js (for SSR)
   - Angular

2. **Set up API Client:**
   - Axios or Fetch API
   - Configure base URL
   - Add interceptors for auth

3. **Implement Authentication:**
   - Login/Signup forms
   - Token storage
   - Protected routes
   - Auth context/state management

4. **Build Pages:**
   - Homepage
   - Course listing
   - Course details
   - Instructor pages
   - User dashboard

5. **Add Features:**
   - Search and filters
   - Pagination
   - Loading states
   - Error handling
   - Responsive design

---

## CORS Configuration

Make sure your frontend URL is in the backend's CORS configuration:

In `.env`:
```
CORS_ORIGIN=http://localhost:3001  # Your frontend URL
FRONTEND_URL=http://localhost:3001  # For OAuth redirects
```

---

## Testing the API

You can test all endpoints using:
- **Postman**
- **Thunder Client** (VS Code extension)
- **curl** commands
- **Browser** (for GET requests)

Example curl:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

