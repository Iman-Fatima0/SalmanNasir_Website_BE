# Cookie Consent Banner Implementation Guide

## Overview

This guide helps you implement a GDPR/CCPA-compliant cookie consent banner for your website.

## Required Features

### 1. Cookie Consent Banner
- Display on first visit
- Allow users to accept/reject/customize
- Remember user's choice
- Show again if preferences change

### 2. Cookie Categories
- Essential (cannot be disabled)
- Functional (can be disabled)
- Analytics (can be disabled)
- Third-Party (can be disabled)

### 3. Cookie Settings Page
- Allow users to change preferences
- Show what each cookie does
- Easy to understand interface

## Implementation Options

### Option 1: Use a Cookie Consent Library (Recommended)

#### React Cookie Consent Libraries

**1. react-cookie-consent**
```bash
npm install react-cookie-consent
```

**Example:**
```jsx
import CookieConsent from "react-cookie-consent";

function App() {
  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        declineButtonText="Decline"
        enableDeclineButton
        cookieName="cookieConsent"
        expires={365}
        onAccept={() => {
          // Enable analytics cookies
        }}
        onDecline={() => {
          // Disable analytics cookies
        }}
      >
        We use cookies to enhance your experience.{" "}
        <a href="/cookie-policy">Learn more</a>
      </CookieConsent>
    </>
  );
}
```

**2. react-cookie-banner**
```bash
npm install react-cookie-banner
```

**3. Cookie Consent (Vanilla JS)**
- [Cookie Consent by Osano](https://www.osano.com/cookieconsent)
- [Cookiebot](https://www.cookiebot.com/)

### Option 2: Custom Implementation

#### React Component Example

```jsx
// components/CookieConsent.jsx
import { useState, useEffect } from 'react';
import './CookieConsent.css';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true
    functional: true,
    analytics: false,
    thirdParty: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
      applyCookiePreferences(savedPreferences);
    }
  }, []);

  const applyCookiePreferences = (prefs) => {
    // Enable/disable analytics based on preferences
    if (prefs.analytics) {
      // Initialize Google Analytics, etc.
      // gtag('consent', 'update', { analytics_storage: 'granted' });
    } else {
      // Disable analytics
      // gtag('consent', 'update', { analytics_storage: 'denied' });
    }

    // Enable/disable third-party cookies
    if (prefs.thirdParty) {
      // Allow third-party cookies
    } else {
      // Block third-party cookies
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
      thirdParty: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    applyCookiePreferences(allAccepted);
    setShowBanner(false);
  };

  const handleRejectNonEssential = () => {
    const onlyEssential = {
      essential: true,
      functional: false,
      analytics: false,
      thirdParty: false,
    };
    setPreferences(onlyEssential);
    localStorage.setItem('cookieConsent', JSON.stringify(onlyEssential));
    applyCookiePreferences(onlyEssential);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    applyCookiePreferences(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-consent-overlay">
      <div className="cookie-consent-banner">
        <div className="cookie-consent-content">
          <h3>🍪 We Use Cookies</h3>
          <p>
            We use cookies to enhance your experience, analyze site usage, and assist in marketing efforts.
            <a href="/cookie-policy"> Learn more</a>
          </p>

          {!showSettings ? (
            <div className="cookie-consent-buttons">
              <button onClick={handleAcceptAll} className="btn-accept">
                Accept All
              </button>
              <button onClick={handleRejectNonEssential} className="btn-reject">
                Reject Non-Essential
              </button>
              <button onClick={() => setShowSettings(true)} className="btn-customize">
                Customize
              </button>
            </div>
          ) : (
            <div className="cookie-settings">
              <div className="cookie-category">
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.essential}
                    disabled
                  />
                  <strong>Essential Cookies</strong> (Required)
                  <p>Necessary for the website to function</p>
                </label>
              </div>

              <div className="cookie-category">
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) =>
                      setPreferences({ ...preferences, functional: e.target.checked })
                    }
                  />
                  <strong>Functional Cookies</strong>
                  <p>Remember your preferences and settings</p>
                </label>
              </div>

              <div className="cookie-category">
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences({ ...preferences, analytics: e.target.checked })
                    }
                  />
                  <strong>Analytics Cookies</strong>
                  <p>Help us understand how you use our website</p>
                </label>
              </div>

              <div className="cookie-category">
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.thirdParty}
                    onChange={(e) =>
                      setPreferences({ ...preferences, thirdParty: e.target.checked })
                    }
                  />
                  <strong>Third-Party Cookies</strong>
                  <p>Used by OAuth providers (Google, Facebook, etc.)</p>
                </label>
              </div>

              <div className="cookie-settings-buttons">
                <button onClick={handleSavePreferences} className="btn-save">
                  Save Preferences
                </button>
                <button onClick={() => setShowSettings(false)} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
```

#### CSS Example

```css
/* CookieConsent.css */
.cookie-consent-overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  padding: 20px;
}

.cookie-consent-banner {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cookie-consent-content h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
}

.cookie-consent-content p {
  margin: 0 0 20px 0;
  color: #666;
  line-height: 1.6;
}

.cookie-consent-content a {
  color: #007bff;
  text-decoration: underline;
}

.cookie-consent-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.cookie-consent-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn-accept {
  background: #007bff;
  color: white;
}

.btn-accept:hover {
  background: #0056b3;
}

.btn-reject {
  background: #6c757d;
  color: white;
}

.btn-reject:hover {
  background: #545b62;
}

.btn-customize {
  background: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-customize:hover {
  background: #f8f9fa;
}

.cookie-settings {
  margin-top: 20px;
}

.cookie-category {
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
}

.cookie-category label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
}

.cookie-category input[type="checkbox"] {
  margin-right: 12px;
  margin-top: 4px;
}

.cookie-category strong {
  display: block;
  margin-bottom: 4px;
}

.cookie-category p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.cookie-settings-buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn-save {
  background: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel {
  background: transparent;
  color: #6c757d;
  padding: 10px 20px;
  border: 1px solid #6c757d;
  border-radius: 4px;
  cursor: pointer;
}
```

## Cookie Settings Page

Create a dedicated page at `/cookie-settings`:

```jsx
// pages/CookieSettingsPage.jsx
import { useState, useEffect } from 'react';
import CookieConsent from '../components/CookieConsent';

const CookieSettingsPage = () => {
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: true,
    analytics: false,
    thirdParty: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      setPreferences(JSON.parse(consent));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    // Apply preferences
    alert('Cookie preferences saved!');
  };

  return (
    <div className="cookie-settings-page">
      <h1>Cookie Settings</h1>
      <p>Manage your cookie preferences</p>
      
      {/* Same cookie settings UI as in CookieConsent component */}
      
      <button onClick={handleSave}>Save Preferences</button>
    </div>
  );
};
```

## Backend Integration

### Store Cookie Preferences (Optional)

If you want to store preferences on the backend:

```javascript
// POST /api/user/cookie-preferences
router.post('/cookie-preferences', authenticate, async (req, res) => {
  const { preferences } = req.body;
  
  await userRepository.update(req.user.id, {
    cookiePreferences: preferences,
  });
  
  return response.success(res, { preferences }, 'Cookie preferences saved');
});
```

## Testing Checklist

- [ ] Banner appears on first visit
- [ ] Banner doesn't appear after accepting/rejecting
- [ ] Preferences are saved correctly
- [ ] Analytics cookies are enabled/disabled based on preferences
- [ ] Third-party cookies work/don't work based on preferences
- [ ] Cookie settings page works
- [ ] Mobile responsive
- [ ] Accessible (keyboard navigation, screen readers)
- [ ] GDPR compliant
- [ ] CCPA compliant (if applicable)

## Legal Requirements

### GDPR (EU)
- ✅ Obtain explicit consent before setting non-essential cookies
- ✅ Provide clear information about cookie usage
- ✅ Allow users to withdraw consent
- ✅ Document consent

### CCPA (California)
- ✅ Provide opt-out mechanism
- ✅ Disclose cookie usage
- ✅ Honor opt-out requests

## Resources

- [GDPR Cookie Consent Requirements](https://gdpr.eu/cookies/)
- [CCPA Cookie Requirements](https://oag.ca.gov/privacy/ccpa)
- [Cookie Consent Best Practices](https://www.cookielaw.org/)

