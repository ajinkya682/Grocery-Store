// src/components/admin/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ type = 'admin' }) => {
  const { isUserAuthenticated, isAdminAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-10 h-10 border-4 border-gray-100 border-t-primary rounded-full" />
      </div>
    );
  }

  if (type === 'admin') {
    return isAdminAuthenticated ? <Outlet /> : <Navigate to="/adminlogin" state={{ from: location }} replace />;
  }

  return isUserAuthenticated ? <Outlet /> : <Navigate to="/userlogin" state={{ from: location }} replace />;
};

export default ProtectedRoute;
