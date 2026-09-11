const exportService = require('../services/exportService');

class ExportController {
  async exportHistory(req, res, next) {
    try {
      const csv = await exportService.exportTransactionHistory();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=transaction_history.csv'
      );
      res.send(csv);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExportController();
