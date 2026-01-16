const bcrypt = require('bcryptjs');
const { User } = require('../models/index');

const seedUsers = async () => {
  try {
    console.log('🌱 Seeding users...');

    // Hash passwords first
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    const studentPassword = await bcrypt.hash('Student123!', 12);
    const fatimaPassword = await bcrypt.hash('Fatima123!', 12);
    const mohammedPassword = await bcrypt.hash('Mohammed123!', 12);
    const saraPassword = await bcrypt.hash('Sara123!', 12);

    const users = [
      {
        email: 'admin@elcanadi.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1234567890',
        isEmailVerified: true,
        isActive: true,
        role: 'admin',
      },
      {
        email: 'student@elcanadi.com',
        password: studentPassword,
        firstName: 'Ahmed',
        lastName: 'Ali',
        phone: '+1234567891',
        isEmailVerified: true,
        isActive: true,
      },
      {
        email: 'fatima@elcanadi.com',
        password: fatimaPassword,
        firstName: 'Fatima',
        lastName: 'Hassan',
        phone: '+1234567892',
        isEmailVerified: true,
        isActive: true,
      },
      {
        email: 'mohammed@elcanadi.com',
        password: mohammedPassword,
        firstName: 'Mohammed',
        lastName: 'Ibrahim',
        phone: '+1234567893',
        isEmailVerified: true,
        isActive: true,
      },
      {
        email: 'sara@elcanadi.com',
        password: saraPassword,
        firstName: 'Sara',
        lastName: 'Omar',
        phone: '+1234567894',
        isEmailVerified: true,
        isActive: true,
      },
    ];

    // Check if users already exist
    const existingUsers = await User.findAll({
      where: {
        email: users.map((u) => u.email),
      },
    });

    if (existingUsers.length > 0) {
      console.log('⚠️  Some users already exist, skipping...');
      return;
    }

    await User.bulkCreate(users);
    console.log(`✅ Seeded ${users.length} users`);
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    throw error;
  }
};

module.exports = seedUsers;

