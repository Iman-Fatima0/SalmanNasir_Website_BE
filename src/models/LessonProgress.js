const { DataTypes } = require('sequelize');

/**
 * Define LessonProgress model - Track student lesson completion
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LessonProgress model
 */
function defineLessonProgress(sequelize) {
  const LessonProgress = sequelize.define(
    'LessonProgress',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      enrollmentId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      lessonId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      timeSpent: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Time spent in seconds',
      },
      lastPosition: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Last video position in seconds (for video lessons)',
      },
      lastAccessedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'lesson_progress',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['enrollmentId', 'lessonId'],
        },
        { fields: ['enrollmentId'] },
        { fields: ['lessonId'] },
        { fields: ['completed'] },
      ],
    }
  );

  return LessonProgress;
}

module.exports = defineLessonProgress;

