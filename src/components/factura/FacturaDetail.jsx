import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../LoadingSpinner';
import { obtenerFactura, descargarFacturaPDF, anularFactura } from '../../services/api';
import { Modal } from '../ui/Modal';
import './FacturaDetail.css';

export const FacturaDetail = ({ facturaId, onClose, onUpdate, userRole }) => {
    const [factura, setFactura] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAnularModal, setShowAnularModal] = useState(false);
    const [motivo, setMotivo] = useState('');
    const [processingAction, setProcessingAction] = useState(false);

    useEffect(() => {
        cargarFactura();
    }, [facturaId]); // eslint-disable-line react-hooks/exhaustive-deps

    const cargarFactura = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await obtenerFactura(facturaId);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al cargar factura');
            }

            setFactura(response.data.factura);
        } catch (error) {
            console.error('Error al cargar factura:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDescargarPDF = async () => {
        setProcessingAction(true);
        try {
            const response = await descargarFacturaPDF(facturaId);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al descargar PDF');
            }

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Factura_${facturaId.slice(-8).toUpperCase()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al descargar PDF:', error);
            alert(error.message || 'Error al descargar el PDF');
        } finally {
            setProcessingAction(false);
        }
    };

    const handleAnularFactura = async () => {
        if (!motivo.trim()) {
            alert('Por favor ingresa un motivo para la anulación');
            return;
        }

        setProcessingAction(true);
        try {
            const response = await anularFactura(facturaId, motivo);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al anular factura');
            }

            alert('Factura anulada exitosamente');
            setShowAnularModal(false);
            setMotivo('');
            await cargarFactura();
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error al anular factura:', error);
            alert(error.message || 'Error al anular la factura');
        } finally {
            setProcessingAction(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-GT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(amount);
    };

    const getEstadoClass = (estado) => {
        return estado === 'ACTIVA' ? 'estado-activa' : 'estado-anulada';
    };

    if (loading) {
        return (
            <div className="factura-detail-loading">
                <LoadingSpinner />
                <p>Cargando detalles de la factura...</p>
            </div>
        );
    }

    if (error || !factura) {
        return (
            <div className="factura-detail-error">
                <h3>Error al cargar la factura</h3>
                <p>{error || 'Factura no encontrada'}</p>
                <div className="error-actions">
                    <Button onClick={cargarFactura}>
                        🔄 Reintentar
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        ← Volver
                    </Button>
                </div>
            </div>
        );
    }

    const nombreCliente = factura.idUsuario 
        ? `${factura.idUsuario.name} ${factura.idUsuario.surname}`
        : 'Cliente no disponible';

    const emailCliente = factura.idUsuario?.email || 'No disponible';

    return (
        <>
            <div className="factura-detail-container">
                <Card className="factura-detail-card">
                    <div className="factura-detail-header">
                        <div className="header-left">
                            <h2>Factura #{factura._id.slice(-8).toUpperCase()}</h2>
                            <span className={`factura-estado ${getEstadoClass(factura.estado)}`}>
                                {factura.estado}
                            </span>
                        </div>
                        <div className="header-right">
                            <Button variant="outline" onClick={onClose}>
                                ← Volver
                            </Button>
                        </div>
                    </div>

                    <div className="factura-detail-content">
                        <div className="factura-info-grid">
                            <div className="info-section">
                                <h3>📋 Información General</h3>
                                <div className="info-item">
                                    <label>Fecha de Emisión:</label>
                                    <span>{formatDate(factura.fecha)}</span>
                                </div>
                                <div className="info-item">
                                    <label>Total:</label>
                                    <span className="total-amount">{formatCurrency(factura.total)}</span>
                                </div>
                                <div className="info-item">
                                    <label>Estado:</label>
                                    <span className={`estado-badge ${getEstadoClass(factura.estado)}`}>
                                        {factura.estado}
                                    </span>
                                </div>
                            </div>

                            <div className="info-section">
                                <h3>👤 Información del Cliente</h3>
                                <div className="info-item">
                                    <label>Nombre:</label>
                                    <span>{nombreCliente}</span>
                                </div>
                                <div className="info-item">
                                    <label>Email:</label>
                                    <span>{emailCliente}</span>
                                </div>
                                <div className="info-item">
                                    <label>ID Cliente:</label>
                                    <span>{factura.idUsuario?._id.slice(-6).toUpperCase() || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {factura.estado === 'ANULADA' && (
                            <div className="anulacion-info">
                                <h3>❌ Información de Anulación</h3>
                                <div className="info-item">
                                    <label>Fecha de Anulación:</label>
                                    <span>{formatDate(factura.fechaAnulacion)}</span>
                                </div>
                                <div className="info-item">
                                    <label>Motivo:</label>
                                    <span>{factura.motivoAnulacion}</span>
                                </div>
                            </div>
                        )}

                        <div className="productos-section">
                            <h3>🛍️ Productos ({factura.productos.length})</h3>
                            <div className="productos-table">
                                <div className="table-header">
                                    <div className="col-producto">Producto</div>
                                    <div className="col-precio">Precio Unit.</div>
                                    <div className="col-cantidad">Cantidad</div>
                                    <div className="col-subtotal">Subtotal</div>
                                </div>
                                <div className="table-body">
                                    {factura.productos.map((producto, index) => (
                                        <div key={index} className="table-row">
                                            <div className="col-producto">
                                                <div className="producto-nombre">
                                                    {producto.nombreProducto}
                                                </div>
                                                <div className="producto-id">
                                                    ID: {producto.idProducto}
                                                </div>
                                            </div>
                                            <div className="col-precio">
                                                {formatCurrency(producto.precioProducto)}
                                            </div>
                                            <div className="col-cantidad">
                                                {producto.cantidad}
                                            </div>
                                            <div className="col-subtotal">
                                                {formatCurrency(producto.precioProducto * producto.cantidad)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="table-footer">
                                    <div className="total-row">
                                        <div className="total-label">Total General:</div>
                                        <div className="total-value">{formatCurrency(factura.total)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="factura-actions">
                            <Button 
                                variant="primary" 
                                onClick={handleDescargarPDF}
                                disabled={processingAction}
                            >
                                📄 Descargar PDF
                            </Button>
                            
                            {factura.estado === 'ACTIVA' && (userRole === 'ADMIN_ROLE' || userRole === 'USER_ROLE') && (
                                <Button 
                                    variant="danger" 
                                    onClick={() => setShowAnularModal(true)}
                                    disabled={processingAction}
                                >
                                    ❌ Anular Factura
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {showAnularModal && (
                <Modal
                    title="Anular Factura"
                    onClose={() => setShowAnularModal(false)}
                >
                    <div className="anular-modal-content">
                        <p>¿Estás seguro de que deseas anular esta factura?</p>
                        <div className="factura-summary">
                            <p><strong>Factura:</strong> #{factura._id.slice(-8).toUpperCase()}</p>
                            <p><strong>Cliente:</strong> {nombreCliente}</p>
                            <p><strong>Total:</strong> {formatCurrency(factura.total)}</p>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="motivo">Motivo de anulación:</label>
                            <textarea
                                id="motivo"
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                placeholder="Ingresa el motivo de la anulación"
                                rows={4}
                                required
                            />
                        </div>

                        <div className="modal-actions">
                            <Button 
                                variant="outline" 
                                onClick={() => setShowAnularModal(false)}
                                disabled={processingAction}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                variant="danger" 
                                onClick={handleAnularFactura}
                                disabled={processingAction || !motivo.trim()}
                            >
                                {processingAction ? 'Anulando...' : 'Anular Factura'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};