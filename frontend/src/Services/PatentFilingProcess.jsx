import React, { useState } from 'react';
import {
  Upload,
  FileText,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Shield
} from 'lucide-react';

const PatentFilingProcess = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    inventionTitle: '',
    inventorName: '',
    applicantName: '',
    technicalDescription: ''
  });
  const [technicalDrawings, setTechnicalDrawings] = useState([]);
  const [supportingDocuments, setSupportingDocuments] = useState([]);
  const [dragOver, setDragOver] = useState({ technical: false, supporting: false });

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
    { title: 'Technical description', type: 'text' },
    { title: 'Technical drawings', type: 'file' },
    { title: 'Inventor details', type: 'text' },
    { title: 'Power of attorney (if applicable)', type: 'file' }
  ];

  const [completedDocuments, setCompletedDocuments] = useState([]);

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

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const isFormValid = () => {
    return formData.inventionTitle && 
           formData.inventorName && 
           formData.applicantName && 
           formData.technicalDescription;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
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
                        {/* Technical description */}
                        <div 
                        className={`border rounded-lg p-4 transition-all cursor-pointer ${
                            completedDocuments.includes(1)
                            ? 'bg-teal-900/30 border-teal-700'
                            : 'bg-blue-900/30 border-blue-700/50 hover:border-blue-500'
                        }`}
                        onClick={() => toggleDocumentCompletion(1)}
                        >
                        <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                            completedDocuments.includes(1)
                                ? 'bg-teal-500 border-teal-500'
                                : 'border-2 border-blue-400'
                            }`}>
                            {completedDocuments.includes(1) && (
                                <Check className="w-4 h-4 text-white" />
                            )}
                            </div>
                            <span className={`${
                            completedDocuments.includes(1) ? 'text-teal-200' : 'text-blue-200'
                            }`}>
                            Technical description
                            </span>
                        </div>
                        </div>

                        {/* Technical drawings */}
                        <div 
                        className={`border rounded-lg p-4 transition-all cursor-pointer ${
                            completedDocuments.includes(2)
                            ? 'bg-teal-900/30 border-teal-700'
                            : 'bg-blue-900/30 border-blue-700/50 hover:border-blue-500'
                        }`}
                        onClick={() => toggleDocumentCompletion(2)}
                        >
                        <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                            completedDocuments.includes(2)
                                ? 'bg-teal-500 border-teal-500'
                                : 'border-2 border-blue-400'
                            }`}>
                            {completedDocuments.includes(2) && (
                                <Check className="w-4 h-4 text-white" />
                            )}
                            </div>
                            <span className={`${
                            completedDocuments.includes(2) ? 'text-teal-200' : 'text-blue-200'
                            }`}>
                            Technical drawings
                            </span>
                        </div>
                        </div>

                        {/* Inventor details */}
                        <div 
                        className={`border rounded-lg p-4 transition-all cursor-pointer ${
                            completedDocuments.includes(3)
                            ? 'bg-teal-900/30 border-teal-700'
                            : 'bg-blue-900/30 border-blue-700/50 hover:border-blue-500'
                        }`}
                        onClick={() => toggleDocumentCompletion(3)}
                        >
                        <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                            completedDocuments.includes(3)
                                ? 'bg-teal-500 border-teal-500'
                                : 'border-2 border-blue-400'
                            }`}>
                            {completedDocuments.includes(3) && (
                                <Check className="w-4 h-4 text-white" />
                            )}
                            </div>
                            <span className={`${
                            completedDocuments.includes(3) ? 'text-teal-200' : 'text-blue-200'
                            }`}>
                            Inventor details
                            </span>
                        </div>
                        </div>

                        {/* Power of attorney */}
                        <div 
                        className={`border rounded-lg p-4 transition-all cursor-pointer ${
                            completedDocuments.includes(4)
                            ? 'bg-teal-900/30 border-teal-700'
                            : 'bg-blue-900/30 border-blue-700/50 hover:border-blue-500'
                        }`}
                        onClick={() => toggleDocumentCompletion(4)}
                        >
                        <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                            completedDocuments.includes(4)
                                ? 'bg-teal-500 border-teal-500'
                                : 'border-2 border-blue-400'
                            }`}>
                            {completedDocuments.includes(4) && (
                                <Check className="w-4 h-4 text-white" />
                            )}
                            </div>
                            <span className={`${
                            completedDocuments.includes(4) ? 'text-teal-200' : 'text-blue-200'
                            }`}>
                            Power of attorney (if applicable)
                            </span>
                        </div>
                        </div>
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
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-200">
                      Upload Technical Drawings
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                        dragOver.technical
                          ? 'border-teal-400 bg-teal-400/10'
                          : 'border-gray-600 hover:border-teal-500'
                      }`}
                      onDragOver={(e) => handleDragOver(e, 'technical')}
                      onDragLeave={(e) => handleDragLeave(e, 'technical')}
                      onDrop={(e) => handleDrop(e, 'technical')}
                    >
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-300 mb-3">
                        Drag & drop files here or click to browse
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
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-200">
                      Upload Supporting Documents
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
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

          {/* Other Steps Preview */}
          {currentStep > 1 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 text-center">
              <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-teal-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {steps[currentStep - 1]?.title.replace('\n', ' ')}
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                {currentStep === 2 && "Your application will be submitted to the patent office for initial review and processing."}
                {currentStep === 3 && "The patent office will review your application and process the required fees."}
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
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`inline-flex items-center px-6 py-3 rounded-xl transition-all duration-200 ${
                currentStep === 1
                  ? 'opacity-50 cursor-not-allowed text-gray-500'
                  : 'bg-gray-700 hover:bg-gray-600 text-white hover:scale-105'
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
            
            {currentStep < 7 && (
              <button
                onClick={nextStep}
                disabled={currentStep === 1 && !isFormValid()}
                className={`inline-flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  (currentStep === 1 && isFormValid()) || currentStep > 1
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:scale-105 shadow-lg'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatentFilingProcess;