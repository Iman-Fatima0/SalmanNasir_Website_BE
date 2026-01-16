# Custom Scrollbar with Dots (Up/Down Animation)

## 🎯 Overview

This guide shows how to create a custom scrollbar with dots that move up and down as you scroll.

## 🎨 CSS Solution

### Option 1: Pure CSS Custom Scrollbar with Dots

```css
/* Custom Scrollbar with Dots */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
  position: relative;
}

/* Dots on the scrollbar track */
::-webkit-scrollbar-track::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  width: 4px;
  height: 100%;
  background-image: repeating-linear-gradient(
    to bottom,
    #999 0px,
    #999 4px,
    transparent 4px,
    transparent 8px
  );
  transform: translateX(-50%);
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
  background-image: repeating-linear-gradient(
    to bottom,
    #666 0px,
    #666 4px,
    transparent 4px,
    transparent 8px
  );
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* For Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
```

### Option 2: Animated Dots Scrollbar Indicator

```css
/* Container with custom scrollbar */
.scrollable-container {
  position: relative;
  overflow-y: auto;
  max-height: 100vh;
}

/* Custom scrollbar */
.scrollable-container::-webkit-scrollbar {
  width: 16px;
}

.scrollable-container::-webkit-scrollbar-track {
  background: linear-gradient(
    to bottom,
    #f0f0f0 0%,
    #f0f0f0 100%
  );
  background-image: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 8px,
    #ddd 8px,
    #ddd 10px
  );
  border-radius: 10px;
}

.scrollable-container::-webkit-scrollbar-thumb {
  background: linear-gradient(
    to bottom,
    #667eea 0%,
    #764ba2 100%
  );
  border-radius: 10px;
  position: relative;
}

.scrollable-container::-webkit-scrollbar-thumb::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 8px 0 white, 0 16px 0 white, 0 24px 0 white;
  animation: scrollDots 1s linear infinite;
}

@keyframes scrollDots {
  0% {
    transform: translateX(-50%) translateY(0);
  }
  100% {
    transform: translateX(-50%) translateY(20px);
  }
}
```

### Option 3: Interactive Dot Scrollbar with JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
    }

    .scroll-container {
      position: relative;
      height: 100vh;
      overflow-y: auto;
      overflow-x: hidden;
    }

    /* Custom scrollbar */
    .scroll-container::-webkit-scrollbar {
      width: 20px;
    }

    .scroll-container::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
      position: relative;
    }

    .scroll-container::-webkit-scrollbar-thumb {
      background: linear-gradient(to bottom, #667eea, #764ba2);
      border-radius: 10px;
      position: relative;
    }

    .scroll-container::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(to bottom, #5568d3, #6a3f8f);
    }

    /* Dot indicator */
    .scroll-dot-indicator {
      position: fixed;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    }

    .scroll-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #999;
      transition: all 0.3s ease;
      opacity: 0.3;
    }

    .scroll-dot.active {
      background: #667eea;
      opacity: 1;
      transform: scale(1.3);
      box-shadow: 0 0 8px rgba(102, 126, 234, 0.5);
    }

    /* Content */
    .content {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .section {
      min-height: 100vh;
      padding: 2rem;
      margin-bottom: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body>
  <div class="scroll-container" id="scrollContainer">
    <div class="scroll-dot-indicator" id="dotIndicator"></div>
    <div class="content">
      <div class="section">Section 1</div>
      <div class="section">Section 2</div>
      <div class="section">Section 3</div>
      <div class="section">Section 4</div>
      <div class="section">Section 5</div>
    </div>
  </div>

  <script>
    const scrollContainer = document.getElementById('scrollContainer');
    const dotIndicator = document.getElementById('dotIndicator');
    const sections = document.querySelectorAll('.section');
    
    // Create dots based on number of sections
    sections.forEach(() => {
      const dot = document.createElement('div');
      dot.className = 'scroll-dot';
      dotIndicator.appendChild(dot);
    });

    // Update active dot based on scroll position
    scrollContainer.addEventListener('scroll', () => {
      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const scrollPercentage = scrollTop / scrollHeight;
      
      const dots = dotIndicator.querySelectorAll('.scroll-dot');
      const activeIndex = Math.round(scrollPercentage * (dots.length - 1));
      
      dots.forEach((dot, index) => {
        if (index === activeIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    });

    // Click on dot to scroll to section
    const dots = dotIndicator.querySelectorAll('.scroll-dot');
    dots.forEach((dot, index) => {
      dot.style.pointerEvents = 'auto';
      dot.style.cursor = 'pointer';
      dot.addEventListener('click', () => {
        sections[index].scrollIntoView({ behavior: 'smooth' });
      });
    });
  </script>
</body>
</html>
```

### Option 4: Minimal Dot Scrollbar (Recommended)

```css
/* Minimal Dot Scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
  /* Dots pattern */
  background-image: 
    radial-gradient(circle at 50% 10%, #999 2px, transparent 2px),
    radial-gradient(circle at 50% 30%, #999 2px, transparent 2px),
    radial-gradient(circle at 50% 50%, #999 2px, transparent 2px),
    radial-gradient(circle at 50% 70%, #999 2px, transparent 2px),
    radial-gradient(circle at 50% 90%, #999 2px, transparent 2px);
  background-size: 12px 100%;
  background-repeat: no-repeat;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #667eea, #764ba2);
  border-radius: 10px;
  /* Moving dot on thumb */
  position: relative;
}

::-webkit-scrollbar-thumb::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #5568d3, #6a3f8f);
}
```

## 🎯 React Component with Dot Scrollbar

```jsx
// DotScrollbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import './DotScrollbar.css';

const DotScrollbar = ({ children, sections = 5 }) => {
  const [activeDot, setActiveDot] = useState(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const scrollPercentage = scrollTop / scrollHeight;
      const newActiveDot = Math.round(scrollPercentage * (sections - 1));
      setActiveDot(newActiveDot);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (index) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const targetScroll = (index / (sections - 1)) * scrollHeight;
    container.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  return (
    <div className="dot-scrollbar-container">
      <div className="scroll-dot-indicator">
        {Array.from({ length: sections }).map((_, index) => (
          <div
            key={index}
            className={`scroll-dot ${activeDot === index ? 'active' : ''}`}
            onClick={() => scrollToSection(index)}
          />
        ))}
      </div>
      <div className="scroll-content" ref={scrollContainerRef}>
        {children}
      </div>
    </div>
  );
};

export default DotScrollbar;
```

```css
/* DotScrollbar.css */
.dot-scrollbar-container {
  position: relative;
  height: 100vh;
  display: flex;
}

.scroll-dot-indicator {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scroll-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ccc;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.4;
}

.scroll-dot:hover {
  opacity: 0.7;
  transform: scale(1.2);
}

.scroll-dot.active {
  background: #667eea;
  opacity: 1;
  transform: scale(1.5);
  box-shadow: 0 0 12px rgba(102, 126, 234, 0.6);
}

.scroll-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

.scroll-content::-webkit-scrollbar {
  width: 12px;
}

.scroll-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.scroll-content::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #667eea, #764ba2);
  border-radius: 10px;
}

.scroll-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #5568d3, #6a3f8f);
}
```

## 🎨 Usage in React

```jsx
// App.jsx or your component
import DotScrollbar from './components/DotScrollbar';

function App() {
  return (
    <DotScrollbar sections={5}>
      <div className="section">Section 1</div>
      <div className="section">Section 2</div>
      <div className="section">Section 3</div>
      <div className="section">Section 4</div>
      <div className="section">Section 5</div>
    </DotScrollbar>
  );
}
```

## 🚀 Quick Implementation (Global Styles)

Add this to your global CSS file:

```css
/* Global Dot Scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

::-webkit-scrollbar {
  width: 14px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
  /* Static dots on track */
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 6px,
    #ddd 6px,
    #ddd 8px
  );
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #667eea, #764ba2);
  border-radius: 10px;
  /* Moving dot indicator */
  position: relative;
}

::-webkit-scrollbar-thumb::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.9);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #5568d3, #6a3f8f);
}
```

## 📱 Responsive Design

```css
/* Hide custom scrollbar on mobile */
@media (max-width: 768px) {
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  .scroll-dot-indicator {
    display: none; /* Hide dot indicator on mobile */
  }
}
```

---

**Choose the option that best fits your design needs!**

