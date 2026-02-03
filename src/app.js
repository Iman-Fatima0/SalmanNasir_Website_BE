const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const config = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const publicInstructorRoutes = require('./routes/publicInstructorRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  })
);

// Body parsing middleware
// Note: Don't parse JSON/URL-encoded for upload routes (multer handles multipart/form-data)
// Limits aligned with upload max (500MB for large video/PDF uploads)
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));
app.use(cookieParser());

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Logging middleware
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/instructors', publicInstructorRoutes); // Public instructor routes (browsing)
app.use('/api/instructor', instructorRoutes); // Authenticated instructor routes (managing own courses)
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
