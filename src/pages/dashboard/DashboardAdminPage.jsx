
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { listarProductos, listarCategorias, listarUsuarios } from "../../services/api";
import "./dashboard.css";

const DashboardAdminPage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        productos: 0,
        categorias: 0,
        usuarios: 0,
        loading: true
    });

    useEffect(() => {
        const cargarEstadisticas = async () => {
            try {
                setStats(prev => ({ ...prev, loading: true }));


                const productosResponse = await listarProductos();
                const totalProductos = productosResponse.error ? 0 : 
                    (productosResponse.data?.productos?.length || productosResponse.data?.length || 0);


                const categoriasResponse = await listarCategorias(100, 0); 
                const totalCategorias = categoriasResponse.error ? 0 : 
                    (categoriasResponse.data?.total || categoriasResponse.data?.categorias?.length || 0);

    
                const usuariosResponse = await listarUsuarios(100, 0); 
                const totalUsuarios = usuariosResponse.error ? 0 : 
                    (usuariosResponse.data?.total || usuariosResponse.data?.usuarios?.length || 0);

                setStats({
                    productos: totalProductos,
                    categorias: totalCategorias,
                    usuarios: totalUsuarios,
                    loading: false
                });

            } catch (error) {
                console.error('Error al cargar estadísticas:', error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        cargarEstadisticas();
    }, []);

    const handleNavigateToCategories = () => {
        navigate('/categorias');
    };

    const handleNavigateToUsers = () => {
        navigate('/usuarios');
    };

    const handleNavigateToProducts = () => {
        navigate('/productos');
    };

    return (
        <MainLayout>
            <div className="dashboard-admin">
                <div className="dashboard-header">
                    <div className="header-content">
                        <h1>Panel de Administrador</h1>
                        <p>Gestiona tu inventario y usuarios desde aquí</p>
                    </div>
                </div>

                <div className="dashboard-stats">
                    <div className="stat-card" onClick={handleNavigateToProducts} style={{ cursor: 'pointer' }}>
                        <div className="stat-icon products">
                            <i className="icon">📦</i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.loading ? '...' : stats.productos}</h3>
                            <p>Productos Totales</p>
                        </div>
                    </div>

                    <div className="stat-card" onClick={handleNavigateToCategories} style={{ cursor: 'pointer' }}>
                        <div className="stat-icon categories">
                            <i className="icon">📋</i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.loading ? '...' : stats.categorias}</h3>
                            <p>Categorías</p>
                        </div>
                    </div>

                    <div className="stat-card" onClick={handleNavigateToUsers} style={{ cursor: 'pointer' }}>
                        <div className="stat-icon users">
                            <i className="icon">👥</i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.loading ? '...' : stats.usuarios}</h3>
                            <p>Usuarios</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon sales">
                            <i className="icon">💰</i>
                        </div>
                        <div className="stat-info">
                            <h3>$0</h3>
                            <p>Ventas del Mes</p>
                        </div>
                    </div>
                </div>

            <div className="dashboard-actions">
                <h2>Acciones Rápidas</h2>
                <div className="action-grid">
                    <div className="action-card">
                        <div className="action-icon">📦</div>
                        <h3>Gestionar Productos</h3>
                        <p>Agregar, editar y eliminar productos del inventario</p>
                        <button 
                            className="action-btn primary"
                            onClick={handleNavigateToProducts}
                        >
                            Ir a Productos
                        </button>
                    </div>

                    <div className="action-card">
                        <div className="action-icon">📋</div>
                        <h3>Gestionar Categorías</h3>
                        <p>Organiza tus productos por categorías</p>
                        <button 
                            className="action-btn secondary"
                            onClick={handleNavigateToCategories}
                        >
                            Ir a Categorías
                        </button>
                    </div>

                    <div className="action-card">
                        <div className="action-icon">👥</div>
                        <h3>Gestionar Usuarios</h3>
                        <p>Administrar usuarios del sistema</p>
                        <button 
                            className="action-btn info"
                            onClick={handleNavigateToUsers}
                        >
                            Ir a Usuarios
                        </button>
                    </div>

                    <div className="action-card">
                        <div className="action-icon">📊</div>
                        <h3>Ver Reportes</h3>
                        <p>Analiza las estadísticas de tu negocio</p>
                        <button className="action-btn success">Ver Reportes</button>
                    </div>

                    <div className="action-card">
                        <div className="action-icon">🧾</div>
                        <h3>Facturas</h3>
                        <p>Gestionar facturas y ventas</p>
                        <button className="action-btn warning">Ir a Facturas</button>
                    </div>

                    <div className="action-card">
                        <div className="action-icon">⚙️</div>
                        <h3>Configuración</h3>
                        <p>Ajustes del sistema y configuración</p>
                        <button className="action-btn dark">Configurar</button>
                    </div>
                </div>
            </div>

            <div className="recent-activity">
                <h2>Actividad Reciente</h2>
                <div className="activity-list">
                    {!stats.loading && stats.productos > 0 && (
                        <div className="activity-item">
                            <div className="activity-icon">✅</div>
                            <div className="activity-content">
                                <p><strong>Sistema cargado:</strong> {stats.productos} productos disponibles</p>
                                <span>Actualizado</span>
                            </div>
                        </div>
                    )}
                    
                    {!stats.loading && stats.categorias > 0 && (
                        <div className="activity-item">
                            <div className="activity-icon">📋</div>
                            <div className="activity-content">
                                <p><strong>Categorías organizadas:</strong> {stats.categorias} categorías activas</p>
                                <span>Sistema actualizado</span>
                            </div>
                        </div>
                    )}
                    
                    {!stats.loading && stats.usuarios > 0 && (
                        <div className="activity-item">
                            <div className="activity-icon">👤</div>
                            <div className="activity-content">
                                <p><strong>Usuarios registrados:</strong> {stats.usuarios} usuarios en el sistema</p>
                                <span>Base de datos actualizada</span>
                            </div>
                        </div>
                    )}

                    {stats.loading && (
                        <div className="activity-item">
                            <div className="activity-icon">⏳</div>
                            <div className="activity-content">
                                <p><strong>Cargando datos...</strong></p>
                                <span>Obteniendo información del servidor</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            </div>
        </MainLayout>
    );
};

export default DashboardAdminPage;