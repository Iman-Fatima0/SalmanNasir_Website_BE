// Database seeding script
require('dotenv').config();
const { connectDB } = require('../src/config/database');
const sequelize = require('../src/config/database');

// Import all seeders
const seedUsers = require('../src/seeders/001_seed_users');
const seedInstructors = require('../src/seeders/002_seed_instructors');
const seedProducts = require('../src/seeders/003_seed_products');
const seedCourses = require('../src/seeders/004_seed_courses');
const seedChapters = require('../src/seeders/005_seed_chapters');
const seedLessons = require('../src/seeders/006_seed_lessons');
const seedCourseInstructors = require('../src/seeders/007_seed_course_instructors');
const seedOrders = require('../src/seeders/008_seed_orders');

const runSeeders = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to database
    await connectDB();

    // Run seeders in order (respecting foreign key constraints)
    console.log('📦 Seeding order:');
    console.log('   1. Users');
    console.log('   2. Instructors');
    console.log('   3. Products');
    console.log('   4. Courses');
    console.log('   5. Chapters');
    console.log('   6. Lessons');
    console.log('   7. Course-Instructor Relationships');
    console.log('   8. Orders\n');

    await seedUsers();
    console.log('');

    await seedInstructors();
    console.log('');

    await seedProducts();
    console.log('');

    await seedCourses();
    console.log('');

    await seedChapters();
    console.log('');

    await seedLessons();
    console.log('');

    await seedCourseInstructors();
    console.log('');

    await seedOrders();
    console.log('');

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - Users seeded');
    console.log('   - Instructors seeded');
    console.log('   - Products seeded');
    console.log('   - Courses seeded');
    console.log('   - Chapters seeded');
    console.log('   - Lessons seeded');
    console.log('   - Course-Instructor relationships seeded');
    console.log('   - Orders seeded');

    // Close database connection
    await sequelize.close();
    console.log('\n🔌 Database connection closed.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runSeeders();
}

module.exports = runSeeders;
