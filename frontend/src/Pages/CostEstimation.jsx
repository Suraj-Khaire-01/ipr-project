import React, { useState } from "react";

const CostEstimation = () => {
  const [patientName, setPatientName] = useState("");
  const [quantities, setQuantities] = useState({});
  const [estimatedCost, setEstimatedCost] = useState(0);

  // Example IPR registration costs (customize as per actual rates)
  const services = {
    patentFiling: 5000,
    trademarkFiling: 3000,
    copyrightRegistration: 2000,
  };

  const handleQuantityChange = (service, value) => {
    setQuantities((prev) => ({
      ...prev,
      [service]: Math.max(0, parseInt(value) || 0),
    }));
  };

  const calculateEstimate = () => {
    const total = Object.entries(services).reduce((sum, [service, cost]) => {
      return sum + (quantities[service] || 0) * cost;
    }, 0);
    setEstimatedCost(total);
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg my-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        IPR Registration Cost Estimation
      </h1>

      <div className="max-w-2xl mx-auto">
        <form className="space-y-6">
          {/* Applicant Name */}
          <div>
            <label
              htmlFor="applicantName"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Applicant Name:
            </label>
            <input
              type="text"
              id="applicantName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter applicant's name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Dynamic Services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(services).map(([service, cost]) => (
              <div key={service}>
                <label
                  htmlFor={service}
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  {service.replace(/([A-Z])/g, " $1")} (Cost: ₹{cost}):
                </label>
                <input
                  type="number"
                  id={service}
                  value={quantities[service] || 0}
                  onChange={(e) => handleQuantityChange(service, e.target.value)}
                  min="0"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            ))}
          </div>

          {/* Calculate Button */}
          <button
            type="button"
            onClick={calculateEstimate}
            className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Calculate Estimate
          </button>
        </form>

        {/* Result */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mt-10">
          Estimated Cost: ₹{estimatedCost}
        </h2>
        <p className="text-center text-gray-600 mt-4">
          This is a preliminary cost estimation for IPR services. 
          Please contact our team for detailed guidance.
        </p>
      </div>
    </div>
  );
};

export default CostEstimation;
