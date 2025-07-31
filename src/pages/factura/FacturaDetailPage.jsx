import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FacturaDetail } from '../../components/factura';
import './FacturaDetailPage.css';

export const FacturaDetailPage = () => {
    const { id: facturaId } = useParams();
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const userDetails = localStorage.getItem("user");
        if (userDetails) {
            try {
                const parsedUser = JSON.parse(userDetails);
                const role = parsedUser?.userDetails?.role || parsedUser?.role;
                setUserRole(role);
            } catch (err) {
                console.warn("Error al leer datos del usuario:", err);
            }
        }
    }, []);

    const handleClose = () => {
        navigate('/facturas', { replace: true });
    };

    const handleUpdate = () => {
        console.log('Factura actualizada');
    };

    if (!facturaId) {
        return (
            <div className="factura-detail-page-error">
                <h2>Error</h2>
                <p>No se proporcionó un ID de factura válido</p>
                <button onClick={() => navigate('/facturas')}>
                    ← Volver a Facturas
                </button>
            </div>
        );
    }

    return (
        <div className="factura-detail-page">
            <div className="page-background">
                <FacturaDetail
                    facturaId={facturaId}
                    onClose={handleClose}
                    onUpdate={handleUpdate}
                    userRole={userRole}
                />
            </div>
        </div>
    );
};