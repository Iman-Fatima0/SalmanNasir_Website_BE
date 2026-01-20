const { DataTypes } = require('sequelize');
const { validateOrderTransition } = require('../utils/stateMachine');

/**
 * Define Order model with state machine validation
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Order model
 */
function defineOrder(sequelize) {
  const Order = sequelize.define(
    'Order',
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
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: true,
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
        type: DataTypes.ENUM('pending', 'completed', 'cancelled', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'orders',
      timestamps: true,
      hooks: {
        beforeUpdate: async (order, options) => {
          // Validate state transition if status is being changed
          if (order.changed('status')) {
            const originalStatus = order.previous('status');
            const newStatus = order.status;

            const validation = validateOrderTransition(originalStatus, newStatus);
            if (!validation.valid) {
              throw new Error(validation.message);
            }
          }
        },
      },
    }
  );

  return Order;
}

module.exports = defineOrder;
