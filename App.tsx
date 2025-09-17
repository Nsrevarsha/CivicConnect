import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import LoginPage from './pages/LoginPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import DepartmentAdminDashboard from './pages/DepartmentAdminDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './leaflet-fix.css';

function App() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/super-admin/*" 
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/department-admin/*" 
              element={
                <ProtectedRoute allowedRoles={['department_admin']}>
                  <DepartmentAdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/supervisor/*" 
              element={
                <ProtectedRoute allowedRoles={['supervisor']}>
                  <SupervisorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </div>
  );
}

export default App;
