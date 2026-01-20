const { Op } = require('sequelize');
const { User, Product, Course, Instructor, Order, Chapter, Lesson } = require('../models/index');

class AdminRepository {
  /**
   * Get dashboard statistics with trends, charts, and detailed data
   */
  async getDashboardStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const twelveMonthsAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    // Calculate current period totals (last 30 days)
    const [
      totalUsers,
      totalOrders,
      totalRevenue,
      totalRefunds,
      currentPeriodRevenue,
      currentPeriodOrders,
      currentPeriodUsers,
      previousPeriodRevenue,
      previousPeriodOrders,
      previousPeriodUsers,
      previousPeriodRefunds,
      recentOrdersRaw,
      allOrdersForRevenue,
      enrollmentsByCourse,
    ] = await Promise.all([
      // Total counts
      User.count({ where: { status: 'ACTIVE' } }),
      Order.count(),
      Order.sum('amount', { where: { status: 'completed' } }),
      Order.count({ where: { status: 'refunded' } }),

      // Current period (last 30 days)
      Order.sum('amount', {
        where: {
          status: 'completed',
          createdAt: { [Op.gte]: thirtyDaysAgo },
        },
      }),
      Order.count({
        where: {
          createdAt: { [Op.gte]: thirtyDaysAgo },
        },
      }),
      User.count({
        where: {
          status: 'ACTIVE',
          createdAt: { [Op.gte]: thirtyDaysAgo },
        },
      }),

      // Previous period (30-60 days ago)
      Order.sum('amount', {
        where: {
          status: 'completed',
          createdAt: {
            [Op.gte]: sixtyDaysAgo,
            [Op.lt]: thirtyDaysAgo,
          },
        },
      }),
      Order.count({
        where: {
          createdAt: {
            [Op.gte]: sixtyDaysAgo,
            [Op.lt]: thirtyDaysAgo,
          },
        },
      }),
      User.count({
        where: {
          status: 'ACTIVE',
          createdAt: {
            [Op.gte]: sixtyDaysAgo,
            [Op.lt]: thirtyDaysAgo,
          },
        },
      }),
      Order.count({
        where: {
          status: 'refunded',
          createdAt: {
            [Op.gte]: sixtyDaysAgo,
            [Op.lt]: thirtyDaysAgo,
          },
        },
      }),

      // Recent orders (last 20)
      Order.findAll({
        limit: 20,
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
            attributes: ['id', 'title'],
            required: false,
          },
          {
            model: Course,
            as: 'course',
            attributes: ['id'],
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['title'],
                required: false,
              },
            ],
            required: false,
          },
        ],
      }),

      // All completed orders for revenue chart (last 12 months)
      Order.findAll({
        where: {
          status: 'completed',
          createdAt: { [Op.gte]: twelveMonthsAgo },
        },
        attributes: ['amount', 'createdAt', 'id'],
        order: [['createdAt', 'ASC']],
      }),

      // Enrollments by course (top courses) - using raw query for aggregation
      Order.sequelize.query(
        `
        SELECT 
          c.id as course_id,
          p.title as course_title,
          COUNT(o.id) as enrollment_count
        FROM orders o
        LEFT JOIN courses c ON o."courseId" = c.id
        LEFT JOIN products p ON c."productId" = p.id
        WHERE o.status IN ('completed', 'pending') AND o."courseId" IS NOT NULL
        GROUP BY c.id, p.title
        ORDER BY enrollment_count DESC
        LIMIT 10
        `,
        { type: Order.sequelize.QueryTypes.SELECT }
      ),
    ]);

    // Calculate trends
    const calculateTrend = (current, previous) => {
      if (!previous || previous === 0) {
        return { direction: current > 0 ? 'up' : 'down', value: current > 0 ? '100%' : '0%' };
      }
      const change = ((current - previous) / previous) * 100;
      const direction = change >= 0 ? 'up' : 'down';
      const value = `${Math.abs(change).toFixed(0)}%`;
      return { direction, value, previousPeriodValue: previous };
    };

    const revenueTrend = calculateTrend(
      parseFloat(currentPeriodRevenue || 0),
      parseFloat(previousPeriodRevenue || 0)
    );
    const ordersTrend = calculateTrend(currentPeriodOrders, previousPeriodOrders);
    const usersTrend = calculateTrend(currentPeriodUsers, previousPeriodUsers);

    // Calculate refund rate
    const refundRate = totalOrders > 0 ? ((totalRefunds / totalOrders) * 100).toFixed(1) : 0;
    const previousRefundRate =
      previousPeriodOrders > 0
        ? ((previousPeriodRefunds / previousPeriodOrders) * 100).toFixed(1)
        : 0;
    const refundRateTrend = calculateTrend(parseFloat(refundRate), parseFloat(previousRefundRate));

    // Generate revenue data for last 12 months
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueByMonth = {};
    
    // Initialize all 12 months with 0 (going backwards from current month)
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = monthNames[date.getMonth()];
      revenueByMonth[monthKey] = { date: monthLabel, revenue: 0, orders: 0 };
    }

    // Aggregate revenue and orders by month
    allOrdersForRevenue.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
      if (revenueByMonth[monthKey]) {
        revenueByMonth[monthKey].revenue += parseFloat(order.amount || 0);
        revenueByMonth[monthKey].orders += 1;
      }
    });

    // Convert to array (already in correct order from oldest to newest)
    const revenueData = Object.values(revenueByMonth);

    // Generate enrollments data (top courses)
    const enrollmentsData = enrollmentsByCourse
      .filter((item) => item.course_title) // Filter out null courses
      .map((item) => ({
        course: item.course_title,
        enrollments: parseInt(item.enrollment_count || 0),
      }));

    // Format recent orders - ensure proper structure
    const recentOrders = recentOrdersRaw.map((order) => {
      // Get course title - prefer course.product.title, fallback to product.title
      const courseTitle = 
        order.course?.product?.title || 
        order.product?.title || 
        null;

      return {
        id: order.id, // UUID as string
        user: {
          id: order.user?.id || null,
          firstName: order.user?.firstName || null,
          lastName: order.user?.lastName || null,
          email: order.user?.email || 'N/A',
        },
        product: order.product
          ? {
              id: order.product.id,
              title: order.product.title || null,
            }
          : null,
        course: order.course
          ? {
              id: order.course.id,
              title: courseTitle,
            }
          : null,
        status: order.status,
        totalAmount: parseFloat(order.amount || 0),
        amount: parseFloat(order.amount || 0),
        createdAt: order.createdAt ? order.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: order.updatedAt ? order.updatedAt.toISOString() : (order.createdAt ? order.createdAt.toISOString() : new Date().toISOString()),
        paymentMethod: order.paymentMethod || null,
      };
    });

    return {
      totalRevenue: parseFloat(totalRevenue || 0),
      totalUsers: totalUsers || 0,
      totalOrders: totalOrders || 0,
      refundRate: parseFloat(refundRate),
      revenueTrend,
      usersTrend,
      ordersTrend,
      refundRateTrend,
      revenueData,
      enrollmentsData,
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
      // Add search condition to User include
      const userInclude = include.find((inc) => inc.as === 'user');
      if (userInclude) {
        userInclude.where = {
          [Op.or]: [
            { email: { [Op.iLike]: `%${search}%` } },
            { firstName: { [Op.iLike]: `%${search}%` } },
            { lastName: { [Op.iLike]: `%${search}%` } },
          ],
        };
        userInclude.required = false; // Keep it as LEFT JOIN
      }
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

