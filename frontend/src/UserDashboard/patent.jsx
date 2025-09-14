import React, { useState } from 'react';
import { Eye, Download, Trash2, Plus, Calendar, FileText, User, Award, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function UserPatents({ patents, handleView, handleDelete, handleDownload, isLoading, onRefresh }) {
  const [selectedPatent, setSelectedPatent] = useState(null);
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
      case 'under-examination':
      case 'under-review':
      case 'pending':
        return {
          color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
          icon: '🔍',
          stage: 3,
          label: 'Under Examination'
        };
      case 'granted':
      case 'approved':
        return {
          color: 'bg-green-500/20 text-green-300 border-green-500/30',
          icon: '✅',
          stage: 4,
          label: 'Granted'
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
      { id: 1, title: 'Application Preparation', description: 'Preparing application documents and details', icon: FileText },
      { id: 2, title: 'Application Submitted', description: 'Application submitted for initial review', icon: CheckCircle },
      { id: 3, title: 'Technical Examination', description: 'Patent office reviewing technical claims', icon: AlertCircle },
      { id: 4, title: 'Patent Granted', description: 'Patent application approved and granted', icon: Award },
      { id: 5, title: 'Publication Complete', description: 'Patent published in official gazette', icon: FileText }
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

  const handleViewPatent = (patent) => {
    setSelectedPatent(patent);
    setShowModal(true);
    handleView(patent, 'patents');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Patent Applications</h2>
          <p className="text-slate-300">Track the progress of your patent applications</p>
        </div>
        <button
          onClick={() => window.location.href = '/patent'}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          File New Patent
        </button>
      </div>

      {patents.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🔬</div>
          <h3 className="text-xl font-bold text-white mb-2">No Patent Applications Yet</h3>
          <p className="text-slate-400 mb-6">Start by filing your first patent application to protect your invention.</p>
          <button
            onClick={() => window.location.href = '/patent'}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            File Your First Patent
          </button>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20 bg-white/5">
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Patent Details</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Application No.</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Progress</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Filed Date</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patents.map((patent) => {
                  const statusConfig = getStatusConfig(patent.status);
                  return (
                    <tr key={patent._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <div className="text-white font-medium text-lg">{patent.inventionTitle}</div>
                          <div className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                            <User className="w-4 h-4" />
                            {patent.inventorName}
                          </div>
                          <div className="text-slate-500 text-sm">{patent.patentType || 'Utility Patent'}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-300 font-mono text-sm">
                          {patent.applicationNumber || 'Pending Assignment'}
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
                              style={{ width: `${getProgressPercentage(patent.status)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-400">{statusConfig.stage}/5</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-300 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(patent.filingDate || patent.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleViewPatent(patent)}
                            className="px-3 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg text-xs transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </button>
                          {['granted', 'published', 'approved'].includes(patent.status) && (
                            <button 
                              onClick={() => handleDownload(patent._id, 'patents')}
                              className="px-3 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-xs transition-colors flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              Certificate
                            </button>
                          )}
                          {patent.status === 'draft' && (
                            <button 
                              onClick={() => handleDelete(patent._id, 'patents')}
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

      {/* Patent Detail Modal */}
      {showModal && selectedPatent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="sticky top-0 bg-slate-800 border-b border-white/20 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-white">Patent Application Details</h3>
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusConfig(selectedPatent.status).color}`}>
                  {getStatusConfig(selectedPatent.status).icon} {getStatusConfig(selectedPatent.status).label}
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
                  {getStageInfo(getStatusConfig(selectedPatent.status).stage).map((stage, index) => {
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
                    <h4 className="text-lg font-bold text-white mb-4">Basic Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-slate-400 text-sm">Application Number</label>
                        <p className="text-white font-mono text-lg">{selectedPatent.applicationNumber || 'Not Assigned Yet'}</p>
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">Invention Title</label>
                        <p className="text-white font-bold text-xl">{selectedPatent.inventionTitle}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-slate-400 text-sm">Inventor Name</label>
                          <p className="text-white">{selectedPatent.inventorName}</p>
                        </div>
                        <div>
                          <label className="text-slate-400 text-sm">Patent Type</label>
                          <p className="text-white capitalize">{selectedPatent.patentType || selectedPatent.inventionType || 'Utility Patent'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedPatent.abstractDescription && (
                    <div className="bg-slate-700/30 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-white mb-4">Abstract</h4>
                      <p className="text-slate-300 leading-relaxed">{selectedPatent.abstractDescription}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-700/30 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Filing Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-slate-400 text-sm">Filing Date</label>
                        <p className="text-white">{formatDate(selectedPatent.filingDate || selectedPatent.createdAt)}</p>
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">Priority Date</label>
                        <p className="text-white">{selectedPatent.priorityDate ? formatDate(selectedPatent.priorityDate) : 'Not Claimed'}</p>
                      </div>
                      {selectedPatent.applicantName && (
                        <div>
                          <label className="text-slate-400 text-sm">Applicant Name</label>
                          <p className="text-white">{selectedPatent.applicantName}</p>
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
                          <span className={`px-3 py-1 text-sm rounded-full ${getStatusConfig(selectedPatent.status).color}`}>
                            {getStatusConfig(selectedPatent.status).icon} {getStatusConfig(selectedPatent.status).label}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm">Progress</label>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 bg-slate-600 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500" 
                              style={{ width: `${getProgressPercentage(selectedPatent.status)}%` }}
                            ></div>
                          </div>
                          <span className="text-slate-400 text-sm">{getStatusConfig(selectedPatent.status).stage}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              {(selectedPatent.technicalDescription || selectedPatent.claims) && (
                <div className="bg-slate-700/30 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Technical Details</h4>
                  <div className="space-y-4">
                    {selectedPatent.technicalDescription && (
                      <div>
                        <label className="text-slate-400 text-sm">Technical Description</label>
                        <div className="bg-slate-600/50 p-4 rounded-lg mt-2 text-slate-200 max-h-48 overflow-y-auto">
                          {selectedPatent.technicalDescription}
                        </div>
                      </div>
                    )}
                    {selectedPatent.claims && (
                      <div>
                        <label className="text-slate-400 text-sm">Patent Claims</label>
                        <div className="bg-slate-600/50 p-4 rounded-lg mt-2 text-slate-200 max-h-48 overflow-y-auto">
                          {selectedPatent.claims}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Documents Section */}
              {((selectedPatent.supportingDocuments && selectedPatent.supportingDocuments.length > 0) || 
                (selectedPatent.technicalDrawings && selectedPatent.technicalDrawings.length > 0)) && (
                <div className="bg-slate-700/30 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Uploaded Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedPatent.supportingDocuments && selectedPatent.supportingDocuments.length > 0 && (
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Supporting Documents ({selectedPatent.supportingDocuments.length})</label>
                        <div className="space-y-2">
                          {selectedPatent.supportingDocuments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-slate-600/50 p-3 rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-blue-400" />
                                <div>
                                  <div className="text-white text-sm">{file.originalName || file.filename}</div>
                                  <div className="text-slate-400 text-xs">
                                    {file.mimetype} • {Math.round((file.size || 0) / 1024)} KB
                                  </div>
                                </div>
                              </div>
                              <button className="text-blue-400 hover:text-blue-300 p-2">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedPatent.technicalDrawings && selectedPatent.technicalDrawings.length > 0 && (
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Technical Drawings ({selectedPatent.technicalDrawings.length})</label>
                        <div className="space-y-2">
                          {selectedPatent.technicalDrawings.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-slate-600/50 p-3 rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-purple-400" />
                                <div>
                                  <div className="text-white text-sm">{file.originalName || file.filename}</div>
                                  <div className="text-slate-400 text-xs">
                                    {file.mimetype} • {Math.round((file.size || 0) / 1024)} KB
                                  </div>
                                </div>
                              </div>
                              <button className="text-purple-400 hover:text-purple-300 p-2">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {['granted', 'published', 'approved'].includes(selectedPatent.status) && (
                <div className="flex justify-center pt-6 border-t border-white/20">
                  <button
                    onClick={() => handleDownload(selectedPatent._id, 'patents')}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Patent Certificate
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