import React, { useState, useMemo } from 'react';
import { FacturaCard } from './FacturaCard';
import { LoadingSpinner } from '../LoadingSpinner';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';

export const FacturaList = ({ 
    facturas = [], 
    loading = false, 
    onAnular, 
    isAdmin = false,
    showFilters = true 
}) => {
    const [filtroEstado, setFiltroEstado] = useState('TODAS');
    const [busqueda, setBusqueda] = useState('');
    const [ordenPor, setOrdenPor] = useState('fecha-desc');
    const [filtroFecha, setFiltroFecha] = useState('TODAS');
    const [rangoMontoMin, setRangoMontoMin] = useState('');
    const [rangoMontoMax, setRangoMontoMax] = useState('');

    const limpiarFiltros = () => {
        setFiltroEstado('TODAS');
        setBusqueda('');
        setOrdenPor('fecha-desc');
        setFiltroFecha('TODAS');
        setRangoMontoMin('');
        setRangoMontoMax('');
    };

    const facturasFiltradas = useMemo(() => {
        let facturasProcesadas = [...facturas];

        if (filtroEstado && filtroEstado !== 'TODAS') {
            facturasProcesadas = facturasProcesadas.filter(
                factura => factura.estado === filtroEstado
            );
        }

        if (filtroFecha && filtroFecha !== 'TODAS') {
            const ahora = new Date();
            const filtrarFecha = (factura) => {
                const fechaFactura = new Date(factura.fecha);
                switch (filtroFecha) {
                    case 'HOY':
                        return fechaFactura.toDateString() === ahora.toDateString();
                    case 'SEMANA': {
                        const unaSemanaAtras = new Date(ahora);
                        unaSemanaAtras.setDate(ahora.getDate() - 7);
                        return fechaFactura >= unaSemanaAtras;
                    }
                    case 'MES': {
                        const unMesAtras = new Date(ahora);
                        unMesAtras.setMonth(ahora.getMonth() - 1);
                        return fechaFactura >= unMesAtras;
                    }
                    case 'TRIMESTRE': {
                        const tresMesesAtras = new Date(ahora);
                        tresMesesAtras.setMonth(ahora.getMonth() - 3);
                        return fechaFactura >= tresMesesAtras;
                    }
                    default:
                        return true;
                }
            };
            facturasProcesadas = facturasProcesadas.filter(filtrarFecha);
        }

        if (rangoMontoMin !== '' || rangoMontoMax !== '') {
            facturasProcesadas = facturasProcesadas.filter(factura => {
                const montoMin = rangoMontoMin ? parseFloat(rangoMontoMin) : 0;
                const montoMax = rangoMontoMax ? parseFloat(rangoMontoMax) : Infinity;
                return factura.total >= montoMin && factura.total <= montoMax;
            });
        }

        if (busqueda.trim()) {
            const busquedaLower = busqueda.toLowerCase().trim();
            facturasProcesadas = facturasProcesadas.filter(factura => {
                const idFactura = factura._id.slice(-8).toLowerCase();
                const nombreCliente = factura.idUsuario ? 
                    `${factura.idUsuario.name} ${factura.idUsuario.surname}`.toLowerCase() : '';
                const emailCliente = factura.idUsuario?.email?.toLowerCase() || '';
                const productos = factura.productos?.map(p => p.nombreProducto.toLowerCase()).join(' ') || '';

                return idFactura.includes(busquedaLower) ||
                       nombreCliente.includes(busquedaLower) ||
                       emailCliente.includes(busquedaLower) ||
                       productos.includes(busquedaLower);
            });
        }

        facturasProcesadas.sort((a, b) => {
            switch (ordenPor) {
                case 'fecha-desc':
                    return new Date(b.fecha) - new Date(a.fecha);
                case 'fecha-asc':
                    return new Date(a.fecha) - new Date(b.fecha);
                case 'total-desc':
                    return b.total - a.total;
                case 'total-asc':
                    return a.total - b.total;
                case 'estado':
                    return a.estado.localeCompare(b.estado);
                case 'cliente': {
                    const clienteA = a.idUsuario ? `${a.idUsuario.name} ${a.idUsuario.surname}` : '';
                    const clienteB = b.idUsuario ? `${b.idUsuario.name} ${b.idUsuario.surname}` : '';
                    return clienteA.localeCompare(clienteB);
                }
                default:
                    return 0;
            }
        });

        return facturasProcesadas;
    }, [facturas, filtroEstado, busqueda, ordenPor, filtroFecha, rangoMontoMin, rangoMontoMax]);

    const estadisticas = useMemo(() => {
        const stats = {
            total: facturas.length,
            activas: facturas.filter(f => f.estado === 'ACTIVA').length,
            anuladas: facturas.filter(f => f.estado === 'ANULADA').length,
            montoTotal: facturas.reduce((total, f) => 
                f.estado === 'ACTIVA' ? total + f.total : total, 0
            )
        };
        return stats;
    }, [facturas]);

    if (loading) {
        return (
            <div className="factura-list__loading">
                <LoadingSpinner />
                <p>Cargando facturas...</p>
            </div>
        );
    }

    if (facturas.length === 0) {
        return (
            <div className="factura-list__empty">
                <div className="factura-list__empty-icon">📋</div>
                <h3>No hay facturas disponibles</h3>
                <p>Las facturas aparecerán aquí cuando se procesen compras</p>
            </div>
        );
    }

    return (
        <div className="factura-list">
            {}
            <div className="factura-list__stats">
                <div className="factura-list__stat">
                    <span className="factura-list__stat-value">{estadisticas.total}</span>
                    <span className="factura-list__stat-label">📋 Total</span>
                </div>
                <div className="factura-list__stat">
                    <span className="factura-list__stat-value">{estadisticas.activas}</span>
                    <span className="factura-list__stat-label">✅ Activas</span>
                </div>
                <div className="factura-list__stat">
                    <span className="factura-list__stat-value">{estadisticas.anuladas}</span>
                    <span className="factura-list__stat-label">❌ Anuladas</span>
                </div>
                <div className="factura-list__stat">
                    <span className="factura-list__stat-value">Q{estadisticas.montoTotal.toFixed(2)}</span>
                    <span className="factura-list__stat-label">💰 Monto Total</span>
                </div>
            </div>

            {}
            {showFilters && (
                <div className="factura-list__filters">
                    <div className="factura-list__filter-row">
                        <div className="factura-list__filter-group">
                            <Input
                                type="text"
                                placeholder="🔍 Buscar por ID, cliente o producto..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="factura-list__search"
                            />
                        </div>
                        
                        <div className="factura-list__filter-group">
                            <Select
                                value={filtroEstado}
                                onChange={(value) => setFiltroEstado(value)}
                                options={[
                                    { value: 'TODAS', label: 'Todos los estados' },
                                    { value: 'ACTIVA', label: '✅ Activas' },
                                    { value: 'ANULADA', label: '❌ Anuladas' }
                                ]}
                            />
                        </div>

                        <div className="factura-list__filter-group">
                            <Select
                                value={filtroFecha}
                                onChange={(value) => setFiltroFecha(value)}
                                options={[
                                    { value: 'TODAS', label: 'Todas las fechas' },
                                    { value: 'HOY', label: '📅 Hoy' },
                                    { value: 'SEMANA', label: '📅 Última semana' },
                                    { value: 'MES', label: '📅 Último mes' },
                                    { value: 'TRIMESTRE', label: '📅 Último trimestre' }
                                ]}
                            />
                        </div>

                        <div className="factura-list__filter-group factura-list__monto-filters">
                            <Input
                                type="number"
                                placeholder="💰 Monto mín."
                                value={rangoMontoMin}
                                onChange={(e) => setRangoMontoMin(e.target.value)}
                                min="0"
                                step="0.01"
                            />
                            <Input
                                type="number"
                                placeholder="💰 Monto máx."
                                value={rangoMontoMax}
                                onChange={(e) => setRangoMontoMax(e.target.value)}
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="factura-list__filter-group">
                            <Select
                                value={ordenPor}
                                onChange={(value) => setOrdenPor(value)}
                                options={[
                                    { value: 'fecha-desc', label: '📅 Más recientes' },
                                    { value: 'fecha-asc', label: '📅 Más antiguas' },
                                    { value: 'total-desc', label: '💰 Mayor monto' },
                                    { value: 'total-asc', label: '💰 Menor monto' },
                                    { value: 'estado', label: '🏷️ Por estado' },
                                    { value: 'cliente', label: '👤 Por cliente' }
                                ]}
                            />
                        </div>

                        <div className="factura-list__filter-group">
                            <button 
                                onClick={limpiarFiltros}
                                className="factura-list__clear-filters"
                                type="button"
                            >
                                🧹 Limpiar filtros
                            </button>
                        </div>
                    </div>

                    {}
                    <div className="factura-list__filter-results">
                        {facturasFiltradas.length !== facturas.length && (
                            <span className="factura-list__filter-count">
                                📊 Mostrando {facturasFiltradas.length} de {facturas.length} facturas
                            </span>
                        )}
                        {busqueda.trim() && (
                            <span className="factura-list__search-term">
                                🔍 Búsqueda: "{busqueda}"
                            </span>
                        )}
                        {filtroEstado !== 'TODAS' && (
                            <span className="factura-list__filter-term">
                                🏷️ Estado: {filtroEstado}
                            </span>
                        )}
                        {filtroFecha !== 'TODAS' && (
                            <span className="factura-list__filter-term">
                                📅 Fecha: {filtroFecha}
                            </span>
                        )}
                        {(rangoMontoMin !== '' || rangoMontoMax !== '') && (
                            <span className="factura-list__filter-term">
                                💰 Monto: Q{rangoMontoMin || '0'} - Q{rangoMontoMax || '∞'}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {}
            {facturasFiltradas.length === 0 ? (
                <div className="factura-list__no-results">
                    <div className="factura-list__no-results-icon">🔍</div>
                    <h4>No se encontraron facturas</h4>
                    <p>Intenta ajustar los filtros de búsqueda</p>
                </div>
            ) : (
                <div className="factura-list__items">
                    {facturasFiltradas.map((factura) => (
                        <FacturaCard
                            key={factura._id}
                            factura={factura}
                            onAnular={onAnular}
                            isAdmin={isAdmin}
                            showActions={true}
                        />
                    ))}
                </div>
            )}

            <style>{`
                .factura-list {
                    width: 100%;
                }

                .factura-list__loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem;
                    color: #6c757d;
                }

                .factura-list__empty {
                    text-align: center;
                    padding: 3rem;
                    color: #6c757d;
                }

                .factura-list__empty-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                    opacity: 0.5;
                }

                .factura-list__empty h3 {
                    margin-bottom: 0.5rem;
                    color: #495057;
                }

                .factura-list__stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                    padding: 1rem;
                    background-color: #f8f9fa;
                    border-radius: 12px;
                }

                .factura-list__stat {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 1rem;
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }

                .factura-list__stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #2c3e50;
                    margin-bottom: 0.25rem;
                }

                .factura-list__stat-label {
                    font-size: 0.85rem;
                    color: #6c757d;
                    text-align: center;
                }

                .factura-list__filters {
                    background-color: #f8f9fa;
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                }

                .factura-list__filters-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1.2fr 1fr auto;
                    gap: 1rem;
                    align-items: end;
                }

                .factura-list__filter-group {
                    display: flex;
                    flex-direction: column;
                }

                .factura-list__monto-filters {
                    display: flex;
                    flex-direction: row !important;
                    gap: 0.5rem;
                }

                .factura-list__monto-filters input {
                    flex: 1;
                }

                .factura-list__clear-filters {
                    background: #f59e0b;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 0.75rem 1rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                    height: fit-content;
                }

                .factura-list__clear-filters:hover {
                    background: #d97706;
                    transform: translateY(-1px);
                }

                .factura-list__search {
                    width: 100%;
                }

                .factura-list__filter-results {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid #dee2e6;
                    font-size: 0.85rem;
                }

                .factura-list__filter-count,
                .factura-list__search-term,
                .factura-list__filter-term {
                    padding: 0.25rem 0.75rem;
                    background-color: #e9ecef;
                    border-radius: 20px;
                    color: #495057;
                    font-weight: 500;
                }

                .factura-list__no-results {
                    text-align: center;
                    padding: 3rem;
                    color: #6c757d;
                }

                .factura-list__no-results-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    opacity: 0.5;
                }

                .factura-list__no-results h4 {
                    margin-bottom: 0.5rem;
                    color: #495057;
                }

                .factura-list__items {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                @media (max-width: 768px) {
                    .factura-list__stats {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .factura-list__filters-row {
                        grid-template-columns: 1fr 1fr;
                        gap: 1rem;
                    }

                    .factura-list__monto-filters {
                        flex-direction: column !important;
                        gap: 0.5rem;
                    }

                    .factura-list__filter-results {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                }

                @media (max-width: 640px) {
                    .factura-list__filters-row {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                }

                @media (max-width: 480px) {
                    .factura-list__stats {
                        grid-template-columns: 1fr;
                    }

                    .factura-list__stat {
                        padding: 0.75rem;
                    }

                    .factura-list__stat-value {
                        font-size: 1.25rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default FacturaList;