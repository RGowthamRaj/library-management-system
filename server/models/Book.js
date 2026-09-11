const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    totalCopies: {
      type: Number,
      required: [true, 'Total copies is required'],
      min: [1, 'Total copies must be at least 1'],
    },
    availableCopies: {
      type: Number,
      min: [0, 'Available copies cannot be negative'],
      default: function () {
        return this.totalCopies;
      },
      validate: {
        // Enforce availableCopies <= totalCopies at the schema level to guard against race conditions or data anomalies
        validator: function (val) {
          return this.totalCopies === undefined || val <= this.totalCopies;
        },
        message: 'Available copies cannot exceed total copies',
      },
    },
    // We use a UUID for uniqueBookId instead of MongoDB _id to prevent database ID leakage when embedding identifiers into printable QR codes
    uniqueBookId: {
      type: String,
      unique: true,
      required: [true, 'Unique Book ID is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

// Single-field B-tree indexes optimize high-frequency regex and category catalog lookups
bookSchema.index({ title: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ category: 1 });

module.exports = mongoose.model('Book', bookSchema);

