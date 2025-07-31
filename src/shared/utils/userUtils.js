export const createCompleteUserData = (partialUserData) => {
    const userDetails = partialUserData?.userDetails || {};
    
    return {
        ...partialUserData,
        userDetails: {
            uid: userDetails.uid || 'temp-uid',
            name: userDetails.name || 'Usuario',
            surname: userDetails.surname || 'Temporal',
            username: userDetails.username || 'usuario_temp',
            email: userDetails.email || 'usuario@temp.com',
            phone: userDetails.phone || '00000000',
            role: userDetails.role || 'CLIENT_ROLE',
            token: userDetails.token,
            profilePicture: userDetails.profilePicture,
            ...userDetails
        }
    };
};

export const isUserDataComplete = (userData) => {
    const userDetails = userData?.userDetails;
    if (!userDetails) return false;
    
    const requiredFields = ['uid', 'name', 'surname', 'username', 'email', 'role'];
    return requiredFields.every(field => userDetails[field] && userDetails[field] !== 'N/A');
};

export const extractToken = (userData) => {
    return userData?.userDetails?.token || userData?.token;
};

export const extractUID = (userData) => {
    return userData?.userDetails?.uid || userData?.uid;
};

export const extractRole = (userData) => {
    return userData?.userDetails?.role || userData?.role;
};