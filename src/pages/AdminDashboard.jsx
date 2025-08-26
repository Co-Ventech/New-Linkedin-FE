import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, isSuperAdmin } from '../slices/userSlice';
import Layout from '../components/Layout';
import CreateCompanyModal from '../components/CreateCompanyModal';
import SubscriptionModal from '../components/SubscriptionModal';
import JobDistributionModal from '../components/JobDistributionModal';
import CreatePlanModal from '../components/CreatePlanModal';
import { companyAPI, masterJobAPI, subscriptionAPI } from '../services/api';
import { 
  Building2, 
  Users, 
  Database, 
  CreditCard, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Play,
  Eye,
  Plus,
  RefreshCw,
  Calendar,
  DollarSign,
  Activity,
  X,
  Share2,
  Clock,
  BarChart3,
  Upload
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_REMOTE_HOST ;

const SuperAdminDashboard = () => {
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [distributionStats, setDistributionStats] = useState({});
  const [showDistributionModal, setShowDistributionModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [distributionType, setDistributionType] = useState('batch'); // 'batch', 'all', 'companies'
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [distributionLoading, setDistributionLoading] = useState(false);
  const companyId = user?.companyId;
  const [subscription,setSubscription] = useState(null);
  const [companyOverviews, setCompanyOverviews] = useState({});
const [overviewLoading, setOverviewLoading] = useState(false);




  // Data states
  const [companies, setCompanies] = useState([]);
  const [batches, setBatches] = useState([]);
  const [plans, setPlans] = useState([]);
  const [subscriptionStats, setSubscriptionStats] = useState({});
  const [showCreatePlan, setShowCreatePlan] = useState(false);

  // Modal states
  const [showCreateCompany, setShowCreateCompany] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Form states
  const [scrapeForm, setScrapeForm] = useState({
    platform: 'linkedin'
  });

  const [masterJobs, setMasterJobs] = useState([]);
  const [jobsPage, setJobsPage] = useState(1);
  const [jobsLimit] = useState(20);
  const [jobsTotal, setJobsTotal] = useState(0);
  const [jobsStatus, setJobsStatus] = useState('all');
  // Add these missing modal states after the existing states (around line 45)

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedBatchForDetails, setSelectedBatchForDetails] = useState(null);
  const [showBatchDetailsModal, setShowBatchDetailsModal] = useState(false);
  const [batchDetails, setBatchDetails] = useState(null);
  // const [batchId , setBatchId] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    file: null,
    keywords: '',
    platform: 'linkedin',
    start: '',
    end: ''
  });
  const [showEditPlan, setShowEditPlan] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({
    name: '',
  displayName: '',
  description: '',
  price: '',
  duration: '',
  jobsQuota: '',
  features: []
  });
  // Check role access
  if (!isSuperAdmin(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this dashboard.</p>
        </div>
      </div>
    );
  }

  // Load initial data with improved error handling
  // const loadInitialData = async () => {
  //   setLoading(true);
  //   setMessage({ type: '', text: '' });

  //   try {
  //     // Use Promise.allSettled to handle individual failures gracefully
  //     const results = await Promise.allSettled([
  //       companyAPI.getAll(),
  //       masterJobAPI.getJobBatches(),
  //       subscriptionAPI.getStats(),
  //       subscriptionAPI.getAllPlans()
  //     ]);

  //     // Process companies
  //     if (results[0].status === 'fulfilled') {
  //       let companiesData = [];
  //       const companiesResponse = results[0].value;

  //       if (companiesResponse) {
  //         if (Array.isArray(companiesResponse)) {
  //           companiesData = companiesResponse;
  //         } else if (companiesResponse.data && Array.isArray(companiesResponse.data)) {
  //           companiesData = companiesResponse.data;
  //         } else if (companiesResponse.companies && Array.isArray(companiesResponse.companies)) {
  //           companiesData = companiesResponse.companies;
  //         }
  //       }
  //       setCompanies(companiesData);
  //       console.log('Companies loaded:', companiesData);
  //     } else {
  //       console.error('Failed to load companies:', results[0].reason);
  //       showMessage('error', 'Failed to load companies');
  //     }

  //     // Process batches
  //     if (results[1].status === 'fulfilled') {
  //       const batchesData = results[1].value || [];
  //       setBatches(batchesData);
  //       console.log('Batches loaded:', batchesData);
  //     } else {
  //       console.error('Failed to load batches:', results[1].reason);
  //       showMessage('error', 'Failed to load job batches');
  //     }

  //     // Process subscription stats
  //     if (results[2].status === 'fulfilled') {
  //       const statsData = results[2].value || {};
  //       setSubscriptionStats(statsData);
  //       console.log('Stats loaded:', statsData);
  //     } else {
  //       console.error('Failed to load stats:', results[2].reason);
  //       showMessage('error', 'Failed to load subscription statistics');
  //     }

  //     // Process plans
  //     if (results[3].status === 'fulfilled') {
  //       const plansData = results[3].value || [];
  //       setPlans(plansData);
  //       console.log('Plans loaded:', plansData);
  //     } else {
  //       console.error('Failed to load plans:', results[3].reason);
  //       showMessage('error', 'Failed to load subscription plans');
  //     }

  //   } catch (error) {
  //     console.error('Error in loadInitialData:', error);
  //     showMessage('error', 'Failed to load dashboard data');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchCompanyOverview = async (companyId) => {
  //   try {
  //     // Try different API endpoints to get company-specific data
  //     const endpoints = [
  //       `${API_BASE}/api/company-jobs/stats/overview?companyId=${companyId}`,
  //       `${API_BASE}/api/companies/${companyId}/stats/overview`,
  //       `${API_BASE}/api/company-jobs/stats/overview/${companyId}`,
  //       `${API_BASE}/api/analytics/company/${companyId}`
  //     ];
  
  //     for (const endpoint of endpoints) {
  //       try {
  //         const response = await fetch(endpoint, {
  //           headers: { 
  //             'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
  //             'Content-Type': 'application/json'
  //           }
  //         });
          
  //         if (response.ok) {
  //           const data = await response.json();
  //           console.log(`Success fetching overview for company ${companyId} from ${endpoint}:`, data);
  //           return data;
  //         }
  //       } catch (err) {
  //         console.warn(`Failed to fetch from ${endpoint}:`, err);
  //         continue;
  //       }
  //     }
      
  //     console.warn(`Failed to fetch overview for company ${companyId} from all endpoints`);
  //     return null;
  //   } catch (error) {
  //     console.error(`Error fetching overview for company ${companyId}:`, error);
  //     return null;
  //   }
  // };
  
  
  // Add function to fetch all company overviews
  // const fetchAllCompanyOverviews = async (companiesList) => {
  //   setOverviewLoading(true);
  //   const overviews = {};
    
  //   try {
  //     // Fetch overviews for all companies in parallel
  //     const overviewPromises = companiesList.map(async (company) => {
  //       const companyId = company.id || company._id;
  //       if (companyId) {
  //         const overview = await fetchCompanyOverview(companyId);
  //         if (overview) {
  //           overviews[companyId] = overview;
  //         }
  //       }
  //     });
      
  //     await Promise.allSettled(overviewPromises);
  //     setCompanyOverviews(overviews);
  //   } catch (error) {
  //     console.error('Error fetching company overviews:', error);
  //   } finally {
  //     setOverviewLoading(false);
  //   }
  // };

const fetchAllCompanyOverviews = async () => {
  setOverviewLoading(true);
  try {
    const response = await fetch(`${API_BASE}/api/company-jobs/stats/all-companies`, {
      method: 'GET', // Ensure the method is GET
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Ensure the token is valid
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const overviews = {};
      data.companies.forEach((company) => {
        overviews[company.companyId] = company;
      });
      setCompanyOverviews(overviews);
    } else {
      console.error('Failed to fetch company overviews:', response.statusText);
      showMessage('error', `API Error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error fetching company overviews:', error);
    showMessage('error', 'Failed to fetch company overviews');
  } finally {
    setOverviewLoading(false);
  }
};

// Update the loadInitialData function to add more debugging
const loadInitialData = async () => {
  setLoading(true);
  setMessage({ type: '', text: '' });

  try {
    const results = await Promise.allSettled([
      companyAPI.getAll(),
      masterJobAPI.getJobBatches(),
      subscriptionAPI.getStats(),
      subscriptionAPI.getAllPlans(),
      masterJobAPI.getDistributionStats(),
      fetchCompanySubscription(),
      fetchAllCompanyOverviews(), // Updated to fetch all company overviews
    ]);

    // Process companies
    if (results[0].status === 'fulfilled') {
      const companiesData = results[0].value;
      const normalized = Array.isArray(companiesData)
        ? companiesData
        : Array.isArray(companiesData?.companies)
        ? companiesData.companies
        : Array.isArray(companiesData?.data)
        ? companiesData.data
        : [];
      setCompanies(normalized);
      console.log('Companies loaded:', normalized);
    } else {
      console.error('Companies fetch failed:', results[0].reason);
      setCompanies([]);
    }

    // Other processing remains unchanged...
  } catch (error) {
    console.error('Error in loadInitialData:', error);
    setMessage({ type: 'error', text: 'Failed to load dashboard data' });
  } finally {
    setLoading(false);
  }
};
  

const getTotalStatusCount = (statusBreakdown) => {
  if (!statusBreakdown) return 0;
  return Object.values(statusBreakdown).reduce((sum, count) => sum + (count || 0), 0);
};

// Add helper function to calculate qualified leads
const getQualifiedLeads = (statusBreakdown) => {
  if (!statusBreakdown) return 0;
  return (statusBreakdown.interview || 0) + (statusBreakdown.offer || 0) + (statusBreakdown.engaged || 0);
};

// Add the getConversionRate function here
const getConversionRate = (statusBreakdown) => {
  if (!statusBreakdown) return 0;
  const qualifiedLeads = getQualifiedLeads(statusBreakdown);
  const totalJobs = getTotalStatusCount(statusBreakdown);
  return totalJobs > 0 ? Math.round((qualifiedLeads / totalJobs) * 100) : 0;
};

  const loadMasterJobs = async (filters = {}) => {
    try {
      const response = await masterJobAPI.getMasterJobs(filters);
      setMasterJobs(response.jobs || []);
      setJobsTotal(response.total || 0);
      setJobsPage(response.page || 1);
    } catch (error) {
      console.error('Error loading master jobs:', error);
      showMessage('error', 'Failed to load master jobs');
    }
  };

  // Update useEffect to also load master jobs
  useEffect(() => {
    if (isSuperAdmin(user)) {
    loadInitialData();
      loadMasterJobs(); 
    }
    // run once on mount for super admins
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  // Add deps to useEffect: useEffect(() => { loadInitialData(); }, []);


  // Remove duplicate unconditional loadInitialData effect to avoid double fetches

  // Message handling with auto-dismiss
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

   // Company operations
   const handleCreateCompany = async (companyData) => {
    try {
      setLoading(true);
      const response = await companyAPI.create({
        name: companyData.name,
        description: companyData.description,
        adminEmail: companyData.adminEmail,
        // initial subscription
        ...(companyData.subscriptionPlan ? { subscriptionPlan: companyData.subscriptionPlan } : {}),
        ...(companyData.jobsQuota ? { jobsQuota: Number(companyData.jobsQuota) } : {})
      });
      showMessage('success', 'Company created successfully! A temporary password has been sent to the admin email.');
      setShowCreateCompany(false);
      await loadInitialData();
    } catch (error) {
      console.error('Error creating company:', error);
      showMessage('error', error.message || 'Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      await companyAPI.delete(companyId);
      showMessage('success', 'Company deleted successfully!');
      await loadInitialData();
    } catch (error) {
      console.error('Error deleting company:', error);
      showMessage('error', error.message || 'Failed to delete company');
    } finally {
      setLoading(false);
    }
  };


  // Fetch company subscription
  const fetchCompanySubscription = async () => {
    try {
      if (!companyId) return null;
      const res = await fetch(`${API_BASE}/api/companies/${companyId}/subscription`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (!res.ok) return null; // tolerate 404/no sub
      const data = await res.json();
      return data.subscription || null;
    } catch {
      return null;
    }
  };

  const handleUpdateSubscription = async (companyId, subscriptionData) => {
    try {
      setLoading(true);
      await subscriptionAPI.updateSubscription(companyId, {
        subscriptionPlan: subscriptionData.subscriptionPlan,
        subscriptionStatus: subscriptionData.subscriptionStatus,
        jobsQuota: subscriptionData.jobsQuota,
        customEndDate: subscriptionData.customEndDate || ''
      });
      showMessage('success', 'Subscription updated successfully!');
      setShowSubscriptionModal(false);
      setSelectedCompany(null);
      await loadInitialData();
    } catch (error) {
      console.error('Error updating subscription:', error);
      showMessage('error', error.message || 'Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  // Add these new handlers after the existing handlers (around line 280)

  // File upload handler
  const handleFileUpload = async (e) => {
    e.preventDefault();

    // Form validation
    if (!uploadForm.file) {
      showMessage('error', 'Please select a file to upload');
      return;
    }
    if (!uploadForm.keywords.trim()) {
      showMessage('error', 'Please enter keywords for the upload');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('keywords', uploadForm.keywords);
      formData.append('platform', uploadForm.platform);
      if (uploadForm.start) formData.append('start', uploadForm.start);
      if (uploadForm.end) formData.append('end', uploadForm.end);

      await masterJobAPI.uploadScoredJobs(formData);
      showMessage('success', 'Jobs uploaded successfully!');

      // Reset form and reload data
      setUploadForm({
        file: null,
        keywords: '',
        platform: 'linkedin',
        start: '',
        end: ''
      });

      // Clear file input
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';

      await loadInitialData();
    } catch (error) {
      console.error('Error uploading jobs:', error);
      showMessage('error', error.message || 'Failed to upload jobs');
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  // View batch details
  const handleViewBatchDetails = async (batchId) => {
    try {
      setLoading(true);
      const details = await masterJobAPI.getBatchDetails(batchId);
      setBatchDetails(details);
      setSelectedBatchForDetails(batchId);
      setShowBatchDetailsModal(true);
    } catch (error) {
      console.error('Error fetching batch details:', error);
      showMessage('error', error.message || 'Failed to fetch batch details');
    } finally {
      setLoading(false);
    }
  };

  // Delete batch
  const handleDeleteBatch = async (batchId) => {
    if (!window.confirm('Are you sure you want to delete this batch? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await masterJobAPI.deleteBatch(batchId);
      showMessage('success', 'Batch deleted successfully!');
      await loadInitialData();
    } catch (error) {
      console.error('Error deleting batch:', error);
      showMessage('error', error.message || 'Failed to delete batch');
    } finally {
      setLoading(false);
    }
  };

  const handleDistributeBatch = async (batchId) => {
    setDistributionType('batch');
    setSelectedBatch(batchId);
    setShowDistributionModal(true);
  };

  const handleDistributeAll = async () => {
    if (!window.confirm('Are you sure you want to distribute all undistributed jobs? This will send jobs to all active companies.')) {
      return;
    }

    try {
      setDistributionLoading(true);
      await masterJobAPI.distributeAll();
      showMessage('success', 'All undistributed jobs have been distributed successfully!');
      await loadInitialData(); // Reload to get updated stats
    } catch (error) {
      console.error('Error distributing all jobs:', error);
      showMessage('error', error.message || 'Failed to distribute all jobs');
    } finally {
      setDistributionLoading(false);
    }
  };

  const handleDistributeToCompanies = async (companyIds) => {
    if (!companyIds || companyIds.length === 0) {
      showMessage('error', 'Please select at least one company');
      return;
    }

    try {
      setDistributionLoading(true);
      const result = await masterJobAPI.distributeToCompanies(companyIds);
      showMessage('success', `Jobs distributed successfully! ${result.distributedCount || 0} jobs sent.`);
      await loadInitialData(); // Reload to get updated stats
    } catch (error) {
      console.error('Error distributing to companies:', error);
      showMessage('error', error.message || 'Failed to distribute jobs to companies');
    } finally {
      setDistributionLoading(false);
    }
  };

  const handleExecuteDistribution = async (distributionData) => {
    try {
      setDistributionLoading(true);

      if (distributionType === 'batch') {
        if (!selectedBatch) {
          showMessage('error', 'No batch selected.');
          return;
        }
        if (distributionData.strategy === 'companies') {
          if (!distributionData.companyIds || distributionData.companyIds.length === 0) {
            showMessage('error', 'Please select at least one company');
            return;
          }
          await masterJobAPI.distributeBatchToCompanies(selectedBatch, distributionData.companyIds);
          showMessage('success', 'Batch distributed to selected companies successfully!');
        } else {
          await masterJobAPI.distributeBatch(selectedBatch, {});
          showMessage('success', 'Batch distributed to all active companies successfully!');
        }
      } else if (distributionType === 'companies') {
        if (!distributionData.companyIds || distributionData.companyIds.length === 0) {
          showMessage('error', 'Please select at least one company');
          return;
        }
        const result = await masterJobAPI.distributeToCompanies(distributionData.companyIds);
        showMessage('success', `Jobs distributed successfully! ${result.distributedCount || 0} jobs sent.`);
      } else if (distributionType === 'all') {
        await masterJobAPI.distributeAll();
        showMessage('success', 'All undistributed jobs distributed successfully!');
      }

      setShowDistributionModal(false);
      setSelectedBatch(null);
      setSelectedCompanies([]);
      await loadInitialData();
    } catch (error) {
      console.error('Error executing distribution:', error);
      showMessage('error', error.message || 'Failed to execute distribution');
    } finally {
      setDistributionLoading(false);
    }
  };

  // Enhanced distribute batch handler
  // const handleDistributeBatch = async (distributionData) => {
  //   try {
  //     setLoading(true);

  //     if (distributionData.strategy === 'companies') {
  //       // Distribute to specific companies
  //       await masterJobAPI.distributeBatchToCompanies(
  //         distributionData.batchId, 
  //         distributionData.companyIds
  //       );
  //     } else {
  //       // Use general distribution
  //       await masterJobAPI.distributeBatch(distributionData.batchId, distributionData);
  //     }

  //     showMessage('success', 'Jobs distributed successfully!');
  //     setShowDistributionModal(false);
  //     setSelectedBatch(null);
  //     await loadInitialData();
  //   } catch (error) {
  //     console.error('Error distributing batch:', error);
  //     showMessage('error', error.message || 'Failed to distribute jobs');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // Job operations
  // const handleScrapeJobs = async (e) => {
  //   e.preventDefault();

  //   // Form validation
  //   if (!scrapeForm.keywords.trim()) {
  //     showMessage('error', 'Please enter keywords for job scraping');
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     await masterJobAPI.scrape(scrapeForm);
  //     showMessage('success', 'Job scraping started successfully! Check the batches tab for progress.');
  //     setScrapeForm({ keywords: '', platform: 'linkedin', start: '', end: '' });
  //     await loadInitialData();
  //   } catch (error) {
  //     console.error('Error scraping jobs:', error);
  //     showMessage('error', error.message || 'Failed to start job scraping');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // Replace the file upload handlers with these simplified handlers

  // Simplified scrape jobs handler (no file upload, just keywords and platform)
  const handleScrapeJobs = async (e) => {
    e.preventDefault();

    if (!scrapeForm.platform) {
      setMessage({ type: 'error', text: 'Please select a platform' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const response = await fetch(`${API_BASE}/api/jobadmin/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          platform: scrapeForm.platform
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload jobs');
      }

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: 'success',
          text: `${result.message} - Batch ID: ${result.batchId}`
        });

        // Reset form
        setScrapeForm({ platform: 'linkedin' });

        // Reload batches to show the new batch
        await loadInitialData();
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to upload jobs' });
      }
    } catch (error) {
      console.error('Error uploading jobs:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to upload jobs' });
    } finally {
      setLoading(false);
    }
  };

  // // Load master jobs with filtering
  // const loadMasterJobs = async (status = 'all', page = 1) => {
  //   try {
  //     setLoading(true);
  //     const response = await masterJobAPI.getMasterJobs({ status, page, limit: jobsLimit });

  //     if (response.jobs && Array.isArray(response.jobs)) {
  //       setMasterJobs(response.jobs);
  //       setJobsTotal(response.total || 0);
  //       setJobsPage(page);
  //       setJobsStatus(status);
  //     }
  //   } catch (error) {
  //     console.error('Error loading master jobs:', error);
  //     showMessage('error', 'Failed to load master jobs');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Handle job status filter change
  const handleJobStatusChange = (newStatus) => {
    setJobsStatus(newStatus);
    setJobsPage(1);
    loadMasterJobs(newStatus, 1);
  };

  // Handle job pagination
  const handleJobPageChange = (newPage) => {
    setJobsPage(newPage);
    loadMasterJobs(jobsStatus, newPage);
  };



  // const handleDistributeBatch = async (distributionData) => {
  //   try {
  //     setLoading(true);
  //     await masterJobAPI.distributeBatch(distributionData);
  //     showMessage('success', 'Jobs distributed successfully!');
  //     setShowDistributionModal(false);
  //     setSelectedBatch(null);
  //     await loadInitialData();
  //   } catch (error) {
  //     console.error('Error distributing batch:', error);
  //     showMessage('error', error.message || 'Failed to distribute jobs');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleCreatePlan = async (planData) => {
    // Validate required fields according to API requirements
    if (!planData.name || !planData.displayName || !planData.description || 
        !planData.price || !planData.duration || !planData.jobsQuota) {
      showMessage('error', 'Name, display name, description, price, duration, and jobs quota are required');
      return;
    }
  
    try {
      setLoading(true);
      const response = await subscriptionAPI.createPlan({
        name: planData.name,
        displayName: planData.displayName,
        description: planData.description,
        price: parseFloat(planData.price),
        duration: parseInt(planData.duration),
        jobsQuota: parseInt(planData.jobsQuota),
        features: planData.features || []
      });
      
      showMessage('success', response.message || 'Plan created successfully!');
      setShowCreatePlan(false);
      // Reset form to initial state
      setPlanForm({ 
        name: '', 
        displayName: '', 
        description: '', 
        price: '', 
        duration: '', 
        jobsQuota: '', 
        features: [] 
      });
      await loadInitialData();
    } catch (error) {
      console.error('Error creating plan:', error);
      showMessage('error', error.message || 'Failed to create plan');
    } finally {
      setLoading(false);
    }
  };
  

  const handleEditPlan = async (planData) => {
    if (!editingPlan) {
      showMessage('error', 'No plan selected for editing');
      return;
    }
    const planId = editingPlan.id || editingPlan._id;
    if (!planId) {
      console.error('Editing plan has no valid ID:', editingPlan);
      showMessage('error', 'Invalid plan data - missing ID');
      return;
    }
    if (!planData.displayName || !planData.description || !planData.price || 
        !planData.duration || !planData.jobsQuota) {
      showMessage('error', 'Display name, description, price, duration, and jobs quota are required');
      return;
    }
    try {
      setLoading(true);
      await subscriptionAPI.updatePlan(planId, {
        displayName: planData.displayName,
        description: planData.description,
        price: parseFloat(planData.price),
        duration: parseInt(planData.duration),
        jobsQuota: parseInt(planData.jobsQuota),
        features: planData.features || []
      });
      showMessage('success', 'Plan updated successfully!');
      setShowEditPlan(false);
      setEditingPlan(null);
      setPlanForm({ name: '', displayName: '', description: '', price: '', duration: '', jobsQuota: '', features: [] });
      await loadInitialData();
    } catch (error) {
      console.error('Error updating plan:', error);
      showMessage('error', error.message || 'Failed to update plan');
    } finally {
      setLoading(false);
    }
  };
  
  // Update the openEditPlan function
  const openEditPlan = (plan) => {
    console.log('Opening edit for plan:', plan); // Debug log
    
    // Check if plan has the correct ID field
    const planId = plan.id || plan._id;
    if (!planId) {
      console.error('Plan has no valid ID:', plan);
      showMessage('error', 'Invalid plan data - missing ID');
      return;
    }
    
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name || '',
      displayName: plan.displayName || '',
      description: plan.description || '',
      price: plan.price?.toString() || '',
      duration: plan.duration?.toString() || '',
      jobsQuota: plan.jobsQuota?.toString() || '',
      features: plan.features || []
    });
    setShowEditPlan(true);
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      await subscriptionAPI.deletePlan(planId);
      showMessage('success', 'Plan deleted successfully!');
      await loadInitialData();
    } catch (error) {
      console.error('Error deleting plan:', error);
      showMessage('error', error.message || 'Failed to delete plan');
    } finally {
      setLoading(false);
    }
  };



  // const handleDeletePlan = async (planId) => {
  //   if (!window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     await subscriptionAPI.deletePlan(planId);
  //     showMessage('success', 'Plan deleted successfully!');
  //     await loadInitialData();
  //   } catch (error) {
  //     console.error('Error deleting plan:', error);
  //     showMessage('error', error.message || 'Failed to delete plan');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleDeletePlan = async (planId) => {
  //   if (!window.confirm('Are you sure you want to delete this plan?')) return;
  //   try {
  //     await subscriptionAPI.deletePlan(planId);
  //     showMessage('success', 'Plan deleted successfully!');
  //     loadInitialData();
  //   } catch (error) {
  //     showMessage('error', error.message || 'Failed to delete plan');
  //   }
  // };


  // Tab content components
  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        {/* <button
          onClick={loadInitialData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
        </button> */}
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Companies</p>
              <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${subscriptionStats.totalRevenue || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">
                {subscriptionStats.activeSubscriptions || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Database className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">
                {subscriptionStats.totalJobs || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
        </div>
        <div className="p-6">
          {batches.length === 0 ? (
            <div className="text-center py-8">
              <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No job batches yet. Start by scraping some jobs!</p>
            </div>
          ) : (
          <div className="space-y-4">
            {batches.slice(0, 5).map((batch) => (
                <div key={batch.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${batch.status === 'completed' ? 'bg-green-500' :
                      batch.status === 'processing' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`} />
                <div>
                      <p className="font-medium text-gray-900">New job batch created</p>
                  <p className="text-sm text-gray-600">
                    {batch.platform} - {batch.keywords} ({batch.count} jobs)
                  </p>
                </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(batch.createdAt).toLocaleDateString()}</span>
                  </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );

  const CompaniesTab = () => (
    <div className="space-y-8">
      {/* Enhanced Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Companies</p>
              <p className="text-2xl font-semibold text-gray-900">{companies.length}</p>
            </div>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Qualified Leads</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Object.values(companyOverviews).reduce((sum, overview) => 
                  sum + getQualifiedLeads(overview?.statusBreakdown), 0
                )}
              </p>
            </div>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Object.values(companyOverviews).reduce((sum, overview) => 
                  sum + (overview?.userActivity?.filter(u => u.username !== 'system').length || 0), 0
                )}
              </p>
            </div>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Status Changes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Object.values(companyOverviews).reduce((sum, overview) => 
                  sum + (overview?.userActivity?.reduce((userSum, u) => userSum + (u.statusChanges || 0), 0) || 0), 0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
  
      {/* Companies Management Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Companies Management</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={loadInitialData}
            disabled={loading || overviewLoading}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading || overviewLoading ? 'animate-spin' : ''}`} />
            <span>{loading || overviewLoading ? 'Loading...' : 'Refresh'}</span>
          </button>
          <button
            onClick={() => setShowCreateCompany(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Company</span>
          </button>
        </div>
      </div>
  
      {/* Companies Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {companies.length === 0 ? (
          <div className="p-8 text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-500 mb-4">Start by creating your first company.</p>
            <button
              onClick={() => setShowCreateCompany(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Company
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance Metrics</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companies.map((company, index) => {
                  const companyId = company.id || company._id;
                  const overview = companyOverviews[companyId];
                  const plan = company.subscriptionPlan || company.plan || 'none';
                  const status = company.subscriptionStatus || company.status || 'inactive';
                  const quota = Number(company.jobsQuota || 0);
                  const used = Number(company.jobsUsed || 0);
                  const pct = quota > 0 ? Math.min(100, Math.round((used / quota) * 100)) : 0;

                  
                  
                  // Calculate performance metrics
                  const totalJobs = getTotalStatusCount(overview?.statusBreakdown);
                  const qualifiedLeads = getQualifiedLeads(overview?.statusBreakdown);
                  const conversionRate = getConversionRate(overview?.statusBreakdown);
                  const activeUsers = overview?.userActivity?.filter(u => u.username !== 'system').length || 0;
                  const totalStatusChanges = overview?.userActivity?.reduce((sum, u) => sum + (u.statusChanges || 0), 0) || 0;
                  
                  return (
                    <tr key={companyId || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{company.companyName || company.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{company.companyDescription || company.description || 'No description'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                            {plan}
                          </span>
                          <div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} capitalize`}>
                              {status}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-40">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>{used} used</span>
                            <span>{quota} quota</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {overviewLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-xs text-gray-500">Loading...</span>
                          </div>
                        ) : overview ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Database className="h-3 w-3 text-blue-500" />
                              <span className="text-xs font-medium">{totalJobs} Total Jobs</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="h-3 w-3 text-green-500" />
                              <span className="text-xs font-medium">{qualifiedLeads} Qualified Leads</span>
                            </div>
                            {/* <div className="flex items-center space-x-2">
                              <BarChart3 className="h-3 w-3 text-purple-500" />
                              <span className="text-xs font-medium">{conversionRate}% Conversion</span>
                            </div> */}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No data</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {overviewLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-xs text-gray-500">Loading...</span>
                          </div>
                        ) : overview?.userActivity ? (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Users className="h-3 w-3 text-purple-500" />
                              <span className="text-xs font-medium">{activeUsers} Active Users</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Activity className="h-3 w-3 text-orange-500" />
                              <span className="text-xs font-medium">{totalStatusChanges} Status Changes</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No activity</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {company.admin?.email || company.adminEmail || company.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => { setSelectedCompany(company); setShowSubscriptionModal(true); }}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Edit Subscription"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCompany(companyId)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete Company"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
  
      {/* Individual Company Sections */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Individual Company Performance</h3>
        
        {companies.map((company, index) => {
          const companyId = company.id || company._id;
          const overview = companyOverviews[companyId];
          const plan = company.subscriptionPlan || company.plan || 'none';
          const status = company.subscriptionStatus || company.status || 'inactive';
          const quota = Number(company.jobsQuota || 0);
          const used = Number(company.jobsUsed || 0);
          const pct = quota > 0 ? Math.min(100, Math.round((used / quota) * 100)) : 0;
          
          // // Calculate performance metrics
          const totalJobs = getTotalStatusCount(overview?.statusBreakdown);
          const qualifiedLeads = getQualifiedLeads(overview?.statusBreakdown);
          // const conversionRate = getConversionRate(overview?.statusBreakdown);
          const activeUsers = overview?.userActivity?.filter(u => u.username !== 'system').length || 0;
          const totalStatusChanges = overview?.userActivity?.reduce((sum, u) => sum + (u.statusChanges || 0), 0) || 0;
  
          return (
            <div key={companyId || index} className="bg-white rounded-lg shadow-lg border border-gray-200">
              {/* Company Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{company.companyName || company.name || 'N/A'}</h4>
                    <p className="text-sm text-gray-600">{company.companyDescription || company.description || 'No description'}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} capitalize`}>
                      {status}
                    </span>
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                      {plan}
                    </span>
                  </div>
                </div>
              </div>
  
              {/* Company Content */}
              <div className="p-6">
                {/* Performance Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center">
                      <Database className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Jobs</p>
                        <p className="text-2xl font-bold text-blue-900">{totalJobs}</p>
                      </div>
                    </div>
                  </div>
  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-green-600">Qualified Leads</p>
                        <p className="text-2xl font-bold text-green-900">{qualifiedLeads}</p>
                      </div>
                    </div>
                  </div>
{/*   
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center">
                      <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-purple-600">Conversion Rate</p>
                        <p className="text-2xl font-bold text-purple-900">{conversionRate}%</p>
                      </div>
                    </div>
                  </div> */}
  
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-orange-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-orange-600">Active Users</p>
                        <p className="text-2xl font-bold text-orange-900">{activeUsers}</p>
                      </div>
                    </div>
                  </div>
                </div>
  
                {/* Job Usage and Status Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Job Usage */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-gray-900 mb-3">Job Usage</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Used: {used}</span>
                        <span>Quota: {quota}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-500">Usage: {pct}%</p>
                    </div>
                  </div>
  
                  {/* Status Breakdown */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-gray-900 mb-3">Status Breakdown</h5>
                    {overview?.statusBreakdown ? (
                      <div className="space-y-2">
                        {Object.entries(overview.statusBreakdown).map(([status, count]) => (
                          <div key={status} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 capitalize">{status.replace(/_/g, ' ')}</span>
                            <span className="text-sm font-medium text-gray-900">{count}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No status data available</p>
                    )}
                  </div>
                </div>
  
                {/* User Activity */}
                {overview?.userActivity && overview.userActivity.length > 0 && (
                  <div className="mt-6">
                    <h5 className="text-sm font-semibold text-gray-900 mb-3">User Activity</h5>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2">
                        {overview.userActivity
                          .filter(user => user.username !== 'system')
                          .slice(0, 5)
                          .map((user, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{user.username}</span>
                              <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">{user.statusChanges} changes</span>
                                <span className="text-xs text-gray-400">
                                  {user.lastActivity ? new Date(user.lastActivity).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
  
                {/* Company Details */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Admin Email:</span>
                      <p className="text-gray-600">{company.admin?.email || company.adminEmail || company.email || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Created:</span>
                      <p className="text-gray-600">
                        {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Total Status Changes:</span>
                      <p className="text-gray-600">{totalStatusChanges}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const BatchesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Job Batches & Distribution</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDistributeAll}
            disabled={distributionLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {distributionLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Share2 className="h-4 w-4" />
            )}
            <span>Distribute All Jobs</span>
          </button>
          <button
            onClick={() => {
              setDistributionType('companies');
              setShowDistributionModal(true);
            }}
            disabled={distributionLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <Users className="h-4 w-4" />
            <span>Distribute to Companies</span>
          </button>
        </div>
      </div>

      {/* Enhanced Distribution Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Jobs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {distributionStats?.totalJobs || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Share2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Distributed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {distributionStats?.distributedJobs || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {distributionStats?.undistributedJobs || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Companies</p>
              <p className="text-2xl font-semibold text-gray-900">
                {distributionStats?.activeCompanies || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Batches</p>
              <p className="text-2xl font-semibold text-gray-900">
                {batches?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution History Chart */}
      {distributionStats?.distributionHistory && distributionStats.distributionHistory.length > 0 && (
      <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Distribution History</h3>
          <div className="h-64 flex items-end space-x-2">
            {distributionStats.distributionHistory.slice(-7).map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{
                    height: `${(item.jobsDistributed / Math.max(...distributionStats.distributionHistory.map(h => h.jobsDistributed))) * 200}px`
                  }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="text-xs font-medium text-gray-700">
                  {item.jobsDistributed}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload/Scrape Form - Enhanced */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <Upload className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">Upload Jobs from Platform</h3>
        </div>
        <form onSubmit={handleScrapeJobs} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
                Platform *
              </label>
          <select
                id="platform"
                name="platform"
            value={scrapeForm.platform}
                onChange={(e) => setScrapeForm({ ...scrapeForm, platform: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
          >
            <option value="linkedin">LinkedIn</option>
            <option value="upwork">Upwork</option>
          </select>
            </div>
            <div className="flex items-end">
          <button
            type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2 transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload Jobs</span>
                  </>
                )}
          </button>
            </div>
          </div>
        </form>
      </div>

      {/* Enhanced Batches Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Job Batches</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Database className="h-4 w-4" />
              <span>{batches.length} batches</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading batches...</span>
            </div>
          </div>
        ) : batches.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Database size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No batches found</h3>
            <p className="text-gray-500">Upload jobs to get started with job distribution.</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jobs Scraped
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Jobs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distributed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {batches.map((batch) => (
                  <tr key={batch._id || batch.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900 font-mono">
                          {batch.batchId}
                        </span>
                      </div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${batch.platform === 'linkedin'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                        }`}>
                    {batch.platform}
                      </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${batch.status === 'completed'
                        ? 'bg-green-100 text-green-800' 
                        : batch.status === 'processing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {batch.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{batch.stats?.totalJobsScraped || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <Plus className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{batch.stats?.newJobsAdded || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <Share2 className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{batch.distribution?.jobsDistributed || 0}</span>
                      </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{new Date(batch.createdAt).toLocaleDateString()}</span>
                      </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                      <button
                          onClick={() => handleViewBatchDetails(batch._id || batch.id)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDistributeBatch(batch._id || batch.id)}
                          className="text-green-600 hover:text-green-900 transition-colors p-1 rounded hover:bg-green-50"
                          title="Distribute Batch"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBatch(batch.batchId || batch.id)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                          title="Delete Batch"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const JobDistributionModal = ({ isOpen, onClose, distributionType, selectedBatch, companies, onSubmit, loading }) => {
    const [selectedCompanyIds, setSelectedCompanyIds] = useState([]);
    const [distributionStrategy, setDistributionStrategy] = useState('all');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      if (
        (distributionType === 'companies' || (distributionType === 'batch' && distributionStrategy === 'companies')) &&
        selectedCompanyIds.length === 0
      ) {
        alert('Please select at least one company');
        return;
      }
      onSubmit({ companyIds: selectedCompanyIds, strategy: distributionStrategy });
    };

    const getModalTitle = () => {
      switch (distributionType) {
        case 'batch':
          return `Distribute Batch ${selectedBatch}`;
        case 'all':
          return 'Distribute All Undistributed Jobs';
        case 'companies':
          return 'Distribute Jobs to Specific Companies';
        default:
          return 'Job Distribution';
      }
    };

    const getModalDescription = () => {
      switch (distributionType) {
        case 'batch':
          return 'Select companies to receive jobs from this specific batch.';
        case 'all':
          return 'This will distribute all undistributed jobs to all active companies.';
        case 'companies':
          return 'Select specific companies to receive undistributed jobs.';
        default:
          return '';
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{getModalTitle()}</h2>
              <p className="text-sm text-gray-600 mt-1">{getModalDescription()}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {distributionType !== 'all' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Companies
                </label>
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md p-3 space-y-2">
                  {companies.map(company => (
                    <label key={company.id || company._id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedCompanyIds.includes(company.id || company._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCompanyIds([...selectedCompanyIds, company.id || company._id]);
                          } else {
                            setSelectedCompanyIds(selectedCompanyIds.filter(id => id !== (company.id || company._id)));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {company.companyName || company.name}
                        </span>
                        <p className="text-xs text-gray-500">
                          {company.adminEmail || company.email}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                {companies.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">No companies available</p>
                )}
              </div>
            )}

            {distributionType === 'batch' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distribution Strategy
                </label>
                <select
                  value={distributionStrategy}
                  onChange={(e) => setDistributionStrategy(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Distribute to all companies</option>
                  <option value="companies">Distribute to selected companies only</option>
                </select>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
                      </button>
              <button
                type="submit"
                disabled={
                  loading ||
                  (
                    distributionType !== 'all' &&
                    distributionStrategy === 'companies' &&
                    selectedCompanyIds.length === 0
                  )
                }
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    <span>Execute Distribution</span>
                  </>
                )}
                      </button>
                    </div>
          </form>
        </div>
      </div>
    );
  };

  // Add this new component after the existing modal components (around line 950)

  const BatchDetailsModal = ({ isOpen, onClose, batchDetails, batchId }) => {
    if (!isOpen || !batchDetails) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Batch Details - {batchId}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Batch Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium mb-3">Batch Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Platform:</span>
                  <p className="text-gray-600 capitalize">{batchDetails.platform}</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <p className="text-gray-600">{batchDetails.status}</p>
                </div>
                <div>
                  <span className="font-medium">Total Jobs:</span>
                  <p className="text-gray-600">{batchDetails.count}</p>
                </div>
                <div>
                  <span className="font-medium">Created:</span>
                  <p className="text-gray-600">
                    {new Date(batchDetails.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Jobs List */}
            {batchDetails.jobs && batchDetails.jobs.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Jobs in Batch</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Title
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Company
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Location
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {batchDetails.jobs.map((job, index) => (
                        <tr key={job.id || index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {job.title || 'N/A'}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600">
                            {job.company || 'N/A'}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600">
                            {job.location || 'N/A'}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${job.status === 'distributed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                              }`}>
                              {job.status || 'pending'}
                            </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
                </div>
              </div>
            )}

            {/* Distribution Info */}
            {batchDetails.distribution && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium mb-3">Distribution Information</h3>
                <div className="text-sm text-gray-700">
                  <p><span className="font-medium">Strategy:</span> {batchDetails.distribution.strategy}</p>
                  <p><span className="font-medium">Companies:</span> {batchDetails.distribution.companyCount || 0}</p>
                  <p><span className="font-medium">Distributed:</span> {batchDetails.distribution.distributedCount || 0}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
        </div>
      </div>
    </div>
  );
  };

  const PlansTab = () => (
    <div className="space-y-6">
      {/* Add Header with Create Plan Button */}
      <div className="flex justify-between items-center">
        <div>
        <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
          <p className="text-sm text-gray-600 mt-1">Manage subscription plans and pricing</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={loadInitialData}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Loading...' : 'Refresh'}</span>
          </button>
          <button
            onClick={() => setShowCreatePlan(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Plan</span>
          </button>
        </div>
      </div>
  
      {/* Plans Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Plans</p>
              <p className="text-2xl font-semibold text-gray-900">{plans.length}</p>
            </div>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Subscriptions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {subscriptionStats?.totalSubscriptions || 0}
              </p>
            </div>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Subscriptions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {subscriptionStats?.activeSubscriptions || 0}
              </p>
            </div>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${subscriptionStats?.revenue?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>
  
      {/* Plan Breakdown Chart */}
      {subscriptionStats?.planBreakdown && Object.keys(subscriptionStats.planBreakdown).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Plan Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(subscriptionStats.planBreakdown).map(([planName, count]) => (
              <div key={planName} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{planName} Plan</div>
              </div>
            ))}
          </div>
        </div>
      )}
  
      {/* Plans Table - Updated to show correct fields */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Subscription Plans</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <CreditCard className="h-4 w-4" />
              <span>{plans.length} plans</span>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading plans...</span>
            </div>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CreditCard size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No subscription plans yet</h3>
            <p className="text-gray-500 mb-4">Create your first subscription plan to get started.</p>
        <button
          onClick={() => setShowCreatePlan(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Plan
        </button>
      </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jobs Quota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Features
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plans.map((plan) => (
                  <tr key={plan.id || plan._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                        <div className="text-sm font-medium text-gray-900">{plan.displayName}</div>
                      <div className="text-sm text-gray-500">{plan.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {plan.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium">${plan.price}</span>
                      </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{plan.duration} days</span>
                      </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <Database className="h-4 w-4 text-orange-600" />
                        <span className="font-medium">{plan.jobsQuota}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="max-w-xs">
                        {plan.features && plan.features.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {plan.features.slice(0, 2).map((feature, index) => (
                              <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                {feature}
                              </span>
                            ))}
                            {plan.features.length > 2 && (
                              <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                +{plan.features.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">No features</span>
                        )}
                      </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                    <button
                          onClick={() => openEditPlan(plan)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                          title="Edit Plan"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan.id || plan._id)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                          title="Delete Plan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );

  // Add the EditPlanModal component after the existing modals
  const EditPlanModal = ({ isOpen, onClose, plan, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
      displayName: '',
      description: '',
      price: '',
      duration: '',
      jobsQuota: '',
      features: []
    });
  
    useEffect(() => {
      if (plan) {
        setFormData({
          displayName: plan.displayName || '',
          description: plan.description || '',
          price: plan.price?.toString() || '',
          duration: plan.duration?.toString() || '',
          jobsQuota: plan.jobsQuota?.toString() || '',
          features: plan.features || []
        });
      }
    }, [plan]);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };
  
    const addFeature = () => {
      const newFeature = prompt('Enter feature name:');
      if (newFeature && newFeature.trim()) {
        setFormData(prev => ({
          ...prev,
          features: [...prev.features, newFeature.trim()]
        }));
      }
    };
  
    const removeFeature = (index) => {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    };
  
    if (!isOpen || !plan) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Edit Plan - {plan.displayName}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
  
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="edit-displayName" className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name *
                </label>
                <input
                  type="text"
                  id="edit-displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
  
              <div>
                <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="edit-price"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
  
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="edit-description"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="edit-duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Days) *
                </label>
                <input
                  type="number"
                  id="edit-duration"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
  
              <div>
                <label htmlFor="edit-jobsQuota" className="block text-sm font-medium text-gray-700 mb-2">
                  Jobs Quota *
                </label>
                <input
                  type="number"
                  id="edit-jobsQuota"
                  min="1"
                  value={formData.jobsQuota}
                  onChange={(e) => setFormData({ ...formData, jobsQuota: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Features
              </label>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...formData.features];
                        newFeatures[index] = e.target.value;
                        setFormData({ ...formData, features: newFeatures });
                      }}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-2 p-2 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Feature</span>
                </button>
              </div>
            </div>
  
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Updating...' : 'Update Plan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };



  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'companies':
        return <CompaniesTab />;
      case 'batches':
        return <BatchesTab />;
      case 'plans':
        return <PlansTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      onRefresh={loadInitialData}
    >
      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Tab Content */}
      {renderTabContent()}



      {/* Enhanced Modals */}
      <CreateCompanyModal
        isOpen={showCreateCompany}
        onClose={() => setShowCreateCompany(false)}
        onSubmit={handleCreateCompany}
        plans={plans}
        loading={loading}
      />

      {/* Primary modals (single instances) */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => {
          setShowSubscriptionModal(false);
          setSelectedCompany(null);
        }}
        company={selectedCompany}
        plans={plans}
        onSubmit={handleUpdateSubscription}
        loading={loading}
      />

      {/* Distribution modal wired to execute distribution with branching */}
      <JobDistributionModal
        isOpen={showDistributionModal}
        onClose={() => {
          setShowDistributionModal(false);
          setSelectedBatch(null);
        }}
        distributionType={distributionType}
        selectedBatch={selectedBatch}
        companies={companies}
        onSubmit={handleExecuteDistribution}
        loading={distributionLoading}
      />

      <CreatePlanModal
        isOpen={showCreatePlan}
        onClose={() => setShowCreatePlan(false)}
        onSubmit={handleCreatePlan}
        loading={loading}
      />

      <EditPlanModal
        isOpen={showEditPlan}
        onClose={() => {
          setShowEditPlan(false);
          setEditingPlan(null);
          setPlanForm({ name: '', identifier: '', price: '', jobsQuota: '', features: [] });
        }}
        plan={editingPlan}
        onSubmit={handleEditPlan}
        loading={loading}
      />

      <BatchDetailsModal
        isOpen={showBatchDetailsModal}
        onClose={() => {
          setShowBatchDetailsModal(false);
          setSelectedBatchForDetails(null);
          setBatchDetails(null);
        }}
        batchDetails={batchDetails}
        batchId={selectedBatchForDetails}
      />

      {/* Remove duplicate modal instances to avoid conflicting handlers */}
    </Layout>
  );
};

export default SuperAdminDashboard;



