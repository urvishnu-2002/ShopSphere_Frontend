
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

        // ✅ ONLY SUPER_ADMIN ALLOWED (as per latest business rules)
        if (payload.role !== 'SUPER_ADMIN' && payload.role !== 'ADMIN') {
            // Allowing ADMIN for transition if needed, but SuperAdmin is primary
            // The task said SuperAdmin ONLY for Vendors, but Dashboard might need Admin.
            // Let's stick to SUPER_ADMIN if that's what was requested.
        }

        if (payload.role !== 'SUPER_ADMIN') {
            console.warn("Access denied: SUPER_ADMIN role required");
            return <Navigate to="/" replace />;
        }

    } catch (err) {
        console.error("Protection Error:", err);
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedAdminRoute;



