import { useState, useCallback } from 'react';
import {
    procesarCompra,
    obtenerFacturasPorUsuario,
    obtenerFactura,
    editarFactura,
    anularFactura,
    descargarFacturaPDF
} from '../../services/api';

export const useFacturas = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const procesarCompraCarrito = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await procesarCompra();
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al procesar la compra');
            }

            const factura = response.data.factura;
            const mensaje = `¡Compra procesada exitosamente!\n\nFactura: #${factura.id.slice(-8).toUpperCase()}\nTotal: Q${factura.total.toFixed(2)}\nFecha: ${new Date(factura.fecha).toLocaleDateString('es-GT')}`;

            return {
                success: true,
                factura,
                mensaje,
                totalProductosVendidos: response.data.totalProductosVendidos,
                downloadUrl: response.data.downloadUrl
            };
            
        } catch (err) {
            const errorMessage = err.message || 'Error al procesar la compra';
            setError(errorMessage);
            
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const obtenerFacturas = useCallback(async (estado = null, idUsuario = null) => {
        setLoading(true);
        setError(null);

        try {
            const response = await obtenerFacturasPorUsuario(estado, idUsuario);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al obtener facturas');
            }

            return response.data.facturas || [];
            
        } catch (err) {
            const errorMessage = err.message || 'Error al obtener facturas';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const obtenerFacturaDetalle = useCallback(async (idFactura) => {
        setLoading(true);
        setError(null);

        try {
            const response = await obtenerFactura(idFactura);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al obtener la factura');
            }

            return response.data.factura;
            
        } catch (err) {
            const errorMessage = err.message || 'Error al obtener la factura';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const editarFacturaDetalle = useCallback(async (idFactura, productos) => {
        setLoading(true);
        setError(null);

        try {
            const response = await editarFactura(idFactura, { productos });
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al editar la factura');
            }

            return response.data.factura;
            
        } catch (err) {
            const errorMessage = err.message || 'Error al editar la factura';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const anularFacturaDetalle = useCallback(async (idFactura, motivo) => {
        setLoading(true);
        setError(null);

        try {
            const response = await anularFactura(idFactura, motivo);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al anular la factura');
            }

            return response.data.factura;
            
        } catch (err) {
            const errorMessage = err.message || 'Error al anular la factura';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const descargarPDFFactura = useCallback(async (idFactura) => {
        setLoading(true);
        setError(null);

        try {
            const response = await descargarFacturaPDF(idFactura);
            
            if (response.error) {
                throw new Error(response.err?.response?.data?.message || 'Error al descargar el PDF');
            }

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Factura_${idFactura.slice(-8).toUpperCase()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return true;
            
        } catch (err) {
            const errorMessage = err.message || 'Error al descargar el PDF';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const formatearFecha = useCallback((fecha) => {
        return new Date(fecha).toLocaleDateString('es-GT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    const formatearMoneda = useCallback((cantidad) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(cantidad);
    }, []);

    const calcularEstadisticasFacturas = useCallback((facturas) => {
        const totalFacturas = facturas.length;
        const facturasActivas = facturas.filter(f => f.estado === 'ACTIVA').length;
        const facturasAnuladas = facturas.filter(f => f.estado === 'ANULADA').length;
        const totalVentas = facturas
            .filter(f => f.estado === 'ACTIVA')
            .reduce((sum, f) => sum + f.total, 0);

        return {
            totalFacturas,
            facturasActivas,
            facturasAnuladas,
            totalVentas,
            promedioVenta: totalFacturas > 0 ? totalVentas / facturasActivas : 0
        };
    }, []);

    return {
        loading,
        error,
        procesarCompraCarrito,
        obtenerFacturas,
        obtenerFacturaDetalle,
        editarFacturaDetalle,
        anularFacturaDetalle,
        descargarPDFFactura,
        formatearFecha,
        formatearMoneda,
        calcularEstadisticasFacturas,
        clearError
    };
};
