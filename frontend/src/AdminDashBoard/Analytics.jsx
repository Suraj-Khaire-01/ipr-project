import { useEffect, useState } from 'react';

// Circular chart component similar to AttendanceChart
const CircularChart = ({ value, total, label, type = 'success', size = 180, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const fillOffset = circumference * (1 - percentage / 100);
  
  const getColor = (chartType, percent) => {
    switch (chartType) {
      case 'success':
        if (percent >= 80) return '#10B981'; // Green
        if (percent >= 60) return '#3B82F6'; // Blue
        if (percent >= 40) return '#F59E0B'; // Yellow
        return '#EF4444'; // Red
      case 'patents':
        return '#8B5CF6'; // Purple for patents
      case 'copyrights':
        return '#06B6D4'; // Cyan for copyrights
      case 'pending':
        return '#F59E0B'; // Orange for pending
      default:
        return '#6B7280'; // Gray
    }
  };
  
  const color = getColor(type, percentage);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#374151"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={fillOffset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{value}</span>
          <span className="text-3xl font-bold text-white">/{total}</span>
          <span className="text-sm text-slate-400 mt-1">{label}</span>
          <span className="text-xs text-slate-500">{percentage.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

// Status distribution chart
const StatusChart = ({ data, title, type }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.count / total) * 100 : 0;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-sm text-slate-300 capitalize">{item.status.replace('-', ' ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{item.count}</span>
                <span className="text-xs text-slate-500">({percentage.toFixed(1)}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Mini stat card
const StatCard = ({ icon, title, value, change, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400'
  };
  
  return (
    <div className={`rounded-lg p-4 border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change !== undefined && (
            <p className={`text-xs ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change >= 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
};

export default function Analytics() {
  const [patentData, setPatentData] = useState([]);
  const [copyrightData, setCopyrightData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [patentResponse, copyrightResponse] = await Promise.all([
        fetch('http://localhost:3001/api/patents').catch(() => ({ json: () => ({ success: false, data: [] }) })),
        fetch('http://localhost:3001/api/copyright').catch(() => ({ json: () => ({ success: false, data: [] }) }))
      ]);

      const patentResult = await patentResponse.json();
      const copyrightResult = await copyrightResponse.json();

      if (patentResult.success) setPatentData(patentResult.data || []);
      if (copyrightResult.success) setCopyrightData(copyrightResult.data || []);
      
      setError(null);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to load analytics data');
      // Set demo data for display
      setPatentData([
        { status: 'granted', applicationNumber: 'P001' },
        { status: 'under-examination', applicationNumber: 'P002' },
        { status: 'submitted', applicationNumber: 'P003' },
        { status: 'draft', applicationNumber: 'P004' }
      ]);
      setCopyrightData([
        { status: 'registered', applicationNumber: 'C001' },
        { status: 'under-review', applicationNumber: 'C002' },
        { status: 'submitted', applicationNumber: 'C003' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate patent statistics
  const patentStats = {
    total: patentData.length,
    granted: patentData.filter(p => p.status === 'granted').length,
    pending: patentData.filter(p => ['submitted', 'under-examination'].includes(p.status)).length,
    rejected: patentData.filter(p => p.status === 'rejected').length,
    draft: patentData.filter(p => p.status === 'draft').length
  };

  // Calculate copyright statistics  
  const copyrightStats = {
    total: copyrightData.length,
    registered: copyrightData.filter(c => c.status === 'registered').length,
    pending: copyrightData.filter(c => ['submitted', 'under-review'].includes(c.status)).length,
    rejected: copyrightData.filter(c => c.status === 'rejected').length,
    draft: copyrightData.filter(c => c.status === 'draft').length
  };

  const patentStatusData = [
    { status: 'granted', count: patentStats.granted, color: 'bg-green-500' },
    { status: 'under-examination', count: patentStats.pending, color: 'bg-yellow-500' },
    { status: 'submitted', count: patentData.filter(p => p.status === 'submitted').length, color: 'bg-blue-500' },
    { status: 'rejected', count: patentStats.rejected, color: 'bg-red-500' },
    { status: 'draft', count: patentStats.draft, color: 'bg-gray-500' }
  ].filter(item => item.count > 0);

  const copyrightStatusData = [
    { status: 'registered', count: copyrightStats.registered, color: 'bg-green-500' },
    { status: 'under-review', count: copyrightStats.pending, color: 'bg-yellow-500' },
    { status: 'submitted', count: copyrightData.filter(c => c.status === 'submitted').length, color: 'bg-blue-500' },
    { status: 'rejected', count: copyrightStats.rejected, color: 'bg-red-500' },
    { status: 'draft', count: copyrightStats.draft, color: 'bg-gray-500' }
  ].filter(item => item.count > 0);

  if (isLoading) {
    return (
      <div className="p-6 mt-22 ml-65">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-22 ml-65">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">IP Analytics Dashboard</h2>
        <button
          onClick={fetchAnalyticsData}
          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4 mb-6">
          <p className="text-orange-300 text-sm">{error} - Showing demo data</p>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon="📋" 
          title="Total Patents" 
          value={patentStats.total} 
          change={12}
          color="purple"
        />
        <StatCard 
          icon="©️" 
          title="Total Copyrights" 
          value={copyrightStats.total} 
          change={8}
          color="blue"
        />
        <StatCard 
          icon="✅" 
          title="Total Granted/Registered" 
          value={patentStats.granted + copyrightStats.registered} 
          change={15}
          color="green"
        />
        <StatCard 
          icon="⏳" 
          title="Pending Applications" 
          value={patentStats.pending + copyrightStats.pending} 
          change={-5}
          color="orange"
        />
      </div>

      {/* Circular Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Patent Applications</h3>
          <div className="grid grid-cols-2 gap-6">
            <CircularChart
              value={patentStats.granted}
              total={patentStats.total}
              label="Granted"
              type="success"
            />
            <CircularChart
              value={patentStats.pending}
              total={patentStats.total}
              label="Pending"
              type="pending"
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-slate-400 text-sm">
              Success Rate: {patentStats.total > 0 ? ((patentStats.granted / patentStats.total) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Copyright Applications</h3>
          <div className="grid grid-cols-2 gap-6">
            <CircularChart
              value={copyrightStats.registered}
              total={copyrightStats.total}
              label="Registered"
              type="success"
            />
            <CircularChart
              value={copyrightStats.pending}
              total={copyrightStats.total}
              label="Pending"
              type="pending"
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-slate-400 text-sm">
              Success Rate: {copyrightStats.total > 0 ? ((copyrightStats.registered / copyrightStats.total) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <StatusChart 
          data={patentStatusData}
          title="Patent Status Distribution"
          type="patents"
        />
        <StatusChart 
          data={copyrightStatusData}
          title="Copyright Status Distribution"
          type="copyrights"
        />
      </div>

      {/* Combined Overview */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-6 text-center">Overall IP Portfolio</h3>
        <div className="flex justify-center">
          <CircularChart
            value={patentStats.granted + copyrightStats.registered}
            total={patentStats.total + copyrightStats.total}
            label="Total Success"
            type="success"
            size={220}
            strokeWidth={16}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{patentStats.total}</div>
            <div className="text-sm text-slate-400">Patents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{copyrightStats.total}</div>
            <div className="text-sm text-slate-400">Copyrights</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{patentStats.granted + copyrightStats.registered}</div>
            <div className="text-sm text-slate-400">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{patentStats.pending + copyrightStats.pending}</div>
            <div className="text-sm text-slate-400">Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
}