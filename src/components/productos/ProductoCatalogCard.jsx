import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui';
import { ProductIcon } from '../ui';
import { useCarritoDeCompras } from '../../shared/hooks';

const ProductoCatalogCard = ({ producto }) => {
    const navigate = useNavigate();
    const { agregarProducto } = useCarritoDeCompras();
    const [agregandoCarrito, setAgregandoCarrito] = useState(false);
    const [agregadoExitosamente, setAgregadoExitosamente] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(price);
    };

    const getStockBadge = (stock) => {
        if (stock === 0) {
            return <span className="badge bg-danger">Agotado</span>;
        } else if (stock <= 5) {
            return <span className="badge bg-warning">Últimas {stock} unidades</span>;
        } else {
            return <span className="badge bg-success">Disponible</span>;
        }
    };

    const handleViewDetails = () => {
        navigate(`/productos/${producto.uid || producto._id}`);
    };

    const handleAddToCart = async () => {
        if (producto.stock === 0) return;
        
        setAgregandoCarrito(true);
        setAgregadoExitosamente(false);
        try {
            const productoId = producto.uid || producto._id;
            console.log('Agregando producto al carrito:', { productoId, cantidad: 1 });
            
            const success = await agregarProducto(productoId, 1);
            if (success) {
                console.log('✅ Producto agregado al carrito exitosamente');
                setAgregadoExitosamente(true);
                setTimeout(() => setAgregadoExitosamente(false), 2000);
            } else {
                alert('No se pudo agregar el producto al carrito');
            }
        } catch (error) {
            console.error('Error al agregar producto:', error);
            alert('Error al agregar producto al carrito');
        } finally {
            setAgregandoCarrito(false);
        }
    };

    return (
        <div className="card h-100 shadow-sm producto-catalog-card">
            <div className="card-img-top d-flex align-items-center justify-content-center bg-light" 
                 style={{ height: '200px' }}>
                <ProductIcon 
                    nombreProducto={producto.nombreProducto}
                    size="4rem"
                    colored={true}
                />
            </div>
            
            <div className="card-body d-flex flex-column">
                <h5 className="card-title text-truncate" title={producto.nombreProducto}>
                    {producto.nombreProducto}
                </h5>
                
                <p className="text-muted small mb-2">
                    🏷️ {producto.categoria?.nombre || 'Sin categoría'}
                </p>
                
                <p className="card-text text-muted small" 
                   style={{ 
                       overflow: 'hidden', 
                       display: '-webkit-box', 
                       WebkitLineClamp: 3, 
                       WebkitBoxOrient: 'vertical' 
                   }}>
                    {producto.descripcionProducto || 'Sin descripción disponible'}
                </p>
                
                <div className="mb-2">
                    {getStockBadge(producto.stock)}
                </div>
                
                <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-success mb-0">
                            {formatPrice(producto.precioProducto)}
                        </h4>
                        <small className="text-muted">
                            Stock: {producto.stock}
                        </small>
                    </div>
                    

                    <div className="d-grid gap-2">
                        <Button
                            variant={agregadoExitosamente ? "success" : "primary"}
                            onClick={handleAddToCart}
                            disabled={producto.stock === 0 || agregandoCarrito}
                            size="sm"
                        >
                            {agregandoCarrito ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Agregando...
                                </>
                            ) : agregadoExitosamente ? (
                                <>
                                    <i className="fas fa-check me-2"></i>
                                    ¡Agregado!
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-cart-plus me-2"></i>
                                    {producto.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                                </>
                            )}
                        </Button>
                        
                        <Button
                            variant="outline-secondary"
                            onClick={handleViewDetails}
                            size="sm"
                        >
                            <i className="fas fa-eye me-2"></i>
                            Ver Detalles
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductoCatalogCard;