const { DataTypes } = require('sequelize');

/**
 * Define RolePermission pivot model - Maps roles to permissions
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RolePermission model
 */
function defineRolePermission(sequelize) {
  const RolePermission = sequelize.define(
    'RolePermission',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      permissionId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: 'role_permissions',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['roleId', 'permissionId'],
        },
        { fields: ['roleId'] },
        { fields: ['permissionId'] },
      ],
    }
  );

  return RolePermission;
}

module.exports = defineRolePermission;

