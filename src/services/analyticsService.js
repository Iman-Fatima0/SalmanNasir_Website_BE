const analyticsRepository = require('../repositories/analyticsRepository');

class AnalyticsService {
  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(options) {
    return await analyticsRepository.getRevenueAnalytics(options);
  }

  /**
   * Get course analytics
   */
  async getCourseAnalytics() {
    return await analyticsRepository.getCourseAnalytics();
  }

  /**
   * Get student analytics
   */
  async getStudentAnalytics() {
    return await analyticsRepository.getStudentAnalytics();
  }

  /**
   * Get funnel analytics
   */
  async getFunnelAnalytics() {
    return await analyticsRepository.getFunnelAnalytics();
  }
}

module.exports = new AnalyticsService();
