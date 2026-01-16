const { DataTypes } = require('sequelize');

/**
 * Define Chapter model
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Chapter model
 */
function defineChapter(sequelize) {
  const Chapter = sequelize.define(
    'Chapter',
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
    },
    {
      tableName: 'chapters',
      timestamps: true,
    }
  );

  return Chapter;
}

module.exports = defineChapter;
