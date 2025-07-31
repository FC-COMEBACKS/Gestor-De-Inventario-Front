import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useFacturas } from '../../shared/hooks/useFacturas';
import './CompraResumen.css';

export const CompraResumen = ({ productos, total, onCompraExitosa, onError }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const { procesarCompraCarrito, loading, formatearMoneda } = useFacturas();

    const handleProcesarCompra = async () => {
        try {
            const resultado = await procesarCompraCarrito();
            
            if (resultado.success) {
                setShowConfirmModal(false);
                
                // Mostrar mensaje de éxito personalizado
                const mensaje = `¡Compra procesada exitosamente!\n\n` +
                    `Factura: #${resultado.factura.id.slice(-8).toUpperCase()}\n` +
                    `Total: ${formatearMoneda(resultado.factura.total)}\n` +
                    `Productos vendidos: ${resultado.totalProductosVendidos}`;
                
                alert(mensaje);
                
                if (onCompraExitosa) {
                    onCompraExitosa(resultado);
                }
            }
        } catch (error) {
            console.error('Error al procesar compra:', error);
            if (onError) {
                onError(error.message);
            } else {
                alert(error.message || 'Error al procesar la compra');
            }
        }
    };

    const calcularImpuestos = (subtotal) => {
        return subtotal * 0.12; // IVA 12%
    };

    const subtotal = total;
    const impuestos = calcularImpuestos(subtotal);
    const totalConImpuestos = subtotal + impuestos;

    if (!productos || productos.length === 0) {
        return null;
    }

    return (
        <>
            <Card className="compra-resumen-card">
                <div className="resumen-header">
                    <h3>📋 Resumen de Compra</h3>
                </div>

                <div className="resumen-content">
                    <div className="productos-resumen">
                        <h4>Productos ({productos.length})</h4>
                        <div className="productos-lista">
                            {productos.map((producto, index) => (
                                <div key={index} className="producto-resumen-item">
                                    <div className="producto-info">
                                        <span className="producto-nombre">
                                            {producto.nombreProducto || producto.idProducto?.nombreProducto}
                                        </span>
                                        <span className="producto-cantidad">
                                            x{producto.cantidad}
                                        </span>
                                    </div>
                                    <div className="producto-precio">
                                        {formatearMoneda(producto.precioProducto * producto.cantidad)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="totales-section">
                        <div className="total-line">
                            <span>Subtotal:</span>
                            <span>{formatearMoneda(subtotal)}</span>
                        </div>
                        <div className="total-line">
                            <span>IVA (12%):</span>
                            <span>{formatearMoneda(impuestos)}</span>
                        </div>
                        <div className="total-line total-final">
                            <span>Total a Pagar:</span>
                            <span>{formatearMoneda(totalConImpuestos)}</span>
                        </div>
                    </div>

                    <div className="compra-actions">
                        <Button 
                            variant="primary"
                            size="large"
                            onClick={() => setShowConfirmModal(true)}
                            disabled={loading}
                            className="btn-procesar-compra"
                        >
                            🛒 Procesar Compra
                        </Button>
                    </div>
                </div>
            </Card>

            {showConfirmModal && (
                <Modal
                    title="Confirmar Compra"
                    onClose={() => setShowConfirmModal(false)}
                >
                    <div className="confirm-modal-content">
                        <div className="confirmacion-icon">
                            🛒
                        </div>
                        
                        <h3>¿Confirmar procesamiento de compra?</h3>
                        
                        <div className="confirmacion-detalles">
                            <div className="detalle-item">
                                <span>Productos:</span>
                                <span>{productos.length} artículos</span>
                            </div>
                            <div className="detalle-item">
                                <span>Subtotal:</span>
                                <span>{formatearMoneda(subtotal)}</span>
                            </div>
                            <div className="detalle-item">
                                <span>IVA:</span>
                                <span>{formatearMoneda(impuestos)}</span>
                            </div>
                            <div className="detalle-item total-confirmacion">
                                <span>Total:</span>
                                <span>{formatearMoneda(totalConImpuestos)}</span>
                            </div>
                        </div>

                        <div className="confirmacion-nota">
                            <p>
                                ⚠️ <strong>Nota:</strong> Una vez procesada la compra, se generará 
                                una factura y se actualizará el inventario. Esta acción no se puede deshacer.
                            </p>
                        </div>

                        <div className="modal-actions">
                            <Button 
                                variant="outline" 
                                onClick={() => setShowConfirmModal(false)}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                variant="primary" 
                                onClick={handleProcesarCompra}
                                disabled={loading}
                            >
                                {loading ? '⏳ Procesando...' : '✅ Confirmar Compra'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};
