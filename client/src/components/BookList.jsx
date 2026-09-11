import { Edit, Trash2, BookOpen } from 'lucide-react';
import QRCodeDisplay from './QRCodeDisplay.jsx';

export default function BookList({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-500">No books found</h3>
        <p className="text-sm text-gray-400 mt-1">
          Add your first book or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {books.map((book) => (
        <div
          key={book._id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-800 truncate">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">by {book.author}</p>
              </div>
              <span
                className={`ml-3 shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  book.availableCopies > 0
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {book.availableCopies > 0 ? 'Available' : 'Unavailable'}
              </span>
            </div>

            <div className="space-y-1.5 text-sm text-gray-600 mb-4">
              <p>
                <span className="font-medium text-gray-700">ISBN:</span> {book.isbn}
              </p>
              <p>
                <span className="font-medium text-gray-700">Category:</span>{' '}
                {book.category}
              </p>
              <p>
                <span className="font-medium text-gray-700">Copies:</span>{' '}
                <span
                  className={`font-semibold ${
                    book.availableCopies > 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {book.availableCopies}
                </span>
                <span className="text-gray-400"> / {book.totalCopies}</span>
              </p>
            </div>

            <div className="flex items-center justify-between">
              <QRCodeDisplay value={book.uniqueBookId} size={80} />
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(book)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Edit book"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(book._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete book"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
