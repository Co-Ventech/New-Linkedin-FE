import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { companySignup } from '../api/authApi';

const CompanySignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    companyDescription: '',
    adminUsername: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',
    adminPhone: '',
    adminLocation: '',
    pipelineMode: 'default'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.adminPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.adminPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail);
    if (!emailOk) {
      setError('Please enter a valid admin email address');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...signupData } = formData;
      const result = await companySignup(signupData);

      if (result.success) {
        setSuccess('Company registered successfully! You can now login with your admin credentials.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const msg = result.error || 'Company registration failed';
        const friendly = msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate')
          ? 'An account with this admin email already exists. Please sign in or use a different email.'
          : msg;
        setError(friendly);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register Your Company
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create a new company account with admin access
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Company Description
              </label>
              <textarea
                id="companyDescription"
                name="companyDescription"
                rows="3"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Brief description of your company"
                value={formData.companyDescription}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="adminUsername" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Username
              </label>
              <input
                id="adminUsername"
                name="adminUsername"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Admin username"
                value={formData.adminUsername}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                id="adminEmail"
                name="adminEmail"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Admin email address"
                value={formData.adminEmail}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Password
              </label>
              <input
                id="adminPassword"
                name="adminPassword"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Admin password"
                value={formData.adminPassword}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirm admin password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="adminPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Phone
              </label>
              <input
                id="adminPhone"
                name="adminPhone"
                type="tel"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="+1-555-123-4567"
                value={formData.adminPhone}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="adminLocation" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Location
              </label>
              <input
                id="adminLocation"
                name="adminLocation"
                type="text"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="City, Country"
                value={formData.adminLocation}
                onChange={handleInputChange}
              />
            </div>

            {/* <div className="mb-2">
              <label htmlFor="pipelineMode" className="block text-sm font-medium text-gray-700 mb-1">
                Pipeline Mode
              </label>
              <select
                id="pipelineMode"
                name="pipelineMode"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.pipelineMode}
                onChange={handleInputChange}
              >
                <option value="default">Default</option>
              </select>
            </div> */}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-md">
              {success}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Company...' : 'Create Company Account'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-blue-600 hover:text-blue-500 text-sm">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySignup; 