export const Button = ({ 
    children, 
    variant = "primary", 
    size = "md", 
    type = "button", 
    disabled = false, 
    loading = false,
    className = "",
    onClick,
    ...props 
}) => {
    const baseClasses = "btn";
    const variantClasses = {
        primary: "btn-primary",
        secondary: "btn-secondary", 
        success: "btn-success",
        danger: "btn-danger",
        warning: "btn-warning",
        info: "btn-info",
        light: "btn-light",
        dark: "btn-dark",
        outline: "btn-outline-primary"
    };
    
    const sizeClasses = {
        sm: "btn-sm",
        md: "",
        lg: "btn-lg"
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && (
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            )}
            {children}
        </button>
    );
};

export default Button;