# Authentication Flow for Frontend

## 🔐 Complete Authentication Flow Guide

This document explains exactly how to implement authentication in your frontend application.

---

## 📋 Authentication Methods Available

1. **Email/Password Signup**
2. **Email/Password Login**
3. **OAuth Login** (Google, Facebook, LinkedIn, Apple)
4. **Password Reset** (Forgot Password)

---

## 1️⃣ Email/Password Signup Flow

### Frontend Steps:

```
┌─────────────────────┐
│  User on /signup    │
│  Fills form:        │
│  - email            │
│  - password         │
│  - firstName        │
│  - lastName         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ POST /api/auth/signup│
│ Body: {             │
│   email,            │
│   password,         │
│   firstName,        │
│   lastName          │
│ }                   │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
 Success       Error
    │             │
    ▼             ▼
┌─────────┐   ┌─────────┐
│ Store   │   │ Show    │
│ Token   │   │ Error   │
└────┬────┘   └─────────┘
     │
     ▼
┌─────────────┐
│ Redirect to │
│ /dashboard │
└─────────────┘
```

### Implementation:

```javascript
// Signup function
const handleSignup = async (formData) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || null, // optional
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Store token
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      // Show error message
      console.error('Signup failed:', data.message);
      // Display errors: data.errors (array of validation errors)
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 2️⃣ Email/Password Login Flow

### Frontend Steps:

```
┌─────────────────────┐
│  User on /login     │
│  Fills form:        │
│  - email            │
│  - password         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ POST /api/auth/login│
│ Body: {             │
│   email,            │
│   password          │
│ }                   │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
 Success       Error
    │             │
    ▼             ▼
┌─────────┐   ┌─────────┐
│ Store   │   │ Show    │
│ Token   │   │ Error   │
└────┬────┘   └─────────┘
     │
     ▼
┌─────────────┐
│ Redirect to │
│ /dashboard  │
└─────────────┘
```

### Implementation:

```javascript
// Login function
const handleLogin = async (email, password) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Store token
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      // Redirect to dashboard or previous page
      const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
      window.location.href = redirectTo;
    } else {
      // Show error message
      console.error('Login failed:', data.message);
      alert(data.message || 'Invalid email or password');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
};
```

---

## 3️⃣ OAuth Login Flow (Google, Facebook, LinkedIn, Apple)

### Frontend Steps:

```
┌─────────────────────────────┐
│ User clicks "Sign in with   │
│ Google" button              │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Redirect to:                │
│ /api/auth/google            │
│ (or facebook/linkedin/apple)│
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ User authorizes on OAuth     │
│ provider (Google/Facebook)  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ OAuth provider redirects to:│
│ /api/auth/google/callback   │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Backend processes OAuth     │
│ Creates/updates user         │
│ Generates JWT token         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Backend redirects to:       │
│ /auth/callback?token=xxx     │
│ &user=xxx                   │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Frontend /auth/callback page │
│ Extracts token from URL      │
│ Stores token                 │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Redirect to /dashboard       │
└─────────────────────────────┘
```

### Implementation:

#### Step 1: OAuth Login Button
```javascript
// In your Login component
const handleGoogleLogin = () => {
  // Redirect to backend OAuth endpoint
  window.location.href = 'http://localhost:3000/api/auth/google';
};

const handleFacebookLogin = () => {
  window.location.href = 'http://localhost:3000/api/auth/facebook';
};

const handleLinkedInLogin = () => {
  window.location.href = 'http://localhost:3000/api/auth/linkedin';
};

const handleAppleLogin = () => {
  window.location.href = 'http://localhost:3000/api/auth/apple';
};
```

#### Step 2: OAuth Callback Handler Page
```javascript
// Create a page at /auth/callback
// This page handles the OAuth redirect

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token and user from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');
    
    if (token && userParam) {
      try {
        // Decode user data
        const user = JSON.parse(decodeURIComponent(userParam));
        
        // Store token and user
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login?error=oauth_failed');
      }
    } else {
      // No token - OAuth failed
      navigate('/login?error=oauth_failed');
    }
  }, [navigate]);

  return (
    <div>
      <p>Completing authentication...</p>
    </div>
  );
};

export default OAuthCallback;
```

#### Step 3: Route Setup (React Router example)
```javascript
// In your router
<Route path="/auth/callback" element={<OAuthCallback />} />
```

---

## 4️⃣ Password Reset Flow

### Frontend Steps:

```
┌─────────────────────────────┐
│ User on /forgot-password    │
│ Enters email                │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ POST /api/auth/forgot-      │
│ password                    │
│ Body: { email }             │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Show success message        │
│ "Check your email"          │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ User clicks link in email   │
│ Link: /reset-password?token=│
│ xxx                         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ User on /reset-password     │
│ Enters new password         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ POST /api/auth/reset-       │
│ password                    │
│ Body: { token, password }   │
└──────────────┬──────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
 Success               Error
    │                     │
    ▼                     ▼
┌─────────┐         ┌─────────┐
│ Auto    │         │ Show    │
│ Login   │         │ Error   │
└────┬────┘         └─────────┘
     │
     ▼
┌─────────────┐
│ Redirect to │
│ /dashboard  │
└─────────────┘
```

### Implementation:

#### Forgot Password
```javascript
const handleForgotPassword = async (email) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (data.success) {
      // Show success message (don't reveal if email exists)
      alert('If the email exists, a password reset link has been sent.');
    } else {
      alert('An error occurred. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### Reset Password
```javascript
// On /reset-password page
const handleResetPassword = async (password) => {
  // Get token from URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    alert('Invalid reset link');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        password: password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Auto-login with new token
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      alert(data.message || 'Password reset failed');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 5️⃣ Get Current User (Check Authentication)

### Implementation:

```javascript
// Check if user is authenticated and get user data
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return null; // Not authenticated
  }

  try {
    const response = await fetch('http://localhost:3000/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      return data.data.user;
    } else {
      // Token invalid - clear it
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
};
```

---

## 6️⃣ Protected Routes

### Implementation (React Router example):

```javascript
// ProtectedRoute component
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirect to login with return URL
    return <Navigate to={`/login?redirect=${window.location.pathname}`} />;
  }
  
  return children;
};

// Usage
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

---

## 7️⃣ Logout

### Implementation:

```javascript
const handleLogout = () => {
  // Clear token and user data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Redirect to home or login
  window.location.href = '/login';
};
```

---

## 8️⃣ Token Management

### Store Token:
```javascript
// After successful login/signup
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
```

### Use Token in API Calls:
```javascript
// Add to all authenticated requests
const token = localStorage.getItem('token');

fetch('http://localhost:3000/api/courses', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

### Check Token Expiration:
```javascript
// The backend will return 401 if token is expired
// Handle in your API interceptor:

fetch(url, options)
  .then(response => {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return response;
  });
```

---

## 📝 Complete Authentication Service Example

```javascript
// src/services/authService.js

const API_BASE_URL = 'http://localhost:3000/api';

class AuthService {
  // Signup
  async signup(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await response.json();
  }

  // Login
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  }

  // Get current user
  async getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    return data.success ? data.data.user : null;
  }

  // Forgot password
  async forgotPassword(email) {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  }

  // Reset password
  async resetPassword(token, password) {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    return await response.json();
  }

  // OAuth redirects
  googleLogin() {
    window.location.href = `${API_BASE_URL}/auth/google`;
  }

  facebookLogin() {
    window.location.href = `${API_BASE_URL}/auth/facebook`;
  }

  linkedinLogin() {
    window.location.href = `${API_BASE_URL}/auth/linkedin`;
  }

  appleLogin() {
    window.location.href = `${API_BASE_URL}/auth/apple`;
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Check if authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Get stored token
  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();
```

---

## 🎯 Quick Reference

### URLs:
- Signup: `POST http://localhost:3000/api/auth/signup`
- Login: `POST http://localhost:3000/api/auth/login`
- Get User: `GET http://localhost:3000/api/auth/me` (requires token)
- Forgot Password: `POST http://localhost:3000/api/auth/forgot-password`
- Reset Password: `POST http://localhost:3000/api/auth/reset-password`
- OAuth: `GET http://localhost:3000/api/auth/{provider}`

### Token Storage:
- Store: `localStorage.setItem('token', token)`
- Retrieve: `localStorage.getItem('token')`
- Remove: `localStorage.removeItem('token')`

### Headers for Authenticated Requests:
```
Authorization: Bearer <token>
```

---

## ✅ Implementation Checklist

- [ ] Signup page with form
- [ ] Login page with form
- [ ] OAuth login buttons (Google, Facebook, LinkedIn, Apple)
- [ ] OAuth callback handler page (`/auth/callback`)
- [ ] Forgot password page
- [ ] Reset password page (with token from URL)
- [ ] Token storage (localStorage/cookies)
- [ ] Protected route wrapper
- [ ] Logout functionality
- [ ] Token refresh/validation
- [ ] Error handling for auth failures
- [ ] Auto-redirect after login

---

This is the complete authentication flow you need to implement in your frontend!

