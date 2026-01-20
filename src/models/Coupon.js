const { DataTypes } = require('sequelize');

/**
 * Define Coupon model - Discount coupons
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Coupon model
 */
function defineCoupon(sequelize) {
  const Coupon = sequelize.define(
    'Coupon',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Coupon code (e.g., SAVE20)',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      discountType: {
        type: DataTypes.ENUM('PERCENTAGE', 'FIXED_AMOUNT'),
        allowNull: false,
        defaultValue: 'PERCENTAGE',
      },
      discountValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Percentage (0-100) or fixed amount',
      },
      maxDiscount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Maximum discount amount (for percentage coupons)',
      },
      minPurchaseAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Minimum purchase amount required',
      },
      usageLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Total usage limit (null = unlimited)',
      },
      usageCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      usageLimitPerUser: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
        comment: 'Usage limit per user',
      },
      validFrom: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      validUntil: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Null = no expiration',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      applicableTo: {
        type: DataTypes.ENUM('ALL', 'SPECIFIC_COURSES', 'SPECIFIC_CATEGORIES'),
        allowNull: false,
        defaultValue: 'ALL',
      },
      applicableCourseIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true,
        comment: 'Array of course IDs if applicableTo = SPECIFIC_COURSES',
      },
      applicableCategoryIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true,
        comment: 'Array of category IDs if applicableTo = SPECIFIC_CATEGORIES',
      },
    },
    {
      tableName: 'coupons',
      timestamps: true,
      indexes: [
        { fields: ['code'], unique: true },
        { fields: ['isActive'] },
        { fields: ['validFrom', 'validUntil'] },
      ],
    }
  );

  return Coupon;
}

module.exports = defineCoupon;

