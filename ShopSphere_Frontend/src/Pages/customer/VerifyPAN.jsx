import React, { useState } from "react";
import StepProgress from "../../Components/StepProgress";
import { useNavigate } from "react-router-dom";

export default function VerifyPAN() {
    const navigate = useNavigate();

    // EXISTING STATE
    const [pan, setPan] = useState("");
    const [error, setError] = useState("");

    // NEW STATE (added)
    const [panName, setPanName] = useState("");
    const [panFile, setPanFile] = useState(null);
    const [panOwnerChecked, setPanOwnerChecked] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [termsChecked, setTermsChecked] = useState(false);

    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
        password: ""
    });

    const validatePAN = (pan) => {
        const panRegex = /^[A-Z]{5}(?!0000)[0-9]{4}[A-Z]{1}$/;
        return panRegex.test(pan);
    };

    const isPanValid = validatePAN(pan);

    const validatePanName = (name) => {
        if (!name.trim()) return "Please enter PAN name";

        // Only letters and single spaces between words
        const panNameRegex = /^[A-Za-z]+( [A-Za-z]+)*$/;

        if (!panNameRegex.test(name)) {
            return "PAN name can contain only letters and single spaces";
        }

        return "";
    };


    const handleContinue = () => {
        const isUserLoggedIn = !!localStorage.getItem("user");

        if (!pan) {
            setError("Please enter a PAN number");
            return;
        } else if (!validatePAN(pan.toUpperCase())) {
            setError("Please enter a valid PAN number (e.g., ABCDE1234F)");
            return;
        }

        const panNameError = validatePanName(panName);
        if (panNameError) {
            setError(panNameError);
            return;
        }

        if (!panFile) {
            setError("Please upload PAN document");
            return;
        }

        if (!panOwnerChecked) {
            setError("Please confirm PAN ownership to continue");
            return;
        }

        if (!isUserLoggedIn) {
            if (!credentials.username || !credentials.email || !credentials.password) {
                setError("Please fill in your account details to continue");
                return;
            }
        }

        setError("");
        setShowVerificationModal(true);
    };


    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedTypes.includes(file.type)) {
            setError("Allowed file types: pdf, jpg, png, doc, docx");
            e.target.value = "";
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError("Maximum file size is 10 MB");
            e.target.value = "";
            return;
        }

        setError("");
        setPanFile(file);
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff]">

            {/* Header */}
            <header className="flex items-center justify-between px-8 py-5 bg-gradient-to-r from-orange-400 to-purple-500 shadow-sm">
                <h1 className="text-x font-bold text-white">
                    ShopSphere Seller Central
                </h1>
            </header>

            <main className="px-6 py-12">
                <StepProgress />

                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-10">
                    <h2 className="text-2xl font-bold mb-2">Enter PAN Number</h2>
                    <p className="text-gray-500 mb-8">
                        PAN number is mandatory to sell non-GST categories.
                    </p>

                    {/* PAN NUMBER */}
                    <label className="block text-sm font-medium mb-2">
                        10-digit PAN Number
                    </label>
                    <input
                        type="text"
                        placeholder="ABCDE1234F"
                        value={pan}
                        maxLength={10}
                        onChange={(e) => {
                            setPan(e.target.value.toUpperCase());
                            if (error) setError("");
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all 
              ${error && !isPanValid
                                ? "border-red-500 focus:ring-red-200"
                                : "border-purple-200 focus:ring-purple-600"
                            }`}
                    />

                    {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}

                    {/* Account Details (if not logged in) */}
                    {!localStorage.getItem("user") && (
                        <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                            <h3 className="font-semibold text-gray-700">Account Creation</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Username</label>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={credentials.username}
                                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-purple-100 focus:ring-2 focus:ring-purple-600 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={credentials.email}
                                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-purple-100 focus:ring-2 focus:ring-purple-600 outline-none transition-all"
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
                                    className="w-full px-4 py-2 rounded-lg border border-purple-100 focus:ring-2 focus:ring-purple-600 outline-none transition-all"
                                />
                            </div>
                        </div>
                    )}

                    {/* SWITCH TO GST */}
                    <div className="flex items-center gap-3 mt-6">
                        <input
                            type="radio"
                            className="accent-purple-600"
                            onChange={() => navigate("/verifyGST")}
                        />
                        <label className="text-sm text-gray-700">
                            I have GST number
                        </label>
                    </div>

                    {isPanValid && (
                        <>
                            <div className="mt-8">
                                <label className="block text-sm font-medium mb-2">
                                    PAN Name
                                </label>
                                <input
                                    type="text"
                                    value={panName}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^A-Za-z ]/g, "");
                                        setPanName(value);
                                        if (error) setError("");
                                    }}
                                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-600"
                                />

                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium mb-2">
                                    Upload PAN document
                                </label>

                                <div className="border-2 border-dashed border-purple-300 rounded-lg p-5 flex items-center gap-4">
                                    <label className="cursor-pointer bg-gradient-to-r from-orange-400 to-purple-500 text-white px-4 py-2 rounded-lg text-sm">
                                        Upload file
                                        <input type="file" hidden onChange={handleFileChange} />
                                    </label>

                                    <span className="text-sm text-gray-500">
                                        {panFile ? panFile.name : "Drag file here to upload"}
                                    </span>
                                </div>

                                <p className="text-xs text-gray-400 mt-2">
                                    Allowed extensions: pdf, jpg, png, doc • Max size: 10 MB
                                </p>
                            </div>

                            <div className="mt-6 space-y-3 text-sm text-gray-700">
                                <label className="flex items-start gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="accent-purple-600 mt-1"
                                        checked={panOwnerChecked}
                                        onChange={(e) => setPanOwnerChecked(e.target.checked)}
                                    />
                                    <span>The above PAN belongs to you.</span>
                                </label>

                                {/* <label className="flex items-start gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="accent-purple-600 mt-1"
                                        checked={termsChecked}
                                        onChange={(e) => setTermsChecked(e.target.checked)}
                                    />
                                    <span>You agree to ShopSphere Seller T&Cs.</span>
                                </label> */}
                            </div>


                        </>
                    )}


                    <div className="mt-10 flex justify-between items-center">
                        <p className="text-xs text-gray-400">
                            🔒 Your information is securely stored as per ShopSphere Privacy Policy.
                        </p>

                        <button
                            onClick={handleContinue}
                            disabled={!isPanValid || !panName || !panFile || !panOwnerChecked}
                            className={`px-6 py-3 rounded-lg font-medium shadow-md transition
    ${!isPanValid || !panName || !panFile || !panOwnerChecked
                                    ? "bg-purple-300 cursor-not-allowed text-white"
                                    : "bg-gradient-to-r from-orange-400 to-purple-500 hover:from-orange-600 hover:to-purple-700 text-white"
                                }`}
                        >
                            Save and Continue
                        </button>

                    </div>
                </div>
                {showVerificationModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg px-10 py-8 animate-scaleIn relative overflow-hidden">

                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-purple-400" />

                            <div className="flex justify-center mt-4">
                                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center
          animate-pulse">
                                    ⏳
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-center mt-6 text-gray-800">
                                PAN verification in progress
                            </h3>

                            <p className="text-sm text-gray-600 text-center mt-3 leading-relaxed">
                                It takes up to <strong>5 business days</strong> for the document to be verified.
                                You can continue with your registration process meanwhile.
                            </p>

                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={() => {
                                        // ✅ Save PAN data to localStorage for final submission
                                        const panData = {
                                            panNumber: pan.toUpperCase(),
                                            panName: panName,
                                            idType: 'pan'
                                        };
                                        localStorage.setItem("vendorGSTData", JSON.stringify(panData));
                                        localStorage.setItem("pan_number", pan.toUpperCase());
                                        localStorage.setItem("pan_name", panName);
                                        localStorage.setItem("id_type", "pan");

                                        // ✅ Save credentials if needed
                                        if (!localStorage.getItem("user")) {
                                            localStorage.setItem("username", credentials.username);
                                            localStorage.setItem("email", credentials.email);
                                            localStorage.setItem("password", credentials.password);
                                        }

                                        setShowVerificationModal(false);
                                        navigate("/store-name");
                                    }}
                                    className="px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 transition shadow-lg"
                                >
                                    Continue Registration
                                </button>

                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
