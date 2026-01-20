const { DataTypes } = require('sequelize');

/**
 * Define ActivityLog model - User activity tracking
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ActivityLog model
 */
function defineActivityLog(sequelize) {
  const ActivityLog = sequelize.define(
    'ActivityLog',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'User who performed the action',
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Action performed (e.g., course.enrolled, lesson.completed)',
      },
      entityType: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Type of entity affected (e.g., Course, Lesson, Order)',
      },
      entityId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'ID of the affected entity',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Additional context data',
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'activity_logs',
      timestamps: true,
      paranoid: true, // For soft deletes
      indexes: [
        { fields: ['userId'] },
        { fields: ['action'] },
        { fields: ['entityType', 'entityId'] },
        { fields: ['createdAt'] },
      ],
    }
  );
  return ActivityLog;
}

module.exports = defineActivityLog;

