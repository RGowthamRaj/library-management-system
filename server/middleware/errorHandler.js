const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Translate raw Mongoose schema validation violations into human-readable 400 messages for client form feedback
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join(', ');
  }

  // Catch MongoDB E11000 unique index collisions (e.g. duplicate ISBN) to guide user without leaking raw driver errors
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for ${field}. Please use a different value.`;
  }

  // Intercept malformed ObjectId casting failures so the API returns a clean 400 instead of crashing
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Restrict stack traces to development to prevent information leakage in production logs/responses
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });

};

module.exports = errorHandler;
