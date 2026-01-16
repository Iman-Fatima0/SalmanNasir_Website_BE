# Frontend Image Styling - Horizontal Layout

## 🎯 Quick Fix: Make Course Images Horizontal

### Inline Style (Quick Fix)

```jsx
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
```

### CSS Class (Recommended)

```css
/* Add to your CSS file */
.course-thumbnail {
  width: 100%;
  height: 200px; /* Fixed height for horizontal layout */
  object-fit: cover; /* Fits horizontally, maintains aspect ratio */
  object-position: center; /* Centers the image */
  border-radius: 8px;
  display: block;
}
```

Then use in JSX:

```jsx
<img 
  src={course.thumbnailUrl || '/placeholder.jpg'} 
  alt={title}
  className="course-thumbnail"
/>
```

## 📐 Aspect Ratio Method (Best for Responsive)

```css
.course-image-container {
  width: 100%;
  aspect-ratio: 16 / 9; /* Horizontal/landscape ratio */
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.course-image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```

## 🔄 Complete Example

```jsx
// In your CoursesSection component
{courses.map((course) => {
  const product = course.product || {};
  const title = product.title || 'Untitled Course';
  const thumbnailUrl = course.thumbnailUrl || '/placeholder.jpg';
  
  return (
    <div key={course.id} className="course-card">
      {/* Horizontal Image */}
      <div className="course-image-wrapper">
        <img 
          src={thumbnailUrl} 
          alt={title}
          className="course-thumbnail"
          onError={(e) => {
            e.target.src = '/placeholder.jpg';
          }}
        />
      </div>
      
      {/* Rest of your content */}
      <div className="course-content">
        <h3>{title}</h3>
        {/* ... */}
      </div>
    </div>
  );
})}
```

## 🎨 CSS for Horizontal Images

```css
/* Option 1: Fixed Height */
.course-thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;
}

/* Option 2: Aspect Ratio (Responsive) */
.course-image-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 8px;
}

.course-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* Option 3: Flex Container */
.course-image-container {
  display: flex;
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
}

.course-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```

## 📱 Responsive Sizes

```css
.course-thumbnail {
  width: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;
}

/* Mobile */
@media (max-width: 768px) {
  .course-thumbnail {
    height: 150px;
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .course-thumbnail {
    height: 180px;
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .course-thumbnail {
    height: 200px;
  }
}
```

---

**Key CSS Properties:**
- `object-fit: cover` - Fits image to container, maintains aspect ratio
- `object-position: center` - Centers the image
- `aspect-ratio: 16 / 9` - Forces horizontal/landscape ratio
- `height: 200px` - Fixed height for consistent layout

