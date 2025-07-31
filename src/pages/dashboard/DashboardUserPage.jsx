import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { useProductos } from "../../shared/hooks";
import { getProductIcon } from "../../shared/utils/iconMapper";
import "./dashboard.css";

const DashboardUserPage = () => {
    const navigate = useNavigate();
    const { productos, loading, obtenerProductos } = useProductos();
    const [productosDestacados, setProductosDestacados] = useState([]);

    useEffect(() => {
        obtenerProductos();
    }, [obtenerProductos]);

    useEffect(() => {
        if (productos.length > 0) {
            const destacados = productos
                .filter(p => p.stock > 0)
                .sort((a, b) => b.stock - a.stock)
                .slice(0, 3);
            setProductosDestacados(destacados);
        }
    }, [productos]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(price);
    };

    const handleViewProduct = (producto) => {
        navigate(`/productos/${producto.uid || producto._id}`);
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    const getIconColor = (index) => {
        const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
        return colors[index % colors.length];
    };
    return (
        <MainLayout>
            <div className="dashboard-user">
                <div className="user-welcome">
                    <h1>¡Bienvenido al Catálogo!</h1>
                    <p>Explora nuestros productos y encuentra lo que necesitas</p>
                </div>

                <div className="user-menu">
                    <div className="menu-card" onClick={() => handleNavigation('/catalogo')}>
                        <div className="menu-icon">🛍️</div>
                        <h3>Ver Productos</h3>
                        <p>Explora nuestro catálogo completo de productos disponibles</p>
                    </div>

                    <div className="menu-card" onClick={() => handleNavigation('/categorias-cliente')}>
                        <div className="menu-icon">📋</div>
                        <h3>Categorías</h3>
                        <p>Navega por las diferentes categorías de productos</p>
                    </div>

                    <div className="menu-card" onClick={() => handleNavigation('/carrito')}>
                        <div className="menu-icon">🛒</div>
                        <h3>Mi Carrito</h3>
                        <p>Revisa los productos que has agregado a tu carrito</p>
                    </div>

                    <div className="menu-card" onClick={() => handleNavigation('/facturas')}>
                        <div className="menu-icon">🧾</div>
                        <h3>Mis Compras</h3>
                        <p>Historial de tus facturas y compras realizadas</p>
                    </div>

                    <div className="menu-card" onClick={() => handleNavigation('/perfil')}>
                        <div className="menu-icon">👤</div>
                        <h3>Mi Perfil</h3>
                        <p>Actualiza tu información personal y preferencias</p>
                    </div>

                    <div className="menu-card">
                        <div className="menu-icon">📞</div>
                        <h3>Contacto</h3>
                        <p>¿Necesitas ayuda? Contáctanos para soporte</p>
                    </div>
                </div>

                <div className="user-stats">
                    <div className="stats-grid">
                        <div className="user-stat-card">
                            <div className="stat-icon cart">
                                <i className="icon">🛒</i>
                            </div>
                            <div className="stat-info">
                                <h3>0</h3>
                                <p>Productos en Carrito</p>
                            </div>
                        </div>

                        <div className="user-stat-card">
                            <div className="stat-icon purchases">
                                <i className="icon">📦</i>
                            </div>
                            <div className="stat-info">
                                <h3>0</h3>
                                <p>Compras Realizadas</p>
                            </div>
                        </div>

                        <div className="user-stat-card">
                            <div className="stat-icon total">
                                <i className="icon">💰</i>
                            </div>
                            <div className="stat-info">
                                <h3>{formatPrice(0)}</h3>
                                <p>Total Gastado</p>
                            </div>
                        </div>

                        <div className="user-stat-card">
                            <div className="stat-icon products">
                                <i className="icon">📦</i>
                            </div>
                            <div className="stat-info">
                                <h3>{productos.filter(p => p.stock > 0).length}</h3>
                                <p>Productos Disponibles</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="recent-activity">
                    <h2>Actividad Reciente</h2>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon">👋</div>
                            <div className="activity-content">
                                <p><strong>¡Bienvenido!</strong> Tu cuenta ha sido creada exitosamente</p>
                                <span>Hoy</span>
                            </div>
                        </div>

                        <div className="activity-item">
                            <div className="activity-icon">�</div>
                            <div className="activity-content">
                                <p><strong>Explora nuestros productos:</strong> Tenemos {productos.length} productos disponibles</p>
                                <span>Ahora</span>
                            </div>
                        </div>

                        <div className="activity-item">
                            <div className="activity-icon">🛒</div>
                            <div className="activity-content">
                                <p><strong>Empieza a comprar:</strong> Agrega productos a tu carrito desde el catálogo</p>
                                <span>Próximamente</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="featured-products">
                    <h2>Productos Destacados</h2>
                    
                    {loading && (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando productos...</span>
                            </div>
                        </div>
                    )}

                    {!loading && (
                        <div className="products-grid">
                            {productosDestacados.length > 0 ? (
                                productosDestacados.map((producto, index) => (
                                    <div key={producto.uid || producto._id} className="product-card">
                                        <div className="product-image">
                                            <div 
                                                className="product-icon" 
                                                style={{backgroundColor: getIconColor(index)}}
                                            >
                                                {getProductIcon(producto.nombreProducto)}
                                            </div>
                                        </div>
                                        <div className="product-info">
                                            <h4>{producto.nombreProducto}</h4>
                                            <p className="price">{formatPrice(producto.precioProducto)}</p>
                                            <p className="stock">Stock: {producto.stock} unidades</p>
                                            <button 
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleViewProduct(producto)}
                                            >
                                                Ver Detalles
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center">
                                    <p className="text-muted">No hay productos disponibles en este momento</p>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => handleNavigation('/catalogo')}
                                    >
                                        Ver Catálogo Completo
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default DashboardUserPage;