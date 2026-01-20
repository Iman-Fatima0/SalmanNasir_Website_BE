const { DataTypes } = require('sequelize');

/**
 * Define Session model - JWT refresh token management
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Session model
 */
function defineSession(sequelize) {
  const Session = sequelize.define(
    'Session',
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
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      deviceInfo: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Browser, OS, IP address',
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: 'sessions',
      timestamps: true,
      indexes: [
        { fields: ['userId'] },
        { fields: ['refreshToken'], unique: true },
        { fields: ['expiresAt'] },
        { fields: ['isActive'] },
      ],
    }
  );

  return Session;
}

module.exports = defineSession;

