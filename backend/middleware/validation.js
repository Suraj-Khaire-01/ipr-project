// middleware/validation.js
const { body, param, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.param,
            message: error.msg,
            value: error.value
        }));
        
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errorMessages
        });
    }
    
    next();
};

// Patent application validation rules
const validatePatentApplication = [
    body('formData.inventionTitle')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Invention title must be between 5 and 200 characters')
        .matches(/^[a-zA-Z0-9\s\-_.,()]+$/)
        .withMessage('Invention title contains invalid characters'),
    
    body('formData.inventorName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Inventor name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s\-'.]+$/)
        .withMessage('Inventor name must contain only letters, spaces, hyphens, and apostrophes'),
    
    body('formData.applicantName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Applicant name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z0-9\s\-'.,()&]+$/)
        .withMessage('Applicant name contains invalid characters'),
    
    body('formData.technicalDescription')
        .trim()
        .isLength({ min: 50, max: 10000 })
        .withMessage('Technical description must be between 50 and 10000 characters'),
    
    body('currentStep')
        .optional()
        .isInt({ min: 1, max: 7 })
        .withMessage('Current step must be between 1 and 7'),
    
    body('completedDocuments')
        .optional()
        .isArray()
        .withMessage('Completed documents must be an array')
        .custom((value) => {
            if (value && value.some(item => !Number.isInteger(item) || item < 1 || item > 4)) {
                throw new Error('Completed documents must contain integers between 1 and 4');
            }
            return true;
        }),
    
    handleValidationErrors
];

// Update patent application validation
const validatePatentUpdate = [
    body('formData.inventionTitle')
        .optional()
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Invention title must be between 5 and 200 characters'),
    
    body('formData.inventorName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Inventor name must be between 2 and 100 characters'),
    
    body('formData.applicantName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Applicant name must be between 2 and 100 characters'),
    
    body('formData.technicalDescription')
        .optional()
        .trim()
        .isLength({ min: 50, max: 10000 })
        .withMessage('Technical description must be between 50 and 10000 characters'),
    
    body('currentStep')
        .optional()
        .isInt({ min: 1, max: 7 })
        .withMessage('Current step must be between 1 and 7'),
    
    handleValidationErrors
];

// Application ID validation
const validateApplicationId = [
    param('applicationId')
        .matches(/^PAT-\d{4}-\d{5}$/)
        .withMessage('Invalid application ID format. Expected format: PAT-YYYY-NNNNN'),
    
    handleValidationErrors
];

// Step advancement validation
const validateStepAdvancement = [
    body('targetStep')
        .isInt({ min: 1, max: 7 })
        .withMessage('Target step must be between 1 and 7'),
    
    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Notes cannot exceed 500 characters'),
    
    handleValidationErrors
];

// File deletion validation
const validateFileOperation = [
    body('fileId')
        .isMongoId()
        .withMessage('Invalid file ID'),
    
    body('fileType')
        .isIn(['technicalDrawings', 'supportingDocuments'])
        .withMessage('File type must be either technicalDrawings or supportingDocuments'),
    
    handleValidationErrors
];

// Search and filter validation
const validateSearchQuery = [
    body('searchTerm')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search term must be between 1 and 100 characters'),
    
    body('status')
        .optional()
        .isIn(['draft', 'submitted', 'under_review', 'prior_art_search', 'published', 'examined', 'granted', 'rejected'])
        .withMessage('Invalid status value'),
    
    body('step')
        .optional()
        .isInt({ min: 1, max: 7 })
        .withMessage('Step must be between 1 and 7'),
    
    body('dateFrom')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format for dateFrom'),
    
    body('dateTo')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format for dateTo'),
    
    handleValidationErrors
];

// Pagination validation
const validatePagination = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    if (page < 1) {
        return res.status(400).json({
            success: false,
            error: 'Page number must be greater than 0'
        });
    }
    
    if (limit < 1 || limit > 100) {
        return res.status(400).json({
            success: false,
            error: 'Limit must be between 1 and 100'
        });
    }
    
    req.pagination = { page, limit };
    next();
};

// Status update validation
const validateStatusUpdate = [
    body('status')
        .isIn(['draft', 'submitted', 'under_review', 'prior_art_search', 'published', 'examined', 'granted', 'rejected'])
        .withMessage('Invalid status value'),
    
    body('reason')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Reason cannot exceed 1000 characters'),
    
    handleValidationErrors
];

// Contact information validation
const validateContactInfo = [
    body('formData.inventorEmail')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid inventor email address'),
    
    body('formData.inventorPhone')
        .optional()
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Invalid phone number format'),
    
    body('formData.applicantEmail')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid applicant email address'),
    
    body('formData.applicantAddress')
        .optional()
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('Address must be between 10 and 500 characters'),
    
    handleValidationErrors
];

// Document upload validation
const validateDocumentUpload = [
    body('documentType')
        .isIn(['technicalDrawings', 'supportingDocuments', 'priorArt', 'claims'])
        .withMessage('Invalid document type'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Document description cannot exceed 200 characters'),
    
    handleValidationErrors
];

// Claims validation
const validateClaims = [
    body('formData.claims')
        .isArray({ min: 1 })
        .withMessage('At least one claim is required'),
    
    body('formData.claims.*.claimText')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Each claim must be between 10 and 2000 characters'),
    
    body('formData.claims.*.claimType')
        .isIn(['independent', 'dependent'])
        .withMessage('Claim type must be either independent or dependent'),
    
    body('formData.claims.*.dependsOn')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Depends on must be a valid claim number'),
    
    handleValidationErrors
];

// Comment/Note validation
const validateComment = [
    body('comment')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Comment must be between 1 and 1000 characters'),
    
    body('isInternal')
        .optional()
        .isBoolean()
        .withMessage('isInternal must be a boolean value'),
    
    handleValidationErrors
];

// Date range validation helper
const validateDateRange = (req, res, next) => {
    const { dateFrom, dateTo } = req.body;
    
    if (dateFrom && dateTo) {
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        
        if (fromDate > toDate) {
            return res.status(400).json({
                success: false,
                error: 'dateFrom cannot be later than dateTo'
            });
        }
        
        const now = new Date();
        if (toDate > now) {
            return res.status(400).json({
                success: false,
                error: 'dateTo cannot be in the future'
            });
        }
    }
    
    next();
};

module.exports = {
    validatePatentApplication,
    validatePatentUpdate,
    validateApplicationId,
    validateStepAdvancement,
    validateFileOperation,
    validateSearchQuery,
    validatePagination,
    validateStatusUpdate,
    validateContactInfo,
    validateDocumentUpload,
    validateClaims,
    validateComment,
    validateDateRange,
    handleValidationErrors
};