# Test User Credentials

## 🔐 Login Credentials for Testing

Use these credentials to test the admin and user dashboards.

---

## 👨‍💼 Admin Account

**Email:** `admin@elcanadi.com`  
**Password:** `Admin123!`

**Details:**
- Full Name: Admin User
- Phone: +1234567890
- Email Verified: ✅ Yes
- Account Status: ✅ Active
- Role: Admin (full access)

**Use Case:**
- Access admin dashboard
- Manage courses
- Manage instructors
- View all users
- Full system access

---

## 👤 Student Accounts

### Student 1
**Email:** `student@elcanadi.com`  
**Password:** `Student123!`

**Details:**
- Full Name: Ahmed Ali
- Phone: +1234567891
- Email Verified: ✅ Yes
- Account Status: ✅ Active

---

### Student 2
**Email:** `fatima@elcanadi.com`  
**Password:** `Fatima123!`

**Details:**
- Full Name: Fatima Hassan
- Phone: +1234567892
- Email Verified: ✅ Yes
- Account Status: ✅ Active

---

### Student 3
**Email:** `mohammed@elcanadi.com`  
**Password:** `Mohammed123!`

**Details:**
- Full Name: Mohammed Ibrahim
- Phone: +1234567893
- Email Verified: ✅ Yes
- Account Status: ✅ Active

---

### Student 4
**Email:** `sara@elcanadi.com`  
**Password:** `Sara123!`

**Details:**
- Full Name: Sara Omar
- Phone: +1234567894
- Email Verified: ✅ Yes
- Account Status: ✅ Active

---

## 🚀 Quick Login Guide

### For Admin Dashboard:
1. Go to `/login` page
2. Enter:
   - Email: `admin@elcanadi.com`
   - Password: `Admin123!`
3. Click "Sign In"
4. You'll be redirected to admin dashboard

### For User Dashboard:
1. Go to `/login` page
2. Enter any student credentials:
   - Email: `student@elcanadi.com`
   - Password: `Student123!`
3. Click "Sign In"
4. You'll be redirected to user dashboard

---

## 📝 API Login Example

### Using cURL:
```bash
# Admin Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@elcanadi.com",
    "password": "Admin123!"
  }'

# Student Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@elcanadi.com",
    "password": "Student123!"
  }'
```

### Using JavaScript:
```javascript
// Admin Login
const adminLogin = async () => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@elcanadi.com',
      password: 'Admin123!',
    }),
  });

  const result = await response.json();
  console.log('Admin Token:', result.data.token);
  return result.data;
};

// Student Login
const studentLogin = async () => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'student@elcanadi.com',
      password: 'Student123!',
    }),
  });

  const result = await response.json();
  console.log('Student Token:', result.data.token);
  return result.data;
};
```

---

## 🔑 Expected Response

After successful login, you'll receive:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@elcanadi.com",
      "firstName": "Admin",
      "lastName": "User",
      "isEmailVerified": true,
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token** to use for authenticated requests:
```
Authorization: Bearer <token>
```

---

## 📋 Summary Table

| Email | Password | Role | Name |
|-------|----------|------|------|
| `admin@elcanadi.com` | `Admin123!` | Admin | Admin User |
| `student@elcanadi.com` | `Student123!` | Student | Ahmed Ali |
| `fatima@elcanadi.com` | `Fatima123!` | Student | Fatima Hassan |
| `mohammed@elcanadi.com` | `Mohammed123!` | Student | Mohammed Ibrahim |
| `sara@elcanadi.com` | `Sara123!` | Student | Sara Omar |

---

## ⚠️ Important Notes

1. **All passwords follow the pattern:** `[Name]123!`
2. **All accounts are email-verified** - no need to verify email
3. **All accounts are active** - ready to use immediately
4. **Admin account** has full system access
5. **Student accounts** have regular user access

---

## 🧪 Testing Scenarios

### Test Admin Dashboard:
1. Login with `admin@elcanadi.com`
2. Should see admin-specific features:
   - Course management
   - Instructor management
   - User management
   - Analytics/reports

### Test User Dashboard:
1. Login with any student account
2. Should see user-specific features:
   - Enrolled courses
   - Course progress
   - Profile settings
   - Course browsing

---

## 🔄 Reset Credentials

If you need to reset the database and reseed:

```bash
npm run clear-seed
npm run seed
```

This will recreate all users with the same credentials.

---

**Use these credentials to test both admin and user dashboards!**

