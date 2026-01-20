const { DataTypes } = require('sequelize');

/**
 * Define Question model
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Question model
 */
function defineQuestion(sequelize) {
  const Question = sequelize.define(
    'Question',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      quizId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'TRUE_FALSE', 'TEXT'),
        allowNull: false,
        defaultValue: 'MULTIPLE_CHOICE',
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      explanation: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Explanation shown after answering',
      },
    },
    {
      tableName: 'questions',
      timestamps: true,
      indexes: [
        { fields: ['quizId'] },
        { fields: ['order'] },
      ],
    }
  );

  return Question;
}

module.exports = defineQuestion;

