const transactionService = require('../services/transactionService');

class TransactionController {
  async issueBook(req, res, next) {
    try {
      const transaction = await transactionService.issueBook(req.body);
      res.status(201).json({ success: true, data: transaction });
    } catch (error) {
      next(error);
    }
  }

  async returnBook(req, res, next) {
    try {
      const transaction = await transactionService.returnBook(req.body);
      res.json({ success: true, data: transaction });
    } catch (error) {
      next(error);
    }
  }

  async getAllTransactions(req, res, next) {
    try {
      const transactions = await transactionService.getAllTransactions();
      res.json({ success: true, data: transactions, count: transactions.length });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TransactionController();
