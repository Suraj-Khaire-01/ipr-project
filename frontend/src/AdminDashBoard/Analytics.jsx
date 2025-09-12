import { useState } from "react";
import AnalyticsSidebar from "../AdminAnalytics/AnalyticsSidebar";
import ContactAnalytics from "../AdminAnalytics/ContactAnalytics";
import PatentAnalytics from "../AdminAnalytics/PatentAnalytics";
import CopyrightAnalytics from "../AdminAnalytics/CopyrightAnalytics";
import TrademarksAnalytics from "../AdminAnalytics/TrademarksAnalytics";

export default function Analytics() {
  const [activeService, setActiveService] = useState("contact");

  const renderContent = () => {
    switch (activeService) {
      case "contact":
        return <ContactAnalytics />;
      case "patents":
        return <PatentAnalytics />;
      case "copyrights":
        return <CopyrightAnalytics />;
      case "trademarks":
        return <TrademarksAnalytics />;
      default:
        return <div className="text-slate-400">Select a service to view analytics</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar for services */}
      <AnalyticsSidebar activeService={activeService} setActiveService={setActiveService} />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-900">{renderContent()}</div>
    </div>
  );
}
