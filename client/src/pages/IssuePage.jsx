import { useState } from 'react';
import { BookPlus, CheckCircle, AlertCircle, Loader2, BookOpen } from 'lucide-react';
import QRScanner from '../components/QRScanner.jsx';
import QRCodeDisplay from '../components/QRCodeDisplay.jsx';
import { transactionAPI, bookAPI } from '../services/api.js';

export default function IssuePage() {
  const [scannedId, setScannedId] = useState('');
  const [book, setBook] = useState(null);
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerEmail, setBorrowerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleScan = async (uniqueBookId) => {
    setScannedId(uniqueBookId);
    setBook(null);
    setMessage(null);
    setLookupLoading(true);

    try {
      const response = await bookAPI.getAll();
      const foundBook = response.data.data.find(
        (b) => b.uniqueBookId === uniqueBookId
      );
      if (foundBook) {
        setBook(foundBook);
      } else {
        setMessage({ type: 'error', text: 'Book not found with this QR code.' });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to look up book.',
      });
    } finally {
      setLookupLoading(false);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    if (!borrowerName.trim() || !borrowerEmail.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all borrower details.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await transactionAPI.issue({
        uniqueBookId: scannedId,
        borrowerName: borrowerName.trim(),
        borrowerEmail: borrowerEmail.trim(),
      });
      setMessage({
        type: 'success',
        text: `Book "${book.title}" issued successfully to ${borrowerName}!`,
      });
      setBook(null);
      setScannedId('');
      setBorrowerName('');
      setBorrowerEmail('');
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to issue book.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScannedId('');
    setBook(null);
    setBorrowerName('');
    setBorrowerEmail('');
    setMessage(null);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Issue Book</h1>
        <p className="text-sm text-gray-500 mt-1">
          Scan a book's QR code to issue it to a borrower
        </p>
      </div>

      {/* Status message */}
      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* QR Scanner */}
      {!book && <QRScanner onScan={handleScan} />}

      {/* Loading lookup */}
      {lookupLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="ml-2 text-sm text-gray-600">Looking up book...</span>
        </div>
      )}

      {/* Book details and issue form */}
      {book && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4 mb-6">
            <QRCodeDisplay value={book.uniqueBookId} size={100} />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {book.title}
              </h3>
              <p className="text-sm text-gray-500">by {book.author}</p>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>ISBN: {book.isbn}</p>
                <p>Category: {book.category}</p>
                <p>
                  Available:{' '}
                  <span
                    className={`font-semibold ${
                      book.availableCopies > 0
                        ? 'text-emerald-600'
                        : 'text-red-600'
                    }`}
                  >
                    {book.availableCopies}
                  </span>{' '}
                  / {book.totalCopies}
                </p>
              </div>
            </div>
          </div>

          {book.availableCopies > 0 ? (
            <form onSubmit={handleIssue} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Borrower Name *
                </label>
                <input
                  type="text"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  placeholder="Enter borrower's full name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Borrower Email *
                </label>
                <input
                  type="email"
                  value={borrowerEmail}
                  onChange={(e) => setBorrowerEmail(e.target.value)}
                  placeholder="Enter borrower's email"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <BookPlus className="w-4 h-4" />
                  )}
                  Issue Book
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">
                No copies available for this book.
              </p>
              <button
                onClick={handleReset}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Scan Another Book
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
