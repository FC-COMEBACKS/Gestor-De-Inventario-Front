import React, { useState, useEffect } from 'react';
import { Button, Input, Select } from '../../components/ui';
import { ProductoList, ProductoModal } from '../../components/productos';
import { useProductos } from '../../shared/hooks';
import { useAuth } from '../../shared/hooks';
import { useCategorias } from '../../shared/hooks';

const ProductosPage = () => {
    const { user } = useAuth();
    const { 
        productos, 
        loading, 
        error,
        obtenerProductos,
        agregarProducto,
        editarProducto,
        borrarProducto,
        buscarPorNombre,
        obtenerPorCategoria,
        clearError
    } = useProductos();
    
    const { categorias, obtenerCategorias } = useCategorias();

    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: 'create', 
        producto: null
    });

    const [filtros, setFiltros] = useState({
        busqueda: '',
        categoria: '',
        ordenar: 'nombre'
    });

    const [productosFiltrados, setProductosFiltrados] = useState([]);
    
    const [estadisticas, setEstadisticas] = useState({
        totalProductos: 0,
        agotados: 0,
        stockBajo: 0,
        valorTotal: 0
    });

    const isAdmin = user?.userDetails?.role === 'ADMIN_ROLE';

    useEffect(() => {
        obtenerProductos();
    }, [obtenerProductos]);

    useEffect(() => {
        obtenerCategorias();
    }, [obtenerCategorias]);

    useEffect(() => {
        aplicarFiltros();
    }, [productos, filtros]); 

    useEffect(() => {
        if (productos.length > 0) {
            const stats = productos.reduce((acc, producto) => {
                const precio = parseFloat(producto.precioProducto) || 0;
                const stock = parseInt(producto.stock) || 0;
                const valorProducto = precio * stock;

                acc.totalProductos += 1;
                acc.valorTotal += valorProducto;

                if (stock === 0) {
                    acc.agotados += 1;
                } else if (stock <= 5) {
                    acc.stockBajo += 1;
                }

                return acc;
            }, {
                totalProductos: 0,
                agotados: 0,
                stockBajo: 0,
                valorTotal: 0
            });

            setEstadisticas(stats);
        } else {
            setEstadisticas({
                totalProductos: 0,
                agotados: 0,
                stockBajo: 0,
                valorTotal: 0
            });
        }
    }, [productos]);

    const aplicarFiltros = () => {
        let resultado = [...productos];

        if (filtros.busqueda.trim()) {
            resultado = resultado.filter(producto =>
                producto.nombreProducto.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
                producto.descripcionProducto.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
                producto.proveedor.toLowerCase().includes(filtros.busqueda.toLowerCase())
            );
        }

        if (filtros.categoria) {
            resultado = resultado.filter(producto => 
                producto.categoria?._id === filtros.categoria || 
                producto.categoria?.uid === filtros.categoria
            );
        }

        resultado.sort((a, b) => {
            switch (filtros.ordenar) {
                case 'precio':
                    return a.precioProducto - b.precioProducto;
                case 'precio-desc':
                    return b.precioProducto - a.precioProducto;
                case 'stock':
                    return a.stock - b.stock;
                case 'stock-desc':
                    return b.stock - a.stock;
                case 'vendidos':
                    return (b.vendidos || 0) - (a.vendidos || 0);
                default:
                    return a.nombreProducto.localeCompare(b.nombreProducto);
            }
        });

        setProductosFiltrados(resultado);
    };

    const handleOpenModal = (mode, producto = null) => {
        setModalState({
            isOpen: true,
            mode,
            producto
        });
        clearError();
    };

    const handleCloseModal = () => {
        setModalState({
            isOpen: false,
            mode: 'create',
            producto: null
        });
    };

    const handleSubmit = async (data) => {
        let success = false;
        
        if (modalState.mode === 'create') {
            success = await agregarProducto(data);
        } else if (modalState.mode === 'edit') {
            success = await editarProducto(modalState.producto.uid || modalState.producto._id, data);
        }

        if (success) {
            handleCloseModal();
        }
    };

    const handleDelete = async (producto) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar "${producto.nombreProducto}"?`)) {
            const success = await borrarProducto(producto.uid || producto._id);
            if (!success && error) {
                alert(`Error al eliminar: ${error}`);
            }
        }
    };

    const handleBusquedaAvanzada = async () => {
        if (filtros.busqueda.trim()) {
            await buscarPorNombre(filtros.busqueda);
        } else {
            await obtenerProductos();
        }
    };

    const handleFiltroCategoria = async (categoriaId) => {
        setFiltros(prev => ({ ...prev, categoria: categoriaId }));
        if (categoriaId) {
            await obtenerPorCategoria(categoriaId);
        } else {
            await obtenerProductos();
        }
    };

    const opcionesOrden = [
        { value: 'nombre', label: 'Nombre A-Z' },
        { value: 'precio', label: 'Precio menor a mayor' },
        { value: 'precio-desc', label: 'Precio mayor a menor' },
        { value: 'stock', label: 'Stock menor a mayor' },
        { value: 'stock-desc', label: 'Stock mayor a menor' },
        { value: 'vendidos', label: 'Más vendidos' }
    ];

    const opcionesCategorias = [
        { value: '', label: 'Todas las categorías' },
        ...categorias.map(cat => ({
            value: cat.uid || cat._id,
            label: cat.nombre
        }))
    ];

    return (
        <div className="container-fluid py-4">
            {}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h2 mb-1">Productos</h1>
                    <p className="text-muted">Gestiona el inventario de productos</p>
                </div>
                {isAdmin && (
                    <Button onClick={() => handleOpenModal('create')}>
                        Nuevo Producto
                    </Button>
                )}
            </div>

            {}
            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card">
                        <div className="card-body d-flex align-items-center">
                            <div className="me-3" style={{ fontSize: '2rem' }}>📦</div>
                            <div>
                                <h6 className="card-subtitle mb-1 text-muted">Total Productos</h6>
                                <h3 className="card-title mb-0">{estadisticas.totalProductos}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card">
                        <div className="card-body d-flex align-items-center">
                            <div className="me-3" style={{ fontSize: '2rem' }}>⚠️</div>
                            <div>
                                <h6 className="card-subtitle mb-1 text-muted">Agotados</h6>
                                <h3 className="card-title mb-0 text-danger">{estadisticas.agotados}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card">
                        <div className="card-body d-flex align-items-center">
                            <div className="me-3" style={{ fontSize: '2rem' }}>📉</div>
                            <div>
                                <h6 className="card-subtitle mb-1 text-muted">Stock Bajo</h6>
                                <h3 className="card-title mb-0 text-warning">{estadisticas.stockBajo}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card">
                        <div className="card-body d-flex align-items-center">
                            <div className="me-3" style={{ fontSize: '2rem' }}>💰</div>
                            <div>
                                <h6 className="card-subtitle mb-1 text-muted">Valor Total</h6>
                                <h4 className="card-title mb-0 text-success">
                                    {new Intl.NumberFormat('es-GT', {
                                        style: 'currency',
                                        currency: 'GTQ'
                                    }).format(estadisticas.valorTotal)}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <Input
                                placeholder="Buscar productos por nombre, descripción o proveedor..."
                                value={filtros.busqueda}
                                onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
                                onKeyPress={(e) => e.key === 'Enter' && handleBusquedaAvanzada()}
                            />
                        </div>
                        <div className="col-md-3">
                            <Select
                                placeholder="Filtrar por categoría"
                                value={filtros.categoria}
                                onChange={(value) => handleFiltroCategoria(value)}
                                options={opcionesCategorias}
                            />
                        </div>
                        <div className="col-md-3">
                            <Select
                                placeholder="Ordenar por"
                                value={filtros.ordenar}
                                onChange={(value) => setFiltros(prev => ({ ...prev, ordenar: value }))}
                                options={opcionesOrden}
                            />
                        </div>
                    </div>
                    
                    <div className="d-flex justify-content-end mt-3">
                        <Button
                            variant="outline"
                            onClick={handleBusquedaAvanzada}
                            disabled={loading}
                        >
                            Buscar
                        </Button>
                    </div>
                </div>
            </div>

            {}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="text-red-800">
                            <strong>Error:</strong> {error}
                        </div>
                        <button 
                            onClick={clearError}
                            className="ml-auto text-red-600 hover:text-red-800"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {}
            <ProductoList
                productos={productosFiltrados}
                loading={loading}
                onEdit={(producto) => handleOpenModal('edit', producto)}
                onDelete={handleDelete}
                onView={(producto) => handleOpenModal('view', producto)}
                onSearch={(term) => setFiltros(prev => ({ ...prev, busqueda: term }))}
            />

            {}
            <ProductoModal
                isOpen={modalState.isOpen}
                onClose={handleCloseModal}
                producto={modalState.producto}
                onSubmit={handleSubmit}
                loading={loading}
                mode={modalState.mode}
            />
        </div>
    );
};

export default ProductosPage;