const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Consultation = require('../models/Consultation');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/consultations/';

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, and PNG files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// @route   POST /api/consultations
// @desc    Create a new consultation request
// @access  Public
router.post('/', upload.array('files', 10), async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      workType,
      description,
      consultationType,
      preferredDate,
      preferredTime,
      marketingConsent,
      communicationPreference,
      clerkUserId // ← ADDED: Clerk user ID
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !workType || !description || !consultationType || !preferredDate || !preferredTime || !clerkUserId) {
      // Delete uploaded files if validation fails
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }

      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
        errors: {
          fullName: !fullName ? 'Full name is required' : null,
          email: !email ? 'Email is required' : null,
          phone: !phone ? 'Phone is required' : null,
          workType: !workType ? 'Work type is required' : null,
          description: !description ? 'Description is required' : null,
          consultationType: !consultationType ? 'Consultation type is required' : null,
          preferredDate: !preferredDate ? 'Preferred date is required' : null,
          preferredTime: !preferredTime ? 'Preferred time is required' : null,
          clerkUserId: !clerkUserId ? 'User authentication required' : null // ← ADDED: Clerk ID validation
        }
      });
    }

    // Process uploaded files
    const uploadedFiles = req.files ? req.files.map(file => ({
      fileName: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date()
    })) : [];

    // Get client IP and User Agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Convert marketingConsent to boolean
    const marketingConsentBool = marketingConsent === 'true' || marketingConsent === true;

    // Create consultation object
    const consultationData = {
      clerkUserId: clerkUserId, // ← ADDED: Clerk user ID
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      workType,
      description: description.trim(),
      consultationType,
      preferredDate: new Date(preferredDate),
      preferredTime,
      uploadedFiles,
      marketingConsent: marketingConsentBool,
      communicationPreference: communicationPreference || 'both',
      ipAddress,
      userAgent,
      status: 'pending'
    };

    // Create new consultation
    const consultation = new Consultation(consultationData);
    await consultation.save();

    // Format response data
    const responseData = {
      consultationId: consultation.consultationId,
      fullName: consultation.fullName,
      email: consultation.email,
      consultationType: consultation.consultationType,
      workType: consultation.workType,
      preferredDate: consultation.preferredDate.toDateString(),
      preferredTime: consultation.preferredTime,
      status: consultation.status,
      filesUploaded: consultation.uploadedFiles.length,
      createdAt: consultation.createdAt
    };

    // Send success response with consultation details
    res.status(201).json({
      success: true,
      message: 'Consultation request submitted successfully',
      data: responseData
    });

    // TODO: Send confirmation email to client
    // TODO: Send notification to admin/attorneys

  } catch (error) {
    console.error('Error creating consultation:', error);

    // Delete uploaded files if consultation creation failed
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Handle duplicate consultation ID (very unlikely but possible)
    if (error.code === 11000) {
      return res.status(500).json({
        success: false,
        message: 'System error occurred. Please try again.'
      });
    }

    // Handle multer errors
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

    if (error.message === 'Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, and PNG files are allowed.') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error occurred while processing your request'
    });
  }
});

// @route   GET /api/consultations/user/:clerkUserId
// @desc    Get consultations for specific user
// @access  Private
router.get('/user/:clerkUserId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const consultations = await Consultation.find({ 
      clerkUserId: req.params.clerkUserId 
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-uploadedFiles -userAgent -ipAddress'); // Exclude sensitive data

    const total = await Consultation.countDocuments({ 
      clerkUserId: req.params.clerkUserId 
    });

    res.json({
      success: true,
      data: consultations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user consultations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching consultations'
    });
  }
});

// @route   GET /api/consultations/user/:clerkUserId/count
// @desc    Get consultation count for user
// @access  Private
router.get('/user/:clerkUserId/count', async (req, res) => {
  try {
    const total = await Consultation.countDocuments({ 
      clerkUserId: req.params.clerkUserId 
    });

    // Count by status
    const pending = await Consultation.countDocuments({ 
      clerkUserId: req.params.clerkUserId,
      status: 'pending'
    });
    
    const confirmed = await Consultation.countDocuments({ 
      clerkUserId: req.params.clerkUserId,
      status: 'confirmed'
    });
    
    const completed = await Consultation.countDocuments({ 
      clerkUserId: req.params.clerkUserId,
      status: 'completed'
    });

    const cancelled = await Consultation.countDocuments({ 
      clerkUserId: req.params.clerkUserId,
      status: 'cancelled'
    });

    res.json({
      success: true,
      data: {
        total,
        pending,
        confirmed,
        completed,
        cancelled
      }
    });
  } catch (error) {
    console.error('Error fetching consultation count:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching consultation count'
    });
  }
});

// @route   GET /api/consultations/user/:clerkUserId/:consultationId
// @desc    Get specific consultation details for user
// @access  Private
router.get('/user/:clerkUserId/:consultationId', async (req, res) => {
  try {
    const consultation = await Consultation.findOne({
      clerkUserId: req.params.clerkUserId,
      $or: [
        { _id: req.params.consultationId },
        { consultationId: req.params.consultationId }
      ]
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    res.json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Error fetching consultation details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching consultation details'
    });
  }
});

// @route   GET /api/consultations
// @desc    Get all consultations (Admin only)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Add filters based on query parameters
    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.workType) {
      filter.workType = req.query.workType;
    }

    if (req.query.consultationType) {
      filter.consultationType = req.query.consultationType;
    }

    if (req.query.fromDate && req.query.toDate) {
      filter.preferredDate = {
        $gte: new Date(req.query.fromDate),
        $lte: new Date(req.query.toDate)
      };
    }

    const consultations = await Consultation.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-uploadedFiles -userAgent -ipAddress'); // Exclude sensitive data

    const total = await Consultation.countDocuments(filter);

    res.json({
      success: true,
      data: consultations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching consultations'
    });
  }
});

// @route   GET /api/consultations/:id
// @desc    Get consultation by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const consultation = await Consultation.findOne({
      $or: [
        { _id: req.params.id },
        { consultationId: req.params.id }
      ]
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    res.json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Error fetching consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching consultation'
    });
  }
});

// @route   PUT /api/consultations/:id
// @desc    Update consultation (Admin only)
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['status', 'assignedAttorney', 'consultationNotes', 'followUpRequired', 'followUpDate', 'estimatedCost', 'actualCost'];

    // Filter updates to only allowed fields
    const filteredUpdates = {};
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    const consultation = await Consultation.findOneAndUpdate(
      {
        $or: [
          { _id: req.params.id },
          { consultationId: req.params.id }
        ]
      },
      filteredUpdates,
      { new: true, runValidators: true }
    );

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    res.json({
      success: true,
      message: 'Consultation updated successfully',
      data: consultation
    });
  } catch (error) {
    console.error('Error updating consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while updating consultation'
    });
  }
});

// @route   DELETE /api/consultations/:id
// @desc    Delete consultation (Admin only)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const consultation = await Consultation.findOne({
      $or: [
        { _id: req.params.id },
        { consultationId: req.params.id }
      ]
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    // Delete associated files
    consultation.uploadedFiles.forEach(file => {
      if (fs.existsSync(file.filePath)) {
        fs.unlinkSync(file.filePath);
      }
    });

    await consultation.deleteOne();

    res.json({
      success: true,
      message: 'Consultation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while deleting consultation'
    });
  }
});

// @route   GET /api/consultations/stats/overview
// @desc    Get consultation statistics
// @access  Private
router.get('/stats/overview', async (req, res) => {
  try {
    const totalConsultations = await Consultation.countDocuments();
    const pendingConsultations = await Consultation.countDocuments({ status: 'pending' });
    const confirmedConsultations = await Consultation.countDocuments({ status: 'confirmed' });
    const completedConsultations = await Consultation.countDocuments({ status: 'completed' });

    // Get consultations by work type
    const workTypeStats = await Consultation.aggregate([
      {
        $group: {
          _id: '$workType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get consultations by consultation type
    const consultationTypeStats = await Consultation.aggregate([
      {
        $group: {
          _id: '$consultationType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent consultations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentConsultations = await Consultation.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      success: true,
      data: {
        total: totalConsultations,
        pending: pendingConsultations,
        confirmed: confirmedConsultations,
        completed: completedConsultations,
        recent: recentConsultations,
        workTypeBreakdown: workTypeStats,
        consultationTypeBreakdown: consultationTypeStats
      }
    });
  } catch (error) {
    console.error('Error fetching consultation stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching statistics'
    });
  }
});

module.exports = router;