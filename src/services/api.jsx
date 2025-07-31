import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:3002/gestorInventario/v1",
    timeout: 10000,
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
    
    if (!idProducto || idProducto === '' || idProducto === null || idProducto === undefined) {
        console.error('❌ ID inválido');
        return {
            error: true,
            err: new Error('ID de producto inválido')
        };
    }
    
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