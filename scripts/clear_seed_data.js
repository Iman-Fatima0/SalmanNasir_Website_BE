// Script to clear seeded data from database
require('dotenv').config();
const { connectDB } = require('../src/config/database');
const sequelize = require('../src/config/database');
const {
  Product,
  Course,
  Chapter,
  Lesson,
  Instructor,
  CourseInstructor,
} = require('../src/models/associations');
const User = require('../src/models/User');

const clearSeedData = async () => {
  try {
    console.log('🗑️  Clearing seeded data...\n');

    // Connect to database
    await connectDB();

    // Clear in reverse order of dependencies
    console.log('Deleting course-instructor relationships...');
    await CourseInstructor.destroy({ where: {}, truncate: true, cascade: true });

    console.log('Deleting lessons...');
    await Lesson.destroy({ where: {}, truncate: true, cascade: true });

    console.log('Deleting chapters...');
    await Chapter.destroy({ where: {}, truncate: true, cascade: true });

    console.log('Deleting courses...');
    await Course.destroy({ where: {}, truncate: true, cascade: true });

    console.log('Deleting products...');
    await Product.destroy({ where: {}, truncate: true, cascade: true });

    console.log('Deleting instructors...');
    await Instructor.destroy({ where: {}, truncate: true, cascade: true });

    console.log('Deleting users (except admin)...');
    // Keep admin user if needed, or delete all
    const { Op } = require('sequelize');
    await User.destroy({
      where: {
        email: {
          [Op.ne]: 'admin@elcanadi.com', // Keep admin
        },
      },
    });

    console.log('\n✅ All seeded data cleared successfully!');
    console.log('💡 Note: Admin user (admin@elcanadi.com) was preserved.');

    // Close database connection
    await sequelize.close();
    console.log('🔌 Database connection closed.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing seed data:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  clearSeedData();
}

module.exports = clearSeedData;

