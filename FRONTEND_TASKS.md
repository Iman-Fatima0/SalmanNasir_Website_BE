# Frontend Tasks - Action Items

## 🎯 Priority Tasks

### 1. **Update Profile Page** ✅
**What to do:**
- Add phone number field to profile update form
- Validate phone: 11-15 digits (accepts formatted input like `+20 123 456 7890`)
- Display phone number in user profile (from `/api/auth/me` response)
- Call `PUT /api/auth/me` when saving profile

**API Endpoint:**
```
PUT /api/auth/me
Headers: Authorization: Bearer <token>
Body: { firstName?, lastName?, phone?, profileImage? }
```

**Phone Validation (Frontend):**
```javascript
// Before sending to backend
const validatePhone = (phone) => {
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 11 && digitsOnly.length <= 15;
};
```

---

### 2. **Student Dashboard - My Courses** ✅
**What to do:**
- Create/update "My Courses" page to show enrolled courses
- Call `GET /api/student/courses` to fetch courses
- Display course cards with:
  - Course thumbnail, title, subtitle
  - Progress percentage
  - Enrollment date
  - "Continue Learning" button

**API Endpoint:**
```
GET /api/student/courses
Headers: Authorization: Bearer <token>
Response: { courses: [...], total: number }
```

**Response Structure:**
```javascript
{
  courses: [
    {
      id: "course-id",
      thumbnailUrl: "url",
      product: { title, subtitle, price },
      enrollment: { status, completionPercentage, enrolledAt },
      progress: { totalLessons, completedLessons, completionPercentage }
    }
  ],
  total: 1
}
```

**Empty State:**
- Show message: "You haven't enrolled in any courses yet"
- Show "Browse Courses" button

---

### 3. **Course Details Page (Enrolled Course)** ✅
**What to do:**
- When user clicks on an enrolled course, navigate to course details
- Call `GET /api/student/courses/:id` (NOT `/api/courses/:id`)
- Display:
  - Course info (title, description, chapters, lessons)
  - Progress tracker
  - Lesson list with completion status
  - "Start Lesson" / "Continue" buttons

**API Endpoint:**
```
GET /api/student/courses/:id
Headers: Authorization: Bearer <token>
Response: { course object with chapters, lessons, progress }
```

**Important:**
- Use `/api/student/courses/:id` for enrolled courses
- Use `/api/courses/:id` for public course preview
- Show 404 error if course not found or not enrolled

---

### 4. **Purchase History / Orders Page** ✅
**What to do:**
- Create "My Orders" or "Purchase History" page
- Call `GET /api/student/orders` to fetch all orders
- Display orders in a table/list with:
  - Order date
  - Course/Product name
  - Amount paid
  - Status (Pending / Approved)
  - Enrollment status (if approved)

**API Endpoint:**
```
GET /api/student/orders
Headers: Authorization: Bearer <token>
Response: [ array of orders ]
```

**Response Structure:**
```javascript
[
  {
    id: "order-id",
    amount: 99.99,
    currency: "USD",
    status: "approved", // or "pending"
    createdAt: "2024-01-01T00:00:00.000Z",
    product: { title, subtitle },
    course: { thumbnailUrl, language, level },
    enrollment: { status, completionPercentage } // null if pending
  }
]
```

**Display Logic:**
- Show "Pending" badge for pending orders
- Show "Enrolled" badge for approved orders with enrollment
- Show course thumbnail and title
- Sort by newest first (already sorted by backend)

**Empty State:**
- Show message: "No orders yet"
- Show "Browse Courses" button

---

### 5. **Error Handling** ✅
**What to do:**
- Handle all API errors gracefully
- Show user-friendly messages:
  - `401`: "Please login again" → Redirect to login
  - `404`: "Not found" → Show appropriate message
  - `500`: "Server error. Please try again later."
- Handle empty states (no courses, no orders)

**Error Handling Example:**
```javascript
try {
  const response = await api.get('/api/student/courses');
  if (response.status === 200) {
    // Success
  }
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
  } else if (error.response?.status === 404) {
    // Show "not found" message
  } else {
    // Show generic error
  }
}
```

---

## 📋 Implementation Checklist

### Profile Update
- [ ] Add phone number input field
- [ ] Add phone validation (11-15 digits)
- [ ] Update API call to `PUT /api/auth/me`
- [ ] Display phone number in profile
- [ ] Handle validation errors from backend

### My Courses Page
- [ ] Create route `/dashboard/courses` or `/my-courses`
- [ ] Call `GET /api/student/courses`
- [ ] Display course cards with progress
- [ ] Handle empty state
- [ ] Add "Continue Learning" button
- [ ] Link to course details page

### Course Details (Enrolled)
- [ ] Update course details page to check if enrolled
- [ ] Call `GET /api/student/courses/:id` for enrolled courses
- [ ] Display progress tracker
- [ ] Show lesson completion status
- [ ] Handle 404 (not enrolled)

### Orders/History Page
- [ ] Create route `/dashboard/orders` or `/purchase-history`
- [ ] Call `GET /api/student/orders`
- [ ] Display orders list/table
- [ ] Show status badges (Pending/Approved)
- [ ] Handle empty state
- [ ] Format dates and currency

### Error Handling
- [ ] Add error handling for all API calls
- [ ] Show user-friendly error messages
- [ ] Handle 401 (redirect to login)
- [ ] Handle 404 (show not found)
- [ ] Handle 500 (show server error)
- [ ] Handle empty states

---

## 🔗 API Base URL
```
http://localhost:3000/api
```

## 🔑 Authentication
All student endpoints require JWT token:
```
Authorization: Bearer <token>
```

---

## 📚 Full Documentation
See `FRONTEND_API_GUIDE.md` for complete API documentation with examples.

---

## ⚠️ Important Notes

1. **Phone Number:**
   - Backend accepts formatted input (`+20 123 456 7890`)
   - Backend normalizes to digits only
   - Frontend should validate 11-15 digits before sending

2. **Empty Responses:**
   - `/api/student/courses` returns `{ courses: [], total: 0 }`
   - `/api/student/orders` returns `[]`
   - Always handle empty states gracefully

3. **Course Endpoints:**
   - `/api/student/courses/:id` = Enrolled course details (requires enrollment)
   - `/api/courses/:id` = Public course preview (anyone can view)

4. **Purchase Flow & Enrollment:**
   - **Purchase History** (`/api/student/orders`): Shows ALL orders (pending + approved) immediately after purchase
   - **My Courses** (`/api/student/courses`): Shows ONLY courses with enrollments (after admin approves order)
   - **Flow**: Purchase → Order created (pending) → Admin approves → Enrollment created → Course appears in "My Courses"
   - **Important**: A purchased course appears in Purchase History immediately, but only appears in My Courses after the order is approved by admin
   - `enrollment` field in orders response is `null` for pending orders, and contains enrollment data for approved orders

---

## 🚀 Quick Start

1. **Test Profile Update:**
   ```javascript
   PUT /api/auth/me
   Body: { phone: "+201234567890" }
   ```

2. **Test Get Courses:**
   ```javascript
   GET /api/student/courses
   ```

3. **Test Get Orders:**
   ```javascript
   GET /api/student/orders
   ```

4. **Test Get Single Course:**
   ```javascript
   GET /api/student/courses/:courseId
   ```

All endpoints require authentication token in headers!
