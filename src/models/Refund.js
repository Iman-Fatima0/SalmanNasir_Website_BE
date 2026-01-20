const { DataTypes } = require('sequelize');

/**
 * Define Refund model - Refund transactions
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Refund model
 */
function defineRefund(sequelize) {
  const Refund = sequelize.define(
    'Refund',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      paymentId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
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
      status: {
        type: DataTypes.ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      type: {
        type: DataTypes.ENUM('FULL', 'PARTIAL'),
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      processedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Admin user ID who processed refund',
      },
      providerRefundId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        comment: 'Refund ID from payment provider',
      },
      processedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      failureReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'refunds',
      timestamps: true,
      indexes: [
        { fields: ['paymentId'] },
        { fields: ['orderId'] },
        { fields: ['status'] },
        { fields: ['providerRefundId'], unique: true },
        { fields: ['createdAt'] },
      ],
    }
  );

  return Refund;
}

module.exports = defineRefund;

