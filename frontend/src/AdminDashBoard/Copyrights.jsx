import { useEffect, useState } from "react";

export default function Copyrights() {
  const [copyrights, setCopyrights] = useState([]);
  const [selectedCopyright, setSelectedCopyright] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCopyrights();
  }, []);

  const fetchCopyrights = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backend_url}/api/copyright`);
      const result = await response.json();
      
      if (result.success) {
        setCopyrights(result.data);
        setError(null);
      } else {
        console.error('Failed to fetch copyrights:', result.message);
        setError(`Failed to fetch copyrights: ${result.message}`);
      }
    } catch (error) {
      console.error('Error fetching copyrights:', error);
      setError(`Failed to fetch copyrights: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCopyright = (copyright) => {
    setSelectedCopyright(copyright);
    setShowModal(true);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(`${backend_url}/api/copyright/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCopyrights(prev => prev.map(copyright =>
          copyright._id === id ? { ...copyright, status } : copyright
        ));
        
        if (selectedCopyright && selectedCopyright._id === id) {
          setSelectedCopyright({ ...selectedCopyright, status });
        }
      } else {
        console.error('Failed to update copyright:', result.message);
        alert('Failed to update copyright status');
      }
    } catch (error) {
      console.error('Error updating copyright:', error);
      alert('Error updating copyright status');
    }
  };

  const handleDeleteCopyright = async (id) => {
    if (window.confirm('Are you sure you want to delete this copyright application?')) {
      try {
        const response = await fetch(`${backend_url}/api/copyright/${id}`, {
          method: 'DELETE',
        });
        
        const result = await response.json();
        
        if (result.success) {
          setCopyrights(prev => prev.filter(copyright => copyright._id !== id));
          if (selectedCopyright && selectedCopyright._id === id) {
            setSelectedCopyright(null);
            setShowModal(false);
          }
        } else {
          console.error('Failed to delete copyright:', result.message);
          alert('Failed to delete copyright');
        }
      } catch (error) {
        console.error('Error deleting copyright:', error);
        alert('Error deleting copyright');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-300';
      case 'submitted': return 'bg-blue-500/20 text-blue-300';
      case 'under-review': return 'bg-yellow-500/20 text-yellow-300';
      case 'registered': return 'bg-green-500/20 text-green-300';
      case 'rejected': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return '📝';
      case 'submitted': return '📤';
      case 'under-review': return '👀';
      case 'registered': return '✅';
      case 'rejected': return '❌';
      default: return '📄';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStepProgress = (currentStep) => {
    const totalSteps = 5;
    return Math.min(currentStep, totalSteps);
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
            onClick={fetchCopyrights}
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
        <h2 className="text-2xl font-bold text-white">Copyright Applications</h2>
        <div className="flex space-x-2">
          <button
            onClick={fetchCopyrights}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
            disabled={isLoading}
          >
            {isLoading ? '⟳ Loading...' : '🔄 Refresh'}
          </button>
          <span className="px-3 py-1 bg-blue-600 text-blue-100 rounded-full text-sm">
            Total: {copyrights.length}
          </span>
          <span className="px-3 py-1 bg-green-600 text-green-100 rounded-full text-sm">
            Registered: {copyrights.filter(c => c.status === 'registered').length}
          </span>
          <span className="px-3 py-1 bg-yellow-600 text-yellow-100 rounded-full text-sm">
            Pending: {copyrights.filter(c => ['submitted', 'under-review'].includes(c.status)).length}
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
                    Application No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Work Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Filing Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {copyrights.map((copyright) => (
                  <tr key={copyright._id} className="hover:bg-slate-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-300">
                      {copyright.applicationNumber || 'Draft'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300 font-medium">{copyright.title}</div>
                      <div className="text-sm text-slate-500">{copyright.language}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{copyright.authorName}</div>
                      {copyright.applicantName && copyright.applicantName !== copyright.authorName && (
                        <div className="text-sm text-slate-500">Applicant: {copyright.applicantName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 capitalize">
                      {copyright.workType || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {formatDate(copyright.filingDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize flex items-center gap-1 w-fit ${
                        getStatusColor(copyright.status)
                      }`}>
                        <span>{getStatusIcon(copyright.status)}</span>
                        {copyright.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${(getStepProgress(copyright.currentStep) / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs text-slate-400">{copyright.currentStep}/5</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewCopyright(copyright)}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        View
                      </button>
                      {copyright.status === 'submitted' && (
                        <button
                          onClick={() => handleUpdateStatus(copyright._id, 'under-review')}
                          className="text-yellow-400 hover:text-yellow-300 mr-3"
                        >
                          Review
                        </button>
                      )}
                      {copyright.status === 'under-review' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(copyright._id, 'registered')}
                            className="text-green-400 hover:text-green-300 mr-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(copyright._id, 'rejected')}
                            className="text-red-400 hover:text-red-300 mr-3"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteCopyright(copyright._id)}
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
          
          {copyrights.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-slate-600 text-6xl mb-4">©️</div>
              <div className="text-slate-500 text-lg">No copyright applications found</div>
              <p className="text-slate-400 text-sm mt-2">Submit your first copyright application to get started</p>
            </div>
          )}
        </div>
      )}

      {/* Copyright Detail Modal */}
      {showModal && selectedCopyright && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-white">Copyright Application Details</h3>
                <span className={`px-3 py-1 text-xs rounded-full capitalize ${getStatusColor(selectedCopyright.status)}`}>
                  {getStatusIcon(selectedCopyright.status)} {selectedCopyright.status.replace('-', ' ')}
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
              {/* Progress Bar */}
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 text-sm font-medium">Application Progress</span>
                  <span className="text-slate-400 text-sm">{selectedCopyright.currentStep}/5 Steps</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${(getStepProgress(selectedCopyright.currentStep) / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Application Number</label>
                  <p className="text-white font-mono">{selectedCopyright.applicationNumber || 'Not assigned (Draft)'}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Filing Date</label>
                  <p className="text-white">{formatDate(selectedCopyright.filingDate)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Work Title</label>
                  <p className="text-white font-medium">{selectedCopyright.title}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Work Type</label>
                  <p className="text-white capitalize">{selectedCopyright.workType || 'Not specified'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Author Name</label>
                  <p className="text-white">{selectedCopyright.authorName}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Applicant Name</label>
                  <p className="text-white">{selectedCopyright.applicantName || 'Same as author'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Language</label>
                  <p className="text-white">{selectedCopyright.language || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Published</label>
                  <p className="text-white">
                    {selectedCopyright.isPublished ? (
                      <span className="text-green-400">✅ Yes</span>
                    ) : (
                      <span className="text-slate-400">❌ No</span>
                    )}
                  </p>
                </div>
              </div>

              {selectedCopyright.publicationDate && (
                <div>
                  <label className="text-slate-400 text-sm">Publication Date</label>
                  <p className="text-white">{formatDate(selectedCopyright.publicationDate)}</p>
                </div>
              )}

              {selectedCopyright.description && (
                <div>
                  <label className="text-slate-400 text-sm">Work Description</label>
                  <p className="text-white bg-slate-700 p-3 rounded mt-1">{selectedCopyright.description}</p>
                </div>
              )}

              {/* Files Section */}
              {selectedCopyright.files && selectedCopyright.files.length > 0 && (
                <div>
                  <label className="text-slate-400 text-sm">Uploaded Files ({selectedCopyright.files.length})</label>
                  <div className="mt-2 space-y-2">
                    {selectedCopyright.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-700 p-3 rounded">
                        <div className="flex items-center gap-3">
                          <div className="text-blue-400">📎</div>
                          <div>
                            <div className="text-white text-sm">{file.originalName}</div>
                            <div className="text-slate-400 text-xs">
                              {(file.size / 1024 / 1024).toFixed(2)} MB • {file.mimetype} • {formatDate(file.uploadDate)}
                            </div>
                          </div>
                        </div>
                        <a
                          href={`${backend_url}/${file.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm px-3 py-1 bg-blue-500/20 rounded transition-colors"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                <div>
                  <label className="text-slate-400 text-sm">Created</label>
                  <p className="text-slate-300 text-sm">{formatDate(selectedCopyright.createdAt)}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Last Updated</label>
                  <p className="text-slate-300 text-sm">{formatDate(selectedCopyright.updatedAt)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700">
                {selectedCopyright.status === 'submitted' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedCopyright._id, 'under-review')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Start Review
                  </button>
                )}
                {selectedCopyright.status === 'under-review' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(selectedCopyright._id, 'registered')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      ✅ Approve & Register
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedCopyright._id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      ❌ Reject Application
                    </button>
                  </>
                )}
                {selectedCopyright.status === 'rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedCopyright._id, 'submitted')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Resubmit for Review
                  </button>
                )}
                <button
                  onClick={() => handleDeleteCopyright(selectedCopyright._id)}
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
