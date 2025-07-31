import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";
import { useCarritoDeCompras } from "../../shared/hooks";
import LogoutButton from "../auth/LogoutButton";
import styles from "./Header.module.css";

const Header = () => {
    const { user, getUserRole } = useAuth();
    const { carrito, obtenerCarrito } = useCarritoDeCompras();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    
    const userRole = getUserRole();
    const userName = user?.user?.name || user?.name || 'Usuario';

    useEffect(() => {
        if (userRole === 'CLIENT_ROLE') {
            obtenerCarrito();
        }
    }, [userRole, obtenerCarrito]);

    const cantidadEnCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);

    const getRoleDisplayName = (role) => {
        switch (role) {
            case 'ADMIN_ROLE':
                return 'Administrador';
            case 'CLIENT_ROLE':
                return 'Cliente';
            default:
                return 'Usuario';
        }
    };

    const handleProfileClick = () => {
        setShowUserMenu(false);
        navigate('/perfil');
    };

    const handleConfigClick = () => {
        setShowUserMenu(false);
        navigate('/configuracion');
    };

    return (
        <header className={styles.mainHeader}>
            <div className={styles.headerContent}>
                <div className={styles.headerLeft}>
                    <div className={styles.headerLogo}>
                        <span className={styles.logoIcon}>📦</span>
                        <h1 className={styles.logoText}>Gestor de Inventario</h1>
                    </div>
                </div>

                <div className={styles.headerCenter}>
                    <nav className={styles.headerNav}>
                        <a href="/dashboard-admin" className={styles.navLink}>
                            <span>🏠</span>
                            Dashboard
                        </a>
                        <a href={userRole === 'ADMIN_ROLE' ? '/productos' : '/catalogo'} className={styles.navLink}>
                            <span>📦</span>
                            {userRole === 'ADMIN_ROLE' ? 'Productos' : 'Catálogo'}
                        </a>
                        {userRole === 'ADMIN_ROLE' && (
                            <>
                                <a href="/categorias" className={styles.navLink}>
                                    <span>📂</span>
                                    Categorías
                                </a>
                                <a href="/usuarios" className={styles.navLink}>
                                    <span>👥</span>
                                    Usuarios
                                </a>
                                <a href="/facturas" className={styles.navLink}>
                                    <span>🧾</span>
                                    Facturas
                                </a>
                            </>
                        )}
                        {userRole === 'CLIENT_ROLE' && (
                            <>
                                <a href="/categorias-cliente" className={styles.navLink}>
                                    <span>📂</span>
                                    Categorías
                                </a>
                                <a href="/carrito" className={styles.navLink}>
                                    <span>🛒</span>
                                    Mi Carrito
                                    {cantidadEnCarrito > 0 && (
                                        <span className="badge bg-danger ms-1" style={{ fontSize: '0.7rem' }}>
                                            {cantidadEnCarrito}
                                        </span>
                                    )}
                                </a>
                                <a href="/facturas" className={styles.navLink}>
                                    <span>📋</span>
                                    Mis Compras
                                </a>
                            </>
                        )}
                    </nav>
                </div>

                <div className={styles.headerRight}>
                    <div className={styles.userSection}>
                        <button 
                            className={`${styles.userButton} ${showUserMenu ? styles.active : ''}`}
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            <div className={styles.userAvatar}>
                                <span>{userName.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>{userName}</span>
                                <span className={styles.userRole}>{getRoleDisplayName(userRole)}</span>
                            </div>
                            <span className={styles.dropdownArrow}>▼</span>
                        </button>

                        {showUserMenu && (
                            <div className={styles.userDropdown}>
                                <button className={styles.dropdownItem} onClick={handleProfileClick}>
                                    <span>👤</span>
                                    Mi Perfil
                                </button>
                                <button className={styles.dropdownItem} onClick={handleConfigClick}>
                                    <span>⚙️</span>
                                    Configuración
                                </button>
                                
                                <div className={styles.dropdownDivider}></div>
                                
                                <LogoutButton />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;