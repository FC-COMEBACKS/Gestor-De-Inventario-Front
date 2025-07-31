import { useState, useCallback } from 'react';
import {
    agregarProductoAlCarrito,
    listarProductosCarrito,
    eliminarProductoDelCarrito
} from '../../services/api.jsx';

const useCarritoDeCompras = () => {
    const [carrito, setCarrito] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cantidadTotal, setCantidadTotal] = useState(0);

    const obtenerCarrito = useCallback(async () => {
        console.log('🔄 obtenerCarrito - Iniciando carga del carrito...');
        
        const userDetails = localStorage.getItem("user");
        if (!userDetails) {
            console.log('❌ obtenerCarrito - No hay usuario autenticado');
            setCarrito([]);
            setCantidadTotal(0);
            return;
        }
        
        try {
            const parsedUser = JSON.parse(userDetails);
            const token = parsedUser?.userDetails?.token || parsedUser?.token;
            console.log('🔑 obtenerCarrito - Usuario:', parsedUser?.userDetails?.nombre || 'Sin nombre');
            console.log('🔑 obtenerCarrito - ¿Tiene token?:', !!token);
        } catch (err) {
            console.warn('⚠️ obtenerCarrito - Error al parsear usuario:', err);
        }
        
        try {
            setLoading(true);
            setError(null);
            console.log('📡 obtenerCarrito - Llamando API listarProductosCarrito...');
            const response = await listarProductosCarrito();
            console.log('📥 obtenerCarrito - Respuesta API:', response);
            
            if (response.error) {
                if (response.err?.response?.status === 404) {
                    console.log('ℹ️ obtenerCarrito - Carrito vacío (404)');
                    setCarrito([]);
                    setCantidadTotal(0);
                    return;
                }
                console.error('❌ obtenerCarrito - Error:', response.err?.response?.data);
                setError(response.err?.response?.data?.message || 'Error al obtener carrito');
                return;
            }
            
            const productos = response.data?.productos || [];
            const total = response.data?.cantidadTotal || 0;
            
            console.log('✅ obtenerCarrito - Productos obtenidos:', productos.length);
            console.log('✅ obtenerCarrito - Total:', total);
            
            setCarrito(productos);
            setCantidadTotal(total);
        } catch (error) {
            console.error('❌ obtenerCarrito - Error catch:', error);
            setCarrito([]);
            setCantidadTotal(0);
        } finally {
            setLoading(false);
        }
    }, []);

    const agregarProducto = useCallback(async (idProducto, cantidad = 1) => {
        try {
            setLoading(true);
            setError(null);
            console.log('useCarritoDeCompras - Agregando producto:', { idProducto, cantidad });
            
            const response = await agregarProductoAlCarrito({ idProducto, cantidad });
            console.log('useCarritoDeCompras - Respuesta:', response);
            
            if (response.error) {
                const errorMsg = response.err?.response?.data?.message || 'Error al agregar producto';
                console.error('useCarritoDeCompras - Error:', errorMsg);
                setError(errorMsg);
                return false;
            }
            
            await obtenerCarrito();
            return true;
        } catch (error) {
            console.error('useCarritoDeCompras - Catch error:', error);
            setError('Error al agregar producto al carrito');
            return false;
        } finally {
            setLoading(false);
        }
    }, [obtenerCarrito]);

    const eliminarProducto = useCallback(async (idProducto) => {
        console.log('=== HOOK useCarritoDeCompras - ELIMINACIÓN ===');
        console.log('🗑️ useCarritoDeCompras - ID recibido:', idProducto);
        console.log('🗑️ useCarritoDeCompras - Tipo:', typeof idProducto);
        console.log('🗑️ useCarritoDeCompras - Estado carrito actual:', carrito.length, 'items');
        
        try {
            setLoading(true);
            setError(null);
            
            if (!idProducto) {
                console.error('❌ useCarritoDeCompras - ID de producto no válido');
                setError('ID de producto no válido');
                return false;
            }
            
            console.log('🔄 useCarritoDeCompras - Llamando API eliminarProductoDelCarrito...');
            const response = await eliminarProductoDelCarrito(idProducto);
            console.log('📥 useCarritoDeCompras - Respuesta completa API:', response);
            console.log('📥 useCarritoDeCompras - ¿Tiene error?:', !!response.error);
            
            if (response.error) {
                const errorMsg = response.err?.response?.data?.message || 
                               response.err?.response?.data?.error || 
                               response.err?.message ||
                               'Error al eliminar producto';
                console.error('❌ useCarritoDeCompras - Error en respuesta:', errorMsg);
                console.error('❌ useCarritoDeCompras - Objeto error completo:', response.err);
                setError(errorMsg);
                return false;
            }
            
            console.log('✅ useCarritoDeCompras - API confirmó eliminación exitosa');
            console.log('🔄 useCarritoDeCompras - Recargando carrito desde servidor...');
            
            await obtenerCarrito();
            console.log('✅ useCarritoDeCompras - Carrito recargado desde servidor');
            console.log('=== FIN HOOK ELIMINACIÓN ===');
            return true;
        } catch (error) {
            console.error('❌ useCarritoDeCompras - Error catch:', error);
            setError('Error al eliminar producto del carrito');
            return false;
        } finally {
            setLoading(false);
        }
    }, [obtenerCarrito, carrito.length]);

    const getCantidadProductos = useCallback(() => {
        return carrito.reduce((total, producto) => total + producto.cantidad, 0);
    }, [carrito]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        carrito,
        loading,
        error,
        cantidadTotal,
        
        obtenerCarrito,
        agregarProducto,
        eliminarProducto,
        getCantidadProductos,
        clearError,
    
        isEmpty: carrito.length === 0,
        cantidadProductos: getCantidadProductos()
    };
};

export default useCarritoDeCompras;