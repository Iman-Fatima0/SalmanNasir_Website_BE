const analyticsService = require('../services/analyticsService');
const response = require('../utils/response');

class AnalyticsController {
  /**
   * Get revenue analytics
   * GET /api/admin/analytics/revenue?period=daily|weekly|monthly|yearly
   */
  async getRevenueAnalytics(req, res, next) {
    try {
      const { period = 'monthly', startDate, endDate } = req.query;
      const analytics = await analyticsService.getRevenueAnalytics({
        period,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      });
      return response.success(res, analytics, 'Revenue analytics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get course analytics
   * GET /api/admin/analytics/courses
   */
  async getCourseAnalytics(req, res, next) {
    try {
      const analytics = await analyticsService.getCourseAnalytics();
      return response.success(res, analytics, 'Course analytics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student analytics
   * GET /api/admin/analytics/students
   * Note: period parameter is ignored (only used for revenue analytics)
   */
  async getStudentAnalytics(req, res, next) {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/08431233-e53a-4860-9ccd-3efe6444419f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'analyticsController.js:40',message:'getStudentAnalytics called',data:{query:req.query},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const analytics = await analyticsService.getStudentAnalytics();
      return response.success(res, analytics, 'Student analytics retrieved successfully');
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/08431233-e53a-4860-9ccd-3efe6444419f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'analyticsController.js:47',message:'getStudentAnalytics error',data:{errorMessage:error.message,errorStack:error.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      next(error);
    }
  }

  /**
   * Get funnel analytics
   * GET /api/admin/analytics/funnels
   */
  async getFunnelAnalytics(req, res, next) {
    try {
      const analytics = await analyticsService.getFunnelAnalytics();
      return response.success(res, analytics, 'Funnel analytics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalyticsController();

