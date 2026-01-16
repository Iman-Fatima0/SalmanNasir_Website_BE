# API Response Structure Guide

This document shows the exact structure of API responses to help frontend developers integrate correctly.

## 📋 Courses API Response

### GET `/api/courses` - Get All Courses

**Response Structure:**
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": {
    "courses": [
      {
        "id": "uuid",
        "productId": "uuid",
        "totalChapters": 10,
        "totalLessons": 50,
        "language": "Arabic",
        "level": "Beginner to Intermediate",
        "thumbnailUrl": "https://...",
        "durationMinutes": 3000,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "product": {
          "id": "uuid",
          "type": "course",
          "title": "Complete Arabic Mastery Program",
          "subtitle": "From Zero to Fluency in Arabic",
          "description": "A comprehensive Arabic language course...",
          "price": "299.99",
          "currency": "USD",
          "isPublished": true,
          "isArchived": false,
          "slug": "complete-arabic-mastery-program",
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        },
        "instructors": [
          {
            "id": "uuid",
            "firstName": "Dr. Khaled",
            "lastName": "Al-Mansouri",
            "title": "Professor of Arabic Linguistics",
            "bio": "...",
            "avatarUrl": "https://...",
            "linkedinUrl": "https://...",
            "twitterUrl": "https://...",
            "websiteUrl": "https://...",
            "isActive": true,
            "createdAt": "2024-01-01T00:00:00.000Z",
            "updatedAt": "2024-01-01T00:00:00.000Z",
            "CourseInstructor": {
              "role": "primary"
            }
          }
        ]
      }
    ],
    "pagination": {
      "total": 6,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

## ⚠️ Important Notes for Frontend

### 1. Course Title is in `product.title`, NOT `course.title`

**❌ Wrong:**
```javascript
course.title.charAt(0) // ERROR: course.title is undefined
```

**✅ Correct:**
```javascript
course.product?.title?.charAt(0) // Safe access
// OR
(course.product?.title || '').charAt(0) // With fallback
```

### 2. Always Use Optional Chaining

Since `product` might be null/undefined, always use optional chaining:

```javascript
// Safe access pattern
const title = course.product?.title || 'Untitled Course';
const subtitle = course.product?.subtitle || '';
const price = course.product?.price || 0;
const currency = course.product?.currency || 'USD';
```

### 3. Frontend Component Example

```jsx
// CoursesSection.jsx - Fixed version
import React from 'react';

const CoursesSection = ({ courses = [] }) => {
  return (
    <div>
      {courses.map((course) => {
        // Always check for product existence
        const product = course.product || {};
        const title = product.title || 'Untitled Course';
        const subtitle = product.subtitle || '';
        const price = product.price || 0;
        const currency = product.currency || 'USD';
        
        // Safe charAt access
        const firstLetter = title.charAt(0) || '?';
        
        return (
          <div key={course.id}>
            <h3>{title}</h3>
            <p>{subtitle}</p>
            <p>{currency} {price}</p>
            <p>First letter: {firstLetter}</p>
          </div>
        );
      })}
    </div>
  );
};

export default CoursesSection;
```

### 4. Common Frontend Fixes

**Fix for charAt error:**
```javascript
// Instead of:
course.product.title.charAt(0)

// Use:
(course.product?.title || '').charAt(0)
// OR
course.product?.title?.charAt(0) || '?'
```

**Fix for undefined price:**
```javascript
// Instead of:
course.product.price

// Use:
parseFloat(course.product?.price || 0)
```

**Fix for undefined instructors:**
```javascript
// Instead of:
course.instructors.map(...)

// Use:
(course.instructors || []).map(...)
```

## 🔍 Field Mapping

| Frontend Expectation | Actual API Location | Notes |
|---------------------|---------------------|-------|
| `course.title` | `course.product.title` | Title is in nested product object |
| `course.subtitle` | `course.product.subtitle` | Subtitle is in nested product object |
| `course.description` | `course.product.description` | Description is in nested product object |
| `course.price` | `course.product.price` | Price is in nested product object (string) |
| `course.currency` | `course.product.currency` | Currency is in nested product object |
| `course.slug` | `course.product.slug` | Slug is in nested product object |
| `course.level` | `course.level` | Level is directly on course |
| `course.language` | `course.language` | Language is directly on course |
| `course.thumbnailUrl` | `course.thumbnailUrl` | Thumbnail is directly on course |
| `course.instructors` | `course.instructors` | Instructors array is directly on course |

## 📝 TypeScript Interface (for reference)

```typescript
interface CourseResponse {
  success: boolean;
  message: string;
  data: {
    courses: Course[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

interface Course {
  id: string;
  productId: string;
  totalChapters: number;
  totalLessons: number;
  language: string | null;
  level: string | null;
  thumbnailUrl: string | null;
  durationMinutes: number | null;
  createdAt: string;
  updatedAt: string;
  product: Product | null; // ⚠️ Can be null!
  instructors: Instructor[];
}

interface Product {
  id: string;
  type: 'course';
  title: string;
  subtitle: string | null;
  description: string | null;
  price: string; // Decimal as string
  currency: string;
  isPublished: boolean;
  isArchived: boolean;
  slug: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  title: string | null;
  bio: string | null;
  avatarUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  CourseInstructor: {
    role: string;
  };
}
```

## 🐛 Common Errors and Solutions

### Error: `Cannot read properties of undefined (reading 'charAt')`

**Cause:** Trying to access `course.product.title` when `product` is null/undefined.

**Solution:**
```javascript
// ❌ Wrong
const firstLetter = course.product.title.charAt(0);

// ✅ Correct
const firstLetter = (course.product?.title || '').charAt(0);
```

### Error: `Cannot read properties of undefined (reading 'map')`

**Cause:** Trying to map over undefined array.

**Solution:**
```javascript
// ❌ Wrong
course.instructors.map(...)

// ✅ Correct
(course.instructors || []).map(...)
```

### Error: `price is not a number`

**Cause:** Price comes as string from database.

**Solution:**
```javascript
// ❌ Wrong
const total = course.product.price * quantity;

// ✅ Correct
const total = parseFloat(course.product?.price || 0) * quantity;
```

---

**Remember:** Always use optional chaining (`?.`) and provide fallback values when accessing nested properties!

