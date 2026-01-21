# Frontend Implementation Guide

## 1. Update Auth Service - Add Profile Update Method

Add the `updateProfile` method to your auth service file (e.g., `src/services/auth.service.js` or `src/api/auth.js`):

```javascript
// If using Axios
import api from './api'; // or your axios instance

export const authService = {
  // ... existing methods ...
  
  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/me', profileData);
    return response.data;
  },
};
```

**OR if using Fetch API:**

```javascript
const API_BASE_URL = 'http://localhost:3000/api'; // Adjust to your backend URL

export const authService = {
  // Get current user
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.success ? data.data.user : null;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to update profile');
    }
    return data.data.user;
  },
};
```

---

## 2. Phone Number Validation Utility

Create a phone number validation utility (e.g., `src/utils/phoneValidation.js`):

```javascript
/**
 * Validates phone number format
 * @param {string} phone - Phone number to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return { isValid: true, error: null }; // Phone is optional
  }

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // Check if it has 11-15 digits
  if (digitsOnly.length < 11) {
    return {
      isValid: false,
      error: 'Phone number must contain at least 11 digits',
    };
  }

  if (digitsOnly.length > 15) {
    return {
      isValid: false,
      error: 'Phone number must not exceed 15 digits',
    };
  }

  return { isValid: true, error: null };
};

/**
 * Formats phone number for display (optional)
 * @param {string} phone - Phone number (digits only)
 * @returns {string} - Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  // Example: 12345678901 -> +1 (234) 567-8901
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};
```

---

## 3. Profile Update Form Component Example

Here's a React component example for updating the profile:

```jsx
import React, { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { validatePhone } from '../utils/phoneValidation';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    profileImage: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Load user data
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUser(userData);
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phone: userData.phone || '',
          profileImage: userData.profileImage || '',
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));

    // Validate phone number
    const validation = validatePhone(value);
    if (!validation.isValid) {
      setErrors((prev) => ({
        ...prev,
        phone: validation.error,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        phone: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrors({});

    // Validate phone number
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      setErrors({ phone: phoneValidation.error });
      return;
    }

    try {
      setSaving(true);
      const updatedUser = await authService.updateProfile(formData);
      setUser(updatedUser);
      setSuccessMessage('Profile updated successfully!');
      
      // Update user in context/localStorage if needed
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({
        submit: error.message || 'Failed to update profile. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h1>User Profile</h1>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {errors.submit && (
        <div className="alert alert-error">{errors.submit}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          {errors.firstName && (
            <span className="error">{errors.firstName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          {errors.lastName && (
            <span className="error">{errors.lastName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handlePhoneChange}
            placeholder="e.g., +12345678901 or 12345678901"
            maxLength={20}
          />
          <small>Enter 11-15 digits (spaces, dashes, and + are allowed)</small>
          {errors.phone && (
            <span className="error">{errors.phone}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="profileImage">Profile Image URL</label>
          <input
            type="url"
            id="profileImage"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
          {errors.profileImage && (
            <span className="error">{errors.profileImage}</span>
          )}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="disabled"
          />
          <small>Email cannot be changed</small>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default UserProfilePage;
```

---

## 4. Display Phone Number in User Profile

To display the phone number in your user profile component:

```jsx
import { formatPhone } from '../utils/phoneValidation';

const UserProfileDisplay = ({ user }) => {
  return (
    <div className="user-profile">
      <h2>{user.firstName} {user.lastName}</h2>
      <p>Email: {user.email}</p>
      {user.phone && (
        <p>Phone: {formatPhone(user.phone)}</p>
      )}
      {user.profileImage && (
        <img src={user.profileImage} alt="Profile" />
      )}
    </div>
  );
};
```

---

## 5. Update Auth Context (if using React Context)

If you're using an AuthContext, update it to include the profile update method:

```jsx
// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    updateProfile,
    refreshUser: loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

Then use it in your component:

```jsx
import { useAuth } from '../context/AuthContext';

const UserProfilePage = () => {
  const { user, updateProfile } = useAuth();
  // ... rest of your component
};
```

---

## 6. API Request Example (Axios Interceptor)

If using Axios, make sure your interceptor includes the token:

```javascript
// api.js or axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Your backend URL
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## Summary

**What you need to add:**

1. ✅ `updateProfile` method in your auth service
2. ✅ Phone number validation utility
3. ✅ Profile update form with phone number field
4. ✅ Display phone number in user profile
5. ✅ Update AuthContext (if using React Context)

**API Endpoint:**
- `PUT /api/auth/me` - Update user profile
- Requires: `Authorization: Bearer <token>`
- Body: `{ firstName, lastName, phone, profileImage }`
- Phone validation: 11-15 digits (formatted input accepted)

**Phone Number:**
- Accepts formatted input (spaces, dashes, + signs)
- Validates 11-15 digits
- Stored as digits only in backend
- Display with formatting utility (optional)
