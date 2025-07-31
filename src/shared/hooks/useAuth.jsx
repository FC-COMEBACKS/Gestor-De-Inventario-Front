import { useState, useEffect, useCallback } from "react";
import { login, register } from "../../services/api";
import { isUserDataComplete } from "../utils/userUtils";

export const useAuth = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = () => {
            try {
                const userData = localStorage.getItem("user");
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                }
            } catch (err) {
                console.error("Error al parsear datos de usuario:", err);
                localStorage.removeItem("user");
                setError("Error al cargar usuario");
            } finally {
                setLoading(false);
            }
        };
        
        checkUser();
    }, []);

    const handleLogin = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await login(data);
            
            if (response.error) {
                const errorMessage = response.err?.response?.data?.message || 
                                   response.err?.response?.data?.error || 
                                   "Error al iniciar sesión";
                setError(errorMessage);
                return { success: false, error: errorMessage };
            }
            

            const userData = response.data?.data || response.data;
            
            let completeUserData = userData;
            
            const userDetails = userData?.userDetails;
            const isDataIncomplete = !isUserDataComplete(userData) && 
                userDetails?.uid && 
                (!userDetails.name || !userDetails.email || !userDetails.username);
            
            if (isDataIncomplete) {
                try {
                    const { obtenerUsuarioPorId } = await import('../../services/api.jsx');
                    const userResponse = await obtenerUsuarioPorId(userData.userDetails.uid);
                    
                    if (userResponse && userResponse.data && userResponse.data.success) {
                     
                        completeUserData = {
                            ...userData,
                            userDetails: {
                                ...userData.userDetails,
                                ...userResponse.data.user,
                            
                                token: userData.userDetails.token
                            }
                        };
                    } else {
                        completeUserData = userData;
                    }
                } catch {
                    completeUserData = userData;
                }
            }
            
            localStorage.setItem("user", JSON.stringify(completeUserData));
            setUser(completeUserData);
            
            return { success: true, data: completeUserData };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                                err.response?.data?.error || 
                                "Error al iniciar sesión";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await register(data);
            
            if (response.error) {
                const errorMessage = response.err?.response?.data?.message || 
                                   response.err?.response?.data?.error || 
                                   "Error al registrarse";
                setError(errorMessage);
                return { success: false, error: errorMessage };
            }
            
            const userData = response.data;
            
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            
            return { success: true, data: userData };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                                err.response?.data?.error || 
                                "Error al registrarse";
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const logout = useCallback(() => {
        localStorage.removeItem("user");
        setUser(null);
        setError(null);
        return { success: true };
    }, []);

    const isAuthenticated = useCallback(() => {
        return user !== null;
    }, [user]);

    const getUser = useCallback(() => {
        return user;
    }, [user]);

    const getUserRole = useCallback(() => {
        if (!user) return null;
        
        const userRole = user?.userDetails?.role;
        
        return userRole;
    }, [user]);

    const getRedirectPath = useCallback((userData) => {
        const userRole = userData?.userDetails?.role;
        
        if (userRole === "ADMIN_ROLE") {
            return "/dashboard-admin";
        } else if (userRole === "CLIENT_ROLE") {
            return "/dashboard-user";
        } else {
        
            return "/dashboard-user";
        }
    }, []);

    const shouldRedirectToDashboard = useCallback(() => {
        if (user) {
            const userRole = user?.userDetails?.role;
            return userRole === "ADMIN_ROLE" || userRole === "CLIENT_ROLE";
        }
        return false;
    }, [user]);

    return {
        user,
        loading,
        error,
        handleLogin,
        handleRegister,
        logout,
        isAuthenticated,
        getUser,
        getUserRole,
        getRedirectPath,
        shouldRedirectToDashboard
    };
};

export default useAuth;