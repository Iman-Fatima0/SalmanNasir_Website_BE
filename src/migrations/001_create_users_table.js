/**
 * Migration: Create users table
 * Run this migration to create the users table in PostgreSQL
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      emailVerificationToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      passwordResetToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      passwordResetExpires: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      googleId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      facebookId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      linkedinId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      appleId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      profileImage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      lastLogin: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Create indexes
    await queryInterface.addIndex('users', ['email'], { unique: true });
    await queryInterface.addIndex('users', ['googleId'], { unique: true, where: { googleId: { [Sequelize.Op.ne]: null } } });
    await queryInterface.addIndex('users', ['facebookId'], { unique: true, where: { facebookId: { [Sequelize.Op.ne]: null } } });
    await queryInterface.addIndex('users', ['linkedinId'], { unique: true, where: { linkedinId: { [Sequelize.Op.ne]: null } } });
    await queryInterface.addIndex('users', ['appleId'], { unique: true, where: { appleId: { [Sequelize.Op.ne]: null } } });
    await queryInterface.addIndex('users', ['passwordResetToken']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  },
};

