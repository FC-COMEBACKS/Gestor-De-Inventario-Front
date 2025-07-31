import React from 'react';
import { Modal } from '../ui';
import ProductoForm from './ProductoForm';

const ProductoModal = ({ 
    isOpen, 
    onClose, 
    producto = null, 
    onSubmit, 
    loading = false,
    mode = 'create' 
}) => {
    const getTitle = () => {
        switch (mode) {
            case 'edit': return 'Editar Producto';
            case 'view': return 'Detalles del Producto';
            default: return 'Nuevo Producto';
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(price);
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { text: 'Agotado', color: 'text-red-600 bg-red-100' };
        if (stock <= 5) return { text: 'Stock Bajo', color: 'text-yellow-600 bg-yellow-100' };
        return { text: 'Disponible', color: 'text-green-600 bg-green-100' };
    };

    if (mode === 'view' && producto) {
        const stockStatus = getStockStatus(producto.stock);
        
        return (
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={getTitle()}
                size="lg"
            >
                <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                                {producto.nombreProducto}
                            </h3>
                            <p className="text-sm text-gray-600">
                                ID: {producto.uid || producto._id}
                            </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
                            {stockStatus.text}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                                    {producto.descripcionProducto}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Categoría
                                </label>
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    {producto.categoria?.nombre || 'Sin categoría'}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Proveedor
                                </label>
                                <p className="text-gray-900">{producto.proveedor}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {formatPrice(producto.precioProducto)}
                                    </div>
                                    <div className="text-sm text-blue-600">Precio</div>
                                </div>

                                <div className={`p-4 rounded-lg text-center ${
                                    producto.stock === 0 ? 'bg-red-50' : 
                                    producto.stock <= 5 ? 'bg-yellow-50' : 'bg-green-50'
                                }`}>
                                    <div className={`text-2xl font-bold ${
                                        producto.stock === 0 ? 'text-red-600' : 
                                        producto.stock <= 5 ? 'text-yellow-600' : 'text-green-600'
                                    }`}>
                                        {producto.stock}
                                    </div>
                                    <div className={`text-sm ${
                                        producto.stock === 0 ? 'text-red-600' : 
                                        producto.stock <= 5 ? 'text-yellow-600' : 'text-green-600'
                                    }`}>
                                        Unidades
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600">Vendidos:</span>
                                    <span className="font-medium">{producto.vendidos || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Valor en Stock:</span>
                                    <span className="font-medium text-green-600">
                                        {formatPrice(producto.precioProducto * producto.stock)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                                <span className="font-medium">Creado:</span>
                                {producto.createdAt && (
                                    <span className="ml-2">
                                        {new Date(producto.createdAt).toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <span className="font-medium">Actualizado:</span>
                                {producto.updatedAt && (
                                    <span className="ml-2">
                                        {new Date(producto.updatedAt).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={getTitle()}
            size="lg"
        >
            <ProductoForm
                producto={producto}
                onSubmit={onSubmit}
                onCancel={onClose}
                loading={loading}
                mode={mode}
            />
        </Modal>
    );
};

export default ProductoModal;