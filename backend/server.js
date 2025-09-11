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

const app = express();
const PORT = process.env.PORT || 3001;

// --- Ensure upload directories exist ---
const baseUploadDir = process.env.UPLOAD_PATH || './uploads';
const consultationUploadDir = path.join(baseUploadDir, 'consultations');

[baseUploadDir, consultationUploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const resources = ['copyright', 'patents'];
const types = ['images', 'files'];
resources.forEach(resource => {
  types.forEach(type => {
    const dir = path.join(baseUploadDir, resource, type);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
});

// --- Rate limiting ---
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, error: 'Too many requests, try later.' }
});

const consultationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: 'Too many consultation submissions, try later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- Security ---
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// --- CORS configuration (keep only this one) ---
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Optional: handle preflight requests for all routes
app.options('*', cors());

// --- Middleware ---
app.use(globalLimiter);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Serve static uploads ---
app.use('/uploads', express.static(path.resolve(baseUploadDir)));
app.use('/uploads/consultations', express.static(consultationUploadDir));

// --- Trust proxy (important for rate limiting behind proxy) ---
app.set('trust proxy', 1);

// --- MongoDB connection ---
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ip_secure_legal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// --- API Routes ---
app.use('/api/copyright', copyrightRoutes);
app.use('/api', contactRoutes);
app.use('/api/patents', patentRoutes);
app.use('/api/consultations', consultationLimiter, consultationRoutes);

// --- Multer error handling ---
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    let message = 'File upload error';
    if (err.code === 'LIMIT_FILE_SIZE') message = 'File too large (max 10MB)';
    if (err.code === 'LIMIT_FILE_COUNT') message = 'Too many files (max 10)';
    if (err.code === 'LIMIT_UNEXPECTED_FILE') message = 'Unexpected file field';
    return res.status(400).json({ success: false, message });
  }

  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({ success: false, message: err.message });
  }

  next(err);
});

// --- Root endpoint ---
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'IP Secure Legal API Server',
    endpoints: {
      health: '/api/health',
      copyright: '/api/copyright',
      contact: '/api/contact',
      contacts: '/api/contacts',
      patents: '/api/patents',
      consultations: '/api/consultations'
    }
  });
});

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// --- Start server ---
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
