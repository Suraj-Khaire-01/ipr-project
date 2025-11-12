const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

// Import routes
const copyrightRoutes = require('./routes/copyright');
const contactRoutes = require('./routes/contact');
const patentRoutes = require('./routes/patents');
const consultationRoutes = require('./routes/consultations');
const paymentRoutes = require('./routes/paymentRoutes');


const app = express();
const PORT = process.env.PORT || 3001;

// Ensure upload directories exist
const baseUploadDir = process.env.UPLOAD_PATH || './uploads';
const consultationUploadDir = path.join(__dirname, 'uploads/consultations');

// Create all necessary upload directories
[baseUploadDir, consultationUploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created upload directory: ${dir}`);
  }
});

// Pre-create common resource subfolders
const resources = ['copyright', 'patents'];
const types = ['images', 'files'];
resources.forEach(resource => {
  types.forEach(type => {
    const dir = path.join(baseUploadDir, resource, type);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created resource directory: ${dir}`);
    }
  });
});

// Rate limiting configurations
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  }
});

const consultationLimiter = rateLimit({
  windowMs: 60 * 60, //
  max: 5, // Limit each IP to 5 consultation submissions per hour
  message: {
    success: false,
    message: 'Too many consultation submissions. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    // Add your production domain here
    // 'https://yourwebsite.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Middleware
app.use(globalLimiter);
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.resolve(baseUploadDir)));
app.use('/uploads/consultations', express.static(consultationUploadDir));

// Trust proxy (important for rate limiting when behind a proxy)
app.set('trust proxy', 1);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ip_secure_legal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uploadDirectories: {
      base: baseUploadDir,
      consultations: consultationUploadDir
    }
  });
});

// API Routes
app.use('/api/copyright', copyrightRoutes);
app.use('/api', contactRoutes);
app.use('/api/patents', patentRoutes);
app.use('/api/consultations', consultationLimiter, consultationRoutes);
app.use('/api/payment', paymentRoutes);

// Multer error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size allowed is 10MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 10 files allowed.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field. Please check your file upload form.'
      });
    }
  }
  
  if (error.message === 'Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, and PNG files are allowed.') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'IP Secure Legal API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      copyright: '/api/copyright',
      contact: '/api/contact',
      contacts: '/api/contacts',
      patents: '/api/patents',
      consultations: '/api/consultations'
    },
    documentation: 'See /api/health for server status and upload directory information'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
    availableEndpoints: [
      '/api/health',
      '/api/copyright',
      '/api/contact',
      '/api/contacts', 
      '/api/patents',
      '/api/consultations'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validationErrors
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format'
    });
  }

  // MongoDB duplicate key error
  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate entry',
      details: ['A record with this information already exists']
    });
  }

  // JSON parsing error
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON format'
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { 
      details: error.message,
      stack: error.stack 
    })
  });
});

// Graceful shutdown handlers
const gracefulShutdown = (signal) => {
  return () => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    
    // Close server first
    server.close(() => {
      console.log('HTTP server closed.');
      
      // Then close database connection
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed.');
        process.exit(0);
      });
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };
};

// Listen for termination signals
process.on('SIGTERM', gracefulShutdown('SIGTERM'));
process.on('SIGINT', gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Base upload directory: ${baseUploadDir}`);
  console.log(`📁 Consultation upload directory: ${consultationUploadDir}`);
  console.log(`📝 Available endpoints:`); 
  console.log(`   - /api/health (Server status)`);
  console.log(`   - /api/copyright (Copyright services)`);
  console.log(`   - /api/contact (Contact forms)`);
  console.log(`   - /api/contacts (Contact management)`);
  console.log(`   - /api/patents (Patent services)`);
  console.log(`   - /api/consultations (Consultation requests)`);
});

module.exports = app;