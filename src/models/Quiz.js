const { DataTypes } = require('sequelize');

/**
 * Define Quiz model
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Quiz model
 */
function defineQuiz(sequelize) {
  const Quiz = sequelize.define(
    'Quiz',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      lessonId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Null if standalone quiz',
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      passingScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 70,
        comment: 'Percentage required to pass (0-100)',
      },
      timeLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Time limit in minutes (null = unlimited)',
      },
      maxAttempts: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Maximum attempts allowed (null = unlimited)',
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'quizzes',
      timestamps: true,
      indexes: [
        { fields: ['courseId'] },
        { fields: ['lessonId'] },
        { fields: ['isPublished'] },
      ],
    }
  );

  return Quiz;
}

module.exports = defineQuiz;

