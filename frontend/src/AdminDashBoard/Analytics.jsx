import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// Circular chart component
const CircularChart = ({ value, total, label, type = 'success', size = 180, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const fillOffset = circumference * (1 - percentage / 100);
  
  const getColor = (chartType, percent) => {
    switch (chartType) {
      case 'success':
        if (percent >= 80) return '#10B981';
        if (percent >= 60) return '#3B82F6';
        if (percent >= 40) return '#F59E0B';
        return '#EF4444';
      case 'patents':
        return '#8B5CF6';
      case 'copyrights':
        return '#06B6D4';
      case 'pending':
        return '#F59E0B';
      default:
        return '#6B7280';
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

// Mini stat card
const StatCard = ({ icon, title, value, change, color = 'blue', subtitle }) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
  };
  
  return (
    <div className={`rounded-lg p-4 border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
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

// Chart container component
const ChartContainer = ({ title, children, className = "" }) => (
  <div className={`bg-slate-800 rounded-lg p-6 border border-slate-700 ${className}`}>
    <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
    {children}
  </div>
);

export default function Analytics() {
  const [data, setData] = useState({
    patents: [],
    copyrights: [],
    contacts: [],
    consultations: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls - replace with actual endpoints
      const responses = await Promise.all([
        fetch(`${backend_url}/api/patents`).catch(() => ({ json: () => ({ success: false, data: [] }) })),
        fetch(`${backend_url}/api/copyright`).catch(() => ({ json: () => ({ success: false, data: [] }) })),
        fetch(`${backend_url}/api/contacts`).catch(() => ({ json: () => ({ success: false, data: [] }) })),
        fetch(`${backend_url}/api/consultations`).catch(() => ({ json: () => ({ success: false, data: [] }) }))
      ]);

      const results = await Promise.all(responses.map(r => r.json()));
      
      setData({
        patents: results[0].success ? results[0].data : generateDemoPatentData(),
        copyrights: results[1].success ? results[1].data : generateDemoCopyrightData(),
        contacts: results[2].success ? results[2].data : generateDemoContactData(),
        consultations: results[3].success ? results[3].data : generateDemoConsultationData()
      });
      
      setError(results.some(r => !r.success) ? 'Some data unavailable - showing demo data' : null);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to load data - showing demo data');
      setData({
        patents: generateDemoPatentData(),
        copyrights: generateDemoCopyrightData(),
        contacts: generateDemoContactData(),
        consultations: generateDemoConsultationData()
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Demo data generators
  const generateDemoPatentData = () => {
    const categories = ['Technology', 'Pharmaceutical', 'Design', 'Chemical', 'Mechanical'];
    const statuses = ['granted', 'under-examination', 'submitted', 'rejected', 'draft'];
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: `P${String(i + 1).padStart(3, '0')}`,
      applicationNumber: `PAT-2024-${i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      submissionDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      processingTime: Math.floor(Math.random() * 180) + 30, // 30-210 days
      country: ['US', 'IN', 'EP', 'JP', 'CN'][Math.floor(Math.random() * 5)]
    }));
  };

  const generateDemoCopyrightData = () => {
    const categories = ['Literary', 'Musical', 'Artistic', 'Software', 'Dramatic'];
    const statuses = ['registered', 'under-review', 'submitted', 'rejected', 'draft'];
    
    return Array.from({ length: 35 }, (_, i) => ({
      id: `C${String(i + 1).padStart(3, '0')}`,
      applicationNumber: `COP-2024-${i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      submissionDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      processingTime: Math.floor(Math.random() * 90) + 15 // 15-105 days
    }));
  };

  const generateDemoContactData = () => {
    const subjects = ['Patent Inquiry', 'Copyright Question', 'Consultation Request', 'General Support', 'Technical Issue'];
    const regions = ['North America', 'Europe', 'Asia', 'South America', 'Africa'];
    
    return Array.from({ length: 120 }, (_, i) => ({
      id: i + 1,
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      responseTime: Math.floor(Math.random() * 48) + 1, // 1-48 hours
      status: ['responded', 'pending', 'closed'][Math.floor(Math.random() * 3)]
    }));
  };

  const generateDemoConsultationData = () => {
    const experts = ['Dr. Smith', 'Prof. Johnson', 'Ms. Williams', 'Mr. Brown'];
    const statuses = ['completed', 'scheduled', 'cancelled'];
    
    return Array.from({ length: 80 }, (_, i) => ({
      id: i + 1,
      expert: experts[Math.floor(Math.random() * experts.length)],
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      duration: [30, 45, 60, 90][Math.floor(Math.random() * 4)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      isRepeat: Math.random() > 0.7
    }));
  };

  // Data processing functions
  const getTimeSeriesData = (items, dateField = 'submissionDate') => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = {};
    
    items.forEach(item => {
      const date = new Date(item[dateField]);
      const key = `${months[date.getMonth()]} ${date.getFullYear()}`;
      monthlyData[key] = (monthlyData[key] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month + ' 1') - new Date(b.month + ' 1'));
  };

  const getCategoryData = (items, categoryField = 'category') => {
    const categories = {};
    items.forEach(item => {
      const cat = item[categoryField];
      categories[cat] = (categories[cat] || 0) + 1;
    });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  // Calculate statistics
  const patentStats = {
    total: data.patents.length,
    granted: data.patents.filter(p => p.status === 'granted').length,
    pending: data.patents.filter(p => ['submitted', 'under-examination'].includes(p.status)).length,
    avgProcessingTime: data.patents.reduce((sum, p) => sum + (p.processingTime || 0), 0) / data.patents.length || 0
  };

  const copyrightStats = {
    total: data.copyrights.length,
    registered: data.copyrights.filter(c => c.status === 'registered').length,
    pending: data.copyrights.filter(c => ['submitted', 'under-review'].includes(c.status)).length,
    avgProcessingTime: data.copyrights.reduce((sum, c) => sum + (c.processingTime || 0), 0) / data.copyrights.length || 0
  };

  const contactStats = {
    total: data.contacts.length,
    avgResponseTime: data.contacts.reduce((sum, c) => sum + (c.responseTime || 0), 0) / data.contacts.length || 0,
    pending: data.contacts.filter(c => c.status === 'pending').length
  };

  const consultationStats = {
    total: data.consultations.length,
    completed: data.consultations.filter(c => c.status === 'completed').length,
    avgDuration: data.consultations.reduce((sum, c) => sum + (c.duration || 0), 0) / data.consultations.length || 0,
    repeatClients: data.consultations.filter(c => c.isRepeat).length
  };

  // Chart data
  const trendData = getTimeSeriesData([
    ...data.patents.map(p => ({ ...p, type: 'Patent' })),
    ...data.copyrights.map(c => ({ ...c, type: 'Copyright' }))
  ]);

  const patentCategoryData = getCategoryData(data.patents);
  const copyrightCategoryData = getCategoryData(data.copyrights);
  const contactSubjectData = getCategoryData(data.contacts, 'subject');
  
  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">IP Analytics Dashboard</h2>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 bg-slate-700 text-white rounded-lg text-sm"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button
            onClick={fetchAnalyticsData}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4 mb-6">
          <p className="text-orange-300 text-sm">{error}</p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
        <StatCard 
          icon="📋" 
          title="Total Patents" 
          value={patentStats.total} 
          change={12}
          color="purple"
          subtitle={`${patentStats.granted} granted`}
        />
        <StatCard 
          icon="©️" 
          title="Total Copyrights" 
          value={copyrightStats.total} 
          change={8}
          color="cyan"
          subtitle={`${copyrightStats.registered} registered`}
        />
        <StatCard 
          icon="📞" 
          title="Contact Requests" 
          value={contactStats.total} 
          change={15}
          color="blue"
          subtitle={`${contactStats.pending} pending`}
        />
        <StatCard 
          icon="🤝" 
          title="Consultations" 
          value={consultationStats.total} 
          change={-5}
          color="green"
          subtitle={`${consultationStats.completed} completed`}
        />
        <StatCard 
          icon="⏱️" 
          title="Avg Response Time" 
          value={`${contactStats.avgResponseTime.toFixed(0)}h`} 
          change={-10}
          color="orange"
        />
        <StatCard 
          icon="🔄" 
          title="Repeat Clients" 
          value={consultationStats.repeatClients} 
          change={25}
          color="red"
        />
      </div>

      {/* Trend Analysis */}
      <ChartContainer title="Submission Trends Over Time" className="mb-8">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={{ fill: '#8B5CF6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Category Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartContainer title="Patent Categories">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={patentCategoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {patentCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Copyright Categories">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={copyrightCategoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {copyrightCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Contact Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartContainer title="Contact Request Subjects">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contactSubjectData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="#06B6D4" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Processing Time Analysis">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Patent Avg Processing Time</span>
              <span className="text-white font-semibold">{patentStats.avgProcessingTime.toFixed(0)} days</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((patentStats.avgProcessingTime / 180) * 100, 100)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Copyright Avg Processing Time</span>
              <span className="text-white font-semibold">{copyrightStats.avgProcessingTime.toFixed(0)} days</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-cyan-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((copyrightStats.avgProcessingTime / 90) * 100, 100)}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Contact Response Time</span>
              <span className="text-white font-semibold">{contactStats.avgResponseTime.toFixed(1)} hours</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((contactStats.avgResponseTime / 24) * 100, 100)}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Avg Consultation Duration</span>
              <span className="text-white font-semibold">{consultationStats.avgDuration.toFixed(0)} mins</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((consultationStats.avgDuration / 90) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </ChartContainer>
      </div>

      {/* Success Rate Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ChartContainer title="Patent Success Rate">
          <div className="flex justify-center">
            <CircularChart
              value={patentStats.granted}
              total={patentStats.total}
              label="Granted"
              type="success"
              size={200}
            />
          </div>
        </ChartContainer>

        <ChartContainer title="Copyright Success Rate">
          <div className="flex justify-center">
            <CircularChart
              value={copyrightStats.registered}
              total={copyrightStats.total}
              label="Registered"
              type="success"
              size={200}
            />
          </div>
        </ChartContainer>

        <ChartContainer title="Overall Portfolio Health">
          <div className="flex justify-center">
            <CircularChart
              value={patentStats.granted + copyrightStats.registered}
              total={patentStats.total + copyrightStats.total}
              label="Total Success"
              type="success"
              size={200}
            />
          </div>
        </ChartContainer>
      </div>
    </div>
  );
}
