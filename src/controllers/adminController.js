const adminService = require('../services/adminService');
const courseService = require('../services/courseService');
const instructorService = require('../services/instructorService');
const response = require('../utils/response');

class AdminController {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(req, res, next) {
    try {
      const stats = await adminService.getDashboardStats();
      return response.success(res, stats, 'Dashboard statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all users
   */
  async getAllUsers(req, res, next) {
    try {
      const result = await adminService.getAllUsers(req.query);
      return response.success(res, result, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(req, res, next) {
    try {
      const user = await adminService.getUserById(req.params.id);
      return response.success(res, { user }, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   */
  async updateUser(req, res, next) {
    try {
      const user = await adminService.updateUser(req.params.id, req.body);
      return response.success(res, { user }, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(req, res, next) {
    try {
      await adminService.deleteUser(req.params.id);
      return response.success(res, null, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all orders
   */
  async getAllOrders(req, res, next) {
    try {
      const result = await adminService.getAllOrders(req.query);
      return response.success(res, result, 'Orders retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(req, res, next) {
    try {
      const order = await adminService.getOrderById(req.params.id);
      return response.success(res, { order }, 'Order retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(req, res, next) {
    try {
      const { status, notes } = req.body;
      const order = await adminService.updateOrderStatus(req.params.id, status, notes);
      return response.success(res, { order }, 'Order status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create course (admin)
   */
  async createCourse(req, res, next) {
    try {
      const course = await courseService.createCourse(req.body);
      return response.success(res, course, 'Course created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update course (admin)
   */
  async updateCourse(req, res, next) {
    try {
      const course = await courseService.updateCourse(req.params.id, req.body);
      return response.success(res, course, 'Course updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete course (admin)
   */
  async deleteCourse(req, res, next) {
    try {
      await courseService.deleteCourse(req.params.id);
      return response.success(res, null, 'Course deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create instructor (admin)
   */
  async createInstructor(req, res, next) {
    try {
      const instructor = await instructorService.createInstructor(req.body);
      return response.success(res, instructor, 'Instructor created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update instructor (admin)
   */
  async updateInstructor(req, res, next) {
    try {
      const instructor = await instructorService.updateInstructor(req.params.id, req.body);
      return response.success(res, instructor, 'Instructor updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete instructor (admin)
   */
  async deleteInstructor(req, res, next) {
    try {
      await instructorService.deleteInstructor(req.params.id);
      return response.success(res, null, 'Instructor deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();

