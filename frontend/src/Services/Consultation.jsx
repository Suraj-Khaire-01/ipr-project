import React, { useState } from 'react';
import {
  ChevronDown,
  Upload,
  Phone,
  Video,
  MapPin,
  Calendar,
  Clock,
  Check
} from 'lucide-react';

const Consulation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    workType: '',
    description: '',
    consultationType: '',
    preferredDate: '',
    preferredTime: ''
  });
  const [isDark, setIsDark] = useState(true);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const workTypes = [
    'Patent Filing',
    'Trademark Registration',
    'Copyright Protection',
    'Industrial Design',
    'IP Litigation',
    'Other'
  ];

  const consultationTypes = [
    {
      type: 'phone',
      title: 'Phone Call',
      duration: '30-45 minutes',
      icon: Phone
    },
    {
      type: 'video',
      title: 'Video Call',
      duration: '45-60 minutes',
      icon: Video
    },
    {
      type: 'person',
      title: 'In-Person',
      duration: '60-90 minutes',
      icon: MapPin
    }
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get Expert Consultation
          </h1>
          <p
            className={`text-xl ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            } max-w-3xl mx-auto`}
          >
            Let our IP experts guide you through the best protection strategy
            for your innovation
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-16">
          <div className="flex items-center space-x-8">
            {[1, 2, 3, 4].map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      currentStep >= step
                        ? 'bg-teal-500'
                        : 'bg-gray-700'
                    }`}
                  >
                    {currentStep > step ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      step
                    )}
                  </div>
                </div>
                {index < 3 && (
                  <div
                    className={`w-16 h-1 ${
                      currentStep > step
                        ? 'bg-teal-500'
                        : 'bg-gray-700'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Initial Inquiry Form */}
          {currentStep === 1 && (
            <div className="space-y-8">
              {/* Row 1 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDark
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:border-teal-500 transition-colors`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDark
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:border-teal-500 transition-colors`}
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDark
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:border-teal-500 transition-colors`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Type of Work <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="workType"
                      value={formData.workType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isDark
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:border-teal-500 transition-colors appearance-none cursor-pointer`}
                    >
                      <option value="">Select work type</option>
                      {workTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brief Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your invention, creative work, or IP needs..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:border-teal-500 transition-colors resize-none`}
                />
              </div>

              {/* File Upload */}
              <div>
                <div
                  className={`border-2 border-dashed ${
                    isDark ? 'border-gray-700' : 'border-gray-300'
                  } rounded-lg p-12 text-center`}
                >
                  <Upload
                    className={`w-12 h-12 mx-auto mb-4 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                  <h3 className="text-lg font-medium mb-2">
                    Upload documents or sketches (optional)
                  </h3>
                  <p
                    className={`${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    } mb-4`}
                  >
                    PDF, DOC, JPG, PNG (up to 10MB)
                  </p>
                  <button
                    type="button"
                    className={`px-6 py-2 border ${
                      isDark
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                        : 'border-gray-400 text-gray-700 hover:bg-gray-50'
                    } rounded-lg transition-colors`}
                  >
                    Choose Files
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div
              className={`${
                isDark ? 'bg-gray-800' : 'bg-white'
              } rounded-xl p-8 border ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  Assessment in Progress
                </h2>
                <p
                  className={`text-lg ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  } mb-8 max-w-2xl mx-auto`}
                >
                  Our IP experts are reviewing your submission. You'll receive
                  initial feedback within 48 hours.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-12">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 border rounded-lg transition-colors ${
                currentStep === 1
                  ? 'opacity-50 cursor-not-allowed border-gray-600 text-gray-500'
                  : `border-gray-600 text-gray-300 hover:bg-gray-800`
              }`}
            >
              Back
            </button>
            {currentStep < 4 && (
              <button
                onClick={nextStep}
                className="bg-teal-500 text-white px-8 py-3 rounded-lg hover:bg-teal-600 transition-colors font-medium inline-flex items-center space-x-2"
              >
                <span>Next Step</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Consulation;
