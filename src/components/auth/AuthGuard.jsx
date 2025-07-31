import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import LoadingSpinner from '../LoadingSpinner';

const AuthGuard = ({ children, requireAuth = false, redirectTo = '/auth' }) => {
    const { user, loading, getRedirectPath } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (!loading && !hasRedirected.current) {
            if (requireAuth && !user) {
              
                hasRedirected.current = true;
                navigate(redirectTo, { replace: true });
                return;
            } 
            
            if (!requireAuth && user && (location.pathname === '/auth' || location.pathname === '/')) {
                
                hasRedirected.current = true;
                const redirectPath = getRedirectPath(user);
                navigate(redirectPath, { replace: true });
                return;
            }
        }
    }, [user, loading, requireAuth, navigate, redirectTo, getRedirectPath, location.pathname]);

    useEffect(() => {
        hasRedirected.current = false;
    }, [location.pathname]);

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

    if (requireAuth && !user) {
        return null;
    }

    return children;
};

export default AuthGuard;