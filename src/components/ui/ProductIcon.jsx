import React from 'react';
import { getProductIcon, getColoredProductIcon } from '../../shared/utils/iconMapper';

const ProductIcon = ({ 
    nombreProducto, 
    size = '2rem', 
    colored = false,
    className = '',
    style = {} 
}) => {
    const icon = colored 
        ? getColoredProductIcon(nombreProducto) 
        : getProductIcon(nombreProducto);
    
    const iconStyle = {
        fontSize: size,
        display: 'inline-block',
        lineHeight: '1',
        ...style
    };
    
    return (
        <span 
            className={`product-icon ${className}`}
            style={iconStyle}
            title={`Ícono para ${nombreProducto}`}
        >
            {icon}
        </span>
    );
};

export default ProductIcon;