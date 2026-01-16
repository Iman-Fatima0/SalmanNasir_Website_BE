const { DataTypes } = require('sequelize');

/**
 * Define Instructor model
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Instructor model
 */
function defineInstructor(sequelize) {
  const Instructor = sequelize.define(
    'Instructor',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      avatarUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      linkedinUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      twitterUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      websiteUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: 'instructors',
      timestamps: true,
    }
  );

  return Instructor;
}

module.exports = defineInstructor;
