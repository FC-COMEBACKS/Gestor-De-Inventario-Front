import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useAuth } from "../../shared/hooks/useAuth";
import "../../pages/auth/auth.css";

const AuthTabs = () => {
    const [activeTab, setActiveTab] = useState("login");
    const navigate = useNavigate();
    const { user, getRedirectPath } = useAuth();

    useEffect(() => {
        if (user) {
            const redirectPath = getRedirectPath(user);
            navigate(redirectPath, { replace: true });
        }
    }, [user, navigate, getRedirectPath]);

    if (user) {
        return null;
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-content">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <span className="auth-icon">📦</span>
                            <h1>Gestor de Inventario</h1>
                        </div>
                    </div>

                    <div className="auth-tabs">
                        <button 
                            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                            onClick={() => setActiveTab('login')}
                        >
                            Iniciar Sesión
                        </button>
                        <button 
                            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
                            onClick={() => setActiveTab('register')}
                        >
                            Registrarse
                        </button>
                    </div>

                    <div className="auth-tab-content">
                        {activeTab === 'login' ? (
                            <LoginForm onSwitchToRegister={() => setActiveTab('register')} />
                        ) : (
                            <RegisterForm onSwitchToLogin={() => setActiveTab('login')} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthTabs;