import { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaMapMarkerAlt, FaTruck, FaIdCard, FaUniversity, FaClock, FaLocationArrow, FaSave, FaInfoCircle } from 'react-icons/fa';
import { fetchAgentProfile, updateAgentProfile, requestDeletion } from '../../api/delivery_axios';
import { reverseGeocode } from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fetchingLocation, setFetchingLocation] = useState(false);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchAgentProfile();
                setProfile(data);
            } catch (error) {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateAgentProfile(profile);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleFetchLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported by your browser");
            return;
        }

        setFetchingLocation(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const data = await reverseGeocode(latitude, longitude);
                if (data && data.address) {
                    const addr = data.address;
                    const streetParts = [addr.house_number, addr.road, addr.neighbourhood, addr.suburb, addr.industrial, addr.commercial].filter(Boolean);
                    let formattedStreet = streetParts.join(', ');
                    if (formattedStreet.length < 5 && data.display_name) {
                        formattedStreet = data.display_name.split(',').slice(0, 3).join(',').trim();
                    }
                    const updatedFields = {
                        address: formattedStreet,
                        city: addr.city || addr.town || addr.village || addr.suburb || profile.city,
                        state: addr.state || profile.state,
                        postal_code: addr.postcode || profile.postal_code
                    };
                    setProfile(prev => ({ ...prev, ...updatedFields }));
                    try {
                        await updateAgentProfile({ ...profile, ...updatedFields });
                        toast.success("Location updated successfully!");
                    } catch (saveError) {
                        toast.error("Location fetched but failed to save");
                    }
                }
            } catch (error) {
                toast.error("Failed to get address from coordinates");
            } finally {
                setFetchingLocation(false);
            }
        }, (error) => {
            toast.error("Location error: " + error.message);
            setFetchingLocation(false);
        });
    };

    if (loading) return (
        <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
            <div className={`w-16 h-16 border-4 rounded-full animate-spin mb-4 ${isDarkMode ? 'border-white/5 border-t-indigo-500' : 'border-slate-200 border-t-orange-500'}`}></div>
            <p className={`text-[10px] font-bold uppercase tracking-wider  ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Loading your profile...</p>
        </div>
    );

    return (
        <div className={`min-h-screen pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
            {/* Header */}
            <div className={`px-4 md:px-8 py-8 border-b backdrop-blur-xl sticky top-0 z-20 mb-8 transition-all ${isDarkMode ? 'bg-[#0f172a]/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-left w-full md:w-auto">
                        <h1 className={`text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-4  uppercase transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                                <FaUser size={20} />
                            </div>
                            My Profile
                        </h1>
                        <p className={`text-[10px] font-bold uppercase tracking-wider mt-2 ml-1 flex items-center gap-2  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Your personal details & settings
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-8">
                <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">

                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-8 md:space-y-10">
                        {/* Personal Information */}
                        <div className={`rounded-[40px] md:rounded-[48px] p-6 md:p-10 shadow-2xl border relative overflow-hidden group transition-all ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/305 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8 md:mb-10">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${isDarkMode ? 'bg-orange-500/10 text-indigo-400 border-indigo-400/10' : 'bg-indigo-50 text-orange-500 border-indigo-100'}`}>
                                        <FaUser size={16} />
                                    </div>
                                    <h2 className={`text-xl md:text-2xl font-bold tracking-tight  transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Personal Info</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    <div className="space-y-3 text-left">
                                        <label className={`text-[9px] font-bold uppercase tracking-wider ml-1  transition-colors ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Full Name</label>
                                        <input
                                            type="text"
                                            value={profile?.user_name || ''}
                                            readOnly
                                            className={`w-full px-5 py-4 rounded-2xl border font-bold cursor-not-allowed  shadow-inner transition-all ${isDarkMode ? 'bg-[#0f172a] border-white/5 text-slate-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                                        />
                                    </div>
                                    <div className="space-y-3 text-left">
                                        <label className={`text-[9px] font-bold uppercase tracking-wider ml-1  transition-colors ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Username</label>
                                        <input
                                            type="text"
                                            value={profile?.username || ''}
                                            readOnly
                                            className={`w-full px-5 py-4 rounded-2xl border font-bold cursor-not-allowed  shadow-inner transition-all ${isDarkMode ? 'bg-[#0f172a] border-white/5 text-slate-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                                        />
                                    </div>
                                    <div className="space-y-3 text-left">
                                        <label className={`text-[9px] font-bold uppercase tracking-wider ml-1  transition-colors ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Email Address</label>
                                        <input
                                            type="email"
                                            value={profile?.user_email || ''}
                                            readOnly
                                            className={`w-full px-5 py-4 rounded-2xl border font-bold cursor-not-allowed  shadow-inner transition-all ${isDarkMode ? 'bg-[#0f172a] border-white/5 text-slate-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                                        />
                                    </div>
                                    <div className="space-y-3 text-left">
                                        <label className={`text-[9px] font-bold uppercase tracking-wider ml-1  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Phone Number</label>
                                        <div className="relative">
                                            <FaPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400" size={14} />
                                            <input
                                                type="text"
                                                name="phone_number"
                                                value={profile?.phone_number || ''}
                                                onChange={handleChange}
                                                className={`w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-transparent font-bold outline-none focus:border-orange-500 transition-all shadow-inner ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-slate-50 text-slate-900'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className={`rounded-[40px] md:rounded-[48px] p-6 md:p-10 shadow-2xl border relative overflow-hidden group transition-all ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                            <div className="relative z-10">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/10' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                            <FaMapMarkerAlt size={16} />
                                        </div>
                                        <h2 className={`text-xl md:text-2xl font-bold tracking-tight  transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>My Address</h2>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleFetchLocation}
                                        disabled={fetchingLocation}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold uppercase text-[9px] tracking-widest transition-all active:scale-95 disabled:opacity-50 border  ${isDarkMode ? 'bg-orange-500/20 text-indigo-400 hover:bg-orange-500 hover:text-white border-orange-500/20' : 'bg-indigo-50 text-orange-500 hover:bg-orange-500 hover:text-white border-indigo-100'}`}
                                    >
                                        <FaLocationArrow className={fetchingLocation ? 'animate-spin' : ''} size={12} />
                                        {fetchingLocation ? 'Detecting...' : 'Use My Location'}
                                    </button>
                                </div>
                                <div className="space-y-6 md:space-y-8">
                                    <div className="space-y-3 text-left">
                                        <label className={`text-[9px] font-bold uppercase tracking-wider ml-1  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Street Address</label>
                                        <textarea
                                            name="address"
                                            value={profile?.address || ''}
                                            onChange={handleChange}
                                            rows="2"
                                            className={`w-full px-5 py-4 rounded-2xl border-2 border-transparent font-bold outline-none focus:border-orange-500 transition-all shadow-inner resize-none ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-slate-50 text-slate-900'}`}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {[
                                            { label: 'City', name: 'city' },
                                            { label: 'State', name: 'state' },
                                            { label: 'Postal Code', name: 'postal_code' },
                                        ].map(({ label, name }) => (
                                            <div key={name} className="space-y-3 text-left">
                                                <label className={`text-[9px] font-bold uppercase tracking-wider ml-1  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{label}</label>
                                                <input
                                                    type="text"
                                                    name={name}
                                                    value={profile?.[name] || ''}
                                                    onChange={handleChange}
                                                    className={`w-full px-5 py-4 rounded-2xl border-2 border-transparent font-bold outline-none focus:border-orange-500 transition-all shadow-inner ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-slate-50 text-slate-900'}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-4 space-y-8 md:space-y-10">
                        {/* Vehicle Info */}
                        <div className={`rounded-[40px] md:rounded-[48px] p-8 shadow-2xl text-white relative overflow-hidden group transition-all ${isDarkMode ? 'bg-orange-500 shadow-orange-500/30' : 'bg-slate-900 shadow-slate-200'}`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                        <FaTruck size={18} />
                                    </div>
                                    <h2 className="text-lg font-bold tracking-tight  uppercase">Vehicle Details</h2>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-3 text-left">
                                        <label className="text-[8px] font-bold uppercase tracking-wider text-indigo-200 ml-1 ">Vehicle Type</label>
                                        <div className="relative">
                                            <select
                                                name="vehicle_type"
                                                value={profile?.vehicle_type || ''}
                                                onChange={handleChange}
                                                className={`w-full px-5 py-4 rounded-2xl border text-white font-bold outline-none focus:border-white/50 transition-all cursor-pointer appearance-none  ${isDarkMode ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'}`}
                                            >
                                                <option value="bicycle" className="bg-slate-900">Bicycle</option>
                                                <option value="motorcycle" className="bg-slate-900">Motorcycle</option>
                                                <option value="car" className="bg-slate-900">Car</option>
                                                <option value="van" className="bg-slate-900">Van</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-left">
                                        <label className="text-[8px] font-bold uppercase tracking-wider text-indigo-200 ml-1 ">Vehicle Number</label>
                                        <input
                                            type="text"
                                            name="vehicle_number"
                                            value={profile?.vehicle_number || ''}
                                            onChange={handleChange}
                                            placeholder="XX-00-YY-0000"
                                            className={`w-full px-5 py-4 rounded-2xl border text-white font-bold outline-none focus:border-white/50 transition-all placeholder:text-white/20 shadow-inner  ${isDarkMode ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'}`}
                                        />
                                    </div>
                                    <div className="space-y-3 text-left">
                                        <label className="text-[8px] font-bold uppercase tracking-wider text-indigo-200 ml-1 ">Delivery Radius: {profile?.preferred_delivery_radius || 5} km</label>
                                        <input
                                            type="range"
                                            name="preferred_delivery_radius"
                                            min="1"
                                            max="50"
                                            value={profile?.preferred_delivery_radius || 5}
                                            onChange={handleChange}
                                            className="w-full accent-white h-1.5 bg-white/20 rounded-lg cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bank Details */}
                        <div className={`rounded-[40px] md:rounded-[48px] p-8 border shadow-2xl relative overflow-hidden transition-all ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/10' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                        <FaUniversity size={16} />
                                    </div>
                                    <h2 className={`text-lg font-bold tracking-tight  uppercase transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Bank Details</h2>
                                </div>
                                <div className="space-y-5">
                                    {[
                                        { label: 'Account Holder Name', name: 'bank_holder_name', type: 'text' },
                                        { label: 'Account Number', name: 'bank_account_number', type: 'text' },
                                        { label: 'IFSC Code', name: 'bank_ifsc_code', type: 'text' },
                                        { label: 'Bank Name', name: 'bank_name', type: 'text' },
                                    ].map(({ label, name, type }) => (
                                        <div key={name} className="space-y-2 text-left">
                                            <label className={`text-[9px] font-bold uppercase tracking-wider ml-1  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{label}</label>
                                            <input
                                                type={type}
                                                name={name}
                                                value={profile?.[name] || ''}
                                                onChange={handleChange}
                                                className={`w-full px-5 py-3.5 rounded-2xl border-2 border-transparent font-bold text-sm outline-none focus:border-orange-500 transition-all shadow-inner  ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-slate-50 text-slate-900'}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="sticky bottom-6 z-20">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-4 bg-orange-500 text-white px-8 py-5 md:py-6 rounded-[28px] font-bold uppercase tracking-wider text-[11px] hover:bg-indigo-500 transition-all shadow-2xl shadow-orange-500/30 active:scale-95 disabled:opacity-70 "
                            >
                                <FaSave className="transition-transform" size={16} />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>

                {/* DANGER ZONE */}
                <div className={`mt-12 md:mt-16 rounded-[40px] md:rounded-[48px] p-8 md:p-12 border shadow-2xl relative overflow-hidden group transition-all ${isDarkMode ? 'bg-rose-500/5 border-rose-500/10' : 'bg-rose-50 border-rose-100'}`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30"></div>
                    <div className="relative">
                        <div className="flex items-center gap-4 mb-6 text-rose-500">
                            <FaInfoCircle size={20} />
                            <h3 className="text-xl font-bold tracking-tight  uppercase">Danger Zone</h3>
                        </div>
                        <p className={`text-sm font-medium mb-8 max-w-2xl leading-relaxed transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            Requesting account deletion will notify the administrator. Your account will be deactivated once the request is approved.
                            This action is final and all delivery statistics will be archived.
                        </p>

                        {profile?.is_deletion_requested ? (
                            <div className={`p-8 rounded-[32px] border inline-flex items-center gap-4 transition-all ${isDarkMode ? 'bg-[#0f172a] border-rose-500/20' : 'bg-white border-rose-100'}`}>
                                <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-500">
                                    <FaClock size={20} />
                                </div>
                                <div>
                                    <p className={`font-bold text-sm  uppercase tracking-wider transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Deletion Protocol Initiated</p>
                                    <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest mt-1">Awaiting Admin Verification</p>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={async () => {
                                    const reason = window.prompt("Reason for departure:");
                                    if (reason) {
                                        try {
                                            await requestDeletion(reason);
                                            toast.success("Request submitted to central command");
                                            setProfile(prev => ({ ...prev, is_deletion_requested: true }));
                                        } catch (error) {
                                            toast.error("Failed to transmit request");
                                        }
                                    }
                                }}
                                className="px-10 py-5 bg-rose-600/10 border border-rose-600/30 text-rose-500 rounded-2xl text-[10px] font-bold uppercase tracking-wider hover:bg-rose-600 hover:text-white transition-all shadow-xl shadow-rose-900/10 "
                            >
                                Request Account Deletion
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

