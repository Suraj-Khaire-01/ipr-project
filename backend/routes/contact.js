const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
// Rate limiting middleware for contact form
const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many contact form submissions. Please try again later.',
    details: ['Rate limit exceeded']
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware
const validateContact = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please enter a valid email address'),
  
  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^[\+]?[1-9][\d\s\-\(\)]{7,20}$/)
    .withMessage('Please enter a valid phone number'),
  
  body('company')
    .optional({ checkFalsy: true })
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

// POST /api/contact - Submit contact form
router.post('/contact', contactRateLimit, validateContact, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array().map(err => err.msg)
      });
    }

    const { fullName, email, phone, company, serviceType, message } = req.body;

    // Create new contact entry
    const newContact = new Contact({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : undefined,
      company: company ? company.trim() : undefined,
      serviceType,
      message: message.trim(),
      submittedAt: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    // Save to database
    const savedContact = await newContact.save();

    // Success response
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: savedContact._id,
        submittedAt: savedContact.submittedAt
      }
    });

    // Log success (you might want to use a proper logger in production)
    console.log(`New contact submission: ${savedContact._id} from ${email}`);

  } catch (error) {
    console.error('Contact form submission error:', error);

    // Handle duplicate email error (if you have unique constraint)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'A submission with this email already exists',
        details: ['Email address already used']
      });
    }

    // Handle validation errors from MongoDB
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.',
      details: ['Server error occurred']
    });
  }
});

// GET /api/contacts - Get all contacts (admin only - you might want to add auth)
router.get('/contacts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // Increased limit for admin dashboard
    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-ipAddress -userAgent'); // Exclude sensitive data

    const total = await Contact.countDocuments();

    // For admin dashboard, return just the data array if no pagination needed
    if (req.query.simple === 'true') {
      return res.json(contacts);
    }

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contacts'
    });
  }
});

// GET /api/contact/:id - Get specific contact
router.get('/contact/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
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
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact'
    });
  }
});

// PATCH /api/contacts/:id - Update contact status (NEW ROUTE FOR ADMIN DASHBOARD)
router.patch('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, respondedAt, respondedBy, adminNotes } = req.body;

    // Validate the status
    const validStatuses = ['pending', 'reviewed', 'responded', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
        details: [`Status must be one of: ${validStatuses.join(', ')}`]
      });
    }

    // Find the contact
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    // Update fields
    const updateData = {};
    if (status) updateData.status = status;
    if (respondedAt) updateData.respondedAt = new Date(respondedAt);
    if (respondedBy) updateData.respondedBy = respondedBy;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    // Update the contact
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: updatedContact
    });

    console.log(`Contact ${id} updated by ${respondedBy || 'admin'}. Status: ${status}`);

  } catch (error) {
    console.error('Error updating contact:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      });
    }

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid contact ID'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update contact'
    });
  }
});

// DELETE /api/contacts/:id - Delete contact (OPTIONAL - for admin cleanup)
router.delete('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    await Contact.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });

    console.log(`Contact ${id} deleted by admin`);

  } catch (error) {
    console.error('Error deleting contact:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid contact ID'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to delete contact'
    });
  }
});

// GET /api/contacts/stats - Get contact statistics (BONUS - for dashboard analytics)
router.get('/contacts/stats', async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const pendingContacts = await Contact.countDocuments({ status: 'pending' });
    const reviewedContacts = await Contact.countDocuments({ status: 'reviewed' });
    const respondedContacts = await Contact.countDocuments({ status: 'responded' });
    
    // Service type breakdown
    const serviceStats = await Contact.aggregate([
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Recent submissions (last 7 days)
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 7);
    const recentContacts = await Contact.countDocuments({
      submittedAt: { $gte: recentDate }
    });

    res.json({
      success: true,
      data: {
        total: totalContacts,
        pending: pendingContacts,
        reviewed: reviewedContacts,
        responded: respondedContacts,
        closed: await Contact.countDocuments({ status: 'closed' }),
        recent: recentContacts,
        serviceBreakdown: serviceStats
      }
    });

  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;