import React from 'react';
import { DeleteButton } from '../index';

const CarritoItem = ({ item, onEliminar, loading }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(price);
    };

    const calcularSubtotal = () => {
        return item.cantidad * item.precioProducto;
    };

    if (!item) return null;

    return (
        <div className="card mb-3">
            <div className="card-body">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <h5 className="card-title mb-1">{item.nombreProducto}</h5>
                        <p className="text-muted mb-0">
                            Precio unitario: {formatPrice(item.precioProducto)}
                        </p>
                    </div>
                    <div className="col-md-2 text-center">
                        <span className="badge bg-primary fs-6">
                            Cantidad: {item.cantidad}
                        </span>
                    </div>
                    <div className="col-md-2 text-center">
                        <strong className="text-success fs-5">
                            {formatPrice(calcularSubtotal())}
                        </strong>
                    </div>
                    <div className="col-md-2 text-end">
                        <DeleteButton
                            onClick={() => {
                                console.log('=== INICIO DEBUG ELIMINACIÓN ===');
                                console.log('🗑️ CarritoItem - Item completo:', JSON.stringify(item, null, 2));
                                console.log('🗑️ CarritoItem - item._id (ID del item en carrito):', item._id);
                                console.log('🗑️ CarritoItem - item.idProducto (objeto producto):', item.idProducto);
                                console.log('🗑️ CarritoItem - item.idProducto.uid (ID del producto):', item.idProducto?.uid);
                                console.log('🗑️ CarritoItem - item.idProducto._id (ID del producto):', item.idProducto?._id);
                                
                                let idParaEliminar;
                                
                                if (typeof item.idProducto === 'object') {
                                    idParaEliminar = item.idProducto.uid || item.idProducto._id;
                                } else if (typeof item.idProducto === 'string') {
                                    idParaEliminar = item.idProducto;
                                }
                                
                                console.log('🎯 CarritoItem - ID FINAL para eliminar (idProducto):', idParaEliminar);
                                console.log('🎯 CarritoItem - Tipo del ID:', typeof idParaEliminar);
                                console.log('🎯 CarritoItem - ¿Es válido?:', !!idParaEliminar);
                                
                                if (!idParaEliminar) {
                                    console.error('❌ CarritoItem - ERROR: No se encontró ID del producto');
                                    alert('Error: No se pudo obtener el ID del producto');
                                    return;
                                }
                                
                                const confirmar = window.confirm(
                                    `¿Eliminar "${item.nombreProducto}" del carrito?\n\n` +
                                    `ID del producto: ${idParaEliminar}\n` +
                                    `Cantidad: ${item.cantidad}\n` +
                                    `Precio: Q${item.precioProducto}\n\n` +
                                    `NOTA: Se usará el ID del producto original, no el ID del item del carrito`
                                );
                                
                                if (!confirmar) {
                                    console.log('❌ Usuario canceló eliminación');
                                    return;
                                }
                                
                                console.log('🔄 CarritoItem - Llamando onEliminar...');
                                console.log('=== FIN DEBUG ELIMINACIÓN ===');
                                onEliminar(idParaEliminar);
                            }}
                            disabled={loading}
                            size="sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarritoItem;