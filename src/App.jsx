import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
// import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UpworkDashboard from "./pages/UpworkDashboard"; // <-- New import
import UpworkJobDetails from "./pages/UpworkJobDetails";
import JobDetails from "./pages/JobDetails";
import { useSelector } from "react-redux"
import ScrollToTop from "./components/ScrollToTop";
import AdminDashboard from './pages/AdminDashboard'; // adjust path as needed


function ProtectedRoute({ children }) {
  const user = useSelector(state => state.user.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const user = useSelector(state => state.user.user);

  return (
    <BrowserRouter>
    <ScrollToTop />
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        {/* <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        /> */}
         {/* Redirect /dashboard to /dashboard/linkedin */}
        <Route path="/dashboard" element={<Navigate to="/dashboard/linkedin" />} />
        <Route
          path="/dashboard/linkedin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/upwork"
          element={
            <ProtectedRoute>
              <UpworkDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/upwork/jobs/:id"
          element={
            <ProtectedRoute>
               <UpworkJobDetails />
            </ProtectedRoute>
            }
        />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;