import { LoginForm } from "../../components/auth/LoginForm";
import "./auth.css";

export const LoginPage = () => {
    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-content">
                    <div className="auth-brand">
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png"
                            alt="Gestor de Inventario"
                            className="brand-icon"
                        />
                        <h1>Gestor de Inventario</h1>
                    </div>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};