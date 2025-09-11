export default function Sidebar({ activeTab, setActiveTab }) {
    // You can remove the Link imports and onClick handlers since we're not using routing
    
    const menuItems = [
      { id: 'contact', label: 'Contact Requests', icon: '📧'},
      { id: 'consultation', label: 'Consultation Requests', icon: '💬'},
      { id: 'patents', label: 'Patent Applications', icon: '📜' },
      { id: 'trademarks', label: 'Trademark Registrations', icon: '®️' },
      { id: 'copyrights', label: 'Copyrights', icon: '©️' },
      { id: 'analytics', label: 'Analytics', icon: '📊' },
    ];
  
    return (
      <div className="w-64 bg-slate-800 shadow-lg min-h-screen border-r border-slate-700 fixed mt-22">
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex justify-between items-center ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span>{item.icon} {item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }