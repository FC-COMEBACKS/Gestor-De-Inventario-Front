import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FacturaDetail } from '../../components/factura';
import { useFacturas } from '../../shared/hooks';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components';

export const FacturaDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { facturas, loading } = useFacturas();

    const factura = facturas.find(f => f._id === id);

    if (loading) {
        return (
            <div className="factura-detail-page__loading">
                <LoadingSpinner size="large" />
                <p>Cargando detalle de factura...</p>
            </div>
        );
    }

    if (!factura) {
        return (
            <div className="factura-detail-page__not-found">
                <div className="factura-detail-page__not-found-icon">📋</div>
                <h2>Factura no encontrada</h2>
                <p>La factura que buscas no existe o no tienes permisos para verla.</p>
                <Button onClick={() => navigate('/facturas')}>
                    ← Volver a Facturas
                </Button>
            </div>
        );
    }

    return (
        <div className="factura-detail-page">
            <div className="factura-detail-page__header">
                <Button
                    variant="outline"
                    onClick={() => navigate('/facturas')}
                >
                    ← Volver a Facturas
                </Button>
                <h1 className="factura-detail-page__title">
                    Detalle de Factura #{factura._id.slice(-8).toUpperCase()}
                </h1>
            </div>

            <div className="factura-detail-page__content">
                <FacturaDetail factura={factura} />
            </div>

            <style>{`
                .factura-detail-page {
                    padding: 2rem;
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .factura-detail-page__header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #e9ecef;
                }

                .factura-detail-page__title {
                    margin: 0;
                    color: #2c3e50;
                    font-size: 1.8rem;
                    font-weight: 600;
                }

                .factura-detail-page__content {
                    background-color: white;
                    border-radius: 12px;
                    padding: 2rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .factura-detail-page__loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem;
                    color: #6c757d;
                }

                .factura-detail-page__loading p {
                    margin-top: 1rem;
                    font-size: 1.1rem;
                }

                .factura-detail-page__not-found {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem;
                    text-align: center;
                    color: #6c757d;
                }

                .factura-detail-page__not-found-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }

                .factura-detail-page__not-found h2 {
                    color: #2c3e50;
                    margin-bottom: 1rem;
                }

                .factura-detail-page__not-found p {
                    margin-bottom: 2rem;
                    font-size: 1.1rem;
                }

                @media (max-width: 768px) {
                    .factura-detail-page {
                        padding: 1rem;
                    }

                    .factura-detail-page__content {
                        padding: 1rem;
                    }

                    .factura-detail-page__header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }

                    .factura-detail-page__title {
                        font-size: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default FacturaDetailPage;