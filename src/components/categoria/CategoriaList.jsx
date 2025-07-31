import React, { useState } from 'react';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';
import { EditButton, DeleteButton } from '../index';
import CategoriaForm from './CategoriaForm';

const CategoriaList = ({ 
    categorias, 
    loading, 
    onEdit, 
    onDelete, 
    onCreate 
}) => {
    const [showForm, setShowForm] = useState(false);
    const [editingCategoria, setEditingCategoria] = useState(null);

    const columns = [
        {
            key: 'nombre',
            header: 'Nombre',
            width: '30%'
        },
        {
            key: 'descripcion',
            header: 'Descripción',
            width: '50%'
        },
        {
            key: 'actions',
            header: 'Acciones',
            width: '20%',
            render: (categoria) => (
                <div className="d-flex gap-2">
                    <EditButton
                        size="sm"
                        onClick={() => handleEdit(categoria)}
                        tooltip="Editar categoría"
                    />
                    <DeleteButton
                        size="sm"
                        onClick={() => handleDelete(categoria)}
                        tooltip="Eliminar categoría"
                    />
                </div>
            )
        }
    ];

    const handleEdit = (categoria) => {
        setEditingCategoria(categoria);
        setShowForm(true);
    };

    const handleDelete = async (categoria) => {
        if (window.confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
            console.log('CategoriaList - Enviando UID para eliminar:', categoria.uid);
            await onDelete(categoria.uid);
        }
    };

    const handleCreate = () => {
        setEditingCategoria(null);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingCategoria(null);
    };

    const handleSubmit = async (data) => {
        if (editingCategoria) {
            await onEdit(editingCategoria.uid, data);
        } else {
            await onCreate(data);
        }
        handleCloseForm();
    };

    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Lista de Categorías</h5>
                <Button 
                    variant="primary" 
                    onClick={handleCreate}
                    disabled={loading}
                >
                    <i className="fas fa-plus me-2"></i>
                    Nueva Categoría
                </Button>
            </div>
            <div className="card-body">
                <Table 
                    columns={columns}
                    data={categorias}
                    loading={loading}
                />
            </div>

            {showForm && (
                <CategoriaForm
                    categoria={editingCategoria}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseForm}
                    isEdit={!!editingCategoria}
                />
            )}
        </div>
    );
};

export default CategoriaList;