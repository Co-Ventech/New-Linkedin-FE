// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import CompanySignup from "./pages/CompanySignup";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";
// import Dashboard from "./pages/Dashboard";
// import UpworkDashboard from "./pages/UpworkDashboard";
// import UpworkJobDetails from "./pages/UpworkJobDetails";
// import JobDetails from "./pages/JobDetails";
// import UserManagement from "./pages/UserManagement";
// import { useSelector } from "react-redux";
// import { selectUser, isSuperAdmin, isCompanyAdmin, isCompanyUser } from "./slices/userSlice";
// import ScrollToTop from "./components/ScrollToTop";
// import AdminDashboard from './pages/AdminDashboard';
// import CompanyAdminDashboard from './pages/CompanyAdminDashboard';
// import UserDashboard from './pages/UserDashboard';

// // Protected Route component with role-based access
// function ProtectedRoute({ children, allowedRoles = [] }) {
//   const user = useSelector(selectUser);
  
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }
  
//   // If specific roles are required, check if user has access
//   if (allowedRoles.length > 0 && !allowedRoles.some(role => {
//     switch (role) {
//       case 'super_admin':
//         return isSuperAdmin(user);
//       case 'company_admin':
//         return isCompanyAdmin(user);
//       case 'company_user':
//         return isCompanyUser(user);
//       case 'admin':
//         return isSuperAdmin(user) || isCompanyAdmin(user);
//       default:
//         return false;
//     }
//   })) {
//     return <Navigate to="/dashboard" replace />;
//   }
  
//   return children;
// }

// // Role-based redirect component
// function RoleBasedRedirect() {
//   const user = useSelector(selectUser);
  
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }
  
//   if (isSuperAdmin(user)) {
//     return <Navigate to="/admin-dashboard" replace />;
//   } else if (isCompanyAdmin(user) || isCompanyUser(user)) {
//     return <Navigate to="/dashboard" replace />;
//   }
  
//   return <Navigate to="/dashboard" replace />;
// }

// function App() {
//   const user = useSelector(selectUser);

//   return (
//     <BrowserRouter>
//       <ScrollToTop />
//       <Routes>
//         {/* Public routes */}
//         <Route
//           path="/login"
//           element={user ? <RoleBasedRedirect /> : <Login />}
//         />
//         <Route
//           path="/company-signup"
//           element={user ? <RoleBasedRedirect /> : <CompanySignup />}
//         />
//         <Route
//           path="/forgot-password"
//           element={user ? <RoleBasedRedirect /> : <ForgotPassword />}
//         />
//         <Route
//           path="/reset-password"
//           element={user ? <RoleBasedRedirect /> : <ResetPassword />}
//         />
        
//         {/* Protected routes with role-based access */}
//         <Route path="/dashboard" element={<Navigate to="/dashboard/linkedin" />} />
        
//         {/* LinkedIn Dashboard - accessible by company users and admins (legacy list) */}
//         <Route
//           path="/dashboard/linkedin"
//           element={
//             <ProtectedRoute allowedRoles={['company_admin', 'company_user']}>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
        
//         {/* Upwork Dashboard - accessible by company users and admins */}
//         <Route
//           path="/dashboard/upwork"
//           element={
//             <ProtectedRoute allowedRoles={['company_admin', 'company_user']}>
//               <UpworkDashboard />
//             </ProtectedRoute>
//           }
//         />
        
//         {/* Job Details - accessible by company users and admins */}
//         <Route
//           path="/jobs/:id"
//           element={
//             <ProtectedRoute allowedRoles={['company_admin', 'company_user']}>
//               <JobDetails />
//             </ProtectedRoute>
//           }
//         />
        
//         {/* Upwork Job Details - accessible by company users and admins */}
//         <Route
//           path="/upwork/jobs/:id"
//           element={
//             <ProtectedRoute allowedRoles={['company_admin', 'company_user']}>
//               <UpworkJobDetails />
//             </ProtectedRoute>
//           }
//         />
        
//         {/* Admin Dashboard - accessible only by super admins */}
//         <Route
//           path="/admin-dashboard"
//           element={
//             <ProtectedRoute allowedRoles={['super_admin']}>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />

// {/* Main Dashboard - redirect based on role */}
// <Route 
//   path="/dashboard" 
//   element={
//     <ProtectedRoute allowedRoles={[ 'company_user']}>
//       <Navigate to="/dashboard/linkedin" />
//     </ProtectedRoute>
//   } 
// />

// {/* Company Admin Dashboard - accessible only by company admins */}
// <Route
//   path="/company-dashboard"
//   element={
//     <ProtectedRoute allowedRoles={['company_admin']}>
//       <CompanyAdminDashboard />
//     </ProtectedRoute>
//   }
// />

// {/* User Dashboard - accessible only by company users */}
// <Route
//   path="/my-dashboard"
//   element={
//     <ProtectedRoute allowedRoles={['company_user']}>
//       <UserDashboard />
//     </ProtectedRoute>
//   }
// />

//         {/* Company Admin Dashboard */}
//         <Route
//           path="/company-dashboard"
//           element={
//             <ProtectedRoute allowedRoles={['company_admin']}>
//               <CompanyAdminDashboard />
//             </ProtectedRoute>
//           }
//         />

//         {/* User Dashboard */}
//         <Route
//           path="/my-dashboard"
//           element={
//             <ProtectedRoute allowedRoles={['company_user']}>
//               <UserDashboard />
//             </ProtectedRoute>
//           }
//         />
        
//         {/* User Management - accessible by company admins and super admins */}
//         {/* <Route
//           path="/user-management"
//           element={
//             <ProtectedRoute allowedRoles={['super_admin', 'company_admin']}>
//               <UserManagement />
//             </ProtectedRoute>
//           }
//         /> */}
        
//         {/* Company Dashboard - accessible by company admins */}
//         {/* <Route
//           path="/company"
//           element={
//             <ProtectedRoute allowedRoles={['company_admin']}>
//               <Navigate to="/user-management" replace />
//             </ProtectedRoute>
//           }
//         /> */}
        
//         {/* Default redirect */}
//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import CompanySignup from "./pages/CompanySignup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import UpworkDashboard from "./pages/UpworkDashboard";
import UpworkJobDetails from "./pages/UpworkJobDetails";
import JobDetails from "./pages/JobDetails";
import UserManagement from "./pages/UserManagement";
import { useSelector } from "react-redux";
import { selectUser, isSuperAdmin, isCompanyAdmin, isCompanyUser } from "./slices/userSlice";
import ScrollToTop from "./components/ScrollToTop";
import AdminDashboard from './pages/AdminDashboard';
import CompanyAdminDashboard from './pages/CompanyAdminDashboard';
import UserDashboard from './pages/UserDashboard';

// Protected Route component with role-based access
function ProtectedRoute({ children, allowedRoles = [] }) {
  const user = useSelector(selectUser);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If specific roles are required, check if user has access
  if (allowedRoles.length > 0 && !allowedRoles.some(role => {
    switch (role) {
      case 'super_admin':
        return isSuperAdmin(user);
      case 'company_admin':
        return isCompanyAdmin(user);
      case 'company_user':
        return isCompanyUser(user);
      case 'admin':
        return isSuperAdmin(user) || isCompanyAdmin(user);
      default:
        return false;
    }
  })) {
    return <Navigate to="/CompanyAdminDashboard " replace />;
  }
  
  return children;
}

// Role-based redirect component - FIXED to properly redirect company admins
function RoleBasedRedirect() {
  const user = useSelector(selectUser);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // FIXED: Company admins should go to company-dashboard, not dashboard
  if (isSuperAdmin(user)) {
    return <Navigate to="/AdminDashboard" replace />;
  } else if (isCompanyAdmin(user)) {
    return <Navigate to="/CompanyAdminDashboard" replace />; // FIXED: Company admins go here
  } else if (isCompanyUser(user)) {
    return <Navigate to="/UserDashboard" replace />; // Regular users go to dashboard
  }
  
  return <Navigate to="/dashboard" replace />;
}

function App() {
  const user = useSelector(selectUser);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={user ? <RoleBasedRedirect /> : <Login />}
        />
        <Route
          path="/company-signup"
          element={user ? <RoleBasedRedirect /> : <CompanySignup />}
        />
        <Route
          path="/forgot-password"
          element={user ? <RoleBasedRedirect /> : <ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={user ? <RoleBasedRedirect /> : <ResetPassword />}
        />
        
        {/* Main Dashboard - redirect based on role */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['company_user']}>
              <Navigate to="/dashboard/linkedin" />
            </ProtectedRoute>
          } 
        />
        
        {/* LinkedIn Dashboard - accessible by company users only */}
        <Route
          path="/dashboard/linkedin"
          element={
            <ProtectedRoute allowedRoles={['company_user']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Upwork Dashboard - accessible by company users only */}
        <Route
          path="/dashboard/upwork"
          element={
            <ProtectedRoute allowedRoles={['company_user']}>
              <UpworkDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Job Details - accessible by company users and admins */}
        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute allowedRoles={['company_admin', 'company_user']}>
              <JobDetails />
            </ProtectedRoute>
          }
        />
        
        {/* Upwork Job Details - accessible by company users and admins */}
        <Route
          path="/upwork/jobs/:id"
          element={
            <ProtectedRoute allowedRoles={['company_admin', 'company_user']}>
              <UpworkJobDetails />
            </ProtectedRoute>
          }
        />
        
        {/* Admin Dashboard - accessible only by super admins */}
        <Route
          path="/AdminDashboard"
          element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Company Admin Dashboard - accessible only by company admins */}
        <Route
          path="/CompanyAdminDashboard"
          element={
            <ProtectedRoute allowedRoles={['company_admin']}>
              <CompanyAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* User Dashboard - accessible only by company users */}
        <Route
          path="/my-dashboard"
          element={
            <ProtectedRoute allowedRoles={['company_user']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* User Management - accessible by company admins and super admins */}
        {/* <Route
          path="/user-management"
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'company_admin']}>
              <UserManagement />
            </ProtectedRoute>
          }
        /> */}
        
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;