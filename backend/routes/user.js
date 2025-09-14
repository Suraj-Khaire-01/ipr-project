// Example Express.js routes for user-specific data
// Add these to your existing backend API

// Get user's patents
app.get('/api/user/:userId/patents', async (req, res) => {
  try {
    const { userId } = req.params;
    const patents = await Patent.find({ userId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: patents
    });
  } catch (error) {
    console.error('Error fetching user patents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patents'
    });
  }
});

// Get user's copyrights
app.get('/api/user/:userId/copyright', async (req, res) => {
  try {
    const { userId } = req.params;
    const copyrights = await Copyright.find({ userId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: copyrights
    });
  } catch (error) {
    console.error('Error fetching user copyrights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch copyrights'
    });
  }
});

// Get user's consultations
app.get('/api/user/:userId/consultations', async (req, res) => {
  try {
    const { userId } = req.params;
    const consultations = await Consultation.find({ userId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: consultations
    });
  } catch (error) {
    console.error('Error fetching user consultations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultations'
    });
  }
});

// Update existing POST routes to include userId
app.post('/api/patents', upload.fields([
  { name: 'supportingDocuments', maxCount: 10 },
  { name: 'technicalDrawings', maxCount: 10 }
]), async (req, res) => {
  try {
    const {
      userId, // Add this field
      userEmail, // Add this field
      inventionTitle,
      inventorName,
      applicantName,
      inventionType,
      abstractDescription,
      technicalDescription,
      claims,
      priorityDate,
      status,
      filingDate
    } = req.body;

    // Generate application number if status is submitted
    const applicationNumber = status === 'submitted' ? 
      `PAT${Date.now()}${Math.floor(Math.random() * 1000)}` : null;

    const patentData = {
      userId, // Store user ID
      userEmail, // Store user email
      applicationNumber,
      inventionTitle,
      inventorName,
      applicantName,
      inventionType,
      abstractDescription,
      technicalDescription,
      claims,
      priorityDate,
      status: status || 'draft',
      filingDate: filingDate || new Date(),
      supportingDocuments: req.files?.supportingDocuments || [],
      technicalDrawings: req.files?.technicalDrawings || []
    };

    const patent = new Patent(patentData);
    await patent.save();

    res.status(201).json({
      success: true,
      message: 'Patent application submitted successfully',
      data: patent
    });
  } catch (error) {
    console.error('Error creating patent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit patent application'
    });
  }
});

app.post('/api/copyright', upload.array('files', 10), async (req, res) => {
  try {
    const {
      userId, // Add this field
      userEmail, // Add this field
      title,
      authorName,
      applicantName,
      workType,
      language,
      description,
      isPublished,
      publicationDate,
      status,
      currentStep,
      filingDate
    } = req.body;

    // Generate application number if status is submitted
    const applicationNumber = status === 'submitted' ? 
      `CR${Date.now()}${Math.floor(Math.random() * 1000)}` : null;

    const copyrightData = {
      userId, // Store user ID
      userEmail, // Store user email
      applicationNumber,
      title,
      authorName,
      applicantName,
      workType,
      language,
      description,
      isPublished: isPublished === 'true',
      publicationDate,
      status: status || 'draft',
      currentStep: parseInt(currentStep) || 1,
      filingDate: filingDate || new Date(),
      files: req.files || []
    };

    const copyright = new Copyright(copyrightData);
    await copyright.save();

    res.status(201).json({
      success: true,
      message: 'Copyright application submitted successfully',
      data: copyright
    });
  } catch (error) {
    console.error('Error creating copyright:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit copyright application'
    });
  }
});

app.post('/api/consultations', upload.array('uploadedFiles', 5), async (req, res) => {
  try {
    const {
      userId, // Add this field
      userEmail, // Add this field
      fullName,
      email,
      phone,
      workType,
      consultationType,
      preferredDate,
      preferredTime,
      description,
      status
    } = req.body;

    // Generate consultation ID
    const consultationId = `CONS${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const consultationData = {
      userId, // Store user ID
      userEmail, // Store user email
      consultationId,
      fullName,
      email: userEmail || email, // Use Clerk email if available
      phone,
      workType,
      consultationType,
      preferredDate,
      preferredTime,
      description,
      status: status || 'pending',
      uploadedFiles: req.files || []
    };

    const consultation = new Consultation(consultationData);
    await consultation.save();

    res.status(201).json({
      success: true,
      message: 'Consultation request submitted successfully',
      data: consultation
    });
  } catch (error) {
    console.error('Error creating consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit consultation request'
    });
  }
});

// Example MongoDB Schema updates
/*
// Add userId field to existing schemas

const patentSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk user ID
  userEmail: { type: String, required: true }, // User email
  applicationNumber: String,
  inventionTitle: { type: String, required: true },
  // ... rest of existing fields
});

const copyrightSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk user ID
  userEmail: { type: String, required: true }, // User email
  applicationNumber: String,
  title: { type: String, required: true },
  // ... rest of existing fields
});

const consultationSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk user ID
  userEmail: { type: String, required: true }, // User email
  consultationId: { type: String, required: true },
  fullName: { type: String, required: true },
  // ... rest of existing fields
});
*/