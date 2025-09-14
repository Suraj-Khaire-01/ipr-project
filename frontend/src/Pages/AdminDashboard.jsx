import { useState, useEffect } from "react";
import Sidebar from "../AdminDashBoard/Sidebar";
import Header from "../AdminDashBoard/Header";
import ContactRequests from "../AdminDashBoard/ContactRequests";
import ConsultationRequests from "../AdminDashBoard/ConsultationRequests";
import Patents from "../AdminDashBoard/Patents";
import Copyrights from "../AdminDashBoard/Copyrights";
import Trademarks from "../AdminDashBoard/Trademarks";
import Analytics from "../AdminDashBoard/Analytics";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('contact');
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    // Get admin data from localStorage/sessionStorage
    const getAdminData = () => {
      try {
        const adminInfo = localStorage.getItem('adminInfo') || sessionStorage.getItem('adminInfo');
        if (adminInfo) {
          setAdminData(JSON.parse(adminInfo));
        }
        console.log('AdminDashboard mounted, admin authenticated');
      } catch (error) {
        console.error('Error parsing admin data:', error);
      }
    };

    getAdminData();
  }, []);

  // Render the appropriate component based on activeTab
  const renderContent = () => {
    switch(activeTab) {
      case 'contact':
        return <ContactRequests />;
      case 'consultation':
        return <ConsultationRequests />;
      case 'patents':
        return <Patents />;
      case 'copyrights':
        return <Copyrights />;
      case 'trademarks':
        return <Trademarks />;
      case 'analytics':
        return <Analytics />;
      default:
        return <ContactRequests />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header adminData={adminData} />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 p-6 bg-gray-900">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}