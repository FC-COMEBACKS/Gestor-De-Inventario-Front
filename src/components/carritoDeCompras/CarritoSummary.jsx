import React from 'react';
import { Button } from '../ui';

const CarritoSummary = ({ 
    items = [], 
    onCheckout,
    loading = false 
}) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(price);
    };

    const calcularSubtotal = () => {
        return items.reduce((sum, item) => sum + (item.cantidad * item.precioProducto), 0);
    };

    const subtotal = calcularSubtotal();
    const impuestos = subtotal * 0.12;
    const total = subtotal + impuestos;
    const cantidadProductos = items.reduce((sum, item) => sum + item.cantidad, 0);

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Resumen del Pedido</h5>
                
                <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                        <span>Productos ({cantidadProductos}):</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span>IVA (12%):</span>
                        <span>{formatPrice(impuestos)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                        <span>Total:</span>
                        <span className="text-success">{formatPrice(total)}</span>
                    </div>
                </div>

                <div className="d-grid gap-2">
                    <Button
                        variant="success"
                        size="lg"
                        onClick={onCheckout}
                        disabled={loading || items.length === 0}
                        className="w-100"
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin me-2"></i>
                                Procesando Compra...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-credit-card me-2"></i>
                                Generar Factura
                            </>
                        )}
                    </Button>
                    
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => window.history.back()}
                        className="w-100"
                        disabled={loading}
                    >
                        <i className="fas fa-arrow-left me-2"></i>
                        Continuar Comprando
                    </Button>
                    
                    <div className="mt-3 text-center">
                        <small className="text-muted">
                            <i className="fas fa-shield-alt me-1"></i>
                            Compra 100% segura
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarritoSummary;