import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui';
import { useProductos } from '../../shared/hooks';
import { useAuth } from '../../shared/hooks';
import { EditButton, DeleteButton } from '../../components';

const ProductoDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { 
        producto,
        loading,
        error,
        obtenerProducto,
        borrarProducto
    } = useProductos();

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const isAdmin = user?.userDetails?.role === 'ADMIN_ROLE';

    useEffect(() => {
        if (id) {
            obtenerProducto(id);
        }
    }, [id, obtenerProducto]);

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

    const handleEdit = () => {
        navigate(`/productos/edit/${id}`);
    };

    const handleDelete = async () => {
        if (showDeleteConfirm) {
            const success = await borrarProducto(id);
            if (success) {
                navigate('/productos');
            }
        } else {
            setShowDeleteConfirm(true);
        }
    };

    const handleBack = () => {
        navigate('/productos');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-red-800">
                        <strong>Error:</strong> {error}
                    </div>
                </div>
                <Button onClick={handleBack} className="mt-4">
                    Volver a Productos
                </Button>
            </div>
        );
    }

    if (!producto) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
                    <p className="text-gray-600 mb-4">El producto que buscas no existe o ha sido eliminado.</p>
                    <Button onClick={handleBack}>
                        Volver a Productos
                    </Button>
                </div>
            </div>
        );
    }

    const stockStatus = getStockStatus(producto.stock);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {}
            <div className="flex justify-between items-start">
                <div>
                    <Button 
                        variant="outline" 
                        onClick={handleBack}
                        className="mb-4"
                    >
                        ← Volver a Productos
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">{producto.nombreProducto}</h1>
                    <p className="text-gray-600">ID: {producto.uid || producto._id}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
                        {stockStatus.text}
                    </span>
                    {isAdmin && (
                        <div className="flex space-x-2">
                            <EditButton onClick={handleEdit}>
                                Editar
                            </EditButton>
                            <DeleteButton 
                                onClick={handleDelete}
                                className={showDeleteConfirm ? 'bg-red-600 text-white' : ''}
                            >
                                {showDeleteConfirm ? 'Confirmar Eliminación' : 'Eliminar'}
                            </DeleteButton>
                        </div>
                    )}
                </div>
            </div>

            {}
            {showDeleteConfirm && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <div className="text-red-800">
                            <strong>¿Estás seguro?</strong> Esta acción no se puede deshacer.
                        </div>
                        <div className="space-x-2">
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                variant="danger" 
                                size="sm"
                                onClick={handleDelete}
                            >
                                Eliminar Definitivamente
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Descripción</h2>
                        <p className="text-gray-700 leading-relaxed">
                            {producto.descripcionProducto}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Información del Proveedor</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Proveedor:</span>
                                <span className="font-medium">{producto.proveedor}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Categoría:</span>
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    {producto.categoria?.nombre || 'Sin categoría'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Historial</h2>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Fecha de creación:</span>
                                <span>
                                    {producto.createdAt ? 
                                        new Date(producto.createdAt).toLocaleString() : 
                                        'No disponible'
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Última actualización:</span>
                                <span>
                                    {producto.updatedAt ? 
                                        new Date(producto.updatedAt).toLocaleString() : 
                                        'No disponible'
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className="space-y-6">
                    {}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Información Comercial</h2>
                        <div className="space-y-4">
                            <div className="text-center bg-blue-50 p-4 rounded-lg">
                                <div className="text-3xl font-bold text-blue-600">
                                    {formatPrice(producto.precioProducto)}
                                </div>
                                <div className="text-sm text-blue-600">Precio unitario</div>
                            </div>

                            <div className={`text-center p-4 rounded-lg ${
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
                                    Unidades en stock
                                </div>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Unidades vendidas:</span>
                                <span className="font-medium">{producto.vendidos || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Valor en inventario:</span>
                                <span className="font-medium text-green-600">
                                    {formatPrice(producto.precioProducto * producto.stock)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Ingresos totales:</span>
                                <span className="font-medium text-blue-600">
                                    {formatPrice((producto.vendidos || 0) * producto.precioProducto)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {}
                    {!isAdmin && producto.stock > 0 && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Acciones</h2>
                            <Button className="w-full">
                                Agregar al Carrito
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductoDetailPage;