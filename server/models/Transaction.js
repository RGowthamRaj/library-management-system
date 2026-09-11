const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book ID is required'],
    },
    borrowerName: {
      type: String,
      required: [true, 'Borrower name is required'],
      trim: true,
    },
    borrowerEmail: {
      type: String,
      required: [true, 'Borrower email is required'],
      trim: true,
      lowercase: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['issued', 'returned'],
      default: 'issued',
    },
  },
  { timestamps: true }
);

// Compound index on { bookId: 1, status: 1 } ensures return lookups find the active borrow record in O(log N) time without scanning closed transactions
transactionSchema.index({ bookId: 1, status: 1 });
// Indexing borrowerEmail speeds up history filtering when auditing a specific patron's borrowings
transactionSchema.index({ borrowerEmail: 1 });
// Indexing status and issueDate together drastically accelerates overdue date filtering for the admin analytics dashboard
transactionSchema.index({ status: 1, issueDate: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);

