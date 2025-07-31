import { useState, useEffect, useCallback } from 'react';
import { procesarCompra, editarFactura, anularFactura, obtenerFacturasPorUsuario, descargarFacturaPDF } from '../../services/api';
import Swal from 'sweetalert2';

export const useFacturas = () => {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cargarFacturas = useCallback(async (estado = null, idUsuario = null) => {
        setLoading(true);
        setError(null);

        try {
            const userDetails = localStorage.getItem('user');
            let currentUserId = null;
            let isAdmin = false;
            
            if (userDetails) {
                try {
                    const parsedUser = JSON.parse(userDetails);
                    const userData = parsedUser?.userDetails || parsedUser;
                    currentUserId = userData?.uid || userData?._id;
                    isAdmin = userData?.role === 'ADMIN_ROLE';
                } catch (err) {
                    console.warn('Error al parsear usuario:', err);
                }
            }

    
            let targetUserId = idUsuario;
            if (!isAdmin && currentUserId) {
                targetUserId = currentUserId;
                console.log('🔒 Seguridad: Usuario no admin, limitando a sus facturas. User ID:', currentUserId);
            }

            const response = await obtenerFacturasPorUsuario(estado, targetUserId);

            if (response.error) {
                if (response.err?.response?.status === 404) {
                    setFacturas([]);
                    return { success: true, facturas: [] };
                }
                throw new Error(response.err?.response?.data?.message || 'Error al cargar facturas');
            }

            const { data } = response;

            if (data.success) {
                setFacturas(data.facturas || []);
                return { success: true, facturas: data.facturas || [] };
            } else {
                throw new Error(data.message || 'Error desconocido');
            }
        } catch (err) {
            const errorMessage = err.message || 'Error al cargar facturas';
            setError(errorMessage);
            setFacturas([]);
            
            console.error('❌ Error cargando facturas:', err);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    const procesarCompraCarrito = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await procesarCompra();

            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al procesar la compra');
            }

            const { data } = response;

            if (data.success) {
                const idFactura = data.factura._id;
                console.log('📄 Iniciando descarga automática del PDF para factura:', idFactura);
                
                let pdfDescargado = false;
                try {
                    const pdfResult = await descargarFacturaPDF(idFactura);
                    if (pdfResult.success) {
                        pdfDescargado = true;
                        console.log('✅ PDF descargado automáticamente');
                    } else {
                        console.log('⚠️ Error en descarga automática:', pdfResult.message);
                    }
                } catch (pdfError) {
                    console.error('⚠️ Error al descargar PDF automáticamente:', pdfError);
                }

                Swal.fire({
                    icon: 'success',
                    title: '¡Compra Exitosa!',
                    html: `
                        <div style="text-align: left;">
                            <p><strong>Factura generada exitosamente</strong></p>
                            <p>📋 <strong>ID:</strong> ${data.factura._id.slice(-8).toUpperCase()}</p>
                            <p>💰 <strong>Total:</strong> Q${data.factura.total.toFixed(2)}</p>
                            <p>📦 <strong>Productos vendidos:</strong> ${data.totalProductosVendidos}</p>
                            <p>📄 ${pdfDescargado ? '<strong>✅ PDF descargado automáticamente</strong>' : '⚠️ PDF disponible (usa el botón "Descargar PDF")'}</p>
                        </div>
                    `,
                    showConfirmButton: true,
                    confirmButtonText: 'Continuar'
                });

                cargarFacturas();

                return { success: true, factura: data.factura };
            } else {
                throw new Error(data.message || 'Error desconocido');
            }
        } catch (err) {
            const errorMessage = err.message || 'Error al procesar la compra';
            setError(errorMessage);
            
            Swal.fire({
                icon: 'error',
                title: 'Error al procesar compra',
                text: errorMessage,
                confirmButtonText: 'Entendido'
            });

            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [cargarFacturas]);

    const editarFacturaExistente = useCallback(async (idFactura, productosEditados) => {
        setLoading(true);
        setError(null);

        try {
            const response = await editarFactura(idFactura, {
                productos: productosEditados
            });

            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al editar factura');
            }

            const { data } = response;

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Factura Editada',
                    html: `
                        <div style="text-align: left;">
                            <p><strong>Factura actualizada exitosamente</strong></p>
                            <p>📋 <strong>ID:</strong> ${idFactura.slice(-8).toUpperCase()}</p>
                            <p>💰 <strong>Nuevo Total:</strong> Q${data.factura.total.toFixed(2)}</p>
                            <p>📄 PDF actualizado en el servidor</p>
                        </div>
                    `,
                    confirmButtonText: 'Continuar'
                });

                cargarFacturas();

                return { success: true, factura: data.factura };
            } else {
                throw new Error(data.message || 'Error desconocido');
            }
        } catch (err) {
            const errorMessage = err.message || 'Error al editar factura';
            setError(errorMessage);
            
            Swal.fire({
                icon: 'error',
                title: 'Error al editar factura',
                text: errorMessage,
                confirmButtonText: 'Entendido'
            });

            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [cargarFacturas]);

    const anularFacturaExistente = useCallback(async (idFactura, motivo = '') => {
        setLoading(true);
        setError(null);

        try {
            const confirmResult = await Swal.fire({
                icon: 'warning',
                title: '¿Anular Factura?',
                html: `
                    <div style="text-align: left;">
                        <p><strong>Esta acción no se puede deshacer</strong></p>
                        <p>📋 <strong>Factura:</strong> ${idFactura.slice(-8).toUpperCase()}</p>
                        <p>⚠️ Se restaurará el inventario de productos</p>
                    </div>
                `,
                input: 'textarea',
                inputLabel: 'Motivo de anulación (opcional):',
                inputValue: motivo,
                inputPlaceholder: 'Describe el motivo de la anulación...',
                showCancelButton: true,
                confirmButtonText: 'Sí, anular',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#e74c3c',
                cancelButtonColor: '#95a5a6'
            });

            if (!confirmResult.isConfirmed) {
                setLoading(false);
                return { success: false, cancelled: true };
            }

            const motivoAnulacion = confirmResult.value || motivo || 'Sin motivo especificado';

            const response = await anularFactura(idFactura, motivoAnulacion);

            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al anular factura');
            }

            const { data } = response;

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Factura Anulada',
                    html: `
                        <div style="text-align: left;">
                            <p><strong>Factura anulada exitosamente</strong></p>
                            <p>📋 <strong>ID:</strong> ${idFactura.slice(-8).toUpperCase()}</p>
                            <p>📅 <strong>Fecha anulación:</strong> ${new Date(data.factura.fechaAnulacion).toLocaleDateString()}</p>
                            <p>📝 <strong>Motivo:</strong> ${data.factura.motivoAnulacion}</p>
                            <p>🔄 Inventario restaurado</p>
                        </div>
                    `,
                    confirmButtonText: 'Continuar'
                });

                cargarFacturas();

                return { success: true, factura: data.factura };
            } else {
                throw new Error(data.message || 'Error desconocido');
            }
        } catch (err) {
            const errorMessage = err.message || 'Error al anular factura';
            setError(errorMessage);
            
            Swal.fire({
                icon: 'error',
                title: 'Error al anular factura',
                text: errorMessage,
                confirmButtonText: 'Entendido'
            });

            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [cargarFacturas]);

    const filtrarPorEstado = useCallback((estado) => {
        if (!estado || estado === 'TODAS') {
            return facturas;
        }
        return facturas.filter(factura => factura.estado === estado);
    }, [facturas]);

    const calcularEstadisticas = useCallback(() => {
        const stats = {
            total: facturas.length,
            activas: facturas.filter(f => f.estado === 'ACTIVA').length,
            anuladas: facturas.filter(f => f.estado === 'ANULADA').length,
            montoTotal: facturas.reduce((total, f) => f.estado === 'ACTIVA' ? total + f.total : total, 0),
            montoAnulado: facturas.reduce((total, f) => f.estado === 'ANULADA' ? total + f.total : total, 0)
        };
        return stats;
    }, [facturas]);

    useEffect(() => {
        cargarFacturas();
    }, [cargarFacturas]);

    return {
        facturas,
        loading,
        error,
        procesarCompraCarrito,
        cargarFacturas,
        editarFacturaExistente,
        anularFacturaExistente,
        filtrarPorEstado,
        calcularEstadisticas,
        setFacturas,
        setError
    };
};

export default useFacturas;