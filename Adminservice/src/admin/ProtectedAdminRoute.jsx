
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
    const token =
        localStorage.getItem('authToken') ||
        sessionStorage.getItem('authToken');

    if (!token) return <Navigate to="/" replace />;

    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) throw new Error('Invalid token');

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const padding = '='.repeat((4 - (base64.length % 4)) % 4);
        const payload = JSON.parse(atob(base64 + padding));

        const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'admin', 'super_admin'];
        if (!allowedRoles.includes(payload.role) && !payload.is_staff && !payload.is_superuser) {
            console.warn("Access denied: Admin role required, found:", payload.role);
            return <Navigate to="/" replace />;
        }

    } catch (err) {
        console.error("Protection Error:", err);
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedAdminRoute;



