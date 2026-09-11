const dashboardService = require('../services/dashboardService');

class DashboardController {
  async getStats(req, res, next) {
    try {
      const stats = await dashboardService.getStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
