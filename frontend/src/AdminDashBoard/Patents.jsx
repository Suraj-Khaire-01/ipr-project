const backend_url = import.meta.env.VITE_BACKEND_URL;
import { useEffect, useState } from 'react';

export default function Patents() {
  const [patents, setPatents] = useState([]);
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatents();
  }, []);

  const fetchPatents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backend_url}/api/patents`);
      const result = await response.json();
      
      if (result.success) {
        setPatents(result.data);
        setError(null);
      } else {
        console.error('Failed to fetch patents:', result.message);
        setError(`Failed to fetch patents: ${result.message}`);
      }
    } catch (error) {
      console.error('Error fetching patents:', error);
      setError(`Failed to fetch patents: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPatent = (patent) => {
    setSelectedPatent(patent);
    setShowModal(true);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(`${backend_url}/api/patents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setPatents(prev => prev.map(patent =>
          patent._id === id ? { ...patent, status } : patent
        ));
        
        if (selectedPatent && selectedPatent._id === id) {
          setSelectedPatent({ ...selectedPatent, status });
        }
      } else {
        console.error('Failed to update patent:', result.message);
        alert('Failed to update patent status');
      }
    } catch (error) {
      console.error('Error updating patent:', error);
      alert('Error updating patent status');
    }
  };

 const handleDeletePatent = async (id) => {
  if (window.confirm("Are you sure you want to delete this patent application?")) {
    try {
      const response = await fetch(`${backend_url}/api/patents/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          isAdmin: true     // 👈 REQUIRED for admin override delete
        })
      });

      const result = await response.json();

      if (result.success) {
        setPatents(prev => prev.filter(patent => patent._id !== id));

        if (selectedPatent && selectedPatent._id === id) {
          setSelectedPatent(null);
          setShowModal(false);
        }

        alert("Patent application deleted successfully");
      } else {
        console.error("Failed to delete patent:", result.message);
        alert(result.message || "Failed to delete patent");
      }
    } catch (error) {
      console.error("Error deleting patent:", error);
      alert("Error deleting patent");
    }
  }
};


  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-300';
      case 'submitted': return 'bg-blue-500/20 text-blue-300';
      case 'under-examination': return 'bg-yellow-500/20 text-yellow-300';
      case 'granted': return 'bg-green-500/20 text-green-300';
      case 'rejected': return 'bg-red-500/20 text-red-300';
      case 'published': return 'bg-purple-500/20 text-purple-300';
      case 'expired': return 'bg-orange-500/20 text-orange-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return '📝';
      case 'submitted': return '📤';
      case 'under-examination': return '🔍';
      case 'granted': return '✅';
      case 'rejected': return '❌';
      case 'published': return '📖';
      case 'expired': return '⏰';
      default: return '📄';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDownloadFile = (patent, file) => {
    if (file && file._id) {
      window.open(`${backend_url}/api/patents/${patent._id}/download/${file._id}`, '_blank');
    } else {
      alert('File not available for download');
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-400 text-xl mr-3">⚠️</div>
            <div>
              <h3 className="text-red-300 font-medium">Error</h3>
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchPatents}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-22 ml-65">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Patent Applications</h2>
        <div className="flex space-x-2">
          <button
            onClick={fetchPatents}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
            disabled={isLoading}
          >
            {isLoading ? '⟳ Loading...' : '🔄 Refresh'}
          </button>
          <span className="px-3 py-1 bg-blue-600 text-blue-100 rounded-full text-sm">
            Total: {patents.length}
          </span>
          <span className="px-3 py-1 bg-green-600 text-green-100 rounded-full text-sm">
            Granted: {patents.filter(p => p.status === 'granted').length}
          </span>
          <span className="px-3 py-1 bg-yellow-600 text-yellow-100 rounded-full text-sm">
            Under Review: {patents.filter(p => ['submitted', 'under-examination'].includes(p.status)).length}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    App. No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Invention Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Inventor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Filing Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {patents.map((patent) => (
                  <tr key={patent._id} className="hover:bg-slate-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-300">
                      {patent.applicationNumber || 'Draft'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300 font-medium">{patent.inventionTitle}</div>
                      {patent.abstractDescription && (
                        <div className="text-sm text-slate-500 truncate max-w-xs">
                          {patent.abstractDescription.substring(0, 50)}...
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{patent.inventorName}</div>
                      {patent.applicantName && patent.applicantName !== patent.inventorName && (
                        <div className="text-sm text-slate-500">App: {patent.applicantName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 capitalize">
                      {patent.patentType || patent.inventionType || 'Utility'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {formatDate(patent.filingDate || patent.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize flex items-center gap-1 w-fit ${
                        getStatusColor(patent.status || 'draft')
                      }`}>
                        <span>{getStatusIcon(patent.status || 'draft')}</span>
                        {(patent.status || 'draft').replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewPatent(patent)}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        View
                      </button>
                      {patent.status === 'submitted' && (
                        <button
                          onClick={() => handleUpdateStatus(patent._id, 'under-examination')}
                          className="text-yellow-400 hover:text-yellow-300 mr-3"
                        >
                          Examine
                        </button>
                      )}
                      {patent.status === 'under-examination' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(patent._id, 'granted')}
                            className="text-green-400 hover:text-green-300 mr-3"
                          >
                            Grant
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(patent._id, 'rejected')}
                            className="text-red-400 hover:text-red-300 mr-3"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          const file = (patent.supportingDocuments && patent.supportingDocuments[0]) || 
                                      (patent.technicalDrawings && patent.technicalDrawings[0]);
                          handleDownloadFile(patent, file);
                        }}
                        className="text-green-400 hover:text-green-300 mr-3"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleDeletePatent(patent._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {patents.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-slate-600 text-6xl mb-4">🔬</div>
              <div className="text-slate-500 text-lg">No patent applications found</div>
              <p className="text-slate-400 text-sm mt-2">Submit your first patent application to get started</p>
            </div>
          )}
        </div>
      )}

      {/* Patent Detail Modal */}
      {showModal && selectedPatent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-5xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-white">Patent Application Details</h3>
                <span className={`px-3 py-1 text-xs rounded-full capitalize ${getStatusColor(selectedPatent.status || 'draft')}`}>
                  {getStatusIcon(selectedPatent.status || 'draft')} {(selectedPatent.status || 'draft').replace('-', ' ')}
                </span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Application Number</label>
                  <p className="text-white font-mono">{selectedPatent.applicationNumber || 'Not assigned (Draft)'}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Filing Date</label>
                  <p className="text-white">{formatDate(selectedPatent.filingDate || selectedPatent.createdAt)}</p>
                </div>
              </div>
              
              <div>
                <label className="text-slate-400 text-sm">Invention Title</label>
                <p className="text-white font-medium text-lg">{selectedPatent.inventionTitle}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Inventor Name</label>
                  <p className="text-white">{selectedPatent.inventorName}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Applicant Name</label>
                  <p className="text-white">{selectedPatent.applicantName || 'Same as inventor'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Patent Type</label>
                  <p className="text-white capitalize">{selectedPatent.patentType || selectedPatent.inventionType || 'Utility Patent'}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Priority Date</label>
                  <p className="text-white">{selectedPatent.priorityDate ? formatDate(selectedPatent.priorityDate) : 'Not claimed'}</p>
                </div>
              </div>

              {selectedPatent.abstractDescription && (
                <div>
                  <label className="text-slate-400 text-sm">Abstract</label>
                  <p className="text-white bg-slate-700 p-3 rounded mt-1">{selectedPatent.abstractDescription}</p>
                </div>
              )}

              {selectedPatent.technicalDescription && (
                <div>
                  <label className="text-slate-400 text-sm">Technical Description</label>
                  <div className="bg-slate-700 p-3 rounded mt-1 text-slate-200 max-h-48 overflow-y-auto">
                    {selectedPatent.technicalDescription}
                  </div>
                </div>
              )}

              {selectedPatent.claims && (
                <div>
                  <label className="text-slate-400 text-sm">Claims</label>
                  <div className="bg-slate-700 p-3 rounded mt-1 text-slate-200 max-h-48 overflow-y-auto">
                    {selectedPatent.claims}
                  </div>
                </div>
              )}

              {/* Supporting Documents */}
              {selectedPatent.supportingDocuments && selectedPatent.supportingDocuments.length > 0 && (
                <div>
                  <label className="text-slate-400 text-sm">Supporting Documents ({selectedPatent.supportingDocuments.length})</label>
                  <div className="mt-2 space-y-2">
                    {selectedPatent.supportingDocuments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-700 p-3 rounded">
                        <div className="flex items-center gap-3">
                          <div className="text-blue-400">📎</div>
                          <div>
                            <div className="text-white text-sm">{file.originalName || file.filename}</div>
                            <div className="text-slate-400 text-xs">
                              {file.mimetype} • {Math.round((file.size || 0) / 1024)} KB
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadFile(selectedPatent, file)}
                          className="text-blue-400 hover:text-blue-300 text-sm px-3 py-1 bg-blue-500/20 rounded transition-colors"
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Drawings */}
              {selectedPatent.technicalDrawings && selectedPatent.technicalDrawings.length > 0 && (
                <div>
                  <label className="text-slate-400 text-sm">Technical Drawings ({selectedPatent.technicalDrawings.length})</label>
                  <div className="mt-2 space-y-2">
                    {selectedPatent.technicalDrawings.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-700 p-3 rounded">
                        <div className="flex items-center gap-3">
                          <div className="text-purple-400">🖼️</div>
                          <div>
                            <div className="text-white text-sm">{file.originalName || file.filename}</div>
                            <div className="text-slate-400 text-xs">
                              {file.mimetype} • {Math.round((file.size || 0) / 1024)} KB
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadFile(selectedPatent, file)}
                          className="text-purple-400 hover:text-purple-300 text-sm px-3 py-1 bg-purple-500/20 rounded transition-colors"
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                <div>
                  <label className="text-slate-400 text-sm">Created</label>
                  <p className="text-slate-300 text-sm">{formatDate(selectedPatent.createdAt)}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Last Updated</label>
                  <p className="text-slate-300 text-sm">{formatDate(selectedPatent.updatedAt)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700">
                {selectedPatent.status === 'submitted' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedPatent._id, 'under-examination')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    🔍 Start Examination
                  </button>
                )}
                {selectedPatent.status === 'under-examination' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(selectedPatent._id, 'granted')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      ✅ Grant Patent
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedPatent._id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      ❌ Reject Application
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedPatent._id, 'published')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      📖 Publish Application
                    </button>
                  </>
                )}
                {selectedPatent.status === 'granted' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedPatent._id, 'published')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    📖 Publish Patent
                  </button>
                )}
                <button
                  onClick={() => handleDeletePatent(selectedPatent._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
