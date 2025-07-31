import React from 'react';
import { Button } from '../ui/Button';

const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    loading = false 
}) => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage + 1 - delta);
            i <= Math.min(totalPages - 1, currentPage + 1 + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage + 1 - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + 1 + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const pages = getVisiblePages();

    return (
        <nav aria-label="Paginación de categorías">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 0 || loading}
                    >
                        Anterior
                    </button>
                </li>

                {pages.map((page, index) => (
                    <li key={index} className={`page-item ${page === currentPage + 1 ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}>
                        {page === '...' ? (
                            <span className="page-link">...</span>
                        ) : (
                            <button
                                className="page-link"
                                onClick={() => onPageChange(page - 1)}
                                disabled={loading}
                            >
                                {page}
                            </button>
                        )}
                    </li>
                ))}

                <li className={`page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1 || loading}
                    >
                        Siguiente
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;