import { useState, useEffect } from "react";

export default function CopyrightAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const res = await fetch("/api/analytics/contact/overview");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    }
    fetchOverview();
  }, []);

  return (
    <div className="bg-slate-900 min-h-screen p-8 text-white">
      <h2 className="text-3xl font-bold mb-6">Contact Requests Analytics</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Total Requests" value={data?.total || "--"} />
        <KpiCard title="Pending" value={data?.pending || "--"} />
        <KpiCard title="Responded" value={data?.responded || "--"} />
        <KpiCard
          title="Avg Response Time"
          value={data?.avgResponseTime || "--"}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartBox title="📈 Requests Over Time" />
        <ChartBox title="🥧 Service Type Distribution" />
        <ChartBox title="🔄 Status Distribution" />
        <ChartBox title="⏱ Response Time Trend" />
      </div>
    </div>
  );
}

function KpiCard({ title, value }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 text-center shadow-md">
      <h4 className="text-sm text-slate-400">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ChartBox({ title }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 h-64 flex items-center justify-center shadow-md">
      {title}
    </div>
  );
}
