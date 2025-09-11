export default function Header() {
    const handleLogout = () => {
      alert('Logging out... Redirecting to login page');
      window.location.href = '/login';
    };
  
    return (
      <div className="bg-slate-800 shadow-lg border-b border-slate-700 fixed w-full z-10">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">IPR Admin Dashboard</h1>
            <p className="text-slate-300 mt-1">Manage your intellectual property services</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  }