import React, { useState, useEffect } from 'react';
import { Input, Select, Button } from '../ui';
import { useCategorias } from '../../shared/hooks';

const ProductoForm = ({ 
    producto = null, 
    onSubmit, 
    onCancel, 
    loading = false,
    mode = 'create' 
}) => {
    const { categorias, obtenerCategorias } = useCategorias();
    
    const [formData, setFormData] = useState({
        nombreProducto: '',
        descripcionProducto: '',
        precioProducto: '',
        stock: '',
        categoria: '',
        proveedor: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        obtenerCategorias();
    }, [obtenerCategorias]);

    useEffect(() => {
        if (producto && mode === 'edit') {
            setFormData({
                nombreProducto: producto.nombreProducto || '',
                descripcionProducto: producto.descripcionProducto || '',
                precioProducto: producto.precioProducto || '',
                stock: producto.stock || '',
                categoria: producto.categoria?._id || producto.categoria || '',
                proveedor: producto.proveedor || ''
            });
        }
    }, [producto, mode]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombreProducto.trim()) {
            newErrors.nombreProducto = 'El nombre del producto es requerido';
        } else if (formData.nombreProducto.length > 50) {
            newErrors.nombreProducto = 'El nombre no puede exceder 50 caracteres';
        }

        if (!formData.descripcionProducto.trim()) {
            newErrors.descripcionProducto = 'La descripción es requerida';
        } else if (formData.descripcionProducto.length > 250) {
            newErrors.descripcionProducto = 'La descripción no puede exceder 250 caracteres';
        }

        if (!formData.precioProducto) {
            newErrors.precioProducto = 'El precio es requerido';
        } else if (isNaN(formData.precioProducto) || Number(formData.precioProducto) <= 0) {
            newErrors.precioProducto = 'El precio debe ser un número mayor a 0';
        }

        if (!formData.stock) {
            newErrors.stock = 'El stock es requerido';
        } else if (isNaN(formData.stock) || Number(formData.stock) < 0) {
            newErrors.stock = 'El stock debe ser un número mayor o igual a 0';
        }

        if (!formData.categoria) {
            newErrors.categoria = 'La categoría es requerida';
        }

        if (!formData.proveedor.trim()) {
            newErrors.proveedor = 'El proveedor es requerido';
        } else if (formData.proveedor.length > 100) {
            newErrors.proveedor = 'El proveedor no puede exceder 100 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            const dataToSubmit = {
                ...formData,
                precioProducto: Number(formData.precioProducto),
                stock: Number(formData.stock)
            };
            
            onSubmit(dataToSubmit);
        } else {
            console.warn('⚠️ Formulario no válido:', errors);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const categoriaOptions = categorias.map((cat, index) => {
        return {
            value: cat.uid || cat._id || cat.id || index.toString(),
            label: cat.nombre || 'Sin nombre'
        };
    });

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Nombre del Producto"
                    value={formData.nombreProducto}
                    onChange={(e) => handleChange('nombreProducto', e.target.value)}
                    error={errors.nombreProducto}
                    placeholder="Ingrese el nombre del producto"
                    required
                    maxLength={50}
                />

                <Select
                    label="Categoría"
                    value={formData.categoria}
                    onChange={(value) => handleChange('categoria', value)}
                    options={categoriaOptions}
                    error={errors.categoria}
                    placeholder="Seleccione una categoría"
                    required
                />

                <Input
                    label="Precio"
                    type="number"
                    value={formData.precioProducto}
                    onChange={(e) => handleChange('precioProducto', e.target.value)}
                    error={errors.precioProducto}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                />

                <Input
                    label="Stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleChange('stock', e.target.value)}
                    error={errors.stock}
                    placeholder="0"
                    min="0"
                    required
                />

                <Input
                    label="Proveedor"
                    value={formData.proveedor}
                    onChange={(e) => handleChange('proveedor', e.target.value)}
                    error={errors.proveedor}
                    placeholder="Ingrese el proveedor"
                    required
                    maxLength={100}
                />
            </div>

            <div className="col-span-full">
                <Input
                    label="Descripción"
                    type="textarea"
                    value={formData.descripcionProducto}
                    onChange={(e) => handleChange('descripcionProducto', e.target.value)}
                    error={errors.descripcionProducto}
                    placeholder="Describa el producto"
                    required
                    maxLength={250}
                    rows={4}
                />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    loading={loading}
                    disabled={loading}
                >
                    {mode === 'edit' ? 'Actualizar' : 'Crear'} Producto
                </Button>
            </div>
        </form>
    );
};

export default ProductoForm;