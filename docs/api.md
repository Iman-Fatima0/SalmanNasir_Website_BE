# API Documentation

## Authentication Endpoints

### Base URL
```
/api/auth
```

### 1. User Signup
**POST** `/signup`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isEmailVerified": false,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

---

### 2. User Login
**POST** `/login`

Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token_here"
  }
}
```

---

### 3. OAuth - Google
**GET** `/google`

Initiate Google OAuth login.

**Response:** Redirects to Google OAuth consent screen.

**Callback:** `/google/callback`

After successful authentication, redirects to frontend with token.

---

### 4. OAuth - Facebook
**GET** `/facebook`

Initiate Facebook OAuth login.

**Response:** Redirects to Facebook OAuth consent screen.

**Callback:** `/facebook/callback`

After successful authentication, redirects to frontend with token.

---

### 5. OAuth - LinkedIn
**GET** `/linkedin`

Initiate LinkedIn OAuth login.

**Response:** Redirects to LinkedIn OAuth consent screen.

**Callback:** `/linkedin/callback`

After successful authentication, redirects to frontend with token.

---

### 6. OAuth - Apple
**GET** `/apple`

Initiate Apple OAuth login.

**Response:** Redirects to Apple OAuth consent screen.

**Callback:** `/apple/callback` (POST)

After successful authentication, redirects to frontend with token.

---

### 7. Forgot Password
**POST** `/forgot-password`

Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If the email exists, a password reset link has been sent.",
  "data": {
    "message": "If the email exists, a password reset link has been sent."
  }
}
```

---

### 8. Reset Password
**POST** `/reset-password`

Reset password using token from email.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "newPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token_here"
  }
}
```

---

### 9. Get Current User
**GET** `/me`

Get authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isEmailVerified": true,
      "isActive": true
    }
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Optional, for validation errors
}
```

**Status Codes:**
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized (Authentication failed)
- `403` - Forbidden (Access denied)
- `404` - Not Found
- `500` - Internal Server Error
