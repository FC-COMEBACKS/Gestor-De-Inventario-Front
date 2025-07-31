import React from 'react';

export const Table = ({ 
    columns, 
    data, 
    loading = false, 
    className = "",
    striped = true,
    hover = true,
    responsive = true,
    emptyMessage = "No hay datos disponibles"
}) => {
    const tableClasses = `table ${striped ? 'table-striped' : ''} ${hover ? 'table-hover' : ''} ${className}`;

    if (loading) {
        return (
            <div className="d-flex justify-content-center p-4">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    const TableContent = () => (
        <table className={tableClasses}>
            <thead>
                <tr>
                    {columns.map((column, index) => (
                        <th key={index} style={{ width: column.width }}>
                            {column.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.length === 0 ? (
                    <tr>
                        <td colSpan={columns.length} className="text-center text-muted py-4">
                            {emptyMessage}
                        </td>
                    </tr>
                ) : (
                    data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex}>
                                    {column.render ? column.render(row, rowIndex) : row[column.key || column.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );

    if (responsive) {
        return (
            <div className="table-responsive">
                <TableContent />
            </div>
        );
    }

    return <TableContent />;
};

export default Table;