import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategoriaList from '../../components/categoria/CategoriaList';
import Pagination from '../../components/categoria/Pagination';
import { useCategorias } from '../../shared/hooks/useCategorias';
import { LoadingSpinner } from '../../components';
import { navigateToDashboard } from '../../shared/utils';

const CategoriaPage = () => {
    const navigate = useNavigate();
    const {
        categorias,
        loading,
        error,
        currentPage,
        totalPages,
        crear,
        editar,
        eliminar,
        cambiarPagina,
        refrescar
    } = useCategorias();

    const handleCreate = async (categoriaData) => {
        const result = await crear(categoriaData);
        if (result.success) {
            console.log('Categoría creada exitosamente');
        } else {
            console.error('Error al crear categoría:', result.error);
            alert(`Error al crear categoría: ${result.error}`);
        }
    };

    const handleEdit = async (uid, categoriaData) => {
        const result = await editar(uid, categoriaData);
        if (result.success) {
            console.log('Categoría actualizada exitosamente');
        } else {
            console.error('Error al editar categoría:', result.error);
            alert(`Error al editar categoría: ${result.error}`);
        }
    };

    const handleDelete = async (uid) => {
        console.log('CategoriaPage - Recibido UID para eliminar:', uid);
        
        const result = await eliminar(uid);
        if (result.success) {
            console.log('Categoría eliminada exitosamente');
            alert('Categoría eliminada exitosamente');
        } else {
            console.error('Error al eliminar categoría:', result.error);
            alert(`Error al eliminar categoría: ${result.error}`);
        }
    };

    if (error) {
        return (
            <div className="container-fluid py-4">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error</h4>
                    <p>{error}</p>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <button 
                            className="btn btn-outline-danger" 
                            onClick={refrescar}
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex align-items-center gap-3">
                            <button 
                                className="btn btn-outline-secondary"
                                onClick={() => navigateToDashboard(navigate)}
                            >
                                ← Menú Principal
                            </button>
                            <div>
                                <h1 className="h3 mb-0">Gestión de Categorías</h1>
                                <p className="text-muted">Administra las categorías de productos</p>
                            </div>
                        </div>
                        <button 
                            className="btn btn-outline-primary"
                            onClick={refrescar}
                            disabled={loading}
                        >
                            <i className="fas fa-sync-alt me-2"></i>
                            Actualizar
                        </button>
                    </div>

                    <CategoriaList
                        categorias={categorias}
                        loading={loading}
                        onCreate={handleCreate}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    {totalPages > 1 && (
                        <div className="mt-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={cambiarPagina}
                                loading={loading}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoriaPage;