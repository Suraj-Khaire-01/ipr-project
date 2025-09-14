export default function DashboardOverview({ dashboardData }) {
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

  return (
    <div className="space-y-6">
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
              <p className="text-3xl font-bold text-white">{dashboardData.consultations.length}</p>
            </div>
            <div className="text-4xl">💬</div>
          </div>
          <div className="mt-4 flex gap-4 text-xs">
            <span className="text-blue-400">
              {getCategoryStats(dashboardData.consultations).applied} applied
            </span>
            <span className="text-yellow-400">
              {getCategoryStats(dashboardData.consultations).pending} pending
            </span>
            <span className="text-green-400">
              {getCategoryStats(dashboardData.consultations).completed} completed
            </span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Applications</p>
              <p className="text-3xl font-bold text-white">
                {dashboardData.patents.length + dashboardData.copyrights.length}
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
          <div className="mt-4">
            <span className="text-purple-400 text-sm">All IP applications</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[...dashboardData.patents, ...dashboardData.copyrights, ...dashboardData.consultations]
            .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
            .slice(0, 5)
            .map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">
                    {item.inventionTitle ? '🔬' : item.title ? '©️' : '💬'}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {item.inventionTitle || item.title || `${item.consultationType} - ${item.workType}`}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {formatDate(item.updatedAt || item.createdAt)}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full border capitalize ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)} {item.status}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
);
}