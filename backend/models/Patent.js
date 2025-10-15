const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  path: String,
  size: Number,
  mimetype: String,
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

const patentSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true
  },
  inventionTitle: {
    type: String,
    required: true
  },
  inventorName: {
    type: String,
    required: true
  },
  applicantName: {
    type: String,
    required: true
  },
  technicalDescription: {
    type: String,
    required: true
  },
  // ADD THESE MISSING FIELDS:
  email: {
    type: String
  },
  phone: {
    type: String
  },
  technicalDrawings: [documentSchema],
  supportingDocuments: [documentSchema],
  currentStep: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under-review', 'published', 'granted', 'rejected'],
    default: 'draft'
  },
  applicationNumber: {
    type: String,
    unique: true
  },
  filingDate: {
    type: Date,
    default: Date.now
  },
  // FIX: Change from String to Number to match frontend
  completedDocuments: [{
    type: Number  // Changed from String to Number
  }],
  // Make createdBy optional like Copyright model
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Make it optional
  }
}, {
  timestamps: true
});

// Generate application number before saving
patentSchema.pre('save', async function(next) {
  if (this.isNew && !this.applicationNumber) {
    const count = await this.constructor.countDocuments();
    const year = new Date().getFullYear();
    this.applicationNumber = `PAT-${year}-${(count + 1).toString().padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Patent', patentSchema);