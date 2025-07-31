import React from 'react';

const StatsCard = ({ 
    icon, 
    title, 
    value, 
    color = 'primary', 
    subtitle,
    onClick 
}) => {
    const cardStyle = onClick ? { cursor: 'pointer' } : {};

    return (
        <div 
            className="card h-100"
            style={cardStyle}
            onClick={onClick}
        >
            <div className="card-body">
                <div className="d-flex align-items-center">
                    <div className={`bg-${color} text-white rounded-circle d-flex align-items-center justify-content-center me-3`}
                         style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}>
                        {icon}
                    </div>
                    <div className="flex-grow-1">
                        <h3 className="mb-1">{value}</h3>
                        <h6 className="mb-0 text-muted">{title}</h6>
                        {subtitle && (
                            <small className="text-muted">{subtitle}</small>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;