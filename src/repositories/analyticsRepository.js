const { Op, Sequelize } = require('sequelize');
const { User, Order, Course, Product, Enrollment, Payment, LessonProgress } = require('../models/index');

class AnalyticsRepository {
  /**
   * Get revenue analytics with time series data
   * @param {Object} options - { period: 'daily'|'weekly'|'monthly'|'yearly', startDate, endDate }
   */
  async getRevenueAnalytics(options = {}) {
    const { period = 'monthly', startDate, endDate } = options;
    
    const now = new Date();
    const defaultStartDate = startDate || new Date(now.getFullYear(), now.getMonth() - 11, 1); // Last 12 months
    const defaultEndDate = endDate || now;
    
    // Build date grouping based on period
    let dateFormat, groupBy;
    switch (period) {
      case 'daily':
        dateFormat = '%Y-%m-%d';
        groupBy = Sequelize.fn('DATE', Sequelize.col('Order.createdAt'));
        break;
      case 'weekly':
        dateFormat = '%Y-%W';
        groupBy = Sequelize.literal("DATE_TRUNC('week', \"Order\".\"createdAt\")");
        break;
      case 'monthly':
        dateFormat = '%Y-%m';
        groupBy = Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('Order.createdAt'));
        break;
      case 'yearly':
        dateFormat = '%Y';
        groupBy = Sequelize.fn('DATE_TRUNC', 'year', Sequelize.col('Order.createdAt'));
        break;
      default:
        dateFormat = '%Y-%m';
        groupBy = Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('Order.createdAt'));
    }

    // Get time series revenue data
    const revenueTimeSeries = await Order.findAll({
      where: {
        status: 'completed',
        createdAt: {
          [Op.between]: [defaultStartDate, defaultEndDate],
        },
      },
      attributes: [
        [groupBy, 'period'],
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'revenue'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'orders'],
      ],
      group: [groupBy],
      order: [[groupBy, 'ASC']],
      raw: true,
    });

    // Get total metrics
    const totalMetrics = await Order.findOne({
      where: {
        status: 'completed',
        createdAt: {
          [Op.between]: [defaultStartDate, defaultEndDate],
        },
      },
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalRevenue'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalOrders'],
        [Sequelize.fn('AVG', Sequelize.col('amount')), 'averageOrderValue'],
      ],
      raw: true,
    });

    // Format time series data
    const timeSeriesData = revenueTimeSeries.map((item) => ({
      date: item.period instanceof Date 
        ? item.period.toISOString().split('T')[0]
        : item.period,
      revenue: parseFloat(item.revenue || 0),
      orders: parseInt(item.orders || 0, 10),
    }));

    return {
      period,
      totalRevenue: parseFloat(totalMetrics?.totalRevenue || 0),
      totalOrders: parseInt(totalMetrics?.totalOrders || 0, 10),
      averageOrderValue: parseFloat(totalMetrics?.averageOrderValue || 0),
      timeSeries: timeSeriesData,
      startDate: defaultStartDate,
      endDate: defaultEndDate,
    };
  }

  /**
   * Get course analytics - performance metrics and top courses
   */
  async getCourseAnalytics() {
    // Get top courses by enrollments
    const topCoursesByEnrollments = await Order.sequelize.query(
      `
      SELECT 
        c.id as course_id,
        p.title as course_title,
        p.price as course_price,
        COUNT(DISTINCT o.id) as enrollments,
        COUNT(DISTINCT CASE WHEN o.status = 'completed' THEN o.id END) as completed_orders,
        COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.amount END), 0) as revenue
      FROM orders o
      LEFT JOIN courses c ON o."courseId" = c.id
      LEFT JOIN products p ON c."productId" = p.id
      WHERE o."courseId" IS NOT NULL AND p.id IS NOT NULL
      GROUP BY c.id, p.title, p.price
      ORDER BY enrollments DESC
      LIMIT 10
      `,
      { type: Order.sequelize.QueryTypes.SELECT }
    );

    // Get top courses by revenue
    const topCoursesByRevenue = await Order.sequelize.query(
      `
      SELECT 
        c.id as course_id,
        p.title as course_title,
        p.price as course_price,
        COUNT(DISTINCT o.id) as enrollments,
        COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.amount END), 0) as revenue
      FROM orders o
      LEFT JOIN courses c ON o."courseId" = c.id
      LEFT JOIN products p ON c."productId" = p.id
      WHERE o."courseId" IS NOT NULL AND o.status = 'completed' AND p.id IS NOT NULL
      GROUP BY c.id, p.title, p.price
      ORDER BY revenue DESC
      LIMIT 10
      `,
      { type: Order.sequelize.QueryTypes.SELECT }
    );

    // Get enrollment trends (last 12 months)
    const enrollmentTrends = await Order.sequelize.query(
      `
      SELECT 
        DATE_TRUNC('month', o."createdAt") as month,
        COUNT(DISTINCT o.id) as enrollments,
        COUNT(DISTINCT o."courseId") as courses_enrolled
      FROM orders o
      WHERE o."courseId" IS NOT NULL 
        AND o."createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', o."createdAt")
      ORDER BY month ASC
      `,
      { type: Order.sequelize.QueryTypes.SELECT }
    );

    // Get course completion rates
    const completionRates = await Order.sequelize.query(
      `
      SELECT 
        c.id as course_id,
        p.title as course_title,
        COUNT(DISTINCT o.id) as total_enrollments,
        COUNT(DISTINCT e.id) as active_enrollments,
        COUNT(DISTINCT CASE WHEN e.status = 'COMPLETED' THEN e.id END) as completed_enrollments,
        ROUND(
          COUNT(DISTINCT CASE WHEN e.status = 'COMPLETED' THEN e.id END)::numeric / 
          NULLIF(COUNT(DISTINCT e.id), 0) * 100, 
          2
        ) as completion_rate
      FROM courses c
      LEFT JOIN products p ON c."productId" = p.id
      LEFT JOIN orders o ON o."courseId" = c.id
      LEFT JOIN enrollments e ON e."courseId" = c.id
      WHERE p.id IS NOT NULL
      GROUP BY c.id, p.title
      HAVING COUNT(DISTINCT o.id) > 0
      ORDER BY total_enrollments DESC
      LIMIT 20
      `,
      { type: Order.sequelize.QueryTypes.SELECT }
    );

    // Format data
    const formatTopCourses = (courses) =>
      courses.map((course) => ({
        courseId: course.course_id,
        courseTitle: course.course_title,
        price: parseFloat(course.course_price || 0),
        enrollments: parseInt(course.enrollments || 0, 10),
        completedOrders: parseInt(course.completed_orders || 0, 10),
        revenue: parseFloat(course.revenue || 0),
      }));

    const formatEnrollmentTrends = (trends) =>
      trends.map((trend) => ({
        month: trend.month,
        enrollments: parseInt(trend.enrollments || 0, 10),
        coursesEnrolled: parseInt(trend.courses_enrolled || 0, 10),
      }));

    const formatCompletionRates = (rates) =>
      rates.map((rate) => ({
        courseId: rate.course_id,
        courseTitle: rate.course_title,
        totalEnrollments: parseInt(rate.total_enrollments || 0, 10),
        activeEnrollments: parseInt(rate.active_enrollments || 0, 10),
        completedEnrollments: parseInt(rate.completed_enrollments || 0, 10),
        completionRate: parseFloat(rate.completion_rate || 0),
      }));

    return {
      topCoursesByEnrollments: formatTopCourses(topCoursesByEnrollments),
      topCoursesByRevenue: formatTopCourses(topCoursesByRevenue),
      enrollmentTrends: formatEnrollmentTrends(enrollmentTrends),
      completionRates: formatCompletionRates(completionRates),
    };
  }

  /**
   * Get student analytics - growth and engagement
   */
  async getStudentAnalytics() {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    // Get student growth over time (last 12 months)
    const growthTrends = await User.findAll({
      where: {
        status: 'ACTIVE',
        createdAt: {
          [Op.gte]: twelveMonthsAgo,
        },
      },
      attributes: [
        [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('User.createdAt')), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'newUsers'],
      ],
      group: [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('User.createdAt'))],
      order: [[Sequelize.literal('month'), 'ASC']],
      raw: true,
    });

    // Get engagement breakdown
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const engagementBreakdown = await User.sequelize.query(
      `
      SELECT 
        COUNT(DISTINCT u.id) FILTER (WHERE lp."lastAccessedAt" >= :sevenDaysAgo) as highly_engaged,
        COUNT(DISTINCT u.id) FILTER (WHERE lp."lastAccessedAt" >= :thirtyDaysAgo AND lp."lastAccessedAt" < :sevenDaysAgo) as moderately_engaged,
        COUNT(DISTINCT u.id) FILTER (WHERE lp."lastAccessedAt" < :thirtyDaysAgo AND lp."lastAccessedAt" IS NOT NULL) as low_engaged,
        COUNT(DISTINCT u.id) FILTER (WHERE lp."lastAccessedAt" IS NULL) as inactive
      FROM users u
      LEFT JOIN enrollments e ON e."userId" = u.id AND e.status = 'ACTIVE'
      LEFT JOIN lesson_progress lp ON lp."enrollmentId" = e.id
      WHERE u.status = 'ACTIVE'
      `,
      {
        type: User.sequelize.QueryTypes.SELECT,
        replacements: {
          sevenDaysAgo: sevenDaysAgo.toISOString(),
          thirtyDaysAgo: thirtyDaysAgo.toISOString(),
        },
      }
    );

    // Get activity by day of week
    const activityByDay = await LessonProgress.sequelize.query(
      `
      SELECT 
        EXTRACT(DOW FROM lp."updatedAt") as day_of_week,
        COUNT(DISTINCT e."userId") as active_users,
        COUNT(*) as activities
      FROM lesson_progress lp
      INNER JOIN enrollments e ON e.id = lp."enrollmentId"
      WHERE lp."updatedAt" >= :thirtyDaysAgo
      GROUP BY EXTRACT(DOW FROM lp."updatedAt")
      ORDER BY day_of_week
      `,
      {
        type: LessonProgress.sequelize.QueryTypes.SELECT,
        replacements: { thirtyDaysAgo: thirtyDaysAgo.toISOString() },
      }
    );

    // Format growth trends
    const formattedGrowthTrends = growthTrends.map((trend) => ({
      month: trend.month instanceof Date 
        ? trend.month.toISOString().split('T')[0]
        : trend.month,
      newUsers: parseInt(trend.newUsers || 0, 10),
    }));

    // Format engagement - return as both object and array for frontend compatibility
    const engagement = engagementBreakdown[0] || {};
    const formattedEngagement = {
      highlyEngaged: parseInt(engagement.highly_engaged || 0, 10),
      moderatelyEngaged: parseInt(engagement.moderately_engaged || 0, 10),
      lowEngaged: parseInt(engagement.low_engaged || 0, 10),
      inactive: parseInt(engagement.inactive || 0, 10),
    };

    // Format engagement as array for frontend (engagementData.map)
    const engagementData = [
      {
        label: 'Highly Engaged',
        value: formattedEngagement.highlyEngaged,
        type: 'highlyEngaged',
      },
      {
        label: 'Moderately Engaged',
        value: formattedEngagement.moderatelyEngaged,
        type: 'moderatelyEngaged',
      },
      {
        label: 'Low Engaged',
        value: formattedEngagement.lowEngaged,
        type: 'lowEngaged',
      },
      {
        label: 'Inactive',
        value: formattedEngagement.inactive,
        type: 'inactive',
      },
    ];

    // Format activity by day
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const formattedActivityByDay = activityByDay.map((activity) => ({
      day: dayNames[parseInt(activity.day_of_week, 10)],
      dayOfWeek: parseInt(activity.day_of_week, 10),
      activeUsers: parseInt(activity.active_users || 0, 10),
      activities: parseInt(activity.activities || 0, 10),
    }));

    return {
      growthTrends: formattedGrowthTrends,
      engagement: formattedEngagement,
      engagementData, // Array format for frontend
      activityByDay: formattedActivityByDay,
    };
  }

  /**
   * Get conversion funnel analytics
   */
  async getFunnelAnalytics() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get funnel data - this is simplified as we don't have visitor tracking
    // We'll use signups, course views (estimated from enrollments), cart (orders with status pending), checkout (orders with status processing), purchases (completed orders)

    // Get total active users (as proxy for visitors)
    const totalActiveUsers = await User.count({
      where: { status: 'ACTIVE' },
    });

    // Get signups in last 30 days
    const signups = await User.count({
      where: {
        status: 'ACTIVE',
        createdAt: {
          [Op.gte]: thirtyDaysAgo,
        },
      },
    });

    // Get course views (estimated from enrollments + course detail page views)
    // Using enrollments as proxy for course views
    const courseViews = await Enrollment.count({
      where: {
        enrolledAt: {
          [Op.gte]: thirtyDaysAgo,
        },
      },
    });

    // Get cart additions (orders in pending status)
    const cartAdditions = await Order.count({
      where: {
        status: 'pending',
        createdAt: {
          [Op.gte]: thirtyDaysAgo,
        },
      },
    });

    // Get checkout initiations (orders in processing status)
    const checkoutInitiations = await Order.count({
      where: {
        status: 'processing',
        createdAt: {
          [Op.gte]: thirtyDaysAgo,
        },
      },
    });

    // Get purchases (completed orders)
    const purchases = await Order.count({
      where: {
        status: 'completed',
        createdAt: {
          [Op.gte]: thirtyDaysAgo,
        },
      },
    });

    // Calculate conversion rates
    const calculateConversionRate = (numerator, denominator) => {
      if (!denominator || denominator === 0) return 0;
      return ((numerator / denominator) * 100).toFixed(2);
    };

    const funnel = [
      {
        stage: 'visitors',
        count: totalActiveUsers,
        label: 'Total Active Users',
        conversionRate: '100.00',
      },
      {
        stage: 'signups',
        count: signups,
        label: 'Sign Ups',
        conversionRate: calculateConversionRate(signups, totalActiveUsers),
      },
      {
        stage: 'courseViews',
        count: courseViews,
        label: 'Course Views',
        conversionRate: calculateConversionRate(courseViews, signups),
      },
      {
        stage: 'cart',
        count: cartAdditions,
        label: 'Cart Additions',
        conversionRate: calculateConversionRate(cartAdditions, courseViews),
      },
      {
        stage: 'checkout',
        count: checkoutInitiations,
        label: 'Checkout Initiations',
        conversionRate: calculateConversionRate(checkoutInitiations, cartAdditions),
      },
      {
        stage: 'purchases',
        count: purchases,
        label: 'Purchases',
        conversionRate: calculateConversionRate(purchases, checkoutInitiations),
      },
    ];

    // Get funnel by course category (if we have categories)
    // For now, we'll return overall funnel

    // Calculate time to conversion (average time from signup to first purchase)
    const timeToConversion = await User.sequelize.query(
      `
      SELECT 
        AVG(EXTRACT(EPOCH FROM (MIN(o."createdAt") - u."createdAt")) / 86400) as avg_days_to_conversion
      FROM users u
      INNER JOIN orders o ON o."userId" = u.id AND o.status = 'completed'
      WHERE u."createdAt" >= :thirtyDaysAgo
      GROUP BY u.id
      `,
      {
        type: User.sequelize.QueryTypes.SELECT,
        replacements: { thirtyDaysAgo },
      }
    );

    const avgTimeToConversion = timeToConversion[0]?.avg_days_to_conversion
      ? parseFloat(timeToConversion[0].avg_days_to_conversion).toFixed(2)
      : 0;

    return {
      funnel,
      overallConversionRate: calculateConversionRate(purchases, totalActiveUsers),
      averageTimeToConversion: parseFloat(avgTimeToConversion),
    };
  }
}

module.exports = new AnalyticsRepository();

