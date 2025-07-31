import { useState } from "react";
import { useAuth } from "../../shared/hooks/useAuth";
import { validateRegister } from "../../shared/validators/authValidators";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const RegisterForm = ({ onSwitchToLogin }) => {
    const { handleRegister, loading, error, getRedirectPath } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        username: "", 
        email: "",
        password: "",
        phone: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'phone') {
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 8) {
                setFormData(prev => ({
                    ...prev,
                    [name]: numericValue
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validation = validateRegister(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        const { confirmPassword: _confirmPassword, ...dataToSend } = formData;
        
        const result = await handleRegister(dataToSend);
        if (result.success) {
            const redirectPath = getRedirectPath(result.data);
            window.location.href = redirectPath; 
        }
    };

    return (
        <div className="register-form">
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-row">
                    <Input
                        label="Nombre"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        error={errors.name}
                        required
                    />
                    
                    <Input
                        label="Apellido"
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        placeholder="Tu apellido"
                        error={errors.surname}
                        required
                    />
                </div>

                <Input
                    label="Nombre de usuario"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="usuario123"
                    error={errors.username}
                    required
                />

                <Input
                    label="Correo Electrónico"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    error={errors.email}
                    required
                />

                <Input
                    label="Teléfono (8 dígitos)"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="12345678"
                    error={errors.phone}
                    maxLength="8"
                    pattern="[0-9]{8}"
                    required
                />

                <Input
                    label="Contraseña"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mín. 8 caracteres, mayúscula, minúscula, número y símbolo"
                    error={errors.password}
                    required
                />

                <div className="password-hint">
                    <small>
                        La contraseña debe contener al menos:
                        • 8 caracteres • 1 mayúscula • 1 minúscula • 1 número • 1 símbolo
                    </small>
                </div>

                <Input
                    label="Confirmar Contraseña"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite tu contraseña"
                    error={errors.confirmPassword}
                    required
                />

                <Button 
                    type="submit" 
                    variant="success"
                    className="btn-full"
                    loading={loading}
                >
                    {loading ? "Registrando..." : "Crear Cuenta"}
                </Button>
            </form>

            <div className="auth-link">
                <p>¿Ya tienes cuenta? 
                    <button 
                        type="button"
                        className="link-button"
                        onClick={onSwitchToLogin}
                    >
                        Inicia sesión aquí
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;