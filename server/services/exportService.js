const Transaction = require('../models/Transaction');
const { Parser } = require('json2csv');

class ExportService {
  async exportTransactionHistory() {
    // Populate referenced book documents and lean() to flatten relations into plain tabular structures for Excel/Sheets
    const transactions = await Transaction.find().populate('bookId').lean();

    const data = transactions.map((t) => ({
      'Book Title': t.bookId ? t.bookId.title : 'N/A',
      'Book Author': t.bookId ? t.bookId.author : 'N/A',
      'Book ISBN': t.bookId ? t.bookId.isbn : 'N/A',
      'Category': t.bookId ? t.bookId.category : 'N/A',
      'Borrower Name': t.borrowerName,
      'Borrower Email': t.borrowerEmail,
      'Issue Date': t.issueDate
        ? new Date(t.issueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : 'N/A',
      'Return Date': t.returnDate
        ? new Date(t.returnDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : 'Not Returned',
      Status: t.status.charAt(0).toUpperCase() + t.status.slice(1),
    }));

    // Explicit field whitelist guarantees deterministic column order in the downloaded CSV across all rows
    const fields = [
      'Book Title',
      'Book Author',
      'Book ISBN',
      'Category',
      'Borrower Name',
      'Borrower Email',
      'Issue Date',
      'Return Date',
      'Status',
    ];

    const parser = new Parser({ fields });
    return parser.parse(data.length > 0 ? data : [{}]);
  }

}

module.exports = new ExportService();
