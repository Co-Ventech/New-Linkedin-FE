import React, { useState, useEffect } from 'react';
import { X, Check, XCircle } from 'lucide-react';

const JobDistributionModal = ({ isOpen, onClose, batch, companies, onSubmit, loading }) => {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [strategy, setStrategy] = useState('even');
  const [distribution, setDistribution] = useState({});

  useEffect(() => {
    if (batch && companies) {
      // Initialize distribution based on strategy
      updateDistribution();
    }
  }, [batch, companies, strategy, selectedCompanies]);

  const updateDistribution = () => {
    if (!batch || selectedCompanies.length === 0) {
      setDistribution({});
      return;
    }

    const totalJobs = batch.count || 0;
    const companyCount = selectedCompanies.length;
    
    if (strategy === 'even') {
      const jobsPerCompany = Math.floor(totalJobs / companyCount);
      const remainder = totalJobs % companyCount;
      
      const newDistribution = {};
      selectedCompanies.forEach((company, index) => {
        newDistribution[company.id] = jobsPerCompany + (index < remainder ? 1 : 0);
      });
      setDistribution(newDistribution);
    } else if (strategy === 'round_robin') {
      const newDistribution = {};
      selectedCompanies.forEach((company, index) => {
        newDistribution[company.id] = Math.ceil(totalJobs / companyCount);
      });
      setDistribution(newDistribution);
    }
  };

  const toggleCompany = (companyId) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCompanies.length === 0) return;
    
    const distributionData = {
      batchId: batch.id,
      companyIds: selectedCompanies,
      strategy,
      distribution
    };
    
    onSubmit(distributionData);
  };

  if (!isOpen || !batch) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Distribute Job Batch</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Batch Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">ID:</span> {batch.id}
            </div>
            <div>
              <span className="font-medium">Platform:</span> {batch.platform}
            </div>
            <div>
              <span className="font-medium">Keywords:</span> {batch.keywords}
            </div>
            <div>
              <span className="font-medium">Total Jobs:</span> {batch.count}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distribution Strategy
            </label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="even">Even Distribution</option>
              <option value="round_robin">Round Robin</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {strategy === 'even' 
                ? 'Distribute jobs evenly across selected companies' 
                : 'Distribute jobs in round-robin fashion'
              }
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Companies
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {companies.map(company => (
                <div key={company.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={`company-${company.id}`}
                    checked={selectedCompanies.includes(company.id)}
                    onChange={() => toggleCompany(company.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`company-${company.id}`} className="flex-1 cursor-pointer">
                    <div className="font-medium">{company.companyName || company.name}</div>
                    <div className="text-sm text-gray-500">
                      Quota: {company.subscription?.quota || 'Unlimited'}
                    </div>
                  </label>
                  {distribution[company.id] && (
                    <span className="text-sm font-medium text-blue-600">
                      {distribution[company.id]} jobs
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {selectedCompanies.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Distribution Preview</h4>
              <div className="space-y-2">
                {selectedCompanies.map(companyId => {
                  const company = companies.find(c => c.id === companyId);
                  const jobCount = distribution[companyId] || 0;
                  return (
                    <div key={companyId} className="flex justify-between items-center">
                      <span className="text-sm">{company?.companyName || company?.name}</span>
                      <span className="text-sm font-medium text-blue-600">
                        {jobCount} jobs
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedCompanies.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Distributing...' : 'Distribute Jobs'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobDistributionModal; 