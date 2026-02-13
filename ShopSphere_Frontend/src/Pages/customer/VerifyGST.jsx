import React, { useState } from "react";
import StepProgress from "../../Components/StepProgress";
import { useNavigate } from "react-router-dom";

export default function VerifyGST() {
    const navigate = useNavigate();
    const [gst, setGst] = useState("");
    const [error, setError] = useState("");

    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
        password: ""
    });

    const validateGST = (gst) => {
        // 2-digit state code, 10-digit PAN, 1-digit entity, Z, 1-digit check
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return gstRegex.test(gst);
    };

    const handleContinue = () => {
        const isUserLoggedIn = !!localStorage.getItem("user");

        if (!gst) {
            setError("Please enter a GST number");
            return;
        }

        if (!validateGST(gst.toUpperCase())) {
            setError("Please enter a valid GST number (e.g., 22AAAAA0000A1Z5)");
            return;
        }

        if (!isUserLoggedIn) {
            if (!credentials.username || !credentials.email || !credentials.password) {
                setError("Please fill in your account details to continue");
                return;
            }
        }

        setError("");

        // ✅ Save all data to localStorage for the next steps
        localStorage.setItem("gst_number", gst.toUpperCase());
        localStorage.setItem("id_type", "gst");
        localStorage.setItem("vendorGSTData", JSON.stringify({ gstNumber: gst.toUpperCase(), idType: "gst" }));

        if (!isUserLoggedIn) {
            localStorage.setItem("username", credentials.username);
            localStorage.setItem("email", credentials.email);
            localStorage.setItem("password", credentials.password);
        }

        navigate("/store-name");
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">

            {/* Header */}
            <header className="flex items-center justify-between px-8 py-5 bg-purple-700 shadow-sm">
                <div className="flex items-center gap-1">
                    {/* <img
                        src="/s_logo.png"
                        alt="ShopSphere"
                        className="h-8 w-12"
                    /> */}
                    <h1 className="text-x font-bold text-white">
                        ShopSphere Seller Central
                    </h1>
                </div>
            </header>

            {/* Content */}
            <main className="px-6 py-12">
                <StepProgress />

                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Enter GST Number
                    </h2>
                    <p className="text-gray-500 mb-8">
                        GST number is mandatory to sell online on ShopSphere.
                    </p>

                    {/* GST Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            15-digit GST Number
                        </label>
                        <input
                            type="text"
                            placeholder="22AAAAA0000A1Z5"
                            value={gst}
                            maxLength={15}
                            onChange={(e) => {
                                setGst(e.target.value.toUpperCase());
                                if (error) setError("");
                            }}
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all 
                            ${error && !gst ? "border-red-500 focus:ring-red-200" : "border-purple-200 focus:ring-purple-500"}`}
                        />
                    </div>

                    {/* Account Details (if not logged in) */}
                    {!localStorage.getItem("user") && (
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <h3 className="font-semibold text-gray-700">Account Creation</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Username</label>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={credentials.username}
                                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={credentials.email}
                                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {error && <p className="text-red-500 text-xs mt-3 ml-1 font-medium">{error}</p>}

                    {/* Non-GST Option */}
                    <div className="flex items-center gap-3 mt-6">
                        <input
                            type="radio"
                            id="nongst"
                            name="gst-option"
                            className="accent-purple-600"
                            onChange={() => navigate("/verifyPAN")}
                        />
                        <label htmlFor="nongst" className="text-sm text-gray-700">
                            I only sell non-GST categories (Books, Educational items, etc.)
                        </label>
                    </div>

                    {/* Footer */}
                    <div className="mt-10 flex justify-between items-center">
                        <p className="text-xs text-gray-400">
                            🔒 Your information is securely stored as per ShopSphere Privacy Policy.
                        </p>
                        <button
                            onClick={handleContinue}
                            className="px-6 py-3 bg-purple-700 text-white rounded-lg 
                            hover:bg-purple-800 transition font-medium shadow-md">
                            Continue
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
