# Production-Ready Backend Architecture

## 📋 Overview

This document outlines the complete production-ready backend architecture for the course-selling platform, designed similar to Teachable/Kajabi.

---

## 🗄️ Database Schema Design

### Core Models Overview

```
Users & Auth
├── User (enhanced with status, soft deletes)
├── Role (RBAC)
├── Permission (RBAC)
├── UserRole (pivot)
├── Session (JWT refresh tokens)
└── RefreshToken

Courses & Content
├── Product (existing - enhanced)
├── Course (existing - enhanced)
├── CourseCategory
├── CourseInstructor (existing)
├── Chapter (existing - renamed from Section)
├── Lesson (existing - enhanced with type)
├── Quiz
├── Question
└── Answer

Enrollment & Progress
├── Enrollment
├── LessonProgress
├── QuizAttempt
└── Certificate

Commerce
├── Order (existing - enhanced with state machine)
├── OrderItem
├── Payment
├── Refund
├── Subscription
└── Coupon

Analytics & Logs
├── ActivityLog
├── AdminActionLog
├── EmailLog
└── WebhookLog
```

---

## 🔐 Authentication & Authorization

### User Status Lifecycle

```
ACTIVE → SUSPENDED → DELETED
     ↓         ↓
     └─────────┘
   (reinstatement)
```

### RBAC Permission System

**Roles:**
- `ADMIN` - Full system access
- `INSTRUCTOR` - Own courses only
- `SUPPORT` - Read access + refunds
- `STUDENT` - Own enrollments only

**Permissions (examples):**
- `courses:create`
- `courses:update:own`
- `courses:delete:own`
- `orders:refund`
- `users:view:all`
- `analytics:view`

---

## 📦 Order State Machine

### Valid Transitions

```
CREATED → PAID → COMPLETED
    ↓       ↓         ↓
CANCELLED  FAILED  REFUNDED
                     ↓
              PARTIALLY_REFUNDED
```

**Invalid transitions are rejected by backend validation.**

---

## 💳 Payment State Machine

### Valid Transitions

```
PENDING → PROCESSING → SUCCEEDED
    ↓          ↓            ↓
  FAILED    FAILED      REFUNDED
                                ↓
                          PARTIALLY_REFUNDED
```

---

## 📚 Course Status

```
DRAFT → PUBLISHED → ARCHIVED
   ↓         ↓
   └─────────┘
 (unpublish)
```

---

## 🎓 Lesson Types

- `VIDEO` - Video content
- `PDF` - PDF document
- `TEXT` - Text content
- `QUIZ` - Quiz/Assessment

---

## 📊 Analytics Calculations

### Revenue
- Sum of all `PAID` order amounts
- Excludes refunded amounts
- Cached daily for performance

### Enrollment Count
- Count of `Enrollment` records with status `ACTIVE`

### Completion Percentage
```sql
(SELECT COUNT(*) FROM lesson_progress WHERE completed = true AND enrollment_id = X)
/ 
(SELECT COUNT(*) FROM lessons WHERE chapter_id IN (SELECT id FROM chapters WHERE course_id = Y))
```

### Refund Rate
```sql
(COUNT(refunds) / COUNT(orders)) * 100
```

---

## 🔒 Security & Performance

### Indexes Strategy

**High-traffic queries:**
```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- Order queries
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Enrollment queries
CREATE INDEX idx_enrollments_user_course ON enrollments(user_id, course_id);

-- Analytics queries
CREATE INDEX idx_payments_status_created ON payments(status, created_at);
```

### Rate Limiting
- 100 requests/minute per IP
- 10 requests/minute for payment endpoints
- Admin endpoints: 1000 requests/minute

### PII Encryption
- Sensitive fields encrypted at rest
- Passwords: bcrypt (12 rounds)
- Payment tokens: AES-256

---

## 📡 API Endpoint Structure

```
/admin/*
├── /dashboard
├── /courses (CRUD)
├── /users (CRUD)
├── /orders (read + status update)
├── /payments (read + refund)
└── /analytics

/instructor/*
├── /courses (own courses only)
├── /analytics (own courses)
└── /students (own courses)

/student/*
├── /courses (browse)
├── /enrollments
├── /progress
└── /certificates
```

---

## 🔄 State Transition Validation

All state transitions are validated server-side:

```javascript
const ORDER_STATE_MACHINE = {
  CREATED: ['PAID', 'CANCELLED'],
  PAID: ['COMPLETED', 'REFUNDED', 'FAILED'],
  COMPLETED: ['REFUNDED', 'PARTIALLY_REFUNDED'],
  REFUNDED: [],
  PARTIALLY_REFUNDED: [],
  CANCELLED: [],
  FAILED: []
};
```

Invalid transitions return `400 Bad Request`.

---

## 📝 Audit Trail

All sensitive actions logged:
- Admin actions → `AdminActionLog`
- User activities → `ActivityLog`
- Email sends → `EmailLog`
- Webhook calls → `WebhookLog`

Logs are append-only and indexed by date.

---

## 🎯 Idempotency

Payment endpoints support idempotency keys:
```
X-Idempotency-Key: uuid-v4
```

Duplicate requests with same key return original response.

---

## 🚀 Performance Optimization

1. **Database:**
   - Connection pooling (5-10 connections)
   - Query optimization with EXPLAIN
   - Strategic indexes

2. **Caching:**
   - Redis for session storage
   - Daily analytics cached for 24h

3. **Pagination:**
   - Default: 20 items/page
   - Max: 100 items/page

---

## ✅ Production Checklist

- [x] UUID primary keys
- [x] Soft deletes where appropriate
- [x] Timestamps (createdAt, updatedAt, deletedAt)
- [x] Foreign key constraints
- [x] Cascade rules defined
- [x] Unique constraints
- [x] Indexes on foreign keys
- [x] State machine validation
- [x] Audit logging
- [x] Error handling
- [x] Transaction safety
- [x] Idempotency support
- [x] Rate limiting
- [x] PII encryption

