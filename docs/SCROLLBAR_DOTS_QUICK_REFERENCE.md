# Quick Reference: Dot Scrollbar

## 🚀 Quick Copy-Paste Solution

### CSS (Add to your stylesheet)

```css
/* Custom Scrollbar with Dots */
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
  /* Dots pattern on track */
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
  position: relative;
}

/* Moving dot on scrollbar thumb */
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

## 🎯 Alternative: Side Dot Indicator

### HTML Structure
```html
<div class="scroll-container">
  <div class="dot-indicator">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot active"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
  <div class="content">
    <!-- Your content here -->
  </div>
</div>
```

### CSS
```css
.scroll-container {
  position: relative;
  height: 100vh;
  overflow-y: auto;
}

.dot-indicator {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ccc;
  transition: all 0.3s;
  cursor: pointer;
}

.dot.active {
  background: #667eea;
  transform: scale(1.5);
  box-shadow: 0 0 12px rgba(102, 126, 234, 0.6);
}
```

### JavaScript (for active dot)
```javascript
const container = document.querySelector('.scroll-container');
const dots = document.querySelectorAll('.dot');

container.addEventListener('scroll', () => {
  const scrollTop = container.scrollTop;
  const scrollHeight = container.scrollHeight - container.clientHeight;
  const scrollPercentage = scrollTop / scrollHeight;
  const activeIndex = Math.round(scrollPercentage * (dots.length - 1));
  
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === activeIndex);
  });
});
```

---

**That's it! Choose the style that fits your design.**

