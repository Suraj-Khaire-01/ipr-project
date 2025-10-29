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

const copyrightSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    index: true // Add index for better query performance
  },
  title: {
    type: String,
    required: true
  },
  workType: String,
  language: String,
  authorName: String,
  applicantName: String,
  description: String,
  publicationDate: Date,
  isPublished: {
    type: Boolean,
    default: false
  },
  files: [documentSchema],
  currentStep: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under-review', 'registered', 'rejected'],
    default: 'draft'
  },
  applicationNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  filingDate: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate application number before saving
copyrightSchema.pre('save', async function(next) {
  if (this.isNew && !this.applicationNumber) {
    const count = await this.constructor.countDocuments();
    const year = new Date().getFullYear();
    this.applicationNumber = `CR-${year}-${(count + 1).toString().padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Copyright', copyrightSchema);