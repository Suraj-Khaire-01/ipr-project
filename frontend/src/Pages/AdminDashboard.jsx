import { useState } from "react";
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
      <Header />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 p-6 bg-gray-900">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}