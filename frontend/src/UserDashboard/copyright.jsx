import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";

export default function DashboardCopyright({ handleView, handleDelete, handleDownload }) {
  const { user } = useUser();
  const [copyrights, setCopyrights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch copyrights for the current user
  const fetchCopyrights = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3001/api/copyright/user/${user.id}`);
      const result = await response.json();
      
      if (result.success) {
        setCopyrights(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error fetching copyrights:', error);
      setError('Failed to fetch copyright applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCopyrights();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'submitted': 
      case 'applied': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'under-examination':
      case 'under-review': 
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'granted':
      case 'registered': 
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rejected': 
      case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'published': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return '📝';
      case 'submitted': 
      case 'applied': return '📤';
      case 'under-examination':
      case 'under-review': 
      case 'pending': return '🔍';
      case 'granted':
      case 'registered': 
      case 'completed': return '✅';
      case 'rejected': 
      case 'cancelled': return '❌';
      case 'published': return '📖';
      default: return '📄';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const refreshCopyrights = () => {
    fetchCopyrights();
  };

  const handleDownloadCertificate = async (copyrightId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/copyright/${copyrightId}/certificate`);
      const data = await response.json();

      if (data.success && data.certificateUrl) {
        window.open(data.certificateUrl, '_blank');
      } else {
        alert('Certificate not available yet or still processing');
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Error downloading certificate');
    }
  };

  const handleDeleteCopyright = async (copyrightId) => {
    if (!window.confirm('Are you sure you want to delete this copyright application?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/copyright/${copyrightId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clerkUserId: user.id })
      });

      const data = await response.json();

      if (data.success) {
        setCopyrights(prev => prev.filter(copyright => copyright._id !== copyrightId));
        if (handleDelete) handleDelete(copyrightId, 'copyrights');
      } else {
        alert(data.message || 'Failed to delete copyright application');
      }
    } catch (error) {
      console.error('Error deleting copyright:', error);
      alert('Error deleting copyright application');
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Your Copyright Applications</h3>
          <button
            onClick={() => window.location.href = '/copyright'}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            + Register New Copyright
          </button>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-slate-400">Loading copyright applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Your Copyright Applications</h3>
          <button
            onClick={() => window.location.href = '/copyright'}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            + Register New Copyright
          </button>
        </div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={refreshCopyrights}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Your Copyright Applications</h3>
          <p className="text-slate-400 text-sm mt-1">
            {copyrights.length} copyright application{copyrights.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshCopyrights}
            className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
            title="Refresh"
          >
            🔄
          </button>
          <button
            onClick={() => window.location.href = '/copyright'}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            + Register New Copyright
          </button>
        </div>
      </div>
      
      {copyrights.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">©️</div>
          <p className="text-slate-400 mb-4">No copyright applications yet</p>
          <button
            onClick={() => window.location.href = '/copyright'}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            Register Your First Copyright
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {copyrights.map((copyright) => (
            <div key={copyright._id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">©️</div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">
                        {copyright.title}
                      </h4>
                      <div className="flex gap-4 text-sm text-slate-400 mt-1">
                        <span>App No: {copyright.applicationNumber || 'Pending'}</span>
                        <span>By: {copyright.authorName}</span>
                        <span>Type: {copyright.workType?.charAt(0).toUpperCase() + copyright.workType?.slice(1) || 'Not specified'}</span>
                        {copyright.filingDate && (
                          <span>Filed: {formatDate(copyright.filingDate)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs rounded-full border capitalize ${getStatusColor(copyright.status)}`}>
                    {getStatusIcon(copyright.status)} {copyright.status}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleView(copyright, 'copyrights')}
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded text-xs transition-colors"
                    >
                      View
                    </button>
                    {['registered', 'published', 'granted', 'approved'].includes(copyright.status) && (
                      <button 
                        onClick={() => handleDownloadCertificate(copyright._id)}
                        className="px-3 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded text-xs transition-colors"
                      >
                        Certificate
                      </button>
                    )}
                    {copyright.status === 'draft' && (
                      <button 
                        onClick={() => handleDeleteCopyright(copyright._id)}
                        className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {copyright.description && (
                <div className="mt-3 pl-12">
                  <p className="text-slate-300 text-sm bg-white/5 p-3 rounded-lg">
                    {copyright.description.length > 200 
                      ? `${copyright.description.substring(0, 200)}...` 
                      : copyright.description}
                  </p>
                </div>
              )}
              <div className="mt-3 pl-12 flex gap-4 text-xs text-slate-400">
                <span>Created: {formatDate(copyright.createdAt)}</span>
                {copyright.updatedAt && copyright.updatedAt !== copyright.createdAt && (
                  <span>Updated: {formatDate(copyright.updatedAt)}</span>
                )}
                {copyright.language && (
                  <span>Language: {copyright.language}</span>
                )}
                {copyright.isPublished && (
                  <span className="text-green-400">Published Work</span>
                )}
              </div>
              {copyright.files && copyright.files.length > 0 && (
                <div className="mt-3 pl-12">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>📎 {copyright.files.length} file{copyright.files.length !== 1 ? 's' : ''} attached</span>
                    {copyright.files.slice(0, 2).map((file, index) => (
                      <span key={index} className="bg-white/10 px-2 py-1 rounded">
                        {file.originalName}
                      </span>
                    ))}
                    {copyright.files.length > 2 && (
                      <span className="bg-white/10 px-2 py-1 rounded">
                        +{copyright.files.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}