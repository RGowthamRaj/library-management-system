const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bookRoutes = require('./routes/bookRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const exportRoutes = require('./routes/exportRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parsing early in the pipeline to accommodate frontend clients
app.use(cors());
app.use(express.json());

// Mount modular resource routers under the /api namespace for clean reverse-proxy routing
app.use('/api/books', bookRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Lightweight health check endpoint for container liveness probes (Render, Docker, K8s)
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Centralized error handler mounted as the terminal middleware to capture all service-level rejections
app.use(errorHandler);

// Await successful database connection before binding port to prevent serving traffic without persistence
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

