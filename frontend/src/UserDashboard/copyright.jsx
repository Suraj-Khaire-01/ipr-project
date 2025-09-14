import React, { useState } from 'react';
import { Eye, Download, Trash2, Plus, Calendar, FileText, User, Award, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function UserCopyrights({ copyrights, handleView, handleDelete, handleDownload, isLoading, onRefresh }) {
  const [selectedCopyright, setSelectedCopyright] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'draft':
        return {
          color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
          icon: '📝',
          stage: 1,
          label: 'Draft'
        };
      case 'submitted':
      case 'applied':
        return {
          color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          icon: '📤',
          stage: 2,
          label: 'Submitted'
        };
      case 'under-review':
      case 'under-examination':
      case 'pending':
        return {
          color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
          icon: '🔍',
          stage: 3,
          label: 'Under Review'
        };
      case 'registered':
      case 'granted':
      case 'approved':
        return {
          color: 'bg-green-500/20 text-green-300 border-green-500/30',
          icon: '✅',
          stage: 4,
          label: 'Registered'
        };
      case 'published':
        return {
          color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          icon: '📖',
          stage: 5,
          label: 'Published'
        };
      case 'rejected':
      case 'cancelled':
        return {
          color: 'bg-red-500/20 text-red-300 border-red-500/30',
          icon: '❌',
          stage: 0,
          label: 'Rejected'
        };
      default:
        return {
          color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
          icon: '📄',
          stage: 1,
          label: 'Unknown'
        };
    }
  };

  const getProgressPercentage = (status) => {
    const config = getStatusConfig(status);
    if (config.stage === 0) return 0; // Rejected
    return Math.min((config.stage / 5) * 100, 100);
  };

  const getStageInfo = (currentStage) => {
    const stages = [
      { id: 1, title: 'Application Preparation', description: 'Preparing copyright application and work details', icon: FileText },
      { id: 2, title: 'Application Submitted', description: 'Application submitted for initial review', icon: CheckCircle },
      { id: 3, title: 'Examination & Verification', description: 'Copyright office reviewing and verifying work', icon: AlertCircle },
      { id: 4, title: 'Copyright Registered', description: 'Copyright application approved and registered', icon: Award },
      { id: 5, title: 'Publication Complete', description: 'Copyright published in official records', icon: FileText }
    ];

    return stages.map(stage => ({
      ...stage,
      isCompleted: stage.id <= currentStage,
      isCurrent: stage.id === currentStage
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleViewCopyright = (copyright) => {
    setSelectedCopyright(copyright);
    setShowModal(true);
    handleView(copyright, 'copyrights');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Copyright Applications</h2>
          <p className="text-slate-300">Track the progress of your copyright registrations</p>
        </div>
        <button
          onClick={() => window.location.href = '/copyright'}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Register New Copyright
        </button>
      </div>

      {copyrights.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">©️</div>
          <h3 className="text-xl font-bold text-white mb-2">No Copyright Applications Yet</h3>
          <p className="text-slate-400 mb-6">Start by registering your first copyright to protect your creative work.</p>
          <button
            onClick={() => window.location.href = '/copyright'}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            Register Your First Copyright
          </button>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20 bg-white/5">
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Work Details</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Application No.</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Progress</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Filed Date</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {copyrights.map((copyright) => {
                  const statusConfig = getStatusConfig(copyright.status);
                  return (
                    <tr key={copyright._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <div className="text-white font-medium text-lg">{copyright.title}</div>
                          <div className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                            <User className="w-4 h-4" />
                            {copyright.authorName}
                          </div>
                          <div className="text-slate-500 text-sm capitalize">{copyright.workType || 'Literary Work'}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-300 font-mono text-sm">
                          {copyright.applicationNumber || 'Pending Assignment'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 text-xs rounded-full border capitalize flex items-center gap-2 w-fit ${statusConfig.color}`}>
                          <span>{statusConfig.icon}</span>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-20 bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${getProgressPercentage(copyright.status)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-400">{statusConfig.stage}/5</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-300 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(copyright.filingDate || copyright.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleViewCopyright(copyright)}
                            className="px-3 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg text-xs transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </button>
                          {['registered', 'published', 'granted', 'approved'].includes(copyright.status) && (
                            <button 
                              onClick={() => handleDownload(copyright._id, 'copyrights')}
                              className="px-3 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-xs transition-colors flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              Certificate
                            </button>
                          )}
                          {copyright.status === 'draft' && (
                            <button 
                              onClick={() => handleDelete(copyright._id, 'copyrights')}
                              className="px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Copyright Detail Modal */}
      {showModal && selectedCopyright && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="sticky top-0 bg-slate-800 border-b border-white/20 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-white">Copyright Application Details</h3>
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusConfig(selectedCopyright.status).color}`}>
                  {getStatusConfig(selectedCopyright.status).icon} {getStatusConfig(selectedCopyright.status).label}
                </span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Progress Timeline */}
              <div className="bg-slate-700/50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-6">Application Progress</h4>
                <div className="space-y-4">
                  {getStageInfo(getStatusConfig(selectedCopyright.status).stage).map((stage, index) => {
                    const Icon = stage.icon;
                    return (
                      <div key={stage.id} className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                        stage.isCurrent ? 'bg-blue-500/20 border border-blue-500/30' :
                        stage.isCompleted ? 'bg-green-500/20 border border-green-500/30' :
                        'bg-slate-600/30 border border-slate-600/50'
                      }`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          stage.isCurrent ? 'bg-blue-500 text-white' :
                          stage.isCompleted ? 'bg-green-500 text-white' :
                          'bg-slate-600 text-slate-400'
                        }`}>
                          {stage.isCompleted ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : stage.isCurrent ? (
                            <Clock className="w-6 h-6" />
                          ) : (
                            <Icon className="w-6 h-6" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className={`font-bold ${
                            stage.isCurrent || stage.isCompleted ? 'text-white' : 'text-slate-400'
                          }`}>
                            {stage.title}
                          </h5>
                          <p className={`text-sm ${
                            stage.isCurrent || stage.isCompleted ? 'text-slate-300' : 'text-slate-500'
                          }`}>
                            {stage.description}
                          </p>
                        </div>
                        {stage.isCompleted && (
                          <div className="text-green-400 text-sm">
                            ✓ Completed
                          </div>
                        )}
                        {stage.isCurrent && (
                          <div className="text-blue-400 text-sm">
                            ⚡ Current Stage
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Application Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-slate-700/30 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Work Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-slate-400 text-sm">Application Number</label>
                        <p className="text-white font-mono text-lg">{selectedCopyright.applicationNumber || 'Not Assigned Yet'}</p>
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">Work Title</label>
                        <p className="text-white font-bold text-xl">{selectedCopyright.title}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-slate-400 text-sm">Author Name</label>
                          <p className="text-white">{selectedCopyright.authorName}</p>
                        </div>
                        <div>
                          <label className="text-slate-400 text-sm">Work Type</label>
                          <p className="text-white capitalize">{selectedCopyright.workType || 'Literary Work'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedCopyright.description && (
                    <div className="bg-slate-700/30 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-white mb-4">Work Description</h4>
                      <p className="text-slate-300 leading-relaxed">{selectedCopyright.description}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-700/30 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Filing Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-slate-400 text-sm">Filing Date</label>
                        <p className="text-white">{formatDate(selectedCopyright.filingDate || selectedCopyright.createdAt)}</p>
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">Language</label>
                        <p className="text-white">{selectedCopyright.language || 'English'}</p>
                      </div>
                      {selectedCopyright.applicantName && (
                        <div>
                          <label className="text-slate-400 text-sm">Applicant Name</label>
                          <p className="text-white">{selectedCopyright.applicantName}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-slate-400 text-sm">Published Work</label>
                        <p className="text-white">
                          {selectedCopyright.isPublished ? (
                            <span className="text-green-400">✅ Yes</span>
                          ) : (
                            <span className="text-slate-400">❌ No</span>
                          )}
                        </p>
                      </div>
                      {selectedCopyright.publicationDate && (
                        <div>
                          <label className="text-slate-400 text-sm">Publication Date</label>
                          <p className="text-white">{formatDate(selectedCopyright.publicationDate)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Status Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-slate-400 text-sm">Current Status</label>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-3 py-1 text-sm rounded-full ${getStatusConfig(selectedCopyright.status).color}`}>
                            {getStatusConfig(selectedCopyright.status).icon} {getStatusConfig(selectedCopyright.status).label}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">Progress</label>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 bg-slate-600 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500" 
                              style={{ width: `${getProgressPercentage(selectedCopyright.status)}%` }}
                            ></div>
                          </div>
                          <span className="text-slate-400 text-sm">{getStatusConfig(selectedCopyright.status).stage}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Files Section */}
              {selectedCopyright.files && selectedCopyright.files.length > 0 && (
                <div className="bg-slate-700/30 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Uploaded Work Files</h4>
                  <div className="space-y-3">
                    {selectedCopyright.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-600/50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-blue-400" />
                          <div>
                            <div className="text-white font-medium">{file.originalName}</div>
                            <div className="text-slate-400 text-sm">
                              {(file.size / 1024 / 1024).toFixed(2)} MB • {file.mimetype} • {formatDate(file.uploadDate)}
                            </div>
                          </div>
                        </div>
                        <button className="text-blue-400 hover:text-blue-300 p-2">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {['registered', 'published', 'granted', 'approved'].includes(selectedCopyright.status) && (
                <div className="flex justify-center pt-6 border-t border-white/20">
                  <button
                    onClick={() => handleDownload(selectedCopyright._id, 'copyrights')}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Copyright Certificate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}