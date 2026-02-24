import React, { useState } from "react";
import StepProgress from "../../Components/StepProgress";
import { useNavigate } from "react-router-dom";

export default function StoreName() {
    const [storeName, setStoreName] = useState("");
    const [storeDescription, setStoreDescription] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleContinue = () => {
        if (!storeName.trim() || !businessType.trim() || !storeDescription.trim()) {
            setError("Please fill in all fields");
            return;
        }

        setError("");

        // ✅ Persist data for next steps
        const storeData = {
            shopName: storeName.trim(),
            shopDescription: storeDescription.trim(),
            businessType: businessType.trim()
        };
        localStorage.setItem("vendorStoreData", JSON.stringify(storeData));
        localStorage.setItem("shop_name", storeName.trim()); // Legacy support
        localStorage.setItem("shop_description", storeDescription.trim());
        localStorage.setItem("business_type", businessType.trim());

        navigate("/shipping-address");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff]">

            {/* Header */}
            <header className="flex items-center justify-between px-8 py-5 bg-gradient-to-r from-orange-400 to-purple-500 shadow-sm">
                <h1 className="text-sm font-bold text-white">
                    ShopSphere Seller Central
                </h1>
            </header>

            <main className="px-6 py-12">
                <StepProgress />

                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-10">

                    <h2 className="text-2xl font-bold mb-2">
                        Name your ShopSphere store
                    </h2>

                    <p className="text-gray-500 mb-8">
                        Your ShopSphere store name can be updated anytime from your account
                        settings.
                    </p>

                    {/* Store Name */}
                    <label className="block text-sm font-medium mb-2">
                        Your ShopSphere Store Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter your store name"
                        value={storeName}
                        onChange={(e) => {
                            setStoreName(e.target.value);
                            if (error) setError("");
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all
                        ${error && !storeName
                                ? "border-red-500 focus:ring-red-200"
                                : "border-purple-200 focus:ring-purple-600"
                            }`}
                    />

                    {/* Shop Description */}
                    <label className="block text-sm font-medium mb-2 mt-6">
                        Shop Description
                    </label>

                    <textarea
                        placeholder="Tell us about your business..."
                        value={storeDescription}
                        onChange={(e) => {
                            setStoreDescription(e.target.value);
                            if (error) setError("");
                        }}
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all
                        ${error && !storeDescription
                                ? "border-red-500 focus:ring-red-200"
                                : "border-purple-200 focus:ring-purple-600"
                            }`}
                    />

                    {/* Business Type */}
                    <label className="block text-sm font-medium mb-2 mt-6">
                        Business Type
                    </label>

                    <input
                        type="text"
                        placeholder="Retail / Wholesale / Services"
                        value={businessType}
                        onChange={(e) => {
                            setBusinessType(e.target.value);
                            if (error) setError("");
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all
                        ${error
                                ? "border-red-500 focus:ring-red-200"
                                : "border-purple-200 focus:ring-purple-600"
                            }`}
                    />

                    {error && (
                        <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>
                    )}

                    {/* Footer */}
                    <div className="mt-10 flex justify-end">
                        <button
                            onClick={handleContinue}
                            disabled={!storeName || !businessType}
                            className={`px-6 py-3 rounded-lg font-medium shadow-md transition
                            ${!storeName || !businessType
                                    ? "bg-purple-300 cursor-not-allowed text-white"
                                    : "bg-gradient-to-r from-orange-400 to-purple-500 hover:from-orange-600 hover:to-purple-700 text-white"
                                }`}
                        >
                            Save and Continue
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
}
