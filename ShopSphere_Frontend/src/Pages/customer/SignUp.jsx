import React, { useState } from 'react';
import { signupUser } from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { validateUsername, validateEmail, validatePassword } from '../../utils/validators';

function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs = {};
        const usernameErr = validateUsername(formData.username);
        const emailErr = validateEmail(formData.email);
        const passwordErr = validatePassword(formData.password);
        if (usernameErr) errs.username = usernameErr;
        if (emailErr) errs.email = emailErr;
        if (passwordErr) errs.password = passwordErr;
        return errs;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field on change
        setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            toast.error(Object.values(errs)[0]);
            return;
        }
        setLoading(true);
        try {
            await signupUser({ username: formData.username, email: formData.email, password: formData.password });
            toast.success("Account created successfully! Please log in.");
            navigate("/login");
        } catch (err) {
            const msg = err.response?.data?.detail || Object.values(err.response?.data || {})[0]?.[0] || "Signup failed. Please try again.";
            setErrors({ form: msg });
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const FieldError = ({ field }) => errors[field] ? (
        <p className="text-red-500 text-xs font-bold mt-1 ml-1 flex items-center gap-1">
            <span>⚠</span> {errors[field]}
        </p>
    ) : null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff] p-4 lg:p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
            </div>
            <div className="fixed top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 via-purple-500 to-purple-500 z-50"></div>

            <div className="relative w-full max-w-6xl flex flex-row-reverse bg-white/40 backdrop-blur-3xl rounded-[40px] shadow-2xl overflow-hidden border border-white/50">
                {/* Right Side Hero */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <img src="/signup.jpg" alt="Join ShopSphere" className="absolute inset-0 w-full h-full object-cover transition-transform duration-10000 hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-600/40 mix-blend-multiply"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-16 text-white z-10">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl">
                            <h2 className="text-4xl font-black mb-4 leading-tight">Your Global <br />Marketplace Awaits</h2>
                            <p className="text-white/80 font-medium text-lg">Create an account and start your journey towards a smarter, faster shopping experience.</p>
                            <div className="grid grid-cols-2 gap-6 mt-8">
                                <div className="space-y-1"><p className="text-2xl font-black">20k+</p><p className="text-white/60 text-xs font-bold uppercase tracking-widest">Premium Brands</p></div>
                                <div className="space-y-1"><p className="text-2xl font-black">24/7</p><p className="text-white/60 text-xs font-bold uppercase tracking-widest">Customer Support</p></div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-20 right-20 w-32 h-32 bg-purple-400/30 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 left-10 w-24 h-24 bg-orange-400/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                </div>

                {/* Left Side Form */}
                <div className="w-full lg:w-1/2 p-6 sm:p-10 md:p-12 flex flex-col justify-center">
                    <div className="mb-6 lg:hidden text-center">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Shop<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">Sphere</span></h1>
                    </div>

                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-6">
                            <h2 className="text-3xl font-black text-gray-900 mb-1">Join ShopSphere</h2>
                            <p className="text-gray-500 font-medium">Create your account to get started</p>
                            <div className="w-12 h-1.5 bg-gradient-to-r from-orange-400 to-purple-500 rounded-full mt-3"></div>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                            {/* Username */}
                            <div className="space-y-1">
                                <label htmlFor="username" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                                <input
                                    type="text" id="username" name="username"
                                    value={formData.username} onChange={handleChange}
                                    className={`w-full px-5 py-4 bg-white border rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-300 hover:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-400/5 focus:border-orange-400 ${errors.username ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                                    placeholder="Letters only, more than 3 characters"
                                />
                                <FieldError field="username" />
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label htmlFor="email" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    type="email" id="email" name="email"
                                    value={formData.email} onChange={handleChange}
                                    className={`w-full px-5 py-4 bg-white border rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-300 hover:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-400/5 focus:border-orange-400 ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                                    placeholder="user@example.com"
                                />
                                <FieldError field="email" />
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <label htmlFor="password" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                                <input
                                    type="password" id="password" name="password"
                                    value={formData.password} onChange={handleChange}
                                    className={`w-full px-5 py-4 bg-white border rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-300 hover:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-400/5 focus:border-orange-400 ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                                    placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
                                />
                                <FieldError field="password" />
                                {/* Password hints */}
                                {formData.password.length > 0 && (
                                    <div className="flex gap-2 flex-wrap mt-1 ml-1">
                                        {[
                                            { label: '8+ chars', ok: formData.password.length >= 8 },
                                            { label: 'Uppercase', ok: /[A-Z]/.test(formData.password) },
                                            { label: 'Number', ok: /[0-9]/.test(formData.password) },
                                            { label: 'Special', ok: /[!@#$%^&*]/.test(formData.password) },
                                            { label: 'No spaces', ok: !/\s/.test(formData.password) },
                                        ].map(h => (
                                            <span key={h.label} className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${h.ok ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>{h.ok ? '✓' : '○'} {h.label}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Form-level error */}
                            {errors.form && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    {errors.form}
                                </div>
                            )}

                            <button
                                type="submit" disabled={loading}
                                className={`group relative w-full py-4 px-6 bg-gradient-to-r from-orange-400 to-purple-500 text-white font-black rounded-2xl shadow-xl shadow-orange-400/20 transition-all duration-300 hover:shadow-orange-400/40 hover:-translate-y-1 active:scale-95 flex items-center justify-center overflow-hidden mb-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                <span className="relative flex items-center gap-2">
                                    {loading ? 'Creating Account...' : 'Get Started'}
                                    {!loading && <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                                </span>
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-500 font-medium">
                                Already have an account?{' '}
                                <Link to="/login" className="font-black text-orange-400 hover:text-orange-500 transition-colors underline decoration-orange-400/30 underline-offset-4 decoration-2">Sign in here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
