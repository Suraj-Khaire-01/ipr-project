const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxLength: [100, 'Name cannot exceed 100 characters'],
    minLength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    lowercase: true,
    trim: true,
    index: true
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Allow empty phone or valid phone number
        if (!v) return true;
        return /^[\+]?[1-9][\d]{0,15}$/.test(v.replace(/[\s\-\(\)]/g, ''));
      },
      message: 'Please enter a valid phone number'
    }
  },
  company: {
    type: String,
    trim: true,
    maxLength: [200, 'Company name cannot exceed 200 characters']
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: {
      values: ['patents', 'trademarks', 'copyrights', 'ip-litigation', 'licensing', 'consultation'],
      message: 'Invalid service type'
    }
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxLength: [1000, 'Message cannot exceed 1000 characters'],
    minLength: [10, 'Message must be at least 10 characters']
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved'],
    default: 'new',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // If you have a User model for staff
    default: null
  },
  notes: [{
    content: {
      type: String,
      required: true
    },
    addedBy: {
      type: String,
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Tracking information
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  referrer: {
    type: String
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
});

// Update the updatedAt field before saving
contactSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add compound indexes for better query performance
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ serviceType: 1, status: 1 });
contactSchema.index({ createdAt: -1, isDeleted: 1 });

// Virtual for full contact info
contactSchema.virtual('contactInfo').get(function() {
  return {
    name: this.fullName,
    email: this.email,
    phone: this.phone || 'Not provided',
    company: this.company || 'Not provided'
  };
});

// Static method to get contacts by status
contactSchema.statics.findByStatus = function(status) {
  return this.find({ 
    status: status, 
    isDeleted: false 
  }).sort({ createdAt: -1 });
};

// Static method to get recent contacts
contactSchema.statics.findRecent = function(limit = 10) {
  return this.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Instance method to add notes
contactSchema.methods.addNote = function(content, addedBy) {
  this.notes.push({
    content: content,
    addedBy: addedBy
  });
  return this.save();
};

// Instance method to soft delete
contactSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = Date.now();
  return this.save();
};

// Export the model
module.exports = mongoose.model('Contact', contactSchema);