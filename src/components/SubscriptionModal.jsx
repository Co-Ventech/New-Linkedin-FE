// import React, { useState, useEffect } from 'react';
// import { X } from 'lucide-react';

// const SubscriptionModal = ({ isOpen, onClose, company, onSubmit, loading }) => {
//   const [formData, setFormData] = useState({
//     plan: 'basic',
//     status: 'active',
//     quota: 100,
//     startDate: '',
//     endDate: ''
//   });

//   useEffect(() => {
//     if (company) {
//       setFormData({
//         plan: company.subscription?.plan || 'basic',
//         status: company.subscription?.status || 'active',
//         quota: company.subscription?.quota || 100,
//         startDate: company.subscription?.startDate ? new Date(company.subscription.startDate).toISOString().split('T')[0] : '',
//         endDate: company.subscription?.endDate ? new Date(company.subscription.endDate).toISOString().split('T')[0] : ''
//       });
//     }
//   }, [company]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(company.id, formData);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   if (!isOpen || !company) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Edit Subscription - {company.name}</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Subscription Plan
//             </label>
//             <select
//               name="plan"
//               value={formData.plan}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="basic">Basic</option>
//               <option value="pro">Professional</option>
//               <option value="enterprise">Enterprise</option>
//               <option value="custom">Custom</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Status
//             </label>
//             <select
//               name="status"
//               value={formData.status}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="active">Active</option>
//               <option value="suspended">Suspended</option>
//               <option value="expired">Expired</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Job Quota
//             </label>
//             <input
//               type="number"
//               name="quota"
//               value={formData.quota}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="100"
//               min="1"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Start Date
//             </label>
//             <input
//               type="date"
//               name="startDate"
//               value={formData.startDate}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               End Date
//             </label>
//             <input
//               type="date"
//               name="endDate"
//               value={formData.endDate}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//             >
//               {loading ? 'Updating...' : 'Update Subscription'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionModal; 

import React, { useEffect, useState } from 'react';

const SubscriptionModal = ({ isOpen, onClose, company, plans = [], onSubmit, loading }) => {
  const [form, setForm] = useState({
    subscriptionPlan: '',
    subscriptionStatus: 'active',
    jobsQuota: '',
    customEndDate: ''
  });

  useEffect(() => {
    if (company) {
      setForm({
        subscriptionPlan: company.subscriptionPlan || '',
        subscriptionStatus: company.subscriptionStatus || 'active',
        jobsQuota: company.jobsQuota?.toString() || '',
        customEndDate: company.subscriptionEndDate ? company.subscriptionEndDate.slice(0, 10) : ''
      });
    }
  }, [company]);

  if (!isOpen || !company) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(company._id || company.id, {
      subscriptionPlan: form.subscriptionPlan,
      subscriptionStatus: form.subscriptionStatus,
      jobsQuota: Number(form.jobsQuota),
      customEndDate: form.customEndDate
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Edit Subscription - {company.companyName || company.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
            <select
              value={form.subscriptionPlan}
              onChange={(e) => setForm({ ...form, subscriptionPlan: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="" disabled>Select plan</option>
              <option value="trial">Trial (Free - 7 days)</option>
                <option value="basic">Basic ($29/month)</option>
                <option value="premium">Premium ($99/month)</option>
                <option value="enterprise">Enterprise ($199/month)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.subscriptionStatus}
              onChange={(e) => setForm({ ...form, subscriptionStatus: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="active">Active</option>
              {/* <option value="paused">Paused</option> */}
              <option value="expired">Expired</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jobs Quota</label>
            <input
              type="number"
              min="1"
              value={form.jobsQuota}
              onChange={(e) => setForm({ ...form, jobsQuota: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom End Date (optional)</label>
            <input
              type="date"
              value={form.customEndDate}
              onChange={(e) => setForm({ ...form, customEndDate: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-md">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-md">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionModal;