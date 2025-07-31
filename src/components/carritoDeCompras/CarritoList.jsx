import React from 'react';
import { CarritoItem } from './index';
import { LoadingSpinner } from '../index';

const CarritoList = ({ 
    items = [], 
    onEliminar,
    loading = false 
}) => {
    if (loading) {
        return <LoadingSpinner />;
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-5">
                <div className="mb-3">
                    <i className="fas fa-shopping-cart fa-3x text-muted"></i>
                </div>
                <h4 className="text-muted">Tu carrito está vacío</h4>
                <p className="text-muted">¡Agrega algunos productos para empezar a comprar!</p>
            </div>
        );
    }

    return (
        <div className="carrito-list">
            {items.map((item, index) => (
                <CarritoItem
                    key={item._id || `${item.idProducto?.uid || item.idProducto}-${index}`}
                    item={item}
                    onEliminar={onEliminar}
                    loading={loading}
                />
            ))}
        </div>
    );
};

export default CarritoList;