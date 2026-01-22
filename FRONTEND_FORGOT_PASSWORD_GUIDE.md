# Frontend: Forgot Password Flow Implementation Guide

## 🔄 Complete Flow Overview

```
User clicks "Forgot Password"
         │
         ▼
User enters email on /forgot-password page
         │
         ▼
POST /api/auth/forgot-password
         │
         ▼
Backend sends email with reset link
         │
         ▼
User clicks link in email
         │
         ▼
Redirects to /reset-password?token=xxx
         │
         ▼
User enters new password
         │
         ▼
POST /api/auth/reset-password
         │
         ▼
Password reset + Auto login
         │
         ▼
Redirect to /dashboard
```

---

## 📋 Step-by-Step Implementation

### **Step 1: Forgot Password Page** (`/forgot-password`)

**What to Build:**
- Form with email input field
- Submit button
- Link back to login page
- Success/error message display

**API Call:**
```javascript
POST /api/auth/forgot-password
Content-Type: application/json

Body: {
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "If the email exists, a password reset link has been sent.",
  "data": {
    "message": "If the email exists, a password reset link has been sent."
  }
}
```

**Response (Error - Validation):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

**Important Notes:**
- ✅ Always show the same success message (don't reveal if email exists)
- ✅ The message is: "If the email exists, a password reset link has been sent."
- ✅ This is for security (prevents email enumeration)

---

### **Step 2: Reset Password Page** (`/reset-password`)

**What to Build:**
- Form with password input (and confirm password field)
- Submit button
- Display token from URL query parameter
- Success/error message display
- Auto-redirect to dashboard on success

**URL Format:**
```
/reset-password?token=abc123xyz789...
```

**API Call:**
```javascript
POST /api/auth/reset-password
Content-Type: application/json

Body: {
  "token": "abc123xyz789...",  // From URL query parameter
  "password": "newPassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Password reset successful",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isEmailVerified": true,
      "isActive": true
    },
    "token": "jwt_token_here"
  }
}
```

**Response (Error - Invalid Token):**
```json
{
  "success": false,
  "message": "Invalid or expired password reset token"
}
```

**Response (Error - Validation):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

**Important Notes:**
- ✅ Token expires after **10 minutes**
- ✅ Token is single-use (invalidated after reset)
- ✅ On success, user is automatically logged in (token provided)
- ✅ Store the token and redirect to dashboard

---

## 💻 Frontend Code Examples

### **1. Forgot Password Component**

```javascript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/api/auth/forgot-password', {
        email: email.trim(),
      });

      if (response.data.success) {
        setMessage(response.data.message);
        // Optionally redirect after showing message
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].message);
      } else {
        setError(err.response?.data?.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <h2>Forgot Password</h2>
      <p>Enter your email address and we'll send you a link to reset your password.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="your@email.com"
          />
        </div>

        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <Link to="/login">Back to Login</Link>
    </div>
  );
};

export default ForgotPasswordPage;
```

---

### **2. Reset Password Component**

```javascript
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Invalid reset link. Please request a new password reset.');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset link');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/reset-password', {
        token,
        password,
      });

      if (response.data.success) {
        // Store token for auto-login
        const authToken = response.data.data.token;
        localStorage.setItem('token', authToken);
        
        // Store user data if needed
        localStorage.setItem('user', JSON.stringify(response.data.data.user));

        // Show success message
        alert('Password reset successful! Redirecting to dashboard...');

        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].message);
      } else {
        setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="reset-password-page">
        <h2>Invalid Reset Link</h2>
        <p>{error}</p>
        <Link to="/forgot-password">Request New Reset Link</Link>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <h2>Reset Password</h2>
      <p>Enter your new password below.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={8}
            placeholder="At least 8 characters"
          />
          <small>Password must be at least 8 characters long</small>
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            placeholder="Re-enter your password"
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <Link to="/login">Back to Login</Link>
    </div>
  );
};

export default ResetPasswordPage;
```

---

## 🔗 Route Setup (React Router Example)

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Other routes */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 📝 API Details

### **1. Forgot Password Endpoint**

**URL:** `POST /api/auth/forgot-password`

**Request:**
```javascript
{
  "email": "user@example.com"
}
```

**Validation Rules:**
- Email must be valid format
- Email is required

**Response:**
- Always returns success message (for security)
- Email is sent if user exists
- Token expires in 10 minutes

---

### **2. Reset Password Endpoint**

**URL:** `POST /api/auth/reset-password`

**Request:**
```javascript
{
  "token": "reset_token_from_email",
  "password": "newPassword123"
}
```

**Validation Rules:**
- Token is required
- Password must be at least 8 characters
- Password max 100 characters

**Response:**
- Returns user data and JWT token on success
- Token is single-use (invalidated after use)
- User is automatically logged in

---

## ✅ Implementation Checklist

### Forgot Password Page
- [ ] Create `/forgot-password` route
- [ ] Add email input field
- [ ] Add form validation (email format)
- [ ] Call `POST /api/auth/forgot-password`
- [ ] Show success message (same message regardless of email existence)
- [ ] Handle validation errors
- [ ] Add "Back to Login" link
- [ ] Optional: Auto-redirect to login after 3 seconds

### Reset Password Page
- [ ] Create `/reset-password` route
- [ ] Extract token from URL query parameter (`?token=xxx`)
- [ ] Validate token exists (show error if missing)
- [ ] Add password input field
- [ ] Add confirm password field
- [ ] Add form validation:
  - [ ] Password min 8 characters
  - [ ] Passwords match
- [ ] Call `POST /api/auth/reset-password`
- [ ] Store JWT token on success
- [ ] Redirect to dashboard on success
- [ ] Handle errors (invalid/expired token)
- [ ] Add "Back to Login" link
- [ ] Show helpful error messages

### Email Link Handling
- [ ] Email contains link: `{FRONTEND_URL}/reset-password?token=xxx`
- [ ] Frontend should handle this URL format
- [ ] Extract token from query parameter

---

## 🎨 UI/UX Recommendations

### Forgot Password Page
1. **Simple Design:**
   - Email input field
   - Submit button
   - Success message area
   - Link to login page

2. **Success Message:**
   - Show: "If the email exists, a password reset link has been sent."
   - Optionally: "Please check your email inbox."
   - Don't reveal if email exists or not

3. **Error Handling:**
   - Show validation errors clearly
   - Highlight invalid fields

### Reset Password Page
1. **Password Requirements:**
   - Show: "Password must be at least 8 characters"
   - Real-time validation feedback

2. **Success Flow:**
   - Show success message
   - Auto-redirect to dashboard after 2-3 seconds
   - Or show "Redirecting..." message

3. **Error Handling:**
   - Invalid token: "This reset link is invalid or has expired. Please request a new one."
   - Expired token: Same message (token expires in 10 minutes)
   - Validation errors: Show specific field errors

---

## ⚠️ Important Security Notes

1. **Email Enumeration Prevention:**
   - Always show the same success message
   - Don't reveal if email exists in system

2. **Token Security:**
   - Tokens expire in 10 minutes
   - Tokens are single-use (invalidated after reset)
   - Tokens are cryptographically secure

3. **Password Requirements:**
   - Minimum 8 characters
   - Enforce on both frontend and backend

4. **Auto-Login:**
   - User is automatically logged in after successful reset
   - Store JWT token securely (localStorage or httpOnly cookie)

---

## 🔍 Error Scenarios

### Scenario 1: Invalid Email Format
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### Scenario 2: Invalid/Expired Token
```json
{
  "success": false,
  "message": "Invalid or expired password reset token"
}
```

### Scenario 3: Password Too Short
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

---

## 📧 Email Template (Backend Handles This)

The backend automatically sends an email with:
- Subject: "Reset Your Password"
- Reset link: `{FRONTEND_URL}/reset-password?token={token}`
- User's first name in greeting

**Frontend doesn't need to handle email sending** - it's done by the backend.

---

## 🚀 Quick Start Summary

1. **Create Forgot Password Page:**
   - Route: `/forgot-password`
   - Form: Email input → POST `/api/auth/forgot-password`
   - Show success message

2. **Create Reset Password Page:**
   - Route: `/reset-password`
   - Extract token from URL: `?token=xxx`
   - Form: Password inputs → POST `/api/auth/reset-password`
   - Store token and redirect to dashboard

3. **Add Links:**
   - Login page: "Forgot Password?" → `/forgot-password`
   - Forgot password page: "Back to Login" → `/login`

---

**That's it! The flow is straightforward. Let me know if you need clarification on any part.** 🎉
