const express = require('express');
const router = express.Router();
const Patent = require('../models/Patent');
const uploadUtils = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// Get all patents
router.get('/', async (req, res) => {
  try {
    const patents = await Patent.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: patents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch patents',
      details: error.message
    });
  }
});

// Get single patent
router.get('/:id', async (req, res) => {
  try {
    const patent = await Patent.findById(req.params.id);
    if (!patent) {
      return res.status(404).json({
        success: false,
        error: 'Patent not found'
      });
    }
    res.json({
      success: true,
      data: patent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch patent',
      details: error.message
    });
  }
});

// Create new patent application
router.post('/', async (req, res) => {
  try {
    const patent = new Patent(req.body);
    const savedPatent = await patent.save();
    res.status(201).json({
      success: true,
      message: 'Patent application created successfully',
      data: savedPatent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to create patent',
      details: error.message
    });
  }
});

// Update patent application
router.put('/:id', async (req, res) => {
  try {
    const patent = await Patent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!patent) {
      return res.status(404).json({
        success: false,
        error: 'Patent not found'
      });
    }
    res.json({
      success: true,
      message: 'Patent updated successfully',
      data: patent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to update patent',
      details: error.message
    });
  }
});

// Upload technical drawings
router.post('/:id/technical-drawings', uploadUtils.upload.array('drawings', 10), async (req, res) => {
  try {
    const patent = await Patent.findById(req.params.id);
    if (!patent) {
      // Clean up uploaded files if patent not found
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      return res.status(404).json({
        success: false,
        error: 'Patent not found'
      });
    }

    const drawings = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    }));

    patent.technicalDrawings.push(...drawings);
    await patent.save();

    res.json({
      success: true,
      message: 'Technical drawings uploaded successfully',
      data: drawings
    });
  } catch (error) {
    // Clean up files on error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to upload technical drawings',
      details: error.message
    });
  }
});

// Upload supporting documents
router.post('/:id/supporting-documents', uploadUtils.upload.array('documents', 10), async (req, res) => {
  try {
    const patent = await Patent.findById(req.params.id);
    if (!patent) {
      // Clean up uploaded files if patent not found
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      return res.status(404).json({
        success: false,
        error: 'Patent not found'
      });
    }

    const documents = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    }));

    patent.supportingDocuments.push(...documents);
    await patent.save();

    res.json({
      success: true,
      message: 'Supporting documents uploaded successfully',
      data: documents
    });
  } catch (error) {
    // Clean up files on error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to upload supporting documents',
      details: error.message
    });
  }
});

// Update completed documents
router.patch('/:id/completed-documents', async (req, res) => {
  try {
    const { documentId, completed } = req.body;
    const patent = await Patent.findById(req.params.id);
    
    if (!patent) {
      return res.status(404).json({
        success: false,
        error: 'Patent not found'
      });
    }

    if (completed) {
      if (!patent.completedDocuments.includes(documentId)) {
        patent.completedDocuments.push(documentId);
      }
    } else {
      patent.completedDocuments = patent.completedDocuments.filter(id => id !== documentId);
    }

    await patent.save();
    res.json({
      success: true,
      message: 'Completed documents updated successfully',
      data: patent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update completed documents',
      details: error.message
    });
  }
});

// Update current step
router.patch('/:id/step', async (req, res) => {
  try {
    const { step } = req.body;
    const patent = await Patent.findByIdAndUpdate(
      req.params.id,
      { currentStep: step },
      { new: true }
    );
    
    if (!patent) {
      return res.status(404).json({
        success: false,
        error: 'Patent not found'
      });
    }

    res.json({
      success: true,
      message: 'Step updated successfully',
      data: patent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update step',
      details: error.message
    });
  }
});

// Delete patent
router.delete('/:id', async (req, res) => {
  try {
    const patent = await Patent.findById(req.params.id);
    if (!patent) {
      return res.status(404).json({
        success: false,
        error: 'Patent not found'
      });
    }

    // Delete associated files
    const allFiles = [...patent.technicalDrawings, ...patent.supportingDocuments];
    allFiles.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });

    await Patent.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Patent deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete patent',
      details: error.message
    });
  }
});

// Download a file
router.get('/:id/download/:fileId', async (req, res) => {
  try {
    const patent = await Patent.findById(req.params.id);
    if (!patent) {
      return res.status(404).json({
        success: false,
        error: 'Patent not found'
      });
    }

    // Find file in both technical drawings and supporting documents
    const file = [...patent.technicalDrawings, ...patent.supportingDocuments]
      .find(f => f._id.toString() === req.params.fileId);

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    if (!fs.existsSync(file.path)) {
      return res.status(404).json({
        success: false,
        error: 'File not found on server'
      });
    }

    res.download(file.path, file.originalName);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to download file',
      details: error.message
    });
  }
});


// Multer error handling
// Multer error handling - ensure this middleware is registered before exporting the router
router.use(uploadUtils.handleMulterError);

module.exports = router;