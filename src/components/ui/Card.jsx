export const Card = ({ 
    children, 
    title, 
    className = "", 
    shadow = true,
    ...props 
}) => {
    const cardClasses = `card ${shadow ? 'shadow' : ''} ${className}`;

    return (
        <div className={cardClasses} {...props}>
            {title && (
                <div className="card-header">
                    <h5 className="card-title mb-0">{title}</h5>
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
        </div>
    );
};

export default Card;