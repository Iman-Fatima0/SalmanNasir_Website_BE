const { Product } = require('../models/index');

const seedProducts = async () => {
  try {
    console.log('🌱 Seeding products...');

    const products = [
      {
        type: 'course',
        title: 'Complete Arabic Mastery Program',
        subtitle: 'From Zero to Fluency in Arabic',
        description: 'A comprehensive Arabic language course designed for complete beginners. This program covers Modern Standard Arabic, essential grammar, vocabulary, and conversational skills. Perfect for students, professionals, and anyone serious about learning Arabic.',
        price: 299.99,
        currency: 'USD',
        isPublished: true,
        isArchived: false,
        slug: 'complete-arabic-mastery-program',
      },
      {
        type: 'course',
        title: 'Business Arabic for Professionals',
        subtitle: 'Master Arabic for Business Communication',
        description: 'Learn Arabic specifically tailored for business contexts. This course covers professional vocabulary, business correspondence, presentations, and cultural nuances essential for working in Arabic-speaking markets.',
        price: 199.99,
        currency: 'USD',
        isPublished: true,
        isArchived: false,
        slug: 'business-arabic-for-professionals',
      },
      {
        type: 'course',
        title: 'Classical Arabic & Quranic Studies',
        subtitle: 'Understanding Classical Arabic and Quranic Text',
        description: 'Dive deep into Classical Arabic and learn to read and understand Quranic texts. This course is perfect for students of Islamic studies, researchers, and anyone interested in classical Arabic literature.',
        price: 249.99,
        currency: 'USD',
        isPublished: true,
        isArchived: false,
        slug: 'classical-arabic-quranic-studies',
      },
      {
        type: 'course',
        title: 'Levantine Arabic Dialect',
        subtitle: 'Master the Spoken Arabic of the Levant',
        description: 'Learn the Levantine Arabic dialect spoken in Syria, Lebanon, Jordan, and Palestine. This course focuses on conversational skills, everyday expressions, and cultural context.',
        price: 179.99,
        currency: 'USD',
        isPublished: true,
        isArchived: false,
        slug: 'levantine-arabic-dialect',
      },
      {
        type: 'course',
        title: 'Arabic Grammar Fundamentals',
        subtitle: 'Master Arabic Grammar from the Ground Up',
        description: 'A structured course focusing on Arabic grammar rules, sentence structure, verb conjugations, and grammatical patterns. Essential for anyone serious about mastering Arabic.',
        price: 149.99,
        currency: 'USD',
        isPublished: true,
        isArchived: false,
        slug: 'arabic-grammar-fundamentals',
      },
      {
        type: 'course',
        title: 'Arabic for Kids',
        subtitle: 'Fun and Interactive Arabic Learning for Children',
        description: 'A specially designed course for children to learn Arabic through games, stories, and interactive activities. Perfect for kids aged 6-12 who want to learn Arabic in a fun way.',
        price: 99.99,
        currency: 'USD',
        isPublished: true,
        isArchived: false,
        slug: 'arabic-for-kids',
      },
    ];

    // Check if products already exist
    const existingProducts = await Product.findAll({
      limit: 1,
    });

    if (existingProducts.length > 0) {
      console.log('⚠️  Products already exist, skipping...');
      return;
    }

    await Product.bulkCreate(products);
    console.log(`✅ Seeded ${products.length} products`);
  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
    throw error;
  }
};

module.exports = seedProducts;

