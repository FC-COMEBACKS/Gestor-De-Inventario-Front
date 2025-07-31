import React from 'react';
import { getProductIcon } from '../../shared/utils/iconMapper.js';

export const ProductIcon = ({ 
    nombreProducto, 
    size = 'medium',
    className = '',
    showFallback = true 
}) => {
    const icon = getProductIcon(nombreProducto);
    
    const getSizeClass = () => {
        switch (size) {
            case 'small': return 'product-icon--small';
            case 'medium': return 'product-icon--medium';
            case 'large': return 'product-icon--large';
            default: return 'product-icon--medium';
        }
    };

    if (!icon && !showFallback) {
        return null;
    }

    return (
        <span 
            className={`product-icon ${getSizeClass()} ${className}`}
            title={nombreProducto}
        >
            {icon || '📦'}
            
            <style>{`
                .product-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-style: normal;
                    text-decoration: none;
                    user-select: none;
                }

                .product-icon--small {
                    font-size: 1rem;
                    width: 1.5rem;
                    height: 1.5rem;
                }

                .product-icon--medium {
                    font-size: 1.25rem;
                    width: 2rem;
                    height: 2rem;
                }

                .product-icon--large {
                    font-size: 1.5rem;
                    width: 2.5rem;
                    height: 2.5rem;
                }
            `}</style>
        </span>
    );
};

export default ProductIcon;