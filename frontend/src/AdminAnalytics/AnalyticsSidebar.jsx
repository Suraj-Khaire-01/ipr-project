export default function AnalyticsSidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "contact", label: "📞 Contact" },
    { id: "patent", label: "📜 Patents" },
    { id: "copyright", label: "©️ Copyrights" },
    { id: "trademark", label: "™️ Trademarks" },
  ];

  return (
    <div className="w-64 bg-slate-800 p-6 border-r border-slate-700">
      <h2 className="text-xl font-bold mb-6">Analytics</h2>
      <ul className="space-y-3">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition 
                ${
                  activeTab === tab.id
                    ? "bg-slate-700 text-white font-semibold"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
