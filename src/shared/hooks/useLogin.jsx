import { useState } from "react";
import { login } from "../../services/api";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const res = await login(credentials);
            const user = res.data.userDetails;
            localStorage.setItem("user", JSON.stringify(user));
            return { success: true, user };
        } catch (err) {
            setError(
                err.response?.data?.message || "Error al iniciar sesión"
            );
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, loading, error };
};

export default useLogin;