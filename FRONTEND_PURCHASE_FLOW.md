# Frontend: Purchase Flow Implementation Guide

## 🎯 Key Concept

**Purchase History** and **My Courses** are different sections with different purposes:

- **Purchase History** = All orders (pending + approved) - shows purchase transactions
- **My Courses** = Only enrolled courses (approved orders) - shows accessible courses

---

## 📋 What Frontend Needs to Do

### 1. **Purchase History Page** (`/dashboard/orders` or `/purchase-history`)

**Display Logic:**
- Show ALL orders (both pending and approved)
- Display order status clearly:
  - **"Pending"** badge → Waiting for admin approval
  - **"Approved"** badge → Order approved, course accessible

**What to Show:**
```javascript
// For each order:
{
  orderDate: order.createdAt,
  courseName: order.product.title,
  amount: order.amount,
  status: order.status, // "pending" or "approved"
  enrollment: order.enrollment // null if pending, object if approved
}
```

**UI Elements:**
- ✅ Show course thumbnail and title
- ✅ Show purchase date
- ✅ Show amount paid
- ✅ Show status badge:
  - 🟡 **Pending** = "Waiting for approval"
  - 🟢 **Approved** = "Enrolled" or "Access granted"
- ✅ If approved: Show "View Course" button (links to course)
- ✅ If pending: Show "Pending approval" message (no action button)

**Example Display:**
```
┌─────────────────────────────────────┐
│ 📚 Arabic Course                    │
│ Purchased: Jan 15, 2024             │
│ Amount: $99.99                      │
│ Status: 🟡 Pending                  │
│ "Waiting for admin approval"        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📚 Business Arabic                  │
│ Purchased: Jan 10, 2024             │
│ Amount: $149.99                    │
│ Status: 🟢 Approved                │
│ [View Course] button               │
└─────────────────────────────────────┘
```

---

### 2. **My Courses Page** (`/dashboard/courses` or `/my-courses`)

**Display Logic:**
- Show ONLY courses that have enrollments (approved orders)
- These are courses the user can actually access and learn from

**What to Show:**
```javascript
// For each course:
{
  courseTitle: course.product.title,
  thumbnail: course.thumbnailUrl,
  progress: course.progress.completionPercentage,
  enrollmentDate: course.enrollment.enrolledAt,
  status: course.enrollment.status // "active"
}
```

**UI Elements:**
- ✅ Show course thumbnail
- ✅ Show course title and subtitle
- ✅ Show progress bar/percentage
- ✅ Show "Continue Learning" button
- ✅ Show enrollment date

**Important:**
- ❌ Do NOT show courses from pending orders here
- ✅ Only show courses with `enrollment` status = "active"

---

### 3. **User Experience Flow**

**Scenario 1: User Just Purchased a Course**
1. User completes payment
2. Order is created (status: "pending")
3. **Purchase History** → Shows new order with "Pending" status
4. **My Courses** → Does NOT show the course yet
5. User sees message: "Your purchase is pending approval"

**Scenario 2: Admin Approves Order**
1. Admin approves the order
2. Enrollment is automatically created
3. **Purchase History** → Order status changes to "Approved"
4. **My Courses** → Course now appears with "Continue Learning" button
5. User can now access the course content

---

## 🔧 Implementation Details

### API Response Structure

**Purchase History (`GET /api/student/orders`):**
```javascript
[
  {
    id: "order-123",
    status: "pending", // or "approved"
    amount: 99.99,
    createdAt: "2024-01-15T10:00:00Z",
    product: { title: "Arabic Course" },
    course: { thumbnailUrl: "..." },
    enrollment: null // null if pending
  },
  {
    id: "order-456",
    status: "approved",
    amount: 149.99,
    createdAt: "2024-01-10T10:00:00Z",
    product: { title: "Business Arabic" },
    course: { thumbnailUrl: "..." },
    enrollment: {
      id: "enrollment-789",
      status: "active",
      completionPercentage: 25
    }
  }
]
```

**My Courses (`GET /api/student/courses`):**
```javascript
{
  courses: [
    {
      id: "course-123",
      product: { title: "Business Arabic" },
      enrollment: {
        status: "active",
        enrolledAt: "2024-01-10T10:00:00Z"
      },
      progress: {
        completionPercentage: 25
      }
    }
  ],
  total: 1
}
```

---

### Frontend Code Examples

#### 1. Purchase History Component

```javascript
const PurchaseHistory = () => {
  const { data: orders, isLoading } = useQuery(
    'orders',
    () => api.get('/api/student/orders')
  );

  return (
    <div>
      <h2>Purchase History</h2>
      {orders?.map(order => (
        <div key={order.id} className="order-card">
          <img src={order.course?.thumbnailUrl} alt={order.product.title} />
          <h3>{order.product.title}</h3>
          <p>Purchased: {formatDate(order.createdAt)}</p>
          <p>Amount: ${order.amount}</p>
          
          {/* Status Badge */}
          {order.status === 'pending' ? (
            <div className="badge pending">
              🟡 Pending Approval
              <p className="small-text">Waiting for admin approval</p>
            </div>
          ) : (
            <div className="badge approved">
              🟢 Approved
              {order.enrollment && (
                <Link to={`/courses/${order.course?.id}`}>
                  <button>View Course</button>
                </Link>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
```

#### 2. My Courses Component

```javascript
const MyCourses = () => {
  const { data, isLoading } = useQuery(
    'my-courses',
    () => api.get('/api/student/courses')
  );

  const courses = data?.courses || [];

  if (courses.length === 0) {
    return (
      <div className="empty-state">
        <p>You haven't enrolled in any courses yet.</p>
        <Link to="/courses">
          <button>Browse Courses</button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2>My Courses</h2>
      {courses.map(course => (
        <div key={course.id} className="course-card">
          <img src={course.thumbnailUrl} alt={course.product.title} />
          <h3>{course.product.title}</h3>
          <p>{course.product.subtitle}</p>
          
          {/* Progress Bar */}
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${course.progress.completionPercentage}%` }}
            />
            <span>{course.progress.completionPercentage}% Complete</span>
          </div>
          
          <Link to={`/courses/${course.id}`}>
            <button>Continue Learning</button>
          </Link>
        </div>
      ))}
    </div>
  );
};
```

---

## ✅ Checklist for Frontend Developer

### Purchase History Page
- [ ] Create route `/dashboard/orders` or `/purchase-history`
- [ ] Call `GET /api/student/orders` API
- [ ] Display all orders (pending + approved)
- [ ] Show status badges:
  - [ ] "Pending" badge with message "Waiting for approval"
  - [ ] "Approved" badge with "View Course" button
- [ ] Show course thumbnail, title, purchase date, amount
- [ ] Handle empty state (no orders)
- [ ] Link approved orders to course page

### My Courses Page
- [ ] Create route `/dashboard/courses` or `/my-courses`
- [ ] Call `GET /api/student/courses` API
- [ ] Display ONLY courses with enrollments (approved orders)
- [ ] Show progress bar/percentage
- [ ] Show "Continue Learning" button
- [ ] Handle empty state (no enrolled courses)
- [ ] Link to course details page

### User Experience
- [ ] Make it clear that pending orders don't appear in "My Courses"
- [ ] Show helpful messages:
  - "Your purchase is pending approval" for pending orders
  - "Course is now available" when enrollment is created
- [ ] Update both pages when order status changes (if using real-time updates)

---

## 🎨 UI/UX Recommendations

1. **Status Indicators:**
   - Use color coding: Yellow for pending, Green for approved
   - Use icons: ⏳ for pending, ✅ for approved

2. **Empty States:**
   - Purchase History: "No purchases yet" + "Browse Courses" button
   - My Courses: "No enrolled courses" + "Browse Courses" button

3. **Navigation:**
   - Add navigation between "Purchase History" and "My Courses"
   - Show count badges: "3 Orders" / "2 Courses"

4. **Notifications (Optional):**
   - Show notification when order is approved
   - "Your course is now available!" message

---

## 📝 Summary

**Key Points:**
1. **Purchase History** = All orders (transaction history)
2. **My Courses** = Only enrolled courses (accessible courses)
3. Pending orders appear in Purchase History but NOT in My Courses
4. Approved orders appear in BOTH sections
5. Use `order.status` and `order.enrollment` to determine what to show

**API Endpoints:**
- `GET /api/student/orders` → Purchase History
- `GET /api/student/courses` → My Courses

**Status Flow:**
```
Purchase → Pending Order → Admin Approves → Enrollment Created → Course in My Courses
```
