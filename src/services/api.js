import axios from 'axios';

const REMOTE_HOST = import.meta.env.VITE_REMOTE_HOST;
const API_BASE = `${REMOTE_HOST}/api`;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Company API
export const companyAPI = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_BASE}/companies`, {
        headers: getAuthHeaders()
      });
      // Normalize to always return an array of companies
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.companies)) return data.companies;
      if (Array.isArray(data?.data)) return data.data;
      return [];
    } catch (error) {
      console.error('Companies fetch error:', error.response?.status, error.message);
      return [];
    }
  },

  create: async (companyData) => {
    try {
      const response = await axios.post(`${API_BASE}/companies`, companyData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create company');
    }
  },

  update: async (companyId, updateData) => {
    try {
      const response = await axios.put(`${API_BASE}/companies/${companyId}`, updateData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update company');
    }
  },

  delete: async (companyId) => {
    try {
      const response = await axios.delete(`${API_BASE}/companies/${companyId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete company');
    }
  },

  getById: async (companyId) => {
    try {
      const response = await axios.get(`${API_BASE}/companies/${companyId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch company');
    }
  }
};


// Master Job API with exact endpoints
export const masterJobAPI = {
  uploadScoredJobs: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE}/jobadmin/upload`, formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload scored jobs');
    }
  },
    // Add this missing function
    getMasterJobs: async (filters = {}) => {
      try {
        const params = new URLSearchParams();
        if (filters.status && filters.status !== 'all') params.append('status', filters.status);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
  
        const response = await axios.get(`${API_BASE}/jobadmin?${params.toString()}`, {
          headers: getAuthHeaders()
        });
        return response.data;
      } catch (error) {
        console.error('Master jobs fetch error:', error.response?.status, error.message);
        return { jobs: [], total: 0, page: 1 };
      }
    },

  getJobBatches: async () => {
    try {
      const response = await axios.get(`${API_BASE}/jobadmin/batches`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Batches fetch error:', error.response?.status, error.message);
      return { batches: [], pagination: { current: 1, pages: 1, total: 0, hasNext: false, hasPrev: false } };
    }
  },

  getBatchDetails: async (batchId) => {
    try {
      const response = await axios.get(`${API_BASE}/jobadmin/batches/${batchId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch batch details');
    }
  },

  deleteBatch: async (batchId) => {
    try {
      const response = await axios.delete(`${API_BASE}/jobadmin/batches/${batchId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete batch');
    }
  },

  distributeBatch: async (batchId, distributionData) => {
    try {
      const response = await axios.post(`${API_BASE}/jobadmin/distribute/batch/${batchId}`, distributionData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to distribute batch');
    }
  },

  distributeBatchToCompanies: async (batchId, companyIds) => {
    try {
      const response = await axios.post(`${API_BASE}/jobadmin/distribute/batch/${batchId}/companies`, { companyIds }, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to distribute batch to companies');
    }
  },

  distributeAll: async () => {
    try {
      const response = await axios.post(`${API_BASE}/jobadmin/distribute/all`, {}, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to distribute all jobs');
    }
  },

  distributeToCompanies: async (companyIds) => {
    try {
      const response = await axios.post(`${API_BASE}/jobadmin/distribute/companies`, { companyIds }, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to distribute to companies');
    }
  },

  getDistributionStats: async () => {
    try {
      const response = await axios.get(`${API_BASE}/jobadmin/distribute/stats`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Distribution stats error:', error.response?.status, error.message);
      return { data: { distributedJobs: 0, undistributedJobs: 0, totalBatches: 0 } };
    }
  },

  getJobDetails: async (jobId) => {
    try {
      const response = await axios.get(`${API_BASE}/jobadmin/jobs/${jobId}/details`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch job details');
    }
  },

  // Legacy methods for backward compatibility
  scrape: async (scrapeData) => {
    try {
      const response = await axios.post(`${API_BASE}/jobs/scrape`, scrapeData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to scrape jobs');
    }
  },

  distributeBatchLegacy: async (distributionData) => {
    try {
      const response = await axios.post(`${API_BASE}/jobs/distribute`, distributionData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to distribute batch');
    }
  },

  getBatchById: async (batchId) => {
    try {
      const response = await axios.get(`${API_BASE}/jobs/batches/${batchId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch batch');
    }
  }
};

// Subscription API
export const subscriptionAPI = {
  getStats: async () => {
    try {
      const response = await axios.get(`${API_BASE}/subscriptions/stats`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Stats fetch error:', error.response?.status, error.message);
      return { 
        totalSubscriptions: 0, 
        activeSubscriptions: 0, 
        revenue: 0.00,
        planBreakdown: {}
      };
    }
  },

  getAllPlans: async () => {
    try {
      const response = await axios.get(`${API_BASE}/subscriptions/plans`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Plans fetch error:', error.response?.status, error.message);
      return [];
    }
  },

  getPlanById: async (identifier) => {
    try {
      const response = await axios.get(`${API_BASE}/subscriptions/plans/${identifier}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch plan');
    }
  },

  createPlan: async (planData) => {
    try {
      const response = await axios.post(`${API_BASE}/subscriptions/plans`, {
        name: planData.name,
        displayName: planData.displayName,
        description: planData.description,
        price: parseFloat(planData.price),
        duration: parseInt(planData.duration),
        jobsQuota: parseInt(planData.jobsQuota),
        features: planData.features || []
      }, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to create subscription plan');
    }
  },


  updatePlan: async (planId, updateData) => {
    try {
      const response = await axios.put(`${API_BASE}/subscriptions/plans/${planId}`, updateData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update subscription plan');
    }
  },

  deletePlan: async (planId) => {
    try {
      const response = await axios.delete(`${API_BASE}/subscriptions/plans/${planId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete subscription plan');
    }
  },

  updateSubscription: async (companyId, subscriptionData) => {
    try {
      const payload = {
        subscriptionPlan: subscriptionData.subscriptionPlan,
        subscriptionStatus: subscriptionData.subscriptionStatus,
        jobsQuota: Number(subscriptionData.jobsQuota),
        ...(subscriptionData.customEndDate ? { customEndDate: subscriptionData.customEndDate } : {})
      };

      const response = await axios.put(
        `${API_BASE}/companies/${companyId}/subscription`,
        payload,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update subscription');
    }
  },

  getCompanySubscription: async (companyId) => {
    try {
      const response = await axios.get(`${API_BASE}/companies/${companyId}/subscription`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch company subscription');
    }
  }
};


export const companyOverviewAPI = {
  getCompanyOverview: async (companyId) => {
    try {
      const response = await axios.get(`${API_BASE}/company-jobs/stats/overview?companyId=${companyId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching overview for company ${companyId}:`, error);
      return null;
    }
  },

  getAllCompanyOverviews: async (companyIds) => {
    try {
      const overviewPromises = companyIds.map(async (companyId) => {
        const overview = await companyOverviewAPI.getCompanyOverview(companyId);
        return { companyId, overview };
      });
      
      const results = await Promise.allSettled(overviewPromises);
      const overviews = {};
      
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value.overview) {
          overviews[result.value.companyId] = result.value.overview;
        }
      });
      
      return overviews;
    } catch (error) {
      console.error('Error fetching all company overviews:', error);
      return {};
    }
  }
};


// Analytics API
export const analyticsAPI = {
  getGlobal: async () => {
    try {
      const response = await axios.get(`${API_BASE}/analytics/global`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch global analytics');
    }
  },

  getCompany: async (companyId) => {
    try {
      const response = await axios.get(`${API_BASE}/analytics/company/${companyId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch company analytics');
    }
  },

  getUser: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE}/analytics/user/${userId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user analytics');
    }
  }
};

export default {
  companyAPI,
  masterJobAPI,
  subscriptionAPI,
  analyticsAPI
};