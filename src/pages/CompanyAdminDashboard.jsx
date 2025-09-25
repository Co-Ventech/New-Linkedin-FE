// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { selectUser, isCompanyAdmin, selectCompany } from '../slices/userSlice';
// import { CreateUserModal } from '../components/CreateUserModal';
// import { EditUserModal } from '../components/EditUserModal';
// import { AssignJobsModal } from '../components/AssignJobsModal';
// import { useNavigate } from 'react-router-dom';
// import { logoutUser } from '../api/authApi';
// // import {  isCompanyAdmin, selectCompany } from '../slices/userSlice';
// import {
//   BarChart3,
//   Users,
//   Database,
//   Plus,
//   Edit,
//   Trash2,
//   Eye,
//   CheckCircle,
//   AlertCircle,
//   Clock,
//   RefreshCw,
//   UserPlus,
//   Building2,
//   TrendingUp,
//   Activity,
//   X,
//   LogOut,
//   CreditCard
// } from 'lucide-react';

// const API_BASE = import.meta.env.VITE_REMOTE_HOST ;

// const CompanyAdminDashboard = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const user = useSelector(selectUser);
//   const companyState = useSelector(selectCompany);
//   const company = useSelector(selectCompany);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });

//   // Data states
//   const [users, setUsers] = useState([]);
//   const [jobs, setJobs] = useState([]);
//   const [stats, setStats] = useState({});
//   const [activities, setActivities] = useState([]);

//   // Modal states
//   const [showCreateUser, setShowCreateUser] = useState(false);
//   const [showEditUser, setShowEditUser] = useState(false);
//   const [showAssignJobs, setShowAssignJobs] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedJobs, setSelectedJobs] = useState([]);
//   const [subscription, setSubscription] = useState(null);
// //  const [overview, setOverview] = useState({ statusBreakdown: {}, userActivity: [] });
//  const [overview, setOverview] = useState({
//    grandTotal: {
//     total_engagement: 0,
//     not_engaged: 0,
//     applied: 0,
//      engaged: 0,
//     interview: 0,
//      offer: 0,
//      rejected: 0,
//      onboard: 0
//    },
//   dailyTotals: [],
//    users: []
//  });


//   const companyId = user?.companyId || companyState?._id || companyState?.id;
//   const getEffectiveCompanyId = () =>
//     user?.companyId ||
//     companyState?._id || companyState?.id ||
//     (jobs && jobs.length > 0 ? jobs[0].companyId : undefined);


//   // Form states
//   const [userForm, setUserForm] = useState({
//     username: '',
//     email: '',
//     password: '',
//     role: 'company_user'
//   });

//   const [assignForm, setAssignForm] = useState({
//     userId: '',
//     jobIds: []
//   });


//   // Replace the incorrect API calls with the correct ones

//   // 1. Fix the createUser function (around line 140)
//   const createUser = async (userData) => {
//     try {
//       const response = await fetch(`${API_BASE}/api/users`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//         },
//         body: JSON.stringify({
//           username: userData.username,
//           email: userData.email,
//           password: userData.password
//         })
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       return result;
//     } catch (error) {
//       console.error('Error creating user:', error);
//       throw error;
//     }
//   };

//   // 2. Fix the updateUser function (around line 160)
//   const updateUser = async (userId, userData) => {
//     try {
//       const response = await fetch(`${API_BASE}/api/users`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//         },
//         body: JSON.stringify({
//           username: userData.username,
//           email: userData.email,
//           isActive: userData.isActive
//         })
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       return result;
//     } catch (error) {
//       console.error('Error updating user:', error);
//       throw error;
//     }
//   };

//   // 3. Fix the deleteUser function (around line 180)
//   const deleteUser = async (userId) => {
//     try {
//       const response = await fetch(`${API_BASE}/api/users`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       return result;
//     } catch (error) {
//       console.error('Error deleting user:', error);
//       throw error;
//     }
//   };

//   // 4. Add the missing changePassword function
//   const changePassword = async (userId, passwordData) => {
//     try {
//       const response = await fetch(`${API_BASE}/api/users/${userId}/change-password`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//         },
//         body: JSON.stringify({
//           newPassword: passwordData.newPassword
//         })
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       return result;
//     } catch (error) {
//       console.error('Error changing password:', error);
//       throw error;
//     }
//   };

//   // 5. Add the missing hardResetPassword function
//   const hardResetPassword = async (userId) => {
//     try {
//       const response = await fetch(`/api/users/${userId}/hard-reset-password`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       return result;
//     } catch (error) {
//       console.error('Error hard resetting password:', error);
//       throw error;
//     }
//   };


//   // Fetch company subscriptio
//   const fetchCompanySubscription = async (idParam) => {
//     try {
//       const id = idParam || getEffectiveCompanyId();
//       if (!id) return null;
//       const res = await fetch(`${API_BASE}/api/companies/${id}/subscription`, {
//         headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
//       });
//       if (!res.ok) return null;
//       const data = await res.json();
//       return data.subscription || null;
//     } catch {
//       return null;
//     }
//   };
//   // 6. Fix the fetchUsers function (around line 200)
//   const fetchUsers = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/api/users`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       // Handle the response structure: { users: [...] }
//       return result.users || [];
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       throw error;
//     }
//   };

//   // Check role access
//   if (!isCompanyAdmin(user)) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <X className="mx-auto h-16 w-16 text-red-500 mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
//           <p className="text-gray-600">Only company administrators can access this dashboard.</p>
//         </div>
//       </div>
//     );
//   }

//   const fetchCompanyStats = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/api/company/stats`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       return result;
//     } catch (error) {
//       console.error('Error fetching company stats:', error);
//       throw error;
//     }
//   };

//   // Load initial data with improved error handling
//   // replace your loadInitialData with:
//   const loadInitialData = async () => {
//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       // Phase 1: users/jobs/stats
//       const baseResults = await Promise.allSettled([
//         fetchUsers(),
//         fetchCompanyJobs(),
//         fetchCompanyStats(),
//         fetchJobsOverview()
//       ]);

//       if (baseResults[0].status === 'fulfilled') setUsers(baseResults[0].value);
//       else setMessage({ type: 'error', text: 'Failed to load users' });

//       if (baseResults[1].status === 'fulfilled') setJobs(baseResults[1].value);
//       else setMessage({ type: 'error', text: 'Failed to load jobs' });

//       if (baseResults[2].status === 'fulfilled') setStats(baseResults[2].value || {});
//       else setMessage({ type: 'error', text: 'Failed to load stats' });

//       if (baseResults[3].status === 'fulfilled' && baseResults[3].value) {
//         setOverview(baseResults[3].value);
//       } else {
//         setOverview({
//           grandTotal: {
//             total_engagement: 0, not_engaged: 0, applied: 0, engaged: 0,
//             interview: 0, offer: 0, rejected: 0, onboard: 0
//           },
//           dailyTotals: [],
//           users: []
//         });
//       }

//       // Phase 2: derive companyId and fetch subscription + activity
//       const cid = getEffectiveCompanyId();
//       const tailResults = await Promise.allSettled([
//         fetchCompanySubscription(cid)
//       ]);

//       if (tailResults[0].status === 'fulfilled') setSubscription(tailResults[0].value);
//       else setSubscription(null);

//       if (tailResults[1].status === 'fulfilled') setActivities(Array.isArray(tailResults[1].value) ? tailResults[1].value : []);
//       else setActivities([]);

//     } catch {
//       setMessage({ type: 'error', text: 'Failed to load initial data' });
//     } finally {
//       setLoading(false);
//     }
//   };


//   // 3. Add the missing fetchCompanyJobs function
//   const fetchCompanyJobs = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/api/company-jobs`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       return result.jobs || [];
//     } catch (error) {
//       console.error('Error fetching company jobs:', error);
//       throw error;
//     }
//   };

//   const fetchJobsOverview = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/api/company-jobs/stats/overview`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
//       });
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//       const data = await res.json();
//       return {
//         grandTotal: {
//           total_engagement: data?.grandTotal?.total_engagement ?? 0,
//           not_engaged: data?.grandTotal?.not_engaged ?? 0,
//           applied: data?.grandTotal?.applied ?? 0,
//           engaged: data?.grandTotal?.engaged ?? 0,
//           interview: data?.grandTotal?.interview ?? 0,
//           offer: data?.grandTotal?.offer ?? 0,
//           rejected: data?.grandTotal?.rejected ?? 0,
//           onboard: data?.grandTotal?.onboard ?? 0
//         },
//         dailyTotals: Array.isArray(data?.dailyTotals) ? data.dailyTotals : [],
//         users: Array.isArray(data?.users) ? data.users : []
//       };
//     } catch (err) {
//       console.error('Overview stats fetch error:', err);
//       return {
//         grandTotal: {
//           total_engagement: 0, not_engaged: 0, applied: 0, engaged: 0,
//           interview: 0, offer: 0, rejected: 0, onboard: 0
//         },
//         dailyTotals: [],
//         users: []
//       };
//     }
//   };
//   // 4. Add the missing fetchCompanyStats function
//   // Company stats


//   // Activity feed (optional endpoint; handled gracefully if missing)
//   // const fetchCompanyActivity = async () => {
//   //   try {
//   //     const res = await fetch(`${API_BASE}/api/company/activity`, {
//   //       headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
//   //     });
//   //     if (!res.ok) return []; // tolerate 404
//   //     const data = await res.json();
//   //     return Array.isArray(data.activities) ? data.activities : (Array.isArray(data) ? data : []);
//   //   } catch {
//   //     return [];
//   //   }
//   // };

//   useEffect(() => {
//     if (!subscription && jobs.length > 0) {
//       const cid = getEffectiveCompanyId();
//       if (cid) {
//         fetchCompanySubscription(cid).then(setSubscription).catch(() => { });
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [jobs]);

//   useEffect(() => {
//       loadInitialData();
//   }, []);


//   // Message handling with auto-dismiss
//   const showMessage = (type, text) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage({ type: '', text: '' }), 5000);
//   };

//   // User operations
//   const handleCreateUser = async (userData) => {
//     if (!userData.username || !userData.email || !userData.password) {
//       setMessage({ type: 'error', text: 'All fields are required' });
//       return;
//     }

//     try {
//       setLoading(true);
//       const result = await createUser(userData);

//       if (result.message === 'User created successfully') {
//         setMessage({ type: 'success', text: 'User created successfully!' });
//         setUserForm({ username: '', email: '', password: '', role: 'company_user' });
//         setShowCreateUser(false);
//         await loadInitialData();
//       } else {
//         setMessage({ type: 'error', text: result.message || 'Failed to create user' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: error.message || 'Failed to create user' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateUser = async (userId, userData) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`/api/users/${userId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('authToken')}`
//         },
//         body: JSON.stringify(userData)
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update user');
//       }

//       showMessage('success', 'User updated successfully!');
//       setShowEditUser(false);
//       setSelectedUser(null);
//       await loadInitialData();
//     } catch (error) {
//       console.error('Error updating user:', error);
//       showMessage('error', error.message || 'Failed to update user');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await fetch(`/api/users/${userId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete user');
//       }

//       showMessage('success', 'User deleted successfully!');
//       await loadInitialData();
//     } catch (error) {
//       console.error('Error deleting user:', error);
//       showMessage('error', error.message || 'Failed to delete user');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Job operations
//   const handleAssignJobs = async (assignmentData) => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/company/jobs/assign', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('authToken')}`
//         },
//         body: JSON.stringify(assignmentData)
//       });

//       if (!response.ok) {
//         throw new Error('Failed to assign jobs');
//       }

//       showMessage('success', 'Jobs assigned successfully!');
//       setShowAssignJobs(false);
//       setAssignForm({ userId: '', jobIds: [] });
//       setSelectedJobs([]);
//       await loadInitialData();
//     } catch (error) {
//       console.error('Error assigning jobs:', error);
//       showMessage('error', error.message || 'Failed to assign jobs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBulkUpdateJobs = async (status) => {
//     if (selectedJobs.length === 0) {
//       showMessage('error', 'Please select jobs to update');
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await fetch('/api/company/jobs/bulk-update', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('authToken')}`
//         },
//         body: JSON.stringify({ jobIds: selectedJobs, status })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update jobs');
//       }

//       showMessage('success', `Jobs updated to ${status} successfully!`);
//       setSelectedJobs([]);
//       await loadInitialData();
//     } catch (error) {
//       console.error('Error updating jobs:', error);
//       showMessage('error', error.message || 'Failed to update jobs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleJobSelection = (jobId) => {
//     setSelectedJobs(prev =>
//       prev.includes(jobId)
//         ? prev.filter(id => id !== jobId)
//         : [...prev, jobId]
//     );
//   };

//   const OverviewTab = () => {
//     const totalUsers = users.length;
//     const activeUsers = users.filter(u => u.isActive).length;
//     const totalJobs = jobs.length;
//     const assignedJobs = typeof stats.assignedJobs === 'number'
//       ? stats.assignedJobs
//       : jobs.filter(j => !!j.assignee).length;

//     const gt = overview.grandTotal || {};
//     const statusCards = [
//       { key: 'not_engaged', label: 'Not Engaged', color: 'bg-gray-100 text-gray-700' },
//       { key: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-700' },
//       { key: 'engaged', label: 'Engaged', color: 'bg-indigo-100 text-indigo-700' },
//       { key: 'interview', label: 'Interview', color: 'bg-purple-100 text-purple-700' },
//       { key: 'offer', label: 'Offer', color: 'bg-emerald-100 text-emerald-700' },
//       { key: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
//       { key: 'onboard', label: 'Onboard', color: 'bg-teal-100 text-teal-700' }
//     ];

//     const statusKeys = ['not_engaged','applied','engaged','interview','offer','rejected','onboard'];
//     const statusMeta = {
//       applied: { color: 'bg-blue-500' },
//       engaged: { color: 'bg-indigo-500' },
//       interview: { color: 'bg-purple-500' },
//       offer: { color: 'bg-emerald-500' },
//       rejected: { color: 'bg-red-500' },
//       onboard: { color: 'bg-teal-500' },
//       not_engaged: { color: 'bg-gray-400' }
//     };

//     const toYmd = (d) => {
//       const dt = new Date(d);
//       const y = dt.getFullYear();
//       const m = String(dt.getMonth() + 1).padStart(2, '0');
//       const day = String(dt.getDate()).padStart(2, '0');
//       return `${y}-${m}-${day}`;
//     };
//     const buildDateRange = (startYmd, endYmd) => {
//       const out = [];
//       const start = new Date(startYmd + 'T00:00:00');
//       const end = new Date(endYmd + 'T00:00:00');
//       for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//         out.push(toYmd(d));
//       }
//       return out;
//     };

//     // Use existing overview data directly
//     const dailyMap = (Array.isArray(overview.dailyTotals) ? overview.dailyTotals : []).reduce((acc, d) => {
//       const key = toYmd(d.date || d._id || d.day || new Date());
//       acc[key] = {
//         total_engagement: Number(d.total_engagement) || 0,
//         ...statusKeys.reduce((o, k) => ({ ...o, [k]: Number(d[k]) || 0 }), {})
//       };
//       return acc;
//     }, {});

//     // Get date range from existing data
//     const datesInData = Object.keys(dailyMap).sort();
//     const normalizedDaily = datesInData.length > 0 ? datesInData.map(ymd => {
//       const v = dailyMap[ymd] || {};
//       return {
//         date: ymd,
//         total_engagement: Number(v.total_engagement) || 0,
//         ...statusKeys.reduce((o, k) => ({ ...o, [k]: Number(v[k]) || 0 }), {})
//       };
//     }) : [];

//     const maxDaily = Math.max(1, ...normalizedDaily.map(d => d.total_engagement));
//     const perStatusMax = statusKeys.reduce((acc, key) => {
//       acc[key] = Math.max(1, ...normalizedDaily.map(d => Number(d[key]) || 0));
//       return acc;
//     }, {});

//     // Heights with proper spacing to prevent overlap
//     const BASE_TREND_H = 200;  // Overall daily trend
//     const BASE_USER_H = 180;   // Per-user mini charts
//     const BASE_STATUS_H = 140; // Per-status daily charts

//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-900">Company Overview</h2>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className="p-2 bg-purple-100 rounded-lg">
//                 <Users className="h-6 w-6 text-purple-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Users</p>
//                 <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <CheckCircle className="h-6 w-6 text-green-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Active Users</p>
//                 <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <Database className="h-6 w-6 text-blue-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Jobs</p>
//                 <p className="text-2xl font-bold text-gray-900">{totalJobs}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className="p-2 bg-yellow-100 rounded-lg">
//                 <Clock className="h-6 w-6 text-yellow-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Assigned Jobs</p>
//                 <p className="text-2xl font-bold text-gray-900">{assignedJobs}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Company Status Breakdown */}
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
//           {statusCards.map(item => (
//             <div key={item.key} className="bg-white rounded-lg shadow p-4">
//               <div className="text-sm text-gray-500">{item.label}</div>
//               <div className="mt-1 flex items-baseline justify-between">
//                 <div className="text-2xl font-semibold text-gray-900">
//                   {gt[item.key] ?? 0}
//                 </div>
//                 <span className={`px-2 py-1 rounded text-xs font-medium ${item.color}`}>
//                   {item.label}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Daily Engagement Trend */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center space-x-2">
//               <TrendingUp className="h-5 w-5 text-gray-500" />
//               <h3 className="text-lg font-medium text-gray-900">Daily Engagement Trend</h3>
//             </div>
//             <div className="text-sm text-gray-500">Total: {gt.total_engagement ?? 0}</div>
//           </div>
//           {normalizedDaily.length === 0 ? (
//             <div className="text-center text-gray-500">No trend data.</div>
//           ) : (
//             <div className="space-y-4">
//               {/* Chart container with proper spacing */}
//               <div className="flex items-end space-x-2" style={{ height: `${BASE_TREND_H}px` }}>
//                 {normalizedDaily.map((d, idx) => {
//                   const val = Number(d.total_engagement) || 0;
//                   const hPx = Math.round((val / maxDaily) * BASE_TREND_H);
//                   const label = new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
//                   return (
//                     <div key={idx} className="flex-1 flex flex-col items-center">
//                       {/* Value above bar with proper spacing */}
//                       <div className="text-[10px] text-gray-700 mb-2 h-4 flex items-center justify-center">
//                         {val}
//                       </div>
//                       {/* Bar with max height constraint */}
//                       <div 
//                         className="w-full bg-indigo-500 rounded-t" 
//                         style={{ height: `${Math.max(2, Math.min(hPx, BASE_TREND_H - 60))}px` }} 
//                       />
//                       {/* Date label below bar */}
//                       <div className="mt-2 text-[10px] text-gray-500">{label}</div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Team Member Status Breakdown */}
//         <div className="bg-white rounded-lg shadow">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <div className="flex items-center space-x-2">
//               <Users className="h-5 w-5 text-gray-500" />
//               <h3 className="text-lg font-medium text-gray-900">Team Member Status Breakdown</h3>
//             </div>
//           </div>
//           <div className="p-6">
//             {overview.users.length === 0 ? (
//               <div className="text-center text-gray-500">No user performance data.</div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {overview.users.map((u, idx) => {
//                   const s = u.statuses || {};
//                   const maxUser = Math.max(1, ...statusKeys.map(k => Number(s[k]) || 0));
//                   return (
//                     <div key={idx} className="border rounded-lg p-4">
//                       <div className="mb-3 flex items-center justify-between">
//                         <div className="font-semibold text-gray-900">{u.username || u._id}</div>
//                         <div className="text-xs text-gray-500">
//                           Total: {(s.applied||0)+(s.engaged||0)+(s.interview||0)+(s.offer||0)+(s.rejected||0)+(s.not_engaged||0)+(s.onboard||0)}
//                         </div>
//                       </div>
//                       <div className="flex items-end space-x-2" style={{ height: `${BASE_USER_H}px` }}>
//                         {statusKeys.map((k) => {
//                           const val = Number(s[k]) || 0;
//                           const hPx = Math.round((val / maxUser) * BASE_USER_H);
//                           return (
//                             <div key={k} className="flex-1 flex flex-col items-center">
//                               {/* Value above bar with proper spacing */}
//                               <div className="text-[10px] text-gray-700 mb-2 h-4 flex items-center justify-center">
//                                 {val}
//                               </div>
//                               {/* Bar with max height constraint */}
//                               <div 
//                                 className={`w-full ${statusMeta[k].color} rounded-t`} 
//                                 style={{ height: `${Math.max(2, Math.min(hPx, BASE_USER_H - 60))}px` }} 
//                               />
//                               {/* Status label below bar */}
//                               <div className="mt-2 text-[10px] text-gray-600 capitalize">{k.replace('_',' ')}</div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Status Trends by Day */}
//         <div className="bg-white rounded-lg shadow">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <div className="flex items-center space-x-2">
//               <TrendingUp className="h-5 w-5 text-gray-500" />
//               <h3 className="text-lg font-medium text-gray-900">Status Trends by Day</h3>
//             </div>
//           </div>
//           <div className="p-6 space-y-6">
//             {statusKeys.map((k) => {
//               const maxForStatus = perStatusMax[k] || 1;
//               return (
//                 <div key={k} className="border rounded-lg p-4">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="font-medium text-gray-900 capitalize">{k.replace('_',' ')}</div>
//                     <div className="text-xs text-gray-500">Peak: {maxForStatus}</div>
//                   </div>
//                   {normalizedDaily.length === 0 ? (
//                     <div className="text-sm text-gray-500">No data.</div>
//                   ) : (
//                     <div className="flex items-end space-x-2" style={{ height: `${BASE_STATUS_H}px` }}>
//                       {normalizedDaily.map((d, idx) => {
//                         const val = Number(d[k]) || 0;
//                         const hPx = Math.round((val / maxForStatus) * BASE_STATUS_H);
//                         const label = new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
//                         return (
//                           <div key={idx} className="flex-1 flex flex-col items-center">
//                             {/* Value above bar with proper spacing */}
//                             <div className="text-[10px] text-gray-700 mb-2 h-4 flex items-center justify-center">
//                               {val}
//                             </div>
//                             {/* Bar with max height constraint */}
//                             <div 
//                               className={`w-full ${statusMeta[k].color} rounded-t`} 
//                               style={{ height: `${Math.max(2, Math.min(hPx, BASE_STATUS_H - 60))}px` }} 
//                             />
//                             {/* Date label below bar */}
//                             <div className="mt-2 text-[10px] text-gray-500">{label}</div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Team Performance Table */}
//         <div className="bg-white rounded-lg shadow">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <div className="flex items-center space-x-2">
//               <Users className="h-5 w-5 text-gray-500" />
//               <h3 className="text-lg font-medium text-gray-900">Team Performance</h3>
//             </div>
//           </div>
//           <div className="p-6">
//             {overview.users.length === 0 ? (
//               <div className="text-center text-gray-500">No user performance data.</div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Not Engaged</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engaged</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interview</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rejected</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Onboard</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {overview.users.map((u, i) => {
//                       const s = u.statuses || {};
//                       const total =
//                         (s.applied || 0) + (s.engaged || 0) + (s.interview || 0) +
//                         (s.offer || 0) + (s.rejected || 0) + (s.not_engaged || 0) + (s.onboard || 0);
//                       return (
//                         <tr key={i} className="hover:bg-gray-50">
//                           <td className="px-6 py-3 text-sm font-medium text-gray-900">
//                             {u.username || u._id}
//                           </td>
//                           <td className="px-6 py-3 text-sm">{s.not_engaged ?? 0}</td>
//                           <td className="px-6 py-3 text-sm">{s.applied ?? 0}</td>
//                           <td className="px-6 py-3 text-sm">{s.engaged ?? 0}</td>
//                           <td className="px-6 py-3 text-sm">{s.interview ?? 0}</td>
//                           <td className="px-6 py-3 text-sm">{s.offer ?? 0}</td>
//                           <td className="px-6 py-3 text-sm">{s.rejected ?? 0}</td>
//                           <td className="px-6 py-3 text-sm">{s.onboard ?? 0}</td>
//                           <td className="px-6 py-3 text-sm font-semibold">{total}</td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const UsersTab = () => (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-gray-900">Company Users</h2>
//         <button
//           onClick={() => setShowCreateUser(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
//         >
//           <Plus size={20} />
//           <span>Add User</span>
//         </button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         </div>
//       ) : users.length === 0 ? (
//         <div className="text-center py-8 text-gray-500">
//           <Users size={48} className="mx-auto mb-4 text-gray-300" />
//           <p>No users found. Create your first user to get started.</p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   User
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Role
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Created
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {users.map((user) => (
//                 <tr key={user._id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">
//                         {user.username}
//                       </div>
//                       <div className="text-sm text-gray-500">{user.email}</div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'company_admin'
//                         ? 'bg-purple-100 text-purple-800'
//                         : 'bg-blue-100 text-blue-800'
//                       }`}>
//                       {user.role === 'company_admin' ? 'Admin' : 'User'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-red-100 text-red-800'
//                       }`}>
//                       {user.isActive ? 'Active' : 'Inactive'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(user.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                     <button
//                       onClick={() => handleEditUser(user)}
//                       className="text-blue-600 hover:text-blue-900"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteUser(user._id)}
//                       className="text-red-600 hover:text-red-900"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );

//   // const JobsTab = () => (
//   //   <div className="space-y-6">
//   //     <div className="flex justify-between items-center">
//   //       <h2 className="text-2xl font-bold text-gray-900">Company Jobs</h2>
//   //       <div className="flex space-x-2">
//   //         <button
//   //           onClick={() => setShowAssignJobs(true)}
//   //           disabled={selectedJobs.length === 0}
//   //           className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
//   //         >
//   //           Assign Selected ({selectedJobs.length})
//   //         </button>
//   //         <button
//   //           onClick={() => handleBulkUpdateJobs('in_progress')}
//   //           disabled={selectedJobs.length === 0}
//   //           className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 transition-colors"
//   //         >
//   //           Mark In Progress
//   //         </button>
//   //         <button
//   //           onClick={() => handleBulkUpdateJobs('completed')}
//   //           disabled={selectedJobs.length === 0}
//   //           className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
//   //         >
//   //           Mark Completed
//   //         </button>
//   //       </div>
//   //     </div>

//   //     <div className="bg-white rounded-lg shadow overflow-hidden">
//   //       {jobs.length === 0 ? (
//   //         <div className="p-8 text-center">
//   //           <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//   //           <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs assigned yet</h3>
//   //           <p className="text-gray-500">Jobs will appear here once they are distributed to your company.</p>
//   //         </div>
//   //       ) : (
//   //         <div className="overflow-x-auto">
//   //           <table className="min-w-full divide-y divide-gray-200">
//   //             <thead className="bg-gray-50">
//   //               <tr>
//   //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//   //                   <input
//   //                     type="checkbox"
//   //                     checked={selectedJobs.length === jobs.length}
//   //                     onChange={(e) => {
//   //                       if (e.target.checked) {
//   //                         setSelectedJobs(jobs.map(j => j.id));
//   //                       } else {
//   //                         setSelectedJobs([]);
//   //                       }
//   //                     }}
//   //                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//   //                   />
//   //                 </th>
//   //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//   //                   Job Details
//   //                 </th>
//   //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//   //                   Platform
//   //                 </th>
//   //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//   //                   Status
//   //                 </th>
//   //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//   //                   Assigned To
//   //                 </th>
//   //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//   //                   Actions
//   //                 </th>
//   //               </tr>
//   //             </thead>
//   //             <tbody className="bg-white divide-y divide-gray-200">
//   //               {jobs.map((job) => (
//   //                 <tr key={job.id} className="hover:bg-gray-50 transition-colors">
//   //                   <td className="px-6 py-4 whitespace-nowrap">
//   //                     <input
//   //                       type="checkbox"
//   //                       checked={selectedJobs.includes(job.id)}
//   //                       onChange={() => toggleJobSelection(job.id)}
//   //                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//   //                     />
//   //                   </td>
//   //                   <td className="px-6 py-4 whitespace-nowrap">
//   //                     <div>
//   //                       <div className="text-sm font-medium text-gray-900">
//   //                         {job.title}
//   //                       </div>
//   //                       <div className="text-sm text-gray-500">
//   //                         {job.company}
//   //                       </div>
//   //                     </div>
//   //                   </td>
//   //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//   //                     <span className="capitalize">{job.platform}</span>
//   //                   </td>
//   //                   <td className="px-6 py-4 whitespace-nowrap">
//   //                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//   //                       job.status === 'completed' 
//   //                         ? 'bg-green-100 text-green-800' 
//   //                         : job.status === 'in_progress'
//   //                         ? 'bg-yellow-100 text-yellow-800'
//   //                         : 'bg-gray-100 text-gray-800'
//   //                     }`}>
//   //                       {job.status || 'pending'}
//   //                     </span>
//   //                   </td>
//   //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//   //                     {job.assignee ? job.assignee.username : 'Unassigned'}
//   //                   </td>
//   //                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//   //                     <button
//   //                       onClick={() => {
//   //                         // View job details
//   //                       }}
//   //                       className="text-blue-600 hover:text-blue-900 transition-colors"
//   //                       title="View Details"
//   //                     >
//   //                       <Eye className="h-4 w-4" />
//   //                     </button>
//   //                   </td>
//   //                 </tr>
//   //               ))}
//   //             </tbody>
//   //           </table>
//   //         </div>
//   //       )}
//   //     </div>
//   //   </div>
//   // );

//   const SubscriptionTab = () => {
//     const refreshSubscription = async () => {
//       setLoading(true);
//       try {
//         const sub = await fetchCompanySubscription(getEffectiveCompanyId());
//         setSubscription(sub);
//       } finally {
//         setLoading(false);
//       }
//     };

//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-900">Subscription</h2>
//           <button
//             onClick={refreshSubscription}
//             disabled={loading}
//             className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
//           >
//             <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
//             <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
//           </button>
//         </div>

//         {!subscription ? (
//           <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
//             No subscription found for this company.
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center space-x-3">
//                 <div className="p-2 bg-indigo-100 rounded-lg">
//                   <CreditCard className="h-6 w-6 text-indigo-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Current Plan</p>
//                   <p className="text-lg font-semibold text-gray-900 capitalize">
//                     {subscription.plan} ({subscription.status})
//                   </p>
//                 </div>
//               </div>
//               <div className="text-right text-sm text-gray-600">
//                 <div>Start: {new Date(subscription.startDate).toLocaleDateString()}</div>
//                 <div>End: {new Date(subscription.endDate).toLocaleDateString()}</div>
//                 <div className="font-medium">{subscription.daysRemaining} days remaining</div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <div className="flex justify-between text-sm text-gray-600">
//                 <span>Usage</span>
//                 <span>
//                   {subscription.jobsUsed}/{subscription.jobsQuota} (
//                   {subscription.usagePercentage ?? Math.round((subscription.jobsUsed / Math.max(1, subscription.jobsQuota)) * 100)}%)
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-indigo-600 h-2 rounded-full"
//                   style={{ width: `${subscription.usagePercentage ?? Math.round((subscription.jobsUsed / Math.max(1, subscription.jobsQuota)) * 100)}%` }}
//                 />
//               </div>
//               <div className="text-xs text-gray-500">
//                 Remaining: {subscription.jobsRemaining} | Last sync: {subscription.lastJobSync ? new Date(subscription.lastJobSync).toLocaleString() : '—'}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };


//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'overview': return <OverviewTab />;
//       case 'users': return <UsersTab />;
//       // case 'jobs': return <JobsTab />;
//       case 'subscription': return <SubscriptionTab />;
//       default: return <OverviewTab />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* <Header hideDownloadExcel /> */}

//       {/* Message Display
//       {message.text && (
//         <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 ${
//           message.type === 'success' ? 'text-green-600' : 'text-red-600'
//         }`}>
//           <div className={`p-3 rounded-md ${
//             message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
//           }`}>
//             {message.text}
//           </div>
//         </div>
//       )} */}

//       <main className="max-w-7xl mx-auto p-4 space-y-2">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
//               <p className="text-gray-600 mt-1">Manage your company's users and jobs</p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="text-right">
//                 <p className="text-sm text-gray-500">Company</p>
//                 <p className="font-medium">{user?.companyName || 'Your Company'}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm text-gray-500">Admin</p>
//                 <p className="font-medium">{user?.username || user?.email}</p>
//               </div>
//               {/* {subscription && (
//                 <div className="flex items-center space-x-2">
//                   <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
//                     {subscription.plan}
//                   </span>
//                   <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
//                     } capitalize`}>
//                     {subscription.status}
//                   </span>
//                   <span className="text-xs text-gray-500">
//                     {subscription.daysRemaining} days left
//                   </span>
//                 </div>
//               )} */}
//               <button
//                 onClick={() => { logoutUser(dispatch); navigate('/login', { replace: true }); }}
//                 className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
//                 title="Logout"
//               >
//                 <LogOut size={18} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="px-6 py-4 border-b border-gray-200">
//           <nav className="flex space-x-8">
//             {[
//               { id: 'overview', label: 'Overview', icon: BarChart3 },
//               { id: 'users', label: 'Users', icon: Users },
//               // { id: 'jobs', label: 'Jobs', icon: Database },
//               { id: 'subscription', label: 'Subscription', icon: CreditCard }
//             ].map((tab) => {
//               const Icon = tab.icon;
//               const isActive = activeTab === tab.id;

//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${isActive
//                       ? 'border-blue-500 text-blue-600'
//                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                     }`}
//                 >
//                   <Icon size={18} />
//                   <span>{tab.label}</span>
//                 </button>
//               );
//             })}
//           </nav>
//         </div>


//         {/* Tab Content */}
//         {renderTabContent()}
//       </main>

//       {/* Modals */}
//       <CreateUserModal
//         isOpen={showCreateUser}
//         onClose={() => setShowCreateUser(false)}
//         onSubmit={handleCreateUser}
//         loading={loading}
//         formData={userForm}
//         setFormData={setUserForm}
//       />

//       <EditUserModal
//         isOpen={showEditUser}
//         onClose={() => setShowEditUser(false)}
//         onSubmit={(userData) => handleUpdateUser(selectedUser?.id, userData)}
//         loading={loading}
//         formData={userForm}
//         setFormData={setUserForm}
//         user={selectedUser}
//       />

//       <AssignJobsModal
//         isOpen={showAssignJobs}
//         onClose={() => setShowAssignJobs(false)}
//         onSubmit={handleAssignJobs}
//         loading={loading}
//         users={users}
//         selectedJobs={selectedJobs}
//         formData={assignForm}
//         setFormData={setAssignForm}
//       />
//     </div>
//   );
// };

// export default CompanyAdminDashboard;


// import { useEffect, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { selectUser, isCompanyAdmin, selectCompany } from "../slices/userSlice"
// import { CreateUserModal } from "../components/CreateUserModal"
// import { EditUserModal } from "../components/EditUserModal"
// import { AssignJobsModal } from "../components/AssignJobsModal"
// import { useNavigate } from "react-router-dom"
// import { logoutUser } from "../api/authApi"
// // import {  isCompanyAdmin, selectCompany } from '../slices/userSlice';
// import {
//   BarChart3,
//   Users,
//   Database,
//   Plus,
//   CheckCircle,
//   Clock,
//   RefreshCw,
//   TrendingUp,
//   Activity,
//   X,
//   LogOut,
//   CreditCard,
// } from "lucide-react"

// const API_BASE = import.meta.env.VITE_REMOTE_HOST

// const CompanyAdminDashboard = () => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const user = useSelector(selectUser)
//   const companyState = useSelector(selectCompany)
//   const company = useSelector(selectCompany)
//   const [activeTab, setActiveTab] = useState("overview")
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState({ type: "", text: "" })

//   // Data states
//   const [users, setUsers] = useState([])
//   const [jobs, setJobs] = useState([])
//   const [stats, setStats] = useState({})
//   const [activities, setActivities] = useState([])

//   // Modal states
//   const [showCreateUser, setShowCreateUser] = useState(false)
//   const [showEditUser, setShowEditUser] = useState(false)
//   const [showAssignJobs, setShowAssignJobs] = useState(false)
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [selectedJobs, setSelectedJobs] = useState([])
//   const [subscription, setSubscription] = useState(null)
//   //  const [overview, setOverview] = useState({ statusBreakdown: {}, userActivity: [] });
//   const [overview, setOverview] = useState({
//     grandTotal: {
//       total_engagement: 0,
//       not_engaged: 0,
//       applied: 0,
//       engaged: 0,
//       interview: 0,
//       offer: 0,
//       rejected: 0,
//       onboard: 0,
//     },
//     dailyTotals: [],
//     users: [],
//   })

//   // Form states
//   const [userForm, setUserForm] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "company_user",
//   })

//   const [assignForm, setAssignForm] = useState({
//     userId: "",
//     jobIds: [],
//   })

//   const [cid, setCid] = useState(() => user?.companyId || companyState?._id || companyState?.id || undefined)

//   const companyId = user?.companyId || companyState?._id || companyState?.id
//   const getEffectiveCompanyId = () =>
//     user?.companyId ||
//     companyState?._id ||
//     companyState?.id ||
//     (jobs && jobs.length > 0 ? jobs[0].companyId : undefined)

//   useEffect(() => {
//     setCid(getEffectiveCompanyId())
//   }, [user, companyState, jobs])

//   useEffect(() => {
//     if (!subscription && jobs.length > 0) {
//       if (cid) {
//         fetchCompanySubscription(cid)
//           .then(setSubscription)
//           .catch(() => {})
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [jobs, cid])

//   useEffect(() => {
//     loadInitialData()
//   }, [])

//   // Replace the incorrect API calls with the correct ones

//   // 1. Fix the createUser function (around line 140)
//   const createUser = async (userData) => {
//     try {
//       const response = await fetch(`${API_BASE}/api/users`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//         body: JSON.stringify({
//           username: userData.username,
//           email: userData.email,
//           password: userData.password,
//         }),
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const result = await response.json()
//       return result
//     } catch (error) {
//       console.error("Error creating user:", error)
//       throw error
//     }
//   }

//   // 2. Fix the updateUser function (around line 160)
//   const updateUser = async (userId, userData) => {
//     try {
//       const response = await fetch(`${API_BASE}/api/users`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//         body: JSON.stringify({
//           username: userData.username,
//           email: userData.email,
//           isActive: userData.isActive,
//         }),
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const result = await response.json()
//       return result
//     } catch (error) {
//       console.error("Error updating user:", error)
//       throw error
//     }
//   }

//   // 3. Fix the deleteUser function (around line 180)
//   const deleteUser = async (userId) => {
//     try {
//       const response = await fetch(`${API_BASE}/api/users`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const result = await response.json()
//       return result
//     } catch (error) {
//       console.error("Error deleting user:", error)
//       throw error
//     }
//   }

//   // 4. Add the missing changePassword function
//   const changePassword = async (userId, passwordData) => {
//     try {
//       const response = await fetch(`${API_BASE}/api/users/${userId}/change-password`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//         body: JSON.stringify({
//           newPassword: passwordData.newPassword,
//         }),
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const result = await response.json()
//       return result
//     } catch (error) {
//       console.error("Error changing password:", error)
//       throw error
//     }
//   }

//   // 5. Add the missing hardResetPassword function
//   const hardResetPassword = async (userId) => {
//     try {
//       const response = await fetch(`/api/users/${userId}/hard-reset-password`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const result = await response.json()
//       return result
//     } catch (error) {
//       console.error("Error hard resetting password:", error)
//       throw error
//     }
//   }

//   // Fetch company subscriptio
//   const fetchCompanySubscription = async (idParam) => {
//     try {
//       const id = idParam || getEffectiveCompanyId()
//       if (!id) return null
//       const res = await fetch(`${API_BASE}/api/companies/${id}/subscription`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
//       })
//       if (!res.ok) return null
//       const data = await res.json()
//       return data.subscription || null
//     } catch {
//       return null
//     }
//   }
//   // 6. Fix the fetchUsers function (around line 200)
//   const fetchUsers = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/api/users`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const result = await response.json()
//       // Handle the response structure: { users: [...] }
//       return result.users || []
//     } catch (error) {
//       console.error("Error fetching users:", error)
//       throw error
//     }
//   }

//   // Check role access
//   if (!isCompanyAdmin(user)) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <X className="mx-auto h-16 w-16 text-red-500 mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
//           <p className="text-gray-600">Only company administrators can access this dashboard.</p>
//         </div>
//       </div>
//     )
//   }

//   const fetchCompanyStats = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/api/company/stats`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const result = await response.json()
//       return result
//     } catch (error) {
//       console.error("Error fetching company stats:", error)
//       throw error
//     }
//   }

//   // Load initial data with improved error handling
//   // replace your loadInitialData with:
//   const loadInitialData = async () => {
//     setLoading(true)
//     setMessage({ type: "", text: "" })

//     try {
//       // Phase 1: users/jobs/stats
//       const baseResults = await Promise.allSettled([
//         fetchUsers(),
//         fetchCompanyJobs(),
//         fetchCompanyStats(),
//         fetchJobsOverview(),
//       ])

//       if (baseResults[0].status === "fulfilled") setUsers(baseResults[0].value)
//       else setMessage({ type: "error", text: "Failed to load users" })

//       if (baseResults[1].status === "fulfilled") setJobs(baseResults[1].value)
//       else setMessage({ type: "error", text: "Failed to load jobs" })

//       if (baseResults[2].status === "fulfilled") setStats(baseResults[2].value || {})
//       else setMessage({ type: "error", text: "Failed to load stats" })

//       if (baseResults[3].status === "fulfilled" && baseResults[3].value) {
//         setOverview(baseResults[3].value)
//       } else {
//         setOverview({
//           grandTotal: {
//             total_engagement: 0,
//             not_engaged: 0,
//             applied: 0,
//             engaged: 0,
//             interview: 0,
//             offer: 0,
//             rejected: 0,
//             onboard: 0,
//           },
//           dailyTotals: [],
//           users: [],
//         })
//       }

//       // Phase 2: derive companyId and fetch subscription + activity
//       const cid = getEffectiveCompanyId()
//       const tailResults = await Promise.allSettled([fetchCompanySubscription(cid)])

//       if (tailResults[0].status === "fulfilled") setSubscription(tailResults[0].value)
//       else setSubscription(null)

//       if (tailResults[1].status === "fulfilled")
//         setActivities(Array.isArray(tailResults[1].value) ? tailResults[1].value : [])
//       else setActivities([])
//     } catch {
//       setMessage({ type: "error", text: "Failed to load initial data" })
//     } finally {
//       setLoading(false)
//     }
//   }

//   // 3. Add the missing fetchCompanyJobs function
//   const fetchCompanyJobs = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/api/company-jobs`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       const result = await response.json()
//       return result.jobs || []
//     } catch (error) {
//       console.error("Error fetching company jobs:", error)
//       throw error
//     }
//   }

//   const fetchJobsOverview = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/api/company-jobs/stats/overview`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
//       })
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
//       const data = await res.json()
//       return {
//         grandTotal: {
//           total_engagement: data?.grandTotal?.total_engagement ?? 0,
//           not_engaged: data?.grandTotal?.not_engaged ?? 0,
//           applied: data?.grandTotal?.applied ?? 0,
//           engaged: data?.grandTotal?.engaged ?? 0,
//           interview: data?.grandTotal?.interview ?? 0,
//           offer: data?.grandTotal?.offer ?? 0,
//           rejected: data?.grandTotal?.rejected ?? 0,
//           onboard: data?.grandTotal?.onboard ?? 0,
//         },
//         dailyTotals: Array.isArray(data?.dailyTotals) ? data.dailyTotals : [],
//         users: Array.isArray(data?.users) ? data.users : [],
//       }
//     } catch (err) {
//       console.error("Overview stats fetch error:", err)
//       return {
//         grandTotal: {
//           total_engagement: 0,
//           not_engaged: 0,
//           applied: 0,
//           engaged: 0,
//           interview: 0,
//           offer: 0,
//           rejected: 0,
//           onboard: 0,
//         },
//         dailyTotals: [],
//         users: [],
//       }
//     }
//   }
//   // 4. Add the missing fetchCompanyStats function
//   // Company stats

//   // Activity feed (optional endpoint; handled gracefully if missing)
//   // const fetchCompanyActivity = async () => {
//   //   try {
//   //     const res = await fetch(`${API_BASE}/api/company/activity`, {
//   //       headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
//   //     });
//   //     if (!res.ok) return []; // tolerate 404
//   //     const data = await res.json();
//   //     return Array.isArray(data.activities) ? data.activities : (Array.isArray(data) ? data : []);
//   //   } catch {
//   //     return [];
//   //   }
//   // };
//   // const [cid, setCid] = useState(getEffectiveCompanyId())

//   // useEffect(() => {
//   //   setCid(getEffectiveCompanyId())
//   // }, [user, companyState, jobs])

//   // useEffect(() => {
//   //   if (!subscription && jobs.length > 0) {
//   //     if (cid) {
//   //       fetchCompanySubscription(cid)
//   //         .then(setSubscription)
//   //         .catch(() => {})
//   //     }
//   //   }
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [jobs, cid])

//   // useEffect(() => {
//   //   loadInitialData()
//   // }, [])

//   // Message handling with auto-dismiss
//   const showMessage = (type, text) => {
//     setMessage({ type, text })
//     setTimeout(() => setMessage({ type: "", text: "" }), 5000)
//   }

//   // User operations
//   const handleCreateUser = async (userData) => {
//     if (!userData.username || !userData.email || !userData.password) {
//       setMessage({ type: "error", text: "All fields are required" })
//       return
//     }

//     try {
//       setLoading(true)
//       const result = await createUser(userData)

//       if (result.message === "User created successfully") {
//         setMessage({ type: "success", text: "User created successfully!" })
//         setUserForm({ username: "", email: "", password: "", role: "company_user" })
//         setShowCreateUser(false)
//         await loadInitialData()
//       } else {
//         setMessage({ type: "error", text: result.message || "Failed to create user" })
//       }
//     } catch (error) {
//       setMessage({ type: "error", text: error.message || "Failed to create user" })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleUpdateUser = async (userId, userData) => {
//     try {
//       setLoading(true)
//       const response = await fetch(`/api/users/${userId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//         body: JSON.stringify(userData),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to update user")
//       }

//       showMessage("success", "User updated successfully!")
//       setShowEditUser(false)
//       setSelectedUser(null)
//       await loadInitialData()
//     } catch (error) {
//       console.error("Error updating user:", error)
//       showMessage("error", error.message || "Failed to update user")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDeleteUser = async (userId) => {
//     if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
//       return
//     }

//     try {
//       setLoading(true)
//       const response = await fetch(`/api/users/${userId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
//       })

//       if (!response.ok) {
//         throw new Error("Failed to delete user")
//       }

//       showMessage("success", "User deleted successfully!")
//       await loadInitialData()
//     } catch (error) {
//       console.error("Error deleting user:", error)
//       showMessage("error", error.message || "Failed to delete user")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Job operations
//   const handleAssignJobs = async (assignmentData) => {
//     try {
//       setLoading(true)
//       const response = await fetch("/api/company/jobs/assign", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//         body: JSON.stringify(assignmentData),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to assign jobs")
//       }

//       showMessage("success", "Jobs assigned successfully!")
//       setShowAssignJobs(false)
//       setAssignForm({ userId: "", jobIds: [] })
//       setSelectedJobs([])
//       await loadInitialData()
//     } catch (error) {
//       console.error("Error assigning jobs:", error)
//       showMessage("error", error.message || "Failed to assign jobs")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleBulkUpdateJobs = async (status) => {
//     if (selectedJobs.length === 0) {
//       showMessage("error", "Please select jobs to update")
//       return
//     }

//     try {
//       setLoading(true)
//       const response = await fetch("/api/company/jobs/bulk-update", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//         body: JSON.stringify({ jobIds: selectedJobs, status }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to update jobs")
//       }

//       showMessage("success", `Jobs updated to ${status} successfully!`)
//       setSelectedJobs([])
//       await loadInitialData()
//     } catch (error) {
//       console.error("Error updating jobs:", error)
//       showMessage("error", error.message || "Failed to update jobs")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const toggleJobSelection = (jobId) => {
//     setSelectedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
//   }

//   const OverviewTab = () => {
//     const totalUsers = users.length
//     const activeUsers = users.filter((u) => u.isActive).length
//     const totalJobs = jobs.length
//     const assignedJobs =
//       typeof stats.assignedJobs === "number" ? stats.assignedJobs : jobs.filter((j) => !!j.assignee).length

//     const gt = overview.grandTotal || {}
//     const statusCards = [
//       {
//         key: "not_engaged",
//         label: "Not Engaged",
//         color: "bg-slate-50 text-slate-700 border-slate-200",
//         gradient: "from-slate-50 to-slate-100",
//       },
//       {
//         key: "applied",
//         label: "Applied",
//         color: "bg-blue-50 text-blue-700 border-blue-200",
//         gradient: "from-blue-50 to-blue-100",
//       },
//       {
//         key: "engaged",
//         label: "Engaged",
//         color: "bg-indigo-50 text-indigo-700 border-indigo-200",
//         gradient: "from-indigo-50 to-indigo-100",
//       },
//       {
//         key: "interview",
//         label: "Interview",
//         color: "bg-purple-50 text-purple-700 border-purple-200",
//         gradient: "from-purple-50 to-purple-100",
//       },
//       {
//         key: "offer",
//         label: "Offer",
//         color: "bg-emerald-50 text-emerald-700 border-emerald-200",
//         gradient: "from-emerald-50 to-emerald-100",
//       },
//       {
//         key: "rejected",
//         label: "Rejected",
//         color: "bg-red-50 text-red-700 border-red-200",
//         gradient: "from-red-50 to-red-100",
//       },
//       {
//         key: "onboard",
//         label: "Onboard",
//         color: "bg-teal-50 text-teal-700 border-teal-200",
//         gradient: "from-teal-50 to-teal-100",
//       },
//     ]

//     const statusKeys = ["not_engaged", "applied", "engaged", "interview", "offer", "rejected", "onboard"]
//     const statusMeta = {
//       applied: { color: "bg-gradient-to-t from-blue-500 to-blue-400", shadow: "shadow-blue-200" },
//       engaged: { color: "bg-gradient-to-t from-indigo-500 to-indigo-400", shadow: "shadow-indigo-200" },
//       interview: { color: "bg-gradient-to-t from-purple-500 to-purple-400", shadow: "shadow-purple-200" },
//       offer: { color: "bg-gradient-to-t from-emerald-500 to-emerald-400", shadow: "shadow-emerald-200" },
//       rejected: { color: "bg-gradient-to-t from-red-500 to-red-400", shadow: "shadow-red-200" },
//       onboard: { color: "bg-gradient-to-t from-teal-500 to-teal-400", shadow: "shadow-teal-200" },
//       not_engaged: { color: "bg-gradient-to-t from-slate-400 to-slate-300", shadow: "shadow-slate-200" },
//     }

//     const toYmd = (d) => {
//       const dt = new Date(d)
//       const y = dt.getFullYear()
//       const m = String(dt.getMonth() + 1).padStart(2, "0")
//       const day = String(dt.getDate()).padStart(2, "0")
//       return `${y}-${m}-${day}`
//     }
//     const buildDateRange = (startYmd, endYmd) => {
//       const out = []
//       const start = new Date(startYmd + "T00:00:00")
//       const end = new Date(endYmd + "T00:00:00")
//       for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//         out.push(toYmd(d))
//       }
//       return out
//     }

//     // Use existing overview data directly
//     const dailyMap = (Array.isArray(overview.dailyTotals) ? overview.dailyTotals : []).reduce((acc, d) => {
//       const key = toYmd(d.date || d._id || d.day || new Date())
//       acc[key] = {
//         total_engagement: Number(d.total_engagement) || 0,
//         ...statusKeys.reduce((o, k) => ({ ...o, [k]: Number(d[k]) || 0 }), {}),
//       }
//       return acc
//     }, {})

//     // Get date range from existing data
//     const datesInData = Object.keys(dailyMap).sort()
//     const normalizedDaily =
//       datesInData.length > 0
//         ? datesInData.map((ymd) => {
//             const v = dailyMap[ymd] || {}
//             return {
//               date: ymd,
//               total_engagement: Number(v.total_engagement) || 0,
//               ...statusKeys.reduce((o, k) => ({ ...o, [k]: Number(v[k]) || 0 }), {}),
//             }
//           })
//         : []

//     const maxDaily = Math.max(1, ...normalizedDaily.map((d) => d.total_engagement))
//     const perStatusMax = statusKeys.reduce((acc, key) => {
//       acc[key] = Math.max(1, ...normalizedDaily.map((d) => Number(d[key]) || 0))
//       return acc
//     }, {})

//     // Heights with proper spacing to prevent overlap
//     const BASE_TREND_H = 200 // Overall daily trend
//     const BASE_USER_H = 180 // Per-user mini charts
//     const BASE_STATUS_H = 140 // Per-status daily charts

//     const totalEngagement = normalizedDaily.reduce((sum, d) => sum + (Number(d.total_engagement) || 0), 0)
//     const avgEngagement = normalizedDaily.length > 0 ? Math.round(totalEngagement / normalizedDaily.length) : 0
//     const peakEngagement = Math.max(...normalizedDaily.map((d) => Number(d.total_engagement) || 0))
//     const peakDay = normalizedDaily.find((d) => Number(d.total_engagement) === peakEngagement)

//     return (
//       <div className="space-y-8">
//         <div className="flex justify-between items-center">
//           <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
//             Company Overview
//           </h2>
//           <div className="flex items-center space-x-2 text-sm text-slate-500">
//             <Activity className="h-4 w-4" />
//             <span>Real-time Analytics</span>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg shadow-purple-100 p-6 border border-purple-200 hover:shadow-xl transition-all duration-300">
//             <div className="flex items-center">
//               <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
//                 <Users className="h-6 w-6 text-white" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-purple-700">Total Users</p>
//                 <p className="text-3xl font-bold text-purple-900">{totalUsers}</p>
//                 <p className="text-xs text-purple-600 mt-1">Company Members</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-lg shadow-emerald-100 p-6 border border-emerald-200 hover:shadow-xl transition-all duration-300">
//             <div className="flex items-center">
//               <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
//                 <CheckCircle className="h-6 w-6 text-white" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-emerald-700">Active Users</p>
//                 <p className="text-3xl font-bold text-emerald-900">{activeUsers}</p>
//                 <p className="text-xs text-emerald-600 mt-1">
//                   {totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}% Active Rate
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg shadow-blue-100 p-6 border border-blue-200 hover:shadow-xl transition-all duration-300">
//             <div className="flex items-center">
//               <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
//                 <Database className="h-6 w-6 text-white" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-blue-700">Total Jobs</p>
//                 <p className="text-3xl font-bold text-blue-900">{totalJobs}</p>
//                 <p className="text-xs text-blue-600 mt-1">Job Opportunities</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-lg shadow-amber-100 p-6 border border-amber-200 hover:shadow-xl transition-all duration-300">
//             <div className="flex items-center">
//               <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
//                 <Clock className="h-6 w-6 text-white" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-amber-700">Assigned Jobs</p>
//                 <p className="text-3xl font-bold text-amber-900">{assignedJobs}</p>
//                 <p className="text-xs text-amber-600 mt-1">
//                   {totalJobs > 0 ? Math.round((assignedJobs / totalJobs) * 100) : 0}% Assigned
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
//           {statusCards.map((item) => (
//             <div
//               key={item.key}
//               className={`bg-gradient-to-br ${item.gradient} rounded-xl shadow-lg p-5 border ${item.color.split(" ")[2]} hover:shadow-xl transition-all duration-300 hover:scale-105`}
//             >
//               <div className="text-sm font-medium text-slate-600 mb-2">{item.label}</div>
//               <div className="flex items-center justify-between">
//                 <div className="text-2xl font-bold text-slate-900">{gt[item.key] ?? 0}</div>
//                 <div className="text-xs text-slate-500">
//                   {totalEngagement > 0 ? Math.round(((gt[item.key] ?? 0) / totalEngagement) * 100) : 0}%
//                 </div>
//               </div>
//               <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-gradient-to-r from-slate-400 to-slate-500 rounded-full transition-all duration-500"
//                   style={{ width: `${totalEngagement > 0 ? ((gt[item.key] ?? 0) / totalEngagement) * 100 : 0}%` }}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-xl border border-slate-200 overflow-hidden">
//           <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="p-2 bg-white/20 rounded-lg">
//                   <TrendingUp className="h-5 w-5 text-white" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-white">Daily Engagement Trend</h3>
//               </div>
//               <div className="flex items-center space-x-6 text-white/90">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold">{totalEngagement}</div>
//                   <div className="text-xs opacity-75">Total</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold">{avgEngagement}</div>
//                   <div className="text-xs opacity-75">Avg/Day</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold">{peakEngagement}</div>
//                   <div className="text-xs opacity-75">Peak Day</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="p-6">
//             {normalizedDaily.length === 0 ? (
//               <div className="text-center py-12">
//                 <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
//                 <div className="text-slate-500 text-lg">No engagement data available</div>
//                 <div className="text-slate-400 text-sm">Data will appear once users start engaging</div>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 <div className="flex items-end justify-center space-x-1" style={{ height: "280px" }}>
//                   {normalizedDaily.map((d, idx) => {
//                     const val = Number(d.total_engagement) || 0
//                     const hPx = Math.round((val / maxDaily) * 220)
//                     const isPeak = val === peakEngagement
//                     const label = new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "2-digit" })
//                     return (
//                       <div key={idx} className="flex-1 flex flex-col items-center group">
//                         <div className="text-xs font-semibold text-slate-700 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                           {val}
//                         </div>
//                         <div className="relative">
//                           {isPeak && (
//                             <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
//                               <div className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
//                                 Peak
//                               </div>
//                             </div>
//                           )}
//                           <div
//                             className={`w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${isPeak ? "ring-2 ring-yellow-400" : ""}`}
//                             style={{ height: `${Math.max(4, hPx)}px`, minWidth: "20px" }}
//                           />
//                         </div>
//                         <div className="mt-3 text-xs text-slate-600 font-medium transform -rotate-45 origin-center">
//                           {label}
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>

//                 {peakDay && (
//                   <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4">
//                     <div className="flex items-center space-x-2">
//                       <TrendingUp className="h-4 w-4 text-yellow-600" />
//                       <span className="text-sm font-medium text-yellow-800">
//                         Peak Performance: {new Date(peakDay.date).toLocaleDateString()} with {peakEngagement}{" "}
//                         engagements
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-xl border border-slate-200 overflow-hidden">
//           <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-white/20 rounded-lg">
//                 <Users className="h-5 w-5 text-white" />
//               </div>
//               <h3 className="text-xl font-semibold text-white">Team Member Performance</h3>
//             </div>
//           </div>

//           <div className="p-6">
//             {overview.users.length === 0 ? (
//               <div className="text-center py-12">
//                 <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
//                 <div className="text-slate-500 text-lg">No team performance data</div>
//                 <div className="text-slate-400 text-sm">User activity will appear here</div>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {overview.users.map((u, idx) => {
//                   const s = u.statuses || {}
//                   const maxUser = Math.max(1, ...statusKeys.map((k) => Number(s[k]) || 0))
//                   const totalUserEngagement = statusKeys.reduce((sum, k) => sum + (Number(s[k]) || 0), 0)
//                   const topStatus = statusKeys.reduce(
//                     (top, k) => ((Number(s[k]) || 0) > (Number(s[top]) || 0) ? k : top),
//                     statusKeys[0],
//                   )

//                   return (
//                     <div
//                       key={idx}
//                       className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
//                     >
//                       <div className="mb-4 flex items-center justify-between">
//                         <div>
//                           <div className="font-bold text-slate-900 text-lg">{u.username || u._id}</div>
//                           <div className="text-sm text-slate-500">Total: {totalUserEngagement} engagements</div>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-xs text-slate-500 mb-1">Top Status</div>
//                           <div
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${statusCards.find((sc) => sc.key === topStatus)?.color || "bg-slate-100 text-slate-700"}`}
//                           >
//                             {topStatus.replace("_", " ")}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-end justify-center space-x-1" style={{ height: "160px" }}>
//                         {statusKeys.map((k) => {
//                           const val = Number(s[k]) || 0
//                           const hPx = Math.round((val / maxUser) * 120)
//                           const percentage = totalUserEngagement > 0 ? Math.round((val / totalUserEngagement) * 100) : 0

//                           return (
//                             <div key={k} className="flex-1 flex flex-col items-center group">
//                               <div className="text-xs font-semibold text-slate-700 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                                 {val} ({percentage}%)
//                               </div>
//                               <div
//                                 className={`w-full ${statusMeta[k].color} rounded-t-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105`}
//                                 style={{ height: `${Math.max(4, hPx)}px`, minWidth: "16px" }}
//                               />
//                               <div className="mt-2 text-xs text-slate-600 font-medium text-center leading-tight">
//                                 {k.replace("_", " ")}
//                               </div>
//                             </div>
//                           )
//                         })}
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-xl border border-slate-200 overflow-hidden">
//           <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-white/20 rounded-lg">
//                 <TrendingUp className="h-5 w-5 text-white" />
//               </div>
//               <h3 className="text-xl font-semibold text-white">Status Trends by Day</h3>
//             </div>
//           </div>

//           <div className="p-6 space-y-6">
//             {statusKeys.map((k) => {
//               const maxForStatus = perStatusMax[k] || 1
//               const statusTotal = normalizedDaily.reduce((sum, d) => sum + (Number(d[k]) || 0), 0)
//               const statusAvg = normalizedDaily.length > 0 ? Math.round(statusTotal / normalizedDaily.length) : 0
//               const statusCard = statusCards.find((sc) => sc.key === k)

//               return (
//                 <div
//                   key={k}
//                   className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
//                 >
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center space-x-3">
//                       <div
//                         className={`px-3 py-1 rounded-lg font-semibold ${statusCard?.color || "bg-slate-100 text-slate-700"}`}
//                       >
//                         {k.replace("_", " ").toUpperCase()}
//                       </div>
//                       <div className="text-sm text-slate-500">
//                         Total: {statusTotal} | Avg: {statusAvg}/day | Peak: {maxForStatus}
//                       </div>
//                     </div>
//                   </div>

//                   {normalizedDaily.length === 0 ? (
//                     <div className="text-center py-8 text-slate-500">No trend data available</div>
//                   ) : (
//                     <div className="flex items-end justify-center space-x-1" style={{ height: "120px" }}>
//                       {normalizedDaily.map((d, idx) => {
//                         const val = Number(d[k]) || 0
//                         const hPx = Math.round((val / maxForStatus) * 80)
//                         const isPeak = val === maxForStatus
//                         const label = new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "2-digit" })

//                         return (
//                           <div key={idx} className="flex-1 flex flex-col items-center group">
//                             <div className="text-xs font-semibold text-slate-700 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                               {val}
//                             </div>
//                             <div className="relative">
//                               {isPeak && val > 0 && (
//                                 <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
//                                   <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
//                                 </div>
//                               )}
//                               <div
//                                 className={`w-full ${statusMeta[k].color} rounded-t-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105`}
//                                 style={{ height: `${Math.max(2, hPx)}px`, minWidth: "12px" }}
//                               />
//                             </div>
//                             <div className="mt-2 text-xs text-slate-600 font-medium transform -rotate-45 origin-center">
//                               {label}
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   )}
//                 </div>
//               )
//             })}
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-xl border border-slate-200 overflow-hidden">
//           <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-white/20 rounded-lg">
//                 <Users className="h-5 w-5 text-white" />
//               </div>
//               <h3 className="text-xl font-semibold text-white">Detailed Team Performance</h3>
//             </div>
//           </div>

//           <div className="p-6">
//             {overview.users.length === 0 ? (
//               <div className="text-center py-12">
//                 <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
//                 <div className="text-slate-500 text-lg">No performance data available</div>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full">
//                   <thead>
//                     <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
//                       <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider rounded-tl-lg">
//                         User
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                         Not Engaged
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
//                         Applied
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
//                         Engaged
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
//                         Interview
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-emerald-700 uppercase tracking-wider">
//                         Offer
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-red-700 uppercase tracking-wider">
//                         Rejected
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-teal-700 uppercase tracking-wider">
//                         Onboard
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider rounded-tr-lg">
//                         Total
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-200">
//                     {overview.users.map((u, i) => {
//                       const s = u.statuses || {}
//                       const total = statusKeys.reduce((sum, k) => sum + (Number(s[k]) || 0), 0)
//                       return (
//                         <tr
//                           key={i}
//                           className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent transition-all duration-200"
//                         >
//                           <td className="px-6 py-4 text-sm font-bold text-slate-900">{u.username || u._id}</td>
//                           <td className="px-6 py-4 text-sm font-semibold text-slate-600">{s.not_engaged ?? 0}</td>
//                           <td className="px-6 py-4 text-sm font-semibold text-blue-600">{s.applied ?? 0}</td>
//                           <td className="px-6 py-4 text-sm font-semibold text-indigo-600">{s.engaged ?? 0}</td>
//                           <td className="px-6 py-4 text-sm font-semibold text-purple-600">{s.interview ?? 0}</td>
//                           <td className="px-6 py-4 text-sm font-semibold text-emerald-600">{s.offer ?? 0}</td>
//                           <td className="px-6 py-4 text-sm font-semibold text-red-600">{s.rejected ?? 0}</td>
//                           <td className="px-6 py-4 text-sm font-semibold text-teal-600">{s.onboard ?? 0}</td>
//                           <td className="px-6 py-4 text-sm font-bold text-slate-900 bg-slate-50">{total}</td>
//                         </tr>
//                       )
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   const UsersTab = () => {
//     const handleEditUser = (user) => {
//       setSelectedUser(user)
//       setUserForm({
//         username: user.username,
//         email: user.email,
//         isActive: user.isActive,
//       })
//       setShowEditUser(true)
//     }
//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-900">Company Users</h2>
//           <button
//             onClick={() => setShowCreateUser(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
//           >
//             <Plus size={20} />
//             <span>Add User</span>
//           </button>
//         </div>

//         {loading ? (
//           <div className="flex justify-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           </div>
//         ) : users.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             <Users size={48} className="mx-auto mb-4 text-gray-300" />
//             <p>No users found. Create your first user to get started.</p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow overflow-hidden">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     User
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Role
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Created
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {users.map((user) => (
//                   <tr key={user._id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{user.username}</div>
//                         <div className="text-sm text-gray-500">{user.email}</div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           user.role === "company_admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
//                         }`}
//                       >
//                         {user.role === "company_admin" ? "Admin" : "User"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {user.isActive ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {new Date(user.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                       <button onClick={() => handleEditUser(user)} className="text-blue-600 hover:text-blue-900">
//                         Edit
//                       </button>
//                       <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-900">
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     )
//   }

//   // const JobsTab = () => (
//   //   <div className="space-y-6">
//   //     <div className="flex justify-between items-center">
//   //       <h2 className="text-2xl font-bold text-gray-900">Company Jobs</h2>
//   //       <div className="flex space-x-2">
//   //         <button
//   //           onClick={() => setShowAssignJobs(true)}
//   //           disabled={selectedJobs.length === 0}
//   //           className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
//   //         >
//   //           Assign Selected ({selectedJobs.length})
//   //         </button>
//   //         <button
//   //           onClick={() => handleBulkUpdateJobs('in_progress')}
//   //           disabled={selectedJobs.length === 0}
//   //           className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 transition-colors"
//   //         >
//   //           Mark In Progress
//   //         </button>
//   //         <button
//   //           onClick={() => handleBulkUpdateJobs('completed')}
//   //           disabled={selectedJobs.length === 0}
//   //           className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
//   //         >
//   //           Mark Completed
//   //         </button>
//   //       </div>
//   //     </div>

//   //     <div className="bg-white rounded-lg shadow overflow-hidden">
//   //       {jobs.length === 0 ? (
//   //         <div className="p-8 text-center">
//   //           <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//   //           <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs assigned yet</h3>
//   //           <p className="text-gray-500">Jobs will appear here once they are distributed to your company.</p>
//   //         </div>
//   //       ) : (
//   //         <div className="overflow-x-auto">
//   //           <table className="min-w-full divide-y divide-gray-200">
//   //             <thead className="bg-gray-50">
//   //               <tr>
//   //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//   //                   <input
//   //                     type="checkbox"
//   //                     checked={selectedJobs.length === jobs.length}
//   //                     onChange={(e) => {
//   //                       if (e.target.checked) {
//   //                         setSelectedJobs(jobs.map(j => j.id));
//   //                       } else {
//   //                         setSelectedJobs([]);
//   //                       }
//   //                     }}
//   //                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//   //                   />
//   //                 </th>
//   //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//   //                   Job Details
//   //                 </th>
//   //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//   //                   Platform
//   //                 </th>
//   //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//   //                   Status
//   //                 </th>
//   //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//   //                   Assigned To
//   //                 </th>
//   //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//   //                   Actions
//   //                 </th>
//   //               </tr>
//   //             </thead>
//   //             <tbody className="bg-white divide-y divide-gray-200">
//   //               {jobs.map((job) => (
//   //                 <tr key={job.id} className="hover:bg-gray-50 transition-colors">
//   //                   <td className="px-6 py-4 whitespace-nowrap">
//   //                     <input
//   //                       type="checkbox"
//   //                       checked={selectedJobs.includes(job.id)}
//   //                       onChange={() => toggleJobSelection(job.id)}
//   //                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//   //                     />
//   //                   </td>
//   //                   <td className="px-6 py-4 whitespace-nowrap">
//   //                     <div>
//   //                       <div className="text-sm font-medium text-gray-900">
//   //                         {job.title}
//   //                       </div>
//   //                       <div className="text-sm text-gray-500">
//   //                         {job.company}
//   //                       </div>
//   //                     </div>
//   //                   </td>
//   //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//   //                     <span className="capitalize">{job.platform}</span>
//   //                   </td>
//   //                   <td className="px-6 py-4 whitespace-nowrap">
//   //                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//   //                       job.status === 'completed'
//   //                         ? 'bg-green-100 text-green-800'
//   //                         : job.status === 'in_progress'
//   //                         ? 'bg-yellow-100 text-yellow-800'
//   //                         : 'bg-gray-100 text-gray-800'
//   //                     }`}>
//   //                       {job.status || 'pending'}
//   //                     </span>
//   //                   </td>
//   //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//   //                     {job.assignee ? job.assignee.username : 'Unassigned'}
//   //                   </td>
//   //                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//   //                     <button
//   //                       onClick={() => {
//   //                         // View job details
//   //                       }}
//   //                       className="text-blue-600 hover:text-blue-900 transition-colors"
//   //                       title="View Details"
//   //                     >
//   //                       <Eye className="h-4 w-4" />
//   //                     </button>
//   //                   </td>
//   //                 </tr>
//   //               ))}
//   //             </tbody>
//   //           </table>
//   //         </div>
//   //       )}
//   //     </div>
//   //   </div>
//   // );

//   const SubscriptionTab = () => {
//     const refreshSubscription = async () => {
//       setLoading(true)
//       try {
//         const sub = await fetchCompanySubscription(getEffectiveCompanyId())
//         setSubscription(sub)
//       } finally {
//         setLoading(false)
//       }
//     }

//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-900">Subscription</h2>
//           <button
//             onClick={refreshSubscription}
//             disabled={loading}
//             className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
//           >
//             <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
//             <span>{loading ? "Refreshing..." : "Refresh"}</span>
//           </button>
//         </div>

//         {!subscription ? (
//           <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
//             No subscription found for this company.
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center space-x-3">
//                 <div className="p-2 bg-indigo-100 rounded-lg">
//                   <CreditCard className="h-6 w-6 text-indigo-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Current Plan</p>
//                   <p className="text-lg font-semibold text-gray-900 capitalize">
//                     {subscription.plan} ({subscription.status})
//                   </p>
//                 </div>
//               </div>
//               <div className="text-right text-sm text-gray-600">
//                 <div>Start: {new Date(subscription.startDate).toLocaleDateString()}</div>
//                 <div>End: {new Date(subscription.endDate).toLocaleDateString()}</div>
//                 <div className="font-medium">{subscription.daysRemaining} days remaining</div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <div className="flex justify-between text-sm text-gray-600">
//                 <span>Usage</span>
//                 <span>
//                   {subscription.jobsUsed}/{subscription.jobsQuota} (
//                   {subscription.usagePercentage ??
//                     Math.round((subscription.jobsUsed / Math.max(1, subscription.jobsQuota)) * 100)}
//                   %)
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-indigo-600 h-2 rounded-full"
//                   style={{
//                     width: `${subscription.usagePercentage ?? Math.round((subscription.jobsUsed / Math.max(1, subscription.jobsQuota)) * 100)}%`,
//                   }}
//                 />
//               </div>
//               <div className="text-xs text-gray-500">
//                 Remaining: {subscription.jobsRemaining} | Last sync:{" "}
//                 {subscription.lastJobSync ? new Date(subscription.lastJobSync).toLocaleString() : "—"}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "overview":
//         return <OverviewTab />
//       case "users":
//         return <UsersTab />
//       // case 'jobs': return <JobsTab />;
//       case "subscription":
//         return <SubscriptionTab />
//       default:
//         return <OverviewTab />
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* <Header hideDownloadExcel /> */}

//       {/* Message Display
//       {message.text && (
//         <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 ${
//           message.type === 'success' ? 'text-green-600' : 'text-red-600'
//         }`}>
//           <div className={`p-3 rounded-md ${
//             message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
//           }`}>
//             {message.text}
//           </div>
//         </div>
//       )} */}

//       <main className="max-w-7xl mx-auto p-4 space-y-2">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
//               <p className="text-gray-600 mt-1">Manage your company's users and jobs</p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="text-right">
//                 <p className="text-sm text-gray-500">Company</p>
//                 <p className="font-medium">{user?.companyName || "Your Company"}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm text-gray-500">Admin</p>
//                 <p className="font-medium">{user?.username || user?.email}</p>
//               </div>
//               {/* {subscription && (
//                 <div className="flex items-center space-x-2">
//                   <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
//                     {subscription.plan}
//                   </span>
//                   <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
//                     } capitalize`}>
//                     {subscription.status}
//                   </span>
//                   <span className="text-xs text-gray-500">
//                     {subscription.daysRemaining} days left
//                   </span>
//                 </div>
//               )} */}
//               <button
//                 onClick={() => {
//                   logoutUser(dispatch)
//                   navigate("/login", { replace: true })
//                 }}
//                 className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
//                 title="Logout"
//               >
//                 <LogOut size={18} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="px-6 py-4 border-b border-gray-200">
//           <nav className="flex space-x-8">
//             {[
//               { id: "overview", label: "Overview", icon: BarChart3 },
//               { id: "users", label: "Users", icon: Users },
//               // { id: 'jobs', label: 'Jobs', icon: Database },
//               { id: "subscription", label: "Subscription", icon: CreditCard },
//             ].map((tab) => {
//               const Icon = tab.icon
//               const isActive = activeTab === tab.id

//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
//                     isActive
//                       ? "border-blue-500 text-blue-600"
//                       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                   }`}
//                 >
//                   <Icon size={18} />
//                   <span>{tab.label}</span>
//                 </button>
//               )
//             })}
//           </nav>
//         </div>

//         {/* Tab Content */}
//         {renderTabContent()}
//       </main>

//       {/* Modals */}
//       <CreateUserModal
//         isOpen={showCreateUser}
//         onClose={() => setShowCreateUser(false)}
//         onSubmit={handleCreateUser}
//         loading={loading}
//         formData={userForm}
//         setFormData={setUserForm}
//       />

//       <EditUserModal
//         isOpen={showEditUser}
//         onClose={() => setShowEditUser(false)}
//         onSubmit={(userData) => handleUpdateUser(selectedUser?.id, userData)}
//         loading={loading}
//         formData={userForm}
//         setFormData={setUserForm}
//         user={selectedUser}
//       />

//       <AssignJobsModal
//         isOpen={showAssignJobs}
//         onClose={() => setShowAssignJobs(false)}
//         onSubmit={handleAssignJobs}
//         loading={loading}
//         users={users}
//         selectedJobs={selectedJobs}
//         formData={assignForm}
//         setFormData={setAssignForm}
//       />
//     </div>
//   )
// }

// export default CompanyAdminDashboard;



"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectUser, isCompanyAdmin, selectCompany, selectPipeline } from "../slices/userSlice"
import { fetchCompanyPipelineThunk, updateCompanyPipelineThunk } from "../slices/userSlice"
// import { CreateUserModal } from "../components/CreateUserModal"
import { EditUserModal } from "../components/EditUserModal"
import { AssignJobsModal } from "../components/AssignJobsModal"
import { useNavigate } from "react-router-dom"
import { logoutUser } from "../api/authApi"
import CreateComUserModal from "../components/CreateComUserModal"
import CreateCompanyModal from "../components/CreateCompanyModal"
// import {  isCompanyAdmin, selectCompany } from '../slices/userSlice';
import { userAPI } from "../services/api";
import {
  BarChart3,
  Users,
  Database,
  Plus,
  CheckCircle,
  Clock,
  RefreshCw,
  TrendingUp,
  Activity,
  X,
  LogOut,
  CreditCard,
} from "lucide-react"

const API_BASE = import.meta.env.VITE_REMOTE_HOST

const CompanyAdminDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const companyState = useSelector(selectCompany)
  const company = useSelector(selectCompany)
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const currentCompany = companyState || { _id: user?.companyId, companyName: user?.companyName || user?.company };
  // Data states
  const [users, setUsers] = useState([])
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState({})
  const [activities, setActivities] = useState([])
  const pipeline = useSelector(selectPipeline)
  const [pipelineForm, setPipelineForm] = useState({
    name: "Custom Pipeline",
    statusStages: [
      { name: "not_engaged", displayName: "Not Engaged", sortOrder: 0 },
      { name: "applied", displayName: "Applied", sortOrder: 1 },
      { name: "interview", displayName: "Interview", sortOrder: 2 },
      { name: "offer", displayName: "Offer", sortOrder: 3 },
    ],
    useCustomPipeline: true,
    settings: {
      allowSkipStages: true,
      defaultInitialStatus: "not_engaged",
      enableAutoProgressions: false,
      requireCommentOnStatusChange: false,
    },
  })

  useEffect(() => {
    setPipelineForm(prev => {
      let list = (prev?.statusStages || []).map((s, i) => s?._key ? s : { ...s, _key: genKey(), sortOrder: s.sortOrder ?? i });
      if (!list.some(s => s.name === 'not_engaged')) {
        list = [{ _key: genKey(), name: 'not_engaged', displayName: 'Not Engaged', sortOrder: 0 }, ...list]
          .map((s, i) => ({ ...s, sortOrder: i }));
      } else {
        list = list.map((s, i) => ({ ...s, sortOrder: i }));
      }
      return { ...prev, statusStages: list };
    });
    // run once on mount or when you first open the modal/section
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pipeline) {
      dispatch(fetchCompanyPipelineThunk())
    } else {
      // Prime form with existing pipeline
      const stages = Array.isArray(pipeline?.statusStages)
        ? pipeline.statusStages.map((s, i) => ({
            _key: genKey(),
            name: s.name,
            displayName: s.displayName || s.name,
            sortOrder: Number(s.sortOrder) || i,
          }))
        : [];
      const hasNotEngaged = stages.some(s => s.name === 'not_engaged');
      const normalized = hasNotEngaged
        ? stages.map((s, i) => ({ ...s, sortOrder: i }))
        : [{ _key: genKey(), name: 'not_engaged', displayName: 'Not Engaged', sortOrder: 0 }, ...stages]
            .map((s, i) => ({ ...s, sortOrder: i }));
      setPipelineForm(prev => ({
        name: pipeline?.name || "Custom Pipeline",
        statusStages: normalized.length > 0 ? normalized : prev.statusStages,
        useCustomPipeline: pipeline?.useCustomPipeline ?? true,
        settings: {
          allowSkipStages: pipeline?.settings?.allowSkipStages ?? true,
          defaultInitialStatus: pipeline?.settings?.defaultInitialStatus ?? "not_engaged",
          enableAutoProgressions: pipeline?.settings?.enableAutoProgressions ?? false,
          requireCommentOnStatusChange: pipeline?.settings?.requireCommentOnStatusChange ?? false,
        },
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pipeline])

  useEffect(() => {
    dispatch(fetchCompanyPipelineThunk())

  }, [])

  const handleAddStage = () => {
    setPipelineForm(prev => ({
      ...prev,
      statusStages: (() => {
        const nextIndex = (prev.statusStages?.length || 0);
        const withNew = [
          ...(prev.statusStages || []),
          { _key: genKey(), name: 'new_stage', displayName: 'New Stage', sortOrder: nextIndex }
        ];
        // Ensure 'not_engaged' exists
        const hasNotEngaged = withNew.some(s => s.name === 'not_engaged');
        const list = hasNotEngaged
          ? withNew
          : [{ _key: genKey(), name: 'not_engaged', displayName: 'Not Engaged', sortOrder: 0 }, ...withNew];
        return list.map((s, i) => ({ ...s, sortOrder: i }));
      })()
    }));
  };
  const handleStageChange = (idx, field, value) => {
    setPipelineForm(prev => {
      const list = [...(prev.statusStages || [])];
      if (!list[idx]) return prev;
      list[idx] = {
        ...list[idx],
        [field]: field === 'sortOrder' ? Number(value) : (field === 'name' ? slug(value) : value)
      };
      return { ...prev, statusStages: list };
    });
  };
  const handleRemoveStage = (idx) => {
    setPipelineForm(prev => {
      const list = [...(prev.statusStages || [])];
      list.splice(idx, 1);
      // reindex sortOrder to keep order consistent
      const normalized = list.map((s, i) => ({ ...s, sortOrder: i }));
      return { ...prev, statusStages: normalized };
    });
  };
  const handleSavePipeline = async () => {
    try {
      setLoading(true)
      // basic validation: unique names and positive sort orders
      const names = new Set()
      let stages = [...(pipelineForm.statusStages || [])];
      if (!stages.some(s => s.name === 'not_engaged')) {
        stages = [
          { _key: genKey(), name: 'not_engaged', displayName: 'Not Engaged', sortOrder: 0 },
          ...stages
        ].map((s, i) => ({ ...s, sortOrder: i }));
      } else {
        stages = stages.map((s, i) => ({ ...s, sortOrder: i }));
      }
      for (const s of stages) {
        if (!s.name) throw new Error('Stage name is required')
        if (names.has(s.name)) throw new Error('Duplicate stage name: ' + s.name)
        names.add(s.name)
      }
      await dispatch(updateCompanyPipelineThunk({
        ...pipelineForm,
        statusStages: stages.map(s => ({ name: s.name, displayName: s.displayName || s.name, sortOrder: s.sortOrder }))
      })).unwrap()
      await dispatch(fetchCompanyPipelineThunk()).unwrap()
      setMessage({ type: 'success', text: 'Pipeline updated successfully' })
    } catch (e) {
      setMessage({ type: 'error', text: e.message || 'Failed to update pipeline' })
    } finally {
      setLoading(false)
    }
  }

  // Modal states
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showEditUser, setShowEditUser] = useState(false)
  const [showAssignJobs, setShowAssignJobs] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedJobs, setSelectedJobs] = useState([])
  const [subscription, setSubscription] = useState(null)
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
      onboard: 0,
    },
    dailyTotals: [],
    users: [],
  })

  // Form states
  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "company_user",
  })

  const [assignForm, setAssignForm] = useState({
    userId: "",
    jobIds: [],
  })

  const [cid, setCid] = useState(() => user?.companyId || companyState?._id || companyState?.id || undefined)

  const companyId = user?.companyId || companyState?._id || companyState?.id
  const getEffectiveCompanyId = () =>
    user?.companyId ||
    companyState?._id ||
    companyState?.id ||
    (jobs && jobs.length > 0 ? jobs[0].companyId : undefined)

  useEffect(() => {
    setCid(getEffectiveCompanyId())
  }, [user, companyState, jobs])

  useEffect(() => {
    if (!subscription && jobs.length > 0) {
      if (cid) {
        fetchCompanySubscription(cid)
          .then(setSubscription)
          .catch(() => { })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs, cid])

  useEffect(() => {
    loadInitialData()
  }, [])

  // Replace the incorrect API calls with the correct ones

  // 1. Fix the createUser function (around line 140)
  // inside CompanyAdminDashboard.jsx
  const createUser = async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          ...(userData.companyId ? { companyId: userData.companyId } : {})
        }),
      });

      const isJson = response.headers.get("content-type")?.includes("application/json");
      const payload = isJson ? await response.json() : null;

      if (!response.ok) {
        const backendMsg = payload?.error || payload?.message;
        // Normalize known errors → friendlier copy
        if (backendMsg?.toLowerCase().includes("already exists")) {
          throw new Error("A user with this email already exists. Try a different email.");
        }
        throw new Error(backendMsg || `Request failed (${response.status}). Please try again.`);
      }

      return payload;
    } catch (error) {
      // Network or parsing error
      const friendly = error?.message?.includes("already exists")
        ? error.message
        : (error?.message || "Something went wrong. Please try again.");
      throw new Error(friendly);
    }
  };

  // 2. Fix the updateUser function (around line 160)
  const updateUser = async (userId, userData) => {
    try {
      const response = await fetch(`${API_BASE}/api/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          isActive: userData.isActive,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error updating user:", error)
      throw error
    }
  }

  // 3. Fix the deleteUser function (around line 180)
  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/api/users`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error deleting user:", error)
      throw error
    }
  }

  // 4. Add the missing changePassword function
  const changePassword = async (userId, passwordData) => {
    try {
      const response = await fetch(`${API_BASE}/api/users/${userId}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          newPassword: passwordData.newPassword,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error changing password:", error)
      throw error
    }
  }

  // 5. Add the missing hardResetPassword function
  const hardResetPassword = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}/hard-reset-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error hard resetting password:", error)
      throw error
    }
  }

  // Fetch company subscriptio
  const fetchCompanySubscription = async (idParam) => {
    try {
      const id = idParam || getEffectiveCompanyId()
      if (!id) return null
      const res = await fetch(`${API_BASE}/api/companies/${id}/subscription`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      })
      if (!res.ok) return null
      const data = await res.json()
      return data.subscription || null
    } catch {
      return null
    }
  }
  // 6. Fix the fetchUsers function (around line 200)
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      // Handle the response structure: { users: [...] }
      return result.users || []
    } catch (error) {
      console.error("Error fetching users:", error)
      throw error
    }
  }

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
    )
  }

  const fetchCompanyStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/company/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error fetching company stats:", error)
      throw error
    }
  }

  // Load initial data with improved error handling
  // replace your loadInitialData with:
  const loadInitialData = async () => {
    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      // Phase 1: users/jobs/stats
      const baseResults = await Promise.allSettled([
        fetchUsers(),
        fetchCompanyJobs(),
        fetchCompanyStats(),
        fetchJobsOverview(),
      ])

      if (baseResults[0].status === "fulfilled") setUsers(baseResults[0].value)
      else setMessage({ type: "error", text: "Failed to load users" })

      if (baseResults[1].status === "fulfilled") setJobs(baseResults[1].value)
      else setMessage({ type: "error", text: "Failed to load jobs" })

      if (baseResults[2].status === "fulfilled") setStats(baseResults[2].value || {})
      else setMessage({ type: "error", text: "Failed to load stats" })

      if (baseResults[3].status === "fulfilled" && baseResults[3].value) {
        setOverview(baseResults[3].value)
      } else {
        setOverview({
          grandTotal: {
            total_engagement: 0,
            not_engaged: 0,
            applied: 0,
            engaged: 0,
            interview: 0,
            offer: 0,
            rejected: 0,
            onboard: 0,
          },
          dailyTotals: [],
          users: [],
        })
      }

      // Phase 2: derive companyId and fetch subscription + activity
      const cid = getEffectiveCompanyId()
      const tailResults = await Promise.allSettled([fetchCompanySubscription(cid)])

      if (tailResults[0].status === "fulfilled") setSubscription(tailResults[0].value)
      else setSubscription(null)

      if (tailResults[1].status === "fulfilled")
        setActivities(Array.isArray(tailResults[1].value) ? tailResults[1].value : [])
      else setActivities([])
    } catch {
      setMessage({ type: "error", text: "" })
    } finally {
      setLoading(false)
    }
  }

  // 3. Add the missing fetchCompanyJobs function
  const fetchCompanyJobs = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/company-jobs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.jobs || []
    } catch (error) {
      console.error("Error fetching company jobs:", error)
      throw error
    }
  }

  const fetchJobsOverview = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/company-jobs/stats/overview`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      return {
        grandTotal: {
          total_engagement: data?.grandTotal?.total_engagement ?? 0,
          not_engaged: data?.grandTotal?.not_engaged ?? 0,
          applied: data?.grandTotal?.applied ?? 0,
          engaged: data?.grandTotal?.engaged ?? 0,
          interview: data?.grandTotal?.interview ?? 0,
          offer: data?.grandTotal?.offer ?? 0,
          rejected: data?.grandTotal?.rejected ?? 0,
          onboard: data?.grandTotal?.onboard ?? 0,
        },
        dailyTotals: Array.isArray(data?.dailyTotals) ? data.dailyTotals : [],
        users: Array.isArray(data?.users) ? data.users : [],
      }
    } catch (err) {
      console.error("Overview stats fetch error:", err)
      return {
        grandTotal: {
          total_engagement: 0,
          not_engaged: 0,
          applied: 0,
          engaged: 0,
          interview: 0,
          offer: 0,
          rejected: 0,
          onboard: 0,
        },
        dailyTotals: [],
        users: [],
      }
    }
  }
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
  // const [cid, setCid] = useState(getEffectiveCompanyId())

  // useEffect(() => {
  //   setCid(getEffectiveCompanyId())
  // }, [user, companyState, jobs])

  // useEffect(() => {
  //   if (!subscription && jobs.length > 0) {
  //     if (cid) {
  //       fetchCompanySubscription(cid)
  //         .then(setSubscription)
  //         .catch(() => {})
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [jobs, cid])

  // useEffect(() => {
  //   loadInitialData()
  // }, [])

  // Message handling with auto-dismiss
  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: "", text: "" }), 5000)
  }

  // User operations
  // const handleCreateUser = async (userData) => {
  //   if (!userData.username || !userData.email || !userData.password) {
  //     setMessage({ type: "error", text: "All fields are required" })
  //     return
  //   }

  //   try {
  //     setLoading(true)
  //     const result = await createUser(userData)

  //     if (result.message === "User created successfully") {
  //       setMessage({ type: "success", text: "User created successfully!" })
  //       setUserForm({ username: "", email: "", password: "", role: "company_user" })
  //       setShowCreateUser(false)
  //       await loadInitialData()
  //     } else {
  //       setMessage({ type: "error", text: result.message || "Failed to create user" })
  //     }
  //   } catch (error) {
  //     setMessage({ type: "error", text: error.message || "Failed to create user" })
  //   } finally {
  //     setLoading(false)
  //   }
  // }
  // inside CompanyAdminDashboard.jsx
  const handleCreateUser = async (userData) => {
    // Basic client-side validation
    if (!userData.username || !userData.email || !userData.password) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email);
    if (!emailOk) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    try {
      setLoading(true);

      // Use the userAPI.create instead of the old createUser function
      const result = await userAPI.create({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        location: userData.location,
        companyId: userData.companyId // This should be the current company's ID
      });

      if (result?.message === "User created successfully") {
        setMessage({ type: "success", text: "User created successfully!" });
        setUserForm({ username: "", email: "", password: "", phone: "", location: "", role: "company_user" });
        setShowCreateUser(false);
        await loadInitialData();
      } else {
        setMessage({ type: "error", text: result?.message || "Failed to create user." });
      }
    } catch (error) {
      // This will now show the user-friendly error message
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error("Failed to update user")
      }

      showMessage("success", "User updated successfully!")
      setShowEditUser(false)
      setSelectedUser(null)
      await loadInitialData()
    } catch (error) {
      console.error("Error updating user:", error)
      showMessage("error", error.message || "Failed to update user")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      showMessage("success", "User deleted successfully!")
      await loadInitialData()
    } catch (error) {
      console.error("Error deleting user:", error)
      showMessage("error", error.message || "Failed to delete user")
    } finally {
      setLoading(false)
    }
  }

  // Job operations
  const handleAssignJobs = async (assignmentData) => {
    try {
      setLoading(true)
      const response = await fetch("/api/company/jobs/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(assignmentData),
      })

      if (!response.ok) {
        throw new Error("Failed to assign jobs")
      }

      showMessage("success", "Jobs assigned successfully!")
      setShowAssignJobs(false)
      setAssignForm({ userId: "", jobIds: [] })
      setSelectedJobs([])
      await loadInitialData()
    } catch (error) {
      console.error("Error assigning jobs:", error)
      showMessage("error", error.message || "Failed to assign jobs")
    } finally {
      setLoading(false)
    }
  }

  const handleBulkUpdateJobs = async (status) => {
    if (selectedJobs.length === 0) {
      showMessage("error", "Please select jobs to update")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/company/jobs/bulk-update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ jobIds: selectedJobs, status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update jobs")
      }

      showMessage("success", `Jobs updated to ${status} successfully!`)
      setSelectedJobs([])
      await loadInitialData()
    } catch (error) {
      console.error("Error updating jobs:", error)
      showMessage("error", error.message || "Failed to update jobs")
    } finally {
      setLoading(false)
    }
  }

  const updateSingleJobStatus = async (jobId, status) => {
    try {
      setLoading(true);
      const response = await fetch("/api/company/jobs/bulk-update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ jobIds: [jobId], status }),
      });
      if (!response.ok) throw new Error("Failed to update job");
      showMessage("success", `Job updated to ${status}`);
      await loadInitialData();
    } catch (error) {
      console.error("Job update error:", error);
      showMessage("error", error.message || "Failed to update job");
    } finally {
      setLoading(false);
    }
  };

  const genKey = () =>
    (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : `stage_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const slug = (v) =>
    String(v || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');


  const toggleJobSelection = (jobId) => {
    setSelectedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  const OverviewTab = () => {
    const totalUsers = users.length
    const activeUsers = users.filter((u) => u.isActive).length
    const totalJobs = jobs.length
    const assignedJobs =
      typeof stats.assignedJobs === "number" ? stats.assignedJobs : jobs.filter((j) => !!j.assignee).length

    const gt = overview.grandTotal || {}
    const statusCards = [
      {
        key: "not_engaged",
        label: "Not Engaged",
        color: "bg-slate-50 text-slate-700 border-slate-200",
        gradient: "from-slate-50 to-slate-100",
      },
      {
        key: "applied",
        label: "Applied",
        color: "bg-blue-50 text-blue-700 border-blue-200",
        gradient: "from-blue-50 to-blue-100",
      },
      {
        key: "engaged",
        label: "Engaged",
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
        gradient: "from-indigo-50 to-indigo-100",
      },
      {
        key: "interview",
        label: "Interview",
        color: "bg-purple-50 text-purple-700 border-purple-200",
        gradient: "from-purple-50 to-purple-100",
      },
      {
        key: "offer",
        label: "Offer",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        gradient: "from-emerald-50 to-emerald-100",
      },
      {
        key: "rejected",
        label: "Rejected",
        color: "bg-red-50 text-red-700 border-red-200",
        gradient: "from-red-50 to-red-100",
      },
      {
        key: "onboard",
        label: "Onboard",
        color: "bg-teal-50 text-teal-700 border-teal-200",
        gradient: "from-teal-50 to-teal-100",
      },
    ]

    const statusKeys = ["not_engaged", "applied", "engaged", "interview", "offer", "rejected", "onboard"]
    const statusMeta = {
      applied: { color: "bg-gradient-to-t from-blue-500 to-blue-400", shadow: "shadow-blue-200" },
      engaged: { color: "bg-gradient-to-t from-indigo-500 to-indigo-400", shadow: "shadow-indigo-200" },
      interview: { color: "bg-gradient-to-t from-purple-500 to-purple-400", shadow: "shadow-purple-200" },
      offer: { color: "bg-gradient-to-t from-emerald-500 to-emerald-400", shadow: "shadow-emerald-200" },
      rejected: { color: "bg-gradient-to-t from-red-500 to-red-400", shadow: "shadow-red-200" },
      onboard: { color: "bg-gradient-to-t from-teal-500 to-teal-400", shadow: "shadow-teal-200" },
      not_engaged: { color: "bg-gradient-to-t from-slate-400 to-slate-300", shadow: "shadow-slate-200" },
    }

    const filteredUsers = Array.isArray(overview.users)
      ? overview.users.filter(u => (u.username || u._id) !== "system")
      : []


    const toYmd = (d) => {
      const dt = new Date(d)
      const y = dt.getFullYear()
      const m = String(dt.getMonth() + 1).padStart(2, "0")
      const day = String(dt.getDate()).padStart(2, "0")
      return `${y}-${m}-${day}`
    }
    const buildDateRange = (startYmd, endYmd) => {
      const out = []
      const start = new Date(startYmd + "T00:00:00")
      const end = new Date(endYmd + "T00:00:00")
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        out.push(toYmd(d))
      }
      return out
    }

    // Use existing overview data directly
    const dailyMap = (Array.isArray(overview.dailyTotals) ? overview.dailyTotals : []).reduce((acc, d) => {
      const key = toYmd(d.date || d._id || d.day || new Date())
      acc[key] = {
        total_engagement: Number(d.total_engagement) || 0,
        ...statusKeys.reduce((o, k) => ({ ...o, [k]: Number(d[k]) || 0 }), {}),
      }
      return acc
    }, {})

    // Get date range from existing data
    const datesInData = Object.keys(dailyMap).sort()
    const normalizedDaily =
      datesInData.length > 0
        ? datesInData.map((ymd) => {
          const v = dailyMap[ymd] || {}
          return {
            date: ymd,
            total_engagement: Number(v.total_engagement) || 0,
            ...statusKeys.reduce((o, k) => ({ ...o, [k]: Number(v[k]) || 0 }), {}),
          }
        })
        : []

    const maxDaily = Math.max(1, ...normalizedDaily.map((d) => d.total_engagement))
    const perStatusMax = statusKeys.reduce((acc, key) => {
      acc[key] = Math.max(1, ...normalizedDaily.map((d) => Number(d[key]) || 0))
      return acc
    }, {})

    // Heights with proper spacing to prevent overlap
    const BASE_TREND_H = 200 // Overall daily trend
    const BASE_USER_H = 180 // Per-user mini charts
    const BASE_STATUS_H = 140 // Per-status daily charts

    const totalEngagement = normalizedDaily.reduce((sum, d) => sum + (Number(d.total_engagement) || 0), 0)
    const avgEngagement = normalizedDaily.length > 0 ? Math.round(totalEngagement / normalizedDaily.length) : 0
    const peakEngagement = Math.max(...normalizedDaily.map((d) => Number(d.total_engagement) || 0))
    const peakDay = normalizedDaily.find((d) => Number(d.total_engagement) === peakEngagement)

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Company Overview
          </h2>
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <Activity className="h-4 w-4" />
            <span>Real-time Analytics</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg shadow-purple-100 p-6 border border-purple-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-700">Total Users</p>
                <p className="text-3xl font-bold text-purple-900">{totalUsers}</p>
                <p className="text-xs text-purple-600 mt-1">Company Members</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-lg shadow-emerald-100 p-6 border border-emerald-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-emerald-700">Active Users</p>
                <p className="text-3xl font-bold text-emerald-900">{activeUsers}</p>
                <p className="text-xs text-emerald-600 mt-1">
                  {totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}% Active Rate
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg shadow-blue-100 p-6 border border-blue-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-700">Total Jobs</p>
                <p className="text-3xl font-bold text-blue-900">{totalJobs}</p>
                <p className="text-xs text-blue-600 mt-1">Job Opportunities</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-lg shadow-amber-100 p-6 border border-amber-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-amber-700">Assigned Jobs</p>
                <p className="text-3xl font-bold text-amber-900">{assignedJobs}</p>
                <p className="text-xs text-amber-600 mt-1">
                  {totalJobs > 0 ? Math.round((assignedJobs / totalJobs) * 100) : 0}% Assigned
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {statusCards.map((item) => (
            <div
              key={item.key}
              className={`bg-gradient-to-br ${item.gradient} rounded-xl shadow-lg p-5 border ${item.color.split(" ")[2]} hover:shadow-xl transition-all duration-300 hover:scale-105`}
            >
              <div className="text-sm font-medium text-slate-600 mb-2">{item.label}</div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-slate-900">{gt[item.key] ?? 0}</div>
                <div className="text-xs text-slate-500">
                  {totalEngagement > 0 ? Math.round(((gt[item.key] ?? 0) / totalEngagement) * 100) : 0}%
                </div>
              </div>
              <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-slate-400 to-slate-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalEngagement > 0 ? ((gt[item.key] ?? 0) / totalEngagement) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Daily Engagement Trend</h3>
              </div>
              <div className="flex items-center space-x-6 text-white/90">
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalEngagement}</div>
                  <div className="text-xs opacity-75">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{avgEngagement}</div>
                  <div className="text-xs opacity-75">Avg/Day</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{peakEngagement}</div>
                  <div className="text-xs opacity-75">Peak Day</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {normalizedDaily.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <div className="text-slate-500 text-lg">No engagement data available</div>
                <div className="text-slate-400 text-sm">Data will appear once users start engaging</div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-end justify-center space-x-1" style={{ height: "280px" }}>
                  {normalizedDaily.map((d, idx) => {
                    const val = Number(d.total_engagement) || 0
                    const hPx = Math.round((val / maxDaily) * 220)
                    const isPeak = val === peakEngagement
                    const label = new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "2-digit" })
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center group">
                        <div className="text-xs font-semibold text-slate-700 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {val}
                        </div>
                        <div className="relative">
                          {isPeak && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                              <div className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
                                Peak
                              </div>
                            </div>
                          )}
                          <div
                            className={`w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${isPeak ? "ring-2 ring-yellow-400" : ""}`}
                            style={{ height: `${Math.max(4, hPx)}px`, minWidth: "20px" }}
                          />
                        </div>
                        <div className="mt-3 text-xs text-slate-600 font-medium transform -rotate-45 origin-center">
                          {label}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {peakDay && (
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        Peak Performance: {new Date(peakDay.date).toLocaleDateString()} with {peakEngagement}{" "}
                        engagements
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div> */}

        <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Team Member Performance</h3>
            </div>
          </div>

          <div className="p-6">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <div className="text-slate-500 text-lg">No team performance data</div>
                <div className="text-slate-400 text-sm">User activity will appear here</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredUsers.map((u, idx) => {
                  const s = u.statuses || {}
                  const maxUser = Math.max(1, ...statusKeys.map((k) => Number(s[k]) || 0))
                  const totalUserEngagement = statusKeys.reduce((sum, k) => sum + (Number(s[k]) || 0), 0)
                  const topStatus = statusKeys.reduce(
                    (top, k) => ((Number(s[k]) || 0) > (Number(s[top]) || 0) ? k : top),
                    statusKeys[0],
                  )

                  return (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900 text-lg">{u.username || u._id}</div>
                          <div className="text-sm text-slate-500">Total: {totalUserEngagement} engagements</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500 mb-1">Top Status</div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusCards.find((sc) => sc.key === topStatus)?.color || "bg-slate-100 text-slate-700"}`}
                          >
                            {topStatus.replace("_", " ")}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-end justify-center space-x-1" style={{ height: "160px" }}>
                        {statusKeys.map((k) => {
                          const val = Number(s[k]) || 0
                          const hPx = Math.round((val / maxUser) * 120)
                          const percentage = totalUserEngagement > 0 ? Math.round((val / totalUserEngagement) * 100) : 0

                          return (
                            <div key={k} className="flex-1 flex flex-col items-center group">
                              <div className="text-xs font-semibold text-slate-700 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {val} ({percentage}%)
                              </div>
                              <div
                                className={`w-full ${statusMeta[k].color} rounded-t-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105`}
                                style={{ height: `${Math.max(4, hPx)}px`, minWidth: "16px" }}
                              />
                              <div className="mt-2 text-xs text-slate-600 font-medium text-center leading-tight">
                                {k.replace("_", " ")}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Status Trends by Day</h3>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {statusKeys.map((k) => {
              const maxForStatus = perStatusMax[k] || 1
              const statusTotal = normalizedDaily.reduce((sum, d) => sum + (Number(d[k]) || 0), 0)
              const statusAvg = normalizedDaily.length > 0 ? Math.round(statusTotal / normalizedDaily.length) : 0
              const statusCard = statusCards.find((sc) => sc.key === k)

              return (
                <div
                  key={k}
                  className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`px-3 py-1 rounded-lg font-semibold ${statusCard?.color || "bg-slate-100 text-slate-700"}`}
                      >
                        {k.replace("_", " ").toUpperCase()}
                      </div>
                      <div className="text-sm text-slate-500">
                        Total: {statusTotal} | Avg: {statusAvg}/day | Peak: {maxForStatus}
                      </div>
                    </div>
                  </div>

                  {normalizedDaily.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">No trend data available</div>
                  ) : (
                    <div className="flex items-end justify-center space-x-1" style={{ height: "120px" }}>
                      {normalizedDaily.map((d, idx) => {
                        const val = Number(d[k]) || 0
                        const hPx = Math.round((val / maxForStatus) * 80)
                        const isPeak = val === maxForStatus
                        const label = new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "2-digit" })

                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center group">
                            <div className="text-xs font-semibold text-slate-700 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {val}
                            </div>
                            <div className="relative">
                              {isPeak && val > 0 && (
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                </div>
                              )}
                              <div
                                className={`w-full ${statusMeta[k].color} rounded-t-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105`}
                                style={{ height: `${Math.max(2, hPx)}px`, minWidth: "12px" }}
                              />
                            </div>
                            <div className="mt-2 text-xs text-slate-600 font-medium transform -rotate-45 origin-center">
                              {label}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div> */}

        {/* <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Detailed Team Performance</h3>
            </div>
          </div>

          <div className="p-6">
            {overview.users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <div className="text-slate-500 text-lg">No performance data available</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider rounded-tl-lg">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Not Engaged
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                        Applied
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        Engaged
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                        Interview
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        Offer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-red-700 uppercase tracking-wider">
                        Rejected
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-teal-700 uppercase tracking-wider">
                        Onboard
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider rounded-tr-lg">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {overview.users.map((u, i) => {
                      const s = u.statuses || {}
                      const total = statusKeys.reduce((sum, k) => sum + (Number(s[k]) || 0), 0)
                      return (
                        <tr
                          key={i}
                          className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent transition-all duration-200"
                        >
                          <td className="px-6 py-4 text-sm font-bold text-slate-900">{u.username || u._id}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-600">{s.not_engaged ?? 0}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-blue-600">{s.applied ?? 0}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-indigo-600">{s.engaged ?? 0}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-purple-600">{s.interview ?? 0}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-emerald-600">{s.offer ?? 0}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-red-600">{s.rejected ?? 0}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-teal-600">{s.onboard ?? 0}</td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-900 bg-slate-50">{total}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div> */}

        <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Activities Status Overview</h3>
            </div>
          </div>

          <div className="p-6">
            {/* Summary Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {statusKeys.map((k) => {
                const statusTotal = normalizedDaily.reduce((sum, d) => sum + (Number(d[k]) || 0), 0)
                const statusCard = statusCards.find((sc) => sc.key === k)
                const percentage = totalEngagement > 0 ? Math.round((statusTotal / totalEngagement) * 100) : 0

                return (
                  <div
                    key={k}
                    className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-3 h-3 rounded-full ${statusMeta[k].color.replace("bg-", "bg-")}`}></div>
                      <span className="text-xs text-slate-500">{percentage}%</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 mb-1">{statusTotal}</div>
                    <div className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                      {k.replace("_", " ")}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Combined Stacked Area Chart */}
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-slate-800">Daily Activity Trends</h4>
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <span>Total Activities: {totalEngagement}</span>
                  <span>
                    Peak Day:{" "}
                    {Math.max(
                      ...normalizedDaily.map((d) => statusKeys.reduce((sum, k) => sum + (Number(d[k]) || 0), 0)),
                    )}
                  </span>
                </div>
              </div>

              {normalizedDaily.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No trend data available</div>
              ) : (
                <div className="relative">
                  {/* Stacked Area Chart */}
                  <div className="flex items-end justify-center space-x-1" style={{ height: "200px" }}>
                    {normalizedDaily.map((d, idx) => {
                      const dayTotal = statusKeys.reduce((sum, k) => sum + (Number(d[k]) || 0), 0)
                      const maxDayTotal = Math.max(
                        ...normalizedDaily.map((day) => statusKeys.reduce((sum, k) => sum + (Number(day[k]) || 0), 0)),
                      )
                      const label = new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "2-digit" })

                      let cumulativeHeight = 0
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center group relative">
                          {/* Hover tooltip */}
                          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap">
                            <div className="font-semibold">{label}</div>
                            <div>Total: {dayTotal}</div>
                            {statusKeys.map((k) => {
                              const val = Number(d[k]) || 0
                              return val > 0 ? (
                                <div key={k} className="flex items-center space-x-1">
                                  <div
                                    className={`w-2 h-2 rounded-full ${statusMeta[k].color.replace("bg-", "bg-")}`}
                                  ></div>
                                  <span>
                                    {k.replace("_", " ")}: {val}
                                  </span>
                                </div>
                              ) : null
                            })}
                          </div>

                          {/* Stacked bars */}
                          <div className="flex flex-col-reverse items-center" style={{ height: "160px" }}>
                            {statusKeys.map((k) => {
                              const val = Number(d[k]) || 0
                              if (val === 0) return null

                              const segmentHeight = Math.round((val / maxDayTotal) * 140)
                              cumulativeHeight += segmentHeight

                              return (
                                <div
                                  key={k}
                                  className={`w-full ${statusMeta[k].color} transition-all duration-300 hover:brightness-110 first:rounded-t-lg last:rounded-b-lg`}
                                  style={{
                                    height: `${Math.max(2, segmentHeight)}px`,
                                    minWidth: "16px",
                                    maxWidth: "24px",
                                  }}
                                />
                              )
                            })}
                          </div>

                          {/* Date label */}
                          <div className="mt-2 text-xs text-slate-600 font-medium transform -rotate-45 origin-center">
                            {label}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-slate-200">
                    {statusKeys.map((k) => {
                      const statusTotal = normalizedDaily.reduce((sum, d) => sum + (Number(d[k]) || 0), 0)
                      return (
                        <div key={k} className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${statusMeta[k].color.replace("bg-", "bg-")}`}></div>
                          <span className="text-sm text-slate-700 font-medium">
                            {k.replace("_", " ")} ({statusTotal})
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Detailed Team Performance</h3>
            </div>
          </div>

          <div className="p-6">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <div className="text-slate-500 text-lg">No performance data available</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider rounded-tl-lg">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Not Engaged
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                        Applied
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        Engaged
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                        Interview
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        Offer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-red-700 uppercase tracking-wider">
                        Rejected
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-teal-700 uppercase tracking-wider">
                        Onboard
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider rounded-tr-lg">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredUsers.map((u, i) => {
                      const s = u.statuses || {}
                      const total = statusKeys.reduce((sum, k) => sum + (Number(s[k]) || 0), 0)
                      return (
                        <tr
                          key={i}
                          className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent transition-all duration-200"
                        >
                          <td className="px-6 py-4 text-sm font-bold text-slate-900">{u.username || u._id}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-600">{s.not_engaged ?? 0}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-blue-600">{s.applied ?? 0}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-indigo-600">{s.engaged ?? 0}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-purple-600">{s.interview ?? 0}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-emerald-600">{s.offer ?? 0}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-red-600">{s.rejected ?? 0}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-teal-600">{s.onboard ?? 0}</td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-900 bg-slate-50">{total}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const UsersTab = () => {
    const handleEditUser = (user) => {
      setSelectedUser(user)
      setUserForm({
        username: user.username,
        email: user.email,
        isActive: user.isActive,
      })
      setShowEditUser(true)
    }
    return (
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

        {message?.text && (
          <div className={`mt-3 px-4 py-2 rounded ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
            }`}>
            {message.text}
          </div>
        )}

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
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === "company_admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {user.role === "company_admin" ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button onClick={() => handleEditUser(user)} className="text-blue-600 hover:text-blue-900">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-900">
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
    )
  }

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
      setLoading(true)
      try {
        const sub = await fetchCompanySubscription(getEffectiveCompanyId())
        setSubscription(sub)
      } finally {
        setLoading(false)
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Subscription</h2>
          <button
            onClick={refreshSubscription}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
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
                  {subscription.usagePercentage ??
                    Math.round((subscription.jobsUsed / Math.max(1, subscription.jobsQuota)) * 100)}
                  %)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{
                    width: `${subscription.usagePercentage ?? Math.round((subscription.jobsUsed / Math.max(1, subscription.jobsQuota)) * 100)}%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-500">
                Remaining: {subscription.jobsRemaining} | Last sync:{" "}
                {subscription.lastJobSync ? new Date(subscription.lastJobSync).toLocaleString() : "—"}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // const JobsTab = () => {
  //   const [filter, setFilter] = useState('all');
  //   const [localLoading, setLocalLoading] = useState(false);
  
  //   const filteredJobs = Array.isArray(jobs)
  //     ? jobs.filter(j => filter === 'all' ? true : (j.currentStatus || j.status) === filter)
  //     : [];
  
  //   const updateJobInline = async (job, newStatus) => {
  //     try {
  //       setLocalLoading(true);
  //       // Minimal inline update call: reuse bulk endpoint for single
  //       await handleBulkUpdateJobs(newStatus, [job.id || job._id]);
  //       await loadInitialData();
  //     } finally {
  //       setLocalLoading(false);
  //     }
  //   };
  
  //   return (
  //     <div className="space-y-6">
  //       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
  //         <h2 className="text-2xl font-bold text-gray-900">Company Jobs</h2>
  //         <div className="flex flex-wrap items-center gap-2">
  //           <select
  //             value={filter}
  //             onChange={(e) => setFilter(e.target.value)}
  //             className="border rounded px-3 py-1.5 text-sm"
  //           >
  //             <option value="all">All</option>
  //             <option value="not_engaged">Not Engaged</option>
  //             <option value="applied">Applied</option>
  //             <option value="engaged">Engaged</option>
  //             <option value="interview">Interview</option>
  //             <option value="offer">Offer</option>
  //             <option value="rejected">Rejected</option>
  //             <option value="onboard">Onboard</option>
  //           </select>
  
  //           <button
  //             onClick={() => setShowAssignJobs(true)}
  //             disabled={selectedJobs.length === 0}
  //             className="px-3 py-1.5 bg-green-600 text-white rounded-md disabled:opacity-50"
  //           >
  //             Assign Selected ({selectedJobs.length})
  //           </button>
  
  //           <button
  //             onClick={() => handleBulkUpdateJobs('in_progress')}
  //             disabled={selectedJobs.length === 0}
  //             className="px-3 py-1.5 bg-yellow-600 text-white rounded-md disabled:opacity-50"
  //           >
  //             Mark In Progress
  //           </button>
  
  //           <button
  //             onClick={() => handleBulkUpdateJobs('completed')}
  //             disabled={selectedJobs.length === 0}
  //             className="px-3 py-1.5 bg-blue-600 text-white rounded-md disabled:opacity-50"
  //           >
  //             Mark Completed
  //           </button>
  
  //           <button
  //             onClick={() => navigate('/dashboard/linkedin')}
  //             className="px-3 py-1.5 border rounded-md"
  //           >
  //             View LinkedIn Dashboard
  //           </button>
  //           <button
  //             onClick={() => navigate('/dashboard/upwork')}
  //             className="px-3 py-1.5 border rounded-md"
  //           >
  //             View Upwork Dashboard
  //           </button>
  //           <button
  //             onClick={() => navigate('/dashboard/google')}
  //             className="px-3 py-1.5 border rounded-md"
  //           >
  //             View Google Dashboard
  //           </button>
  //         </div>
  //       </div>
  
  //       <div className="bg-white rounded-lg shadow overflow-hidden">
  //         {localLoading || loading ? (
  //           <div className="flex justify-center py-8">
  //             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  //           </div>
  //         ) : filteredJobs.length === 0 ? (
  //           <div className="p-8 text-center text-gray-500">
  //             <Database className="mx-auto h-12 w-12 text-gray-300 mb-4" />
  //             <p>No jobs found.</p>
  //           </div>
  //         ) : (
  //           <div className="overflow-x-auto">
  //             <table className="min-w-full divide-y divide-gray-200">
  //               <thead className="bg-gray-50">
  //                 <tr>
  //                   <th className="px-6 py-3">
  //                     <input
  //                       type="checkbox"
  //                       checked={selectedJobs.length === filteredJobs.length && filteredJobs.length > 0}
  //                       onChange={(e) => {
  //                         if (e.target.checked) {
  //                           setSelectedJobs(filteredJobs.map(j => j.id || j._id));
  //                         } else {
  //                           setSelectedJobs([]);
  //                         }
  //                       }}
  //                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
  //                     />
  //                   </th>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Status</th>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
  //                 </tr>
  //               </thead>
  //               <tbody className="bg-white divide-y divide-gray-200">
  //                 {filteredJobs.map((job) => {
  //                   const id = job.id || job._id;
  //                   const status = job.currentStatus || job.status || 'not_engaged';
  //                   return (
  //                     <tr key={id} className="hover:bg-gray-50">
  //                       <td className="px-6 py-3">
  //                         <input
  //                           type="checkbox"
  //                           checked={selectedJobs.includes(id)}
  //                           onChange={() => toggleJobSelection(id)}
  //                           className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
  //                         />
  //                       </td>
  //                       <td className="px-6 py-3 text-sm text-gray-900">{job.company?.title || '—'}</td>
  //                       <td className="px-6 py-3 text-sm text-gray-600">{job.company?.name || job.companyName || '—'}</td>
  //                       <td className="px-6 py-3 text-sm capitalize">{job.company?.platform || '—'}</td>
  //                       <td className="px-6 py-3 text-sm">
  //                         <select
  //                           value={status}
  //                           onChange={(e) => updateJobInline(job, e.target.value)}
  //                           className="border rounded px-2 py-1 text-sm"
  //                         >
  //                           <option value="not_engaged">Not Engaged</option>
  //                           <option value="applied">Applied</option>
  //                           <option value="engaged">Engaged</option>
  //                           <option value="interview">Interview</option>
  //                           <option value="offer">Offer</option>
  //                           <option value="rejected">Rejected</option>
  //                           <option value="onboard">Onboard</option>
  //                           <option value="in_progress">In Progress</option>
  //                           <option value="completed">Completed</option>
  //                         </select>
  //                       </td>
  //                       <td className="px-6 py-3 text-sm">
  //                         <button
  //                           onClick={() => navigate(`/company-jobs/${id}`)}
  //                           className="text-blue-600 hover:text-blue-900"
  //                         >
  //                           View
  //                         </button>
  //                       </td>
  //                     </tr>
  //                   );
  //                 })}
  //               </tbody>
  //             </table>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // };

  // const JobsTab = () => {
  //   const [filter, setFilter] = useState('all');
  //   const filtered = Array.isArray(jobs)
  //     ? jobs.filter(j => filter === 'all' ? true : (j.currentStatus || j.status || 'not_engaged') === filter)
  //     : [];
  
  //   return (
  //     <div className="space-y-6">
  //       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
  //         <h2 className="text-2xl font-bold text-gray-900">Company Jobs</h2>
  //         <div className="flex flex-wrap items-center gap-2">
  //           <select
  //             value={filter}
  //             onChange={(e) => setFilter(e.target.value)}
  //             className="border rounded px-3 py-1.5 text-sm"
  //           >
  //             <option value="all">All</option>
  //             <option value="not_engaged">Not Engaged</option>
  //             <option value="applied">Applied</option>
  //             <option value="engaged">Engaged</option>
  //             <option value="interview">Interview</option>
  //             <option value="offer">Offer</option>
  //             <option value="rejected">Rejected</option>
  //             <option value="onboard">Onboard</option>
  //             <option value="in_progress">In Progress</option>
  //             <option value="completed">Completed</option>
  //           </select>
  
  //           <button
  //             onClick={() => setShowAssignJobs(true)}
  //             disabled={selectedJobs.length === 0}
  //             className="px-3 py-1.5 bg-green-600 text-white rounded-md disabled:opacity-50"
  //           >
  //             Assign Selected ({selectedJobs.length})
  //           </button>
  
  //           <button
  //             onClick={() => handleBulkUpdateJobs('in_progress')}
  //             disabled={selectedJobs.length === 0}
  //             className="px-3 py-1.5 bg-yellow-600 text-white rounded-md disabled:opacity-50"
  //           >
  //             Mark In Progress
  //           </button>
  
  //           <button
  //             onClick={() => handleBulkUpdateJobs('completed')}
  //             disabled={selectedJobs.length === 0}
  //             className="px-3 py-1.5 bg-blue-600 text-white rounded-md disabled:opacity-50"
  //           >
  //             Mark Completed
  //           </button>
  //         </div>
  //       </div>
  
  //       <div className="bg-white rounded-lg shadow overflow-hidden">
  //         {loading ? (
  //           <div className="flex justify-center py-8">
  //             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  //           </div>
  //         ) : filtered.length === 0 ? (
  //           <div className="p-8 text-center text-gray-500">
  //             <Database className="mx-auto h-12 w-12 text-gray-300 mb-4" />
  //             <p>No jobs found.</p>
  //           </div>
  //         ) : (
  //           <div className="overflow-x-auto">
  //             <table className="min-w-full divide-y divide-gray-200">
  //               <thead className="bg-gray-50">
  //                 <tr>
  //                   <th className="px-6 py-3">
  //                     <input
  //                       type="checkbox"
  //                       checked={selectedJobs.length === filtered.length && filtered.length > 0}
  //                       onChange={(e) => {
  //                         if (e.target.checked) setSelectedJobs(filtered.map(j => j.id || j._id));
  //                         else setSelectedJobs([]);
  //                       }}
  //                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
  //                     />
  //                   </th>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Status</th>
  //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
  //                 </tr>
  //               </thead>
  //               <tbody className="bg-white divide-y divide-gray-200">
  //                 {filtered.map((job) => {
  //                   const id = job.id || job._id;
  //                   const status = job.currentStatus || job.status || 'not_engaged';
  //                   return (
  //                     <tr key={id} className="hover:bg-gray-50">
  //                       <td className="px-6 py-3">
  //                         <input
  //                           type="checkbox"
  //                           checked={selectedJobs.includes(id)}
  //                           onChange={() => toggleJobSelection(id)}
  //                           className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
  //                         />
  //                       </td>
  //                       <td className="px-6 py-3 text-sm text-gray-900">{job.company?.title || '—'}</td>
  //                       <td className="px-6 py-3 text-sm text-gray-600">{job.company?.company || job.companyName || '—'}</td>
  //                       <td className="px-6 py-3 text-sm capitalize">{job.platform || '—'}</td>
  //                       <td className="px-6 py-3 text-sm">
  //                         <select
  //                           value={status}
  //                           onChange={(e) => updateSingleJobStatus(id, e.target.value)}
  //                           className="border rounded px-2 py-1 text-sm"
  //                         >
  //                           <option value="not_engaged">Not Engaged</option>
  //                           <option value="applied">Applied</option>
  //                           <option value="engaged">Engaged</option>
  //                           <option value="interview">Interview</option>
  //                           <option value="offer">Offer</option>
  //                           <option value="rejected">Rejected</option>
  //                           <option value="onboard">Onboard</option>
  //                           <option value="in_progress">In Progress</option>
  //                           <option value="completed">Completed</option>
  //                         </select>
  //                       </td>
  //                       <td className="px-6 py-3 text-sm">
  //                         <button
  //                           onClick={() => navigate(`/company-jobs/${id}`)}
  //                           className="text-blue-600 hover:text-blue-900"
  //                         >
  //                           View
  //                         </button>
  //                       </td>
  //                     </tr>
  //                   );
  //                 })}
  //               </tbody>
  //             </table>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />
        case "jobs":
          return <JobsTab />;  
      case "users":
        return <UsersTab />
  //       case "jobs":
  // return <JobsTab />;
      case "pipeline":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Pipeline Settings</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => dispatch(fetchCompanyPipelineThunk())}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
                >
                  Refresh
                </button>
                <button
                  onClick={handleSavePipeline}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Pipeline'}
                </button>
              </div>
            </div>

            {message?.text && (
              <div className={`px-4 py-2 rounded ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {message.text}
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={pipelineForm.name}
                  onChange={(e) => setPipelineForm({ ...pipelineForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              {/* 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={pipelineForm.useCustomPipeline}
                    onChange={(e) => setPipelineForm({ ...pipelineForm, useCustomPipeline: e.target.checked })}
                  />
                  <span className="text-sm text-gray-700">Use custom pipeline</span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Initial Status</label>
                  <input
                    type="text"
                    value={pipelineForm.settings.defaultInitialStatus}
                    onChange={(e) => setPipelineForm({ ...pipelineForm, settings: { ...pipelineForm.settings, defaultInitialStatus: e.target.value } })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={pipelineForm.settings.allowSkipStages}
                    onChange={(e) => setPipelineForm({ ...pipelineForm, settings: { ...pipelineForm.settings, allowSkipStages: e.target.checked } })}
                  />
                  <span className="text-sm text-gray-700">Allow skip stages</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={pipelineForm.settings.enableAutoProgressions}
                    onChange={(e) => setPipelineForm({ ...pipelineForm, settings: { ...pipelineForm.settings, enableAutoProgressions: e.target.checked } })}
                  />
                  <span className="text-sm text-gray-700">Enable auto progressions</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={pipelineForm.settings.requireCommentOnStatusChange}
                    onChange={(e) => setPipelineForm({ ...pipelineForm, settings: { ...pipelineForm.settings, requireCommentOnStatusChange: e.target.checked } })}
                  />
                  <span className="text-sm text-gray-700">Require comment on status change</span>
                </label>
              </div> */}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">Stages</h3>
                  <button onClick={handleAddStage} className="px-3 py-1 bg-gray-100 rounded-md text-sm">Add Stage</button>
                </div>
                <div className="space-y-2">
                  {(pipelineForm.statusStages || []).map((s, idx) => (
                    <div key={s._key || idx} className="grid grid-cols-12 gap-2 items-center">
                      <input
                        type="text"
                        className="col-span-4 border border-gray-300 rounded-md px-3 py-1"
                        placeholder="Stage key (e.g. applied)"
                        value={s.name || ''}
                        onChange={(e) => handleStageChange(idx, 'name', e.target.value)}
                      />
                      <input
                        type="text"
                        className="col-span-5 border border-gray-300 rounded-md px-3 py-1"
                        placeholder="Display name (e.g. Applied)"
                        value={s.displayName || ''}
                        onChange={(e) => handleStageChange(idx, 'displayName', e.target.value)}
                      />
                      <button type="button" onClick={() => handleRemoveStage(idx)} className="col-span-1 text-red-600 text-sm">X</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      // case 'jobs': return <JobsTab />;
      case "subscription":
        return <SubscriptionTab />
      default:
        return <OverviewTab />
    }
  }

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
            <button
  onClick={() => navigate('/dashboard/linkedin')}
  className="px-3 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-100 transition-colors"
>
Act as User
</button>
              <div className="text-right">
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{user?.companyName || "Your Company"}</p>
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
              {/* <button
  onClick={() => setActiveTab('jobs')}
  className="px-3 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-100 transition-colors"
>
  Jobs
</button> */}

              <button
                onClick={() => {
                  logoutUser(dispatch)
                  navigate("/login", { replace: true })
                }}
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
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "users", label: "Users", icon: Users },
              // { id: "jobs", label: "Jobs", icon: Database },
              { id: "pipeline", label: "Pipeline", icon: Database },
              { id: "subscription", label: "Subscription", icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </main>

      {/* Modals
      <CreateUserModal
        isOpen={showCreateUser}
        onClose={() => setShowCreateUser(false)}
        onSubmit={handleCreateUser}
        loading={loading}
        formData={userForm}
        setFormData={setUserForm}
      /> */}

      <EditUserModal
        isOpen={showEditUser}
        onClose={() => setShowEditUser(false)}
        onSubmit={(userData) => handleUpdateUser(selectedUser?.id, userData)}
        loading={loading}
        formData={userForm}
        setFormData={setUserForm}
        user={selectedUser}
      />
      {/* <CreateCompanyModal
  isOpen={showCreateUser}
  onClose={() => setShowCreateUser(false)}
  onSubmit={handleCreateUser}
  loading={loading}
  // company={currentCompany} // Make sure this has the company ID
/> */}

      {/* <CreateComUserModal
  isOpen={showCreateUser}
  onClose={() => setShowCreateUser(false)}
  onSubmit={handleCreateUser}
  loading={loading}
  company={currentCompany} // Make sure this has the company ID
/> */}

      <CreateComUserModal
        isOpen={showCreateUser}
        onClose={() => setShowCreateUser(false)}
        loading={loading}
        company={currentCompany}
        onSubmit={(payload) => handleCreateUser({ ...payload, companyId: cid })}
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
  )
}

export default CompanyAdminDashboard