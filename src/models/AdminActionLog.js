const { DataTypes } = require('sequelize');

/**
 * Define AdminActionLog model - Admin action audit trail
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AdminActionLog model
 */
function defineAdminActionLog(sequelize) {
  const AdminActionLog = sequelize.define(
    'AdminActionLog',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      adminId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Admin user who performed the action',
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Admin action (e.g., user.suspended, course.published, order.refunded)',
      },
      entityType: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Type of entity affected (e.g., User, Course, Order)',
      },
      entityId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'ID of the affected entity',
      },
      changes: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Before/after values for the change',
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for the action',
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
      tableName: 'admin_action_logs',
      timestamps: true,
      paranoid: true, // For soft deletes
      indexes: [
        { fields: ['adminId'] },
        { fields: ['action'] },
        { fields: ['entityType', 'entityId'] },
        { fields: ['createdAt'] },
      ],
    }
  );
  return AdminActionLog;
}

module.exports = defineAdminActionLog;

