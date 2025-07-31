export const Modal = ({ 
    show, 
    isOpen,
    onClose, 
    title, 
    children, 
    size = "md",
    centered = true 
}) => {
    const isVisible = show || isOpen;
    if (!isVisible) return null;

    const modalSizes = {
        sm: "modal-sm",
        md: "",
        lg: "modal-lg",
        xl: "modal-xl"
    };

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className={`modal-dialog ${modalSizes[size]} ${centered ? 'modal-dialog-centered' : ''}`}>
                <div className="modal-content">
                    {title && (
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={onClose}
                            ></button>
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;