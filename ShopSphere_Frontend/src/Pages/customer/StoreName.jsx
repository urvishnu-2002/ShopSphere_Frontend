import React, { useState } from "react";
import StepProgress from "../../Components/StepProgress";
import { useNavigate } from "react-router-dom";


export default function StoreName() {
    const [storeName, setStoreName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleContinue = () => {
        if (!storeName.trim()) {
            setError("Please enter your store name");
            return;
        }

        setError("");

        // ✅ Save store name (temporary persistence)
        localStorage.setItem("shopSphereStoreName", storeName.trim());

        // ✅ Navigate to next onboarding step
        navigate("/shipping-address");
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">

            {/* Header */}
            <header className="flex items-center justify-between px-8 py-5 bg-purple-700 shadow-sm">
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

                    {/* Store Name Input */}
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
                        ${error
                                ? "border-red-500 focus:ring-red-200"
                                : "border-purple-200 focus:ring-purple-600"
                            }`}
                    />

                    {error && (
                        <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>
                    )}

                    {/* Footer */}
                    <div className="mt-10 flex justify-end">
                        <button
                            onClick={handleContinue}
                            disabled={!storeName}
                            className={`px-6 py-3 rounded-lg font-medium shadow-md transition
                      ${!storeName
                                    ? "bg-purple-300 cursor-not-allowed text-white"
                                    : "bg-purple-700 hover:bg-purple-800 text-white"
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
