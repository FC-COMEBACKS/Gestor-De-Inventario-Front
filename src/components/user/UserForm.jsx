import React, { useState } from 'react';

const UserForm = ({ user, onSave, onCancel, mode = 'edit' }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        surname: user?.surname || '',
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        role: user?.role || 'CLIENT_ROLE'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSend = mode === 'edit' ? {
            name: formData.name,
            surname: formData.surname,
            phone: formData.phone
        } : formData;
        
        onSave(dataToSend);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="user-form">
            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            maxLength={25}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label">Apellido</label>
                        <input
                            type="text"
                            className="form-control"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            required
                            maxLength={25}
                        />
                    </div>
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">Nombre de Usuario</label>
                <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={mode === 'edit'} 
                />
                {mode === 'edit' && (
                    <div className="form-text">El nombre de usuario no se puede modificar</div>
                )}
            </div>

            <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={mode === 'edit'} 
                />
                {mode === 'edit' && (
                    <div className="form-text">El email no se puede modificar</div>
                )}
            </div>

            <div className="mb-3">
                <label className="form-label">Teléfono</label>
                <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    minLength={8}
                    maxLength={8}
                    pattern="[0-9]{8}"
                    placeholder="12345678"
                />
                <div className="form-text">Ingresa 8 dígitos</div>
            </div>

            {mode !== 'edit' && (
                <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select
                        className="form-select"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="CLIENT_ROLE">Cliente</option>
                        <option value="ADMIN_ROLE">Administrador</option>
                    </select>
                </div>
            )}

            <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                    {mode === 'edit' ? 'Actualizar' : 'Crear'} Usuario
                </button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default UserForm;