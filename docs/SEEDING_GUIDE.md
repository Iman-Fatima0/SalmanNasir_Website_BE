# Database Seeding Guide

This guide explains how to seed your database with initial data for development and testing.

## 📋 Overview

The seeding system populates your database with:
- **Users** - Admin and student accounts
- **Instructors** - Instructor profiles with specializations
- **Products** - Course products with pricing
- **Courses** - Course data linked to products
- **Chapters** - Course chapters organized by order
- **Lessons** - Individual lessons within chapters
- **Course-Instructor Relationships** - Many-to-many associations

## 🚀 Quick Start

### Seed All Data

```bash
npm run seed
```

This will:
1. Connect to your database
2. Run all seeders in the correct order
3. Skip existing data (won't create duplicates)
4. Display a summary of seeded data

### Clear Seeded Data

```bash
npm run clear-seed
```

This will:
1. Delete all seeded data (except admin user)
2. Clear in reverse dependency order
3. Preserve admin user account

### Reset and Reseed

```bash
npm run clear-seed && npm run seed
```

## 📁 Seeder Files

All seeders are located in `src/seeders/`:

1. **001_seed_users.js** - User accounts
2. **002_seed_instructors.js** - Instructor profiles
3. **003_seed_products.js** - Product entries
4. **004_seed_courses.js** - Course data
5. **005_seed_chapters.js** - Chapter data
6. **006_seed_lessons.js** - Lesson data
7. **007_seed_course_instructors.js** - Course-Instructor relationships

## 👥 Seeded Users

### Admin Account
- **Email:** `admin@elcanadi.com`
- **Password:** `Admin123!`
- **Role:** Admin user with full access

### Student Accounts
- **Email:** `student@elcanadi.com` / **Password:** `Student123!`
- **Email:** `fatima@elcanadi.com` / **Password:** `Fatima123!`
- **Email:** `mohammed@elcanadi.com` / **Password:** `Mohammed123!`
- **Email:** `sara@elcanadi.com` / **Password:** `Sara123!`

All student accounts are email-verified and active.

## 👨‍🏫 Seeded Instructors

1. **Dr. Khaled Al-Mansouri**
   - Professor of Arabic Linguistics
   - 20+ years experience
   - Specializes in: Arabic Linguistics, Grammar

2. **Aisha Al-Zahra**
   - Modern Arabic Language Instructor
   - 15 years experience
   - Specializes in: Modern Standard Arabic, Levantine Dialect

3. **Omar Ibn Rashid**
   - Classical Arabic & Quranic Studies Expert
   - Specializes in: Classical Arabic, Quranic Studies

4. **Layla Al-Farsi**
   - Business Arabic & Professional Communication
   - Specializes in: Business Arabic, Professional Communication

5. **Yusuf Al-Mahmoud**
   - Arabic for Beginners Specialist
   - Specializes in: Beginner Arabic, Kids Arabic

## 📚 Seeded Products & Courses

### 1. Complete Arabic Mastery Program
- **Price:** $299.99
- **Level:** Beginner to Intermediate
- **Duration:** 50 hours (3000 minutes)
- **Chapters:** 10
- **Lessons:** 50
- **Instructors:** Dr. Khaled Al-Mansouri, Yusuf Al-Mahmoud

### 2. Business Arabic for Professionals
- **Price:** $199.99
- **Level:** Intermediate
- **Duration:** 40 hours (2400 minutes)
- **Chapters:** 8
- **Lessons:** 40
- **Instructor:** Layla Al-Farsi

### 3. Classical Arabic & Quranic Studies
- **Price:** $249.99
- **Level:** Advanced
- **Duration:** 60 hours (3600 minutes)
- **Chapters:** 12
- **Lessons:** 60
- **Instructor:** Omar Ibn Rashid

### 4. Levantine Arabic Dialect
- **Price:** $179.99
- **Level:** Beginner to Intermediate
- **Duration:** 45 hours (2700 minutes)
- **Chapters:** 9
- **Lessons:** 45
- **Instructor:** Aisha Al-Zahra

### 5. Arabic Grammar Fundamentals
- **Price:** $149.99
- **Level:** All Levels
- **Duration:** 75 hours (4500 minutes)
- **Chapters:** 15
- **Lessons:** 75
- **Instructors:** Dr. Khaled Al-Mansouri, Omar Ibn Rashid

### 6. Arabic for Kids
- **Price:** $99.99
- **Level:** Beginner
- **Duration:** 30 hours (1800 minutes)
- **Chapters:** 6
- **Lessons:** 30
- **Instructor:** Yusuf Al-Mahmoud

## 📖 Chapter Structure

Each course has multiple chapters with:
- Descriptive titles
- Detailed descriptions
- Sequential ordering
- Related lessons

Example chapters for "Complete Arabic Mastery Program":
1. Introduction to Arabic
2. Basic Vocabulary
3. Arabic Grammar Basics
4. Present Tense Verbs
5. Past Tense Verbs
6. Future Tense
7. Numbers and Counting
8. Daily Conversations
9. Reading and Writing
10. Advanced Communication

## 🎓 Lesson Structure

Each chapter contains approximately 5 lessons with:
- Descriptive titles
- Video URLs (placeholders)
- Duration: 15-35 minutes per lesson
- First lesson marked as preview (free access)

## 🔄 Seeding Order

Seeders must run in this specific order due to foreign key dependencies:

```
Users (no dependencies)
    ↓
Instructors (no dependencies)
    ↓
Products (no dependencies)
    ↓
Courses (depends on Products)
    ↓
Chapters (depends on Courses)
    ↓
Lessons (depends on Chapters)
    ↓
Course-Instructors (depends on Courses & Instructors)
```

## ⚠️ Important Notes

### Duplicate Prevention
- Seeders check for existing data before seeding
- Running `npm run seed` multiple times won't create duplicates
- To reseed, run `npm run clear-seed` first

### Password Security
- All passwords are hashed using bcrypt (12 rounds)
- Passwords follow the pattern: `[Name]123!`
- Change passwords in production!

### Placeholder Data
- Video URLs are placeholders: `https://example.com/videos/...`
- Avatar URLs use placeholder images: `https://i.pravatar.cc/150?img=...`
- Replace with actual URLs in production

### Database Connection
- Seeders automatically connect to the database
- Ensure your `.env` file is configured correctly
- Database will be created automatically if it doesn't exist

## 🛠️ Customization

### Adding More Data

To add more seeded data, edit the respective seeder file:

```javascript
// src/seeders/001_seed_users.js
const users = [
  // Add your user objects here
  {
    email: 'newuser@example.com',
    password: await bcrypt.hash('Password123!', 12),
    firstName: 'New',
    lastName: 'User',
    // ... other fields
  },
];
```

### Running Individual Seeders

You can run individual seeders programmatically:

```javascript
const seedUsers = require('./src/seeders/001_seed_users');
await seedUsers();
```

## 🐛 Troubleshooting

### "No products found" Error
- Ensure products are seeded before courses
- Run seeders in order: `npm run seed`

### "Foreign key constraint" Error
- Seeders must run in dependency order
- Use `npm run seed` to run all in correct order

### "Database connection failed"
- Check your `.env` file configuration
- Ensure PostgreSQL is running
- Verify database credentials

### "Data already exists"
- This is normal - seeders skip existing data
- To reseed: `npm run clear-seed && npm run seed`

## 📊 Data Summary

After seeding, you'll have:
- **5 Users** (1 admin + 4 students)
- **5 Instructors**
- **6 Products**
- **6 Courses**
- **60+ Chapters** (varies by course)
- **300+ Lessons** (5 per chapter)
- **8 Course-Instructor Relationships**

## ✅ Verification

After seeding, verify data:

```bash
# Check users
# Use your API or database client

# Check products
GET /api/products

# Check courses
GET /api/courses

# Check instructors
GET /api/instructors
```

---

For more information, see `src/seeders/README.md`

