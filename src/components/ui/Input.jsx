export const Input = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    error,
    required = false,
    disabled = false,
    className = "",
    ...props
}) => {
    return (
        <div className="mb-3">
            {label && (
                <label htmlFor={name} className="form-label">
                    {label} {required && <span className="text-danger">*</span>}
                </label>
            )}
            <input
                type={type}
                className={`form-control ${error ? 'is-invalid' : ''} ${className}`}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                {...props}
            />
            {error && (
                <div className="invalid-feedback">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Input;