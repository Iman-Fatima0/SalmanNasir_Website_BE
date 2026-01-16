# Navbar & Hero Section Specifications

## 🎯 Navbar Design (Clean, Minimal)

### Layout
```
┌────────────────────────────────────────────────────────────┐
│  ElCanadi                    [🌐 English ▼]  [Sign In]     │
└────────────────────────────────────────────────────────────┘
```

### Key Features:
- **Position:** Absolute over hero section image
- **Background:** Completely transparent (NO background)
- **Height:** 60-80px
- **Elements:** Logo (left) | Language Selector + Sign In (right)
- **Text Color:** White (visible over hero image)
- **Alignment:** Clean, minimal, text-aligned over hero

### Elements Breakdown:

#### 1. Logo (Left)
- Text: "ElCanadi" or logo image
- Font: Bold, 1.5rem
- Color: White (with text-shadow for visibility)
- Clickable → Homepage

#### 2. Language Selector (Right)
- Icon + Text + Dropdown arrow
- Example: 🌐 English ▼
- Dropdown shows: English, العربية (Arabic)
- White text, white/transparent border
- Hover effect with subtle background

#### 3. Sign In Button (Right)
- Text button with white border
- Transparent background
- White text
- Hover: Background fills with white, text becomes dark

---

## 🎨 Hero Section

### Layout
```
┌────────────────────────────────────────────────────────────┐
│                                                             │
│                    [Navbar Overlay]                        │
│                                                             │
│                                                             │
│              Learn Arabic the Right Way                    │
│                                                             │
│        Master Arabic language with comprehensive           │
│              courses designed for all levels               │
│                                                             │
│              [Browse Courses]  [Get Started]              │
│                                                             │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Key Features:
- **Full viewport height** (100vh)
- **Background:** Gradient or image
- **Content:** Centered, large typography
- **CTA Buttons:** Primary (filled) + Secondary (outlined)

---

## 💻 Complete Code Example

### HTML
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ElCanadi - Learn Arabic</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Navbar -->
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo">
        <a href="/">ElCanadi</a>
      </div>
      
      <div class="navbar-actions">
        <!-- Language Selector -->
        <div class="language-selector">
          <button class="lang-btn">
            <span class="lang-icon">🌐</span>
            <span class="lang-text">English</span>
            <span class="lang-arrow">▼</span>
          </button>
          <div class="lang-dropdown">
            <a href="?lang=en">English</a>
            <a href="?lang=ar">العربية</a>
          </div>
        </div>
        
        <!-- Sign In -->
        <a href="/login" class="sign-in-btn">Sign In</a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title">Learn Arabic the Right Way</h1>
      <p class="hero-subtitle">
        Master Arabic language with our comprehensive courses
        designed for all levels
      </p>
      <div class="hero-cta">
        <a href="/courses" class="cta-primary">Browse Courses</a>
        <a href="/signup" class="cta-secondary">Get Started</a>
      </div>
    </div>
  </section>
</body>
</html>
```

### CSS
```css
/* Reset & Base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  color: #333;
}

/* Navbar */
.navbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.5rem 2rem;
  background: transparent; /* NO background - completely transparent */
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-logo a {
  font-size: 1.75rem;
  font-weight: 700;
  color: white; /* White text over hero image */
  text-decoration: none;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Shadow for visibility */
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Language Selector */
.language-selector {
  position: relative;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.8); /* White border */
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  color: white; /* White text */
  transition: all 0.2s;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.lang-btn:hover {
  border-color: white;
  background: rgba(255, 255, 255, 0.2); /* Subtle white background on hover */
}

.lang-icon {
  font-size: 1.1rem;
}

.lang-arrow {
  font-size: 0.7rem;
  opacity: 0.6;
}

.lang-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  min-width: 140px;
  display: none;
  overflow: hidden;
}

.language-selector:hover .lang-dropdown {
  display: block;
}

.lang-dropdown a {
  display: block;
  padding: 0.75rem 1.25rem;
  text-decoration: none;
  color: #333;
  transition: background 0.2s;
}

.lang-dropdown a:hover {
  background: #f5f5f5;
}

/* Sign In Button */
.sign-in-btn {
  padding: 0.5rem 1.5rem;
  border: 1px solid white; /* White border */
  border-radius: 6px;
  text-decoration: none;
  color: white; /* White text */
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.sign-in-btn:hover {
  background: white; /* White background on hover */
  color: #333; /* Dark text on hover */
}

/* Hero Section */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Alternative: background-image: url('hero-bg.jpg'); */
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  padding: 2rem;
}

.hero-content {
  max-width: 800px;
  z-index: 1;
  margin-top: 80px; /* Account for navbar */
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.95;
  line-height: 1.6;
  font-weight: 300;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-primary {
  padding: 1rem 2.5rem;
  background: white;
  color: #333;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.cta-secondary {
  padding: 1rem 2.5rem;
  background: transparent;
  color: white;
  text-decoration: none;
  border: 2px solid white;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;
}

.cta-secondary:hover {
  background: white;
  color: #333;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }
  
  .navbar-logo a {
    font-size: 1.5rem;
    color: white; /* Ensure white on mobile */
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .lang-text {
    display: none; /* Hide text on mobile, show only icon */
  }
  
  .lang-btn {
    color: white; /* Ensure white on mobile */
    border-color: rgba(255, 255, 255, 0.8);
  }
  
  .sign-in-btn {
    color: white; /* Ensure white on mobile */
    border-color: white;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-cta {
    flex-direction: column;
  }
  
  .cta-primary,
  .cta-secondary {
    width: 100%;
  }
}
```

---

## 🎯 Key Design Points

1. **Navbar:**
   - Clean, minimal design
   - Only essential elements: Logo, Language, Sign In
   - **Completely transparent background (NO background)**
   - **White text aligned over hero section image**
   - Overlays hero section

2. **Language Selector:**
   - Icon + Text + Dropdown arrow
   - Hover shows dropdown
   - Clean border styling

3. **Hero Section:**
   - Full viewport height
   - Centered content
   - Large, bold typography
   - Clear call-to-action buttons

4. **Responsive:**
   - Mobile-friendly
   - Language text hides on small screens
   - Stacked buttons on mobile

---

This matches the clean, professional design of Thinkific platforms!

