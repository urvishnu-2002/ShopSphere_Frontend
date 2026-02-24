import React, { useState } from "react";
import StepProgress from "../../Components/StepProgress";
import { useNavigate } from "react-router-dom";
import { validateGST, validateUsername, validateEmail, validatePassword } from "../../utils/validators";

export default function VerifyGST() {
    const navigate = useNavigate();
    const [gst, setGst] = useState("");
    const [gstFile, setGstFile] = useState(null);
    const [error, setError] = useState("");
    const [fileError, setFileError] = useState("");
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [credentials, setCredentials] = useState({ username: "", email: "", password: "" });
    const [credErrors, setCredErrors] = useState({});

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
            setFileError("Allowed file types: PDF, JPG, PNG");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setFileError("Max file size is 10 MB");
            return;
        }
        setFileError("");
        setGstFile(file);
    };

    const handleContinue = () => {
        const isUserLoggedIn = !!localStorage.getItem("user");

        if (!gst) { setError("Please enter a GST number."); return; }

        const gstErr = validateGST(gst.toUpperCase());
        if (gstErr) { setError(gstErr); return; }

        if (!gstFile) { setError("Mandatory GST certificate upload required."); return; }

        if (!isUserLoggedIn) {
            const errs = {};
            const unErr = validateUsername(credentials.username);
            const emErr = validateEmail(credentials.email);
            const pwErr = validatePassword(credentials.password);
            if (unErr) errs.username = unErr;
            if (emErr) errs.email = emErr;
            if (pwErr) errs.password = pwErr;
            if (Object.keys(errs).length > 0) {
                setCredErrors(errs);
                setError(Object.values(errs)[0]);
                return;
            }
        }

        setError("");
        setShowVerificationModal(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff]">
            <header className="flex items-center justify-between px-8 py-5 bg-gradient-to-r from-orange-400 to-purple-500 shadow-sm text-white font-bold">
                ShopSphere Seller Central
            </header>

            <main className="px-6 py-12">
                <StepProgress />

                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter GST Details</h2>
                    <p className="text-gray-500 mb-8">GST number and certificate are mandatory for legal compliance.</p>

                    {/* GST Number Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            15-digit GST Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="27ABCDE1234F1Z5"
                            value={gst}
                            maxLength={15}
                            onChange={(e) => {
                                setGst(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
                                if (error) setError("");
                            }}
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all font-mono tracking-widest
                            ${error && !gst ? "border-red-500 focus:ring-red-200 bg-red-50" : "border-purple-200 focus:ring-purple-500"}`}
                        />
                        {gst.length > 0 && gst.length < 15 && (
                            <p className="text-xs text-gray-400 mt-1">{15 - gst.length} more characters needed</p>
                        )}
                        {gst.length === 15 && !validateGST(gst) && (
                            <p className="text-xs text-green-600 font-bold mt-1">✓ Valid GST format</p>
                        )}
                    </div>

                    {/* GST File Upload */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload GST Certificate <span className="text-red-500">*</span> (Mandatory)
                        </label>
                        <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 transition-colors ${fileError ? 'border-red-300 bg-red-50' : 'border-purple-200 bg-purple-50/30'}`}>
                            <input type="file" onChange={handleFileChange} className="text-xs text-gray-500" accept=".pdf,.jpg,.jpeg,.png" />
                            {gstFile && <p className="text-xs text-green-600 font-bold italic">✓ {gstFile.name} uploaded</p>}
                        </div>
                        {fileError && <p className="text-red-500 text-xs mt-1 font-bold">⚠ {fileError}</p>}
                    </div>

                    {/* Account creation for non-logged-in users */}
                    {!localStorage.getItem("user") && (
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <h3 className="font-semibold text-gray-700">Account Creation</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Username (letters only)"
                                        value={credentials.username}
                                        onChange={(e) => {
                                            setCredentials({ ...credentials, username: e.target.value });
                                            setCredErrors(prev => ({ ...prev, username: null }));
                                        }}
                                        className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${credErrors.username ? 'border-red-400 bg-red-50' : 'border-purple-100'}`}
                                    />
                                    {credErrors.username && <p className="text-red-500 text-[10px] mt-0.5 font-bold">{credErrors.username}</p>}
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        value={credentials.email}
                                        onChange={(e) => {
                                            setCredentials({ ...credentials, email: e.target.value });
                                            setCredErrors(prev => ({ ...prev, email: null }));
                                        }}
                                        className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${credErrors.email ? 'border-red-400 bg-red-50' : 'border-purple-100'}`}
                                    />
                                    {credErrors.email && <p className="text-red-500 text-[10px] mt-0.5 font-bold">{credErrors.email}</p>}
                                </div>
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Strong password (8+ chars, uppercase, number, special)"
                                    value={credentials.password}
                                    onChange={(e) => {
                                        setCredentials({ ...credentials, password: e.target.value });
                                        setCredErrors(prev => ({ ...prev, password: null }));
                                    }}
                                    className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${credErrors.password ? 'border-red-400 bg-red-50' : 'border-purple-100'}`}
                                />
                                {credErrors.password && <p className="text-red-500 text-[10px] mt-0.5 font-bold">{credErrors.password}</p>}
                            </div>
                        </div>
                    )}

                    {error && <p className="text-red-500 text-xs mt-3 font-medium">⚠ {error}</p>}

                    <div className="flex items-center gap-3 mt-8">
                        <input type="radio" id="pan-radio" name="verif-type" onChange={() => navigate("/verifyPAN")} />
                        <label htmlFor="pan-radio" className="text-sm text-gray-700">I only sell non-GST categories (Verify via PAN)</label>
                    </div>

                    <div className="mt-10 flex justify-between items-center">
                        <p className="text-[10px] text-gray-400">🔒 Secure Verification Protocol Active</p>
                        <button
                            onClick={handleContinue}
                            className="px-8 py-3 bg-gradient-to-r from-orange-400 to-purple-500 text-white rounded-lg font-bold shadow-lg transition-all uppercase tracking-widest text-xs hover:from-orange-500"
                        >
                            Verify &amp; Continue
                        </button>
                    </div>
                </div>

                {showVerificationModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
                            <h3 className="text-xl font-bold mb-4">GST Node Received</h3>
                            <p className="text-sm text-gray-600 mb-8 font-medium">Verification will be finalized during audit. You may proceed with store setup.</p>
                            <button
                                onClick={() => {
                                    localStorage.setItem("vendorGSTData", JSON.stringify({ gstNumber: gst, idType: "gst" }));
                                    localStorage.setItem("gst_number", gst);
                                    localStorage.setItem("id_type", "gst");
                                    if (!localStorage.getItem("user")) {
                                        localStorage.setItem("username", credentials.username);
                                        localStorage.setItem("email", credentials.email);
                                        localStorage.setItem("password", credentials.password);
                                    }
                                    setShowVerificationModal(false);
                                    navigate("/store-name");
                                }}
                                className="px-10 py-4 bg-purple-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-purple-700 transition-colors"
                            >
                                Continue Registry
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
