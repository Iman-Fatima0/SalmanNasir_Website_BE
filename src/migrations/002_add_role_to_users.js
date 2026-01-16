'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if role column already exists
    const tableDescription = await queryInterface.describeTable('users');
    
    if (!tableDescription.role) {
      // Add role column
      await queryInterface.addColumn('users', 'role', {
        type: Sequelize.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user',
      });
      
      console.log('✅ Added role column to users table');
    } else {
      console.log('⚠️  Role column already exists in users table');
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove role column
    await queryInterface.removeColumn('users', 'role');
    
    // Drop the ENUM type if it exists
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
    
    console.log('✅ Removed role column from users table');
  },
};

