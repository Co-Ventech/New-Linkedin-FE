import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import JobDetails from "./pages/JobDetails";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {
  const user = useSelector(state => state.user.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const user = useSelector(state => state.user.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/jobs/:id" element={
          <ProtectedRoute>
            <JobDetails />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 