import React, { useState } from 'react';
import { FileText, Upload, BookOpen, Search, AlertCircle, Award, Phone, Mail } from 'lucide-react';

const PatentGuidePage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    patentFilingNeeds: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitMessage(null);
    // Basic client-side validation
    if (!formData.fullName || !formData.emailAddress || !formData.patentFilingNeeds || formData.patentFilingNeeds.length < 10) {
      setSubmitMessage({ type: 'error', text: 'Please fill required fields. Message must be at least 10 characters.' });
      return;
    }

    const payload = {
      fullName: formData.fullName,
      email: formData.emailAddress,
      phone: formData.phoneNumber || undefined,
      company: undefined,
      serviceType: 'patents',
      message: formData.patentFilingNeeds
    };

    (async () => {
      setSubmitting(true);
      try {
        const res = await fetch('https://ipr-project-kojs.onrender.com/api/contact/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          setSubmitMessage({ type: 'success', text: 'Request submitted — we will contact you shortly.' });
          setFormData({ fullName: '', emailAddress: '', phoneNumber: '', patentFilingNeeds: '' });
        } else {
          const details = data.details && Array.isArray(data.details) ? data.details.join(', ') : data.error || data.message;
          setSubmitMessage({ type: 'error', text: details || 'Submission failed' });
        }
      } catch (err) {
        setSubmitMessage({ type: 'error', text: 'Network error: ' + (err.message || err) });
      } finally {
        setSubmitting(false);
      }
    })();
  };

  const processSteps = [
    {
      id: 1,
      icon: FileText,
      title: "Document Preparation",
      subtitle: "Technical details, drawings, inventor info.",
      duration: "2-4 weeks",
      color: "bg-blue-500",
      tasks: [
        "Prepare detailed technical description of your invention",
        "Create technical drawings and diagrams",
        "Gather background research information",
        "Write specific and accurate patent application claims",
        "Ensure all technical aspects and priority documents"
      ]
    },
    {
      id: 2,
      icon: Upload,
      title: "Filing the Application",
      subtitle: "Choose Provisional or Complete patent application.",
      duration: "1-2 days",
      color: "bg-green-500",
      tasks: [
        "Choose between Provisional or Complete patent application",
        "Complete all required forms and documentation",
        "File the application with the Indian Patent Office electronically",
        "Receive official filing receipt and application number",
        "Pay required government fees"
      ]
    },
    {
      id: 3,
      icon: BookOpen,
      title: "Publication",
      subtitle: "After 18 months, your patent application is published.",
      duration: "18 months (or earlier)",
      color: "bg-purple-500",
      tasks: [
        "Application is automatically published after 18 months",
        "Option for early publication is available upon request",
        "Published application becomes publicly accessible",
        "Third parties can view your patent application",
        "Publication establishes priority date"
      ]
    },
    {
      id: 4,
      icon: Search,
      title: "Examination Request",
      subtitle: "You request examination within 48 months of filing.",
      duration: "Within 48 months",
      color: "bg-orange-500",
      tasks: [
        "Submit request for examination within 48 months of filing",
        "Pay examination fees to the Patent Office",
        "We assist in submitting the examination request",
        "Patent examiner is assigned to review your application",
        "Examination process begins officially"
      ]
    },
    {
      id: 5,
      icon: AlertCircle,
      title: "Respond to Objections",
      subtitle: "If the patent office raises objections, we help prepare responses.",
      duration: "6-12 months",
      color: "bg-red-500",
      tasks: [
        "Receive First Examination Report (FER) if objections exist",
        "Analyze examiner's objections and prior art references",
        "We help prepare comprehensive responses to objections",
        "Submit amended claims or arguments as needed",
        "May require multiple rounds of correspondence"
      ]
    },
    {
      id: 6,
      icon: Award,
      title: "Grant of Patent",
      subtitle: "Once all requirements are met, the patent is granted and published.",
      duration: "2-4 months after final approval",
      color: "bg-teal-500",
      tasks: [
        "Patent Office issues grant notification",
        "Pay the grant fees within specified timelines",
        "Patent certificate is issued and published",
        "Patent protection becomes effective",
        "20 year protection period begins from filing date"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-500 rounded-2xl mb-8">
            <FileText className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Step-by-Step Patent Application Guide
          </h1>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Navigate the patent filing process with confidence. Our comprehensive guide walks you through each 
            step from documentation to grant.
          </p>
        </div>
      </div>

      {/* Process Section */}
      <div className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Patent Filing Process
            </h2>
            <p className="text-lg text-blue-100">
              A comprehensive guide through each step of the patent application process
            </p>
          </div>

          <div className="grid gap-8 md:gap-12">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.id} className="relative">
                  {/* Connector Line */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute left-8 top-20 w-0.5 h-20 bg-gradient-to-b from-slate-600 to-transparent"></div>
                  )}
                  
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Step Number and Icon */}
                      <div className="flex items-center gap-4 md:flex-col md:items-center">
                        <div className="flex items-center justify-center w-16 h-16 bg-slate-700 rounded-xl">
                          <span className="text-2xl font-bold text-white">{step.id}</span>
                        </div>
                        <div className={`flex items-center justify-center w-12 h-12 ${step.color} rounded-lg`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                            <p className="text-slate-300 text-lg">{step.subtitle}</p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <span className="inline-block px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-sm font-medium">
                              {step.duration}
                            </span>
                          </div>
                        </div>

                        <ul className="space-y-2">
                          {step.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-start gap-3 text-slate-300">
                              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline Overview */}
      <div className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Typical Timeline Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-400 mb-2">2-6 months</div>
              <div className="text-lg font-semibold text-white mb-2">Preparation & Filing</div>
              <div className="text-slate-300">Document preparation and application submission</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">18-24 months</div>
              <div className="text-lg font-semibold text-white mb-2">Publication & Examination</div>
              <div className="text-slate-300">Public disclosure and patent office review</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">3-5 years</div>
              <div className="text-lg font-semibold text-white mb-2">Total Process Duration</div>
              <div className="text-slate-300">From filing to final patent grant</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-slate-700/50">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Side - CTA */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Get Started Today
                </h2>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to File Your Patent?
                </h3>
                <p className="text-slate-300 text-lg mb-8">
                  Let our expert patent attorneys guide you through the entire 
                  process.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white">
                    <div className="flex items-center justify-center w-10 h-10 bg-teal-500 rounded-lg">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Call Us</div>
                      <div className="text-slate-300">+91 98765 123 4567</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Email Us</div>
                      <div className="text-slate-300">info@ipsecure-legal.com</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="block text-sm font-medium text-white mb-2">
                        Full Name *
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter full name"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <div className="block text-sm font-medium text-white mb-2">
                        Email Address *
                      </div>
                      <input
                        type="email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="block text-sm font-medium text-white mb-2">
                      Phone Number
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <div className="block text-sm font-medium text-white mb-2">
                      Tell us about your patent filing needs. *
                    </div>
                    <textarea
                      name="patentFilingNeeds"
                      value={formData.patentFilingNeeds}
                      onChange={handleInputChange}
                      placeholder="Describe your patent filing requirements..."
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-vertical"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`w-full ${submitting ? 'opacity-60 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'} text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-lg`}
                  >
                    {submitting ? 'Submitting...' : 'Get Free Consultation Call'}
                  </button>
                  {submitMessage && (
                    <div className={`mt-3 text-center ${submitMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{submitMessage.text}</div>
                  )}
                  
                  <p className="text-sm text-slate-400 text-center">
                    By submitting this form, you agree to our terms and conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatentGuidePage;