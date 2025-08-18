import React, { useState } from 'react';
import { CheckCircle, Upload, Search, Award } from 'lucide-react';

export default function CopyrightFillingProcess() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    workType: '',
    language: '',
    authorName: '',
    applicantName: '',
    description: '',
    publicationDate: '',
    isPublished: false
  });

  const steps = [
    { id: 1, title: 'Work Details', description: 'Enter work information' },
    { id: 2, title: 'Upload Work', description: 'Submit your creative work' },
    { id: 3, title: 'Application Form', description: 'Complete Form XIV' },
    { id: 4, title: 'Payment', description: 'Pay government fees' },
    { id: 5, title: 'Examination', description: 'Office review' },
    { id: 6, title: 'Certificate', description: 'Registration complete' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
              currentStep > step.id ? 'bg-emerald-500' : 
              currentStep === step.id ? 'bg-emerald-500' : 'bg-gray-600'
            }`}>
              {currentStep > step.id ? <CheckCircle className="w-6 h-6" /> : step.id}
            </div>
            <div className="mt-2 text-center">
              <div className="text-sm font-medium text-white">{step.title}</div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-1 mx-4 ${
              currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-600'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const WorkDetailsStep = () => (
    <div className="bg-gray-800 rounded-lg p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-emerald-400 mb-2">Step 1: Work Details</h3>
        <p className="text-gray-300">Enter work information</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white font-medium mb-2">Title of Work *</label>
          <input
            type="text"
            placeholder="Enter the title of your work"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-white font-medium mb-2">Type of Work *</label>
          <select
            value={formData.workType}
            onChange={(e) => handleInputChange('workType', e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">Select work type</option>
            <option value="literary">Literary Work</option>
            <option value="musical">Musical Work</option>
            <option value="artistic">Artistic Work</option>
            <option value="dramatic">Dramatic Work</option>
            <option value="cinematographic">Cinematographic Work</option>
            <option value="sound-recording">Sound Recording</option>
          </select>
        </div>
        
        <div>
          <label className="block text-white font-medium mb-2">Language *</label>
          <select
            value={formData.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">Select language</option>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="marathi">Marathi</option>
            <option value="gujarati">Gujarati</option>
            <option value="tamil">Tamil</option>
            <option value="telugu">Telugu</option>
            <option value="bengali">Bengali</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-white font-medium mb-2">Author's Name *</label>
          <input
            type="text"
            placeholder="Name of the creator/author"
            value={formData.authorName}
            onChange={(e) => handleInputChange('authorName', e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-white font-medium mb-2">Applicant Name *</label>
          <input
            type="text"
            placeholder="Name of person/entity applying for copyright"
            value={formData.applicantName}
            onChange={(e) => handleInputChange('applicantName', e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-white font-medium mb-2">Description of Work *</label>
          <textarea
            placeholder="Brief description of your creative work..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-white font-medium mb-2">Date of First Publication (if published)</label>
          <input
            type="date"
            value={formData.publicationDate}
            onChange={(e) => handleInputChange('publicationDate', e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            checked={formData.isPublished}
            onChange={(e) => handleInputChange('isPublished', e.target.checked)}
            className="w-4 h-4 text-emerald-500 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500"
          />
          <label htmlFor="published" className="ml-2 text-gray-300">Work has been published</label>
        </div>
      </div>
    </div>
  );

  const UploadWorkStep = () => (
    <div className="bg-gray-800 rounded-lg p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-emerald-400 mb-2">Step 2: Upload Work</h3>
        <p className="text-gray-300">Submit your creative work</p>
      </div>
      
      <h2 className="text-2xl font-bold text-white text-center mb-4">Upload Your Work</h2>
      <p className="text-gray-300 text-center mb-8">Submit a complete copy or representative sample of your creative work.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Primary Work File</h3>
          <p className="text-gray-400 mb-4">Upload the main file of your creative work</p>
          <button className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
            Choose File
          </button>
        </div>
        
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Supporting Documents</h3>
          <p className="text-gray-400 mb-4">Additional files, drafts, or related materials</p>
          <button className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
            Choose Files
          </button>
        </div>
      </div>
      
      <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-4">
        <h4 className="text-orange-400 font-semibold mb-2">File Requirements:</h4>
        <ul className="text-orange-300 text-sm space-y-1">
          <li>• Accepted formats: PDF, DOC, DOCX, JPG, PNG, MP3, MP4, etc.</li>
          <li>• Maximum file size: 50MB per file</li>
          <li>• Ensure files are clear and readable</li>
          <li>• Include all relevant pages/sections</li>
        </ul>
      </div>
    </div>
  );

  const ApplicationFormStep = () => (
    <div className="bg-gray-800 rounded-lg p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-emerald-400 mb-2">Step 3: Application Form</h3>
        <p className="text-gray-300">Complete Form XIV</p>
      </div>
      
      <h2 className="text-2xl font-bold text-white text-center mb-4">Complete Application Form</h2>
      <p className="text-gray-300 text-center mb-8">Form XIV will be auto-filled based on your provided information.</p>
      
      <div className="bg-gray-700 rounded-lg p-6 mb-6">
        <h3 className="text-white font-semibold mb-4">Application Summary:</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Work Title:</span>
            <span className="text-gray-400">{formData.title || 'Not specified'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Work Type:</span>
            <span className="text-gray-400">{formData.workType || 'Not Selected'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Author:</span>
            <span className="text-gray-400">{formData.authorName || 'Not specified'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Language:</span>
            <span className="text-gray-400">{formData.language || 'Not Selected'}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">Declaration of Originality:</h3>
        <div className="space-y-3">
          <label className="flex items-start space-x-3">
            <input type="checkbox" className="w-4 h-4 mt-1 text-emerald-500 bg-gray-600 border-gray-500 rounded focus:ring-emerald-500" />
            <span className="text-gray-300">I declare that the work is original and created by the stated author</span>
          </label>
          <label className="flex items-start space-x-3">
            <input type="checkbox" className="w-4 h-4 mt-1 text-emerald-500 bg-gray-600 border-gray-500 rounded focus:ring-emerald-500" />
            <span className="text-gray-300">I confirm that this work does not infringe on others' rights</span>
          </label>
          <label className="flex items-start space-x-3">
            <input type="checkbox" className="w-4 h-4 mt-1 text-emerald-500 bg-gray-600 border-gray-500 rounded focus:ring-emerald-500" />
            <span className="text-gray-300">All information provided is accurate and complete</span>
          </label>
        </div>
      </div>
    </div>
  );

  const PaymentStep = () => (
    <div className="bg-gray-800 rounded-lg p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-emerald-400 mb-2">Step 4: Payment</h3>
        <p className="text-gray-300">Pay government fees</p>
      </div>
      
      <h2 className="text-2xl font-bold text-white text-center mb-4">Payment</h2>
      <p className="text-gray-300 text-center mb-8">Complete payment to submit your copyright application.</p>
      
      <div className="bg-gray-700 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-6 h-6 bg-emerald-500 rounded mr-3"></div>
          <h3 className="text-white font-semibold">Payment Details</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Professional Fees:</span>
            <span className="text-white font-semibold">$800</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Government Fees:</span>
            <span className="text-white font-semibold">$200</span>
          </div>
          <div className="border-t border-gray-600 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold text-lg">Total:</span>
              <span className="text-emerald-400 font-bold text-xl">$1,000</span>
            </div>
          </div>
        </div>
        
        <button className="w-full mt-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors">
          Proceed to Payment
        </button>
      </div>
    </div>
  );

  const ExaminationStep = () => (
    <div className="bg-gray-800 rounded-lg p-8 text-center">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-emerald-400 mb-2">Step 5: Examination</h3>
        <p className="text-gray-300">Office review</p>
      </div>
      
      <div className="mb-8">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-12 h-12 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">Under Examination</h2>
        <p className="text-gray-300 max-w-md mx-auto">
          Your copyright application is being examined by the Copyright Office. This typically takes 2-4 months.
        </p>
      </div>
      
      <button className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors">
        Check Status
      </button>
    </div>
  );

  const CertificateStep = () => (
    <div className="bg-gray-800 rounded-lg p-8 text-center">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-emerald-400 mb-2">Step 6: Certificate</h3>
        <p className="text-gray-300">Registration complete</p>
      </div>
      
      <div className="mb-8">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Award className="w-12 h-12 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">Copyright Registered!</h2>
        <p className="text-gray-300 max-w-md mx-auto">
          Congratulations! Your copyright has been registered. You can now download your official certificate.
        </p>
      </div>
      
      <button className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors">
        Download Certificate
      </button>
    </div>
  );

  const renderCurrentStep = () => {
    switch(currentStep) {
      case 1: return <WorkDetailsStep />;
      case 2: return <UploadWorkStep />;
      case 3: return <ApplicationFormStep />;
      case 4: return <PaymentStep />;
      case 5: return <ExaminationStep />;
      case 6: return <CertificateStep />;
      default: return <WorkDetailsStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Copyright Registration Process</h1>
          <p className="text-xl text-gray-300">Protect your creative works with official copyright registration</p>
        </div>
        
        <StepIndicator />
        
        <div className="mb-8">
          {renderCurrentStep()}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              currentStep === 1 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            Back
          </button>
          
          {currentStep < 6 ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Submit Application →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}