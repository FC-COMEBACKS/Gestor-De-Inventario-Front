import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const CategoriaForm = ({ 
    categoria, 
    onSubmit, 
    onCancel, 
    isEdit = false 
}) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (categoria) {
            setFormData({
                nombre: categoria.nombre || '',
                descripcion: categoria.descripcion || ''
            });
        }
    }, [categoria]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        } else if (formData.nombre.length > 50) {
            newErrors.nombre = 'El nombre no puede exceder los 50 caracteres';
        }

        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es requerida';
        } else if (formData.descripcion.length > 250) {
            newErrors.descripcion = 'La descripción no puede exceder los 250 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error al guardar categoría:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={onCancel}
            title={isEdit ? 'Editar Categoría' : 'Nueva Categoría'}
            size="md"
        >
            <form onSubmit={handleSubmit}>
                <div className="modal-body">
                    <div className="mb-3">
                        <Input
                            label="Nombre"
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            error={errors.nombre}
                            maxLength={50}
                            required
                            placeholder="Ingrese el nombre de la categoría"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Descripción *</label>
                        <textarea
                            className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            maxLength={250}
                            rows={4}
                            placeholder="Ingrese la descripción de la categoría"
                            required
                        />
                        {errors.descripcion && (
                            <div className="invalid-feedback">
                                {errors.descripcion}
                            </div>
                        )}
                        <div className="form-text">
                            {formData.descripcion.length}/250 caracteres
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
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
                        variant="primary"
                        loading={loading}
                        disabled={loading}
                    >
                        {isEdit ? 'Actualizar' : 'Crear'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CategoriaForm;