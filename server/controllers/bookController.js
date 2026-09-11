const bookService = require('../services/bookService');

class BookController {
  async getAllBooks(req, res, next) {
    try {
      const books = await bookService.getAllBooks(req.query);
      res.json({ success: true, data: books, count: books.length });
    } catch (error) {
      next(error);
    }
  }

  async getBookById(req, res, next) {
    try {
      const book = await bookService.getBookById(req.params.id);
      res.json({ success: true, data: book });
    } catch (error) {
      next(error);
    }
  }

  async createBook(req, res, next) {
    try {
      const book = await bookService.createBook(req.body);
      res.status(201).json({ success: true, data: book });
    } catch (error) {
      next(error);
    }
  }

  async updateBook(req, res, next) {
    try {
      const book = await bookService.updateBook(req.params.id, req.body);
      res.json({ success: true, data: book });
    } catch (error) {
      next(error);
    }
  }

  async deleteBook(req, res, next) {
    try {
      await bookService.deleteBook(req.params.id);
      res.json({ success: true, message: 'Book deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookController();
