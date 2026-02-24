import React, { useState } from 'react';
import { loginUser, googleLogin } from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { useGoogleLogin } from "@react-oauth/google";
import { validateEmail, validatePassword } from "../../utils/validators";
function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError('');
        setFieldErrors(prev => ({ ...prev, [e.target.name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailErr = validateEmail(credentials.email);
        const pwErr = !credentials.password ? "Password is required." : null;
        if (emailErr || pwErr) {
            setFieldErrors({ email: emailErr, password: pwErr });
            setError(emailErr || pwErr);
            return;
        }
        setLoading(true);
        setError("");

        try {
            const data = await loginUser({
                email: credentials.email,
                password: credentials.password,
            });

            console.log("Login success:", data);

            // Save user data (now includes email from backend)
            localStorage.setItem("user", JSON.stringify(data));
            localStorage.removeItem("selectedAddress");
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
    //Google
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // Get user info from Google
                const res = await fetch(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${tokenResponse.access_token}`,
                        },
                    }
                );


                const user = await res.json();
                console.log("Google user info from Google API:", user);

                // Send user info to our backend to get JWT tokens
                // Now calling the CORRECT imported googleLogin function from axios.js
                const backendData = await googleLogin({
                    email: user.email,
                    name: user.name,
                    picture: user.picture
                });

                console.log("Backend Google login success:", backendData);

                // Save tokens and user info (axios.js already saves tokens, but we save user profile)
                localStorage.setItem("user", JSON.stringify(backendData));
                localStorage.removeItem("selectedAddress");

                toast.success("Logged in with Google!");
                navigate("/");

            } catch (err) {
                console.error("Google login error:", err);
                toast.error("Google login failed internally");
            }
        },
        onError: () => {
            toast.error("Google login failed");
        },
    });


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff] p-4 lg:p-6 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
            </div>

            {/* Top gradient bar */}
            <div className="fixed top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 via-purple-500 to-purple-500 z-50"></div>

            {/* Main Container */}
            <div className="relative w-full max-w-6xl flex bg-white/40 backdrop-blur-3xl rounded-[40px] shadow-2xl overflow-hidden border border-white/50">

                {/* Left Side: Image / Hero */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <img
                        src="/login.jpg"
                        alt="Shopping Experience"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-10000 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-900/40 mix-blend-multiply"></div>

                    {/* Floating Content on Image */}
                    <div className="absolute inset-0 flex flex-col justify-end p-16 text-white z-10">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl">
                            <h2 className="text-4xl font-black mb-4 leading-tight">Elevate Your <br />Shopping Experience</h2>
                            <p className="text-white/80 font-medium text-lg">Join thousands of happy shoppers and discover exclusive deals curated just for you.</p>

                            <div className="flex gap-4 mt-8">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm font-bold flex items-center text-white/90">10k+ active shoppers</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative blobs for image side */}
                    <div className="absolute top-10 left-10 w-32 h-32 bg-orange-400/30 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute bottom-1/2 right-10 w-24 h-24 bg-purple-400/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full lg:w-1/2 p-6 sm:p-10 md:p-12 flex flex-col justify-center">
                    {/* Logo / Brand */}
                    <div className="mb-6 lg:hidden text-center">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Shop<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">Sphere</span>
                        </h1>
                    </div>

                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-6">
                            <h2 className="text-3xl font-black text-gray-900 mb-1">Welcome Back</h2>
                            <p className="text-gray-500 font-medium">Please enter your details to continue</p>
                            <div className="w-12 h-1.5 bg-gradient-to-r from-orange-400 to-purple-500 rounded-full mt-3"></div>
                        </div>

                        {/* Form */}
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-1">
                                <label htmlFor="email" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        id="email"
                                        name="email"
                                        value={credentials.email}
                                        onChange={handleChange}
                                        className={`w-full px-5 py-4 rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-4 bg-white border ${fieldErrors.email ? 'border-red-400 focus:ring-red-100 bg-red-50' : 'border-gray-200 hover:border-orange-300 focus:ring-orange-400/5 focus:border-orange-400'}`}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {fieldErrors.email && <p className="text-red-500 text-xs font-bold ml-1">⚠ {fieldErrors.email}</p>}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1">
                                <div className="flex justify-between items-center ml-1">
                                    <label htmlFor="password" className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                        Password
                                    </label>
                                    <a href="/forgot-password" size="sm" className="text-xs font-bold text-orange-400 hover:text-orange-500 transition-colors">
                                        Forgot Password?
                                    </a>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        className={`w-full px-5 py-4 rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-4 bg-white border ${fieldErrors.password ? 'border-red-400 focus:ring-red-100 bg-red-50' : 'border-gray-200 hover:border-orange-300 focus:ring-orange-400/5 focus:border-orange-400'}`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {fieldErrors.password && <p className="text-red-500 text-xs font-bold ml-1">⚠ {fieldErrors.password}</p>}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group relative w-full py-4 px-6 bg-gradient-to-r from-orange-400 to-purple-500 text-white font-black rounded-2xl shadow-xl shadow-orange-400/20 transition-all duration-300 hover:shadow-orange-400/40 hover:-translate-y-1 active:scale-95 flex items-center justify-center overflow-hidden ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                <span className="relative flex items-center gap-2">
                                    {loading ? 'Processing...' : 'Sign In'}
                                    {!loading && <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                                </span>
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-7">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-4 bg-white text-gray-400 font-black uppercase tracking-widest">or continue with</span>
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-1">
                            <button
                                type="button"
                                onClick={() => handleGoogleLogin()}
                                className="flex items-center justify-center gap-3 py-3.5 border border-gray-200 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 hover:border-orange-200 transition-all duration-300"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google Account
                            </button>
                        </div>

                        {/* Sign Up Link */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-500 font-medium">
                                New here?{' '}
                                <Link to="/signup" className="font-black text-orange-400 hover:text-orange-500 transition-colors underline decoration-orange-400/30 underline-offset-4 decoration-2">
                                    Create account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;