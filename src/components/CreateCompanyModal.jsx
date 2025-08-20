// import React, { useState } from 'react';
// import { X } from 'lucide-react';

// const CreateCompanyModal = ({ isOpen, onClose, onSubmit, loading }) => {
//   const [formData, setFormData] = useState({
//     companyName: '',
//     companyDescription: '',
//     adminEmail: ''
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Create New Company</h2>
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
//               Company Name *
//             </label>
//             <input
//               type="text"
//               name="companyName"
//               required
//               value={formData.companyName}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter company name"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Company Description
//             </label>
//             <textarea
//               name="companyDescription"
//               value={formData.companyDescription}
//               onChange={handleInputChange}
//               rows="3"
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Brief description of the company"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Admin Email *
//             </label>
//             <input
//               type="email"
//               name="adminEmail"
//               required
//               value={formData.adminEmail}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="admin@company.com"
//             />
//           </div>

//           <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
//             <p className="text-sm text-blue-800">
//               <strong>Note:</strong> A temporary password will be sent to the admin email address. 
//               The company admin can then log in and reset their password.
//             </p>
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
//               {loading ? 'Creating...' : 'Create Company'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateCompanyModal;

import React, { useEffect, useState } from 'react';

const CreateCompanyModal = ({ isOpen, onClose, onSubmit, loading, plans = [] }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    adminEmail: '',
    subscriptionPlan: '',
    jobsQuota: ''
  });

  useEffect(() => {
    if (!isOpen) {
      setForm({ name: '', description: '', adminEmail: '', subscriptionPlan: '', jobsQuota: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: form.name,
      description: form.description,
      adminEmail: form.adminEmail,
      subscriptionPlan: form.subscriptionPlan,
      jobsQuota: form.jobsQuota ? Number(form.jobsQuota) : undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Create Company</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
            <input
              type="email"
              value={form.adminEmail}
              onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Plan (optional)</label>
              <select
                value={form.subscriptionPlan}
                onChange={(e) => setForm({ ...form, subscriptionPlan: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select plan</option>
                {plans.map(p => (
                  <option key={p.id || p._id} value={p.name}>{p.displayName || p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jobs Quota (optional)</label>
              <input
                type="number"
                min="1"
                value={form.jobsQuota}
                onChange={(e) => setForm({ ...form, jobsQuota: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-md">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-md">
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCompanyModal;