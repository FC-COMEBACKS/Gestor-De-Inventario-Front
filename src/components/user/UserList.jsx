import React from 'react';

const UserList = ({ users = [], loading = false, onEdit, onDelete, onChangeRole }) => {
    if (loading) {
        return (
            <div className="d-flex justify-content-center p-4">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando usuarios...</span>
                </div>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-5">
                <div className="mb-3">
                    <i className="fas fa-users fa-3x text-muted"></i>
                </div>
                <h5 className="text-muted">No hay usuarios disponibles</h5>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.uid}>
                            <td>{`${user.name || 'N/A'} ${user.surname || ''}`}</td>
                            <td>{user.username || 'N/A'}</td>
                            <td>{user.email || 'N/A'}</td>
                            <td>{user.phone || 'N/A'}</td>
                            <td>
                                <span className={`badge ${user.role === 'ADMIN_ROLE' ? 'bg-primary' : 'bg-secondary'}`}>
                                    {user.role === 'ADMIN_ROLE' ? 'Admin' : 'Cliente'}
                                </span>
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button 
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => onEdit && onEdit(user)}
                                        title="Editar usuario"
                                    >
                                        ✏️
                                    </button>
                                    {onChangeRole && (
                                        <button 
                                            className="btn btn-outline-warning btn-sm"
                                            onClick={() => onChangeRole(user)}
                                            title="Cambiar rol"
                                        >
                                            👤
                                        </button>
                                    )}
                                    <button 
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => onDelete && onDelete(user.uid)}
                                        title="Eliminar usuario"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;