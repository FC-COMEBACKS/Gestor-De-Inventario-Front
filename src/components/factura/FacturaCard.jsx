import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FacturaDetail } from './FacturaDetail';
import { ProductIcon } from '../productos';
import { descargarFacturaPDF } from '../../services/api';

export const FacturaCard = ({ 
    factura, 
    onAnular, 
    showActions = true,
    isAdmin = false 
}) => {
    const [showDetail, setShowDetail] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-GT', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const obtenerEstadoColor = (estado) => {
        return estado === 'ACTIVA' ? '#27ae60' : '#e74c3c';
    };

    const obtenerEstadoIcono = (estado) => {
        return estado === 'ACTIVA' ? '✅' : '❌';
    };

    const obtenerIdCorto = (id) => {
        return id ? id.slice(-8).toUpperCase() : 'N/A';
    };

    const handleAnular = () => {
        if (onAnular) {
            onAnular(factura._id);
        }
    };

    const handleDescargarPDF = async () => {
        setDownloading(true);
        try {
            const result = await descargarFacturaPDF(factura._id);
            if (result.error) {
                console.log('Error en descarga:', result.message);
            } else if (result.success) {
                console.log('PDF descargado exitosamente');
            }
        } catch (error) {
            console.error('Error descargando PDF:', error);
            alert('Error inesperado al intentar descargar el PDF.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <>
            <Card className="factura-card">
                <div className="factura-card__header">
                    <div className="factura-card__info">
                        <h3 className="factura-card__id">
                            📋 Factura #{obtenerIdCorto(factura._id)}
                        </h3>
                        <div className="factura-card__meta">
                            <span className="factura-card__fecha">
                                📅 {formatearFecha(factura.fecha)}
                            </span>
                            <span 
                                className="factura-card__estado"
                                style={{ color: obtenerEstadoColor(factura.estado) }}
                            >
                                {obtenerEstadoIcono(factura.estado)} {factura.estado}
                            </span>
                        </div>
                    </div>
                    <div className="factura-card__total">
                        <span className="factura-card__total-label">Total:</span>
                        <span className="factura-card__total-amount">
                            Q{factura.total.toFixed(2)}
                        </span>
                    </div>
                </div>

                {}
                {factura.idUsuario && (
                    <div className="factura-card__cliente">
                        <span className="factura-card__cliente-label">👤 Cliente:</span>
                        <span className="factura-card__cliente-name">
                            {factura.idUsuario.name} {factura.idUsuario.surname}
                        </span>
                        {factura.idUsuario.email && (
                            <span className="factura-card__cliente-email">
                                ({factura.idUsuario.email})
                            </span>
                        )}
                    </div>
                )}

                {}
                <div className="factura-card__productos">
                    <div className="factura-card__productos-header">
                        📦 Productos ({factura.productos.length}):
                    </div>
                    <div className="factura-card__productos-list">
                        {factura.productos.slice(0, 3).map((producto, index) => (
                            <div key={index} className="factura-card__producto-item">
                                <ProductIcon 
                                    nombreProducto={producto.nombreProducto} 
                                    size="small" 
                                />
                                <span className="factura-card__producto-nombre">
                                    {producto.nombreProducto}
                                </span>
                                <span className="factura-card__producto-cantidad">
                                    x{producto.cantidad}
                                </span>
                                <span className="factura-card__producto-precio">
                                    Q{(producto.precioProducto * producto.cantidad).toFixed(2)}
                                </span>
                            </div>
                        ))}
                        {factura.productos.length > 3 && (
                            <div className="factura-card__producto-item--more">
                                <span>... y {factura.productos.length - 3} productos más</span>
                            </div>
                        )}
                    </div>
                </div>

                {}
                {factura.estado === 'ANULADA' && (
                    <div className="factura-card__anulacion">
                        <div className="factura-card__anulacion-header">
                            ⚠️ Factura Anulada
                        </div>
                        <div className="factura-card__anulacion-info">
                            <span>📅 {formatearFecha(factura.fechaAnulacion)}</span>
                            {factura.motivoAnulacion && (
                                <span>📝 {factura.motivoAnulacion}</span>
                            )}
                        </div>
                    </div>
                )}

                {}
                {showActions && (
                    <div className="factura-card__actions">
                        <Button
                            variant="outline"
                            size="small"
                            onClick={() => setShowDetail(!showDetail)}
                        >
                            {showDetail ? '🔼 Ocultar Detalle' : '👁️ Ver Detalle'}
                        </Button>

                        <Button
                            variant="success"
                            size="small"
                            onClick={handleDescargarPDF}
                            disabled={downloading}
                        >
                            {downloading ? (
                                <>⏳ Descargando...</>
                            ) : (
                                <>📄 Descargar PDF</>
                            )}
                        </Button>

                        {isAdmin && factura.estado === 'ACTIVA' && (
                            <Button
                                variant="danger"
                                size="small"
                                onClick={handleAnular}
                            >
                                ❌ Anular
                            </Button>
                        )}
                    </div>
                )}
            </Card>

            {}
            {showDetail && (
                <div className="factura-card__detail-expansion">
                    <FacturaDetail factura={factura} />
                </div>
            )}

            <style>{`
                .factura-card {
                    margin-bottom: 1rem;
                    transition: all 0.3s ease;
                }

                .factura-card:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    transform: translateY(-2px);
                }

                .factura-card__header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid #e9ecef;
                }

                .factura-card__id {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #2c3e50;
                }

                .factura-card__meta {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    font-size: 0.9rem;
                    color: #6c757d;
                }

                .factura-card__estado {
                    font-weight: 600;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .factura-card__total {
                    text-align: right;
                }

                .factura-card__total-label {
                    display: block;
                    font-size: 0.85rem;
                    color: #6c757d;
                    margin-bottom: 0.25rem;
                }

                .factura-card__total-amount {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #27ae60;
                }

                .factura-card__cliente {
                    margin-bottom: 1rem;
                    padding: 0.75rem;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    font-size: 0.9rem;
                }

                .factura-card__cliente-label {
                    font-weight: 600;
                    color: #495057;
                    margin-right: 0.5rem;
                }

                .factura-card__cliente-name {
                    font-weight: 500;
                    color: #2c3e50;
                    margin-right: 0.5rem;
                }

                .factura-card__cliente-email {
                    color: #6c757d;
                    font-style: italic;
                }

                .factura-card__productos {
                    margin-bottom: 1rem;
                }

                .factura-card__productos-header {
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                }

                .factura-card__productos-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .factura-card__producto-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem;
                    background-color: #f8f9fa;
                    border-radius: 6px;
                    font-size: 0.85rem;
                }

                .factura-card__producto-nombre {
                    flex: 1;
                    font-weight: 500;
                    color: #2c3e50;
                }

                .factura-card__producto-cantidad {
                    color: #6c757d;
                    font-weight: 500;
                    min-width: 30px;
                }

                .factura-card__producto-precio {
                    color: #27ae60;
                    font-weight: 600;
                    min-width: 60px;
                    text-align: right;
                }

                .factura-card__producto-item--more {
                    padding: 0.5rem;
                    text-align: center;
                    color: #6c757d;
                    font-style: italic;
                    font-size: 0.85rem;
                }

                .factura-card__anulacion {
                    margin-bottom: 1rem;
                    padding: 0.75rem;
                    background-color: #fff5f5;
                    border: 1px solid #fed7d7;
                    border-radius: 8px;
                }

                .factura-card__anulacion-header {
                    font-weight: 600;
                    color: #e53e3e;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                }

                .factura-card__anulacion-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    font-size: 0.85rem;
                    color: #744d47;
                }

                .factura-card__actions {
                    display: flex;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                    padding-top: 0.75rem;
                    border-top: 1px solid #e9ecef;
                }

                @media (max-width: 768px) {
                    .factura-card__header {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .factura-card__total {
                        text-align: left;
                    }

                    .factura-card__actions {
                        flex-direction: column;
                    }

                    .factura-card__producto-item {
                        flex-wrap: wrap;
                        gap: 0.5rem;
                    }

                    .factura-card__cliente {
                        display: flex;
                        flex-direction: column;
                        gap: 0.25rem;
                    }
                }

                .factura-card__detail-expansion {
                    margin-top: 1rem;
                    padding: 1.5rem;
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 12px;
                    animation: slideDown 0.3s ease-out;
                    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        max-height: 0;
                        padding: 0 1.5rem;
                    }
                    to {
                        opacity: 1;
                        max-height: 2000px;
                        padding: 1.5rem;
                    }
                }

                .factura-card__detail-expansion .factura-detail {
                    margin: 0;
                    font-size: 0.9rem;
                }

                .factura-card__detail-expansion .factura-detail__header {
                    margin-bottom: 1.5rem;
                }

                .factura-card__detail-expansion .factura-detail__title {
                    font-size: 1.25rem;
                }

                .factura-card__detail-expansion .factura-detail__total-amount {
                    font-size: 1.5rem;
                }
            `}</style>
        </>
    );
};

export default FacturaCard;