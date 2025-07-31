import React from 'react'

const DashboardPrincipalPage = () => {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <h1 style={{ color: '#2d3a4b', marginBottom: 16 }}>¡Bienvenido al Gestor de Inventario!</h1>
      <p style={{ color: '#4a5568', fontSize: 18, maxWidth: 500, textAlign: 'center' }}>
        Administra tus productos de manera eficiente y sencilla.<br />
        Desde aquí podrás agregar, editar y visualizar el inventario de tu negocio.
      </p>
      <img
        src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png"
        alt="Inventario"
        style={{ width: 120, marginTop: 32, opacity: 0.85 }}
      />
    </div>
  )
}

export default DashboardPrincipalPage;