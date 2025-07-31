import React from 'react';

const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '6rem', color: '#2d3a4b', margin: 0 }}>404</h1>
      <h2 style={{ color: '#4a5568', marginBottom: '1rem' }}>Página no encontrada</h2>
      <p style={{ color: '#718096', marginBottom: '2rem' }}>
        La página que buscas no existe o ha sido movida.
      </p>
      <a 
        href="/auth" 
        style={{
          padding: '12px 24px',
          backgroundColor: '#4299e1',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          transition: 'background-color 0.2s'
        }}
      >
        Volver al inicio
      </a>
    </div>
  );
};

export default NotFoundPage;