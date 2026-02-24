import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    University,
    CreditCard,
    FileCheck,
    Upload,
    Camera,
    CheckCircle,
    Truck,
    ShieldCheck,
    Sparkles
} from "lucide-react";
import { toast } from "react-hot-toast";
import { deliveryRegister } from "../../api/delivery_axios";
import { useTheme } from "../../context/ThemeContext";
import { validateBankAccount, validateIFSC, validatePAN, validateAadhaar, validateDrivingLicense } from "../../utils/validators";

export default function DeliveryBankDocs() {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [loading, setLoading] = useState(false);

    const [bankData, setBankData] = useState({
        bank_name: "",
        bank_account_number: "",
        bank_ifsc_code: "",
        bank_holder_name: "",
        pan_number: "",
        aadhar_number: "",
        license_number: "",
        license_expires: ""
    });
    const [fieldErrors, setFieldErrors] = useState({});

    const [files, setFiles] = useState({
        aadhar_card_file: null,
        pan_card_file: null,
        license_file: null,
        selfie_with_id: null,
        vehicle_registration: null,
        vehicle_insurance: null,
        additional_documents: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const finalValue = ['bank_ifsc_code', 'pan_number', 'license_number'].includes(name) ? value.toUpperCase() : value;
        setBankData({ ...bankData, [name]: finalValue });
        setFieldErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fldErrs = {};
        const acctErr = validateBankAccount(bankData.bank_account_number);
        const ifscErr = validateIFSC(bankData.bank_ifsc_code);
        const panErr = validatePAN(bankData.pan_number);
        const aadhaarErr = validateAadhaar(bankData.aadhar_number);
        const dlErr = validateDrivingLicense(bankData.license_number);
        if (acctErr) fldErrs.bank_account_number = acctErr;
        if (ifscErr) fldErrs.bank_ifsc_code = ifscErr;
        if (panErr) fldErrs.pan_number = panErr;
        if (aadhaarErr) fldErrs.aadhar_number = aadhaarErr;
        if (dlErr) fldErrs.license_number = dlErr;
        if (!bankData.bank_name || bankData.bank_name.trim().length < 2) fldErrs.bank_name = "Bank name is required.";
        if (!bankData.bank_holder_name || bankData.bank_holder_name.trim().length < 3) fldErrs.bank_holder_name = "Account holder name is required.";
        if (!bankData.license_expires) fldErrs.license_expires = "License expiry date is required.";

        const mandatoryFiles2 = ['aadhar_card_file', 'pan_card_file', 'license_file', 'selfie_with_id'];
        const missing = mandatoryFiles2.filter(f => !files[f]);
        if (missing.length > 0) {
            toast.error(`Mandatory Verification Data Missing`, {
                style: {
                    borderRadius: '16px',
                    background: isDarkMode ? '#1e293b' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#1e293b',
                    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    fontWeight: '900',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }
            });
        }

        if (Object.keys(fldErrs).length > 0) {
            setFieldErrors(fldErrs);
            toast.error(Object.values(fldErrs)[0]);
            return;
        }
        if (missing.length > 0) return;

        setLoading(true);
        try {
            const identity = JSON.parse(localStorage.getItem("delivery_reg_identity") || "{}");
            const ops = JSON.parse(localStorage.getItem("delivery_reg_ops") || "{}");
            const email = localStorage.getItem("delivery_verify_email");

            const finalData = {
                email: email,
                password: identity.password,
                password_confirm: identity.password,
                full_name: identity.fullName,
                phone_number: identity.phone,
                date_of_birth: identity.dateOfBirth,
                vehicle_type: ops.vehicleType,
                vehicle_number: ops.vehicleNumber,
                address: ops.address,
                city: ops.city,
                state: ops.state,
                postal_code: ops.postalCode,
                service_cities: JSON.stringify(ops.serviceCities ? ops.serviceCities.split(',').map(c => c.trim()) : []),
                service_pincodes: JSON.stringify([]),
                preferred_delivery_radius: ops.preferredRadius,
                ...bankData,
                bank_account_number: bankData.bank_account_number?.replace(/\s/g, ''),
                bank_ifsc_code: bankData.bank_ifsc_code?.replace(/\s/g, '').toUpperCase(),
                aadhar_number: bankData.aadhar_number?.replace(/\s/g, ''),
            };

            await deliveryRegister(finalData, files);
            toast.success("Application Broadcast Success!", {
                icon: '🚀',
                style: {
                    borderRadius: '16px',
                    background: isDarkMode ? '#1e293b' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#1e293b',
                    fontWeight: '900',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }
            });

            localStorage.removeItem("delivery_reg_identity");
            localStorage.removeItem("delivery_reg_ops");
            localStorage.removeItem("delivery_verify_email");
            localStorage.removeItem("delivery_email_otp");

            navigate("/delivery/login");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Transmission Failed.");
        } finally {
            setLoading(false);
        }
    };

    const mandatoryFilesFields = ['aadhar_card_file', 'pan_card_file', 'license_file', 'selfie_with_id'];
    const isFilesValid = mandatoryFilesFields.every(f => !!files[f]);
    const isBankValid = bankData.bank_name && bankData.bank_account_number && bankData.bank_ifsc_code && bankData.bank_holder_name;
    const isIdValid = bankData.pan_number && bankData.aadhar_number && bankData.license_number;
    const isFormValid = isFilesValid && isBankValid && isIdValid;

    return (
        <div className={`min-h-screen py-24 px-6 relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
            {/* Background Aesthetics */}
            <div className={`absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-1000 ${isDarkMode ? 'bg-gradient-to-br from-orange-500/50 via-transparent to-orange-500/10' : 'bg-gradient-to-br from-orange-500/[0.02] via-transparent to-orange-500/[0.03]'}`}></div>
            <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full translate-x-1/2 -translate-y-1/2 blur-[150px] pointer-events-none transition-opacity duration-1000 ${isDarkMode ? 'bg-orange-500/10' : 'bg-orange-500/[0.05]'}`}></div>

            <div className="max-w-6xl mx-auto relative z-10 animate-fadeInScale">
                <div className="mb-16 text-center">
                    <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl mb-10 border transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <Sparkles className="text-orange-500" size={18} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>The Final Vault</span>
                    </div>
                    <h1 className={`text-6xl lg:text-7xl font-bold tracking-tight  uppercase mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Dossier <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-purple-600">Calibration.</span>
                    </h1>
                    <p className={`font-bold text-[11px] uppercase tracking-wider  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Commit your financial & legal identifiers to the grid</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
                    {/* Data Entry Side */}
                    <div className="space-y-12">
                        {/* Bank Card */}
                        <div className={`backdrop-blur-3xl rounded-[48px] p-10 shadow-2xl relative overflow-hidden border transition-all duration-500 ${isDarkMode ? 'bg-white/5 border-white/10 shadow-white/[0.02]' : 'bg-white border-slate-100 shadow-slate-200/50'}`}>
                            <div className="flex items-center gap-5 mb-12">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-orange-50 border-orange-100 text-orange-500'}`}>
                                    <University size={24} />
                                </div>
                                <h2 className={`text-2xl font-bold tracking-tight  uppercase transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Financial Node</h2>
                            </div>

                            <div className="space-y-8">
                                {[
                                    { label: 'Bank Institution', name: 'bank_name', icon: University, placeholder: 'SBI / HDFC / ICICI' },
                                    { label: 'Vault Number', name: 'bank_account_number', icon: CreditCard, placeholder: '0000 0000 0000 00' },
                                    { label: 'Routing Fragment (IFSC)', name: 'bank_ifsc_code', icon: FileCheck, placeholder: 'XXXX0001234' },
                                    { label: 'Signatory Name', name: 'bank_holder_name', icon: CreditCard, placeholder: 'As per bank records' },
                                ].map((field) => (
                                    <div key={field.name} className="space-y-3">
                                        <label className={`text-[9px] font-bold uppercase tracking-wider ml-1  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{field.label}</label>
                                        <div className="relative group">
                                            <field.icon className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDarkMode ? 'text-slate-700 group-focus-within:text-orange-400' : 'text-slate-300 group-focus-within:text-orange-500'}`} size={18} />
                                            <input
                                                type="text"
                                                name={field.name}
                                                required
                                                value={bankData[field.name]}
                                                onChange={handleChange}
                                                placeholder={field.placeholder}
                                                className={`w-full pl-16 pr-8 py-5 rounded-[24px] border-2 font-bold  outline-none transition-all shadow-inner ${isDarkMode ? 'bg-[#020617] border-transparent focus:border-orange-500 text-white focus:bg-black/40 placeholder:text-slate-600' : 'bg-slate-50 border-slate-100 focus:border-orange-400 text-slate-900 focus:bg-white placeholder:text-slate-300'}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ID Card */}
                        <div className={`backdrop-blur-3xl rounded-[48px] p-10 shadow-2xl relative overflow-hidden border transition-all duration-500 ${isDarkMode ? 'bg-white/5 border-white/10 shadow-white/[0.02]' : 'bg-white border-slate-100 shadow-slate-200/50'}`}>
                            <div className="flex items-center gap-5 mb-12">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${isDarkMode ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-purple-50 border-purple-100 text-purple-500'}`}>
                                    <ShieldCheck size={24} />
                                </div>
                                <h2 className={`text-2xl font-bold tracking-tight  uppercase transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Civil Identifiers</h2>
                            </div>

                            <div className="space-y-8">
                                {[{ label: 'PAN Identity', name: 'pan_number', placeholder: 'ABCDE1234F', type: 'text' },
                                { label: 'Aadhaar Matrix', name: 'aadhar_number', placeholder: '0000 0000 0000', type: 'text' },
                                { label: 'Logistics License', name: 'license_number', placeholder: 'DL-00-1234567', type: 'text' },
                                { label: 'License Expiry Date', name: 'license_expires', placeholder: '', type: 'date' },
                                ].map((field) => (
                                    <div key={field.name} className="space-y-3">
                                        <label className={`text-[9px] font-bold uppercase tracking-wider ml-1  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{field.label}</label>
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            required
                                            value={bankData[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            className={`w-full px-8 py-5 rounded-[24px] border-2 font-bold  outline-none transition-all shadow-inner ${isDarkMode ? 'bg-[#020617] border-transparent focus:border-orange-500 text-white focus:bg-black/40 placeholder:text-slate-600 color-scheme-dark' : 'bg-slate-50 border-slate-100 focus:border-orange-400 text-slate-900 focus:bg-white placeholder:text-slate-300'}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Document Upload Side */}
                    <div className="space-y-12 h-fit lg:sticky lg:top-10">
                        <div className={`rounded-[56px] p-10 md:p-14 shadow-2xl relative overflow-hidden transition-all duration-500 ${isDarkMode ? 'bg-[#1e1b4b] text-white shadow-orange-500/[0.05]' : 'bg-orange-600 text-white shadow-orange-600/20'}`}>
                            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-5 mb-14">
                                    <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center border border-white/20">
                                        <Upload size={28} />
                                    </div>
                                    <h2 className="text-3xl font-bold tracking-tight  uppercase">Dossier Files</h2>
                                </div>

                                <div className="space-y-8">
                                    {[
                                        { label: 'Aadhaar Documentation', name: 'aadhar_card_file' },
                                        { label: 'PAN Artifact', name: 'pan_card_file' },
                                        { label: 'Operator Clearance (License)', name: 'license_file' },
                                        { label: 'Visual ID Verification (Selfie)', name: 'selfie_with_id', icon: Camera },
                                    ].map((field) => (
                                        <div key={field.name} className="group relative">
                                            <label className="text-[8px] font-bold uppercase tracking-wider text-white/50 mb-4 block ml-1 ">{field.label}</label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    name={field.name}
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div className="w-full p-6 bg-white/5 border-2 border-dashed border-white/20 rounded-[32px] group-hover:bg-white/10 group-hover:border-white/40 transition-all flex items-center justify-between">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest truncate max-w-[220px]">
                                                        {files[field.name] ? (
                                                            <span className="text-white flex items-center gap-2">
                                                                <CheckCircle size={12} className="text-green-400" /> {files[field.name].name}
                                                            </span>
                                                        ) : "Select Fragment"}
                                                    </span>
                                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                                                        {field.icon ? <field.icon size={18} /> : <Upload size={18} />}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !isFormValid}
                                    className={`w-full mt-20 py-8 rounded-[36px] text-[12px] font-bold uppercase tracking-wider shadow-2xl transition-all flex items-center justify-center gap-5 group  border-none ${isFormValid && !loading ? 'bg-white text-orange-600 hover:bg-slate-900 hover:text-white cursor-pointer active:scale-95' : 'bg-white/10 text-white/20 cursor-not-allowed shadow-none'}`}
                                >
                                    {loading ? (
                                        <span className="animate-pulse">Transmitting Data...</span>
                                    ) : (
                                        <>
                                            {isFormValid ? "Submit Dossier" : "Missing Protocols"} <Truck className="group-hover:translate-x-3 transition-transform" size={24} />
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-[8px] font-bold uppercase tracking-wider mt-10 text-white/40 leading-relaxed">
                                    Broadcast encrypted via ShopSphere Command <br /> Multi-factor validation active
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.98) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fadeInScale {
                    animation: fadeInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}
