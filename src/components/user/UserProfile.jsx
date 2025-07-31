import React, { useState } from 'react';
import { useUserProfile } from '../../shared/hooks';

const UserProfile = ({ user, onEdit }) => {
    const { actualizarPassword, loading, error } = useUserProfile();
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    console.log('UserProfile - Datos del usuario recibidos:', user);

    if (!user) {
        return (
            <div className="text-center p-4">
                <p>No se encontró información del usuario</p>
            </div>
        );
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            const result = await actualizarPassword(user.uid, { 
                newPassword: passwordData.newPassword 
            });
            
            if (result.success) {
                alert('Contraseña actualizada exitosamente');
                setShowPasswordForm(false);
                setPasswordData({ newPassword: '', confirmPassword: '' });
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                         style={{ width: '80px', height: '80px' }}>
                        <span style={{ fontSize: '2rem', color: 'white' }}>👤</span>
                    </div>
                    <div>
                        <h4 className="mb-1">{user.name && user.surname ? `${user.name} ${user.surname}` : 'Usuario'}</h4>
                        <p className="text-muted mb-1">@{user.username || 'N/A'}</p>
                        <p className="text-muted mb-1">{user.email || 'N/A'}</p>
                        <span className={`badge ${user.role === 'ADMIN_ROLE' ? 'bg-primary' : 'bg-secondary'}`}>
                            {user.role === 'ADMIN_ROLE' ? 'Administrador' : 'Cliente'}
                        </span>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <h6>Información Personal</h6>
                        <p><strong>Nombre:</strong> {user.name || 'N/A'}</p>
                        <p><strong>Apellido:</strong> {user.surname || 'N/A'}</p>
                        <p><strong>Teléfono:</strong> {user.phone || 'N/A'}</p>
                    </div>
                    <div className="col-md-6">
                        <h6>Información de Cuenta</h6>
                        <p><strong>Usuario:</strong> {user.username || 'N/A'}</p>
                        <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                        <p><strong>Rol:</strong> {user.role === 'ADMIN_ROLE' ? 'Administrador' : 'Cliente'}</p>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="d-flex gap-2 mb-3">
                        <button className="btn btn-primary" onClick={onEdit}>
                            ✏️ Editar Perfil
                        </button>
                        <button 
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPasswordForm(!showPasswordForm)}
                        >
                            🔑 Cambiar Contraseña
                        </button>
                    </div>

                    {showPasswordForm && (
                        <div className="card border">
                            <div className="card-body">
                                <h6>Cambiar Contraseña</h6>
                                <form onSubmit={handlePasswordChange}>
                                    <div className="mb-3">
                                        <label className="form-label">Nueva Contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData(prev => ({
                                                ...prev,
                                                newPassword: e.target.value
                                            }))}
                                            required
                                            minLength={4}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData(prev => ({
                                                ...prev,
                                                confirmPassword: e.target.value
                                            }))}
                                            required
                                        />
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button 
                                            type="submit" 
                                            className="btn btn-success"
                                            disabled={loading}
                                        >
                                            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => setShowPasswordForm(false)}
                                            disabled={loading}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                    {error && (
                                        <div className="alert alert-danger mt-2" role="alert">
                                            {error}
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;