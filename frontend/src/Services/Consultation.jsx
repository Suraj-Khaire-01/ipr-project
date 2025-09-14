import React, { useState } from 'react';
import {
  ChevronDown,
  Upload,
  Phone,
  Video,
  MapPin,
  Calendar,
  Clock,
  Check,
  User,
  Mail,
  FileText,
  Star,
  Shield,
  Award,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';

const Consultation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [consultationResult, setConsultationResult] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    workType: '',
    description: '',
    consultationType: '',
    preferredDate: '',
    preferredTime: '',
    marketingConsent: false,
    communicationPreference: 'both'
  });
  const [isDark, setIsDark] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const workTypes = [
    { value: 'patent', label: 'Patent Filing', icon: Shield },
    { value: 'trademark', label: 'Trademark Registration', icon: Award },
    { value: 'copyright', label: 'Copyright Protection', icon: FileText },
    { value: 'design', label: 'Industrial Design', icon: Star },
    { value: 'litigation', label: 'IP Litigation', icon: User },
    { value: 'other', label: 'Other', icon: FileText }
  ];

  const consultationTypes = [
    {
      type: 'phone',
      title: 'Phone Call',
      duration: '30-45 minutes',
      description: 'Quick consultation via phone call',
      icon: Phone,
      price: 'Free'
    },
    {
      type: 'video',
      title: 'Video Call',
      duration: '45-60 minutes',
      description: 'Detailed discussion with screen sharing',
      icon: Video,
      price: 'Free'
    },
    {
      type: 'person',
      title: 'In-Person',
      duration: '60-90 minutes',
      description: 'Face-to-face meeting at our office',
      icon: MapPin,
      price: 'Free'
    }
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const stepTitles = [
    'Personal Information',
    'Consultation Type',
    'Schedule Meeting',
    'Confirmation'
  ];

  const submitConsultation = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Append files
      uploadedFiles.forEach(file => {
        submitData.append('files', file);
      });

      // Make API call
      const response = await fetch('http://localhost:3001/api/consultations', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit consultation');
      }

      // Success - move to confirmation step
      setConsultationResult(result.data);
      setCurrentStep(4);

    } catch (error) {
      console.error('Error submitting consultation:', error);
      setSubmitError(error.message || 'Failed to submit consultation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      // Final submission
      submitConsultation();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length !== files.length) {
      alert('Some files were rejected. Only PDF, DOC, DOCX, JPG, JPEG, and PNG files under 10MB are allowed.');
    }

    setUploadedFiles([...uploadedFiles, ...validFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length !== files.length) {
      alert('Some files were rejected. Only PDF, DOC, DOCX, JPG, JPEG, and PNG files under 10MB are allowed.');
    }

    setUploadedFiles([...uploadedFiles, ...validFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.email && formData.phone && formData.workType && formData.description;
      case 2:
        return formData.consultationType;
      case 3:
        return formData.preferredDate && formData.preferredTime;
      default:
        return true;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 overflow-y-auto ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, ${isDark ? '#ffffff' : '#000000'} 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <main className="relative container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Expert IP Consultation
          </h1>
          <p
            className={`text-xl ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            } max-w-3xl mx-auto leading-relaxed`}
          >
            Protect your innovations with guidance from our experienced intellectual property attorneys
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4 md:space-x-8">
              {[1, 2, 3, 4].map((step, index) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ${
                        currentStep >= step
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg scale-110'
                          : isDark ? 'bg-gray-700' : 'bg-gray-300'
                      }`}
                    >
                      {currentStep > step ? (
                        <Check className="w-7 h-7" />
                      ) : (
                        step
                      )}
                    </div>
                    <span className={`text-sm mt-2 font-medium ${
                      currentStep >= step 
                        ? 'text-teal-400' 
                        : isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {stepTitles[step - 1]}
                    </span>
                  </div>
                  {index < 3 && (
                    <div
                      className={`w-16 md:w-24 h-1 transition-all duration-300 ${
                        currentStep > step
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500'
                          : isDark ? 'bg-gray-700' : 'bg-gray-300'
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-500 font-medium">{submitError}</p>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          <div
            className={`${
              isDark 
                ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700' 
                : 'bg-white/80 backdrop-blur-sm border-gray-200'
            } rounded-2xl p-8 md:p-12 border shadow-2xl`}
          >
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <User className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">Personal Information</h2>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    Tell us about yourself and your IP needs
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-4 rounded-xl border transition-all duration-200 ${
                        isDark
                          ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white'
                      } focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className={`w-full px-4 py-4 rounded-xl border transition-all duration-200 ${
                        isDark
                          ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white'
                      } focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20`}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full px-4 py-4 rounded-xl border transition-all duration-200 ${
                        isDark
                          ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white'
                      } focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold">
                      Type of Work <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="workType"
                        value={formData.workType}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 rounded-xl border transition-all duration-200 ${
                          isDark
                            ? 'bg-gray-700/50 border-gray-600 text-white focus:bg-gray-700'
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:bg-white'
                        } focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 appearance-none cursor-pointer`}
                      >
                        <option value="">Select work type</option>
                        {workTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold">
                    Brief Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your invention, creative work, or IP needs in detail..."
                    rows={4}
                    className={`w-full px-4 py-4 rounded-xl border transition-all duration-200 ${
                      isDark
                        ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white'
                    } focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 resize-none`}
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold">
                    Supporting Documents (Optional)
                  </label>
                  <div
                    className={`border-2 border-dashed transition-all duration-200 ${
                      isDragging
                        ? 'border-teal-500 bg-teal-500/10'
                        : isDark
                        ? 'border-gray-600 hover:border-teal-500'
                        : 'border-gray-300 hover:border-teal-500'
                    } rounded-xl p-8 text-center cursor-pointer group`}
                    onClick={() => document.getElementById('file-upload').click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <Upload
                      className={`w-12 h-12 mx-auto mb-4 transition-colors ${
                        isDark
                          ? 'text-gray-400 group-hover:text-teal-400'
                          : 'text-gray-500 group-hover:text-teal-500'
                      }`}
                    />
                    <h3 className="text-lg font-semibold mb-2">
                      {isDragging ? "Drop files here" : "Upload documents or sketches"}
                    </h3>
                    <p
                      className={`${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      } mb-4`}
                    >
                      PDF, DOC, JPG, PNG (up to 10MB each)
                    </p>
                    <div className="inline-flex items-center px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Files
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            isDark ? 'bg-gray-700' : 'bg-gray-100'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{file.name}</span>
                            <span className="text-xs text-gray-400">{formatFileSize(file.size)}</span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-400 hover:text-red-300 text-sm px-3 py-1 rounded hover:bg-red-400/10 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Marketing Consent */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="marketingConsent"
                      name="marketingConsent"
                      checked={formData.marketingConsent}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 text-teal-500 bg-transparent border-gray-400 rounded focus:ring-teal-500 focus:ring-2"
                    />
                    <label htmlFor="marketingConsent" className="text-sm">
                      I would like to receive updates about IP law changes, legal insights, and promotional offers from your firm.
                    </label>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold">
                      Preferred Communication Method
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="communicationPreference"
                          value="email"
                          checked={formData.communicationPreference === 'email'}
                          onChange={handleInputChange}
                          className="mr-2 text-teal-500 focus:ring-teal-500"
                        />
                        Email only
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="communicationPreference"
                          value="phone"
                          checked={formData.communicationPreference === 'phone'}
                          onChange={handleInputChange}
                          className="mr-2 text-teal-500 focus:ring-teal-500"
                        />
                        Phone only
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="communicationPreference"
                          value="both"
                          checked={formData.communicationPreference === 'both'}
                          onChange={handleInputChange}
                          className="mr-2 text-teal-500 focus:ring-teal-500"
                        />
                        Both
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Consultation Type */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <Video className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">Choose Consultation Type</h2>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    Select your preferred consultation method
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {consultationTypes.map((consultation) => {
                    const IconComponent = consultation.icon;
                    return (
                      <div
                        key={consultation.type}
                        onClick={() => setFormData({...formData, consultationType: consultation.type})}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          formData.consultationType === consultation.type
                            ? 'border-teal-500 bg-teal-500/10 transform scale-105'
                            : isDark
                            ? 'border-gray-600 hover:border-gray-500 hover:scale-102'
                            : 'border-gray-300 hover:border-gray-400 hover:scale-102'
                        }`}
                      >
                        <div className="text-center">
                          <IconComponent className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold mb-2">{consultation.title}</h3>
                          <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {consultation.description}
                          </p>
                          <p className="text-teal-500 font-semibold">{consultation.duration}</p>
                          <p className="text-lg font-bold text-green-500 mt-2">{consultation.price}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Schedule Meeting */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <Calendar className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">Schedule Your Meeting</h2>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    Choose your preferred date and time
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold">
                      Preferred Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-4 rounded-xl border transition-all duration-200 ${
                        isDark
                          ? 'bg-gray-700/50 border-gray-600 text-white focus:bg-gray-700'
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:bg-white'
                      } focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold">
                      Preferred Time <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 rounded-xl border transition-all duration-200 ${
                          isDark
                            ? 'bg-gray-700/50 border-gray-600 text-white focus:bg-gray-700'
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:bg-white'
                        } focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 appearance-none cursor-pointer`}
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Summary before submission */}
                <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl p-6`}>
                  <h3 className="text-xl font-semibold mb-4">Review Your Details</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Name:</strong> {formData.fullName}</p>
                      <p><strong>Email:</strong> {formData.email}</p>
                      <p><strong>Phone:</strong> {formData.phone}</p>
                    </div>
                    <div>
                      <p><strong>Work Type:</strong> {workTypes.find(w => w.value === formData.workType)?.label}</p>
                      <p><strong>Consultation:</strong> {consultationTypes.find(c => c.type === formData.consultationType)?.title}</p>
                      <p><strong>Files:</strong> {uploadedFiles.length} uploaded</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="text-center space-y-8">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-4 text-green-500">
                    Consultation Scheduled!
                  </h2>
                  <p
                    className={`text-lg ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    } mb-8 max-w-2xl mx-auto`}
                  >
                    Thank you for choosing our IP consultation services. We've received your request and will contact you within 24 hours to confirm your appointment.
                  </p>
                </div>
                
                {consultationResult && (
                  <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl p-6 max-w-md mx-auto`}>
                    <h3 className="text-xl font-semibold mb-4">Consultation Summary</h3>
                    <div className="space-y-2 text-left">
                      <p><strong>Consultation ID:</strong> {consultationResult.consultationId}</p>
                      <p><strong>Name:</strong> {consultationResult.fullName}</p>
                      <p><strong>Type:</strong> {consultationResult.consultationType}</p>
                      <p><strong>Date:</strong> {consultationResult.preferredDate}</p>
                      <p><strong>Time:</strong> {consultationResult.preferredTime}</p>
                      <p><strong>Status:</strong> <span className="text-yellow-500 capitalize">{consultationResult.status}</span></p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Please save your consultation ID for future reference. A confirmation email has been sent to your registered email address.
                  </p>
                  <button
                    onClick={() => {
                      // Reset form for new consultation
                      setCurrentStep(1);
                      setFormData({
                        fullName: '',
                        email: '',
                        phone: '',
                        workType: '',
                        description: '',
                        consultationType: '',
                        preferredDate: '',
                        preferredTime: '',
                        marketingConsent: false,
                        communicationPreference: 'both'
                      });
                      setUploadedFiles([]);
                      setConsultationResult(null);
                      setSubmitError(null);
                    }}
                    className="inline-flex items-center px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors font-medium"
                  >
                    Schedule Another Consultation
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          {currentStep < 4 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`inline-flex items-center px-6 py-3 rounded-xl transition-all duration-200 ${
                  currentStep === 1
                    ? 'opacity-50 cursor-not-allowed text-gray-500'
                    : `${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} hover:scale-105`
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              
              <button
                onClick={nextStep}
                disabled={!isStepValid() || isSubmitting}
                className={`inline-flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isStepValid() && !isSubmitting
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:scale-105 shadow-lg hover:shadow-xl'
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : currentStep === 3 ? (
                  <>
                    Submit Consultation
                    <Check className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Consultation;