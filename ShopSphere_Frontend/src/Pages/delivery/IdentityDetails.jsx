import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    User,
    Calendar,
    Phone,
    Lock,
    ArrowRight,
    UserCircle,
    Fingerprint
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";
import { validateName, validatePhone, validatePassword, validateDOB } from "../../utils/validators";

export default function DeliveryIdentityDetails() {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const email = localStorage.getItem("delivery_verify_email");

    const [formData, setFormData] = useState({
        fullName: "",
        dateOfBirth: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors(prev => ({ ...prev, [e.target.name]: null }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        const errs = {};
        const nameErr = validateName(formData.fullName, "Full Name");
        const dobErr = validateDOB(formData.dateOfBirth);
        const phoneErr = validatePhone(formData.phone);
        const pwErr = validatePassword(formData.password);
        if (nameErr) errs.fullName = nameErr;
        if (dobErr) errs.dateOfBirth = dobErr;
        if (phoneErr) errs.phone = phoneErr;
        if (pwErr) errs.password = pwErr;
        if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match.";

        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            toast.error(Object.values(errs)[0]);
            return;
        }

        localStorage.setItem("delivery_reg_identity", JSON.stringify(formData));
        navigate("/delivery/vehicle-ops");
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
            {/* Background Aesthetics */}
            <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full translate-x-1/2 -translate-y-1/2 blur-[150px] pointer-events-none transition-opacity duration-1000 ${isDarkMode ? 'bg-orange-500/10 opacity-100' : 'bg-orange-500/5 opacity-50'}`}></div>
            <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full -translate-x-1/2 translate-y-1/2 blur-[120px] pointer-events-none transition-opacity duration-1000 ${isDarkMode ? 'bg-purple-500/10 opacity-100' : 'bg-purple-500/5 opacity-50'}`}></div>

            <div className="w-full max-w-2xl relative z-10 animate-fadeInUp">
                <div className="mb-12 text-center">
                    <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl mb-8 border transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <Fingerprint className="text-orange-500" size={18} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Agent Dossier Setup</span>
                    </div>
                    <h1 className={`text-5xl lg:text-6xl font-bold tracking-tight  uppercase mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Profile <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-purple-500">Identity.</span>
                    </h1>
                    <p className={`font-bold text-[11px] uppercase tracking-wider  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Step 2: Construct your operational profile</p>
                </div>

                <div className={`backdrop-blur-3xl rounded-[48px] p-10 md:p-14 shadow-2xl relative overflow-hidden border transition-all duration-500 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-slate-200'}`}>
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-purple-600"></div>

                    <form onSubmit={handleNext} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className={`text-[9px] font-bold uppercase tracking-wider ml-1 flex items-center gap-2  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    <User size={10} /> Legal Designation
                                </label>
                                <div className="relative group">
                                    <User className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDarkMode ? 'text-slate-700 group-focus-within:text-orange-400' : 'text-slate-300 group-focus-within:text-orange-500'}`} size={18} />
                                    <input
                                        type="text"
                                        name="fullName"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Dominic Toretto"
                                        className={`w-full pl-16 pr-8 py-5 rounded-[24px] border-2 font-bold  outline-none transition-all shadow-inner ${errors.fullName ? 'border-red-500' : (isDarkMode ? 'bg-[#020617] border-transparent focus:border-orange-500 text-white focus:bg-black/40 placeholder:text-slate-600' : 'bg-slate-50 border-slate-100 focus:border-orange-400 text-slate-900 focus:bg-white placeholder:text-slate-300')}`}
                                    />
                                </div>
                                {errors.fullName && <p className="text-red-500 text-[9px] font-bold uppercase tracking-wider ml-1">⚠ {errors.fullName}</p>}
                            </div>
                            <div className="space-y-4">
                                <label className={`text-[9px] font-bold uppercase tracking-wider ml-1 flex items-center gap-2  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    <Calendar size={10} /> Date of Birth
                                </label>
                                <div className="relative group">
                                    <Calendar className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDarkMode ? 'text-slate-700 group-focus-within:text-orange-400' : 'text-slate-300 group-focus-within:text-orange-500'}`} size={18} />
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        required
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        className={`w-full pl-16 pr-8 py-5 rounded-[24px] border-2 font-bold  outline-none transition-all shadow-inner ${errors.dateOfBirth ? 'border-red-500' : (isDarkMode ? 'bg-[#020617] border-transparent focus:border-orange-500 text-white focus:bg-black/40' : 'bg-slate-50 border-slate-100 focus:border-orange-400 text-slate-900 focus:bg-white color-scheme-dark')}`}
                                    />
                                </div>
                                {errors.dateOfBirth && <p className="text-red-500 text-[9px] font-bold uppercase tracking-wider ml-1">⚠ {errors.dateOfBirth}</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className={`text-[9px] font-bold uppercase tracking-wider ml-1 flex items-center gap-2  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                <Phone size={10} /> Comms Fragment
                            </label>
                            <div className="relative group">
                                <Phone className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDarkMode ? 'text-slate-700 group-focus-within:text-orange-400' : 'text-slate-300 group-focus-within:text-orange-500'}`} size={18} />
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="10-digit mobile number"
                                    maxLength={10}
                                    className={`w-full pl-16 pr-8 py-5 rounded-[24px] border-2 font-bold  outline-none transition-all shadow-inner ${errors.phone ? 'border-red-500' : (isDarkMode ? 'bg-[#020617] border-transparent focus:border-orange-500 text-white focus:bg-black/40 placeholder:text-slate-600' : 'bg-slate-50 border-slate-100 focus:border-orange-400 text-slate-900 focus:bg-white placeholder:text-slate-300')}`}
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-[9px] font-bold uppercase tracking-wider ml-1">⚠ {errors.phone}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className={`text-[9px] font-bold uppercase tracking-wider ml-1 flex items-center gap-2  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    <Lock size={10} /> Secure Phrase
                                </label>
                                <div className="relative group">
                                    <Lock className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDarkMode ? 'text-slate-700 group-focus-within:text-orange-400' : 'text-slate-300 group-focus-within:text-orange-500'}`} size={18} />
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Min 8, uppercase, number, special"
                                        className={`w-full pl-16 pr-8 py-5 rounded-[24px] border-2 font-bold  outline-none transition-all shadow-inner ${errors.password ? 'border-red-500' : (isDarkMode ? 'bg-[#020617] border-transparent focus:border-orange-500 text-white focus:bg-black/40 placeholder:text-slate-600' : 'bg-slate-50 border-slate-100 focus:border-orange-400 text-slate-900 focus:bg-white placeholder:text-slate-300')}`}
                                    />
                                </div>
                                {errors.password && <p className="text-red-500 text-[9px] font-bold uppercase tracking-wider ml-1">⚠ {errors.password}</p>}
                            </div>
                            <div className="space-y-4">
                                <label className={`text-[9px] font-bold uppercase tracking-wider ml-1 flex items-center gap-2  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    <Lock size={10} /> Phrase Confirm
                                </label>
                                <div className="relative group">
                                    <Lock className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDarkMode ? 'text-slate-700 group-focus-within:text-orange-400' : 'text-slate-300 group-focus-within:text-orange-500'}`} size={18} />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className={`w-full pl-16 pr-8 py-5 rounded-[24px] border-2 font-bold  outline-none transition-all shadow-inner ${errors.confirmPassword ? 'border-red-500' : (isDarkMode ? 'bg-[#020617] border-transparent focus:border-orange-500 text-white focus:bg-black/40 placeholder:text-slate-600' : 'bg-slate-50 border-slate-100 focus:border-orange-400 text-slate-900 focus:bg-white placeholder:text-slate-300')}`}
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-[9px] font-bold uppercase tracking-wider ml-1">⚠ {errors.confirmPassword}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-6 rounded-[32px] text-[11px] font-bold uppercase tracking-wider shadow-2xl transition-all flex items-center justify-center gap-4 group  border-none cursor-pointer ${isDarkMode ? 'bg-white text-[#0f172a] hover:bg-orange-400 hover:text-white shadow-white/5' : 'bg-slate-900 text-white hover:bg-orange-500 shadow-slate-900/10'}`}
                        >
                            Deploy Operational Data <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
                        </button>
                    </form>
                </div>

                <div className="mt-12 text-center">
                    <p className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}>
                        Protocol Step 02/04 • Security Handshake Active
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .color-scheme-dark {
                    color-scheme: dark;
                }
            `}</style>
        </div>
    );
}
