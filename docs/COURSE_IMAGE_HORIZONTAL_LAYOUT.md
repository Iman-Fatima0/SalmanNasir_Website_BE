# Course Image Horizontal Layout Guide

## 🖼️ Horizontal Image Display

This guide shows how to display course images in a horizontal/landscape orientation.

## 📐 CSS Solution

### Option 1: Object-Fit (Recommended)

```css
.course-image {
  width: 100%;
  height: 200px; /* Fixed height for horizontal layout */
  object-fit: cover; /* Maintains aspect ratio, crops if needed */
  object-position: center; /* Centers the image */
  border-radius: 8px;
}

/* For responsive design */
@media (max-width: 768px) {
  .course-image {
    height: 150px;
  }
}
```

### Option 2: Background Image with Aspect Ratio

```css
.course-image-container {
  width: 100%;
  aspect-ratio: 16 / 9; /* Horizontal/landscape ratio */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  overflow: hidden;
}
```

### Option 3: Flexbox with Fixed Dimensions

```css
.course-card {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.course-image-wrapper {
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio (9/16 = 0.5625) */
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.course-image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```

## 🎨 Complete Course Card Component

```jsx
// CourseCard.jsx
import React from 'react';
import './CourseCard.css';

const CourseCard = ({ course }) => {
  const product = course.product || {};
  const title = product.title || 'Untitled Course';
  const subtitle = product.subtitle || '';
  const price = parseFloat(product.price || 0);
  const currency = product.currency || 'USD';
  const thumbnailUrl = course.thumbnailUrl || '/placeholder-course.jpg';
  const firstLetter = (title || '').charAt(0) || '?';

  return (
    <div className="course-card">
      {/* Horizontal Image Container */}
      <div className="course-image-container">
        <img 
          src={thumbnailUrl} 
          alt={title}
          className="course-image"
          onError={(e) => {
            e.target.src = '/placeholder-course.jpg';
          }}
        />
        {/* Optional: Overlay with first letter if image fails */}
        {!thumbnailUrl && (
          <div className="course-image-placeholder">
            {firstLetter}
          </div>
        )}
      </div>
      
      <div className="course-content">
        <h3 className="course-title">{title}</h3>
        {subtitle && <p className="course-subtitle">{subtitle}</p>}
        <div className="course-meta">
          <span className="course-level">{course.level || 'All Levels'}</span>
          <span className="course-language">{course.language || 'Arabic'}</span>
        </div>
        <div className="course-price">
          {currency} {price.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
```

## 🎯 CSS Stylesheet

```css
/* CourseCard.css */

.course-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Horizontal Image Container */
.course-image-container {
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio for horizontal */
  position: relative;
  overflow: hidden;
  background: #f0f0f0;
}

.course-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Fits horizontally, maintains aspect ratio */
  object-position: center; /* Centers the image */
  transition: transform 0.3s;
}

.course-card:hover .course-image {
  transform: scale(1.05); /* Zoom effect on hover */
}

/* Placeholder if image fails */
.course-image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 3rem;
  font-weight: bold;
}

/* Course Content */
.course-content {
  padding: 1.5rem;
}

.course-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #333;
  line-height: 1.4;
}

.course-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.course-meta {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.course-meta span {
  padding: 0.25rem 0.75rem;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #666;
}

.course-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

/* Responsive */
@media (max-width: 768px) {
  .course-card {
    max-width: 100%;
  }
  
  .course-image-container {
    padding-bottom: 50%; /* Slightly taller on mobile */
  }
}
```

## 🔄 Alternative: CSS Grid Layout

```css
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.course-card {
  display: grid;
  grid-template-rows: auto 1fr;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.course-image-container {
  grid-row: 1;
  width: 100%;
  aspect-ratio: 16 / 9; /* Horizontal ratio */
  overflow: hidden;
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.course-content {
  grid-row: 2;
  padding: 1.5rem;
}
```

## 🎨 Image Transformation (if needed)

If you need to force rotate an image that's vertical:

```css
/* Rotate vertical image to horizontal */
.course-image.rotate {
  transform: rotate(90deg);
  width: 100%;
  height: auto;
}

/* Or use object-fit to fit horizontally */
.course-image.fit-horizontal {
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center;
}
```

## 📱 Responsive Horizontal Images

```css
.course-image-container {
  width: 100%;
  aspect-ratio: 16 / 9; /* Horizontal landscape */
}

/* Tablet */
@media (min-width: 768px) {
  .course-image-container {
    aspect-ratio: 16 / 9;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .course-image-container {
    aspect-ratio: 16 / 9;
    max-height: 250px;
  }
}
```

## ✅ Key Points

1. **Use `aspect-ratio: 16 / 9`** for horizontal/landscape images
2. **Use `object-fit: cover`** to fill the container while maintaining aspect ratio
3. **Use `object-position: center`** to center the image
4. **Set fixed height** or use aspect-ratio for consistent card sizes
5. **Handle image errors** with fallback placeholder

## 🚀 Quick Implementation

Add this to your existing `CoursesSection.jsx`:

```jsx
// In your course card JSX
<div className="course-image-wrapper">
  <img 
    src={course.thumbnailUrl || '/placeholder.jpg'} 
    alt={title}
    style={{
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      objectPosition: 'center',
      borderRadius: '8px'
    }}
  />
</div>
```

Or add to your CSS:

```css
.course-image-wrapper img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;
}
```

---

**This ensures all course images display horizontally in a consistent landscape format!**

