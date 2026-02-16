import React, { useState } from 'react';
import { loginUser } from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { motion } from "framer-motion";

function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await loginUser({
                email: credentials.email,
                password: credentials.password,
            });

            console.log("Login success:", data);

            // optional: save token / user
            localStorage.setItem("user", JSON.stringify(data));
            toast.success("Login successful! Welcome back.");

            navigate("/");
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Animated Background Image */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{
                    scale: 1,
                    transition: { duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }
                }}
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2000&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Overlay Gradient for better readability */}
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#2e1065]/60 via-[#1e1b4b]/80 to-black/90 backdrop-blur-[2px]" />

            {/* Decorative Floating Elements */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-20 -right-20 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        rotate: [0, -5, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-20 -left-20 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[100px]"
                />
            </div>

            {/* Main Content Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-30 w-full max-w-md px-6"
            >
                {/* Login Card with enhanced Glassmorphism */}
                <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-8 sm:p-12 overflow-hidden relative">
                    {/* Top gradient accent */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500" />

                    {/* Logo / Brand Section */}
                    <div className="text-center mb-10">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="mx-auto w-28 h-28"
                        >
                            <img src="s_logo.png" alt="logo" className="w-24 h-24 object-contain" />
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2 flex justify-center gap-1">
                            <span>Shop</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Sphere</span>
                        </h1>
                        <p className="text-violet-200/60 text-sm font-medium">
                            Experience the future of shopping
                        </p>
                    </div>

                    {/* Section Label */}
                    <div className="mb-8 flex flex-col items-center">
                        <h2 className="text-xl font-bold text-white mb-2">
                            Welcome Back
                        </h2>
                        <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
                    </div>

                    {/* Login Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email Input Group */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-xs font-bold text-violet-200/70 uppercase tracking-widest ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-violet-400/50 group-focus-within:text-violet-400 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-violet-300/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 focus:bg-white/10"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input Group */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label htmlFor="password" className="block text-xs font-bold text-violet-200/70 uppercase tracking-widest">
                                    Password
                                </label>
                                <a href="#" className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors">
                                    Forgot?
                                </a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-violet-400/50 group-focus-within:text-violet-400 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-violet-300/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 focus:bg-white/10"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Error Notification */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Action Button */}
                        <div className="pt-2">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className={`group relative w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black rounded-2xl shadow-2xl shadow-violet-600/30 transition-all duration-300 hover:shadow-violet-600/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#1e1b4b] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                <span className="flex items-center justify-center gap-3">
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span className="tracking-widest uppercase text-xs">Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="tracking-widest uppercase text-xs">Sign In to ShopSphere</span>
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </>
                                    )}
                                </span>
                            </motion.button>
                        </div>
                    </form>
                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
                            <span className="bg-[#1a1642] px-4 text-violet-400/60">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Login Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="w-full py-4 px-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-center gap-3 text-gray-700 font-bold shadow-sm hover:shadow-md hover:bg-gray-50/50 transition-all duration-300"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span className="text-sm">Sign in with Google</span>
                    </motion.button>

                    {/* Footer Links */}
                    <div className="mt-10 text-center">
                        <p className="text-violet-300/50 text-sm">
                            New to our platform?{' '}
                            <Link to="/signup" className="font-bold text-white hover:text-fuchsia-400 transition-colors ml-1">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Copyright info */}
                <p className="text-center text-violet-400/30 text-[10px] mt-8 uppercase tracking-[0.2em]">
                    © 2026 ShopSphere Premium Identity. Secure Access.
                </p>
            </motion.div>
        </div>
    );
}

export default Login;
