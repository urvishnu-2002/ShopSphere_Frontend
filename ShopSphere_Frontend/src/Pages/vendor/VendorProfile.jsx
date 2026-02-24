import { useState, useEffect } from "react";
import { getVendorProfile, updateVendorProfile } from "../../api/vendor_axios";
import {
    FaUserCircle,
    FaStore,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaRedo,
    FaEdit,
    FaTimes,
    FaEnvelope,
    FaPhone,
    FaLock,
    FaInfoCircle
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { requestVendorDeletion } from "../../api/vendor_axios";
import { useTheme } from "../../context/ThemeContext";

export default function VendorProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const { isDarkMode } = useTheme();
    const [formData, setFormData] = useState({
        shop_name: "",
        shop_description: "",
        address: "",
        contact_name: "",
        contact_email: "",
        contact_phone: ""
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await getVendorProfile();
            setProfile(data);
            setFormData({
                shop_name: data.shop_name || "",
                shop_description: data.shop_description || "",
                address: data.address || "",
                contact_name: data.contact_name || "",
                contact_email: data.contact_email || "",
                contact_phone: data.contact_phone || ""
            });
        } catch (error) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateVendorProfile(formData);
            toast.success("Profile updated");
            setIsEditing(false);
            fetchProfile();
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={`flex flex-col items-center justify-center min-h-[60vh] transition-colors duration-300 ${isDarkMode ? 'bg-transparent' : 'bg-transparent'}`}>
                <div className={`w-12 h-12 border-4 rounded-full animate-spin mb-4 ${isDarkMode ? 'border-slate-800 border-t-teal-400' : 'border-slate-200 border-t-teal-500'}`}></div>
                <p className={`text-[10px] font-semibold uppercase tracking-normal ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Loading settings...</p>
            </div>
        );
    }

    const handleDeleteRequest = async (reason) => {
        try {
            await requestVendorDeletion(reason);
            toast.success("Deletion request submitted!");
            fetchProfile();
        } catch (error) {
            toast.error("Failed to submit request");
        }
    };

    return (
        <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700 font-['Inter']">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className={`text-3xl md:text-4xl font-semibold tracking-normal flex items-center gap-4  uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-teal-400/20">
                            <FaUserCircle size={22} />
                        </div>
                        My Profile
                    </h1>
                    <p className="text-[10px] font-semibold uppercase tracking-normal text-gray-500 mt-3 ml-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Shop Settings
                    </p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className={`w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-semibold uppercase tracking-normal transition-all border shadow-2xl ${isDarkMode ? 'bg-slate-900 text-white border-slate-800 hover:bg-white/10' : 'bg-white text-slate-900 border-slate-200 hover:border-teal-400 hover:text-teal-500 shadow-sm'}`}
                    >
                        <FaEdit /> Edit Profile
                    </button>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleSubmit} className={`rounded-[32px] md:rounded-[56px] border p-8 md:p-12 shadow-2xl relative overflow-hidden group transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100'}`}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30"></div>

                        <div className="relative">
                            <div className={`flex items-center gap-4 mb-8 md:mb-10 ${isDarkMode ? 'text-indigo-400' : 'text-teal-500'}`}>
                                <FaStore size={20} />
                                <h3 className={`text-xl font-semibold tracking-normal  uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Store Info</h3>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-normal mb-3 block ml-1">Shop Name</label>
                                    <input
                                        type="text"
                                        name="shop_name"
                                        value={formData.shop_name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full p-5 border-2 focus:border-teal-500 rounded-2xl md:rounded-3xl outline-none font-semibold text-sm  transition-all disabled:opacity-50 ${isDarkMode ? 'bg-[#020617] border-transparent text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                                        placeholder="Store Name"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-normal mb-3 block ml-1">About the store</label>
                                    <textarea
                                        name="shop_description"
                                        value={formData.shop_description}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full p-5 border-2 focus:border-teal-500 rounded-2xl md:rounded-3xl outline-none font-medium text-sm transition-all disabled:opacity-50 h-32 ${isDarkMode ? 'bg-[#020617] border-transparent text-gray-300' : 'bg-slate-50 border-slate-100 text-slate-700'}`}
                                        placeholder="Store Description"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                        <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-normal mb-3 block ml-1">Contact Person</label>
                                        <div className="relative">
                                            <FaUserCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input
                                                type="text"
                                                name="contact_name"
                                                value={formData.contact_name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-12 pr-5 py-5 border-2 focus:border-teal-500 rounded-2xl md:rounded-3xl outline-none font-semibold text-sm transition-all disabled:opacity-50 truncate ${isDarkMode ? 'bg-[#020617] border-transparent text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-normal mb-3 block ml-1">Phone Number</label>
                                        <div className="relative">
                                            <FaPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input
                                                type="text"
                                                name="contact_phone"
                                                value={formData.contact_phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-12 pr-5 py-5 border-2 focus:border-teal-500 rounded-2xl md:rounded-3xl outline-none font-semibold text-sm transition-all disabled:opacity-50 ${isDarkMode ? 'bg-[#020617] border-transparent text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-normal mb-3 block ml-1">Store Address</label>
                                    <div className="relative">
                                        <FaMapMarkerAlt className="absolute left-5 top-5 text-gray-500" />
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full pl-12 pr-5 py-5 border-2 focus:border-teal-500 rounded-2xl md:rounded-3xl outline-none font-medium text-sm transition-all disabled:opacity-50 h-24 ${isDarkMode ? 'bg-[#020617] border-transparent text-gray-300' : 'bg-slate-50 border-slate-100 text-slate-700'}`}
                                            placeholder="Business address"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {isEditing && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="flex flex-col sm:flex-row gap-4 pt-10"
                                >
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className={`flex-1 py-5 text-white text-[10px] font-semibold uppercase tracking-normal rounded-2xl transition-all shadow-xl disabled:opacity-50 hover:bg-emerald-500 ${isDarkMode ? 'bg-teal-500 shadow-indigo-900/40' : 'bg-slate-900 shadow-slate-200'}`}
                                    >
                                        {saving ? "Saving..." : "Apply Changes"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className={`flex-1 py-5 border text-[10px] font-semibold uppercase tracking-normal rounded-2xl transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-gray-400 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        Cancel
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>

                {/* SIDEBAR INFO */}
                <div className="space-y-6 md:space-y-8">
                    <div className={`rounded-[40px] border p-8 shadow-2xl h-fit transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                        <div className="flex items-center gap-3 text-emerald-500 mb-8 px-2 uppercase  tracking-normal font-semibold text-[10px]">
                            <FaCheckCircle size={18} />
                            <h3>Verification Status</h3>
                        </div>
                        <div className="space-y-6">
                            <div className={`p-6 rounded-[32px] border transition-colors ${isDarkMode ? 'bg-[#020617] border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                                <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Current State</p>
                                <p className="text-base font-semibold text-emerald-500  uppercase flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                    {profile?.approval_status_display || "Active"}
                                </p>
                            </div>
                            <div className={`p-6 rounded-[32px] border transition-colors ${isDarkMode ? 'bg-[#020617] border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                                <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">ID Verified</p>
                                <p className={`text-sm font-semibold  truncate pr-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{profile?.id_number}</p>
                                <p className="text-[10px] font-semibold text-gray-500 mt-1 uppercase tracking-wider">{profile?.id_type_display}</p>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-[40px] p-8 shadow-2xl border h-fit transition-all duration-300 ${profile?.is_blocked ? 'bg-rose-500/5 border-rose-500/20' : isDarkMode ? 'bg-teal-400/5 border-teal-400/20' : 'bg-indigo-50 border-indigo-100'}`}>
                        <div className={`flex items-center gap-3 mb-6 px-2 ${profile?.is_blocked ? 'text-rose-500' : 'text-teal-500'}`}>
                            <FaLock size={18} />
                            <h3 className="text-[10px] font-semibold uppercase tracking-normal ">Security</h3>
                        </div>
                        <p className={`text-sm font-medium leading-relaxed px-2 ${profile?.is_blocked ? 'text-rose-400' : 'text-teal-500'}`}>
                            {profile?.is_blocked
                                ? `Access Restricted: ${profile.blocked_reason}`
                                : 'Access protocols fully operational. Your merchant node is currently encrypted and active.'}
                        </p>
                        {!profile?.is_blocked && (
                            <div className="mt-8 px-2 flex items-center gap-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest ">
                                <FaInfoCircle size={12} className="text-gray-400" /> Secure Account Node
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* DANGER ZONE */}
            <div className={`rounded-[40px] border p-8 md:p-12 shadow-2xl relative overflow-hidden group transition-all duration-300 ${isDarkMode ? 'bg-rose-500/5 border-rose-500/10' : 'bg-rose-50 border-rose-100'}`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30"></div>
                <div className="relative">
                    <div className="flex items-center gap-4 mb-6 text-rose-500">
                        <FaTimes size={20} />
                        <h3 className="text-xl font-semibold tracking-normal  uppercase">Danger Zone</h3>
                    </div>
                    <p className={`text-sm font-medium mb-8 max-w-2xl ${isDarkMode ? 'text-gray-400' : 'text-rose-700/70'}`}>
                        Requesting account deletion will notify the administrator. Your account will be deactivated once approved.
                        This action is irreversible after admin confirmation.
                    </p>

                    {profile?.is_deletion_requested ? (
                        <div className={`p-8 rounded-[32px] border inline-flex items-center gap-4 ${isDarkMode ? 'bg-[#020617] border-rose-500/20' : 'bg-white border-rose-200 shadow-sm'}`}>
                            <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-500">
                                <FaInfoCircle size={20} />
                            </div>
                            <div>
                                <p className={`font-semibold text-sm  uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Deletion Request Pending</p>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Submitted on {new Date(profile.deletion_requested_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                const reason = window.prompt("Please provide a reason for deletion:");
                                if (reason) {
                                    handleDeleteRequest(reason);
                                }
                            }}
                            className={`px-10 py-5 border rounded-2xl text-[10px] font-semibold uppercase tracking-normal transition-all shadow-xl ${isDarkMode ? 'bg-rose-400/10 border-rose-400/30 text-rose-500 hover:bg-rose-400 hover:text-white shadow-rose-900/10' : 'bg-white border-rose-200 text-rose-400 hover:bg-rose-400 hover:text-white hover:border-rose-400'}`}
                        >
                            Request Account Deletion
                        </button>
                    )}
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)'}; border-radius: 10px; }
            `}</style>
        </div>
    );
}

