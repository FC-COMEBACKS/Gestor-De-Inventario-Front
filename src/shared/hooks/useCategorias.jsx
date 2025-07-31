import { useState, useEffect, useCallback } from 'react';
import { listarCategorias, crearCategoria, editarCategoria, eliminarCategoria } from '../../services/api';

export const useCategorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [limit] = useState(10);

    const obtenerCategorias = useCallback(async (desde = 0, limite = 10) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await listarCategorias(limite, desde);
            
            if (response.error) {
                const errorMessage = response.err?.response?.data?.message || 
                                   response.err?.response?.data?.error ||
                                   response.err?.message || 
                                   'Error al cargar categorías';
                throw new Error(errorMessage);
            }
            
            if (!response.data) {
                throw new Error('No se recibieron datos del servidor');
            }
            
            const categoriasData = response.data.categorias || response.data.data || response.data;
            const totalData = response.data.total || 0;
            
            setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
            setTotal(totalData);
            
        } catch (err) {
            console.error('Error al obtener categorías:', err);
            setError(err.message);
            setCategorias([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const crear = async (categoriaData) => {
        try {
            setLoading(true);
            const response = await crearCategoria(categoriaData);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al crear categoría');
            }
            
            await obtenerCategorias(currentPage * limit, limit);
            return { success: true, data: response.data };
            
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const editar = async (uid, categoriaData) => {
        try {
            setLoading(true);
            const response = await editarCategoria(uid, categoriaData);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al editar categoría');
            }
            
            await obtenerCategorias(currentPage * limit, limit);
            return { success: true, data: response.data };
            
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const eliminar = async (uid) => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Eliminando categoría con UID:', uid);
            const response = await eliminarCategoria(uid);
            
            console.log('Respuesta del servidor:', response);
            
            if (response.error) {
                console.error('Error del servidor:', response.err);
                const errorMessage = response.err?.response?.data?.message || 
                                   response.err?.response?.data?.error ||
                                   response.err?.message || 
                                   'Error al eliminar categoría';
                throw new Error(errorMessage);
            }
            
            if (response.status === 200 || response.data) {
                await obtenerCategorias(currentPage * limit, limit);
                return { success: true, data: response.data };
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
            
        } catch (err) {
            console.error('Error completo al eliminar:', err);
            
            let errorMessage = 'Error desconocido al eliminar categoría';
            
            if (err.response) {
                errorMessage = err.response.data?.message || 
                              err.response.data?.error ||
                              `Error del servidor: ${err.response.status}`;
            } else if (err.request) {
                errorMessage = 'Error de conexión con el servidor';
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const cambiarPagina = (nuevaPagina) => {
        setCurrentPage(nuevaPagina);
        obtenerCategorias(nuevaPagina * limit, limit);
    };

    useEffect(() => {
        obtenerCategorias(0, limit);
    }, [obtenerCategorias, limit]);

    return {
        categorias,
        loading,
        error,
        total,
        currentPage,
        limit,
        totalPages: Math.ceil(total / limit),
        obtenerCategorias,
        crear,
        editar,
        eliminar,
        cambiarPagina,
        refrescar: () => obtenerCategorias(currentPage * limit, limit)
    };
};

export default useCategorias;