const Book = require('../models/Book');
const Transaction = require('../models/Transaction');

class DashboardService {
  async getStats() {
    const totalBooks = await Book.countDocuments();
    const books = await Book.find().lean();

    const totalCopies = books.reduce((sum, b) => sum + b.totalCopies, 0);
    const totalAvailable = books.reduce((sum, b) => sum + b.availableCopies, 0);
    const totalIssued = totalCopies - totalAvailable;

    // Get all active (issued) transactions
    const activeTransactions = await Transaction.find({ status: 'issued' })
      .populate('bookId')
      .lean();

    const now = new Date();
    const OVERDUE_DAYS = 14;

    const borrowedBooks = activeTransactions.map((t) => {
      const issueDate = new Date(t.issueDate);
      const daysSinceIssue = Math.floor(
        (now.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const daysOverdue = Math.max(0, daysSinceIssue - OVERDUE_DAYS);

      return {
        transactionId: t._id,
        bookTitle: t.bookId ? t.bookId.title : 'N/A',
        bookIsbn: t.bookId ? t.bookId.isbn : 'N/A',
        bookAuthor: t.bookId ? t.bookId.author : 'N/A',
        borrowerName: t.borrowerName,
        borrowerEmail: t.borrowerEmail,
        issueDate: t.issueDate,
        daysSinceIssue,
        daysOverdue,
        isOverdue: daysOverdue > 0,
      };
    });

    const overdueBooks = borrowedBooks.filter((b) => b.isOverdue).length;

    return {
      totalBooks,
      totalCopies,
      totalAvailable,
      totalIssued,
      overdueBooks,
      borrowedBooks,
    };
  }
}

module.exports = new DashboardService();
