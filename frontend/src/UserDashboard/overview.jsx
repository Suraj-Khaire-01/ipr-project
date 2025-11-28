import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
const backend_url = import.meta.env.VITE_BACKEND_URL;
export default function DashboardOverview({ dashboardData }) {
  const { user, isLoaded } = useUser();
  const [consultationStats, setConsultationStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [error, setError] = useState(null);

  // Fetch consultation stats and recent consultations
  const fetchConsultationData = async () => {
    if (!user || !user.id) {
      console.log('No user or user ID available');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching consultation data for user:', user.id);
      
      // Use the working endpoint to get all consultations
      const consultationsResponse = await fetch(`${backend_url}/api/consultations/user/${user.id}?limit=100`);
      
      if (!consultationsResponse.ok) {
        throw new Error(`Consultations API failed with status: ${consultationsResponse.status}`);
      }
      
      const consultationsResult = await consultationsResponse.json();
      console.log('Consultations API Response:', consultationsResult);
      
      if (consultationsResult.success) {
        const consultations = consultationsResult.data;
        setRecentConsultations(consultations);
        
        // Calculate counts manually from the consultations data
        const total = consultationsResult.pagination?.total || consultations.length;
        const pending = consultations.filter(c => c.status === 'pending').length;
        const confirmed = consultations.filter(c => c.status === 'confirmed').length;
        const completed = consultations.filter(c => c.status === 'completed').length;
        const cancelled = consultations.filter(c => c.status === 'cancelled').length;
        
        setConsultationStats({
          total,
          pending,
          confirmed,
          completed,
          cancelled
        });
        
        console.log('Calculated consultation stats:', {
          total,
          pending,
          confirmed,
          completed,
          cancelled
        });
      } else {
        throw new Error(consultationsResult.message || 'Failed to fetch consultations');
      }
    } catch (error) {
      console.error('Error fetching consultation data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchConsultationData();
    }
  }, [isLoaded, user]);

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

  const getCategoryStats = (items) => {
    const applied = items.filter(item => 
      ['submitted', 'applied', 'draft'].includes(item.status)
    ).length;
    
    const pending = items.filter(item => 
      ['pending', 'under-examination', 'under-review'].includes(item.status)
    ).length;
    
    const completed = items.filter(item => 
      ['granted', 'registered', 'completed', 'confirmed'].includes(item.status)
    ).length;

    return { applied, pending, completed };
  };

  // Combine all activities including fetched consultations
  const allActivities = [
    ...dashboardData.patents.map(p => ({ ...p, type: 'patent' })),
    ...dashboardData.copyrights.map(c => ({ ...c, type: 'copyright' })),
    ...recentConsultations.map(c => ({ ...c, type: 'consultation' }))
  ].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
   .slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-white/20 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-white/20 rounded w-1/3 mb-4"></div>
                <div className="flex gap-4">
                  <div className="h-3 bg-white/20 rounded w-1/4"></div>
                  <div className="h-3 bg-white/20 rounded w-1/4"></div>
                  <div className="h-3 bg-white/20 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <h3 className="text-red-400 font-bold mb-2">Error Loading Consultation Data</h3>
          <p className="text-red-300">{error}</p>
          <button 
            onClick={fetchConsultationData}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug Info - Remove this after testing */}
      {/* <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
        <h4 className="text-blue-400 font-bold text-sm">Debug Info:</h4>
        <p className="text-blue-300 text-xs">Consultations Found: {consultationStats.total}</p>
        <p className="text-blue-300 text-xs">Recent Consultations: {recentConsultations.length}</p>
      </div> */}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Patents</p>
              <p className="text-3xl font-bold text-white">{dashboardData.patents.length}</p>
            </div>
            <div className="text-4xl">🔬</div>
          </div>
          <div className="mt-4 flex gap-4 text-xs">
            <span className="text-blue-400">
              {getCategoryStats(dashboardData.patents).applied} applied
            </span>
            <span className="text-yellow-400">
              {getCategoryStats(dashboardData.patents).pending} pending
            </span>
            <span className="text-green-400">
              {getCategoryStats(dashboardData.patents).completed} completed
            </span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Copyrights</p>
              <p className="text-3xl font-bold text-white">{dashboardData.copyrights.length}</p>
            </div>
            <div className="text-4xl">©️</div>
          </div>
          <div className="mt-4 flex gap-4 text-xs">
            <span className="text-blue-400">
              {getCategoryStats(dashboardData.copyrights).applied} applied
            </span>
            <span className="text-yellow-400">
              {getCategoryStats(dashboardData.copyrights).pending} pending
            </span>
            <span className="text-green-400">
              {getCategoryStats(dashboardData.copyrights).completed} completed
            </span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Consultations</p>
              <p className="text-3xl font-bold text-white">{consultationStats.total}</p>
            </div>
            <div className="text-4xl">💬</div>
          </div>
          <div className="mt-4 flex gap-4 text-xs">
            <span className="text-yellow-400">
              {consultationStats.pending} pending
            </span>
            <span className="text-blue-400">
              {consultationStats.confirmed} confirmed
            </span>
            <span className="text-green-400">
              {consultationStats.completed} completed
            </span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Applications</p>
              <p className="text-3xl font-bold text-white">
                {dashboardData.patents.length + dashboardData.copyrights.length + consultationStats.total}
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
          <div className="mt-4">
            <span className="text-purple-400 text-sm">All IP applications & consultations</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {allActivities.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No recent activity found
            </div>
          ) : (
            allActivities.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">
                    {item.type === 'patent' ? '🔬' : item.type === 'copyright' ? '©️' : '💬'}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {item.inventionTitle || item.title || `${item.consultationType} Consultation - ${item.workType}`}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {formatDate(item.updatedAt || item.createdAt)} • 
                      <span className="capitalize ml-1">
                        {item.type}
                        {item.consultationId && ` • ${item.consultationId}`}
                        {item.applicationNumber && ` • ${item.applicationNumber}`}
                      </span>
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full border capitalize ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)} {item.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}