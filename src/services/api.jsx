import axios from "axios";

const api = axios.create({
    baseURL: "https://gestor-de-inventario-backend.vercel.app/gestorInventario/v1",
    timeout: 3000,
    httpsAgent: false
});

api.interceptors.request.use(
    (config) => {
        const userDetails = localStorage.getItem("user");

        if (userDetails) {
            try {
                const parsedUser = JSON.parse(userDetails);
                const token = parsedUser?.userDetails?.token || parsedUser?.token;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (err) {
                console.warn("Error al leer el token:", err);
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuesta para manejar tokens expirados
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401 && 
            !window.location.pathname.includes('/auth') &&
            error.response.data?.error?.includes('token') &&
            error.response.data?.error?.includes('expired')) {
            
            localStorage.removeItem('user');
            window.location.href = '/auth';
        }
        
        return Promise.reject(error);
    }
);

// AUTH
export const login = async (data) => {
    try {
        return await api.post("/auth/login", data);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const register = async (data) => {
    try {
        return await api.post("/auth/register", data);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

// CATEGORIA
export const listarCategorias = async (limite = 10, desde = 0) => {
    try {
        const response = await api.get(`/categoria/listarCategorias?limite=${limite}&desde=${desde}`);
        return response;
    } catch (err) {
        console.error("❌ Error en listarCategorias:", err);
        return {
            error: true,
            err
        }
    }
}

export const crearCategoria = async (data) => {
    try {
        return await api.post("/categoria/crearCategoria", data);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const editarCategoria = async (uid, data) => {
    try {
        return await api.put(`/categoria/editarCategoria/${uid}`, data);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const eliminarCategoria = async (uid) => {
    try {
        return await api.delete(`/categoria/eliminarCategoria/${uid}`);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

// USUARIOS
export const listarUsuarios = async (limite = 10, desde = 0) => {
    try {
        return await api.get(`/user?limite=${limite}&desde=${desde}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const obtenerUsuarioPorId = async (uid) => {
    try {
        return await api.get(`/user/findUser/${uid}`);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const actualizarUsuario = async (uid, data) => {
    try {
        return await api.put(`/user/updateUser/${uid}`, data);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const actualizarContrasena = async (uid, data) => {
    try {
        return await api.patch(`/user/updatePassword/${uid}`, data);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const actualizarRol = async (uid, data) => {
    try {
        return await api.patch(`/user/updateRole/${uid}`, data);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const eliminarUsuario = async (uid) => {
    try {
        return await api.delete(`/user/deleteUser/${uid}`);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const eliminarCuenta = async (uid, data) => {
    try {
        return await api.delete(`/user/eliminarCuenta/${uid}`, { data });
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

// PRODUCTOS
export const listarProductos = async () => {
    try {
        const response = await api.get("/producto/ListarProductos");
        return response;
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const obtenerProductoPorId = async (id) => {
    try {
        const response = await api.get(`/producto/listarProductoPorId/${id}`);
        return response;
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const crearProducto = async (data) => {
    try {
        const response = await api.post("/producto/agregarProducto", data);
        return response;
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const actualizarProducto = async (id, data) => {
    try {
        const response = await api.put(`/producto/actualizarProducto/${id}`, data);
        return response;
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const eliminarProducto = async (id) => {
    try {
        const response = await api.delete(`/producto/eliminarProducto/${id}`);
        return response;
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const obtenerProductosAgotados = async () => {
    try {
        const response = await api.get("/producto/productosAgotados");
        return response;
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const obtenerProductosMasVendidos = async () => {
    try {
        const response = await api.get("/producto/productosMasVendidos");
        return response;
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const buscarProductosPorNombre = async (nombreProducto) => {
    try {
        const response = await api.post("/producto/buscarProductosPorNombre", {
            nombreProducto: nombreProducto
        });
        return response;
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const obtenerProductosPorCategoria = async (categoriaId) => {
    try {
        const response = await api.get(`/producto/productosPorCategoria/${categoriaId}`);
        return response;
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

// CARRITO DE COMPRAS
export const agregarProductoAlCarrito = async (data) => {
    try {
        const response = await api.post("/carritoDeCompras/agregarProducto", data);
        return response;
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const listarProductosCarrito = async () => {
    try {
        const response = await api.get("/carritoDeCompras/listarCarrito");
        return response;
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const eliminarProductoDelCarrito = async (idProducto) => {
    console.log('🗑️ API - Eliminar producto del carrito');
    console.log('🎯 ID recibido (idProducto):', idProducto);
    
    // Validar que el ID no esté vacío
    if (!idProducto || idProducto === '' || idProducto === null || idProducto === undefined) {
        console.error('❌ ID inválido');
        return {
            error: true,
            err: new Error('ID de producto inválido')
        };
    }
    
    // Obtener info del usuario para debugging
    const userDetails = localStorage.getItem("user");
    if (userDetails) {
        try {
            const parsedUser = JSON.parse(userDetails);
            const userId = parsedUser?.userDetails?.uid || parsedUser?.uid;
            console.log('👤 Usuario:', parsedUser?.userDetails?.nombre || 'Sin nombre');
            console.log('🆔 User ID:', userId);
        } catch (err) {
            console.warn('⚠️ Error al parsear usuario:', err);
        }
    }
    
    try {
        console.log('📡 Enviando DELETE request...');
        console.log('📦 ID del producto a eliminar:', idProducto);
        console.log('🔗 URL:', '/carritoDeCompras/eliminarProducto');
        
        const response = await api.delete("/carritoDeCompras/eliminarProducto", {
            data: { idProducto }
        });
        
        console.log('✅ ÉXITO - Status:', response.status);
        console.log('✅ ÉXITO - Mensaje:', response.data?.message);
        
        return response;
        
    } catch (err) {
        console.error('❌ ERROR - Status:', err.response?.status);
        console.error('❌ ERROR - Mensaje:', err.response?.data?.message || err.message);
        console.error('❌ ERROR - URL:', err.config?.url);
        console.error('❌ ERROR - Method:', err.config?.method);
        console.error('❌ ERROR - Data enviada:', err.config?.data);
        console.error('❌ ERROR - Response completa:', err.response?.data);
        
        return {
            error: true,
            err
        };
    }
}

// FACTURAS
export const procesarCompra = async () => {
    try {
        const response = await api.post("/factura/procesarCompra");
        return response;
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const obtenerFacturasPorUsuario = async (estado = null, idUsuario = null) => {
    try {
        let params = '';
        if (estado) params += `estado=${estado}`;
        if (idUsuario) params += `${params ? '&' : ''}idUsuario=${idUsuario}`;
        
        const response = await api.get(`/factura/obtenerFacturasPorUsuario${params ? '?' + params : ''}`);
        return response;
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const obtenerFactura = async (idFactura) => {
    try {
        const response = await api.get(`/factura/obtenerFactura/${idFactura}`);
        return response;
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const editarFactura = async (idFactura, data) => {
    try {
        const response = await api.put(`/factura/editarFactura/${idFactura}`, data);
        return response;
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const anularFactura = async (idFactura, motivo) => {
    try {
        const response = await api.patch(`/factura/anularFactura/${idFactura}`, { motivo });
        return response;
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const descargarFacturaPDF = async (idFactura) => {
    try {
        const response = await api.get(`/factura/descargarPDF/${idFactura}`, {
            responseType: 'blob'
        });
        return response;
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

