import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarritoList, CarritoSummary } from '../../components/carritoDeCompras';
import { useCarritoDeCompras, useFacturas } from '../../shared/hooks';
import { navigateToDashboard } from '../../shared/utils';

const CarritoPage = () => {
    const navigate = useNavigate();
    const {
        carrito,
        loading,
        error,
        obtenerCarrito,
        eliminarProducto,
        clearError
    } = useCarritoDeCompras();

    const {
        procesarCompraCarrito,
        loading: _loadingFactura
    } = useFacturas();

    useEffect(() => {
        obtenerCarrito();
    }, [obtenerCarrito]);

    const handleEliminarProducto = async (idProducto) => {
        console.log('🗑️ CarritoPage - Eliminando producto:', idProducto);
        console.log('🗑️ CarritoPage - Tipo de idProducto:', typeof idProducto);
        
        if (!idProducto) {
            alert('Error: ID de producto no válido');
            return;
        }
        
        console.log('✅ CarritoPage - Iniciando eliminación...');
        const success = await eliminarProducto(idProducto);
        
        if (success) {
            console.log('✅ CarritoPage - Producto eliminado exitosamente');
        } else {
            console.error('❌ CarritoPage - Error al eliminar producto');
            console.error('❌ Error actual:', error);
            if (error && error.includes('no encontrado')) {
                console.log('🔄 CarritoPage - Producto no encontrado, sincronizando carrito...');
                await obtenerCarrito();
                alert('El carrito se ha sincronizado. Por favor, intenta eliminar el producto nuevamente.');
            } else {
                alert(`Error al eliminar el producto: ${error || 'Error desconocido'}`);
            }
        }
    };

    const handleCheckout = async () => {
        try {
            const resultado = await procesarCompraCarrito();
            
            if (resultado.success) {
                await obtenerCarrito();
                setTimeout(() => {
                    navigate('/facturas');
                }, 2000);
            }
        } catch (err) {
            console.error('❌ Error al procesar compra:', err);
        }
    };

    if (error && !error.includes('no encontrado')) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error</h4>
                    <p>{error}</p>
                    <hr />
                    <button 
                        className="btn btn-outline-danger"
                        onClick={clearError}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>
                            <i className="fas fa-shopping-cart me-2"></i>
                            Mi Carrito de Compras
                        </h2>
                        <div className="d-flex gap-2">
                            <button 
                                className="btn btn-outline-info"
                                onClick={() => {
                                    console.log('🔄 Sincronizando carrito...');
                                    obtenerCarrito();
                                }}
                                disabled={loading}
                                title="Sincronizar carrito con el servidor"
                            >
                                <i className="fas fa-sync-alt me-2"></i>
                                Sincronizar
                            </button>
                            <button 
                                className="btn btn-outline-primary"
                                onClick={() => navigate('/catalogo')}
                            >
                                <i className="fas fa-arrow-left me-2"></i>
                                Continuar Comprando
                            </button>
                            <button 
                                className="btn btn-outline-secondary"
                                onClick={() => navigateToDashboard(navigate)}
                            >
                                <i className="fas fa-home me-2"></i>
                                Menú Principal
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <CarritoList
                        items={carrito}
                        onEliminar={handleEliminarProducto}
                        loading={loading}
                    />
                </div>
                
                <div className="col-lg-4">
                    <div className="sticky-top" style={{ top: '20px' }}>
                        <CarritoSummary
                            items={carrito}
                            onCheckout={handleCheckout}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarritoPage;