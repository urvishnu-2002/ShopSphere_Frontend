import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Use a small timeout to ensure the initial mount is rendered before triggering the entrance animation
        const entranceTimer = setTimeout(() => setIsVisible(true), 10);

        const timer = setTimeout(() => {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

            if (token) {
                if (token === 'admin_guest_session') {
                    navigate('/dashboard');
                    return;
                }

                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
                    const payload = JSON.parse(atob(base64 + padding));

                    // Improved check: handles ADMIN, admin, or is_staff/is_superuser flags
                    const userRole = (payload.role || '').toUpperCase();
                    const isAllowed = userRole === 'ADMIN' ||
                        userRole === 'SUPER_ADMIN' ||
                        payload.is_staff === true ||
                        payload.is_superuser === true;

                    if (isAllowed) {
                        navigate('/dashboard');
                    } else {
                        console.warn("[Splash] User is authenticated but NOT an admin. Redirecting to login.");
                        // Clear them out to be safe
                        const keys = ["accessToken", "authToken", "refreshToken", "adminAuthenticated", "adminUsername"];
                        keys.forEach(k => { localStorage.removeItem(k); sessionStorage.removeItem(k); });
                        navigate('/login');
                    }
                } catch (e) {
                    navigate('/login');
                }
            } else {
                navigate('/login');
            }
        }, 3000);

        return () => {
            clearTimeout(timer);
            clearTimeout(entranceTimer);
        };
    }, [navigate]);


    return (
        <div className="fixed inset-0 bg-[#0f0720] flex flex-col items-center justify-center z-[9999] transition-opacity duration-1000">
            <div className={`flex flex-col items-center transition-all duration-1000 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                {/* Logo Container */}
                <div className="w-56 h-56 flex items-center justify-center p-0 mb-8">
                    <img
                        src="/s_logo.png"
                        alt="ShopSphere Logo"
                        className="w-full h-full object-contain animate-bounce drop-shadow-[0_0_35px_rgba(139,92,246,0.6)]"
                    />
                </div>

                {/* Brand Name */}
                <h1 className="text-4xl font-semibold tracking-normal text-white mb-2">
                    Shop<span className="bg-gradient-to-r from-emerald-400 to-fuchsia-500 bg-clip-text text-transparent">Sphere</span>
                </h1>

                <p className="text-emerald-300/40 text-sm font-medium tracking-normal uppercase">
                    Admin Portal
                </p>

                {/* Simple CSS Loading Bar */}
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-8">
                    <div className="h-full bg-emerald-500 animate-[loading_3s_ease-in-out_forwards]"></div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes loading {
                    0% { width: 0% }
                    100% { width: 100% }
                }
            `}} />
        </div>
    );
};

export default SplashScreen;
