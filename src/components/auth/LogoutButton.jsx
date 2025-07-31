import React, { useState } from 'react';
import { useAuth } from '../../shared/hooks/useAuth';
import LoadingSpinner from '../LoadingSpinner';
import styles from './LogoutButton.module.css';

const LogoutButton = ({ className = '' }) => {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      logout();
      window.location.href = '/auth'; 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`${styles.logoutButton} ${className}`}
      title="Cerrar Sesión"
    >
      {isLoggingOut ? (
        <>
          <LoadingSpinner size="small" color="currentColor" />
          <span>Cerrando...</span>
        </>
      ) : (
        <>
          <span>🚪</span>
          <span>Cerrar Sesión</span>
        </>
      )}
    </button>
  );
};

export default LogoutButton;