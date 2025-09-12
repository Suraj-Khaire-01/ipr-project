import React, { useState } from 'react';

const CostEstimation = () => {
  const [patientName, setPatientName] = useState('');
  const [service1Quantity, setService1Quantity] = useState(0);
  const [service2Quantity, setService2Quantity] = useState(0);
  const [service3Quantity, setService3Quantity] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState(0);

  const serviceCosts = {
    service1: 100,
    service2: 200,
    service3: 50,
  };

  const calculateEstimate = () => {
    const totalCost =
      (service1Quantity * serviceCosts.service1) +
      (service2Quantity * serviceCosts.service2) +
      (service3Quantity * serviceCosts.service3);
    setEstimatedCost(totalCost);
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg my-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Cost Estimation for Patients and Services</h1>
      <div className="max-w-2xl mx-auto">
        <form className="space-y-6">
          <div>
            <label htmlFor="patientName" className="block text-lg font-medium text-gray-700 mb-2">Patient Name:</label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter patient's name"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="service1" className="block text-lg font-medium text-gray-700 mb-2">Service 1 (Cost: ${serviceCosts.service1}):</label>
              <input
                type="number"
                id="service1"
                name="service1"
                value={service1Quantity}
                onChange={(e) => setService1Quantity(parseInt(e.target.value) || 0)}
                min="0"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="service2" className="block text-lg font-medium text-gray-700 mb-2">Service 2 (Cost: ${serviceCosts.service2}):</label>
              <input
                type="number"
                id="service2"
                name="service2"
                value={service2Quantity}
                onChange={(e) => setService2Quantity(parseInt(e.target.value) || 0)}
                min="0"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="service3" className="block text-lg font-medium text-gray-700 mb-2">Service 3 (Cost: ${serviceCosts.service3}):</label>
              <input
                type="number"
                id="service3"
                name="service3"
                value={service3Quantity}
                onChange={(e) => setService3Quantity(parseInt(e.target.value) || 0)}
                min="0"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={calculateEstimate}
            className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Calculate Estimate
          </button>
        </form>
        <h2 className="text-3xl font-bold text-center text-gray-900 mt-10">Estimated Cost: ${estimatedCost}</h2>
        <p className="text-center text-gray-600 mt-4">
          This is a basic estimation. For a more accurate quote, please contact our team.
          {/* Placeholder for AI-driven estimation: "Our AI-powered estimator can provide a more precise cost based on your specific needs." */}
        </p>
      </div>
    </div>
  );
};

export default CostEstimation;
