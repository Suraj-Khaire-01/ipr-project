const express = require('express');
const { body, validationResult, query } = require('express-validator');
const rateLimit = require('express-rate-limit');
const Contact = require('../models/Contact');

const router = express.Router();

// Rate limiting middleware
const contactSubmissionLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 submissions per hour per IP
  message: {
    success: false,
    error: 'Too many contact submissions from this IP. Please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limit
const apiLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again later.'
  }
});

// Validation middleware
const validateContactSubmission = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Full name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^[\+]?[1-9][\d\s\-\(\)]{7,20}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('company')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Company name cannot exceed 200 characters'),
  
  body('serviceType')
    .isIn(['patents', 'trademarks', 'copyrights', 'ip-litigation', 'licensing', 'consultation'])
    .withMessage('Please select a valid service type'),
  
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
];

// POST /api/contact - Create new contact submission
router.post('/', contactSubmissionLimit, validateContactSubmission, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array().map(error => error.msg)
      });
    }

    const { fullName, email, phone, company, serviceType, message } = req.body;

    // Check for duplicate submissions (same email and message in last 24 hours)
    const recentSubmission = await Contact.findOne({
      email: email.toLowerCase(),
      message: message.trim(),
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      isDeleted: false
    });

    if (recentSubmission) {
      return res.status(429).json({
        success: false,
        error: 'A similar message from this email was already submitted recently. Please wait 24 hours before submitting again.'
      });
    }

    // Create contact data
    const contactData = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : undefined,
      company: company ? company.trim() : undefined,
      serviceType,
      message: message.trim(),
      ipAddress: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'],
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referrer') || req.get('Referer')
    };

    // Save to database
    const contact = new Contact(contactData);
    const savedContact = await contact.save();

    // Log successful submission
    console.log(`📧 New contact submission: ${savedContact._id} from ${email}`);

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      data: {
        id: savedContact._id,
        submittedAt: savedContact.createdAt,
        status: savedContact.status
      }
    });

    // Here you could add email notification logic
    // await sendNotificationEmail(savedContact);

  } catch (error) {
    console.error('❌ Contact submission error:', error);

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'A submission with this information already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.'
    });
  }
});

// GET /api/contact - Get all contacts with pagination and filtering
router.get('/', apiLimit, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['new', 'in-progress', 'resolved']).withMessage('Invalid status'),
  query('serviceType').optional().isIn(['patents', 'trademarks', 'copyrights', 'ip-litigation', 'licensing', 'consultation']),
  query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'fullName', 'email']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: errors.array().map(error => error.msg)
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const serviceType = req.query.serviceType;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const search = req.query.search;

    const skip = (page - 1) * limit;

    // Build query
    const query = { isDeleted: false };
    
    if (status) query.status = status;
    if (serviceType) query.serviceType = serviceType;
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query
    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .select('-__v -ipAddress -userAgent'),
      Contact.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('❌ Get contacts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve contacts'
    });
  }
});

// GET /api/contact/stats - Get contact statistics
router.get('/stats', apiLimit, async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
        }
      }
    ]);

    const serviceTypeStats = await Contact.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$serviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || { total: 0, new: 0, inProgress: 0, resolved: 0 },
        serviceTypes: serviceTypeStats
      }
    });

  } catch (error) {
    console.error('❌ Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics'
    });
  }
});

// GET /api/contact/:id - Get single contact by ID
router.get('/:id', apiLimit, async (req, res) => {
  try {
    const contact = await Contact.findOne({ 
      _id: req.params.id, 
      isDeleted: false 
    }).select('-__v');

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('❌ Get contact error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid contact ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve contact'
    });
  }
});

// PUT /api/contact/:id/status - Update contact status
router.put('/:id/status', apiLimit, [
  body('status').isIn(['new', 'in-progress', 'resolved']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
    }

    const { status } = req.body;

    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact
    });

  } catch (error) {
    console.error('❌ Update status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update contact status'
    });
  }
});

// DELETE /api/contact/:id - Soft delete contact
router.delete('/:id', apiLimit, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact || contact.isDeleted) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    await contact.softDelete();

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete contact'
    });
  }
});

module.exports = router;