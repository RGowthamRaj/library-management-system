import { useState } from 'react';
import { RotateCcw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import QRScanner from '../components/QRScanner.jsx';
import { transactionAPI } from '../services/api.js';

export default function ReturnPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [returnedTransaction, setReturnedTransaction] = useState(null);

  const handleScan = async (uniqueBookId) => {
    setLoading(true);
    setMessage(null);
    setReturnedTransaction(null);

    try {
      const response = await transactionAPI.return({ uniqueBookId });
      const transaction = response.data.data;
      setReturnedTransaction(transaction);
      setMessage({
        type: 'success',
        text: `Book "${transaction.bookId?.title || 'Unknown'}" returned successfully!`,
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to return book.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessage(null);
    setReturnedTransaction(null);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Return Book</h1>
        <p className="text-sm text-gray-500 mt-1">
          Scan a book's QR code to process the return
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

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="ml-2 text-sm text-gray-600">Processing return...</span>
        </div>
      )}

      {/* QR Scanner */}
      {!loading && <QRScanner onScan={handleScan} />}

      {/* Return details */}
      {returnedTransaction && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-full">
              <RotateCcw className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Return Processed
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Book Title:</span>
              <p className="text-gray-600">
                {returnedTransaction.bookId?.title || 'N/A'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Author:</span>
              <p className="text-gray-600">
                {returnedTransaction.bookId?.author || 'N/A'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Borrower:</span>
              <p className="text-gray-600">
                {returnedTransaction.borrowerName}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Email:</span>
              <p className="text-gray-600">
                {returnedTransaction.borrowerEmail}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Issue Date:</span>
              <p className="text-gray-600">
                {new Date(returnedTransaction.issueDate).toLocaleDateString(
                  'en-US',
                  { year: 'numeric', month: 'short', day: 'numeric' }
                )}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Return Date:</span>
              <p className="text-gray-600">
                {new Date(returnedTransaction.returnDate).toLocaleDateString(
                  'en-US',
                  { year: 'numeric', month: 'short', day: 'numeric' }
                )}
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="mt-6 w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Scan Another Book
          </button>
        </div>
      )}
    </div>
  );
}
