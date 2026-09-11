import { Clock, AlertTriangle } from 'lucide-react';

export default function BorrowedBooksTable({ borrowedBooks }) {
  if (!borrowedBooks || borrowedBooks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-base font-medium text-gray-500">
          No books currently borrowed
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          All books have been returned.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-800">
          Currently Borrowed Books
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Book Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                ISBN
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Borrower
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Issue Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Days Overdue
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {borrowedBooks.map((item) => (
              <tr key={item.transactionId} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  {item.bookTitle}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                  {item.bookIsbn}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {item.borrowerName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {item.borrowerEmail}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(item.issueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4">
                  {item.isOverdue ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                      <AlertTriangle className="w-3 h-3" />
                      {item.daysOverdue} days
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      <Clock className="w-3 h-3" />
                      On time
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
