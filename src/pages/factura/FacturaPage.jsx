import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FacturaList } from '../../components/factura/FacturaList';
import { Button } from '../../components/ui/Button';
import { useFacturas } from '../../shared/hooks';

export const FacturaPage = () => {
    const navigate = useNavigate();
    const {
        facturas,
        loading,
        error,
        cargarFacturas,
        anularFacturaExistente,
        calcularEstadisticas
    } = useFacturas();

    const [_usuario, setUsuario] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const userDetails = localStorage.getItem('user');
        if (userDetails) {
            try {
                const parsedUser = JSON.parse(userDetails);
                const userData = parsedUser?.userDetails || parsedUser;
                setUsuario(userData);
                setIsAdmin(userData?.role === 'ADMIN_ROLE');
            } catch (err) {
                console.error('Error al obtener información del usuario:', err);
            }
        }
    }, []);

    const handleAnularFactura = async (idFactura) => {
        await anularFacturaExistente(idFactura);
    };

    const handleRefresh = () => {
        cargarFacturas();
    };

    const estadisticas = calcularEstadisticas();

    return (
        <div className="factura-page">
            <div className="factura-page__header">
                <div className="factura-page__header-content">
                    <div className="factura-page__title-section">
                        <h1 className="factura-page__title">
                            📋 Gestión de Facturas
                        </h1>
                        <p className="factura-page__subtitle">
                            {isAdmin 
                                ? 'Administra todas las facturas del sistema'
                                : 'Consulta tu historial de compras'
                            }
                        </p>
                    </div>
                    <div className="factura-page__actions">
                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                            disabled={loading}
                        >
                            🔄 Actualizar
                        </Button>
                        {!isAdmin && (
                            <Button
                                variant="primary"
                                onClick={() => navigate('/carrito')}
                            >
                                🛒 Ir al Carrito
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {}
            {facturas.length > 0 && (
                <div className="factura-page__stats">
                    <div className="factura-page__stats-grid">
                        <div className="factura-page__stat-card">
                            <div className="factura-page__stat-icon">📋</div>
                            <div className="factura-page__stat-content">
                                <span className="factura-page__stat-value">
                                    {estadisticas.total}
                                </span>
                                <span className="factura-page__stat-label">
                                    Total Facturas
                                </span>
                            </div>
                        </div>

                        <div className="factura-page__stat-card">
                            <div className="factura-page__stat-icon">✅</div>
                            <div className="factura-page__stat-content">
                                <span className="factura-page__stat-value">
                                    {estadisticas.activas}
                                </span>
                                <span className="factura-page__stat-label">
                                    Activas
                                </span>
                            </div>
                        </div>

                        <div className="factura-page__stat-card">
                            <div className="factura-page__stat-icon">❌</div>
                            <div className="factura-page__stat-content">
                                <span className="factura-page__stat-value">
                                    {estadisticas.anuladas}
                                </span>
                                <span className="factura-page__stat-label">
                                    Anuladas
                                </span>
                            </div>
                        </div>

                        <div className="factura-page__stat-card factura-page__stat-card--highlight">
                            <div className="factura-page__stat-icon">💰</div>
                            <div className="factura-page__stat-content">
                                <span className="factura-page__stat-value">
                                    Q{estadisticas.montoTotal.toFixed(2)}
                                </span>
                                <span className="factura-page__stat-label">
                                    Monto Total
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {}
            {error && (
                <div className="factura-page__error">
                    <div className="factura-page__error-content">
                        <span className="factura-page__error-icon">⚠️</span>
                        <span className="factura-page__error-message">{error}</span>
                        <button 
                            className="factura-page__error-retry"
                            onClick={handleRefresh}
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            )}

            {}
            <div className="factura-page__content">
                <FacturaList
                    facturas={facturas}
                    loading={loading}
                    onAnular={handleAnularFactura}
                    isAdmin={isAdmin}
                    showFilters={true}
                />
            </div>

            {}
            {!isAdmin && facturas.length === 0 && !loading && (
                <div className="factura-page__info">
                    <div className="factura-page__info-content">
                        <h3>🛒 ¿Cómo generar una factura?</h3>
                        <div className="factura-page__info-steps">
                            <div className="factura-page__info-step">
                                <span className="factura-page__info-step-number">1</span>
                                <span>Agrega productos a tu carrito de compras</span>
                            </div>
                            <div className="factura-page__info-step">
                                <span className="factura-page__info-step-number">2</span>
                                <span>Revisa tu carrito y confirma los productos</span>
                            </div>
                            <div className="factura-page__info-step">
                                <span className="factura-page__info-step-number">3</span>
                                <span>Procesa la compra para generar la factura</span>
                            </div>
                            <div className="factura-page__info-step">
                                <span className="factura-page__info-step-number">4</span>
                                <span>Tu factura aparecerá aquí automáticamente</span>
                            </div>
                        </div>
                        <Button
                            variant="primary"
                            size="large"
                            onClick={() => navigate('/catalogo')}
                            className="factura-page__info-button"
                        >
                            🛍️ Explorar Productos
                        </Button>
                    </div>
                </div>
            )}

            <style>{`
                .factura-page {
                    min-height: 100vh;
                    background-color: #f8f9fa;
                }

                .factura-page__header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 2rem 0;
                    margin-bottom: 2rem;
                }

                .factura-page__header-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .factura-page__title {
                    margin: 0 0 0.5rem 0;
                    font-size: 2.5rem;
                    font-weight: 700;
                }

                .factura-page__subtitle {
                    margin: 0;
                    font-size: 1.1rem;
                    opacity: 0.9;
                }

                .factura-page__actions {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .factura-page__stats {
                    max-width: 1200px;
                    margin: 0 auto 2rem auto;
                    padding: 0 1rem;
                }

                .factura-page__stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                }

                .factura-page__stat-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    transition: transform 0.2s ease;
                }

                .factura-page__stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .factura-page__stat-card--highlight {
                    background: linear-gradient(135deg, #27ae60, #2ecc71);
                    color: white;
                }

                .factura-page__stat-icon {
                    font-size: 2rem;
                }

                .factura-page__stat-content {
                    display: flex;
                    flex-direction: column;
                }

                .factura-page__stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 0.25rem;
                }

                .factura-page__stat-label {
                    font-size: 0.9rem;
                    opacity: 0.8;
                }

                .factura-page__error {
                    max-width: 1200px;
                    margin: 0 auto 2rem auto;
                    padding: 0 1rem;
                }

                .factura-page__error-content {
                    background-color: #fff5f5;
                    border: 1px solid #fed7d7;
                    border-radius: 12px;
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .factura-page__error-icon {
                    font-size: 1.5rem;
                    color: #e53e3e;
                }

                .factura-page__error-message {
                    flex: 1;
                    color: #744d47;
                    font-weight: 500;
                }

                .factura-page__error-retry {
                    background-color: #e53e3e;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .factura-page__error-retry:hover {
                    background-color: #c53030;
                }

                .factura-page__content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }

                .factura-page__info {
                    max-width: 800px;
                    margin: 2rem auto;
                    padding: 0 1rem;
                }

                .factura-page__info-content {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }

                .factura-page__info h3 {
                    color: #2c3e50;
                    margin-bottom: 1.5rem;
                    font-size: 1.3rem;
                }

                .factura-page__info-steps {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    text-align: left;
                }

                .factura-page__info-step {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                }

                .factura-page__info-step-number {
                    background-color: #667eea;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 0.9rem;
                    flex-shrink: 0;
                }

                .factura-page__info-button {
                    margin-top: 1rem;
                }

                @media (max-width: 768px) {
                    .factura-page__header-content {
                        flex-direction: column;
                        gap: 1.5rem;
                        text-align: center;
                    }

                    .factura-page__title {
                        font-size: 2rem;
                    }

                    .factura-page__actions {
                        justify-content: center;
                    }

                    .factura-page__stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .factura-page__stat-card {
                        padding: 1rem;
                    }

                    .factura-page__stat-value {
                        font-size: 1.25rem;
                    }
                }

                @media (max-width: 480px) {
                    .factura-page__stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .factura-page__info-content {
                        padding: 1.5rem;
                    }

                    .factura-page__info-steps {
                        text-align: center;
                    }

                    .factura-page__info-step {
                        flex-direction: column;
                        text-align: center;
                        gap: 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default FacturaPage;