import { useState, useEffect, useCallback } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import SearchFilter from '../components/SearchFilter.jsx';
import BookList from '../components/BookList.jsx';
import BookForm from '../components/BookForm.jsx';
import { bookAPI } from '../services/api.js';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    available: '',
  });

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.title) params.title = filters.title;
      if (filters.author) params.author = filters.author;
      if (filters.available) params.available = filters.available;

      const response = await bookAPI.getAll(params);
      setBooks(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchBooks();
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchBooks]);

  const handleCreate = async (bookData) => {
    try {
      await bookAPI.create(bookData);
      setShowForm(false);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create book');
    }
  };

  const handleUpdate = async (bookData) => {
    try {
      await bookAPI.update(editingBook._id, bookData);
      setEditingBook(null);
      setShowForm(false);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update book');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await bookAPI.delete(id);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete book');
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Book Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your library collection
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Book
        </button>
      </div>

      <SearchFilter filters={filters} onFilterChange={setFilters} />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchBooks}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      ) : (
        <BookList books={books} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {showForm && (
        <BookForm
          book={editingBook}
          onSubmit={editingBook ? handleUpdate : handleCreate}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
