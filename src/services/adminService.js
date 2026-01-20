const adminRepository = require('../repositories/adminRepository');
const { NotFoundError } = require('../utils/errors');
const { validateOrderTransition } = require('../utils/stateMachine');
const { Enrollment } = require('../models/index');

class AdminService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    return await adminRepository.getDashboardStats();
  }

  /**
   * Get all users
   */
  async getAllUsers(options) {
    return await adminRepository.getAllUsers(options);
  }

  /**
   * Get user by ID
   */
  async getUserById(id) {
    const user = await adminRepository.getUserById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  /**
   * Update user
   */
  async updateUser(id, updateData) {
    const user = await adminRepository.getUserById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return await adminRepository.updateUser(id, updateData);
  }

  /**
   * Delete user
   */
  async deleteUser(id) {
    const user = await adminRepository.getUserById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return await adminRepository.deleteUser(id);
  }

  /**
   * Get all orders
   */
  async getAllOrders(options) {
    return await adminRepository.getAllOrders(options);
  }

  /**
   * Get order by ID
   */
  async getOrderById(id) {
    const order = await adminRepository.getOrderById(id);
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    return order;
  }

  /**
   * Update order status with state machine validation
   */
  async updateOrderStatus(id, status, notes) {
    const order = await adminRepository.getOrderById(id);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Validate state transition using state machine
    const validation = validateOrderTransition(order.status, status);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    const updatedOrder = await adminRepository.updateOrderStatus(id, status, notes);

    // When order is marked as completed, create enrollment (access unlock)
    if (status === 'completed' && order.courseId) {
      // Check if enrollment already exists
      const existing = await Enrollment.findOne({
        where: { userId: order.userId, courseId: order.courseId },
      });

      if (!existing) {
        await Enrollment.create({
          userId: order.userId,
          courseId: order.courseId,
          orderId: order.id,
          status: 'ACTIVE',
        });
      }
    }

    return updatedOrder;
  }
}

module.exports = new AdminService();

