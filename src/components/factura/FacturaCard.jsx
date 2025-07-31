import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { anularFactura, descargarFacturaPDF } from '../../services/api';
import './FacturaCard.css';

export const FacturaCard = ({ factura, onUpdate, userRole }) => {
    const [showAnularModal, setShowAnularModal] = useState(false);
    const [motivo, setMotivo] = useState('');
    const [loading, setLoading] = useState(false);

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

    const handleAnularFactura = async () => {
        if (!motivo.trim()) {
            alert('Por favor ingresa un motivo para la anulación');
            return;
        }

        setLoading(true);
        try {
            const response = await anularFactura(factura._id, motivo);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al anular factura');
            }

            alert('Factura anulada exitosamente');
            setShowAnularModal(false);
            setMotivo('');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error al anular factura:', error);
            alert(error.message || 'Error al anular la factura');
        } finally {
            setLoading(false);
        }
    };

    const handleDescargarPDF = async () => {
        setLoading(true);
        try {
            const response = await descargarFacturaPDF(factura._id);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al descargar PDF');
            }

            // Crear un blob con la respuesta y descargarlo
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Factura_${factura._id.slice(-8).toUpperCase()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al descargar PDF:', error);
            alert(error.message || 'Error al descargar el PDF');
        } finally {
            setLoading(false);
        }
    };

    const getEstadoClass = (estado) => {
        return estado === 'ACTIVA' ? 'estado-activa' : 'estado-anulada';
    };

    const nombreCliente = factura.idUsuario 
        ? `${factura.idUsuario.name} ${factura.idUsuario.surname}`
        : 'Cliente no disponible';

    return (
        <>
            <Card className="factura-card">
                <div className="factura-header">
                    <div className="factura-info">
                        <h3 className="factura-numero">
                            Factura #{factura._id.slice(-8).toUpperCase()}
                        </h3>
                        <span className={`factura-estado ${getEstadoClass(factura.estado)}`}>
                            {factura.estado}
                        </span>
                    </div>
                    <div className="factura-fecha">
                        {formatDate(factura.fecha)}
                    </div>
                </div>

                <div className="factura-body">
                    <div className="factura-cliente">
                        <strong>Cliente:</strong> {nombreCliente}
                    </div>
                    
                    <div className="factura-productos">
                        <strong>Productos ({factura.productos.length}):</strong>
                        <div className="productos-list">
                            {factura.productos.slice(0, 3).map((producto, index) => (
                                <div key={index} className="producto-item">
                                    <span className="producto-nombre">
                                        {producto.nombreProducto}
                                    </span>
                                    <span className="producto-cantidad">
                                        x{producto.cantidad}
                                    </span>
                                    <span className="producto-precio">
                                        {formatCurrency(producto.precioProducto)}
                                    </span>
                                </div>
                            ))}
                            {factura.productos.length > 3 && (
                                <div className="mas-productos">
                                    ... y {factura.productos.length - 3} más
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="factura-total">
                        <strong>Total: {formatCurrency(factura.total)}</strong>
                    </div>

                    {factura.estado === 'ANULADA' && (
                        <div className="factura-anulacion">
                            <div className="anulacion-fecha">
                                <strong>Anulada:</strong> {formatDate(factura.fechaAnulacion)}
                            </div>
                            <div className="anulacion-motivo">
                                <strong>Motivo:</strong> {factura.motivoAnulacion}
                            </div>
                        </div>
                    )}
                </div>

                <div className="factura-actions">
                    <Button 
                        variant="outline" 
                        onClick={handleDescargarPDF}
                        disabled={loading}
                    >
                        📄 Descargar PDF
                    </Button>
                    
                    {factura.estado === 'ACTIVA' && (userRole === 'ADMIN_ROLE' || userRole === 'USER_ROLE') && (
                        <Button 
                            variant="danger" 
                            onClick={() => setShowAnularModal(true)}
                            disabled={loading}
                        >
                            ❌ Anular
                        </Button>
                    )}
                </div>
            </Card>

            {showAnularModal && (
                <Modal
                    title="Anular Factura"
                    onClose={() => setShowAnularModal(false)}
                >
                    <div className="anular-modal-content">
                        <p>¿Estás seguro de que deseas anular esta factura?</p>
                        <p><strong>Factura:</strong> #{factura._id.slice(-8).toUpperCase()}</p>
                        <p><strong>Total:</strong> {formatCurrency(factura.total)}</p>
                        
                        <div className="form-group">
                            <label htmlFor="motivo">Motivo de anulación:</label>
                            <textarea
                                id="motivo"
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                placeholder="Ingresa el motivo de la anulación"
                                rows={3}
                                required
                            />
                        </div>

                        <div className="modal-actions">
                            <Button 
                                variant="outline" 
                                onClick={() => setShowAnularModal(false)}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                variant="danger" 
                                onClick={handleAnularFactura}
                                disabled={loading || !motivo.trim()}
                            >
                                {loading ? 'Anulando...' : 'Anular Factura'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};