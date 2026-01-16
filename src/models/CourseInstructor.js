const { DataTypes } = require('sequelize');

/**
 * Define CourseInstructor model
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CourseInstructor model
 */
function defineCourseInstructor(sequelize) {
  const CourseInstructor = sequelize.define(
    'CourseInstructor',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      instructorId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'primary',
      },
    },
    {
      tableName: 'course_instructors',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['courseId', 'instructorId'],
        },
      ],
    }
  );

  return CourseInstructor;
}

module.exports = defineCourseInstructor;
