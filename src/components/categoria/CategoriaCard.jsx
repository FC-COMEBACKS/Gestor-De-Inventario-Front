import React from 'react';

const CategoriaCard = ({ 
    categoria, 
    onEdit, 
    onDelete, 
    onClick 
}) => {
    if (!categoria) return null;

    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit && onEdit(categoria);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete && onDelete(categoria.uid);
    };

    const handleClick = () => {
        onClick && onClick(categoria);
    };

    return (
        <div 
            className="card h-100"
            style={{ cursor: onClick ? 'pointer' : 'default' }}
            onClick={handleClick}
        >
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{categoria.nombre}</h5>
                    <div className="dropdown">
                        <button 
                            className="btn btn-sm btn-outline-secondary"
                            type="button"
                            data-bs-toggle="dropdown"
                            onClick={(e) => e.stopPropagation()}
                        >
                            ⋮
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <button 
                                    className="dropdown-item"
                                    onClick={handleEdit}
                                >
                                    <i className="fas fa-edit me-2"></i>
                                    Editar
                                </button>
                            </li>
                            <li>
                                <button 
                                    className="dropdown-item text-danger"
                                    onClick={handleDelete}
                                >
                                    <i className="fas fa-trash me-2"></i>
                                    Eliminar
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <p className="card-text text-muted">
                    {categoria.descripcion}
                </p>
                
                <div className="mt-auto">
                    <small className="text-muted">
                        ID: {categoria.uid}
                    </small>
                </div>
            </div>
        </div>
    );
};

export default CategoriaCard;