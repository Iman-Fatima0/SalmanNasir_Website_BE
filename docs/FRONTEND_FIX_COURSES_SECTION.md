# Frontend Fix: CoursesSection.jsx

## 🐛 Error

```
CoursesSection.jsx:63 Uncaught TypeError: Cannot read properties of undefined (reading 'charAt')
```

## 🔍 Root Cause

The error occurs because:
1. The API returns course data with a nested `product` object
2. The frontend is trying to access `course.title` or `course.product.title` directly
3. If `product` is null/undefined, or `title` is missing, `.charAt()` fails

## ✅ Solution

### Option 1: Safe Access with Optional Chaining (Recommended)

```jsx
// CoursesSection.jsx
import React from 'react';

const CoursesSection = ({ courses = [] }) => {
  return (
    <div className="courses-section">
      {courses.map((course) => {
        // Safe access to product and title
        const product = course.product || {};
        const title = product.title || 'Untitled Course';
        const subtitle = product.subtitle || '';
        const price = parseFloat(product.price || 0);
        const currency = product.currency || 'USD';
        
        // Safe charAt - this was causing the error
        const firstLetter = (title || '').charAt(0) || '?';
        
        // Safe access to other fields
        const thumbnailUrl = course.thumbnailUrl || '';
        const level = course.level || 'All Levels';
        const language = course.language || 'Arabic';
        const instructors = course.instructors || [];
        
        return (
          <div key={course.id} className="course-card">
            {firstLetter && (
              <div className="course-icon">{firstLetter}</div>
            )}
            {/* Horizontal Image */}
            <div className="course-image-wrapper">
              <img 
                src={thumbnailUrl} 
                alt={title}
                className="course-thumbnail"
                onError={(e) => {
                  e.target.src = '/placeholder-course.jpg';
                }}
              />
            </div>
            <h3>{title}</h3>
            {subtitle && <p className="subtitle">{subtitle}</p>}
            <div className="course-meta">
              <span>{level}</span>
              <span>{language}</span>
            </div>
            <div className="course-price">
              {currency} {price.toFixed(2)}
            </div>
            {instructors.length > 0 && (
              <div className="instructors">
                {instructors.map((instructor) => (
                  <span key={instructor.id}>
                    {instructor.firstName} {instructor.lastName}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CoursesSection;
```

### Option 2: Helper Function

```jsx
// CoursesSection.jsx
import React from 'react';

// Helper function to safely get course data
const getCourseData = (course) => {
  const product = course?.product || {};
  return {
    id: course?.id || '',
    title: product.title || 'Untitled Course',
    subtitle: product.subtitle || '',
    description: product.description || '',
    price: parseFloat(product.price || 0),
    currency: product.currency || 'USD',
    thumbnailUrl: course?.thumbnailUrl || '',
    level: course?.level || 'All Levels',
    language: course?.language || 'Arabic',
    instructors: course?.instructors || [],
    totalChapters: course?.totalChapters || 0,
    totalLessons: course?.totalLessons || 0,
  };
};

const CoursesSection = ({ courses = [] }) => {
  return (
    <div className="courses-section">
      {courses.map((course) => {
        const courseData = getCourseData(course);
        const firstLetter = courseData.title.charAt(0);
        
        return (
          <div key={courseData.id} className="course-card">
            <div className="course-icon">{firstLetter}</div>
            {/* Rest of your component */}
          </div>
        );
      })}
    </div>
  );
};

export default CoursesSection;
```

### Option 3: Using React Query with Error Handling

```jsx
// CoursesSection.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';

const CoursesSection = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await fetch('/api/courses');
      const result = await response.json();
      // Transform data to flatten structure
      return result.data.courses.map((course) => ({
        ...course,
        // Flatten product fields
        title: course.product?.title || 'Untitled',
        subtitle: course.product?.subtitle || '',
        price: parseFloat(course.product?.price || 0),
        currency: course.product?.currency || 'USD',
        // Keep product reference if needed
        product: course.product,
      }));
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading courses</div>;

  return (
    <div className="courses-section">
      {data?.map((course) => {
        const firstLetter = (course.title || '').charAt(0) || '?';
        
        return (
          <div key={course.id} className="course-card">
            <div className="course-icon">{firstLetter}</div>
            <h3>{course.title}</h3>
            {/* Rest of component */}
          </div>
        );
      })}
    </div>
  );
};

export default CoursesSection;
```

## 🔧 Quick Fix (Minimal Change)

If you just want to fix the immediate error at line 63:

```jsx
// Before (line 63):
const firstLetter = course.product.title.charAt(0);

// After (line 63):
const firstLetter = (course.product?.title || '').charAt(0) || '?';
```

## 📋 Complete Safe Access Pattern

```javascript
// Always use this pattern for nested API data:

// 1. Product fields
const title = course.product?.title || 'Untitled';
const subtitle = course.product?.subtitle || '';
const price = parseFloat(course.product?.price || 0);
const currency = course.product?.currency || 'USD';

// 2. Course fields
const level = course.level || 'All Levels';
const language = course.language || 'Arabic';
const thumbnailUrl = course.thumbnailUrl || '/placeholder.jpg';

// 3. Arrays
const instructors = course.instructors || [];

// 4. String operations
const firstLetter = (title || '').charAt(0) || '?';
const slug = course.product?.slug || '';
```

## 🖼️ Horizontal Image Styling

Add this CSS to make images display horizontally:

```css
.course-image-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9; /* Horizontal/landscape ratio */
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.course-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Fits horizontally, maintains aspect ratio */
  object-position: center; /* Centers the image */
  display: block;
}
```

Or use inline style for quick fix:

```jsx
<img 
  src={thumbnailUrl} 
  alt={title}
  style={{
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    objectPosition: 'center',
    borderRadius: '8px'
  }}
/>
```

## ✅ Testing

After applying the fix, test with:
1. Courses with complete product data
2. Courses with missing product (null)
3. Courses with missing title
4. Empty courses array
5. Courses with no instructors
6. Images of different orientations (should all display horizontally)

---

**The key is always using optional chaining (`?.`) and providing fallback values!**

**For horizontal images, use `object-fit: cover` with fixed height or `aspect-ratio: 16 / 9`!**

