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
  completedDocuments: [{
    type: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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