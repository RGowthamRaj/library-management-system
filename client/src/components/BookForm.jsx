import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function BookForm({ book, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    totalCopies: 1,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        category: book.category || '',
        totalCopies: book.totalCopies || 1,
      });
    }
  }, [book]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.totalCopies || formData.totalCopies < 1)
      newErrors.totalCopies = 'At least 1 copy required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        totalCopies: parseInt(formData.totalCopies, 10),
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {book ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-shadow ${
                errors.title
                  ? 'border-red-300 focus:ring-2 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
              placeholder="Enter book title"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author *
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-shadow ${
                errors.author
                  ? 'border-red-300 focus:ring-2 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
              placeholder="Enter author name"
            />
            {errors.author && (
              <p className="mt-1 text-xs text-red-600">{errors.author}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN *
            </label>
            <input
              type="text"
              value={formData.isbn}
              onChange={(e) => handleChange('isbn', e.target.value)}
              disabled={!!book}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-shadow ${
                errors.isbn
                  ? 'border-red-300 focus:ring-2 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              } ${book ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="Enter ISBN"
            />
            {errors.isbn && (
              <p className="mt-1 text-xs text-red-600">{errors.isbn}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-shadow ${
                errors.category
                  ? 'border-red-300 focus:ring-2 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
              placeholder="e.g., Fiction, Science, Programming"
            />
            {errors.category && (
              <p className="mt-1 text-xs text-red-600">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Copies *
            </label>
            <input
              type="number"
              min="1"
              value={formData.totalCopies}
              onChange={(e) => handleChange('totalCopies', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-shadow ${
                errors.totalCopies
                  ? 'border-red-300 focus:ring-2 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            {errors.totalCopies && (
              <p className="mt-1 text-xs text-red-600">{errors.totalCopies}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              {book ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
