import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Shield,
  Download,
  Info  // Fixed: Changed from 'nfo' to 'Info'
} from 'lucide-react';

// API service functions
const API_BASE_URL = 'http://localhost:3001/api';

const patentAPI = {
  createPatent: async (patentData) => {
    const response = await fetch(`${API_BASE_URL}/patents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patentData),
    });
    return response.json();
  },

  updatePatent: async (id, patentData) => {
    const response = await fetch(`${API_BASE_URL}/patents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patentData),
    });
    return response.json();
  },

  uploadFiles: async (id, files, type) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append(type === 'technical' ? 'drawings' : 'documents', file);
    });

    const response = await fetch(
      `${API_BASE_URL}/patents/${id}/${type === 'technical' ? 'technical-drawings' : 'supporting-documents'}`,
      {
        method: 'POST',
        body: formData,
      }
    );
    return response.json();
  },

  updateStep: async (id, step) => {
    const response = await fetch(`${API_BASE_URL}/patents/${id}/step`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ step }),
    });
    return response.json();
  },

  createPaymentOrder: async (amount) => {
    const response = await fetch(`${API_BASE_URL}/payment/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });
    return response.json();
  },

  verifyPayment: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    return response.json();
  },
};

const downloadSampleDocument = () => {
  // Replace with your actual Copyright Format file URL
  const sampleDocUrl = 'Patent Format.docx';
  
  const link = document.createElement('a');
  link.href = sampleDocUrl;
  link.download = 'Patent_Format_Sample.docx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const PatentFilingProcess = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    inventionTitle: '',
    inventorName: '',
    applicantName: '',
    technicalDescription: '',
    email: '',
    phone: ''
  });
  const [technicalDrawings, setTechnicalDrawings] = useState([]);
  const [supportingDocuments, setSupportingDocuments] = useState([]);
  const [dragOver, setDragOver] = useState({ technical: false, supporting: false });
  const [completedDocuments, setCompletedDocuments] = useState([]);
  const [patentId, setPatentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const steps = [
    { id: 1, title: 'Document\nPreparation', description: 'Gather required documents' },
    { id: 2, title: 'Application\nSubmission', description: 'Submit to patent office' },
    { id: 3, title: 'Review &\nPayment', description: 'Initial examination' },
    { id: 4, title: 'Prior Art\nComparison', description: 'Novelty assessment' },
    { id: 5, title: 'Publication', description: 'Public disclosure' },
    { id: 6, title: 'Examination', description: 'Detailed review' },
    { id: 7, title: 'Grant', description: 'Patent issued' }
  ];

  const requiredDocuments = [
    { id: 1, title: 'Technical description', type: 'text' },
    { id: 2, title: 'Technical drawings', type: 'file' },
    { id: 3, title: 'Inventor details', type: 'text' },
    { id: 4, title: 'Power of attorney (if applicable)', type: 'file' }
  ];

  const toggleDocumentCompletion = (docId) => {
    if (completedDocuments.includes(docId)) {
      setCompletedDocuments(completedDocuments.filter(id => id !== docId));
    } else {
      setCompletedDocuments([...completedDocuments, docId]);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDragOver = (e, type) => {
    e.preventDefault();
    setDragOver({ ...dragOver, [type]: true });
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    setDragOver({ ...dragOver, [type]: false });
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setDragOver({ ...dragOver, [type]: false });
    
    const files = Array.from(e.dataTransfer.files);
    if (type === 'technical') {
      setTechnicalDrawings([...technicalDrawings, ...files]);
    } else {
      setSupportingDocuments([...supportingDocuments, ...files]);
    }
  };

  const handleFileSelect = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'technical') {
      setTechnicalDrawings([...technicalDrawings, ...files]);
    } else {
      setSupportingDocuments([...supportingDocuments, ...files]);
    }
  };

  const removeFile = (index, type) => {
    if (type === 'technical') {
      setTechnicalDrawings(technicalDrawings.filter((_, i) => i !== index));
    } else {
      setSupportingDocuments(supportingDocuments.filter((_, i) => i !== index));
    }
  };

  const isFormValid = () => {
    return formData.inventionTitle && 
           formData.inventorName && 
           formData.applicantName && 
           formData.technicalDescription;
  };

  // Razorpay Payment Handler
  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      // Step 1: Create order on backend
      const data = await patentAPI.createPaymentOrder(5000); // ₹5000 for patent filing
     
      if (!data.success) {
        throw new Error(data.message || "Failed to create order");
      }
      const { order } = data;
     
      // Step 2: Initialize Razorpay Checkout
      const options = {
        key: data.key_id,
        amount: order.amount.toString(),
        currency: order.currency,
        name: "IP Secure Legal",
        description: "Patent Application Filing Fee",
        order_id: order.id,
        handler: async function (response) {
          try {
            // Step 3: Verify payment on backend
            const verifyData = await patentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
           
            if (verifyData.success) {
              setPaymentCompleted(true);
              alert("Payment successful! ✅");
              
              // Update step after payment
              if (patentId) {
                await patentAPI.updateStep(patentId, currentStep + 1);
              }
              setCurrentStep(currentStep + 1);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setError("Error verifying payment. Please contact support.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.applicantName || "User",
          email: formData.email || "user@example.com",
          contact: formData.phone || "9999999999"
        },
        notes: {
          application_type: "patent",
          patent_id: patentId
        },
        theme: {
          color: "#14b8a6"
        },
        modal: {
          ondismiss: function() {
            console.log("Payment cancelled by user");
            setLoading(false);
          }
        }
      };
      
      // Check if Razorpay script is loaded
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded. Please refresh the page.");
      }
      
      const rzp = new window.Razorpay(options);
     
      // Handle payment failures
      rzp.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
     
      rzp.open();
     
    } catch (err) {
      console.error("Payment initialization error:", err);
      setError(err.message || "Payment initialization failed");
      setLoading(false);
    }
  };

  const nextStep = async () => {
    if (currentStep === 1 && !isFormValid()) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (currentStep === 1) {
        // Save basic patent data
        const patentData = {
          inventionTitle: formData.inventionTitle,
          inventorName: formData.inventorName,
          applicantName: formData.applicantName,
          technicalDescription: formData.technicalDescription,
          email: formData.email,
          phone: formData.phone,
          completedDocuments: completedDocuments,
          currentStep: 2
        };

        const result = await patentAPI.createPatent(patentData);
        
        if (result.success) {
          setPatentId(result.data._id || result.data.id);
          
          // Upload files if any
          if (technicalDrawings.length > 0) {
            await patentAPI.uploadFiles(result.data._id || result.data.id, technicalDrawings, 'technical');
          }
          
          if (supportingDocuments.length > 0) {
            await patentAPI.uploadFiles(result.data._id || result.data.id, supportingDocuments, 'supporting');
          }
          
          setCurrentStep(2);
        } else {
          setError(result.error || 'Failed to save patent data');
        }
      } else {
        // For other steps, just update the step
        if (patentId) {
          await patentAPI.updateStep(patentId, currentStep + 1);
        }
        setCurrentStep(currentStep + 1);
      }
    } catch (err) {
      setError('An error occurred while saving your data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white overflow-y-auto relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, #ffffff 2px, transparent 0)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Patent Filing Process
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Step-by-step guidance through your patent application
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8 overflow-x-auto pb-4">
            <div className="flex items-center space-x-4 min-w-max px-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ${
                        currentStep >= step.id
                          ? 'bg-teal-500 shadow-lg scale-110'
                          : 'bg-gray-700'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-7 h-7" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="text-center mt-2 min-w-[80px]">
                      <div className={`text-xs font-medium leading-tight ${
                        currentStep >= step.id ? 'text-teal-400' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-1 transition-all duration-300 ${
                        currentStep > step.id ? 'bg-teal-500' : 'bg-gray-700'
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-800 h-2 rounded-full max-w-4xl mx-auto">
            <div 
              className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 7) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Current Step Info */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-sm font-bold">
                {currentStep}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-teal-400">
                  Step {currentStep}. {steps[currentStep - 1]?.title.replace('\n', ' ')}
                </h2>
                <p className="text-gray-300">{steps[currentStep - 1]?.description}</p>
              </div>
            </div>
          </div>

          {/* Step 1 Content - Document Preparation */}
          {currentStep === 1 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              {/* Required Documents Checklist */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-6 text-white">Required Documents Checklist:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {requiredDocuments.map((doc) => (
                    <div 
                      key={doc.id}
                      className={`border rounded-lg p-4 transition-all cursor-pointer ${
                        completedDocuments.includes(doc.id)
                          ? 'bg-teal-900/30 border-teal-700'
                          : 'bg-blue-900/30 border-blue-700/50 hover:border-blue-500'
                      }`}
                      onClick={() => toggleDocumentCompletion(doc.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                          completedDocuments.includes(doc.id)
                            ? 'bg-teal-500 border-teal-500'
                            : 'border-2 border-blue-400'
                        }`}>
                          {completedDocuments.includes(doc.id) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className={`${
                          completedDocuments.includes(doc.id) ? 'text-teal-200' : 'text-blue-200'
                        }`}>
                          {doc.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-200">
                      Invention Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="inventionTitle"
                      value={formData.inventionTitle}
                      onChange={handleInputChange}
                      placeholder="Enter invention title"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-200">
                      Inventor Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="inventorName"
                      value={formData.inventorName}
                      onChange={handleInputChange}
                      placeholder="Full name of inventor"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-200">
                    Applicant Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleInputChange}
                    placeholder="Name of person/entity applying"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-200">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-200">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9999999999"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-200">
                    Technical Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="technicalDescription"
                    value={formData.technicalDescription}
                    onChange={handleInputChange}
                    placeholder="Detailed description of your invention, how it works, and what makes it novel..."
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none"
                  />
                </div>

                {/* File Upload Areas */}
                <div className="grid md:grid-cols-2 gap-6">
  {/* Technical Drawings */}
  <div className="flex flex-col">
    <label className="block text-sm font-semibold mb-3 text-gray-200">
      Upload Technical Drawings
    </label>
    <div
      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 flex-1 ${
        dragOver.technical
          ? 'border-teal-400 bg-teal-400/10'
          : 'border-gray-600 hover:border-teal-500'
      }`}
      onDragOver={(e) => handleDragOver(e, 'technical')}
      onDragLeave={(e) => handleDragLeave(e, 'technical')}
      onDrop={(e) => handleDrop(e, 'technical')}
    >
      <Upload className="w-8 h-14 text-gray-400 mx-auto mb-3" />
      <p className="text-sm text-gray-300 mb-3">
        Drag & drop files here or click to browse
      </p>
      <p className="text-xs text-gray-400 mb-3">
        You can upload your work file which describes about your work
      </p>
      <input
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.dwg"
        onChange={(e) => handleFileSelect(e, 'technical')}
        className="hidden"
        id="technical-upload"
      />
      <label
        htmlFor="technical-upload"
        className="inline-block px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer"
      >
        Choose Files
      </label>
    </div>
    {technicalDrawings.length > 0 && (
      <div className="mt-3 space-y-2">
        {technicalDrawings.map((file, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-700/50 p-2 rounded">
            <span className="text-sm text-gray-300">{file.name}</span>
            <button
              onClick={() => removeFile(index, 'technical')}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Supporting Documents */}
  <div className="flex flex-col">
    <div className="flex items-center justify-between mb-3">
      <label className="block text-sm font-semibold text-gray-200">
        Upload Supporting Documents
      </label>
      {/* Sample Document Download Button */}
      <button 
        onClick={() => downloadSampleDocument()}
        className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
      >
        <Download className="w-4 h-4" />
        Download Patent Format
      </button>
    </div>

    <div
      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 flex-1 ${
        dragOver.supporting
          ? 'border-teal-400 bg-teal-400/10'
          : 'border-gray-600 hover:border-teal-500'
      }`}
      onDragOver={(e) => handleDragOver(e, 'supporting')}
      onDragLeave={(e) => handleDragLeave(e, 'supporting')}
      onDrop={(e) => handleDrop(e, 'supporting')}
    >
      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-3" />
      <p className="text-sm text-gray-300 mb-3">
        Drag & drop files here or click to browse
      </p>
      <p className="text-xs text-gray-400 mb-3">
        You can upload your work file which describes about your work
      </p>
      <input
        type="file"
        multiple
        accept=".pdf,.doc,.docx"
        onChange={(e) => handleFileSelect(e, 'supporting')}
        className="hidden"
        id="supporting-upload"
      />
      <label
        htmlFor="supporting-upload"
        className="inline-block px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors cursor-pointer"
      >
        Choose Files
      </label>
    </div>

    {/* Sample Document Info */}
    <div className="mt-3 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
      <p className="text-xs text-blue-300 flex items-center gap-2">
        <Info className="w-4 h-4" />
        Download the Patent Format sample above and upload your documents in the same format
      </p>
    </div>

    {supportingDocuments.length > 0 && (
      <div className="mt-3 space-y-2">
        {supportingDocuments.map((file, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-700/50 p-2 rounded">
            <span className="text-sm text-gray-300">{file.name}</span>
            <button
              onClick={() => removeFile(index, 'supporting')}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
              </div>
            </div>
          )}

          {/* Step 3 - Payment */}
          {currentStep === 3 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-10 h-10 text-teal-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Patent Filing Fee Payment</h3>
                <p className="text-gray-300 mb-6">
                  Complete the payment to proceed with your patent application submission
                </p>
              </div>

              <div className="max-w-md mx-auto">
                {/* Fee Breakdown */}
                <div className="bg-gray-700/50 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold mb-4 text-white">Fee Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-300">
                      <span>Application Filing Fee</span>
                      <span>₹4,000</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Processing Fee</span>
                      <span>₹800</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Service Charges</span>
                      <span>₹200</span>
                    </div>
                    <div className="border-t border-gray-600 pt-3 mt-3">
                      <div className="flex justify-between text-white font-bold text-lg">
                        <span>Total Amount</span>
                        <span>₹5,000</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                {!paymentCompleted ? (
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${
                      loading
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:scale-105 shadow-lg'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Payment...
                      </div>
                    ) : (
                      <>Pay ₹5,000 with Razorpay</>
                    )}
                  </button>
                ) : (
                  <div className="bg-teal-500/20 border border-teal-500 rounded-xl p-4 text-center">
                    <Check className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                    <p className="text-teal-200 font-semibold">Payment Completed Successfully!</p>
                  </div>
                )}

                {/* Payment Info */}
                <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                  <p className="text-sm text-blue-200 text-center">
                    🔒 Secure payment powered by Razorpay. All major payment methods accepted.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Other Steps Preview */}
          {currentStep > 1 && currentStep !== 3 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 text-center">
              <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-teal-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {steps[currentStep - 1]?.title.replace('\n', ' ')}
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                {currentStep === 2 && "Your application will be submitted to the patent office for initial review and processing."}
                {currentStep === 4 && "A comprehensive search will be conducted to compare your invention with existing prior art."}
                {currentStep === 5 && "Your patent application will be published for public review after 18 months."}
                {currentStep === 6 && "A detailed examination of your invention's patentability will be conducted."}
                {currentStep === 7 && "Upon successful examination, your patent will be granted and issued."}
              </p>
              <div className="text-sm text-gray-400">
                This step will be available once the previous steps are completed.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1 || loading}
              className={`inline-flex items-center px-6 py-3 rounded-xl transition-all duration-200 ${
                currentStep === 1 || loading
                  ? 'opacity-50 cursor-not-allowed text-gray-500'
                  : 'bg-gray-700 hover:bg-gray-600 text-white hover:scale-105'
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
            
            {currentStep < 7 && (
              <button
                onClick={currentStep === 3 && !paymentCompleted ? handlePayment : nextStep}
                disabled={(currentStep === 1 && !isFormValid()) || loading || (currentStep === 3 && !paymentCompleted)}
                className={`inline-flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  ((currentStep === 1 && isFormValid()) || (currentStep > 1 && (currentStep !== 3 || paymentCompleted))) && !loading
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:scale-105 shadow-lg'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {currentStep === 3 ? 'Processing Payment...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    {currentStep === 3 && !paymentCompleted ? 'Proceed to Payment' : 'Next Step'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatentFilingProcess;