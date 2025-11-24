const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const nodemailer = require('nodemailer');
const twilio = require('twilio'); // ✅ Added for Twilio 2FA
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

[baseUploadDir, consultationUploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created upload directory: ${dir}`);
  }
});

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

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, error: 'Too many requests, please try again later.' },
});

const consultationLimiter = rateLimit({
  windowMs: 60 * 60,
  max: 5,
  message: { success: false, message: 'Too many consultation submissions. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware setup
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(globalLimiter);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.resolve(baseUploadDir)));
app.use('/uploads/consultations', express.static(consultationUploadDir));
app.set('trust proxy', 1);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ip_secure_legal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    availableEndpoints: [
      '/api/health',
      '/api/send-otp',
      '/api/send-admin-otp',
      '/api/verify-admin-otp',
      '/api/copyright',
      '/api/contact',
      '/api/patents',
      '/api/consultations'
    ]
  });
});


// ✅ TWILIO 2FA ROUTES (NEW)
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send OTP to admin phone
app.post('/api/send-admin-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  try {
    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({ to: phone, channel: 'sms' });

    console.log(`📱 OTP sent via Twilio to ${phone}`);
    res.json({ success: true, message: 'OTP sent successfully', sid: verification.sid });
  } catch (error) {
    console.error('❌ Twilio send-admin-otp error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// Verify OTP code
app.post('/api/verify-admin-otp', async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ success: false, message: 'Phone and OTP code are required' });
  }

  try {
    const verification_check = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({ to: phone, code });

    if (verification_check.status === 'approved') {
      console.log(`✅ OTP verified for ${phone}`);
      res.json({ success: true, message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('❌ Twilio verify-admin-otp error:', error);
    res.status(500).json({ success: false, message: 'OTP verification failed' });
  }
});


// ✅ Email OTP (Old, still active if needed)
app.post('/api/send-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP required' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Admin Security" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Your Verification Code',
      text: `Your OTP code is ${otp}. It will expire in 2 minutes.`,
    });

    console.log(`📩 OTP email sent to ${email}`);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('❌ OTP email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP email' });
  }
});

// API Routes
app.use('/api/copyright', copyrightRoutes);
app.use('/api', contactRoutes);
app.use('/api/patents', patentRoutes);
app.use('/api/consultations', consultationLimiter, consultationRoutes);
app.use('/api/payment', paymentRoutes);

// Multer error handler
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: 'File too large (max 10MB)',
      LIMIT_FILE_COUNT: 'Too many files (max 10)',
      LIMIT_UNEXPECTED_FILE: 'Unexpected file field',
    };
    return res.status(400).json({ success: false, message: messages[error.code] || 'Upload error' });
  }
  next(error);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
    availableEndpoints: [
      '/api/health',
      '/api/send-otp',
      '/api/send-admin-otp',
      '/api/verify-admin-otp',
      '/api/copyright',
      '/api/contact',
      '/api/patents',
      '/api/consultations',
    ],
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  return () => {
    console.log(`\n${signal} received. Shutting down...`);
    server.close(() => {
      mongoose.connection.close(false, () => {
        console.log('MongoDB disconnected.');
        process.exit(0);
      });
    });
    setTimeout(() => process.exit(1), 10000);
  };
};
process.on('SIGTERM', gracefulShutdown('SIGTERM'));
process.on('SIGINT', gracefulShutdown('SIGINT'));

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🧩 Twilio 2FA active: /api/send-admin-otp, /api/verify-admin-otp`);
});
module.exports = app;
