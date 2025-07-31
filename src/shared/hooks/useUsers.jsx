import { useState, useCallback, useRef } from 'react';
import { 
    listarUsuarios, 
    obtenerUsuarioPorId, 
    actualizarUsuario, 
    actualizarContrasena, 
    actualizarRol, 
    eliminarUsuario, 
    eliminarCuenta 
} from '../../services/api';

export const useUsers = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [limit] = useState(10);

    const isLoadingRef = useRef(false);

    const obtenerUsuarios = useCallback(async (desde = 0, limite = 10) => {
        if (isLoadingRef.current) {
            console.log('obtenerUsuarios - Ya hay una petición en curso, saltando...');
            return;
        }
        
        isLoadingRef.current = true;
        setLoading(true);
        setError(null);
        
        try {
            const response = await listarUsuarios(limite, desde);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al cargar usuarios');
            }
            
            const responseData = response.data?.data || response.data;
            console.log('obtenerUsuarios - Data extraída:', responseData);
            
            const { users: usuariosData, total: totalData } = responseData;
            setUsuarios(usuariosData || []);
            setTotal(totalData || 0);
            
        } catch (err) {
            console.error('obtenerUsuarios - Error:', err);
            setError(err.message);
            setUsuarios([]);
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
        }
    }, []);

    const obtenerPorId = useCallback(async (uid) => {
        if (!uid) return { success: false, error: 'UID requerido' };
        
        try {
            setError(null);
            
            const response = await obtenerUsuarioPorId(uid);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al obtener usuario');
            }
            
            return { success: true, data: response.data };
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                               err.message || 
                               'Error al obtener usuario';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    }, []);

    const actualizar = useCallback(async (uid, usuarioData) => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('useUsers.actualizar - Datos a enviar:', usuarioData);
            const response = await actualizarUsuario(uid, usuarioData);
            console.log('useUsers.actualizar - Respuesta recibida:', response);
            
            if (response.error) {
                const errorMessage = response.err?.response?.data?.message || 
                                   response.err?.response?.data?.msg ||
                                   response.err?.response?.data?.error ||
                                   response.err?.message || 
                                   'Error al actualizar usuario';
                throw new Error(errorMessage);
            }
            
            if (response.data && response.data.success) {
                setUsuarios(prev => prev.map(user => 
                    user.uid === uid ? { ...user, ...usuarioData } : user
                ));
                
                await obtenerUsuarios(currentPage * limit, limit);
                
                return { success: true, data: response.data };
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
            
        } catch (err) {
            console.error('useUsers.actualizar - Error:', err);
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.msg ||
                               err.response?.data?.error ||
                               err.message || 
                               'Error al actualizar usuario';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [obtenerUsuarios, currentPage, limit]);

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

    const cambiarRol = useCallback(async (uid, nuevoRol) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await actualizarRol(uid, { newRole: nuevoRol });
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al cambiar rol');
            }
            
            setUsuarios(prev => prev.map(user => 
                user.uid === uid ? { ...user, role: nuevoRol } : user
            ));
            
            return { success: true, data: response.data };
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                               err.message || 
                               'Error al cambiar rol';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    const eliminar = useCallback(async (uid) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await eliminarUsuario(uid);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al eliminar usuario');
            }
            
            setUsuarios(prev => prev.filter(user => user.uid !== uid));
            setTotal(prev => prev - 1);
            
            return { success: true, data: response.data };
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                               err.message || 
                               'Error al eliminar usuario';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    const eliminarMiCuenta = useCallback(async (uid, passwordData) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await eliminarCuenta(uid, passwordData);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al eliminar cuenta');
            }
            
            return { success: true, data: response.data };
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                               err.message || 
                               'Error al eliminar cuenta';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    const cambiarPagina = useCallback((nuevaPagina) => {
        setCurrentPage(nuevaPagina);
        obtenerUsuarios(nuevaPagina * limit, limit);
    }, [obtenerUsuarios, limit]);

    const refrescar = useCallback(() => {
        if (!isLoadingRef.current) {
            obtenerUsuarios(currentPage * limit, limit);
        }
    }, [obtenerUsuarios, currentPage, limit]);

    return {
        usuarios,
        loading,
        error,
        total,
        currentPage,
        limit,
        totalPages: Math.ceil(total / limit),
        obtenerUsuarios,
        obtenerPorId,
        actualizar,
        actualizarPassword,
        cambiarRol,
        eliminar,
        eliminarMiCuenta,
        cambiarPagina,
        refrescar
    };
};

export default useUsers;