const { DataTypes } = require('sequelize');

/**
 * Define Payment model - Payment transactions
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Payment model
 */
function definePayment(sequelize) {
  const Payment = sequelize.define(
    'Payment',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
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
        type: DataTypes.ENUM('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'stripe, paypal, razorpay, etc.',
      },
      providerTransactionId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        comment: 'Transaction ID from payment provider',
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'credit_card, debit_card, bank_transfer, etc.',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Additional payment provider data',
      },
      processedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      failureReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      idempotencyKey: {
        type: DataTypes.UUID,
        allowNull: true,
        unique: true,
        comment: 'For idempotent payment requests',
      },
    },
    {
      tableName: 'payments',
      timestamps: true,
      indexes: [
        { fields: ['orderId'] },
        { fields: ['userId'] },
        { fields: ['status'] },
        { fields: ['providerTransactionId'], unique: true },
        { fields: ['idempotencyKey'], unique: true },
        { fields: ['createdAt'] },
      ],
    }
  );

  return Payment;
}

module.exports = definePayment;

