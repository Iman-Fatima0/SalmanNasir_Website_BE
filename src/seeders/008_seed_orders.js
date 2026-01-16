const { Order, User, Product, Course } = require('../models/index');

const seedOrders = async () => {
  try {
    console.log('🌱 Seeding orders...');

    // Get users and products
    const users = await User.findAll({ limit: 5 });
    const products = await Product.findAll();
    const courses = await Course.findAll();

    if (users.length === 0 || products.length === 0) {
      console.log('⚠️  No users or products found. Please seed them first.');
      return;
    }

    // Check if orders already exist
    const existingOrders = await Order.findAll({
      limit: 1,
    });

    if (existingOrders.length > 0) {
      console.log('⚠️  Orders already exist, skipping...');
      return;
    }

    const orders = [];

    // Create some sample orders
    if (users[1] && products[0] && courses[0]) {
      orders.push({
        userId: users[1].id, // student@elcanadi.com
        productId: products[0].id,
        courseId: courses[0].id,
        amount: parseFloat(products[0].price),
        currency: products[0].currency,
        status: 'completed',
        paymentMethod: 'credit_card',
        paymentId: 'pay_123456',
        transactionId: 'txn_123456',
        notes: 'Payment confirmed via Stripe',
      });
    }

    if (users[2] && products[1] && courses[1]) {
      orders.push({
        userId: users[2].id, // fatima@elcanadi.com
        productId: products[1].id,
        courseId: courses[1].id,
        amount: parseFloat(products[1].price),
        currency: products[1].currency,
        status: 'completed',
        paymentMethod: 'paypal',
        paymentId: 'pay_789012',
        transactionId: 'txn_789012',
      });
    }

    if (users[3] && products[2] && courses[2]) {
      orders.push({
        userId: users[3].id, // mohammed@elcanadi.com
        productId: products[2].id,
        courseId: courses[2].id,
        amount: parseFloat(products[2].price),
        currency: products[2].currency,
        status: 'pending',
        paymentMethod: 'bank_transfer',
        notes: 'Awaiting bank transfer confirmation',
      });
    }

    if (orders.length > 0) {
      await Order.bulkCreate(orders);
      console.log(`✅ Seeded ${orders.length} orders`);
    } else {
      console.log('⚠️  No orders created - missing users, products, or courses');
    }
  } catch (error) {
    console.error('❌ Error seeding orders:', error.message);
    throw error;
  }
};

module.exports = seedOrders;

