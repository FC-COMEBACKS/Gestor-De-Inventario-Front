import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategorias } from '../../shared/hooks';
import { Card, Button } from '../../components/ui';
import { navigateToDashboard } from '../../shared/utils';

const CategoriasClientePage = () => {
    const navigate = useNavigate();
    const { 
        categorias, 
        loading, 
        error,
        obtenerCategorias 
    } = useCategorias();

    useEffect(() => {
        obtenerCategorias();
    }, [obtenerCategorias]);

    const handleCategoryClick = (categoria) => {
        navigate(`/catalogo?categoria=${categoria.uid || categoria._id}`);
    };

    return (
        <div className="container-fluid p-4">
            {}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <h1 className="display-6 mb-2">🏷️ Categorías de Productos</h1>
                            <p className="text-muted">Explora nuestros productos por categoría</p>
                        </div>
                        <Button 
                            variant="outline-secondary"
                            onClick={() => navigateToDashboard(navigate)}
                            className="btn-sm"
                        >
                            ← Menú Principal
                        </Button>
                    </div>
                </div>
            </div>

            {}
            {loading && (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando categorías...</p>
                </div>
            )}

            {}
            {error && (
                <div className="alert alert-danger" role="alert">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {}
            {!loading && !error && (
                <div className="row">
                    {categorias.length > 0 ? (
                        categorias.map((categoria) => (
                            <div key={categoria.uid || categoria._id} className="col-lg-4 col-md-6 mb-4">
                                <Card className="h-100 categoria-card" onClick={() => handleCategoryClick(categoria)}>
                                    <div className="card-body text-center d-flex flex-column">
                                        {}
                                        <div className="mb-3" style={{ fontSize: '3rem' }}>
                                            📂
                                        </div>
                                        
                                        {}
                                        <h4 className="card-title mb-3">
                                            {categoria.nombre}
                                        </h4>
                                        
                                        {}
                                        <p className="card-text text-muted flex-grow-1">
                                            {categoria.descripcion || 'Categoría de productos disponibles en nuestro inventario'}
                                        </p>
                                        
                                        {}
                                        <div className="mt-auto">
                                            <button 
                                                className="btn btn-primary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCategoryClick(categoria);
                                                }}
                                            >
                                                Ver Productos 🔍
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <div className="text-center py-5">
                                <h4>😔 No hay categorías disponibles</h4>
                                <p className="text-muted">
                                    Aún no se han creado categorías de productos
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoriasClientePage;