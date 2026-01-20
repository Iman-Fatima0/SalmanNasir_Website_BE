const { DataTypes } = require('sequelize');

/**
 * Define Permission model - RBAC system
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Permission model
 */
function definePermission(sequelize) {
  const Permission = sequelize.define(
    'Permission',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'e.g., courses:create, orders:refund',
      },
      resource: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Resource type: courses, orders, users, etc.',
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Action: create, read, update, delete, refund',
      },
      scope: {
        type: DataTypes.ENUM('all', 'own', 'team'),
        allowNull: false,
        defaultValue: 'own',
        comment: 'Scope of permission: all resources, own resources, or team resources',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'permissions',
      timestamps: true,
      indexes: [
        { fields: ['name'], unique: true },
        { fields: ['resource', 'action'] },
      ],
    }
  );

  return Permission;
}

module.exports = definePermission;

