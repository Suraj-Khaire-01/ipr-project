const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // Determine resource from mounted baseUrl (e.g. '/api/copyright' -> 'copyright')
      const base = (req.baseUrl || '').split('/').filter(Boolean).pop() || 'general';

      // Classify into images vs other files
      const typeDir = file.mimetype && file.mimetype.startsWith('image/') ? 'images' : 'files';

      const destDir = path.join(uploadDir, base, typeDir);

      // Ensure destination exists
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      cb(null, destDir);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeName = (file.originalname || 'file').replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(safeName));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow images, PDFs, and documents
  if (file.mimetype.startsWith('image/') || 
  file.mimetype === 'application/pdf' ||
  file.mimetype === 'application/msword' ||
  file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
  file.mimetype.startsWith('audio/') ||
  file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'), false);
  }
};

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        details: ['Maximum file size is 10MB']
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Unexpected file field',
        details: ['Check the field name for file uploads']
      });
    }
  }
  
  if (error.message === 'Invalid file type. Only images, PDFs, and documents are allowed.') {
    return res.status(400).json({
      success: false,
      error: 'Invalid file type',
      details: ['Only images, PDFs, and documents are allowed']
    });
  }
  
  // Pass other errors to the general error handler
  next(error);
};

const upload = multer({
  storage: storage,
  limits: {
  fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: fileFilter
});

// Utility function to remove uploaded files on error
const cleanupUploadedFiles = (req) => {
  if (req.file) {
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
  
  if (req.files && Array.isArray(req.files)) {
    req.files.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
  }
};

module.exports = {
  upload,
  handleMulterError,
  cleanupUploadedFiles
};