# Admin Analytics Endpoints - API Documentation

## Overview

This document describes the 4 analytics endpoints implemented for the admin dashboard analytics features.

All endpoints require:
- **Authentication**: Bearer token in `Authorization` header
- **Authorization**: Admin role (`isAdmin` middleware)

**Base URL**: `/api/admin/analytics`

---

## 1. Revenue Analytics

**GET** `/api/admin/analytics/revenue`

Get revenue analytics with time series data, total metrics, and order statistics.

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `period` | string | No | `monthly` | Time period grouping: `daily`, `weekly`, `monthly`, `yearly` |
| `startDate` | string (ISO date) | No | 12 months ago | Start date for analytics |
| `endDate` | string (ISO date) | No | today | End date for analytics |

### Example Request

```http
GET /api/admin/analytics/revenue?period=monthly
GET /api/admin/analytics/revenue?period=daily&startDate=2024-01-01&endDate=2024-01-31
```

### Response Format

```json
{
  "success": true,
  "message": "Revenue analytics retrieved successfully",
  "data": {
    "period": "monthly",
    "totalRevenue": 125000.50,
    "totalOrders": 150,
    "averageOrderValue": 833.34,
    "timeSeries": [
      {
        "date": "2024-01",
        "revenue": 15000.00,
        "orders": 18
      },
      {
        "date": "2024-02",
        "revenue": 18000.00,
        "orders": 22
      }
    ],
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.999Z"
  }
}
```

---

## 2. Course Analytics

**GET** `/api/admin/analytics/courses`

Get course performance metrics including top courses, enrollment trends, and completion rates.

### Example Request

```http
GET /api/admin/analytics/courses
```

### Response Format

```json
{
  "success": true,
  "message": "Course analytics retrieved successfully",
  "data": {
    "topCoursesByEnrollments": [
      {
        "courseId": "uuid",
        "courseTitle": "Advanced Arabic Grammar",
        "price": 199.99,
        "enrollments": 150,
        "completedOrders": 120,
        "revenue": 23998.80
      }
    ],
    "topCoursesByRevenue": [
      {
        "courseId": "uuid",
        "courseTitle": "Business Arabic",
        "price": 299.99,
        "enrollments": 80,
        "completedOrders": 75,
        "revenue": 22499.25
      }
    ],
    "enrollmentTrends": [
      {
        "month": "2024-01-01",
        "enrollments": 45,
        "coursesEnrolled": 12
      }
    ],
    "completionRates": [
      {
        "courseId": "uuid",
        "courseTitle": "Beginner Arabic",
        "totalEnrollments": 200,
        "activeEnrollments": 180,
        "completedEnrollments": 150,
        "completionRate": 83.33
      }
    ]
  }
}
```

---

## 3. Student Analytics

**GET** `/api/admin/analytics/students`

Get student growth trends, engagement breakdown, and activity patterns.

### Example Request

```http
GET /api/admin/analytics/students
```

### Response Format

```json
{
  "success": true,
  "message": "Student analytics retrieved successfully",
  "data": {
    "growthTrends": [
      {
        "month": "2024-01-01",
        "newUsers": 25
      },
      {
        "month": "2024-02-01",
        "newUsers": 30
      }
    ],
    "engagement": {
      "highlyEngaged": 120,
      "moderatelyEngaged": 80,
      "lowEngaged": 45,
      "inactive": 25
    },
    "activityByDay": [
      {
        "day": "Monday",
        "dayOfWeek": 1,
        "activeUsers": 150,
        "activities": 450
      },
      {
        "day": "Tuesday",
        "dayOfWeek": 2,
        "activeUsers": 145,
        "activities": 430
      }
    ]
  }
}
```

**Engagement Definitions:**
- **Highly Engaged**: Active in last 7 days
- **Moderately Engaged**: Active in last 30 days (but not last 7 days)
- **Low Engaged**: Has activity but not in last 30 days
- **Inactive**: No recorded activity

---

## 4. Funnel Analytics

**GET** `/api/admin/analytics/funnels`

Get conversion funnel data showing visitor journey from signups to purchases.

### Example Request

```http
GET /api/admin/analytics/funnels
```

### Response Format

```json
{
  "success": true,
  "message": "Funnel analytics retrieved successfully",
  "data": {
    "funnel": [
      {
        "stage": "visitors",
        "count": 1000,
        "label": "Total Active Users",
        "conversionRate": "100.00"
      },
      {
        "stage": "signups",
        "count": 250,
        "label": "Sign Ups",
        "conversionRate": "25.00"
      },
      {
        "stage": "courseViews",
        "count": 180,
        "label": "Course Views",
        "conversionRate": "72.00"
      },
      {
        "stage": "cart",
        "count": 120,
        "label": "Cart Additions",
        "conversionRate": "66.67"
      },
      {
        "stage": "checkout",
        "count": 90,
        "label": "Checkout Initiations",
        "conversionRate": "75.00"
      },
      {
        "stage": "purchases",
        "count": 75,
        "label": "Purchases",
        "conversionRate": "83.33"
      }
    ],
    "overallConversionRate": "7.50",
    "averageTimeToConversion": 3.45
  }
}
```

**Funnel Stages:**
- **visitors**: Total active users (baseline)
- **signups**: New user registrations (last 30 days)
- **courseViews**: Course detail page views (estimated from enrollments)
- **cart**: Items added to cart (orders with `pending` status)
- **checkout**: Checkout process initiated (orders with `processing` status)
- **purchases**: Completed purchases (orders with `completed` status)

**Conversion Rates**: Percentage of users from previous stage who reached this stage.

**Average Time to Conversion**: Average days from signup to first purchase (in last 30 days).

---

## Error Responses

All endpoints return standard error format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Common Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid query parameters)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (not admin role)
- `500` - Internal Server Error

---

## Frontend Integration Notes

### 1. Revenue Analytics
- Use `timeSeries` array for line/bar charts
- Display `totalRevenue`, `totalOrders`, `averageOrderValue` as KPIs
- `period` parameter controls chart granularity

### 2. Course Analytics
- Use `topCoursesByEnrollments` and `topCoursesByRevenue` for ranking tables
- Use `enrollmentTrends` for trend charts
- Use `completionRates` for completion analysis

### 3. Student Analytics
- Use `growthTrends` for growth line charts
- Use `engagement` for pie/bar charts showing engagement breakdown
- Use `activityByDay` for weekly activity patterns

### 4. Funnel Analytics
- Use `funnel` array for funnel visualization
- Display `overallConversionRate` and `averageTimeToConversion` as metrics
- Each stage shows count and conversion rate from previous stage

---

## Implementation Status

✅ All 4 analytics endpoints are implemented and ready for frontend integration.

**Endpoints:**
- ✅ `GET /api/admin/analytics/revenue`
- ✅ `GET /api/admin/analytics/courses`
- ✅ `GET /api/admin/analytics/students`
- ✅ `GET /api/admin/analytics/funnels`

**Features:**
- ✅ Time-series data for charts
- ✅ Aggregated metrics
- ✅ Top rankings (courses)
- ✅ Engagement breakdown
- ✅ Conversion funnel
- ✅ Query parameter validation

The frontend can now replace mock data with real API calls to these endpoints.

