const { DataTypes } = require('sequelize');

/**
 * Define CourseCategory model
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CourseCategory model
 */
function defineCourseCategory(sequelize) {
  const CourseCategory = sequelize.define(
    'CourseCategory',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      parentId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'For nested categories',
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: 'course_categories',
      timestamps: true,
      indexes: [
        { fields: ['slug'], unique: true },
        { fields: ['parentId'] },
        { fields: ['isActive'] },
      ],
    }
  );

  return CourseCategory;
}

module.exports = defineCourseCategory;

