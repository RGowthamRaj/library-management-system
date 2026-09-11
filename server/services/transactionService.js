const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

class TransactionService {
  async issueBook({ uniqueBookId, borrowerName, borrowerEmail }) {
    // Validate required fields
    if (!uniqueBookId || !borrowerName || !borrowerEmail) {
      const error = new Error('uniqueBookId, borrowerName, and borrowerEmail are required');
      error.statusCode = 400;
      throw error;
    }

    const book = await Book.findOne({ uniqueBookId });
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify copy availability before checkout to safeguard against race conditions on the last physical copy
    if (book.availableCopies <= 0) {
      const error = new Error('No copies available');
      error.statusCode = 400;
      throw error;
    }

    const transaction = new Transaction({
      bookId: book._id,
      borrowerName,
      borrowerEmail,
    });
    await transaction.save();

    // Immediately decrement availableCopies to maintain synchronized inventory state across concurrent patrons
    book.availableCopies -= 1;
    await book.save();

    return await Transaction.findById(transaction._id).populate('bookId');
  }

  async returnBook({ uniqueBookId }) {
    if (!uniqueBookId) {
      const error = new Error('uniqueBookId is required');
      error.statusCode = 400;
      throw error;
    }

    const book = await Book.findOne({ uniqueBookId });
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      throw error;
    }

    // Resolves the most recent active loan (issueDate: -1) so the latest checkout record closes first
    const transaction = await Transaction.findOne({
      bookId: book._id,
      status: 'issued',
    }).sort({ issueDate: -1 });

    if (!transaction) {
      const error = new Error('No active transaction found for this book');
      error.statusCode = 404;
      throw error;
    }

    transaction.returnDate = new Date();
    transaction.status = 'returned';
    await transaction.save();

    // Restores inventory count immediately so other patrons can issue the returned copy right away
    book.availableCopies += 1;
    await book.save();

    return await Transaction.findById(transaction._id).populate('bookId');
  }

  async getAllTransactions() {
    return await Transaction.find().populate('bookId').sort({ createdAt: -1 });
  }
}


module.exports = new TransactionService();
