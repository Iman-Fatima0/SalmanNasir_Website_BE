const { Product, Course } = require('../models/index');

const seedCourses = async () => {
  try {
    console.log('🌱 Seeding courses...');

    // Get all products
    const products = await Product.findAll();
    
    if (products.length === 0) {
      console.log('⚠️  No products found. Please seed products first.');
      return;
    }

    // Check if courses already exist
    const existingCourses = await Course.findAll({
      limit: 1,
    });

    if (existingCourses.length > 0) {
      console.log('⚠️  Courses already exist, skipping...');
      return;
    }

    const courses = [
      {
        productId: products[0].id, // Complete Arabic Mastery Program
        totalChapters: 10,
        totalLessons: 50,
        language: 'Arabic',
        level: 'Beginner to Intermediate',
        thumbnailUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
        durationMinutes: 3000, // 50 hours
      },
      {
        productId: products[1].id, // Business Arabic
        totalChapters: 8,
        totalLessons: 40,
        language: 'Arabic',
        level: 'Intermediate',
        thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800',
        durationMinutes: 2400, // 40 hours
      },
      {
        productId: products[2].id, // Classical Arabic
        totalChapters: 12,
        totalLessons: 60,
        language: 'Arabic',
        level: 'Advanced',
        thumbnailUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
        durationMinutes: 3600, // 60 hours
      },
      {
        productId: products[3].id, // Levantine Arabic
        totalChapters: 9,
        totalLessons: 45,
        language: 'Arabic (Levantine)',
        level: 'Beginner to Intermediate',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        durationMinutes: 2700, // 45 hours
      },
      {
        productId: products[4].id, // Arabic Grammar
        totalChapters: 15,
        totalLessons: 75,
        language: 'Arabic',
        level: 'All Levels',
        thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
        durationMinutes: 4500, // 75 hours
      },
      {
        productId: products[5].id, // Arabic for Kids
        totalChapters: 6,
        totalLessons: 30,
        language: 'Arabic',
        level: 'Beginner',
        thumbnailUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
        durationMinutes: 1800, // 30 hours
      },
    ];

    await Course.bulkCreate(courses);
    console.log(`✅ Seeded ${courses.length} courses`);
  } catch (error) {
    console.error('❌ Error seeding courses:', error.message);
    throw error;
  }
};

module.exports = seedCourses;

