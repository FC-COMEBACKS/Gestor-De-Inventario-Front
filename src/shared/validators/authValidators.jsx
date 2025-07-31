export const validateLogin = (data) => {
    const errors = {};

    if (!data.email) {
        errors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = "El email no es válido";
    }

    if (!data.password) {
        errors.password = "La contraseña es requerida";
    } else if (data.password.length < 6) {
        errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateRegister = (data) => {
    const errors = {};

    if (!data.name) {
        errors.name = "El nombre es requerido";
    } else if (data.name.length < 2) {
        errors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!data.surname) {
        errors.surname = "El apellido es requerido";
    } else if (data.surname.length < 2) {
        errors.surname = "El apellido debe tener al menos 2 caracteres";
    }

    if (!data.username) {
        errors.username = "El nombre de usuario es requerido";
    } else if (data.username.length < 3) {
        errors.username = "El nombre de usuario debe tener al menos 3 caracteres";
    }

    if (!data.email) {
        errors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = "El email no es válido";
    }

    if (!data.phone) {
        errors.phone = "El teléfono es requerido";
    } else if (data.phone.length !== 8) {
        errors.phone = "El teléfono debe tener exactamente 8 dígitos";
    } else if (!/^\d{8}$/.test(data.phone)) {
        errors.phone = "El teléfono debe contener solo números";
    }

    if (!data.password) {
        errors.password = "La contraseña es requerida";
    } else if (data.password.length < 8) {
        errors.password = "La contraseña debe tener al menos 8 caracteres";
    } else {
        const hasLowercase = /[a-z]/.test(data.password);
        const hasUppercase = /[A-Z]/.test(data.password);
        const hasNumbers = /\d/.test(data.password);
        const hasSymbols = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(data.password);

        if (!hasLowercase) {
            errors.password = "La contraseña debe contener al menos una letra minúscula";
        } else if (!hasUppercase) {
            errors.password = "La contraseña debe contener al menos una letra mayúscula";
        } else if (!hasNumbers) {
            errors.password = "La contraseña debe contener al menos un número";
        } else if (!hasSymbols) {
            errors.password = "La contraseña debe contener al menos un símbolo (!@#$%^&*...)";
        }
    }

    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = "Las contraseñas no coinciden";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};