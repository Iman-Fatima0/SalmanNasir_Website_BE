const { DataTypes } = require('sequelize');

/**
 * Define OrderItem model - Items within an order (for multi-item orders)
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} OrderItem model
 */
function defineOrderItem(sequelize) {
  const OrderItem = sequelize.define(
    'OrderItem',
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
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Price at time of purchase',
      },
      discountAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        comment: 'Discount applied (from coupon)',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Total after discount (unitPrice * quantity - discountAmount)',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },
    },
    {
      tableName: 'order_items',
      timestamps: true,
      indexes: [
        { fields: ['orderId'] },
        { fields: ['productId'] },
        { fields: ['courseId'] },
      ],
    }
  );

  return OrderItem;
}

module.exports = defineOrderItem;

