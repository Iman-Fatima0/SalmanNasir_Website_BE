const { DataTypes } = require('sequelize');

/**
 * Define UserRole pivot model - Maps users to roles
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} UserRole model
 */
function defineUserRole(sequelize) {
  const UserRole = sequelize.define(
    'UserRole',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      assignedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'User ID who assigned this role (for audit)',
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Optional expiration date for temporary role assignments',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: 'user_roles',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['userId', 'roleId'],
          where: { isActive: true },
        },
        { fields: ['userId'] },
        { fields: ['roleId'] },
        { fields: ['expiresAt'] },
      ],
    }
  );

  return UserRole;
}

module.exports = defineUserRole;

