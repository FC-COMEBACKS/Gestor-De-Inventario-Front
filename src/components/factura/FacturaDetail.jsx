import React, { useState } from 'react';
import { ProductIcon } from '../productos';
import { Button } from '../ui/Button';
import { descargarFacturaPDF } from '../../services/api';

export const FacturaDetail = ({ factura }) => {
    const [downloading, setDownloading] = useState(false);

    if (!factura) {
        return (
            <div className="factura-detail__empty">
                <div className="factura-detail__empty-icon">📋</div>
                <p>No se encontró la factura</p>
            </div>
        );
    }

    if (!factura._id || !factura.fecha) {
        return (
            <div className="factura-detail__empty">
                <div className="factura-detail__empty-icon">⚠️</div>
                <p>La factura no tiene datos válidos</p>
            </div>
        );
    }

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

    const formatearFecha = (fecha) => {
        try {
            return new Date(fecha).toLocaleDateString('es-GT', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Fecha no válida';
        }
    };

    const calcularSubtotal = (producto) => {
        return (producto?.cantidad || 0) * (producto?.precioProducto || 0);
    };

    const obtenerIdCorto = (id) => {
        return id ? id.slice(-8).toUpperCase() : 'N/A';
    };

    const obtenerIdMedio = (id) => {
        return id ? id.slice(-6).toUpperCase() : 'N/A';
    };

    const obtenerEstadoColor = (estado) => {
        return estado === 'ACTIVA' ? '#27ae60' : '#e74c3c';
    };

    const obtenerEstadoIcono = (estado) => {
        return estado === 'ACTIVA' ? '✅' : '❌';
    };

    return (
        <div className="factura-detail">
            {}
            <div className="factura-detail__header">
                <div className="factura-detail__header-left">
                    <h2 className="factura-detail__title">
                        📋 Factura #{obtenerIdCorto(factura._id)}
                    </h2>
                    <div className="factura-detail__dates">
                        <div className="factura-detail__date">
                            <span className="factura-detail__date-label">📅 Fecha de emisión:</span>
                            <span className="factura-detail__date-value">
                                {formatearFecha(factura.fecha)}
                            </span>
                        </div>
                        {factura.fechaAnulacion && (
                            <div className="factura-detail__date">
                                <span className="factura-detail__date-label">❌ Fecha de anulación:</span>
                                <span className="factura-detail__date-value">
                                    {formatearFecha(factura.fechaAnulacion)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="factura-detail__header-right">
                    <div className="factura-detail__status">
                        <span 
                            className="factura-detail__status-badge"
                            style={{ 
                                backgroundColor: obtenerEstadoColor(factura.estado),
                                color: 'white'
                            }}
                        >
                            {obtenerEstadoIcono(factura.estado)} {factura.estado}
                        </span>
                    </div>
                    <div className="factura-detail__total">
                        <span className="factura-detail__total-label">Total:</span>
                        <span className="factura-detail__total-amount">
                            Q{(factura.total || 0).toFixed(2)}
                        </span>
                    </div>
                    <div className="factura-detail__actions">
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
                    </div>
                </div>
            </div>

            {}
            {factura.idUsuario && (
                <div className="factura-detail__cliente">
                    <h3 className="factura-detail__section-title">👤 Información del Cliente</h3>
                    <div className="factura-detail__cliente-grid">
                        <div className="factura-detail__cliente-item">
                            <span className="factura-detail__label">Nombre completo:</span>
                            <span className="factura-detail__value">
                                {factura.idUsuario.name} {factura.idUsuario.surname}
                            </span>
                        </div>
                        {factura.idUsuario.email && (
                            <div className="factura-detail__cliente-item">
                                <span className="factura-detail__label">Email:</span>
                                <span className="factura-detail__value">
                                    {factura.idUsuario.email}
                                </span>
                            </div>
                        )}
                        <div className="factura-detail__cliente-item">
                            <span className="factura-detail__label">ID Cliente:</span>
                            <span className="factura-detail__value">
                                {obtenerIdMedio(factura.idUsuario?._id)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {}
            {factura.estado === 'ANULADA' && (
                <div className="factura-detail__anulacion">
                    <h3 className="factura-detail__section-title">⚠️ Información de Anulación</h3>
                    <div className="factura-detail__anulacion-content">
                        <div className="factura-detail__anulacion-item">
                            <span className="factura-detail__label">Motivo:</span>
                            <span className="factura-detail__value">
                                {factura.motivoAnulacion || 'Sin motivo especificado'}
                            </span>
                        </div>
                        <div className="factura-detail__anulacion-item">
                            <span className="factura-detail__label">Fecha de anulación:</span>
                            <span className="factura-detail__value">
                                {formatearFecha(factura.fechaAnulacion)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {}
            <div className="factura-detail__productos">
                <h3 className="factura-detail__section-title">
                    📦 Productos ({factura.productos.length})
                </h3>
                <div className="factura-detail__productos-table">
                    <div className="factura-detail__table-header">
                        <div className="factura-detail__table-cell factura-detail__table-cell--icon">
                            🏷️
                        </div>
                        <div className="factura-detail__table-cell factura-detail__table-cell--product">
                            Producto
                        </div>
                        <div className="factura-detail__table-cell factura-detail__table-cell--quantity">
                            Cantidad
                        </div>
                        <div className="factura-detail__table-cell factura-detail__table-cell--price">
                            Precio Unit.
                        </div>
                        <div className="factura-detail__table-cell factura-detail__table-cell--subtotal">
                            Subtotal
                        </div>
                    </div>
                    
                    {(factura.productos || []).map((producto, index) => (
                        <div key={index} className="factura-detail__table-row">
                            <div className="factura-detail__table-cell factura-detail__table-cell--icon">
                                <ProductIcon 
                                    nombreProducto={producto?.nombreProducto || 'Producto'} 
                                    size="medium" 
                                />
                            </div>
                            <div className="factura-detail__table-cell factura-detail__table-cell--product">
                                <span className="factura-detail__product-name">
                                    {producto?.nombreProducto || 'Producto sin nombre'}
                                </span>
                                {producto?.idProducto && (
                                    <span className="factura-detail__product-id">
                                        ID: {obtenerIdMedio(producto.idProducto?.toString())}
                                    </span>
                                )}
                            </div>
                            <div className="factura-detail__table-cell factura-detail__table-cell--quantity">
                                <span className="factura-detail__quantity-badge">
                                    {producto?.cantidad || 0}
                                </span>
                            </div>
                            <div className="factura-detail__table-cell factura-detail__table-cell--price">
                                Q{(producto?.precioProducto || 0).toFixed(2)}
                            </div>
                            <div className="factura-detail__table-cell factura-detail__table-cell--subtotal">
                                <span className="factura-detail__subtotal">
                                    Q{calcularSubtotal(producto).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {}
            <div className="factura-detail__resumen">
                <div className="factura-detail__resumen-content">
                    <div className="factura-detail__resumen-row">
                        <span className="factura-detail__resumen-label">Subtotal:</span>
                        <span className="factura-detail__resumen-value">
                            Q{(factura.total || 0).toFixed(2)}
                        </span>
                    </div>
                    <div className="factura-detail__resumen-row factura-detail__resumen-row--total">
                        <span className="factura-detail__resumen-label">Total Final:</span>
                        <span className="factura-detail__resumen-value">
                            Q{(factura.total || 0).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {}
            <div className="factura-detail__footer">
                <div className="factura-detail__footer-info">
                    <div className="factura-detail__footer-item">
                        <span className="factura-detail__footer-label">🏢 Sistema:</span>
                        <span>Gestor de Inventario FC Comebacks</span>
                    </div>
                    <div className="factura-detail__footer-item">
                        <span className="factura-detail__footer-label">📄 Documento:</span>
                        <span>Factura #{obtenerIdCorto(factura._id)}</span>
                    </div>
                    <div className="factura-detail__footer-item">
                        <span className="factura-detail__footer-label">🕒 Generado:</span>
                        <span>{formatearFecha(factura.fecha)}</span>
                    </div>
                </div>
            </div>

            <style>{`
                .factura-detail {
                    max-width: 800px;
                    margin: 0 auto;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                .factura-detail__empty {
                    text-align: center;
                    padding: 3rem;
                    color: #6c757d;
                }

                .factura-detail__empty-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }

                .factura-detail__header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid #e9ecef;
                }

                .factura-detail__title {
                    margin: 0 0 1rem 0;
                    color: #2c3e50;
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                .factura-detail__dates {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .factura-detail__date {
                    font-size: 0.9rem;
                }

                .factura-detail__date-label {
                    color: #6c757d;
                    margin-right: 0.5rem;
                    font-weight: 500;
                }

                .factura-detail__date-value {
                    color: #2c3e50;
                    font-weight: 600;
                }

                .factura-detail__status {
                    margin-bottom: 1rem;
                }

                .factura-detail__status-badge {
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .factura-detail__total {
                    text-align: right;
                }

                .factura-detail__total-label {
                    display: block;
                    color: #6c757d;
                    font-size: 0.9rem;
                    margin-bottom: 0.25rem;
                }

                .factura-detail__total-amount {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #27ae60;
                }

                .factura-detail__actions {
                    margin-top: 1rem;
                    display: flex;
                    justify-content: flex-end;
                }

                .factura-detail__section-title {
                    color: #2c3e50;
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid #e9ecef;
                }

                .factura-detail__cliente {
                    background-color: #f8f9fa;
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                }

                .factura-detail__cliente-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1rem;
                }

                .factura-detail__cliente-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .factura-detail__label {
                    font-weight: 600;
                    color: #495057;
                    font-size: 0.9rem;
                }

                .factura-detail__value {
                    color: #2c3e50;
                    font-weight: 500;
                }

                .factura-detail__anulacion {
                    background-color: #fff5f5;
                    border: 1px solid #fed7d7;
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                }

                .factura-detail__anulacion-content {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1rem;
                }

                .factura-detail__anulacion-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .factura-detail__productos {
                    margin-bottom: 2rem;
                }

                .factura-detail__productos-table {
                    border: 1px solid #e9ecef;
                    border-radius: 12px;
                    overflow: hidden;
                    background-color: white;
                }

                .factura-detail__table-header {
                    display: grid;
                    grid-template-columns: 60px 1fr 100px 120px 120px;
                    background-color: #f8f9fa;
                    font-weight: 600;
                    color: #495057;
                    border-bottom: 2px solid #e9ecef;
                }

                .factura-detail__table-row {
                    display: grid;
                    grid-template-columns: 60px 1fr 100px 120px 120px;
                    border-bottom: 1px solid #e9ecef;
                    transition: background-color 0.2s;
                }

                .factura-detail__table-row:hover {
                    background-color: #f8f9fa;
                }

                .factura-detail__table-row:last-child {
                    border-bottom: none;
                }

                .factura-detail__table-cell {
                    padding: 1rem 0.75rem;
                    display: flex;
                    align-items: center;
                    font-size: 0.9rem;
                }

                .factura-detail__table-cell--icon {
                    justify-content: center;
                }

                .factura-detail__table-cell--product {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.25rem;
                }

                .factura-detail__table-cell--quantity {
                    justify-content: center;
                }

                .factura-detail__table-cell--price,
                .factura-detail__table-cell--subtotal {
                    justify-content: flex-end;
                    font-weight: 600;
                }

                .factura-detail__product-name {
                    font-weight: 500;
                    color: #2c3e50;
                }

                .factura-detail__product-id {
                    font-size: 0.75rem;
                    color: #6c757d;
                    font-family: monospace;
                }

                .factura-detail__quantity-badge {
                    background-color: #e9ecef;
                    padding: 0.25rem 0.5rem;
                    border-radius: 6px;
                    font-weight: 600;
                    color: #495057;
                }

                .factura-detail__subtotal {
                    color: #27ae60;
                    font-weight: 700;
                }

                .factura-detail__resumen {
                    background-color: #f8f9fa;
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                }

                .factura-detail__resumen-content {
                    max-width: 300px;
                    margin-left: auto;
                }

                .factura-detail__resumen-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;
                    padding: 0.5rem 0;
                }

                .factura-detail__resumen-row--total {
                    border-top: 2px solid #dee2e6;
                    margin-bottom: 0;
                    padding-top: 1rem;
                    font-size: 1.1rem;
                    font-weight: 700;
                }

                .factura-detail__resumen-label {
                    color: #495057;
                    font-weight: 500;
                }

                .factura-detail__resumen-value {
                    color: #27ae60;
                    font-weight: 600;
                }

                .factura-detail__resumen-row--total .factura-detail__resumen-value {
                    font-size: 1.3rem;
                    font-weight: 700;
                }

                .factura-detail__footer {
                    border-top: 1px solid #e9ecef;
                    padding-top: 1.5rem;
                    color: #6c757d;
                    font-size: 0.85rem;
                }

                .factura-detail__footer-info {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                }

                .factura-detail__footer-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .factura-detail__footer-label {
                    font-weight: 600;
                }

                @media (max-width: 768px) {
                    .factura-detail__header {
                        flex-direction: column;
                        gap: 1.5rem;
                    }

                    .factura-detail__header-right {
                        text-align: left;
                    }

                    .factura-detail__total {
                        text-align: left;
                    }

                    .factura-detail__table-header,
                    .factura-detail__table-row {
                        grid-template-columns: 1fr;
                        gap: 0.5rem;
                    }

                    .factura-detail__table-cell {
                        padding: 0.75rem;
                        border-bottom: 1px solid #f8f9fa;
                    }

                    .factura-detail__table-cell--icon {
                        display: none;
                    }

                    .factura-detail__table-cell--product {
                        order: 1;
                    }

                    .factura-detail__table-cell--quantity {
                        order: 2;
                        justify-content: flex-start;
                    }

                    .factura-detail__table-cell--price {
                        order: 3;
                        justify-content: flex-start;
                    }

                    .factura-detail__table-cell--subtotal {
                        order: 4;
                        justify-content: flex-start;
                    }

                    .factura-detail__resumen-content {
                        max-width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default FacturaDetail;