export const getDashboardRoute = () => {
    try {
        const userDetails = localStorage.getItem("user");
        if (userDetails) {
            const parsedUser = JSON.parse(userDetails);
            const role = parsedUser?.userDetails?.role || parsedUser?.role;
            
            if (role === 'ADMIN_ROLE') {
                return '/dashboard-admin';
            } else {
                return '/dashboard-user';
            }
        }
    } catch (err) {
        console.warn("Error al obtener rol del usuario:", err);
    }
    
    return '/dashboard-user';
};

export const navigateToDashboard = (navigate) => {
    const dashboardRoute = getDashboardRoute();
    navigate(dashboardRoute);
};
