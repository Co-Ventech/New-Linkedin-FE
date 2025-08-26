import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, isCompanyAdmin, selectCompany } from '../slices/userSlice';
import { CreateUserModal } from '../components/CreateUserModal';
import { EditUserModal } from '../components/EditUserModal';
import { AssignJobsModal } from '../components/AssignJobsModal';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/authApi';
// import {  isCompanyAdmin, selectCompany } from '../slices/userSlice';
import {
  BarChart3,
  Users,
  Database,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  UserPlus,
  Building2,
  TrendingUp,
  Activity,
  X,
  LogOut,
  CreditCard
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_REMOTE_HOST ;

const CompanyAdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const companyState = useSelector(selectCompany);
  const company = useSelector(selectCompany);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Data states
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [activities, setActivities] = useState([]);

  // Modal states
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showAssignJobs, setShowAssignJobs] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [subscription, setSubscription] = useState(null);
//  const [overview, setOverview] = useState({ statusBreakdown: {}, userActivity: [] });
 const [overview, setOverview] = useState({
   grandTotal: {
    total_engagement: 0,
    not_engaged: 0,
    applied: 0,
     engaged: 0,
    interview: 0,
     offer: 0,
     rejected: 0,
     onboard: 0
   },
  dailyTotals: [],
   users: []
 });


  const companyId = user?.companyId || companyState?._id || companyState?.id;
  const getEffectiveCompanyId = () =>
    user?.companyId ||
    companyState?._id || companyState?.id ||
    (jobs && jobs.length > 0 ? jobs[0].companyId : undefined);
    

  // Form states
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'company_user'
  });

  const [assignForm, setAssignForm] = useState({
    userId: '',
    jobIds: []
  });


  // Replace the incorrect API calls with the correct ones

  // 1. Fix the createUser function (around line 140)
  const createUser = async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  // 2. Fix the updateUser function (around line 160)
  const updateUser = async (userId, userData) => {
    try {
      const response = await fetch(`${API_BASE}/api/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          isActive: userData.isActive
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // 3. Fix the deleteUser function (around line 180)
  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/api/users`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  // 4. Add the missing changePassword function
  const changePassword = async (userId, passwordData) => {
    try {
      const response = await fetch(`${API_BASE}/api/users/${userId}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          newPassword: passwordData.newPassword
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  };

  // 5. Add the missing hardResetPassword function
  const hardResetPassword = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}/hard-reset-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error hard resetting password:', error);
      throw error;
    }
  };


  // Fetch company subscriptio
  const fetchCompanySubscription = async (idParam) => {
    try {
      const id = idParam || getEffectiveCompanyId();
      if (!id) return null;
      const res = await fetch(`${API_BASE}/api/companies/${id}/subscription`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.subscription || null;
    } catch {
      return null;
    }
  };
  // 6. Fix the fetchUsers function (around line 200)
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // Handle the response structure: { users: [...] }
      return result.users || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  // Check role access
  if (!isCompanyAdmin(user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <X className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only company administrators can access this dashboard.</p>
        </div>
      </div>
    );
  }

  const fetchCompanyStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/company/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching company stats:', error);
      throw error;
    }
  };

  // Load initial data with improved error handling
  // replace your loadInitialData with:
  const loadInitialData = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Phase 1: users/jobs/stats
      const baseResults = await Promise.allSettled([
        fetchUsers(),
        fetchCompanyJobs(),
        fetchCompanyStats(),
        fetchJobsOverview()
      ]);

      if (baseResults[0].status === 'fulfilled') setUsers(baseResults[0].value);
      else setMessage({ type: 'error', text: 'Failed to load users' });

      if (baseResults[1].status === 'fulfilled') setJobs(baseResults[1].value);
      else setMessage({ type: 'error', text: 'Failed to load jobs' });

      if (baseResults[2].status === 'fulfilled') setStats(baseResults[2].value || {});
      else setMessage({ type: 'error', text: 'Failed to load stats' });

      if (baseResults[3].status === 'fulfilled' && baseResults[3].value) {
        setOverview(baseResults[3].value);
      } else {
        setOverview({
          grandTotal: {
            total_engagement: 0, not_engaged: 0, applied: 0, engaged: 0,
            interview: 0, offer: 0, rejected: 0, onboard: 0
          },
          dailyTotals: [],
          users: []
        });
      }

      // Phase 2: derive companyId and fetch subscription + activity
      const cid = getEffectiveCompanyId();
      const tailResults = await Promise.allSettled([
        fetchCompanySubscription(cid)
      ]);

      if (tailResults[0].status === 'fulfilled') setSubscription(tailResults[0].value);
      else setSubscription(null);

      if (tailResults[1].status === 'fulfilled') setActivities(Array.isArray(tailResults[1].value) ? tailResults[1].value : []);
      else setActivities([]);

    } catch {
      setMessage({ type: 'error', text: 'Failed to load initial data' });
    } finally {
      setLoading(false);
    }
  };


  // 3. Add the missing fetchCompanyJobs function
  const fetchCompanyJobs = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/company-jobs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.jobs || [];
    } catch (error) {
      console.error('Error fetching company jobs:', error);
      throw error;
    }
  };

  const fetchJobsOverview = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/company-jobs/stats/overview`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return {
        grandTotal: {
          total_engagement: data?.grandTotal?.total_engagement ?? 0,
          not_engaged: data?.grandTotal?.not_engaged ?? 0,
          applied: data?.grandTotal?.applied ?? 0,
          engaged: data?.grandTotal?.engaged ?? 0,
          interview: data?.grandTotal?.interview ?? 0,
          offer: data?.grandTotal?.offer ?? 0,
          rejected: data?.grandTotal?.rejected ?? 0,
          onboard: data?.grandTotal?.onboard ?? 0
        },
        dailyTotals: Array.isArray(data?.dailyTotals) ? data.dailyTotals : [],
        users: Array.isArray(data?.users) ? data.users : []
      };
    } catch (err) {
      console.error('Overview stats fetch error:', err);
      return {
        grandTotal: {
          total_engagement: 0, not_engaged: 0, applied: 0, engaged: 0,
          interview: 0, offer: 0, rejected: 0, onboard: 0
        },
        dailyTotals: [],
        users: []
      };
    }
  };
  // 4. Add the missing fetchCompanyStats function
  // Company stats


  // Activity feed (optional endpoint; handled gracefully if missing)
  // const fetchCompanyActivity = async () => {
  //   try {
  //     const res = await fetch(`${API_BASE}/api/company/activity`, {
  //       headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
  //     });
  //     if (!res.ok) return []; // tolerate 404
  //     const data = await res.json();
  //     return Array.isArray(data.activities) ? data.activities : (Array.isArray(data) ? data : []);
  //   } catch {
  //     return [];
  //   }
  // };

  useEffect(() => {
    if (!subscription && jobs.length > 0) {
      const cid = getEffectiveCompanyId();
      if (cid) {
        fetchCompanySubscription(cid).then(setSubscription).catch(() => { });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs]);

  useEffect(() => {
      loadInitialData();
  }, []);
  

  // Message handling with auto-dismiss
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // User operations
  const handleCreateUser = async (userData) => {
    if (!userData.username || !userData.email || !userData.password) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }

    try {
      setLoading(true);
      const result = await createUser(userData);

      if (result.message === 'User created successfully') {
        setMessage({ type: 'success', text: 'User created successfully!' });
        setUserForm({ username: '', email: '', password: '', role: 'company_user' });
        setShowCreateUser(false);
        await loadInitialData();
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to create user' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to create user' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      showMessage('success', 'User updated successfully!');
      setShowEditUser(false);
      setSelectedUser(null);
      await loadInitialData();
    } catch (error) {
      console.error('Error updating user:', error);
      showMessage('error', error.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      showMessage('success', 'User deleted successfully!');
      await loadInitialData();
    } catch (error) {
      console.error('Error deleting user:', error);
      showMessage('error', error.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  // Job operations
  const handleAssignJobs = async (assignmentData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/company/jobs/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(assignmentData)
      });

      if (!response.ok) {
        throw new Error('Failed to assign jobs');
      }

      showMessage('success', 'Jobs assigned successfully!');
      setShowAssignJobs(false);
      setAssignForm({ userId: '', jobIds: [] });
      setSelectedJobs([]);
      await loadInitialData();
    } catch (error) {
      console.error('Error assigning jobs:', error);
      showMessage('error', error.message || 'Failed to assign jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpdateJobs = async (status) => {
    if (selectedJobs.length === 0) {
      showMessage('error', 'Please select jobs to update');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/company/jobs/bulk-update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ jobIds: selectedJobs, status })
      });

      if (!response.ok) {
        throw new Error('Failed to update jobs');
      }

      showMessage('success', `Jobs updated to ${status} successfully!`);
      setSelectedJobs([]);
      await loadInitialData();
    } catch (error) {
      console.error('Error updating jobs:', error);
      showMessage('error', error.message || 'Failed to update jobs');
    } finally {
      setLoading(false);
    }
  };

  const toggleJobSelection = (jobId) => {
    setSelectedJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  // Tab content components
  // Overview Tab (cards updated)
  // const OverviewTab = () => {
  //   const totalUsers = users.length;
  //   const activeUsers = users.filter(u => u.isActive).length;
  //   const totalJobs = jobs.length;
  //   const assignedJobs = typeof stats.assignedJobs === 'number'
  //     ? stats.assignedJobs
  //     : jobs.filter(j => !!j.assignee).length;

  //   return (
  //     <div className="space-y-6">
  //       <div className="flex justify-between items-center">
  //         <h2 className="text-2xl font-bold text-gray-900">Company Overview</h2>
  //         {/* <button
  //           onClick={loadInitialData}
  //           disabled={loading}
  //           className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
  //         >
  //           <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
  //           <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
  //         </button> */}
  //       </div>

  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  //         <div className="bg-white rounded-lg shadow p-6">
  //           <div className="flex items-center">
  //             <div className="p-2 bg-purple-100 rounded-lg">
  //               <Users className="h-6 w-6 text-purple-600" />
  //             </div>
  //             <div className="ml-4">
  //               <p className="text-sm font-medium text-gray-600">Total Users</p>
  //               <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="bg-white rounded-lg shadow p-6">
  //           <div className="flex items-center">
  //             <div className="p-2 bg-green-100 rounded-lg">
  //               <CheckCircle className="h-6 w-6 text-green-600" />
  //             </div>
  //             <div className="ml-4">
  //               <p className="text-sm font-medium text-gray-600">Active Users</p>
  //               <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="bg-white rounded-lg shadow p-6">
  //           <div className="flex items-center">
  //             <div className="p-2 bg-blue-100 rounded-lg">
  //               <Database className="h-6 w-6 text-blue-600" />
  //             </div>
  //             <div className="ml-4">
  //               <p className="text-sm font-medium text-gray-600">Total Jobs</p>
  //               <p className="text-2xl font-bold text-gray-900">{totalJobs}</p>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="bg-white rounded-lg shadow p-6">
  //           <div className="flex items-center">
  //             <div className="p-2 bg-yellow-100 rounded-lg">
  //               <Clock className="h-6 w-6 text-yellow-600" />
  //             </div>
  //             <div className="ml-4">
  //               <p className="text-sm font-medium text-gray-600">Assigned Jobs</p>
  //               <p className="text-2xl font-bold text-gray-900">{assignedJobs}</p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Status Breakdown cards */}
  //       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
  //         {[
  //                 { key: 'not_engaged', label: 'Not Engaged', color: 'bg-gray-100 text-gray-700' },
  //           { key: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-700' },
  //           { key: 'interview', label: 'Interview', color: 'bg-purple-100 text-purple-700' },
  //           { key: 'offer', label: 'Offer', color: 'bg-emerald-100 text-emerald-700' },
  //           { key: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
      
  //         ].map(item => (
  //           <div key={item.key} className="bg-white rounded-lg shadow p-4">
  //             <div className="text-sm text-gray-500">{item.label}</div>
  //             <div className="mt-1 flex items-baseline justify-between">
  //               <div className="text-2xl font-semibold text-gray-900">
  //                 {overview.statusBreakdown?.[item.key] ?? 0}
  //               </div>
  //               <span className={`px-2 py-1 rounded text-xs font-medium ${item.color}`}>
  //                 {item.label}
  //               </span>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //       {/* User Activity list */}
  //       <div className="bg-white rounded-lg shadow mt-6">
  //         <div className="px-6 py-4 border-b border-gray-200">
  //           <h3 className="text-lg font-medium text-gray-900">User Activity</h3>
  //         </div>
  //         <div className="p-6">
  //           {overview.userActivity.length === 0 ? (
  //             <div className="text-center text-gray-500">No user activity yet.</div>
  //           ) : (
  //             <div className="overflow-x-auto">
  //               <table className="min-w-full divide-y divide-gray-200">
  //                 <thead className="bg-gray-50">
  //                   <tr>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Changes</th>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Activity</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody className="bg-white divide-y divide-gray-200">
  //                   {overview.userActivity.map((u, i) => (
  //                     <tr key={i} className="hover:bg-gray-50">
  //                       <td className="px-6 py-3 text-sm text-gray-900">{u.username || u._id}</td>
  //                       <td className="px-6 py-3 text-sm font-medium text-gray-900">{u.statusChanges ?? 0}</td>
  //                       <td className="px-6 py-3 text-sm text-gray-600">
  //                         {u.lastActivity ? new Date(u.lastActivity).toLocaleString() : '—'}
  //                       </td>
  //                     </tr>
  //                   ))}
  //                 </tbody>
  //               </table>
  //             </div>
  //           )}
  //         </div>
  //       </div>

  //       {/* Recent Activity */}
  //       <div className="bg-white rounded-lg shadow">
  //         <div className="px-6 py-4 border-b border-gray-200">
  //           <div className="flex items-center space-x-2">
  //             <Activity className="h-5 w-5 text-gray-500" />
  //             <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
  //           </div>
  //         </div>
  //         <div className="p-6">
  //           {activities.length === 0 ? (
  //             <div className="text-center py-8">
  //               <Database className="mx-auto h-12 w-12 text-gray-300 mb-4" />
  //               <p className="text-gray-500">No recent activity.</p>
  //             </div>
  //           ) : (
  //             <div className="space-y-3">
  //               {activities.slice(0, 8).map((item, idx) => (
  //                 <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100">
  //                   <div className="flex items-center space-x-3">
  //                     <div className={`w-2 h-2 rounded-full ${item.type === 'subscription_updated' ? 'bg-purple-500' : 'bg-blue-500'}`} />
  //                     <div>
  //                       <p className="font-medium text-gray-900">{item.message || item.title || 'Activity'}</p>
  //                       <p className="text-sm text-gray-600">
  //                         {item.type === 'subscription_updated' ? 'Subscription updated' : (item.type || 'Update')}
  //                       </p>
  //                     </div>
  //                   </div>
  //                   <div className="text-sm text-gray-500">
  //                     {item.date ? new Date(item.date).toLocaleString() : ''}
  //                   </div>
  //                 </div>
  //               ))}
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

    // Overview Tab (cards updated to match new API: grandTotal, users, dailyTotals)
    // const OverviewTab = () => {
    //   const totalUsers = users.length;
    //   const activeUsers = users.filter(u => u.isActive).length;
    //   const totalJobs = jobs.length;
    //   const assignedJobs = typeof stats.assignedJobs === 'number'
    //     ? stats.assignedJobs
    //     : jobs.filter(j => !!j.assignee).length;
  
    //   const gt = overview.grandTotal || {};
    //   const statusCards = [
    //     { key: 'not_engaged', label: 'Not Engaged', color: 'bg-gray-100 text-gray-700' },
    //     { key: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-700' },
    //     { key: 'engaged', label: 'Engaged', color: 'bg-indigo-100 text-indigo-700' },
    //     { key: 'interview', label: 'Interview', color: 'bg-purple-100 text-purple-700' },
    //     { key: 'offer', label: 'Offer', color: 'bg-emerald-100 text-emerald-700' },
    //     { key: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
    //     { key: 'onboard', label: 'Onboard', color: 'bg-teal-100 text-teal-700' }
    //   ];
  
    //   const maxDaily = Math.max(
    //     1,
    //     ...overview.dailyTotals.map(d => Number(d.total_engagement) || 0)
    //   );
  
    //   return (
    //     <div className="space-y-6">
    //       <div className="flex justify-between items-center">
    //         <h2 className="text-2xl font-bold text-gray-900">Company Overview</h2>
    //       </div>
  
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    //         <div className="bg-white rounded-lg shadow p-6">
    //           <div className="flex items-center">
    //             <div className="p-2 bg-purple-100 rounded-lg">
    //               <Users className="h-6 w-6 text-purple-600" />
    //             </div>
    //             <div className="ml-4">
    //               <p className="text-sm font-medium text-gray-600">Total Users</p>
    //               <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
    //             </div>
    //           </div>
    //         </div>
  
    //         <div className="bg-white rounded-lg shadow p-6">
    //           <div className="flex items-center">
    //             <div className="p-2 bg-green-100 rounded-lg">
    //               <CheckCircle className="h-6 w-6 text-green-600" />
    //             </div>
    //             <div className="ml-4">
    //               <p className="text-sm font-medium text-gray-600">Active Users</p>
    //               <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
    //             </div>
    //           </div>
    //         </div>
  
    //         <div className="bg-white rounded-lg shadow p-6">
    //           <div className="flex items-center">
    //             <div className="p-2 bg-blue-100 rounded-lg">
    //               <Database className="h-6 w-6 text-blue-600" />
    //             </div>
    //             <div className="ml-4">
    //               <p className="text-sm font-medium text-gray-600">Total Jobs</p>
    //               <p className="text-2xl font-bold text-gray-900">{totalJobs}</p>
    //             </div>
    //           </div>
    //         </div>
  
    //         <div className="bg-white rounded-lg shadow p-6">
    //           <div className="flex items-center">
    //             <div className="p-2 bg-yellow-100 rounded-lg">
    //               <Clock className="h-6 w-6 text-yellow-600" />
    //             </div>
    //             <div className="ml-4">
    //               <p className="text-sm font-medium text-gray-600">Assigned Jobs</p>
    //               <p className="text-2xl font-bold text-gray-900">{assignedJobs}</p>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
  
    //       {/* Company Status Breakdown (grandTotal) */}
    //       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
    //         {statusCards.map(item => (
    //           <div key={item.key} className="bg-white rounded-lg shadow p-4">
    //             <div className="text-sm text-gray-500">{item.label}</div>
    //             <div className="mt-1 flex items-baseline justify-between">
    //               <div className="text-2xl font-semibold text-gray-900">
    //                 {gt[item.key] ?? 0}
    //               </div>
    //               <span className={`px-2 py-1 rounded text-xs font-medium ${item.color}`}>
    //                 {item.label}
    //               </span>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
  
    //       {/* Daily Engagement Trend */}
    //       <div className="bg-white rounded-lg shadow p-6">
    //         <div className="flex items-center justify-between mb-4">
    //           <div className="flex items-center space-x-2">
    //             <TrendingUp className="h-5 w-5 text-gray-500" />
    //             <h3 className="text-lg font-medium text-gray-900">Daily Engagement Trend</h3>
    //           </div>
    //           <div className="text-sm text-gray-500">Total: {gt.total_engagement ?? 0}</div>
    //         </div>
    //         {overview.dailyTotals.length === 0 ? (
    //           <div className="text-center text-gray-500">No trend data.</div>
    //         ) : (
    //           <div className="h-40 flex items-end space-x-2">
    //             {overview.dailyTotals
    //               .slice()
    //               .sort((a, b) => new Date(a.date) - new Date(b.date))
    //               .map((d, idx) => {
    //                 const h = Math.round(((Number(d.total_engagement) || 0) / maxDaily) * 100);
    //                 return (
    //                   <div key={idx} className="flex-1 flex flex-col items-center">
    //                     <div className="w-full bg-indigo-500 rounded-t" style={{ height: `${h}%` }} />
    //                     <div className="mt-1 text-[10px] text-gray-500 rotate-0">
    //                       {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: '2-digit' })}
    //                     </div>
    //                   </div>
    //                 );
    //               })}
    //           </div>
    //         )}
    //         <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-700">
    //           <div>Applied: {overview.grandTotal.applied ?? 0}</div>
    //           <div>Engaged: {overview.grandTotal.engaged ?? 0}</div>
    //           <div>Interview: {overview.grandTotal.interview ?? 0}</div>
    //           <div>Offer: {overview.grandTotal.offer ?? 0}</div>
    //           <div>Rejected: {overview.grandTotal.rejected ?? 0}</div>
    //           <div>Onboard: {overview.grandTotal.onboard ?? 0}</div>
    //         </div>
    //       </div>
  
    //       {/* Team Performance */}
    //       <div className="bg-white rounded-lg shadow">
    //         <div className="px-6 py-4 border-b border-gray-200">
    //           <div className="flex items-center space-x-2">
    //             <Users className="h-5 w-5 text-gray-500" />
    //             <h3 className="text-lg font-medium text-gray-900">Team Performance</h3>
    //           </div>
    //         </div>
    //         <div className="p-6">
    //           {overview.users.length === 0 ? (
    //             <div className="text-center text-gray-500">No user performance data.</div>
    //           ) : (
    //             <div className="overflow-x-auto">
    //               <table className="min-w-full divide-y divide-gray-200">
    //                 <thead className="bg-gray-50">
    //                   <tr>
    //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
    //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
    //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engaged</th>
    //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interview</th>
    //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer</th>
    //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rejected</th>
    //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Not Engaged</th>
    //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
    //                   </tr>
    //                 </thead>
    //                 <tbody className="bg-white divide-y divide-gray-200">
    //                   {overview.users.map((u, i) => {
    //                     const s = u.statuses || {};
    //                     const total =
    //                       (s.applied || 0) + (s.engaged || 0) + (s.interview || 0) +
    //                       (s.offer || 0) + (s.rejected || 0) + (s.not_engaged || 0);
    //                     return (
    //                       <tr key={i} className="hover:bg-gray-50">
    //                         <td className="px-6 py-3 text-sm font-medium text-gray-900">
    //                           {u.username || u._id}
    //                         </td>
    //                         <td className="px-6 py-3 text-sm">{s.applied ?? 0}</td>
    //                         <td className="px-6 py-3 text-sm">{s.engaged ?? 0}</td>
    //                         <td className="px-6 py-3 text-sm">{s.interview ?? 0}</td>
    //                         <td className="px-6 py-3 text-sm">{s.offer ?? 0}</td>
    //                         <td className="px-6 py-3 text-sm">{s.rejected ?? 0}</td>
    //                         <td className="px-6 py-3 text-sm">{s.not_engaged ?? 0}</td>
    //                         <td className="px-6 py-3 text-sm font-semibold">{total}</td>
    //                       </tr>
    //                     );
    //                   })}
    //                 </tbody>
    //               </table>
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   );
    // };

      // Overview Tab (cards updated to match new API: grandTotal, users, dailyTotals)
  //  const OverviewTab = () => {
  //   const totalUsers = users.length;
  //   const activeUsers = users.filter(u => u.isActive).length;
  //   const totalJobs = jobs.length;
  //   const assignedJobs = typeof stats.assignedJobs === 'number'
  //     ? stats.assignedJobs
  //     : jobs.filter(j => !!j.assignee).length;

  //   const gt = overview.grandTotal || {};
  //   const statusCards = [
  //     { key: 'not_engaged', label: 'Not Engaged', color: 'bg-gray-100 text-gray-700' },
  //     { key: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-700' },
  //     { key: 'engaged', label: 'Engaged', color: 'bg-indigo-100 text-indigo-700' },
  //     { key: 'interview', label: 'Interview', color: 'bg-purple-100 text-purple-700' },
  //     { key: 'offer', label: 'Offer', color: 'bg-emerald-100 text-emerald-700' },
  //     { key: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
  //     { key: 'onboard', label: 'Onboard', color: 'bg-teal-100 text-teal-700' }
  //   ];

  //   const statusKeys = ['not_engaged','applied','engaged','interview','offer','rejected','onboard'];
  //   const statusMeta = {
  //     applied: { color: 'bg-blue-500' },
  //     engaged: { color: 'bg-indigo-500' },
  //     interview: { color: 'bg-purple-500' },
  //     offer: { color: 'bg-emerald-500' },
  //     rejected: { color: 'bg-red-500' },
  //     onboard: { color: 'bg-teal-500' },
  //     not_engaged: { color: 'bg-gray-400' }
  //   };

  //   const sortedDaily = overview.dailyTotals
  //     .slice()
  //     .sort((a, b) => new Date(a.date) - new Date(b.date));
  //   const maxDaily = Math.max(1, ...sortedDaily.map(d => Number(d.total_engagement) || 0));

  //   // Per-status max across days (for scaling each status chart)
  //   const perStatusMax = statusKeys.reduce((acc, key) => {
  //     acc[key] = Math.max(
  //       1,
  //       ...sortedDaily.map(d => Number(d[key]) || 0)
  //     );
  //     return acc;
  //   }, {});

  //   // Fixed pixel heights for bars (so charts always render)
  //   const BASE_TREND_H = 160; // px for the overall daily trend
  //   const BASE_USER_H = 200;  // px for per-user mini charts
  //   const BASE_STATUS_H = 160; // px for per-status daily charts

  //   return (
  //     <div className="space-y-6">
  //       <div className="flex justify-between items-center">
  //         <h2 className="text-2xl font-bold text-gray-900">Company Overview</h2>
  //       </div>

  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  //         <div className="bg-white rounded-lg shadow p-6">
  //           <div className="flex items-center">
  //             <div className="p-2 bg-purple-100 rounded-lg">
  //               <Users className="h-6 w-6 text-purple-600" />
  //             </div>
  //             <div className="ml-4">
  //               <p className="text-sm font-medium text-gray-600">Total Users</p>
  //               <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="bg-white rounded-lg shadow p-6">
  //           <div className="flex items-center">
  //             <div className="p-2 bg-green-100 rounded-lg">
  //               <CheckCircle className="h-6 w-6 text-green-600" />
  //             </div>
  //             <div className="ml-4">
  //               <p className="text-sm font-medium text-gray-600">Active Users</p>
  //               <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="bg-white rounded-lg shadow p-6">
  //           <div className="flex items-center">
  //             <div className="p-2 bg-blue-100 rounded-lg">
  //               <Database className="h-6 w-6 text-blue-600" />
  //             </div>
  //             <div className="ml-4">
  //               <p className="text-sm font-medium text-gray-600">Total Jobs</p>
  //               <p className="text-2xl font-bold text-gray-900">{totalJobs}</p>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="bg-white rounded-lg shadow p-6">
  //           <div className="flex items-center">
  //             <div className="p-2 bg-yellow-100 rounded-lg">
  //               <Clock className="h-6 w-6 text-yellow-600" />
  //             </div>
  //             <div className="ml-4">
  //               <p className="text-sm font-medium text-gray-600">Assigned Jobs</p>
  //               <p className="text-2xl font-bold text-gray-900">{assignedJobs}</p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Company Status Breakdown (grandTotal) */}
  //       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
  //         {statusCards.map(item => (
  //           <div key={item.key} className="bg-white rounded-lg shadow p-4">
  //             <div className="text-sm text-gray-500">{item.label}</div>
  //             <div className="mt-1 flex items-baseline justify-between">
  //               <div className="text-2xl font-semibold text-gray-900">
  //                 {gt[item.key] ?? 0}
  //               </div>
  //               <span className={`px-2 py-1 rounded text-xs font-medium ${item.color}`}>
  //                 {item.label}
  //               </span>
  //             </div>
  //           </div>
  //         ))}
  //       </div>

  //       {/* Daily Engagement Trend (overall) */}
  //       <div className="bg-white rounded-lg shadow p-6">
  //         <div className="flex items-center justify-between mb-4">
  //           <div className="flex items-center space-x-2">
  //             <TrendingUp className="h-5 w-5 text-gray-500" />
  //             <h3 className="text-lg font-medium text-gray-900">Daily Engagement Trend</h3>
  //           </div>
  //           <div className="text-sm text-gray-500">Total: {gt.total_engagement ?? 0}</div>
  //         </div>
  //         {sortedDaily.length === 0 ? (
  //           <div className="text-center text-gray-500">No trend data.</div>
  //         ) : (
  //           <div className="flex items-end space-x-2" style={{ height: `${BASE_TREND_H}px` }}>
  //             {sortedDaily.map((d, idx) => {
  //               const hPx = Math.round(((Number(d.total_engagement) || 0) / maxDaily) * BASE_TREND_H);
  //               return (
  //                 <div key={idx} className="flex-1 flex flex-col items-center">
  //                   <div className="w-full bg-indigo-500 rounded-t" style={{ height: `${Math.max(2, hPx)}px` }} />
  //                   <div className="mt-1 text-[10px] text-gray-500">
  //                     {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: '2-digit' })}
  //                   </div>
  //                 </div>
  //               );
  //             })}
  //           </div>
  //         )}
  //         <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-700">
  //           <div>Applied: {overview.grandTotal.applied ?? 0}</div>
  //           <div>Engaged: {overview.grandTotal.engaged ?? 0}</div>
  //           <div>Interview: {overview.grandTotal.interview ?? 0}</div>
  //           <div>Offer: {overview.grandTotal.offer ?? 0}</div>
  //           <div>Rejected: {overview.grandTotal.rejected ?? 0}</div>
  //           <div>Onboard: {overview.grandTotal.onboard ?? 0}</div>
  //         </div>
  //       </div>

  //       {/* Team Member Mini Charts (per-user status bars) */}
  //       <div className="bg-white rounded-lg shadow">
  //         <div className="px-6 py-4 border-b border-gray-200">
  //           <div className="flex items-center space-x-2">
  //             <Users className="h-5 w-5 text-gray-500" />
  //             <h3 className="text-lg font-medium text-gray-900">Team Member Status Breakdown</h3>
  //           </div>
  //         </div>
  //         <div className="p-6">
  //           {overview.users.length === 0 ? (
  //             <div className="text-center text-gray-500">No user performance data.</div>
  //           ) : (
  //             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  //               {overview.users.map((u, idx) => {
  //                 const s = u.statuses || {};
  //                 const maxUser = Math.max(1, ...statusKeys.map(k => Number(s[k]) || 0));
  //                 return (
  //                   <div key={idx} className="border rounded-lg p-4">
  //                     <div className="mb-2 flex items-center justify-between">
  //                       <div className="font-semibold text-gray-900">{u.username || u._id}</div>
  //                       <div className="text-xs text-gray-500">
  //                         Total: {(s.applied||0)+(s.engaged||0)+(s.interview||0)+(s.offer||0)+(s.rejected||0)+(s.not_engaged||0)}
  //                       </div>
  //                     </div>
  //                     <div className="flex items-end space-x-2" style={{ height: `${BASE_USER_H}px` }}>
  //                       {statusKeys.map((k) => {
  //                         const val = Number(s[k]) || 0;
  //                         const hPx = Math.round((val / maxUser) * BASE_USER_H);
  //                         return (
  //                           <div key={k} className="flex-1 flex flex-col items-center">
  //                             <div className={`w-full ${statusMeta[k].color} rounded-t`} style={{ height: `${Math.max(2, hPx)}px` }} />
  //                             <div className="mt-1 text-[10px] text-gray-600 capitalize">{k.replace('_',' ')}</div>
  //                             <div className="text-[10px] text-gray-900">{val}</div>
  //                           </div>
  //                         );
  //                       })}
  //                     </div>
  //                   </div>
  //                 );
  //               })}
  //             </div>
  //           )}
  //         </div>
  //       </div>

  //       {/* Per-Status Daily Bar Charts */}
  //       <div className="bg-white rounded-lg shadow">
  //         <div className="px-6 py-4 border-b border-gray-200">
  //           <div className="flex items-center space-x-2">
  //             <TrendingUp className="h-5 w-5 text-gray-500" />
  //             <h3 className="text-lg font-medium text-gray-900">Status Trends by Day</h3>
  //           </div>
  //         </div>
  //         <div className="p-6 space-y-8">
  //           {statusKeys.map((k) => {
  //             const maxForStatus = perStatusMax[k] || 1;
  //             return (
  //               <div key={k}>
  //                 <div className="flex items-center justify-between mb-2">
  //                   <div className="font-medium text-gray-900 capitalize">{k.replace('_',' ')}</div>
  //                   <div className="text-xs text-gray-500">Peak: {maxForStatus}</div>
  //                 </div>
  //                 {sortedDaily.length === 0 ? (
  //                   <div className="text-sm text-gray-500">No data.</div>
  //                 ) : (
  //                   <div className="flex items-end space-x-2" style={{ height: `${BASE_STATUS_H}px` }}>
  //                     {sortedDaily.map((d, idx) => {
  //                       const val = Number(d[k]) || 0;
  //                       const hPx = Math.round((val / maxForStatus) * BASE_STATUS_H);
  //                       return (
  //                         <div key={idx} className="flex-1 flex flex-col items-center">
  //                           <div className={`w-full ${statusMeta[k].color} rounded-t`} style={{ height: `${Math.max(2, hPx)}px` }} />
  //                           <div className="mt-1 text-[10px] text-gray-500">
  //                             {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: '2-digit' })}
  //                           </div>
  //                         </div>
  //                       );
  //                     })}
  //                   </div>
  //                 )}
  //               </div>
  //             );
  //           })}
  //         </div>
  //       </div>

  //       {/* Team Performance Table */}
  //       <div className="bg-white rounded-lg shadow">
  //         <div className="px-6 py-4 border-b border-gray-200">
  //           <div className="flex items-center space-x-2">
  //             <Users className="h-5 w-5 text-gray-500" />
  //             <h3 className="text-lg font-medium text-gray-900">Team Performance</h3>
  //           </div>
  //         </div>
  //         <div className="p-6">
  //           {overview.users.length === 0 ? (
  //             <div className="text-center text-gray-500">No user performance data.</div>
  //           ) : (
  //             <div className="overflow-x-auto">
  //               <table className="min-w-full divide-y divide-gray-200">
  //                 <thead className="bg-gray-50">
  //                   <tr>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Not Engaged</th>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engaged</th>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interview</th>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer</th>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rejected</th>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Onboard</th>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody className="bg-white divide-y divide-gray-200">
  //                   {overview.users.map((u, i) => {
  //                     const s = u.statuses || {};
  //                     const total =
  //                       (s.applied || 0) + (s.engaged || 0) + (s.interview || 0) +
  //                       (s.offer || 0) + (s.rejected || 0) + (s.not_engaged || 0);
  //                     return (
  //                       <tr key={i} className="hover:bg-gray-50">
  //                         <td className="px-6 py-3 text-sm font-medium text-gray-900">
  //                           {u.username || u._id}
  //                         </td>
  //                         <td className="px-6 py-3 text-sm">{s.not_engaged ?? 0}</td>
  //                         <td className="px-6 py-3 text-sm">{s.applied ?? 0}</td>
  //                         <td className="px-6 py-3 text-sm">{s.engaged ?? 0}</td>
  //                         <td className="px-6 py-3 text-sm">{s.interview ?? 0}</td>
  //                         <td className="px-6 py-3 text-sm">{s.offer ?? 0}</td>
  //                         <td className="px-6 py-3 text-sm">{s.rejected ?? 0}</td>
  //                         <td className="px-6 py-3 text-sm">{s.onboard ?? 0}</td>
  //                         <td className="px-6 py-3 text-sm font-semibold">{total}</td>
  //                       </tr>
  //                     );
  //                   })}
  //                 </tbody>
  //               </table>
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // const OverviewTab = () => {
  //   const totalUsers = users.length;
  //   const activeUsers = users.filter(u => u.isActive).length;
  //   const totalJobs = jobs.length;
  //   const assignedJobs = typeof stats.assignedJobs === 'number'
  //     ? stats.assignedJobs
  //     : jobs.filter(j => !!j.assignee).length;

  //   const gt = overview.grandTotal || {};
  //   const statusCards = [
  //     { key: 'not_engaged', label: 'Not Engaged', color: 'bg-gray-100 text-gray-700' },
  //     { key: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-700' },
  //     { key: 'engaged', label: 'Engaged', color: 'bg-indigo-100 text-indigo-700' },
  //     { key: 'interview', label: 'Interview', color: 'bg-purple-100 text-purple-700' },
  //     { key: 'offer', label: 'Offer', color: 'bg-emerald-100 text-emerald-700' },
  //     { key: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
  //     { key: 'onboard', label: 'Onboard', color: 'bg-teal-100 text-teal-700' }
  //   ];

  //   const statusKeys = ['not_engaged','applied','engaged','interview','offer','rejected','onboard'];
  //   const statusMeta = {
  //     applied: { color: 'bg-blue-500' },
  //     engaged: { color: 'bg-indigo-500' },
  //     interview: { color: 'bg-purple-500' },
  //     offer: { color: 'bg-emerald-500' },
  //     rejected: { color: 'bg-red-500' },
  //     onboard: { color: 'bg-teal-500' },
  //     not_engaged: { color: 'bg-gray-400' }
  //   };

  //   // Helpers: normalize dates to continuous range (fill gaps with 0s)
  //   const toYmd = (d) => {
  //     const dt = new Date(d);
  //     const y = dt.getFullYear();
  //     const m = String(dt.getMonth() + 1).padStart(2, '0');
  //     const day = String(dt.getDate()).padStart(2, '0');
  //     return `${y}-${m}-${day}`;
  //   };

  //   const buildDateRange = (startYmd, endYmd) => {
  //     const out = [];
  //     const start = new Date(startYmd + 'T00:00:00');
  //     const end = new Date(endYmd + 'T00:00:00');
  //     for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
  //       out.push(toYmd(d));
  //     }
  //     return out;
  //   };

  //   // Prepare daily totals with gaps filled
  //   const rawDaily = Array.isArray(overview.dailyTotals) ? overview.dailyTotals : [];
  //   const datesInData = rawDaily.map(d => toYmd(d.date || d._id || d.day || new Date()));
  //   const latestYmd = datesInData.length ? datesInData.sort().slice(-1)[0] : toYmd(new Date());
  //   // Show recent window of up to 14 days ending on latestYmd
  //   const windowSize = 14;
  //   const endDate = latestYmd;
  //   const endDt = new Date(endDate + 'T00:00:00');
  //   const startDt = new Date(endDt);
  //   startDt.setDate(startDt.getDate() - (windowSize - 1));
  //   const startDate = toYmd(startDt);

  //   const dailyMap = rawDaily.reduce((acc, d) => {
  //     const key = toYmd(d.date || d._id || d.day || new Date());
  //     acc[key] = {
  //       total_engagement: Number(d.total_engagement) || 0,
  //       ...statusKeys.reduce((o, k) => ({ ...o, [k]: Number(d[k]) || 0 }), {})
  //     };
  //     return acc;
  //   }, {});

  //   const normalizedDaily = buildDateRange(startDate, endDate).map(ymd => {
  //     const v = dailyMap[ymd] || {};
  //     return {
  //       date: ymd,
  //       total_engagement: Number(v.total_engagement) || 0,
  //       ...statusKeys.reduce((o, k) => ({ ...o, [k]: Number(v[k]) || 0 }), {})
  //     };
  //   });

  //   const maxDaily = Math.max(1, ...normalizedDaily.map(d => d.total_engagement));

  //   // Per-status max across normalized days (for scaling each status chart)
  //   const perStatusMax = statusKeys.reduce((acc, key) => {
  //     acc[key] = Math.max(1, ...normalizedDaily.map(d => Number(d[key]) || 0));
  //     return acc;
  //   }, {});

  //   // Fixed pixel heights for bars
  //   const BASE_TREND_H = 180;  // overall daily trend
  //   const BASE_USER_H = 160;   // per-user mini charts
  //   const BASE_STATUS_H = 96;  // per-status daily charts (compact)

  //   return (
  //     <div className="space-y-6">
  //       <div className="flex justify-between items-center">
  //         <h2 className="text-2xl font-bold text-gray-900">Company Overview</h2>
  //       </div>

  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  //         <div className="bg-white rounded-lg shadow p-6">
  //           <div className="flex items-center">
  //             <div className="p-2 bg-purple-100 rounded-lg">
  //               <Users className="h-6 w-6 text-purple-600" />
  //             </div>
  //             <div className="ml-4">
  //               <p className="text-sm font-medium text-gray-600">Total Users</p>
  //               <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="bg-white rounded-lg shadow p-6">
  //           <div className="flex items-center">
  //             <div className="p-2 bg-green-100 rounded-lg">
  //               <CheckCircle className="h-6 w-6 text-green-600" />
  //             </div>
  //             <div className="ml-4">
  //               <p className="text-sm font-medium text-gray-600">Active Users</p>
  //               <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="bg-white rounded-lg shadow p-6">
  //           <div className="flex items-center">
  //             <div className="p-2 bg-blue-100 rounded-lg">
  //               <Database className="h-6 w-6 text-blue-600" />
  //             </div>
  //             <div className="ml-4">
  //               <p className="text-sm font-medium text-gray-600">Total Jobs</p>
  //               <p className="text-2xl font-bold text-gray-900">{totalJobs}</p>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="bg-white rounded-lg shadow p-6">
  //           <div className="flex items-center">
  //             <div className="p-2 bg-yellow-100 rounded-lg">
  //               <Clock className="h-6 w-6 text-yellow-600" />
  //             </div>
  //             <div className="ml-4">
  //               <p className="text-sm font-medium text-gray-600">Assigned Jobs</p>
  //               <p className="text-2xl font-bold text-gray-900">{assignedJobs}</p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Company Status Breakdown (grandTotal) */}
  //       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
  //         {statusCards.map(item => (
  //           <div key={item.key} className="bg-white rounded-lg shadow p-4">
  //             <div className="text-sm text-gray-500">{item.label}</div>
  //             <div className="mt-1 flex items-baseline justify-between">
  //               <div className="text-2xl font-semibold text-gray-900">
  //                 {gt[item.key] ?? 0}
  //               </div>
  //               <span className={`px-2 py-1 rounded text-xs font-medium ${item.color}`}>
  //                 {item.label}
  //               </span>
  //             </div>
  //           </div>
  //         ))}
  //       </div>

  //       {/* Daily Engagement Trend (overall) */}
  //       <div className="bg-white rounded-lg shadow p-6">
  //         <div className="flex items-center justify-between mb-4">
  //           <div className="flex items-center space-x-2">
  //             <TrendingUp className="h-5 w-5 text-gray-500" />
  //             <h3 className="text-lg font-medium text-gray-900">Daily Engagement Trend</h3>
  //           </div>
  //           <div className="text-sm text-gray-500">Total: {gt.total_engagement ?? 0}</div>
  //         </div>
  //         {normalizedDaily.length === 0 ? (
  //           <div className="text-center text-gray-500">No trend data.</div>
  //         ) : (
  //           <div className="flex items-end space-x-2" style={{ height: `${BASE_TREND_H}px` }}>
  //             {normalizedDaily.map((d, idx) => {
  //               const val = Number(d.total_engagement) || 0;
  //               const hPx = Math.round((val / maxDaily) * BASE_TREND_H);
  //               const label = new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
  //               return (
  //                 <div key={idx} className="flex-1 flex flex-col items-center">
  //                   <div className="text-[10px] text-gray-700 mb-1 h-4">{val}</div>
  //                   <div className="w-full bg-indigo-500 rounded-t" style={{ height: `${Math.max(2, hPx)}px` }} />
  //                   <div className="mt-1 text-[10px] text-gray-500">{label}</div>
  //                 </div>
  //               );
  //             })}
  //           </div>
  //         )}
  //         {/* <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-700">
  //           <div>Applied: {overview.grandTotal?.applied ?? 0}</div>
  //           <div>Engaged: {overview.grandTotal?.engaged ?? 0}</div>
  //           <div>Interview: {overview.grandTotal?.interview ?? 0}</div>
  //           <div>Offer: {overview.grandTotal?.offer ?? 0}</div>
  //           <div>Rejected: {overview.grandTotal?.rejected ?? 0}</div>
  //           <div>Onboard: {overview.grandTotal?.onboard ?? 0}</div>
  //         </div> */}
  //       </div>

  //       {/* Team Member Mini Charts (per-user status bars) */}
  //       <div className="bg-white rounded-lg shadow">
  //         <div className="px-6 py-4 border-b border-gray-200">
  //           <div className="flex items-center space-x-2">
  //             <Users className="h-5 w-5 text-gray-500" />
  //             <h3 className="text-lg font-medium text-gray-900">Team Member Status Breakdown</h3>
  //           </div>
  //         </div>
  //         <div className="p-6">
  //           {overview.users.length === 0 ? (
  //             <div className="text-center text-gray-500">No user performance data.</div>
  //           ) : (
  //             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  //               {overview.users.map((u, idx) => {
  //                 const s = u.statuses || {};
  //                 const maxUser = Math.max(1, ...statusKeys.map(k => Number(s[k]) || 0));
  //                 return (
  //                   <div key={idx} className="border rounded-lg p-4">
  //                     <div className="mb-2 flex items-center justify-between">
  //                       <div className="font-semibold text-gray-900">{u.username || u._id}</div>
  //                       <div className="text-xs text-gray-500">
  //                         Total: {(s.applied||0)+(s.engaged||0)+(s.interview||0)+(s.offer||0)+(s.rejected||0)+(s.not_engaged||0)+(s.onboard||0)}
  //                       </div>
  //                     </div>
  //                     <div className="flex items-end space-x-2" style={{ height: `${BASE_USER_H}px` }}>
  //                       {statusKeys.map((k) => {
  //                         const val = Number(s[k]) || 0;
  //                         const hPx = Math.round((val / maxUser) * BASE_USER_H);
  //                         return (
  //                           <div key={k} className="flex-1 flex flex-col items-center">
  //                             <div className="text-[10px] text-gray-700 mb-1 h-4">{val}</div>
  //                             <div className={`w-full ${statusMeta[k].color} rounded-t`} style={{ height: `${Math.max(2, hPx)}px` }} />
  //                             <div className="mt-1 text-[10px] text-gray-600 capitalize">{k.replace('_',' ')}</div>
  //                           </div>
  //                         );
  //                       })}
  //                     </div>
  //                   </div>
  //                 );
  //               })}
  //             </div>
  //           )}
  //         </div>
  //       </div>

  //       {/* Per-Status Daily Bar Charts */}
  //       <div className="bg-white rounded-lg shadow">
  //         <div className="px-6 py-4 border-b border-gray-200">
  //           <div className="flex items-center space-x-2">
  //             <TrendingUp className="h-5 w-5 text-gray-500" />
  //             <h3 className="text-lg font-medium text-gray-900">Status Trends by Day</h3>
  //           </div>
  //         </div>
  //         <div className="p-6 space-y-6">
  //           {statusKeys.map((k) => {
  //             const maxForStatus = perStatusMax[k] || 1;
  //             return (
  //               <div key={k} className="border rounded-md p-3">
  //                 <div className="flex items-center justify-between mb-2">
  //                   <div className="font-medium text-gray-900 capitalize">{k.replace('_',' ')}</div>
  //                   <div className="text-xs text-gray-500">Peak: {maxForStatus}</div>
  //                 </div>
  //                 {normalizedDaily.length === 0 ? (
  //                   <div className="text-sm text-gray-500">No data.</div>
  //                 ) : (
  //                   <div className="flex items-end space-x-2" style={{ height: `${BASE_STATUS_H}px` }}>
  //                     {normalizedDaily.map((d, idx) => {
  //                       const val = Number(d[k]) || 0;
  //                       const hPx = Math.round((val / maxForStatus) * BASE_STATUS_H);
  //                       const label = new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
  //                       return (
  //                         <div key={idx} className="flex-1 flex flex-col items-center">
  //                           <div className="text-[10px] text-gray-700 mb-0.5 h-3">{val}</div>
  //                           <div className={`w-full ${statusMeta[k].color} rounded-t`} style={{ height: `${Math.max(2, hPx)}px` }} />
  //                           <div className="mt-1 text-[10px] text-gray-500">{label}</div>
  //                         </div>
  //                       );
  //                     })}
  //                   </div>
  //                 )}
  //               </div>
  //             );
  //           })}
  //         </div>
  //       </div>

  //       {/* Team Performance Table */}
  //       <div className="bg-white rounded-lg shadow">
  //         <div className="px-6 py-4 border-b border-gray-200">
  //           <div className="flex items-center space-x-2">
  //             <Users className="h-5 w-5 text-gray-500" />
  //             <h3 className="text-lg font-medium text-gray-900">Team Performance</h3>
  //           </div>
  //         </div>
  //         <div className="p-6">
  //           {overview.users.length === 0 ? (
  //             <div className="text-center text-gray-500">No user performance data.</div>
  //           ) : (
  //             <div className="overflow-x-auto">
  //               <table className="min-w-full divide-y divide-gray-200">
  //                 <thead className="bg-gray-50">
  //                   <tr>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Not Engaged</th>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engaged</th>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interview</th>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer</th>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rejected</th>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Onboard</th>
  //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody className="bg-white divide-y divide-gray-200">
  //                   {overview.users.map((u, i) => {
  //                     const s = u.statuses || {};
  //                     const total =
  //                       (s.applied || 0) + (s.engaged || 0) + (s.interview || 0) +
  //                       (s.offer || 0) + (s.rejected || 0) + (s.not_engaged || 0) + (s.onboard || 0);
  //                     return (
  //                       <tr key={i} className="hover:bg-gray-50">
  //                         <td className="px-6 py-3 text-sm font-medium text-gray-900">
  //                           {u.username || u._id}
  //                         </td>
  //                         <td className="px-6 py-3 text-sm">{s.not_engaged ?? 0}</td>
  //                         <td className="px-6 py-3 text-sm">{s.applied ?? 0}</td>
  //                         <td className="px-6 py-3 text-sm">{s.engaged ?? 0}</td>
  //                         <td className="px-6 py-3 text-sm">{s.interview ?? 0}</td>
  //                         <td className="px-6 py-3 text-sm">{s.offer ?? 0}</td>
  //                         <td className="px-6 py-3 text-sm">{s.rejected ?? 0}</td>
  //                         <td className="px-6 py-3 text-sm">{s.onboard ?? 0}</td>
  //                         <td className="px-6 py-3 text-sm font-semibold">{total}</td>
  //                       </tr>
  //                     );
  //                   })}
  //                 </tbody>
  //               </table>
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };  

  const OverviewTab = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const totalJobs = jobs.length;
    const assignedJobs = typeof stats.assignedJobs === 'number'
      ? stats.assignedJobs
      : jobs.filter(j => !!j.assignee).length;

    const gt = overview.grandTotal || {};
    const statusCards = [
      { key: 'not_engaged', label: 'Not Engaged', color: 'bg-gray-100 text-gray-700' },
      { key: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-700' },
      { key: 'engaged', label: 'Engaged', color: 'bg-indigo-100 text-indigo-700' },
      { key: 'interview', label: 'Interview', color: 'bg-purple-100 text-purple-700' },
      { key: 'offer', label: 'Offer', color: 'bg-emerald-100 text-emerald-700' },
      { key: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
      { key: 'onboard', label: 'Onboard', color: 'bg-teal-100 text-teal-700' }
    ];

    const statusKeys = ['not_engaged','applied','engaged','interview','offer','rejected','onboard'];
    const statusMeta = {
      applied: { color: 'bg-blue-500' },
      engaged: { color: 'bg-indigo-500' },
      interview: { color: 'bg-purple-500' },
      offer: { color: 'bg-emerald-500' },
      rejected: { color: 'bg-red-500' },
      onboard: { color: 'bg-teal-500' },
      not_engaged: { color: 'bg-gray-400' }
    };

    const toYmd = (d) => {
      const dt = new Date(d);
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const day = String(dt.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };
    const buildDateRange = (startYmd, endYmd) => {
      const out = [];
      const start = new Date(startYmd + 'T00:00:00');
      const end = new Date(endYmd + 'T00:00:00');
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        out.push(toYmd(d));
      }
      return out;
    };

    // Use existing overview data directly
    const dailyMap = (Array.isArray(overview.dailyTotals) ? overview.dailyTotals : []).reduce((acc, d) => {
      const key = toYmd(d.date || d._id || d.day || new Date());
      acc[key] = {
        total_engagement: Number(d.total_engagement) || 0,
        ...statusKeys.reduce((o, k) => ({ ...o, [k]: Number(d[k]) || 0 }), {})
      };
      return acc;
    }, {});

    // Get date range from existing data
    const datesInData = Object.keys(dailyMap).sort();
    const normalizedDaily = datesInData.length > 0 ? datesInData.map(ymd => {
      const v = dailyMap[ymd] || {};
      return {
        date: ymd,
        total_engagement: Number(v.total_engagement) || 0,
        ...statusKeys.reduce((o, k) => ({ ...o, [k]: Number(v[k]) || 0 }), {})
      };
    }) : [];

    const maxDaily = Math.max(1, ...normalizedDaily.map(d => d.total_engagement));
    const perStatusMax = statusKeys.reduce((acc, key) => {
      acc[key] = Math.max(1, ...normalizedDaily.map(d => Number(d[key]) || 0));
      return acc;
    }, {});

    // Heights with proper spacing to prevent overlap
    const BASE_TREND_H = 200;  // Overall daily trend
    const BASE_USER_H = 180;   // Per-user mini charts
    const BASE_STATUS_H = 140; // Per-status daily charts

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Company Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{totalJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{assignedJobs}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Status Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {statusCards.map(item => (
            <div key={item.key} className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">{item.label}</div>
              <div className="mt-1 flex items-baseline justify-between">
                <div className="text-2xl font-semibold text-gray-900">
                  {gt[item.key] ?? 0}
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${item.color}`}>
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Engagement Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900">Daily Engagement Trend</h3>
            </div>
            <div className="text-sm text-gray-500">Total: {gt.total_engagement ?? 0}</div>
          </div>
          {normalizedDaily.length === 0 ? (
            <div className="text-center text-gray-500">No trend data.</div>
          ) : (
            <div className="space-y-4">
              {/* Chart container with proper spacing */}
              <div className="flex items-end space-x-2" style={{ height: `${BASE_TREND_H}px` }}>
                {normalizedDaily.map((d, idx) => {
                  const val = Number(d.total_engagement) || 0;
                  const hPx = Math.round((val / maxDaily) * BASE_TREND_H);
                  const label = new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      {/* Value above bar with proper spacing */}
                      <div className="text-[10px] text-gray-700 mb-2 h-4 flex items-center justify-center">
                        {val}
                      </div>
                      {/* Bar with max height constraint */}
                      <div 
                        className="w-full bg-indigo-500 rounded-t" 
                        style={{ height: `${Math.max(2, Math.min(hPx, BASE_TREND_H - 60))}px` }} 
                      />
                      {/* Date label below bar */}
                      <div className="mt-2 text-[10px] text-gray-500">{label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Team Member Status Breakdown */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900">Team Member Status Breakdown</h3>
            </div>
          </div>
          <div className="p-6">
            {overview.users.length === 0 ? (
              <div className="text-center text-gray-500">No user performance data.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {overview.users.map((u, idx) => {
                  const s = u.statuses || {};
                  const maxUser = Math.max(1, ...statusKeys.map(k => Number(s[k]) || 0));
                  return (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="font-semibold text-gray-900">{u.username || u._id}</div>
                        <div className="text-xs text-gray-500">
                          Total: {(s.applied||0)+(s.engaged||0)+(s.interview||0)+(s.offer||0)+(s.rejected||0)+(s.not_engaged||0)+(s.onboard||0)}
                        </div>
                      </div>
                      <div className="flex items-end space-x-2" style={{ height: `${BASE_USER_H}px` }}>
                        {statusKeys.map((k) => {
                          const val = Number(s[k]) || 0;
                          const hPx = Math.round((val / maxUser) * BASE_USER_H);
                          return (
                            <div key={k} className="flex-1 flex flex-col items-center">
                              {/* Value above bar with proper spacing */}
                              <div className="text-[10px] text-gray-700 mb-2 h-4 flex items-center justify-center">
                                {val}
                              </div>
                              {/* Bar with max height constraint */}
                              <div 
                                className={`w-full ${statusMeta[k].color} rounded-t`} 
                                style={{ height: `${Math.max(2, Math.min(hPx, BASE_USER_H - 60))}px` }} 
                              />
                              {/* Status label below bar */}
                              <div className="mt-2 text-[10px] text-gray-600 capitalize">{k.replace('_',' ')}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Status Trends by Day */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900">Status Trends by Day</h3>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {statusKeys.map((k) => {
              const maxForStatus = perStatusMax[k] || 1;
              return (
                <div key={k} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-gray-900 capitalize">{k.replace('_',' ')}</div>
                    <div className="text-xs text-gray-500">Peak: {maxForStatus}</div>
                  </div>
                  {normalizedDaily.length === 0 ? (
                    <div className="text-sm text-gray-500">No data.</div>
                  ) : (
                    <div className="flex items-end space-x-2" style={{ height: `${BASE_STATUS_H}px` }}>
                      {normalizedDaily.map((d, idx) => {
                        const val = Number(d[k]) || 0;
                        const hPx = Math.round((val / maxForStatus) * BASE_STATUS_H);
                        const label = new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center">
                            {/* Value above bar with proper spacing */}
                            <div className="text-[10px] text-gray-700 mb-2 h-4 flex items-center justify-center">
                              {val}
                            </div>
                            {/* Bar with max height constraint */}
                            <div 
                              className={`w-full ${statusMeta[k].color} rounded-t`} 
                              style={{ height: `${Math.max(2, Math.min(hPx, BASE_STATUS_H - 60))}px` }} 
                            />
                            {/* Date label below bar */}
                            <div className="mt-2 text-[10px] text-gray-500">{label}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Performance Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900">Team Performance</h3>
            </div>
          </div>
          <div className="p-6">
            {overview.users.length === 0 ? (
              <div className="text-center text-gray-500">No user performance data.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Not Engaged</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engaged</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interview</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rejected</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Onboard</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {overview.users.map((u, i) => {
                      const s = u.statuses || {};
                      const total =
                        (s.applied || 0) + (s.engaged || 0) + (s.interview || 0) +
                        (s.offer || 0) + (s.rejected || 0) + (s.not_engaged || 0) + (s.onboard || 0);
                      return (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-6 py-3 text-sm font-medium text-gray-900">
                            {u.username || u._id}
                          </td>
                          <td className="px-6 py-3 text-sm">{s.not_engaged ?? 0}</td>
                          <td className="px-6 py-3 text-sm">{s.applied ?? 0}</td>
                          <td className="px-6 py-3 text-sm">{s.engaged ?? 0}</td>
                          <td className="px-6 py-3 text-sm">{s.interview ?? 0}</td>
                          <td className="px-6 py-3 text-sm">{s.offer ?? 0}</td>
                          <td className="px-6 py-3 text-sm">{s.rejected ?? 0}</td>
                          <td className="px-6 py-3 text-sm">{s.onboard ?? 0}</td>
                          <td className="px-6 py-3 text-sm font-semibold">{total}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
 
  const UsersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Company Users</h2>
        <button
          onClick={() => setShowCreateUser(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add User</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Users size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No users found. Create your first user to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.username}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'company_admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                      }`}>
                      {user.role === 'company_admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // const JobsTab = () => (
  //   <div className="space-y-6">
  //     <div className="flex justify-between items-center">
  //       <h2 className="text-2xl font-bold text-gray-900">Company Jobs</h2>
  //       <div className="flex space-x-2">
  //         <button
  //           onClick={() => setShowAssignJobs(true)}
  //           disabled={selectedJobs.length === 0}
  //           className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
  //         >
  //           Assign Selected ({selectedJobs.length})
  //         </button>
  //         <button
  //           onClick={() => handleBulkUpdateJobs('in_progress')}
  //           disabled={selectedJobs.length === 0}
  //           className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 transition-colors"
  //         >
  //           Mark In Progress
  //         </button>
  //         <button
  //           onClick={() => handleBulkUpdateJobs('completed')}
  //           disabled={selectedJobs.length === 0}
  //           className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
  //         >
  //           Mark Completed
  //         </button>
  //       </div>
  //     </div>

  //     <div className="bg-white rounded-lg shadow overflow-hidden">
  //       {jobs.length === 0 ? (
  //         <div className="p-8 text-center">
  //           <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
  //           <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs assigned yet</h3>
  //           <p className="text-gray-500">Jobs will appear here once they are distributed to your company.</p>
  //         </div>
  //       ) : (
  //         <div className="overflow-x-auto">
  //           <table className="min-w-full divide-y divide-gray-200">
  //             <thead className="bg-gray-50">
  //               <tr>
  //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   <input
  //                     type="checkbox"
  //                     checked={selectedJobs.length === jobs.length}
  //                     onChange={(e) => {
  //                       if (e.target.checked) {
  //                         setSelectedJobs(jobs.map(j => j.id));
  //                       } else {
  //                         setSelectedJobs([]);
  //                       }
  //                     }}
  //                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
  //                   />
  //                 </th>
  //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Job Details
  //                 </th>
  //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Platform
  //                 </th>
  //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Status
  //                 </th>
  //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Assigned To
  //                 </th>
  //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Actions
  //                 </th>
  //               </tr>
  //             </thead>
  //             <tbody className="bg-white divide-y divide-gray-200">
  //               {jobs.map((job) => (
  //                 <tr key={job.id} className="hover:bg-gray-50 transition-colors">
  //                   <td className="px-6 py-4 whitespace-nowrap">
  //                     <input
  //                       type="checkbox"
  //                       checked={selectedJobs.includes(job.id)}
  //                       onChange={() => toggleJobSelection(job.id)}
  //                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
  //                     />
  //                   </td>
  //                   <td className="px-6 py-4 whitespace-nowrap">
  //                     <div>
  //                       <div className="text-sm font-medium text-gray-900">
  //                         {job.title}
  //                       </div>
  //                       <div className="text-sm text-gray-500">
  //                         {job.company}
  //                       </div>
  //                     </div>
  //                   </td>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
  //                     <span className="capitalize">{job.platform}</span>
  //                   </td>
  //                   <td className="px-6 py-4 whitespace-nowrap">
  //                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
  //                       job.status === 'completed' 
  //                         ? 'bg-green-100 text-green-800' 
  //                         : job.status === 'in_progress'
  //                         ? 'bg-yellow-100 text-yellow-800'
  //                         : 'bg-gray-100 text-gray-800'
  //                     }`}>
  //                       {job.status || 'pending'}
  //                     </span>
  //                   </td>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
  //                     {job.assignee ? job.assignee.username : 'Unassigned'}
  //                   </td>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  //                     <button
  //                       onClick={() => {
  //                         // View job details
  //                       }}
  //                       className="text-blue-600 hover:text-blue-900 transition-colors"
  //                       title="View Details"
  //                     >
  //                       <Eye className="h-4 w-4" />
  //                     </button>
  //                   </td>
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );

  const SubscriptionTab = () => {
    const refreshSubscription = async () => {
      setLoading(true);
      try {
        const sub = await fetchCompanySubscription(getEffectiveCompanyId());
        setSubscription(sub);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Subscription</h2>
          <button
            onClick={refreshSubscription}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {!subscription ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
            No subscription found for this company.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Plan</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {subscription.plan} ({subscription.status})
                  </p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-600">
                <div>Start: {new Date(subscription.startDate).toLocaleDateString()}</div>
                <div>End: {new Date(subscription.endDate).toLocaleDateString()}</div>
                <div className="font-medium">{subscription.daysRemaining} days remaining</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Usage</span>
                <span>
                  {subscription.jobsUsed}/{subscription.jobsQuota} (
                  {subscription.usagePercentage ?? Math.round((subscription.jobsUsed / Math.max(1, subscription.jobsQuota)) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${subscription.usagePercentage ?? Math.round((subscription.jobsUsed / Math.max(1, subscription.jobsQuota)) * 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">
                Remaining: {subscription.jobsRemaining} | Last sync: {subscription.lastJobSync ? new Date(subscription.lastJobSync).toLocaleString() : '—'}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'users': return <UsersTab />;
      // case 'jobs': return <JobsTab />;
      case 'subscription': return <SubscriptionTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header hideDownloadExcel /> */}

      {/* Message Display
      {message.text && (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 ${
          message.type === 'success' ? 'text-green-600' : 'text-red-600'
        }`}>
          <div className={`p-3 rounded-md ${
            message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            {message.text}
          </div>
        </div>
      )} */}

      <main className="max-w-7xl mx-auto p-4 space-y-2">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your company's users and jobs</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{user?.companyName || 'Your Company'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Admin</p>
                <p className="font-medium">{user?.username || user?.email}</p>
              </div>
              {/* {subscription && (
                <div className="flex items-center space-x-2">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                    {subscription.plan}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                    } capitalize`}>
                    {subscription.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {subscription.daysRemaining} days left
                  </span>
                </div>
              )} */}
              <button
                onClick={() => { logoutUser(dispatch); navigate('/login', { replace: true }); }}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-4 border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              // { id: 'jobs', label: 'Jobs', icon: Database },
              { id: 'subscription', label: 'Subscription', icon: CreditCard }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>


        {/* Tab Content */}
        {renderTabContent()}
      </main>

      {/* Modals */}
      <CreateUserModal
        isOpen={showCreateUser}
        onClose={() => setShowCreateUser(false)}
        onSubmit={handleCreateUser}
        loading={loading}
        formData={userForm}
        setFormData={setUserForm}
      />

      <EditUserModal
        isOpen={showEditUser}
        onClose={() => setShowEditUser(false)}
        onSubmit={(userData) => handleUpdateUser(selectedUser?.id, userData)}
        loading={loading}
        formData={userForm}
        setFormData={setUserForm}
        user={selectedUser}
      />

      <AssignJobsModal
        isOpen={showAssignJobs}
        onClose={() => setShowAssignJobs(false)}
        onSubmit={handleAssignJobs}
        loading={loading}
        users={users}
        selectedJobs={selectedJobs}
        formData={assignForm}
        setFormData={setAssignForm}
      />
    </div>
  );
};

export default CompanyAdminDashboard;