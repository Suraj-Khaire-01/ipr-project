import React, { useState } from 'react';
import { 
  FileText, 
  Edit, 
  Save, 
  X, 
  Upload, 
  Download, 
  Calendar, 
  User, 
  Building, 
  FileImage, 
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';

const PatentDashboard = () => {
  // Mock patent data based on the schema
  const [patentData, setPatentData] = useState({
    inventionTitle: "Advanced AI-Powered Navigation System",
    inventorName: "John Smith, Jane Doe",
    applicantName: "TechCorp Industries",
    technicalDescription: "An innovative navigation system that utilizes artificial intelligence algorithms to provide real-time traffic optimization, predictive routing, and enhanced user experience through machine learning-based personalization features.",
    currentStep: 3,
    status: "under-review",
    applicationNumber: "PAT-2025-00123",
    filingDate: "2025-03-15T10:30:00Z",
    completedDocuments: ["technical-description", "inventor-declaration"],
    technicalDrawings: [
      { filename: "system_diagram.pdf", originalName: "System Architecture Diagram.pdf", size: 2048000, mimetype: "application/pdf" },
      { filename: "flow_chart.png", originalName: "Process Flow Chart.png", size: 1024000, mimetype: "image/png" }
    ],
    supportingDocuments: [
      { filename: "prior_art.pdf", originalName: "Prior Art Analysis.pdf", size: 3072000, mimetype: "application/pdf" },
      { filename: "test_results.xlsx", originalName: "Test Results Data.xlsx", size: 512000, mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
    ]
  });

  const [editingSections, setEditingSections] = useState({});
  const [tempData, setTempData] = useState({});

  const statusColors = {
    'draft': 'bg-gray-500',
    'submitted': 'bg-blue-500',
    'under-review': 'bg-yellow-500',
    'published': 'bg-green-500',
    'granted': 'bg-emerald-500',
    'rejected': 'bg-red-500'
  };

  const statusIcons = {
    'draft': Clock,
    'submitted': Upload,
    'under-review': AlertCircle,
    'published': CheckCircle,
    'granted': CheckCircle,
    'rejected': X
  };

  const processSteps = [
    "Initial Filing",
    "Prior Art Search",
    "Application Review",
    "Examination",
    "Final Review",
    "Grant/Rejection"
  ];

  const startEditing = (section) => {
    setEditingSections(prev => ({ ...prev, [section]: true }));
    setTempData(prev => ({ ...prev, [section]: patentData[section] }));
  };

  const saveEdit = (section) => {
    setPatentData(prev => ({ ...prev, [section]: tempData[section] }));
    setEditingSections(prev => ({ ...prev, [section]: false }));
    setTempData(prev => {
      const newTemp = { ...prev };
      delete newTemp[section];
      return newTemp;
    });
  };

  const cancelEdit = (section) => {
    setEditingSections(prev => ({ ...prev, [section]: false }));
    setTempData(prev => {
      const newTemp = { ...prev };
      delete newTemp[section];
      return newTemp;
    });
  };

  const handleTempChange = (section, value) => {
    setTempData(prev => ({ ...prev, [section]: value }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const StatusIcon = statusIcons[patentData.status];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-500 p-3 rounded-xl">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Patent Dashboard</h1>
                <p className="text-gray-600">Application #{patentData.applicationNumber}</p>
              </div>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-white ${statusColors[patentData.status]}`}>
              <StatusIcon className="w-4 h-4" />
              <span className="capitalize font-medium">{patentData.status.replace('-', ' ')}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Application Progress</span>
              <span>{patentData.currentStep}/{processSteps.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(patentData.currentStep / processSteps.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              {processSteps.map((step, index) => (
                <div 
                  key={index}
                  className={`text-xs text-center ${index < patentData.currentStep ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-emerald-500" />
                  Basic Information
                </h2>
              </div>
              <div className="p-6 space-y-6">
                
                {/* Invention Title */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Invention Title</label>
                    {!editingSections.inventionTitle ? (
                      <button 
                        onClick={() => startEditing('inventionTitle')}
                        className="text-emerald-500 hover:text-emerald-600 flex items-center text-sm"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => saveEdit('inventionTitle')}
                          className="text-green-600 hover:text-green-700 flex items-center text-sm"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </button>
                        <button 
                          onClick={() => cancelEdit('inventionTitle')}
                          className="text-red-600 hover:text-red-700 flex items-center text-sm"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  {editingSections.inventionTitle ? (
                    <input
                      type="text"
                      value={tempData.inventionTitle || ''}
                      onChange={(e) => handleTempChange('inventionTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{patentData.inventionTitle}</p>
                  )}
                </div>

                {/* Inventor Name */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Inventor(s)</label>
                    {!editingSections.inventorName ? (
                      <button 
                        onClick={() => startEditing('inventorName')}
                        className="text-emerald-500 hover:text-emerald-600 flex items-center text-sm"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => saveEdit('inventorName')}
                          className="text-green-600 hover:text-green-700 flex items-center text-sm"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </button>
                        <button 
                          onClick={() => cancelEdit('inventorName')}
                          className="text-red-600 hover:text-red-700 flex items-center text-sm"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  {editingSections.inventorName ? (
                    <input
                      type="text"
                      value={tempData.inventorName || ''}
                      onChange={(e) => handleTempChange('inventorName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{patentData.inventorName}</p>
                  )}
                </div>

                {/* Applicant Name */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Applicant</label>
                    {!editingSections.applicantName ? (
                      <button 
                        onClick={() => startEditing('applicantName')}
                        className="text-emerald-500 hover:text-emerald-600 flex items-center text-sm"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => saveEdit('applicantName')}
                          className="text-green-600 hover:text-green-700 flex items-center text-sm"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </button>
                        <button 
                          onClick={() => cancelEdit('applicantName')}
                          className="text-red-600 hover:text-red-700 flex items-center text-sm"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  {editingSections.applicantName ? (
                    <input
                      type="text"
                      value={tempData.applicantName || ''}
                      onChange={(e) => handleTempChange('applicantName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{patentData.applicantName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Technical Description */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-emerald-500" />
                    Technical Description
                  </h2>
                  {!editingSections.technicalDescription ? (
                    <button 
                      onClick={() => startEditing('technicalDescription')}
                      className="text-emerald-500 hover:text-emerald-600 flex items-center text-sm"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => saveEdit('technicalDescription')}
                        className="text-green-600 hover:text-green-700 flex items-center text-sm"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </button>
                      <button 
                        onClick={() => cancelEdit('technicalDescription')}
                        className="text-red-600 hover:text-red-700 flex items-center text-sm"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6">
                {editingSections.technicalDescription ? (
                  <textarea
                    rows={6}
                    value={tempData.technicalDescription || ''}
                    onChange={(e) => handleTempChange('technicalDescription', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter detailed technical description..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">{patentData.technicalDescription}</p>
                )}
              </div>
            </div>

            {/* Technical Drawings */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <FileImage className="w-5 h-5 mr-2 text-emerald-500" />
                    Technical Drawings
                  </h2>
                  <button className="text-emerald-500 hover:text-emerald-600 flex items-center text-sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Drawing
                  </button>
                </div>
              </div>
              <div className="p-6">
                {patentData.technicalDrawings.length > 0 ? (
                  <div className="space-y-3">
                    {patentData.technicalDrawings.map((drawing, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-emerald-100 p-2 rounded-lg">
                            <FileImage className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{drawing.originalName}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(drawing.size)} • {drawing.mimetype}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-700">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No technical drawings uploaded yet</p>
                    <button className="mt-2 text-emerald-500 hover:text-emerald-600 font-medium">
                      Upload your first drawing
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Supporting Documents */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-emerald-500" />
                    Supporting Documents
                  </h2>
                  <button className="text-emerald-500 hover:text-emerald-600 flex items-center text-sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Document
                  </button>
                </div>
              </div>
              <div className="p-6">
                {patentData.supportingDocuments.length > 0 ? (
                  <div className="space-y-3">
                    {patentData.supportingDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{doc.originalName}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(doc.size)} • {doc.mimetype}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-700">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No supporting documents uploaded yet</p>
                    <button className="mt-2 text-emerald-500 hover:text-emerald-600 font-medium">
                      Upload your first document
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Application Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-emerald-500" />
                Application Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Application Number</p>
                  <p className="font-medium text-gray-900">{patentData.applicationNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Filing Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(patentData.filingDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Status</p>
                  <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm text-white ${statusColors[patentData.status]}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span className="capitalize">{patentData.status.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Checklist */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-emerald-500" />
                Document Checklist
              </h3>
              <div className="space-y-3">
                {[
                  'Technical Description',
                  'Inventor Declaration',
                  'Technical Drawings',
                  'Prior Art Search',
                  'Claims Document',
                  'Abstract'
                ].map((doc, index) => {
                  const isCompleted = patentData.completedDocuments.includes(doc.toLowerCase().replace(' ', '-'));
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                      <span className={`text-sm ${isCompleted ? 'text-green-800 font-medium' : 'text-gray-600'}`}>
                        {doc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Application
                </button>
                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatentDashboard;