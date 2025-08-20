const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Copyright = require('../models/Copyright');

const router = express.Router();

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, '../copyright-uploads');
const primaryDir = path.join(uploadsDir, 'primary');
const supportingDir = path.join(uploadsDir, 'supporting');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(primaryDir)) fs.mkdirSync(primaryDir, { recursive: true });
if (!fs.existsSync(supportingDir)) fs.mkdirSync(supportingDir, { recursive: true });

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'primary') {
      cb(null, primaryDir);
    } else if (file.fieldname === 'documents') {
      cb(null, supportingDir);
    } else {
      cb(new Error('Invalid fieldname'));
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Create a new copyright application
router.post('/copyright', async (req, res) => {
  try {
    const { title, workType, language, authorName, applicantName, description, publicationDate, isPublished } = req.body;
    
    // Basic validation
    if (!title || !workType || !language || !authorName || !applicantName || !description) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: title, workType, language, authorName, applicantName, description' 
      });
    }
    
    const newApplication = new Copyright({
      title,
      workType,
      language,
      authorName,
      applicantName,
      description,
      publicationDate: publicationDate || null,
      isPublished: !!isPublished,
      status: 'draft'
    });
    
    const savedApplication = await newApplication.save();
    
    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      data: savedApplication
    });
  } catch (error) {
    console.error('Error creating application:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Upload primary file
router.post('/copyright/:id/primary-file', upload.single('primary'), async (req, res) => {
  try {
    const applicationId = req.params.id;
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No file uploaded' 
      });
    }
    
    const application = await Copyright.findById(applicationId);
    
    if (!application) {
      return res.status(404).json({ 
        success: false,
        error: 'Application not found' 
      });
    }
    
    // Update application with file info
    application.primaryFile = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path
    };
    
    const updatedApplication = await application.save();
    
    res.json({
      success: true,
      message: 'Primary file uploaded successfully',
      data: updatedApplication.primaryFile
    });
  } catch (error) {
    console.error('Error uploading primary file:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid application ID'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Upload supporting documents
router.post('/copyright/:id/supporting-documents', upload.array('documents', 10), async (req, res) => {
  try {
    const applicationId = req.params.id;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No files uploaded' 
      });
    }
    
    const application = await Copyright.findById(applicationId);
    
    if (!application) {
      return res.status(404).json({ 
        success: false,
        error: 'Application not found' 
      });
    }
    
    // Add file info to application
    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path
    }));
    
    if (!application.supportingDocuments) {
      application.supportingDocuments = [];
    }
    
    application.supportingDocuments.push(...uploadedFiles);
    const updatedApplication = await application.save();
    
    res.json({
      success: true,
      message: 'Supporting documents uploaded successfully',
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading supporting documents:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid application ID'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Get application by ID
router.get('/copyright/:id', async (req, res) => {
  try {
    const applicationId = req.params.id;
    const application = await Copyright.findById(applicationId);
    
    if (!application) {
      return res.status(404).json({ 
        success: false,
        error: 'Application not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Application retrieved successfully',
      data: application
    });
  } catch (error) {
    console.error('Error retrieving application:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid application ID'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Get all applications
router.get('/copyright', async (req, res) => {
  try {
    const applications = await Copyright.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      message: 'Applications retrieved successfully',
      data: applications
    });
  } catch (error) {
    console.error('Error retrieving applications:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Update application status
router.patch('/copyright/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    
    if (!status || !['draft', 'submitted', 'under_review', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Valid status is required: draft, submitted, under_review, approved, rejected'
      });
    }
    
    const application = await Copyright.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!application) {
      return res.status(404).json({ 
        success: false,
        error: 'Application not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid application ID'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

module.exports = router;