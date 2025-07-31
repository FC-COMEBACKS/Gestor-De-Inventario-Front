export const Select = ({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder = "Seleccionar...",
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
            <select
                className={`form-select ${error ? 'is-invalid' : ''} ${className}`}
                id={name}
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <div className="invalid-feedback">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Select;