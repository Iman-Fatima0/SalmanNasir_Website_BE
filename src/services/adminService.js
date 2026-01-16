const adminRepository = require('../repositories/adminRepository');
const { NotFoundError } = require('../utils/errors');

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
   * Update order status
   */
  async updateOrderStatus(id, status, notes) {
    const order = await adminRepository.getOrderById(id);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    const validStatuses = ['pending', 'completed', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid order status');
    }

    return await adminRepository.updateOrderStatus(id, status, notes);
  }
}

module.exports = new AdminService();

