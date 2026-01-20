const { DataTypes } = require('sequelize');

/**
 * Define Answer model - Answer options for questions
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Answer model
 */
function defineAnswer(sequelize) {
  const Answer = sequelize.define(
    'Answer',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      questionId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: 'answers',
      timestamps: true,
      indexes: [
        { fields: ['questionId'] },
        { fields: ['order'] },
      ],
    }
  );

  return Answer;
}

module.exports = defineAnswer;

