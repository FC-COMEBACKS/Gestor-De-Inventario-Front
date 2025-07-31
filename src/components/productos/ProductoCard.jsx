import React from 'react';
import { Card, Button } from '../ui';
import { EditButton, DeleteButton } from '../index';
import { useAuth } from '../../shared/hooks';

const ProductoCard = ({ 
    producto, 
    onEdit, 
    onDelete, 
    onView,
    onAddToCart 
}) => {
    const { user } = useAuth();
    const isAdmin = user?.userDetails?.role === 'ADMIN_ROLE';

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(price);
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { text: 'Agotado', color: 'bg-red-100 text-red-800' };
        if (stock <= 5) return { text: 'Stock Bajo', color: 'bg-yellow-100 text-yellow-800' };
        return { text: 'Disponible', color: 'bg-green-100 text-green-800' };
    };

    const stockStatus = getStockStatus(producto.stock);

    return (
        <Card className="h-full flex flex-col">
            <div className="flex-1">
                {}
                <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {producto.categoria?.nombre || 'Sin categoría'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${stockStatus.color}`}>
                        {stockStatus.text}
                    </span>
                </div>

                {}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {producto.nombreProducto}
                </h3>

                {}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {producto.descripcionProducto}
                </p>

                {}
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Precio:</span>
                        <span className="font-semibold text-lg text-green-600">
                            {formatPrice(producto.precioProducto)}
                        </span>
                    </div>
                    
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Stock:</span>
                        <span className={`font-medium ${
                            producto.stock === 0 ? 'text-red-600' : 
                            producto.stock <= 5 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                            {producto.stock} unidades
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Vendidos:</span>
                        <span className="text-gray-700">{producto.vendidos || 0}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Proveedor:</span>
                        <span className="text-gray-700 text-sm truncate max-w-32" title={producto.proveedor}>
                            {producto.proveedor}
                        </span>
                    </div>
                </div>
            </div>

            {}
            <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-col space-y-2">
                    {}
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onView && onView(producto)}
                            className="flex-1"
                        >
                            Ver Detalles
                        </Button>
                        
                        {!isAdmin && producto.stock > 0 && (
                            <Button
                                size="sm"
                                onClick={() => onAddToCart && onAddToCart(producto)}
                                className="flex-1"
                            >
                                Agregar al Carrito
                            </Button>
                        )}
                    </div>

                    {}
                    {isAdmin && (
                        <div className="flex space-x-2">
                            <EditButton
                                onClick={() => onEdit && onEdit(producto)}
                                size="sm"
                                className="flex-1"
                            >
                                Editar
                            </EditButton>
                            <DeleteButton
                                onClick={() => onDelete && onDelete(producto)}
                                size="sm"
                                className="flex-1"
                            >
                                Eliminar
                            </DeleteButton>
                        </div>
                    )}
                </div>
            </div>

            {}
            <div className="text-xs text-gray-400 mt-2 text-center">
                {producto.updatedAt && (
                    `Actualizado: ${new Date(producto.updatedAt).toLocaleDateString()}`
                )}
            </div>
        </Card>
    );
};

export default ProductoCard;