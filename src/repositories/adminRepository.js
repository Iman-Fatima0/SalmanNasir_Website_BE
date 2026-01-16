const { Op } = require('sequelize');
const { User, Product, Course, Instructor, Order, Chapter, Lesson } = require('../models/index');

class AdminRepository {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    const [
      totalUsers,
      totalCourses,
      totalInstructors,
      totalOrders,
      totalRevenue,
      recentOrders,
    ] = await Promise.all([
      User.count(),
      Course.count(),
      Instructor.count({ where: { isActive: true } }),
      Order.count(),
      Order.sum('amount', {
        where: { status: 'completed' },
      }),
      Order.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'email', 'firstName', 'lastName'],
            required: false,
          },
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'title', 'price'],
            required: false,
          },
        ],
      }),
    ]);

    return {
      totalUsers,
      totalCourses,
      totalInstructors,
      totalOrders,
      totalRevenue: totalRevenue || 0,
      recentOrders,
    };
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(options = {}) {
    const { page = 1, limit = 10, search, isActive } = options;
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { email: { [Op.iLike]: `%${search}%` } },
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['password', 'passwordResetToken', 'passwordResetExpires'],
      },
    });

    return {
      users: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(id) {
    return await User.findByPk(id, {
      attributes: {
        exclude: ['password', 'passwordResetToken', 'passwordResetExpires'],
      },
    });
  }

  /**
   * Update user
   */
  async updateUser(id, updateData) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Don't allow password update through this method
    delete updateData.password;

    await user.update(updateData);
    return user;
  }

  /**
   * Delete user (soft delete by deactivating)
   */
  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    await user.update({ isActive: false });
    return user;
  }

  /**
   * Get all orders with pagination
   */
  async getAllOrders(options = {}) {
    const { page = 1, limit = 10, status, search } = options;
    const offset = (page - 1) * limit;
    const where = {};

    if (status) {
      where.status = status;
    }

    const include = [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'firstName', 'lastName'],
        required: false,
      },
      {
        model: Product,
        as: 'product',
        attributes: ['id', 'title', 'price', 'currency'],
        required: false,
      },
      {
        model: Course,
        as: 'course',
        attributes: ['id', 'level', 'language'],
        required: false,
      },
    ];

    if (search) {
      include[0].where = {
        [Op.or]: [
          { email: { [Op.iLike]: `%${search}%` } },
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      include,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      orders: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Get order by ID
   */
  async getOrderById(id) {
    return await Order.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['password', 'passwordResetToken', 'passwordResetExpires'],
          },
        },
        {
          model: Product,
          as: 'product',
        },
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: Instructor,
              as: 'instructors',
              through: { attributes: ['role'] },
            },
          ],
        },
      ],
    });
  }

  /**
   * Update order status
   */
  async updateOrderStatus(id, status, notes = null) {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error('Order not found');
    }

    const updateData = { status };
    if (notes) {
      updateData.notes = notes;
    }

    await order.update(updateData);
    return order;
  }
}

module.exports = new AdminRepository();

