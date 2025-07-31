import { useState } from "react";
import { useAuth } from "../../shared/hooks/useAuth";
import { validateLogin } from "../../shared/validators/authValidators";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const LoginForm = ({ onSwitchToRegister }) => {
    const { handleLogin, loading, error, getRedirectPath, getUserRole } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validation = validateLogin(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        const result = await handleLogin(formData);
        if (result.success) {
            console.log('Login exitoso, datos del usuario:', result.data);
            console.log('Rol del usuario:', getUserRole());
            
            const redirectPath = getRedirectPath(result.data);
            console.log('Redirigiendo a:', redirectPath);
            
            setTimeout(() => {
                window.location.href = redirectPath;
            }, 100);
        }
    };

    return (
        <div className="login-form">
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
                <Input
                    label="Usuario o Correo Electrónico"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="usuario@ejemplo.com"
                    error={errors.email}
                    required
                />

                <Input
                    label="Contraseña"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    error={errors.password}
                    required
                />

                <div className="password-hint">
                    <small>La contraseña debe tener al menos 6 caracteres</small>
                </div>

                <div className="forgot-password">
                    <a href="#">¿Olvidaste tu contraseña?</a>
                </div>

                <Button 
                    type="submit" 
                    variant="primary"
                    className="btn-full"
                    loading={loading}
                >
                    {loading ? "Iniciando Sesión..." : "Iniciar Sesión"}
                </Button>
            </form>

            <div className="auth-link">
                <p>¿No tienes cuenta? 
                    <button 
                        type="button"
                        className="link-button"
                        onClick={onSwitchToRegister}
                    >
                        Regístrate aquí
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;