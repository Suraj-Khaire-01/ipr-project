const express = require('express');
const router = express.Router();
const Copyright = require('../models/Copyright');
const uploadUtils = require('../middleware/upload'); // Import the upload utilities (upload, error handler, cleanup)
const fs = require('fs');

// Create new copyright application
router.post('/', async (req, res) => {
  try {
  const payload = req.body;
  console.log('[copyright] POST / - payload:', JSON.stringify(payload));
    // Basic validation: ensure title exists
    if (!payload.title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const copyright = new Copyright(payload);
    const saved = await copyright.save();
  console.log('[copyright] created id:', saved._id);
    res.status(201).json({ success: true, message: 'Copyright application created', data: saved });
  } catch (error) {
  console.error('[copyright] POST / error:', error);
    res.status(400).json({ success: false, error: 'Failed to create copyright', details: error.message });
  }
});

// Get all copyright applications
router.get('/', async (req, res) => {
  try {
    const list = await Copyright.find().sort({ createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch copyrights', details: error.message });
  }
});

// Get single copyright by id
router.get('/:id', async (req, res) => {
  try {
    const doc = await Copyright.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch copyright', details: error.message });
  }
});

// Upload primary work file
// Upload primary work file - use uploadUtils.upload.single()
router.post('/:id/primary-file', uploadUtils.upload.single('primary'), async (req, res) => {
  try {
    console.log(`[copyright] POST /${req.params.id}/primary-file - file:`, req.file && {
      originalname: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    });
    const copyright = await Copyright.findById(req.params.id);
    if (!copyright) {
      // Delete uploaded file if copyright not found
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, error: 'Copyright application not found' });
    }

    const fileMeta = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype
    };

    // Attach as first file (primary)
    copyright.files = [fileMeta, ...copyright.files];
    await copyright.save();
  console.log('[copyright] after primary upload, id:', copyright._id, 'filesCount:', (copyright.files || []).length);

    res.json({ success: true, message: 'Primary file uploaded', data: fileMeta });
  } catch (error) {
  console.error(`[copyright] POST /${req.params.id}/primary-file error:`, error);
    // Clean up on error
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, error: 'Failed to upload primary file', details: error.message });
  }
});

// Upload supporting documents (multiple)
// Upload supporting documents (multiple) - use uploadUtils.upload.array()
router.post('/:id/supporting-documents', uploadUtils.upload.array('documents', 10), async (req, res) => {
  try {
    console.log(`[copyright] POST /${req.params.id}/supporting-documents - files count:`, req.files && req.files.length);
    if (req.files && req.files.length) {
      console.log('[copyright] files:', req.files.map(f => ({ originalname: f.originalname, filename: f.filename, size: f.size, mimetype: f.mimetype })) );
    }
    const copyright = await Copyright.findById(req.params.id);
    if (!copyright) {
      if (req.files && req.files.length > 0) {
        req.files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
      }
      return res.status(404).json({ success: false, error: 'Copyright application not found' });
    }

    const docs = req.files.map(f => ({
      filename: f.filename,
      originalName: f.originalname,
      path: f.path,
      size: f.size,
      mimetype: f.mimetype
    }));

    copyright.files.push(...docs);
    await copyright.save();
  console.log('[copyright] after supporting upload, id:', copyright._id, 'filesCount:', (copyright.files || []).length);

    res.json({ success: true, message: 'Supporting documents uploaded', data: docs });
  } catch (error) {
  console.error(`[copyright] POST /${req.params.id}/supporting-documents error:`, error);
    if (req.files && req.files.length > 0) {
      req.files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
    }
    res.status(500).json({ success: false, error: 'Failed to upload supporting documents', details: error.message });
  }
});

// Use centralized multer error handler from upload utilities
router.use(uploadUtils.handleMulterError);

// Update current step
router.patch('/:id/step', async (req, res) => {
  try {
    const { step } = req.body;
    if (typeof step !== 'number' || step < 1 || step > 6) {
      return res.status(400).json({ success: false, error: 'Invalid step value' });
    }

    const updated = await Copyright.findByIdAndUpdate(req.params.id, { currentStep: step }, { new: true });
    if (!updated) return res.status(404).json({ success: false, error: 'Not found' });

    res.json({ success: true, message: 'Step updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update step', details: error.message });
  }
});

// Record payment and advance application status
router.post('/:id/payment', async (req, res) => {
  try {
    const { amount, method, transactionId } = req.body || {};
    const copyright = await Copyright.findById(req.params.id);
    if (!copyright) return res.status(404).json({ success: false, error: 'Not found' });

    // Attach a lightweight payment record and advance state
    copyright.payment = {
      amount: amount || 0,
      method: method || 'unknown',
      transactionId: transactionId || null,
      date: new Date()
    };
    copyright.status = 'submitted';
    copyright.currentStep = Math.max(copyright.currentStep || 1, 4);
    await copyright.save();

    res.json({ success: true, message: 'Payment recorded and application submitted', data: copyright });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Payment recording failed', details: error.message });
  }
});

// Download a file attached to a copyright application
router.get('/:id/download/:fileId', async (req, res) => {
  try {
    const copyright = await Copyright.findById(req.params.id);
    if (!copyright) return res.status(404).json({ success: false, error: 'Not found' });

    const file = (copyright.files || []).find(f => f._id && f._id.toString() === req.params.fileId);
    if (!file) return res.status(404).json({ success: false, error: 'File not found' });

    if (!fs.existsSync(file.path)) return res.status(404).json({ success: false, error: 'File missing on server' });

    res.download(file.path, file.originalName || file.filename);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to download file', details: error.message });
  }
});

// Get certificate metadata or download (placeholder)
router.get('/:id/certificate', async (req, res) => {
  try {
    const copyright = await Copyright.findById(req.params.id);
    if (!copyright) return res.status(404).json({ success: false, error: 'Not found' });

    if (copyright.status !== 'registered') {
      return res.json({ success: false, message: 'Certificate not yet issued', status: copyright.status, currentStep: copyright.currentStep });
    }

    res.json({ success: true, message: 'Certificate available', applicationNumber: copyright.applicationNumber, registeredOn: copyright.updatedAt });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch certificate', details: error.message });
  }
});

module.exports = router;