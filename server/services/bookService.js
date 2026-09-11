const Book = require('../models/Book');
const { v4: uuidv4 } = require('uuid');

class BookService {
  async getAllBooks(filters = {}) {
    const query = {};

    // Used case-insensitive regex ($options: 'i') to allow forgiving partial matches for patron title and author searches
    if (filters.title) {
      query.title = { $regex: filters.title, $options: 'i' };
    }

    if (filters.author) {
      query.author = { $regex: filters.author, $options: 'i' };
    }

    if (filters.available === 'true') {
      query.availableCopies = { $gt: 0 };
    } else if (filters.available === 'false') {
      query.availableCopies = { $eq: 0 };
    }

    // Default to newest additions first so librarians immediately see recently cataloged acquisitions
    return await Book.find(query).sort({ createdAt: -1 });
  }

  async getBookById(id) {
    const book = await Book.findById(id);
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      throw error;
    }
    return book;
  }

  async getBookByUniqueId(uniqueBookId) {
    const book = await Book.findOne({ uniqueBookId });
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      throw error;
    }
    return book;
  }

  async createBook(bookData) {
    // We generate a UUID for the QR code payload instead of MongoDB _id to prevent internal database ID leakage
    const uniqueBookId = uuidv4();
    const book = new Book({
      ...bookData,
      availableCopies: bookData.totalCopies,
      uniqueBookId,
    });
    return await book.save();
  }

  async updateBook(id, bookData) {
    const book = await Book.findById(id);
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      throw error;
    }

    // When total stock is adjusted, preserve current borrow counts by subtracting actively checked-out copies
    if (bookData.totalCopies !== undefined) {
      const issuedCopies = book.totalCopies - book.availableCopies;
      bookData.availableCopies = Math.max(0, bookData.totalCopies - issuedCopies);
    }


    Object.assign(book, bookData);
    return await book.save();
  }

  async deleteBook(id) {
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      throw error;
    }
    return book;
  }
}

module.exports = new BookService();
