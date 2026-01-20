const { DataTypes } = require('sequelize');

/**
 * Define Subscription model - Recurring subscriptions
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Subscription model
 */
function defineSubscription(sequelize) {
  const Subscription = sequelize.define(
    'Subscription',
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
      status: {
        type: DataTypes.ENUM('ACTIVE', 'CANCELLED', 'EXPIRED', 'PAST_DUE', 'PAUSED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      planId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Reference to subscription plan (if separate plans table)',
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },
      interval: {
        type: DataTypes.ENUM('MONTHLY', 'YEARLY', 'WEEKLY'),
        allowNull: false,
        defaultValue: 'MONTHLY',
      },
      currentPeriodStart: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      currentPeriodEnd: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      cancelAtPeriodEnd: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      cancelledAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      providerSubscriptionId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        comment: 'Subscription ID from payment provider',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: 'subscriptions',
      timestamps: true,
      indexes: [
        { fields: ['userId'] },
        { fields: ['status'] },
        { fields: ['providerSubscriptionId'], unique: true },
        { fields: ['currentPeriodEnd'] },
      ],
    }
  );

  return Subscription;
}

module.exports = defineSubscription;

