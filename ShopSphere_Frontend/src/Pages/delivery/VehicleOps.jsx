import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Truck,
    MapPin,
    Navigation,
    Compass,
    ArrowRight,
    Milestone,
    Zap
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";
import { validateVehicleNumber } from "../../utils/validators";

export default function DeliveryVehicleOps() {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    const [formData, setFormData] = useState({
        vehicleType: "motorcycle",
        vehicleNumber: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        serviceCities: "",
        preferredRadius: 10
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors(prev => ({ ...prev, [e.target.name]: null }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        const errs = {};
        const vehicleErr = validateVehicleNumber(formData.vehicleNumber);
        if (vehicleErr) errs.vehicleNumber = vehicleErr;
        if (!formData.address || formData.address.trim().length < 5) errs.address = "Please enter a valid address.";
        if (!formData.city || formData.city.trim().length < 2) errs.city = "City is required.";
        if (!formData.state || formData.state.trim().length < 2) errs.state = "State is required.";
        if (!formData.postalCode || !/^\d{6}$/.test(formData.postalCode)) errs.postalCode = "Pincode must be 6 digits.";

        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            toast.error(Object.values(errs)[0]);
            return;
        }
        localStorage.setItem("delivery_reg_ops", JSON.stringify(formData));
        navigate("/delivery/bank-docs");
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
            {/* Background Aesthetics */}
            <div className={`absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full translate-x-1/2 translate-y-1/2 blur-[150px] pointer-events-none transition-opacity duration-1000 ${isDarkMode ? 'bg-orange-500/10 opacity-100' : 'bg-orange-500/5 opacity-50'}`}></div>
            <div className={`absolute top-0 left-0 w-[600px] h-[600px] rounded-full -translate-x-1/2 -translate-y-1/2 blur-[120px] pointer-events-none transition-opacity duration-1000 ${isDarkMode ? 'bg-orange-500/10 opacity-100' : 'bg-indigo-500/5 opacity-50'}`}></div>

            <div className="w-full max-w-3xl relative z-10 animate-fadeInUp">
                <div className="mb-12 text-center">
                    <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl mb-8 border transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <Milestone className="text-orange-500" size={18} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Logistics Parameters</span>
                    </div>
                    <h1 className={`text-5xl lg:text-6xl font-bold tracking-tight  uppercase mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Mobility <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-indigo-400 to-purple-500">Systems.</span>
                    </h1>
                    <p className={`font-bold text-[11px] uppercase tracking-wider  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Step 3: Define your operational radius & equipment</p>
                </div>

                <div className={`backdrop-blur-3xl rounded-[48px] p-10 md:p-14 shadow-2xl relative overflow-hidden border transition-all duration-500 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-slate-200'}`}>
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-purple-600"></div>

                    <form onSubmit={handleNext} className="space-y-10">
                        {/* Vehicle Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className={`text-[9px] font-bold uppercase tracking-wider ml-1 flex items-center gap-2  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    <Truck size={10} /> Fleet Classification
                                </label>
                                <div className="relative group">
                                    <Truck className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 pointer-events-none ${isDarkMode ? 'text-slate-700 group-focus-within:text-orange-400' : 'text-slate-300 group-focus-within:text-orange-500'}`} size={18} />
                                    <select
                                        name="vehicleType"
                                        value={formData.vehicleType}
                                        onChange={handleChange}
                                        className={`w-full pl-16 pr-8 py-5 rounded-[24px] border-2 font-bold  outline-none transition-all shadow-inner appearance-none cursor-pointer ${isDarkMode ? 'bg-[#020617] border-transparent focus:border-orange-500 text-white focus:bg-black/40' : 'bg-slate-50 border-slate-100 focus:border-orange-400 text-slate-900 focus:bg-white'}`}
                                    >
                                        <option value="bicycle">Eco-Bicycle</option>
                                        <option value="motorcycle">Two-Wheeler</option>
                                        <option value="car">Sedan / Hatchback</option>
                                        <option value="van">Cargo Van</option>
                                    </select>
                                    <div className={`absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}>
                                        <ArrowRight className="rotate-90" size={14} />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className={`text-[9px] font-bold uppercase tracking-wider ml-1 flex items-center gap-2  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    <Navigation size={10} /> Hardware Code
                                </label>
                                <div className="relative group">
                                    <Navigation className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDarkMode ? 'text-slate-700 group-focus-within:text-orange-400' : 'text-slate-300 group-focus-within:text-orange-500'}`} size={18} />
                                    <input
                                        type="text"
                                        name="vehicleNumber"
                                        required
                                        value={formData.vehicleNumber}
                                        onChange={handleChange}
                                        placeholder="e.g. MH12AB1234"
                                        maxLength={12}
                                        className={`w-full pl-16 pr-8 py-5 rounded-[24px] border-2 font-bold  outline-none transition-all shadow-inner ${errors.vehicleNumber ? 'border-red-500' : (isDarkMode ? 'bg-[#020617] border-transparent focus:border-orange-500 text-white focus:bg-black/40 placeholder:text-slate-600' : 'bg-slate-50 border-slate-100 focus:border-orange-400 text-slate-900 focus:bg-white placeholder:text-slate-300')}`}
                                    />
                                </div>
                                {errors.vehicleNumber && <p className="text-red-500 text-[9px] font-bold uppercase tracking-wider ml-1">⚠ {errors.vehicleNumber}</p>}
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-4">
                            <label className={`text-[9px] font-bold uppercase tracking-wider ml-1 flex items-center gap-2  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                <MapPin size={10} /> Logistics Hub (Home)
                            </label>
                            <div className="relative group">
                                <MapPin className={`absolute left-6 top-7 transition-colors duration-300 ${isDarkMode ? 'text-slate-700 group-focus-within:text-orange-400' : 'text-slate-300 group-focus-within:text-orange-500'}`} size={18} />
                                <textarea
                                    name="address"
                                    required
                                    rows="2"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Street, Sector, Building..."
                                    className={`w-full pl-16 pr-8 py-5 rounded-[28px] border-2 font-bold  outline-none transition-all resize-none shadow-inner ${isDarkMode ? 'bg-[#020617] border-transparent focus:border-orange-500 text-white focus:bg-black/40 placeholder:text-slate-600' : 'bg-slate-50 border-slate-100 focus:border-orange-400 text-slate-900 focus:bg-white placeholder:text-slate-300'}`}
                                />
                            </div>
                        </div>

                        {/* City/State/Zip */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="space-y-4">
                                <label className={`text-[9px] font-bold uppercase tracking-wider ml-1 flex items-center gap-2  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={`w-full px-8 py-5 rounded-[24px] border-2 font-bold  outline-none transition-all shadow-inner ${isDarkMode ? 'bg-[#020617] border-transparent focus:border-orange-500 text-white focus:bg-black/40' : 'bg-slate-50 border-slate-100 focus:border-orange-400 text-slate-900 focus:bg-white'}`}
                                />
                            </div>
                            <div className="space-y-4">
                                <label className={`text-[9px] font-bold uppercase tracking-wider ml-1 flex items-center gap-2  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>State</label>
                                <input
                                    type="text"
                                    name="state"
                                    required
                                    value={formData.state}
                                    onChange={handleChange}
                                    className={`w-full px-8 py-5 rounded-[24px] border-2 font-bold  outline-none transition-all shadow-inner ${isDarkMode ? 'bg-[#020617] border-transparent focus:border-orange-500 text-white focus:bg-black/40' : 'bg-slate-50 border-slate-100 focus:border-orange-400 text-slate-900 focus:bg-white'}`}
                                />
                            </div>
                            <div className="space-y-4 col-span-2 md:col-span-1">
                                <label className={`text-[9px] font-bold uppercase tracking-wider ml-1 flex items-center gap-2  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Zip Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    required
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    className={`w-full px-8 py-5 rounded-[24px] border-2 font-bold  outline-none transition-all shadow-inner ${isDarkMode ? 'bg-[#020617] border-transparent focus:border-orange-500 text-white focus:bg-black/40' : 'bg-slate-50 border-slate-100 focus:border-orange-400 text-slate-900 focus:bg-white'}`}
                                />
                            </div>
                        </div>

                        {/* Radius & Cities */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className={`text-[9px] font-bold uppercase tracking-wider ml-1 flex justify-between  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    Transmission Range <span className={isDarkMode ? 'text-orange-400' : 'text-orange-600'}>{formData.preferredRadius} KM</span>
                                </label>
                                <div className="pt-4 flex items-center gap-6">
                                    <div className={`p-3 rounded-xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                                        <Compass size={18} />
                                    </div>
                                    <input
                                        type="range"
                                        name="preferredRadius"
                                        min="2"
                                        max="50"
                                        value={formData.preferredRadius}
                                        onChange={handleChange}
                                        className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer transition-all ${isDarkMode ? 'accent-orange-500 bg-white/10' : 'accent-orange-600 bg-slate-200'}`}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className={`text-[9px] font-bold uppercase tracking-wider ml-1 flex items-center gap-2  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    <Zap size={10} /> Active Nodes
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        name="serviceCities"
                                        required
                                        value={formData.serviceCities}
                                        onChange={handleChange}
                                        placeholder="Mumbai, Pune, Thane"
                                        className={`w-full px-8 py-5 rounded-[24px] border-2 font-bold  outline-none transition-all shadow-inner ${isDarkMode ? 'bg-[#020617] border-transparent focus:border-orange-500 text-white focus:bg-black/40 placeholder:text-slate-600' : 'bg-slate-50 border-slate-100 focus:border-orange-400 text-slate-900 focus:bg-white placeholder:text-slate-300'}`}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-6 rounded-[32px] text-[11px] font-bold uppercase tracking-wider shadow-2xl transition-all flex items-center justify-center gap-4 group  border-none cursor-pointer ${isDarkMode ? 'bg-white text-[#0f172a] hover:bg-orange-500 hover:text-white shadow-white/5' : 'bg-slate-900 text-white hover:bg-orange-500 shadow-slate-900/10'}`}
                        >
                            Commit Logistics Profile <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
                        </button>
                    </form>
                </div>

                <div className="mt-12 text-center">
                    <p className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}>
                        Protocol Step 03/04 • Systems Calibration Active
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
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: ${isDarkMode ? '#f97316' : '#ea580c'};
                    cursor: pointer;
                    box-shadow: 0 0 15px ${isDarkMode ? 'rgba(249, 115, 22, 0.3)' : 'rgba(234, 88, 12, 0.2)'};
                    transition: transform 0.2s;
                }
                input[type=range]::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                }
            `}</style>
        </div>
    );
}
