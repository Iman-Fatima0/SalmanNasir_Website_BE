const { DataTypes } = require('sequelize');

/**
 * Define Lesson model
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Lesson model
 */
function defineLesson(sequelize) {
  const Lesson = sequelize.define(
    'Lesson',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      chapterId: {
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
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      videoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      durationMinutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isPreview: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'lessons',
      timestamps: true,
    }
  );

  return Lesson;
}

module.exports = defineLesson;
