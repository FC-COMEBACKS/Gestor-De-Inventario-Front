import React, { useState, useEffect } from 'react';
import { useUsers } from '../../shared/hooks';
import { UserList, UserForm } from '../../components/user';
import { Modal } from '../../components/ui';
import { Pagination } from '../../components/categoria';

const UserPage = () => {
    const {
        usuarios,
        loading,
        error,
        total,
        currentPage,
        totalPages,
        actualizar,
        cambiarRol,
        eliminar,
        cambiarPagina,
        refrescar
    } = useUsers();

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [modalType, setModalType] = useState('edit');
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (!isInitialized && !loading) {
            console.log('UserPage - Cargando usuarios iniciales...');
            refrescar();
            setIsInitialized(true);
        }
    }, [isInitialized, loading, refrescar]);

    const handleEdit = (user) => {
        setEditingUser(user);
        setModalType('edit');
        setShowModal(true);
    };

    const handleChangeRole = (user) => {
        setEditingUser(user);
        setModalType('role');
        setShowModal(true);
    };

    const handleDelete = (uid) => {
        setEditingUser({ uid });
        setModalType('delete');
        setShowModal(true);
    };

    const handleSaveUser = async (userData) => {
        try {
            const result = await actualizar(editingUser.uid, userData);
            if (result.success) {
                setShowModal(false);
                setEditingUser(null);
                alert('Usuario actualizado exitosamente');
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleSaveRole = async (roleData) => {
        try {
            const result = await cambiarRol(editingUser.uid, roleData);
            if (result.success) {
                setShowModal(false);
                setEditingUser(null);
                alert('Rol actualizado exitosamente');
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            const result = await eliminar(editingUser.uid);
            if (result.success) {
                setShowModal(false);
                setEditingUser(null);
                alert('Usuario eliminado exitosamente');
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
    };

    const renderModalContent = () => {
        switch (modalType) {
            case 'edit':
                return (
                    <UserForm
                        user={editingUser}
                        onSave={handleSaveUser}
                        onCancel={closeModal}
                        mode="edit"
                    />
                );
            case 'role':
                return (
                    <div>
                        <h5>Cambiar Rol de Usuario</h5>
                        <p>Usuario: <strong>{editingUser?.name} {editingUser?.surname}</strong></p>
                        <p>Rol actual: <strong>{editingUser?.role === 'ADMIN_ROLE' ? 'Administrador' : 'Cliente'}</strong></p>
                        <div className="mb-3">
                            <label className="form-label">Nuevo rol:</label>
                            <select 
                                className="form-select"
                                onChange={(e) => handleSaveRole({ newRole: e.target.value })}
                                defaultValue=""
                            >
                                <option value="" disabled>Selecciona un rol</option>
                                <option value="ADMIN_ROLE">Administrador</option>
                                <option value="CLIENT_ROLE">Cliente</option>
                            </select>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-secondary" onClick={closeModal}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                );
            case 'delete':
                return (
                    <div>
                        <h5>Confirmar Eliminación</h5>
                        <p>¿Estás seguro de que quieres eliminar este usuario?</p>
                        <p><strong>Esta acción no se puede deshacer.</strong></p>
                        <div className="d-flex gap-2">
                            <button className="btn btn-danger" onClick={handleConfirmDelete}>
                                Eliminar
                            </button>
                            <button className="btn btn-secondary" onClick={closeModal}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Usuarios</h2>
                <button 
                    className="btn btn-primary"
                    onClick={refrescar}
                    disabled={loading}
                >
                    {loading ? 'Cargando...' : 'Actualizar'}
                </button>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="card">
                <div className="card-header">
                    <h5 className="card-title mb-0">
                        Usuarios ({total} total{total !== 1 ? 'es' : ''})
                    </h5>
                </div>
                <div className="card-body">
                    <UserList
                        users={usuarios}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onChangeRole={handleChangeRole}
                    />
                    
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={cambiarPagina}
                            />
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <Modal show={showModal} onClose={closeModal}>
                    {renderModalContent()}
                </Modal>
            )}
        </div>
    );
};

export default UserPage;