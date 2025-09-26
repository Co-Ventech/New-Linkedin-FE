import axios from 'axios';

const REMOTE_HOST = import.meta.env.VITE_REMOTE_HOST;
const API_BASE = `${REMOTE_HOST}/api`;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Global 401 interceptor - install once
let interceptorInstalled = false;
if (!interceptorInstalled) {
  axios.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error?.response?.status;
      if (status === 401) {
        try {
          // Clear all auth data
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          localStorage.removeItem('authCompany');
          document.cookie.split(';').forEach(c => {
            const name = c.split('=')[0].trim();
            if (name) {
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            }
          });
        } catch {}
        // Hard redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
  interceptorInstalled = true;
}

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
      // Enhanced error handling for user-friendly messages
      const backendError = error.response?.data?.error || error.response?.data?.message;
      
      if (backendError?.toLowerCase().includes('already exists') || 
          backendError?.toLowerCase().includes('duplicate')) {
        throw new Error('A company with this email already exists. Please use a different admin email address.');
      }
      
      if (backendError?.toLowerCase().includes('required')) {
        throw new Error('Please fill in all required fields.');
      }
      
      if (backendError?.toLowerCase().includes('invalid email')) {
        throw new Error('Please enter a valid email address.');
      }
      
      throw new Error(backendError || 'Failed to create company. Please try again.');
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

  // distributeBatchToCompanies: async (batchId, companyIds) => {
  //   try {
  //     const response = await axios.post(`${API_BASE}/jobadmin/distribute/batch/${batchId}/companies`, { companyIds }, {
  //       headers: getAuthHeaders()
  //     });
  //     return response.data;
  //   } catch (error) {
  //     throw new Error(error.response?.data?.message || 'Failed to distribute batch to companies');
  //   }
  // },

//distribute batch to companies 

  distributeBatchToCompanies: async (batchId, companyIds, perCompanyLimit) => {
    try {
      const body = { companyIds };
      if (Number.isFinite(perCompanyLimit) && perCompanyLimit > 0) {
        body.perCompanyLimit = Number(perCompanyLimit);
      }
      const response = await axios.post(
        `${API_BASE}/jobadmin/distribute/batch/${batchId}/companies`,
        body,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to distribute batch to companies');
    }
  },

  distributeAll: async (perCompanyLimit) => {
    try {
      const response = await axios.post(`${API_BASE}/jobadmin/distribute/all`, perCompanyLimit? {perCompanyLimit:Number(perCompanyLimit)} : {}, {
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
         const response = await axios.get(`${API_BASE}/subscriptions/plans`, {
           headers: getAuthHeaders()
         });
      return response.data;
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

  // updateSubscription: async (companyId, subscriptionData) => {
  //   try {
  //     const payload = {
  //       subscriptionPlan: subscriptionData.subscriptionPlan,
  //       subscriptionStatus: subscriptionData.subscriptionStatus,
  //       jobsQuota: Number(subscriptionData.jobsQuota),
  //       ...(subscriptionData.customEndDate ? { customEndDate: subscriptionData.customEndDate } : {})
  //     };

  //     const response = await axios.put(
  //       `${API_BASE}/companies/${companyId}/subscription`,
  //       payload,
  //       { headers: getAuthHeaders() }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new Error(error.response?.data?.message || 'Failed to update subscription');
  //   }
  // },
// inside subscriptionAPI
updateSubscription: async (companyId, { subscriptionPlanId }) => {
  try {
    const response = await axios.put(
            `${API_BASE}/companies/${companyId}/subscription`,
            { subscriptionPlanId },
            { headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' } }
          );
    return response.data;
  } catch (error) {
    const msg = error?.response?.data?.message || error?.response?.data?.error;
    throw new Error(msg || 'Failed to update subscription');
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
// export const analyticsAPI = {
//   getGlobal: async () => {
//     try {
//       const response = await axios.get(`${API_BASE}/analytics/global`, {
//         headers: getAuthHeaders()
//       });
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to fetch global analytics');
//     }
//   },

//   getCompany: async (companyId) => {
//     try {
//       const response = await axios.get(`${API_BASE}/analytics/company/${companyId}`, {
//         headers: getAuthHeaders()
//       });
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to fetch company analytics');
//     }
//   },

//   getUser: async (userId) => {
//     try {
//       const response = await axios.get(`${API_BASE}/analytics/user/${userId}`, {
//         headers: getAuthHeaders()
//       });
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to fetch user analytics');
//     }
//   }
// };
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
  // ...
};
 
export const userAPI = {
  getByCompany: async (companyId, page = 1, limit = 20) => {
    try {
      const response = await axios.get(`${API_BASE}/users/company/${companyId}?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders()
      });
      return response.data; // { users: [...], pagination: {...} }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch company users');
    }
  },

  create: async ({ username, email, password, phone, location, companyId }) => {
    try {
      const response = await axios.post(`${API_BASE}/users`, { 
        username, 
        email, 
        password, 
        phone, 
        location, 
        companyId 
      }, {
        headers: getAuthHeaders()
      });
      return response.data; // { message, user }
    } catch (error) {
      // Enhanced error handling for user-friendly messages
      const backendError = error.response?.data?.error || error.response?.data?.message;
      if (backendError?.toLowerCase().includes('already exists')) {
        throw new Error('A user with this email already exists. Please try a different email.');
      }
      throw new Error(backendError || 'Failed to create user');
    }
  },

  getById: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE}/users/${userId}`, {
        headers: getAuthHeaders()
      });
      // Handle the API response structure: { "users": [...] }
      const data = response.data;
      if (data.users && Array.isArray(data.users) && data.users.length > 0) {
        return data.users[0]; // Return the first user object
      }
      return data; // Fallback to direct response
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  }
};

export const companyPipelineAPI = {
  get: async () => {
    const res = await axios.get(`${API_BASE}/company-pipeline`, { headers: getAuthHeaders() });
    return res.data; // { pipeline, isCustom }
  },
  update: async (payload) => {
    const res = await axios.put(`${API_BASE}/company-pipeline`, payload, { headers: getAuthHeaders() });
    return res.data; // updated { pipeline, isCustom }
  }
  
};

export const adminCompanyPipelineAPI = {
  async getByCompany(companyId) {
    const res = await fetch(`${API_BASE}/company-pipeline/company/${companyId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to fetch pipeline');
    return data?.pipeline || data || null;
  },
  async updateForCompany(companyId, payload) {
    const res = await fetch(`${API_BASE}/company-pipeline/company/${companyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to update pipeline');
    return data?.pipeline || data || null;
  }
};
export default {
  companyAPI,
  masterJobAPI,
  subscriptionAPI,
  analyticsAPI,
  userAPI,
  companyPipelineAPI
};