const { DataTypes } = require('sequelize');

/**
 * Define QuizAttempt model - Track quiz attempts and scores
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} QuizAttempt model
 */
function defineQuizAttempt(sequelize) {
  const QuizAttempt = sequelize.define(
    'QuizAttempt',
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
      quizId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
      totalQuestions: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      correctAnswers: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      passingScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      passed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      timeSpent: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Time spent in seconds',
      },
      answers: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Stores selected answers: { questionId: answerId }',
      },
    },
    {
      tableName: 'quiz_attempts',
      timestamps: true,
      indexes: [
        { fields: ['enrollmentId'] },
        { fields: ['quizId'] },
        { fields: ['passed'] },
        { fields: ['completedAt'] },
      ],
    }
  );

  return QuizAttempt;
}

module.exports = defineQuizAttempt;

