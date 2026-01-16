# UI Design Guide - Thinkific Style

Based on [ElCanadi Thinkific](https://elcanadi.thinkific.com/) design patterns.

---

## 🎨 Navbar Design

### Structure
```
┌─────────────────────────────────────────────────┐
│  [Logo]                    [Language] [Sign In] │
└─────────────────────────────────────────────────┘
```

### Design Specifications

**Position:** Absolute over hero section image
**Background:** Completely transparent (NO background)
**Height:** 60-80px
**Text Color:** White (visible over hero image)
**Alignment:** Clean, minimal, text-aligned over hero

### Elements:

1. **Logo** (Left side)
   - Brand name: "ElCanadi" or your logo
   - Clickable → Links to homepage

2. **Language Selector** (Right side, before Sign In)
   - Dropdown or button
   - Options: English, Arabic, etc.
   - Clean icon + text

3. **Sign In Button** (Right side)
   - Text button or outlined button
   - No background, just text/border
   - Hover effect

### HTML Structure:
```html
<nav class="navbar">
  <div class="navbar-container">
    <!-- Left: Logo -->
    <div class="navbar-logo">
      <a href="/">ElCanadi</a>
    </div>
    
    <!-- Right: Actions -->
    <div class="navbar-actions">
      <!-- Language Selector -->
      <div class="language-selector">
        <button class="lang-btn">
          <span>🌐</span>
          <span>English</span>
          <span>▼</span>
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
```

### CSS Styling:
```css
.navbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
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
  font-size: 1.5rem;
  font-weight: 600;
  color: white; /* White text over hero image */
  text-decoration: none;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Shadow for visibility */
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

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
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  color: white; /* White text */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
}

.lang-btn:hover {
  border-color: white;
  background: rgba(255, 255, 255, 0.2); /* Subtle white background on hover */
}

.lang-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  min-width: 120px;
  display: none;
}

.language-selector:hover .lang-dropdown {
  display: block;
}

.lang-dropdown a {
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #333;
}

.lang-dropdown a:hover {
  background: #f5f5f5;
}

.sign-in-btn {
  padding: 0.5rem 1.5rem;
  border: 1px solid white; /* White border */
  border-radius: 4px;
  text-decoration: none;
  color: white; /* White text */
  font-size: 0.9rem;
  transition: all 0.2s;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.sign-in-btn:hover {
  background: white; /* White background on hover */
  color: #333; /* Dark text on hover */
}
```

---

## 🎯 Hero Section

### Structure
```
┌─────────────────────────────────────────────────┐
│                                                 │
│              [Hero Content]                    │
│         Main heading                            │
│         Subheading/Description                  │
│         [CTA Button]                           │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Design Specifications

**Position:** Below navbar (navbar overlays hero)
**Height:** Full viewport height (100vh) or large section
**Background:** Image, gradient, or solid color
**Content:** Centered, clean typography

### HTML Structure:
```html
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
```

### CSS Styling:
```css
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* or use background image */
  /* background-image: url('hero-bg.jpg'); */
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  padding: 2rem;
}

.hero-content {
  max-width: 800px;
  z-index: 1;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  line-height: 1.6;
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
  border-radius: 4px;
  font-weight: 600;
  transition: transform 0.2s;
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
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.2s;
}

.cta-secondary:hover {
  background: white;
  color: #333;
}
```

---

## 🔐 Login/Signup Page Design (Thinkific Style)

### Layout Structure
```
┌─────────────────────────────────────────────────┐
│  [Navbar with Logo, Language, Sign In]          │
├─────────────────────────────────────────────────┤
│                                                 │
│         ┌─────────────────┐                    │
│         │                 │                    │
│         │  Login Form     │                    │
│         │                 │                    │
│         │  [Email]        │                    │
│         │  [Password]     │                    │
│         │  [Login Button] │                    │
│         │                 │                    │
│         │  Forgot Password?│                    │
│         │                 │                    │
│         │  ─────────────  │                    │
│         │                 │                    │
│         │  [Google]       │                    │
│         │  [Facebook]     │                    │
│         │  [LinkedIn]      │                    │
│         │  [Apple]         │                    │
│         │                 │                    │
│         │  Don't have an  │                    │
│         │  account? Sign up│                    │
│         └─────────────────┘                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Design Specifications

**Layout:** Centered card on page
**Width:** 400-450px max
**Background:** White card with shadow
**Spacing:** Generous padding
**Typography:** Clean, readable

### HTML Structure:
```html
<div class="auth-page">
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">Sign In</h2>
      
      <!-- Email/Password Form -->
      <form class="auth-form" @submit="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input type="email" required />
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input type="password" required />
        </div>
        
        <button type="submit" class="btn-primary">Sign In</button>
      </form>
      
      <a href="/forgot-password" class="forgot-link">
        Forgot your password?
      </a>
      
      <div class="divider">
        <span>or</span>
      </div>
      
      <!-- OAuth Buttons -->
      <div class="oauth-buttons">
        <button class="oauth-btn google">
          <svg>...</svg>
          Continue with Google
        </button>
        <button class="oauth-btn facebook">
          <svg>...</svg>
          Continue with Facebook
        </button>
        <button class="oauth-btn linkedin">
          <svg>...</svg>
          Continue with LinkedIn
        </button>
        <button class="oauth-btn apple">
          <svg>...</svg>
          Continue with Apple
        </button>
      </div>
      
      <div class="auth-footer">
        Don't have an account? 
        <a href="/signup">Sign up</a>
      </div>
    </div>
  </div>
</div>
```

### CSS Styling:
```css
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 2rem;
}

.auth-container {
  width: 100%;
  max-width: 450px;
}

.auth-card {
  background: white;
  border-radius: 8px;
  padding: 2.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.auth-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
}

.auth-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #555;
}

.forgot-link {
  display: block;
  text-align: center;
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.forgot-link:hover {
  text-decoration: underline;
}

.divider {
  text-align: center;
  margin: 2rem 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #ddd;
}

.divider span {
  background: white;
  padding: 0 1rem;
  color: #999;
  position: relative;
}

.oauth-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.oauth-btn {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.oauth-btn:hover {
  border-color: #333;
  background: #f9f9f9;
}

.oauth-btn.google {
  /* Google brand colors */
}

.oauth-btn.facebook {
  /* Facebook brand colors */
}

.auth-footer {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}
```

---

## 📱 Responsive Design

### Mobile (< 768px)
```css
@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }
  
  .navbar-actions {
    gap: 1rem;
  }
  
  .lang-btn span:not(:first-child) {
    display: none; /* Show only icon on mobile */
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .auth-card {
    padding: 1.5rem;
  }
}
```

---

## 🎨 Color Palette (Thinkific Style)

```css
:root {
  --primary: #333333;
  --secondary: #667eea;
  --text: #333333;
  --text-light: #666666;
  --border: #dddddd;
  --background: #ffffff;
  --background-light: #f5f5f5;
  --hover: #555555;
}
```

---

## ✅ Key Design Principles

1. **Clean & Minimal:** No clutter, focus on essentials
2. **Clear Hierarchy:** Logo left, actions right
3. **Consistent Spacing:** Generous padding and margins
4. **Subtle Shadows:** Cards have light shadows
5. **Smooth Transitions:** Hover effects are subtle
6. **Readable Typography:** Clear font sizes and weights
7. **Accessible:** Good contrast, clickable areas

---

## 🔗 Integration with Backend

All authentication flows remain the same as documented in `AUTH_FLOW_FRONTEND.md`. The UI design is just the visual layer - the API calls and logic stay the same.

---

This design guide provides the exact structure and styling for a clean, Thinkific-inspired navbar and authentication pages!

