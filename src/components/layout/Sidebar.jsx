import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';

const Sidebar = ({ isOpen, onToggle }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const isAdmin = user?.userDetails?.role === 'ADMIN_ROLE';

    const menuItems = [
        {
            icon: '🏠',
            label: 'Dashboard',
            path: isAdmin ? '/dashboard-admin' : '/dashboard-user',
            adminOnly: false
        },
        {
            icon: '📦',
            label: isAdmin ? 'Productos' : 'Catálogo',
            path: isAdmin ? '/productos' : '/catalogo',
            adminOnly: false
        },
        {
            icon: '📋',
            label: 'Categorías',
            path: isAdmin ? '/categorias' : '/categorias-cliente',
            adminOnly: false
        },
        {
            icon: '👥',
            label: 'Usuarios',
            path: '/usuarios',
            adminOnly: true
        },
        {
            icon: '🧾',
            label: 'Facturas',
            path: '/facturas',
            adminOnly: false
        },
        {
            icon: '🛒',
            label: 'Carrito',
            path: '/carrito',
            adminOnly: false
        },
        {
            icon: '⚙️',
            label: 'Configuración',
            path: '/settings',
            adminOnly: false
        }
    ];

    const filteredMenuItems = menuItems.filter(item => 
        !item.adminOnly || (item.adminOnly && isAdmin)
    );

    const handleNavigation = (path) => {
        navigate(path);
        if (onToggle) {
            onToggle(); 
        }
    };

    return (
        <>
            {isOpen && (
                <div 
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
                    style={{ zIndex: 1040 }}
                    onClick={onToggle}
                />
            )}

            <div 
                className={`bg-dark text-white vh-100 position-fixed top-0 start-0 d-flex flex-column ${
                    isOpen ? 'translate-x-0' : '-translate-x-100'
                } d-lg-block`}
                style={{ 
                    width: '250px', 
                    zIndex: 1041,
                    transition: 'transform 0.3s ease-in-out'
                }}
            >
                <div className="p-3 border-bottom border-secondary">
                    <div className="d-flex align-items-center justify-content-between">
                        <h5 className="mb-0">
                            📦 Gestor Inventario
                        </h5>
                        <button 
                            className="btn btn-sm btn-outline-light d-lg-none"
                            onClick={onToggle}
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <nav className="flex-grow-1 p-3">
                    <ul className="list-unstyled">
                        {filteredMenuItems.map((item, index) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={index} className="mb-2">
                                    <button
                                        className={`btn w-100 text-start d-flex align-items-center py-2 px-3 ${
                                            isActive 
                                                ? 'btn-primary' 
                                                : 'btn-outline-secondary text-white border-0'
                                        }`}
                                        onClick={() => handleNavigation(item.path)}
                                        style={{
                                            backgroundColor: isActive ? '#0d6efd' : 'transparent',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        <span className="me-3" style={{ fontSize: '1.2em' }}>
                                            {item.icon}
                                        </span>
                                        {item.label}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-3 border-top border-secondary">
                    <div className="d-flex align-items-center">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                             style={{ width: '40px', height: '40px' }}>
                            👤
                        </div>
                        <div className="flex-grow-1">
                            <div className="fw-bold small">
                                {user?.userDetails?.fullName || 'Usuario'}
                            </div>
                            <div className="text-muted small">
                                {isAdmin ? 'Administrador' : 'Usuario'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;