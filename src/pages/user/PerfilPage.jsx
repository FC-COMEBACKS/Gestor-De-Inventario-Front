import React, { useState, useEffect } from 'react';
import { useAuth, useUserProfile } from '../../shared/hooks';
import { UserProfile, UserForm } from '../../components/user';
import { Modal } from '../../components/ui';

const PerfilPage = () => {
    const { user } = useAuth();
    const { loading, error, obtenerPerfil, actualizarPerfil, actualizarPassword } = useUserProfile();
    const [currentUser, setCurrentUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [profileError, setProfileError] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                setProfileLoading(true);
                setProfileError(null);
                
                const userDetails = user?.userDetails;
                const userUid = userDetails?.uid;
                
                const hasCompleteData = userDetails && 
                    userDetails.name && 
                    userDetails.email && 
                    userDetails.username &&
                    userDetails.surname;
                
                if (hasCompleteData) {
                    console.log('Usando datos completos del localStorage');
                    setCurrentUser(userDetails);
                } else if (userUid) {
                    console.log('Obteniendo datos del servidor...');
                    const result = await obtenerPerfil(userUid);
                    if (result.success) {
                        setCurrentUser(result.data.user);
                    } else {
                        console.log('Error del servidor, usando datos disponibles');
                        setCurrentUser(userDetails);
                    }
                } else {
                    setCurrentUser(userDetails);
                }
            } catch (err) {
                setProfileError('Error al cargar el perfil del usuario');
                console.error('Error completo:', err);
                setCurrentUser(user?.userDetails);
            } finally {
                setProfileLoading(false);
            }
        };

        if (user && !currentUser) {
            loadUserProfile();
        }
    }, [user, obtenerPerfil, currentUser]);

    const handleEditProfile = () => {
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    const handlePasswordChange = async (uid, passwordData) => {
        const result = await actualizarPassword(uid, passwordData);
        return result;
    };

    const handleSaveProfile = async (userData) => {
        try {
            console.log('handleSaveProfile - Datos a actualizar:', userData);
            console.log('handleSaveProfile - Usuario actual:', currentUser);
            
            const result = await actualizarPerfil(currentUser.uid || currentUser._id, userData);
            
            console.log('handleSaveProfile - Resultado:', result);
            
            if (result.success) {
                setCurrentUser({ ...currentUser, ...userData });
                setShowEditModal(false);
                alert('Perfil actualizado exitosamente');
            } else {
                alert(`Error al actualizar perfil: ${result.error}`);
            }
        } catch (err) {
            console.error('handleSaveProfile - Error:', err);
            alert(`Error al actualizar perfil: ${err.message}`);
        }
    };

    if (profileLoading || loading) {
        return (
            <div className="container-fluid p-4">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando perfil...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (profileError || error) {
        return (
            <div className="container-fluid p-4">
                <div className="alert alert-danger" role="alert">
                    {profileError || error}
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Mi Perfil</h2>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-8 col-md-10 mx-auto">
                    {currentUser ? (
                        <UserProfile 
                            user={currentUser} 
                            onEdit={handleEditProfile}
                            onPasswordChange={handlePasswordChange}
                        />
                    ) : (
                        <div className="text-center p-4">
                            <p>No se pudo cargar la información del perfil</p>
                        </div>
                    )}
                </div>
            </div>

            {showEditModal && (
                <Modal show={showEditModal} onClose={handleCloseModal}>
                    <div>
                        <h5>Editar Perfil</h5>
                        <UserForm
                            user={currentUser}
                            onSave={handleSaveProfile}
                            onCancel={handleCloseModal}
                            mode="edit"
                        />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default PerfilPage;