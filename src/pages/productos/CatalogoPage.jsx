import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductos, useCategorias } from '../../shared/hooks';
import { Input, Select, Button } from '../../components/ui';
import { ProductoCatalogCard } from '../../components/productos';

const CatalogoPage = () => {
    const [searchParams] = useSearchParams();
    const { 
        productos, 
        loading, 
        error,
        obtenerProductos,
        buscarPorNombre,
        obtenerPorCategoria,
        clearError
    } = useProductos();

    const { 
        categorias, 
        obtenerCategorias 
    } = useCategorias();

    const [filtros, setFiltros] = useState({
        busqueda: '',
        categoria: searchParams.get('categoria') || '',
        ordenar: 'nombre'
    });

    const [productosFiltrados, setProductosFiltrados] = useState([]);

    useEffect(() => {
        obtenerProductos();
    }, [obtenerProductos]);

    useEffect(() => {
        obtenerCategorias();
    }, [obtenerCategorias]);

    useEffect(() => {
        const categoriaFromUrl = searchParams.get('categoria');
        if (categoriaFromUrl && categoriaFromUrl !== filtros.categoria) {
            setFiltros(prev => ({ ...prev, categoria: categoriaFromUrl }));
            obtenerPorCategoria(categoriaFromUrl);
        }
    }, [searchParams, obtenerPorCategoria, filtros.categoria]);

    useEffect(() => {
        aplicarFiltros();
    }, [productos, filtros]); 

    const aplicarFiltros = () => {
        let resultado = [...productos];

        resultado = resultado.filter(producto => producto.stock > 0);

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
                case 'precio_asc':
                    return parseFloat(a.precioProducto) - parseFloat(b.precioProducto);
                case 'precio_desc':
                    return parseFloat(b.precioProducto) - parseFloat(a.precioProducto);
                case 'nombre':
                default:
                    return a.nombreProducto.localeCompare(b.nombreProducto);
            }
        });

        setProductosFiltrados(resultado);
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

    const opcionesCategorias = [
        { value: '', label: 'Todas las categorías' },
        ...categorias.map(categoria => ({
            value: categoria.uid || categoria._id || categoria.id,
            label: categoria.nombre
        }))
    ];

    const opcionesOrden = [
        { value: 'nombre', label: 'Nombre A-Z' },
        { value: 'precio_asc', label: 'Precio: Menor a Mayor' },
        { value: 'precio_desc', label: 'Precio: Mayor a Menor' }
    ];

    return (
        <div className="container-fluid p-4">
            <div className="row mb-4">
                <div className="col-12">
                    <h1 className="display-6 mb-2">🛒 Catálogo de Productos</h1>
                    <p className="text-muted">Descubre nuestros productos disponibles</p>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card bg-primary text-white">
                        <div className="card-body text-center">
                            <h3 className="card-title">{productosFiltrados.length}</h3>
                            <p className="card-text">Productos Disponibles</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card bg-success text-white">
                        <div className="card-body text-center">
                            <h3 className="card-title">{categorias.length}</h3>
                            <p className="card-text">Categorías</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card bg-info text-white">
                        <div className="card-body text-center">
                            <h3 className="card-title">
                                {productosFiltrados.filter(p => p.stock <= 5 && p.stock > 0).length}
                            </h3>
                            <p className="card-text">Últimas Unidades</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card bg-warning text-dark">
                        <div className="card-body text-center">
                            <h3 className="card-title">
                                {new Intl.NumberFormat('es-GT', {
                                    style: 'currency',
                                    currency: 'GTQ'
                                }).format(
                                    Math.min(...productosFiltrados.map(p => parseFloat(p.precioProducto)))
                                )}
                            </h3>
                            <p className="card-text">Desde</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header">
                    <h5 className="mb-0">🔍 Buscar y Filtrar</h5>
                </div>
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
                            onClick={handleBusquedaAvanzada}
                            disabled={loading}
                        >
                            {loading ? 'Buscando...' : '🔍 Buscar'}
                        </Button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger alert-dismissible" role="alert">
                    <strong>Error:</strong> {error}
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={clearError}
                    ></button>
                </div>
            )}

            {loading && (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando productos...</p>
                </div>
            )}

            {!loading && (
                <div className="row">
                    {productosFiltrados.length > 0 ? (
                        productosFiltrados.map((producto) => (
                            <div key={producto.uid || producto._id} className="col-lg-4 col-md-6 mb-4">
                                <ProductoCatalogCard producto={producto} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <div className="text-center py-5">
                                <h4>😔 No se encontraron productos</h4>
                                <p className="text-muted">
                                    Intenta ajustar los filtros o términos de búsqueda
                                </p>
                                <Button
                                    onClick={() => {
                                        setFiltros({
                                            busqueda: '',
                                            categoria: '',
                                            ordenar: 'nombre'
                                        });
                                        obtenerProductos();
                                    }}
                                >
                                    🔄 Limpiar Filtros
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CatalogoPage;