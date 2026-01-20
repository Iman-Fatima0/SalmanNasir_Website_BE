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
      type: {
        type: DataTypes.ENUM('VIDEO', 'PDF', 'TEXT', 'QUIZ', 'AUDIO'),
        allowNull: false,
        defaultValue: 'VIDEO',
        comment: 'Lesson content type',
      },
      videoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Video URL for VIDEO type lessons (can be file path or external URL)',
      },
      audioUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Audio URL for AUDIO type lessons (can be file path or external URL)',
      },
      contentUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Content URL for PDF type lessons (can be file path or external URL)',
      },
      textContent: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Text content for TEXT type lessons',
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
