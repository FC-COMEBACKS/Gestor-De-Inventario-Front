import React from 'react';

const RecentActivity = ({ activities = [] }) => {
    const defaultActivities = [
        {
            icon: '✅',
            title: 'Producto agregado',
            description: 'Se agregó un nuevo producto al inventario',
            time: 'Hace 2 horas'
        },
        {
            icon: '👤',
            title: 'Nuevo usuario',
            description: 'Se registró un nuevo usuario',
            time: 'Hace 4 horas'
        },
        {
            icon: '🧾',
            title: 'Factura generada',
            description: 'Se generó una nueva factura',
            time: 'Hace 6 horas'
        }
    ];

    const activityList = activities.length > 0 ? activities : defaultActivities;

    return (
        <div className="recent-activity">
            <h5 className="mb-3">Actividad Reciente</h5>
            <div className="activity-list">
                {activityList.map((activity, index) => (
                    <div key={index} className="activity-item d-flex align-items-start mb-3">
                        <div className="activity-icon me-3" style={{ fontSize: '1.5rem' }}>
                            {activity.icon}
                        </div>
                        <div className="activity-content flex-grow-1">
                            <h6 className="mb-1">{activity.title}</h6>
                            <p className="text-muted mb-1 small">{activity.description}</p>
                            <small className="text-muted">{activity.time}</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivity;