import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import LoadingSpinner from '../LoadingSpinner';

const ProtectedRoute = ({ element, adminOnly = false }) => {
  const { user, loading, getUserRole, getRedirectPath } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'var(--bg-secondary)'
      }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  const userRole = getUserRole();

  if (adminOnly && userRole !== 'ADMIN_ROLE') {
    const redirectPath = getRedirectPath(user);
    return <Navigate to={redirectPath} replace />;
  }

  return element;
};

export default ProtectedRoute;