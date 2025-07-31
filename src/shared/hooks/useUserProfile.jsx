import { useState, useCallback } from 'react';
import { obtenerUsuarioPorId, actualizarContrasena, actualizarUsuario } from '../../services/api';

export const useUserProfile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const obtenerPerfil = useCallback(async (uid) => {
        if (!uid) return { success: false, error: 'UID requerido' };
        
        try {
            setLoading(true);
            setError(null);
            
            const response = await obtenerUsuarioPorId(uid);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al obtener perfil');
            }
            
            return { success: true, data: response.data };
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                               err.message || 
                               'Error al obtener perfil';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    const actualizarPerfil = useCallback(async (uid, userData) => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('actualizarPerfil - UID:', uid);
            console.log('actualizarPerfil - userData:', userData);
            
            const response = await actualizarUsuario(uid, userData);
            
            console.log('actualizarPerfil - response:', response);
            
            if (response.error) {
                const errorMessage = response.err?.response?.data?.message || 
                                   response.err?.response?.data?.msg ||
                                   response.err?.message || 
                                   'Error al actualizar perfil';
                throw new Error(errorMessage);
            }
            
            return { success: true, data: response.data };
            
        } catch (err) {
            console.error('actualizarPerfil - Error:', err);
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.msg ||
                               err.message || 
                               'Error al actualizar perfil';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    const actualizarPassword = useCallback(async (uid, passwordData) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await actualizarContrasena(uid, passwordData);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al actualizar contraseña');
            }
            
            return { success: true, data: response.data };
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                               err.message || 
                               'Error al actualizar contraseña';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        obtenerPerfil,
        actualizarPerfil,
        actualizarPassword
    };
};

export default useUserProfile;