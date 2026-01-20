const { DataTypes } = require('sequelize');

/**
 * Define Role model - RBAC system
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Role model
 */
function defineRole(sequelize) {
  const Role = sequelize.define(
    'Role',
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
        validate: {
          isIn: [['ADMIN', 'INSTRUCTOR', 'SUPPORT', 'STUDENT']],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isSystem: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'System roles cannot be deleted',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: 'roles',
      timestamps: true,
      indexes: [
        { fields: ['name'], unique: true },
        { fields: ['isActive'] },
      ],
    }
  );

  return Role;
}

module.exports = defineRole;

