import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
const backend_url = import.meta.env.VITE_BACKEND_URL;
export default function DashboardConsultation({ handleView, handleDelete }) {
  const { user } = useUser();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch consultations for the current user
  const fetchConsultations = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${backend_url}/api/consultations/user/${user.id}`);
      const result = await response.json();
      
      if (result.success) {
        setConsultations(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
      setError('Failed to fetch consultations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConsultations();
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
      case 'confirmed': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
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
      case 'confirmed': return '🎯';
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

  const refreshConsultations = () => {
    fetchConsultations();
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Your Consultation Requests</h3>
          <button
            onClick={() => window.location.href = '/consulation'}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            + Book New Consultation
          </button>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-slate-400">Loading consultations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Your Consultation Requests</h3>
          <button
            onClick={() => window.location.href = '/consultation'}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            + Book New Consultation
          </button>
        </div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={refreshConsultations}
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
          <h3 className="text-xl font-bold text-white">Your Consultation Requests</h3>
          <p className="text-slate-400 text-sm mt-1">
            {consultations.length} consultation{consultations.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshConsultations}
            className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
            title="Refresh"
          >
            🔄
          </button>
          <button
            onClick={() => window.location.href = '/consultation'}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            + Book New Consultation
          </button>
        </div>
      </div>
      
      {consultations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-slate-400 mb-4">No consultation requests yet</p>
          <button
            onClick={() => window.location.href = '/consultation'}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            Book Your First Consultation
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {consultations.map((consultation) => (
            <div key={consultation._id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">💬</div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">
                        {consultation.consultationType?.charAt(0).toUpperCase() + consultation.consultationType?.slice(1)} Consultation - {consultation.workType?.charAt(0).toUpperCase() + consultation.workType?.slice(1)}
                      </h4>
                      <div className="flex gap-4 text-sm text-slate-400 mt-1">
                        <span>ID: {consultation.consultationId}</span>
                        <span>For: {consultation.fullName}</span>
                        {consultation.preferredDate && (
                          <span>{formatDate(consultation.preferredDate)} at {consultation.preferredTime}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs rounded-full border capitalize ${getStatusColor(consultation.status)}`}>
                    {getStatusIcon(consultation.status)} {consultation.status}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleView(consultation, 'consultations')}
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded text-xs transition-colors"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleDelete(consultation._id, 'consultations')}
                      className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              {consultation.description && (
                <div className="mt-3 pl-12">
                  <p className="text-slate-300 text-sm bg-white/5 p-3 rounded-lg">
                    {consultation.description.length > 200 
                      ? `${consultation.description.substring(0, 200)}...` 
                      : consultation.description}
                  </p>
                </div>
              )}
              <div className="mt-3 pl-12 flex gap-4 text-xs text-slate-400">
                <span>Created: {formatDate(consultation.createdAt)}</span>
                {consultation.updatedAt && consultation.updatedAt !== consultation.createdAt && (
                  <span>Updated: {formatDate(consultation.updatedAt)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}