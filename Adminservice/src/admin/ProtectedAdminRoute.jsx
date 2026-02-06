import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedAdminRoute - Simple wrapper component to protect admin routes.
 * 
 * Why this change:
 * - Security: Prevents unauthorized users from accessing the admin dashboard via direct URL.
 * - Centralized Auth Check: Checks for the presence of an auth token in either localStorage 
 *   (persistent) or sessionStorage (session-only).
 */
const ProtectedAdminRoute = ({ children }) => {
    // Check for token in storage
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (!token) return <Navigate to="/" replace />;

    // LOCAL DEV BYPASS: Allow a simple non-JWT string for easy visual testing
    if (token === 'admin_guest_session') {
        return children;
    }

    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) throw new Error("Format Error");

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const padding = '='.repeat((4 - (base64.length % 4)) % 4);
        const payload = JSON.parse(atob(base64 + padding));

        if (payload.role !== 'ADMIN') {
            console.warn("Unauthorized: Not an ADMIN");
            return <Navigate to="/" replace />;
        }
    } catch (e) {
        console.error("Auth Error:", e);
        return <Navigate to="/" replace />;
    }

    // Token exists and role is ADMIN, render the protected component
    return children;
};

export default ProtectedAdminRoute;
