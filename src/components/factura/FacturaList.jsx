import { useState, useEffect } from 'react';
import { FacturaCard } from './FacturaCard';
import { LoadingSpinner } from '../LoadingSpinner';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { obtenerFacturasPorUsuario } from '../../services/api';
import './FacturaList.css';

export const FacturaList = ({ userRole, selectedUserId = null }) => {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState('');

    const cargarFacturas = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await obtenerFacturasPorUsuario(
                filtroEstado || null, 
                selectedUserId
            );
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al cargar facturas');
            }

            setFacturas(response.data.facturas || []);
        } catch (error) {
            console.error('Error al cargar facturas:', error);
            setError(error.message);
            setFacturas([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarFacturas();
    }, [filtroEstado, selectedUserId]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleFiltroChange = (e) => {
        setFiltroEstado(e.target.value);
    };

    const calcularEstadisticas = () => {
        const totalFacturas = facturas.length;
        const facturasActivas = facturas.filter(f => f.estado === 'ACTIVA').length;
        const facturasAnuladas = facturas.filter(f => f.estado === 'ANULADA').length;
        const totalVentas = facturas
            .filter(f => f.estado === 'ACTIVA')
            .reduce((sum, f) => sum + f.total, 0);

        return {
            totalFacturas,
            facturasActivas,
            facturasAnuladas,
            totalVentas
        };
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="factura-list-loading">
                <LoadingSpinner />
                <p>Cargando facturas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="factura-list-error">
                <div className="error-message">
                    <h3>Error al cargar facturas</h3>
                    <p>{error}</p>
                    <Button onClick={cargarFacturas}>
                        🔄 Reintentar
                    </Button>
                </div>
            </div>
        );
    }

    const estadisticas = calcularEstadisticas();

    return (
        <div className="factura-list-container">
            <div className="factura-list-header">
                <div className="header-title">
                    <h2>📄 Gestión de Facturas</h2>
                    {selectedUserId && (
                        <p className="usuario-seleccionado">
                            Mostrando facturas del usuario seleccionado
                        </p>
                    )}
                </div>

                <div className="header-controls">
                    <div className="filtros">
                        <Select
                            value={filtroEstado}
                            onChange={handleFiltroChange}
                            options={[
                                { value: '', label: 'Todos los estados' },
                                { value: 'ACTIVA', label: 'Activas' },
                                { value: 'ANULADA', label: 'Anuladas' }
                            ]}
                        />
                    </div>
                    
                    <Button 
                        variant="outline" 
                        onClick={cargarFacturas}
                        disabled={loading}
                    >
                        🔄 Actualizar
                    </Button>
                </div>
            </div>

            {facturas.length > 0 && (
                <div className="estadisticas-facturas">
                    <div className="estadistica-card">
                        <div className="estadistica-valor">{estadisticas.totalFacturas}</div>
                        <div className="estadistica-label">Total Facturas</div>
                    </div>
                    <div className="estadistica-card activa">
                        <div className="estadistica-valor">{estadisticas.facturasActivas}</div>
                        <div className="estadistica-label">Activas</div>
                    </div>
                    <div className="estadistica-card anulada">
                        <div className="estadistica-valor">{estadisticas.facturasAnuladas}</div>
                        <div className="estadistica-label">Anuladas</div>
                    </div>
                    <div className="estadistica-card ventas">
                        <div className="estadistica-valor">{formatCurrency(estadisticas.totalVentas)}</div>
                        <div className="estadistica-label">Total Ventas</div>
                    </div>
                </div>
            )}

            <div className="factura-list-content">
                {facturas.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📄</div>
                        <h3>No hay facturas</h3>
                        <p>
                            {filtroEstado 
                                ? `No se encontraron facturas con estado "${filtroEstado}"`
                                : 'No se han generado facturas aún'
                            }
                        </p>
                        {filtroEstado && (
                            <Button 
                                variant="outline" 
                                onClick={() => setFiltroEstado('')}
                            >
                                Ver todas las facturas
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="facturas-grid">
                        {facturas.map((factura) => (
                            <FacturaCard
                                key={factura._id}
                                factura={factura}
                                onUpdate={cargarFacturas}
                                userRole={userRole}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};