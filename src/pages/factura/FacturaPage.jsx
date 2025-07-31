import { useState, useEffect } from 'react';
import { FacturaList } from '../../components/factura';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { procesarCompra, listarUsuarios } from '../../services/api';
import './FacturaPage.css';

export const FacturaPage = () => {
    const [userRole, setUserRole] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [processingCompra, setProcessingCompra] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const userDetails = localStorage.getItem("user");
        if (userDetails) {
            try {
                const parsedUser = JSON.parse(userDetails);
                const role = parsedUser?.userDetails?.role || parsedUser?.role;
                setUserRole(role);

                if (role === 'ADMIN_ROLE') {
                    cargarUsuarios();
                }
            } catch (err) {
                console.warn("Error al leer datos del usuario:", err);
            }
        }
    }, []);

    const cargarUsuarios = async () => {
        try {
            const response = await listarUsuarios(100, 0); 
            
            if (!response.error && response.data?.users) {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        }
    };

    const handleProcesarCompra = async () => {
        if (!window.confirm('¿Estás seguro de que deseas procesar la compra del carrito actual?')) {
            return;
        }

        setProcessingCompra(true);
        try {
            const response = await procesarCompra();
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al procesar compra');
            }

            alert(`¡Compra procesada exitosamente!\nFactura: #${response.data.factura.id.slice(-8).toUpperCase()}\nTotal: Q${response.data.factura.total.toFixed(2)}`);
            
            setRefreshKey(prev => prev + 1);
            
        } catch (error) {
            console.error('Error al procesar compra:', error);
            alert(error.message || 'Error al procesar la compra');
        } finally {
            setProcessingCompra(false);
        }
    };

    const handleUserChange = (e) => {
        setSelectedUserId(e.target.value);
    };

    const getUserOptions = () => {
        return [
            { value: '', label: 'Todos los usuarios' },
            ...users.map(user => ({
                value: user._id,
                label: `${user.name} ${user.surname} (${user.email})`
            }))
        ];
    };

    return (
        <div className="factura-page">
            <div className="factura-page-header">
                <div className="header-content">
                    <h1>📄 Gestión de Facturas</h1>
                    <p>Administra y revisa todas las facturas del sistema</p>
                </div>

                <div className="header-actions">
                    {userRole === 'USER_ROLE' && (
                        <Button 
                            variant="primary"
                            onClick={handleProcesarCompra}
                            disabled={processingCompra}
                        >
                            {processingCompra ? '⏳ Procesando...' : '🛒 Procesar Compra'}
                        </Button>
                    )}
                </div>
            </div>

            {userRole === 'ADMIN_ROLE' && users.length > 0 && (
                <div className="admin-filters">
                    <div className="filter-section">
                        <label htmlFor="user-select">Filtrar por usuario:</label>
                        <Select
                            id="user-select"
                            value={selectedUserId}
                            onChange={handleUserChange}
                            options={getUserOptions()}
                        />
                    </div>
                </div>
            )}

            <div className="factura-content">
                <FacturaList 
                    key={refreshKey}
                    userRole={userRole}
                    selectedUserId={selectedUserId || null}
                />
            </div>
        </div>
    );
};