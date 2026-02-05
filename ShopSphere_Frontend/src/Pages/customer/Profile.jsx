import React, { useState } from 'react';
import { FaUser, FaCamera, FaCheck, FaTimes, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Dummy Data State (Simulating Backend Response)
    const [user, setUser] = useState({
        firstName: "Balaji",
        lastName: "Rekha",
        email: "balaji_rekha@example.com",
        phone: "+91 98765 43210",
        street: "123 Tech Park, Electronic City",
        city: "Bangalore",
        state: "Karnataka",
        zip: "560100",
        photo: null // Placeholder for profile photo
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API Update
        setIsEditing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 shadow-sm ${isEditing
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:shadow-md hover:-translate-y-0.5'
                            }`}
                    >
                        {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                    </button>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Top Section: Photo & Basic Info */}
                    <div className="p-8 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Profile Photo */}
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 text-4xl font-bold shadow-inner ring-4 ring-white">
                                    {user.photo ? (
                                        <img src={user.photo} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        user.firstName.charAt(0)
                                    )}
                                </div>
                                {isEditing && (
                                    <button className="absolute bottom-0 right-0 p-2.5 bg-white text-gray-600 rounded-full shadow-lg border border-gray-100 hover:text-blue-600 hover:scale-110 transition-all duration-200">
                                        <FaCamera className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {user.firstName} {user.lastName}
                                </h2>
                                <p className="text-gray-500 font-medium">{user.email}</p>
                                {isEditing && (
                                    <button className="mt-2 text-sm text-blue-600 font-semibold hover:text-blue-700 hover:underline">
                                        Change Photo
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Personal Information */}
                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <FaUser className="text-gray-400 w-4 h-4" /> Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={user.firstName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={user.lastName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={user.email}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={user.phone}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Address Information */}
                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-gray-400 w-4 h-4" /> Address Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={user.street}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={user.city}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State / Province</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={user.state}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        value={user.zip}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Save Button */}
                        {isEditing && (
                            <div className="flex justify-end pt-4 animate-fade-in">
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Success Popup */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                            <FaCheck className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Updated!</h3>
                        <p className="text-gray-500 mb-6">Your profile information has been saved successfully.</p>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
