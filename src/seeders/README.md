# Database Seeders

This directory contains seeders for populating the database with initial data.

## Seeder Files

1. **001_seed_users.js** - Seeds user accounts (admin, students)
2. **002_seed_instructors.js** - Seeds instructor profiles
3. **003_seed_products.js** - Seeds product entries (courses)
4. **004_seed_courses.js** - Seeds course data linked to products
5. **005_seed_chapters.js** - Seeds chapters for each course
6. **006_seed_lessons.js** - Seeds lessons for each chapter
7. **007_seed_course_instructors.js** - Seeds many-to-many relationships between courses and instructors

## Running Seeders

### Run all seeders:
```bash
npm run seed
```

### Run individual seeder (example):
```javascript
const seedUsers = require('./001_seed_users');
await seedUsers();
```

## Seeding Order

Seeders must be run in this specific order due to foreign key dependencies:

1. Users (no dependencies)
2. Instructors (no dependencies)
3. Products (no dependencies)
4. Courses (depends on Products)
5. Chapters (depends on Courses)
6. Lessons (depends on Chapters)
7. Course-Instructors (depends on Courses and Instructors)

## Seeded Data

### Users
- Admin user: `admin@elcanadi.com` / `Admin123!`
- Student users: `student@elcanadi.com` / `Student123!`
- Additional test users

### Products
- 6 different Arabic course products
- Various price points and difficulty levels

### Courses
- 6 courses linked to products
- Different levels: Beginner, Intermediate, Advanced
- Various durations and lesson counts

### Chapters
- Multiple chapters per course
- Ordered sequentially
- Descriptive titles and descriptions

### Lessons
- 5 lessons per chapter (approximately)
- Video URLs (placeholder)
- Duration: 15-35 minutes per lesson
- First lesson of each chapter is marked as preview

### Instructors
- 5 instructor profiles
- Specialized in different areas:
  - Dr. Khaled Al-Mansouri - Arabic Linguistics
  - Aisha Al-Zahra - Modern Arabic
  - Omar Ibn Rashid - Classical Arabic & Quranic Studies
  - Layla Al-Farsi - Business Arabic
  - Yusuf Al-Mahmoud - Arabic for Beginners

### Course-Instructor Relationships
- Courses assigned to relevant instructors based on specialization

## Notes

- Seeders check if data already exists before seeding to avoid duplicates
- All passwords are hashed using bcrypt
- Video URLs are placeholders - replace with actual video links
- Avatar URLs use placeholder images - replace with actual images

## Resetting Database

To reset and reseed the database:

1. Drop all tables (or use migrations)
2. Run migrations: `npm run migrate`
3. Run seeders: `npm run seed`

