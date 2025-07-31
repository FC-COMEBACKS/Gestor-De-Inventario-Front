import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'var(--primary-color)' }) => {
  const sizeClasses = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  const spinnerStyle = {
    width: sizeClasses[size],
    height: sizeClasses[size],
    border: `3px solid ${color}20`,
    borderTop: `3px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle}></div>
    </>
  );
};

export { LoadingSpinner };
export default LoadingSpinner;