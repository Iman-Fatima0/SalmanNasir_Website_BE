const { DataTypes } = require('sequelize');

/**
 * Define Course model
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Course model
 */
function defineCourse(sequelize) {
  const Course = sequelize.define(
    'Course',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      totalChapters: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      totalLessons: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      language: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      level: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      thumbnailUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      durationMinutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'courses',
      timestamps: true,
    }
  );

  return Course;
}

module.exports = defineCourse;
