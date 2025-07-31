import { useState } from 'react';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import './auth.css';

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState('login');

    return (
        <div className="auth-page">
            <div className="auth-container">
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
    );
};

export default AuthPage;