import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions = ({ actions = [] }) => {
    const navigate = useNavigate();
    
    const defaultActions = [
        {
            icon: '📦',
            title: 'Agregar Producto',
            description: 'Añadir nuevo producto al inventario',
            action: () => navigate('/productos'),
            color: 'primary'
        },
        {
            icon: '📋',
            title: 'Nueva Categoría',
            description: 'Crear nueva categoría',
            action: () => navigate('/categorias'),
            color: 'success'
        },
        {
            icon: '🧾',
            title: 'Nueva Factura',
            description: 'Generar nueva factura',
            action: () => navigate('/facturas'),
            color: 'info'
        }
    ];

    const actionsList = actions.length > 0 ? actions : defaultActions;

    return (
        <div className="quick-actions">
            <h5 className="mb-3">Acciones Rápidas</h5>
            <div className="row">
                {actionsList.map((action, index) => (
                    <div key={index} className="col-md-4 mb-3">
                        <div className="card h-100">
                            <div className="card-body text-center">
                                <div className="mb-3" style={{ fontSize: '2rem' }}>
                                    {action.icon}
                                </div>
                                <h6 className="card-title">{action.title}</h6>
                                <p className="card-text small text-muted">
                                    {action.description}
                                </p>
                                <button 
                                    className={`btn btn-${action.color || 'primary'} btn-sm`}
                                    onClick={action.action}
                                >
                                    Ejecutar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;