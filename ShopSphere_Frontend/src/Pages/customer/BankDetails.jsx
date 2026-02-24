import React, { useState, useEffect, useRef } from "react";
import StepProgress from "../../Components/StepProgress";
import { useNavigate } from "react-router-dom";
import { vendorRegister } from "../../api/vendor_axios";
import { Check } from "lucide-react";

export default function BankDetails() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        holderName: "",
        accountNumber: "",
        confirmAccountNumber: "",
        ifsc: "",
    });

    const [errors, setErrors] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState("");

    // File upload state
    const [idProofFile, setIdProofFile] = useState(null); // The GST or PAN certificate
    const [additionalDocs, setAdditionalDocs] = useState(null);
    const [selfieWithId, setSelfieWithId] = useState(null);
    const [selfiePreview, setSelfiePreview] = useState(null);
    const [fileErrors, setFileErrors] = useState({});

    const idInputRef = useRef(null);
    const docsInputRef = useRef(null);
    const selfieInputRef = useRef(null);

    // Load previously saved vendor data from localStorage
    const [vendorData, setVendorData] = useState({});

    useEffect(() => {
        const gstData = JSON.parse(localStorage.getItem("vendorGSTData") || "{}");
        const storeData = JSON.parse(localStorage.getItem("vendorStoreData") || "{}");
        const shippingData = JSON.parse(localStorage.getItem("vendorShippingData") || "{}");
        const feeData = JSON.parse(localStorage.getItem("vendorFeeData") || "{}");
        const authData = JSON.parse(localStorage.getItem("user") || "{}");

        const combinedData = {
            ...gstData,
            ...storeData,
            ...shippingData,
            ...feeData,
            shopName: storeData.shopName || localStorage.getItem("shop_name"),
            shopDescription: storeData.shopDescription || localStorage.getItem("shop_description"),
            businessType: storeData.businessType || localStorage.getItem("business_type"),
            shippingAddress: shippingData.shippingAddress || localStorage.getItem("shipping_address") || localStorage.getItem("address"),
            gstNumber: gstData.gstNumber || localStorage.getItem("gst_number") || localStorage.getItem("gst"),
            panNumber: gstData.panNumber || localStorage.getItem("pan_number"),
            panName: gstData.panName || localStorage.getItem("pan_name"),
            idType: gstData.idType || localStorage.getItem("id_type") || (gstData.gstNumber ? "gst" : "pan"),
            username: localStorage.getItem("username") || authData.username || "",
            email: localStorage.getItem("email") || authData.email || "",
            password: localStorage.getItem("password") || ""
        };

        if (!combinedData.shippingAddress) {
            const pickup = JSON.parse(localStorage.getItem("pickupAddress") || "null");
            if (pickup) {
                combinedData.shippingAddress = `${pickup.area}, ${pickup.city}, ${pickup.state} - ${pickup.pincode}`;
            }
        }

        setVendorData(combinedData);
    }, []);

    // FIELD VALIDATION
    const validateField = (name, value, currentForm) => {
        switch (name) {
            case "holderName": {
                if (!value.trim()) return "Account holder name is required";
                if (!/^[A-Za-z ]+$/.test(value)) return "Only letters and spaces are allowed";
                if (value.replace(/[^A-Za-z]/g, "").length < 3) return "Name must contain at least 3 letters";
                return "";
            }
            case "accountNumber":
                if (!value) return "Bank account number is required";
                if (!/^\d{9,18}$/.test(value)) return "Account number must be 9 to 18 digits";
                return "";
            case "confirmAccountNumber":
                if (!value) return "Please re-enter account number";
                if (value !== currentForm.accountNumber) return "Account numbers do not match";
                return "";
            case "ifsc":
                if (!value) return "IFSC code is required";
                if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) return "Enter a valid IFSC code";
                return "";
            default:
                return "";
        }
    };

    const handleChange = (field, rawValue) => {
        let value = rawValue;
        if (field === "holderName") value = value.replace(/[^A-Za-z ]/g, "");
        if (field === "accountNumber" || field === "confirmAccountNumber") value = value.replace(/\D/g, "").slice(0, 18);
        if (field === "ifsc") value = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11);

        const updatedForm = { ...form, [field]: value };
        setForm(updatedForm);
        const error = validateField(field, value, updatedForm);
        setErrors({ ...errors, [field]: error });
    };

    // --- File Handlers ---
    const handleFileValidation = (file, maxSizeMB = 10) => {
        if (!file) return null;
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        if (!allowedTypes.includes(file.type)) return "Allowed: PDF, JPG, PNG, DOC, DOCX";
        if (file.size > maxSizeMB * 1024 * 1024) return `Max file size is ${maxSizeMB} MB`;
        return null;
    };

    const handleIdProofChange = (e) => {
        const file = e.target.files?.[0];
        const error = handleFileValidation(file);
        if (error) { setFileErrors(prev => ({ ...prev, idProof: error })); e.target.value = ""; return; }
        setFileErrors(prev => ({ ...prev, idProof: "" }));
        setIdProofFile(file);
    };

    const handleAdditionalDocsChange = (e) => {
        const file = e.target.files?.[0];
        const error = handleFileValidation(file);
        if (error) { setFileErrors(prev => ({ ...prev, docs: error })); e.target.value = ""; return; }
        setFileErrors(prev => ({ ...prev, docs: "" }));
        setAdditionalDocs(file);
    };

    const handleSelfieChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { setFileErrors(prev => ({ ...prev, selfie: "Please upload an image file" })); return; }
        if (file.size > 5 * 1024 * 1024) { setFileErrors(prev => ({ ...prev, selfie: "Max 5 MB" })); return; }
        setFileErrors(prev => ({ ...prev, selfie: "" }));
        setSelfieWithId(file);
        const reader = new FileReader();
        reader.onload = (ev) => setSelfiePreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    // FINAL SUBMIT
    const handleContinue = async () => {
        const newErrors = {};
        Object.keys(form).forEach((key) => {
            const error = validateField(key, form[key], form);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        const newFileErrors = {};
        if (!idProofFile) newFileErrors.idProof = `Please upload your ${vendorData.idType === "gst" ? "GST Certificate" : "PAN Card"}`;
        if (!additionalDocs) newFileErrors.docs = "Please upload supporting documents";
        if (!selfieWithId) newFileErrors.selfie = "Selfie with ID is required";
        setFileErrors(newFileErrors);
        if (Object.keys(newFileErrors).length > 0) return;

        setIsSubmitting(true);
        setApiError("");

        try {
            const completeVendorData = {
                username: vendorData.username || "",
                email: vendorData.email || "",
                password: vendorData.password || "",
                gst_number: vendorData.gstNumber || vendorData.gst || "",
                pan_number: vendorData.panNumber || "",
                pan_name: vendorData.panName || "",
                id_type: vendorData.idType || "gst",
                id_number: vendorData.idNumber || vendorData.gstNumber || vendorData.panNumber || "",
                shop_name: vendorData.shopName || "",
                shop_description: vendorData.shopDescription || "",
                business_type: vendorData.businessType || "retail",
                address: vendorData.shippingAddress || "",
                shipping_fee: vendorData.shippingFee || "0",
                bank_holder_name: form.holderName,
                bank_account_number: form.accountNumber,
                bank_ifsc_code: form.ifsc,
            };

            const files = {
                id_proof_file: idProofFile,
                pan_card_file: vendorData.idType === "pan" ? idProofFile : null,
                additional_documents: additionalDocs,
                selfie_with_id: selfieWithId,
            };

            await vendorRegister(completeVendorData, files);

            localStorage.removeItem("vendorGSTData");
            localStorage.removeItem("vendorStoreData");
            localStorage.removeItem("vendorShippingData");
            localStorage.removeItem("vendorFeeData");
            localStorage.removeItem("username");
            localStorage.removeItem("email");
            localStorage.removeItem("password");

            setShowSuccessModal(true);
        } catch (error) {
            console.error("Error:", error);
            setApiError(error.response?.data?.error || error.message || "Registration failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid =
        Object.values(errors).every(e => !e) &&
        Object.values(form).every(v => v) &&
        !!idProofFile &&
        !!additionalDocs &&
        !!selfieWithId;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff]">
            <header className="px-8 py-5 bg-gradient-to-r from-orange-400 to-purple-500 shadow-sm text-white font-bold">
                ShopSphere Seller Central
            </header>

            <main className="px-6 py-12">
                <StepProgress />

                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Final Step: Bank & KYC</h2>
                    <p className="text-gray-500 mb-10">Complete your profile by adding bank details and uploading verification documents.</p>

                    {apiError && <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{apiError}</div>}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* BANK SECTION */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-700 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm italic">🏦</span>
                                Bank Account
                            </h3>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Holder Name</label>
                                    <input
                                        value={form.holderName}
                                        onChange={(e) => handleChange("holderName", e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                                        placeholder="Name as per bank record"
                                    />
                                    {errors.holderName && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.holderName}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Account Number</label>
                                    <input
                                        value={form.accountNumber}
                                        onChange={(e) => handleChange("accountNumber", e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                                        placeholder="9-18 digit number"
                                    />
                                    {errors.accountNumber && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.accountNumber}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Re-enter Account No.</label>
                                    <input
                                        value={form.confirmAccountNumber}
                                        onChange={(e) => handleChange("confirmAccountNumber", e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                                        placeholder="Confirm number"
                                    />
                                    {errors.confirmAccountNumber && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.confirmAccountNumber}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">IFSC Code</label>
                                    <input
                                        value={form.ifsc}
                                        onChange={(e) => handleChange("ifsc", e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                                        placeholder="e.g. SBIN0001234"
                                    />
                                    {errors.ifsc && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.ifsc}</p>}
                                </div>
                            </div>
                        </div>

                        {/* DOCUMENT SECTION */}
                        <div className="space-y-8">
                            <h3 className="text-lg font-bold text-gray-700 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm italic">📄</span>
                                Verification Bundle
                            </h3>

                            {/* ID PROOF */}
                            <div className="space-y-3">
                                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest">{vendorData.idType === "gst" ? "GST Certificate" : "PAN Card File"} (Required)</label>
                                <div
                                    onClick={() => idInputRef.current?.click()}
                                    className={`p-4 border-2 border-dashed rounded-2xl flex items-center gap-4 cursor-pointer transition-all ${fileErrors.idProof ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200 hover:border-indigo-400'}`}
                                >
                                    <input ref={idInputRef} type="file" hidden onChange={handleIdProofChange} />
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-indigo-500">📁</div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-bold text-slate-700 truncate">{idProofFile ? idProofFile.name : "Upload primary ID proof"}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">PDF, JPG, PNG · 10MB</p>
                                    </div>
                                </div>
                                {fileErrors.idProof && <p className="text-[10px] text-red-500 font-bold">⚠ {fileErrors.idProof}</p>}
                            </div>

                            {/* ADDITIONAL DOCS */}
                            <div className="space-y-3">
                                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest">Documents (Utility/Trade) - Required</label>
                                <div
                                    onClick={() => docsInputRef.current?.click()}
                                    className={`p-4 border-2 border-dashed rounded-2xl flex items-center gap-4 cursor-pointer transition-all ${fileErrors.docs ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200 hover:border-orange-400'}`}
                                >
                                    <input ref={docsInputRef} type="file" hidden onChange={handleAdditionalDocsChange} />
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-orange-500">📂</div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-bold text-slate-700 truncate">{additionalDocs ? additionalDocs.name : "Supporting business docs"}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Plural docs allowed in one PDF</p>
                                    </div>
                                </div>
                                {fileErrors.docs && <p className="text-[10px] text-red-500 font-bold">⚠ {fileErrors.docs}</p>}
                            </div>

                            {/* SELFIE */}
                            <div className="space-y-3">
                                <label className="block text-xs font-black uppercase text-gray-400 tracking-widest">Selfie Holding ID - Required</label>
                                <div
                                    onClick={() => selfieInputRef.current?.click()}
                                    className={`p-4 border-2 border-dashed rounded-2xl flex items-center gap-4 cursor-pointer transition-all ${fileErrors.selfie ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200 hover:border-indigo-400'}`}
                                >
                                    <input ref={selfieInputRef} type="file" hidden accept="image/*" onChange={handleSelfieChange} />
                                    {selfiePreview ? (
                                        <img src={selfiePreview} className="w-10 h-10 rounded-lg object-cover shadow-sm border" alt="preview" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-indigo-500">📷</div>
                                    )}
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-bold text-slate-700 truncate">{selfieWithId ? selfieWithId.name : "Your face + ID Card photo"}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Face & card must be clear</p>
                                    </div>
                                </div>
                                {fileErrors.selfie && <p className="text-[10px] text-red-500 font-bold">⚠ {fileErrors.selfie}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col items-center">
                        <button
                            onClick={handleContinue}
                            disabled={!isFormValid || isSubmitting}
                            className={`px-16 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isFormValid && !isSubmitting ? 'bg-slate-900 text-white shadow-2xl hover:scale-105' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                        >
                            {isSubmitting ? "Processing Entry..." : isFormValid ? "Submit Registration for Audit" : "Upload Required Documents"}
                        </button>
                        <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider">🔒 Encrypted Transfer · ShopSphere Privacy Protocol 2.0</p>
                    </div>
                </div>
            </main>

            {showSuccessModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6">
                    <div className="bg-white rounded-[3rem] p-16 max-w-sm w-full text-center shadow-2xl border border-slate-100">
                        <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-emerald-100">
                            <Check className="text-emerald-500 w-12 h-12" strokeWidth={3} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Audit Successful</h2>
                        <p className="text-xs text-slate-500 font-bold leading-relaxed mb-12">Registry received. Verification takes ~5 days. Check email for status updates.</p>
                        <button onClick={() => navigate("/Home")} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Registry Complete</button>
                    </div>
                </div>
            )}
        </div>
    );
}
