import { useState, useEffect, useCallback } from 'react';
import {
    listarProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductosAgotados,
    obtenerProductosMasVendidos,
    buscarProductosPorNombre,
    obtenerProductosPorCategoria
} from '../../services/api.jsx';

export const useProductos = () => {
    const [productos, setProductos] = useState([]);
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const obtenerProductos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await listarProductos();
            
            if (response.error) {
                setError(response.err?.response?.data?.message || 'Error al obtener productos');
                return;
            }
            
            const productosData = response.data?.productos || response.data || [];
            setProductos(productosData);
        } catch {
            setError('Error al obtener productos');
        } finally {
            setLoading(false);
        }
    }, []);

    const obtenerProducto = useCallback(async (id) => {
        try {
            setLoading(true);
            setError(null);
            const response = await obtenerProductoPorId(id);
            
            if (response.error) {
                setError(response.err?.response?.data?.message || 'Error al obtener producto');
                return null;
            }
            
            setProducto(response.data?.producto || null);
            return response.data?.producto;
        } catch {
            setError('Error al obtener producto');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const agregarProducto = useCallback(async (data) => {
        try {
            setLoading(true);
            setError(null);
            const response = await crearProducto(data);
            
            if (response.error) {
                setError(response.err?.response?.data?.message || 'Error al crear producto');
                return false;
            }
            
            await obtenerProductos();
            return true;
        } catch {
            setError('Error al crear producto');
            return false;
        } finally {
            setLoading(false);
        }
    }, [obtenerProductos]);

    const editarProducto = useCallback(async (id, data) => {
        try {
            setLoading(true);
            setError(null);
            const response = await actualizarProducto(id, data);
            
            if (response.error) {
                setError(response.err?.response?.data?.message || 'Error al actualizar producto');
                return false;
            }
            
            await obtenerProductos();
            return true;
        } catch {
            setError('Error al actualizar producto');
            return false;
        } finally {
            setLoading(false);
        }
    }, [obtenerProductos]);

    const borrarProducto = useCallback(async (id) => {
        try {
            setLoading(true);
            setError(null);
            const response = await eliminarProducto(id);
            
            if (response.error) {
                setError(response.err?.response?.data?.message || 'Error al eliminar producto');
                return false;
            }
            
            await obtenerProductos();
            return true;
        } catch {
            setError('Error al eliminar producto');
            return false;
        } finally {
            setLoading(false);
        }
    }, [obtenerProductos]);

    const obtenerAgotados = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await obtenerProductosAgotados();
            
            if (response.error) {
                setError(response.err?.response?.data?.message || 'Error al obtener productos agotados');
                return [];
            }
            
            return response.data?.productos || [];
        } catch {
            setError('Error al obtener productos agotados');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const obtenerMasVendidos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await obtenerProductosMasVendidos();
            
            if (response.error) {
                setError(response.err?.response?.data?.message || 'Error al obtener productos más vendidos');
                return [];
            }
            
            return response.data?.productos || [];
        } catch {
            setError('Error al obtener productos más vendidos');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const buscarPorNombre = useCallback(async (nombreProducto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await buscarProductosPorNombre(nombreProducto);
            
            if (response.error) {
                setError(response.err?.response?.data?.message || 'Error al buscar productos');
                return [];
            }
            
            return response.data?.productos || [];
        } catch {
            setError('Error al buscar productos');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const obtenerPorCategoria = useCallback(async (categoriaId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await obtenerProductosPorCategoria(categoriaId);
            
            if (response.error) {
                setError(response.err?.response?.data?.message || 'Error al obtener productos por categoría');
                return [];
            }
            
            return response.data?.productos || [];
        } catch {
            setError('Error al obtener productos por categoría');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        obtenerProductos();
    }, [obtenerProductos]);

    return {
        productos,
        producto,
        loading,
        error,
        
        obtenerProductos,
        obtenerProducto,
        agregarProducto,
        editarProducto,
        borrarProducto,
        obtenerAgotados,
        obtenerMasVendidos,
        buscarPorNombre,
        obtenerPorCategoria,
        
        setError: (err) => setError(err),
        clearError: () => setError(null),
        clearProducto: () => setProducto(null)
    };
};

export default useProductos;