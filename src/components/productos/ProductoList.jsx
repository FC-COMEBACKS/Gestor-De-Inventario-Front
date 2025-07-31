import React, { useState } from 'react';
import { Table, Button, Input } from '../ui';
import { EditButton, DeleteButton } from '../index';
import { useAuth } from '../../shared/hooks';

const ProductoList = ({ 
    productos, 
    loading, 
    onEdit, 
    onDelete, 
    onView,
    onSearch 
}) => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    const isAdmin = user?.userDetails?.role === 'ADMIN_ROLE';

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(price);
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return 'Agotado';
        if (stock <= 5) return 'Bajo';
        return 'Disponible';
    };

    const getStockColor = (stock) => {
        if (stock === 0) return 'text-red-600';
        if (stock <= 5) return 'text-yellow-600';
        return 'text-green-600';
    };

    const columns = [
        {
            header: 'Producto',
            key: 'nombreProducto',
            render: (row) => (
                <div>
                    <div className="font-medium text-gray-900">{row.nombreProducto}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                        {row.descripcionProducto}
                    </div>
                </div>
            )
        },
        {
            header: 'Categoría',
            key: 'categoria',
            render: (row) => (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {row.categoria?.nombre || 'Sin categoría'}
                </span>
            )
        },
        {
            header: 'Precio',
            key: 'precioProducto',
            render: (row) => (
                <span className="font-medium text-gray-900">
                    {formatPrice(row.precioProducto)}
                </span>
            )
        },
        {
            header: 'Stock',
            key: 'stock',
            render: (row) => (
                <div className="text-center">
                    <div className={`font-medium ${getStockColor(row.stock)}`}>
                        {row.stock}
                    </div>
                    <div className={`text-xs ${getStockColor(row.stock)}`}>
                        {getStockStatus(row.stock)}
                    </div>
                </div>
            )
        },
        {
            header: 'Proveedor',
            key: 'proveedor',
            render: (row) => (
                <span className="text-gray-700">{row.proveedor}</span>
            )
        },
        {
            header: 'Vendidos',
            key: 'vendidos',
            render: (row) => (
                <span className="text-gray-600">{row.vendidos || 0}</span>
            )
        }
    ];

    if (isAdmin) {
        columns.push({
            header: 'Acciones',
            key: 'actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onView && onView(row)}
                    >
                        Ver
                    </Button>
                    <EditButton
                        onClick={() => onEdit && onEdit(row)}
                        size="sm"
                    />
                    <DeleteButton
                        onClick={() => onDelete && onDelete(row)}
                        size="sm"
                    />
                </div>
            )
        });
    } else {
        columns.push({
            header: 'Acciones',
            key: 'actions',
            render: (row) => (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onView && onView(row)}
                >
                    Ver Detalles
                </Button>
            )
        });
    }

    return (
        <div className="space-y-4">
            {}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                    Lista de Productos
                </h2>
                <div className="w-72">
                    <Input
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={handleSearch}
                        icon="search"
                    />
                </div>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-sm text-gray-600">Total Productos</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {productos.length}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-sm text-gray-600">Agotados</div>
                    <div className="text-2xl font-bold text-red-600">
                        {productos.filter(p => p.stock === 0).length}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-sm text-gray-600">Stock Bajo</div>
                    <div className="text-2xl font-bold text-yellow-600">
                        {productos.filter(p => p.stock > 0 && p.stock <= 5).length}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="text-sm text-gray-600">Valor Total</div>
                    <div className="text-2xl font-bold text-green-600">
                        {formatPrice(productos.reduce((acc, p) => acc + (p.precioProducto * p.stock), 0))}
                    </div>
                </div>
            </div>

            {}
            <div className="bg-white rounded-lg shadow">
                <Table
                    columns={columns}
                    data={productos}
                    loading={loading}
                    emptyMessage="No hay productos disponibles"
                />
            </div>
        </div>
    );
};

export default ProductoList;