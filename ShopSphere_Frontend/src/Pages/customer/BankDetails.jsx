import React, { useState, useEffect } from "react";
import StepProgress from "../../Components/StepProgress";
import { useNavigate } from "react-router-dom";
import { vendorRegister } from "../../api/vendor_axios";

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

    // Load previously saved vendor data from localStorage
    const [vendorData, setVendorData] = useState({});

    useEffect(() => {
        // Retrieve all vendor form data from localStorage
        const gstData = JSON.parse(localStorage.getItem("vendorGSTData") || "{}");
        const storeData = JSON.parse(localStorage.getItem("vendorStoreData") || "{}");
        const shippingData = JSON.parse(localStorage.getItem("vendorShippingData") || "{}");
        const feeData = JSON.parse(localStorage.getItem("vendorFeeData") || "{}");
        const authData = JSON.parse(localStorage.getItem("user") || "{}"); // If user info is stored here

        const combinedData = {
            ...gstData,
            ...storeData,
            ...shippingData,
            ...feeData,
            // Fallbacks for individual keys
            shopName: storeData.shopName || localStorage.getItem("shop_name"),
            shopDescription: storeData.shopDescription || localStorage.getItem("shop_description"),
            businessType: storeData.businessType || localStorage.getItem("business_type"),
            shippingAddress: shippingData.shippingAddress || localStorage.getItem("shipping_address") || localStorage.getItem("address"),
            gstNumber: gstData.gstNumber || localStorage.getItem("gst_number") || localStorage.getItem("gst"),
            panNumber: gstData.panNumber || localStorage.getItem("pan_number"),
            panName: gstData.panName || localStorage.getItem("pan_name"),
            idType: gstData.idType || localStorage.getItem("id_type"),
            username: localStorage.getItem("username") || authData.username || "",
            email: localStorage.getItem("email") || authData.email || "",
            password: localStorage.getItem("password") || ""
        };

        // If shippingAddress is still missing, try formatting from pickupAddress
        if (!combinedData.shippingAddress) {
            const pickup = JSON.parse(localStorage.getItem("pickupAddress") || "null");
            if (pickup) {
                combinedData.shippingAddress = `${pickup.area}, ${pickup.city}, ${pickup.state} - ${pickup.pincode}`;
            }
        }

        console.log("Loaded Vendor Data from Storage:", combinedData);
        setVendorData(combinedData);
    }, []);

    /* ---------------- FIELD VALIDATION ---------------- */

    const validateField = (name, value, currentForm) => {
        switch (name) {
            case "holderName": {
                const letters = value.replace(/[^A-Za-z]/g, "");
                if (!value.trim()) return "Account holder name is required";
                if (!/^[A-Za-z ]+$/.test(value))
                    return "Only letters and spaces are allowed";
                if (letters.length < 3)
                    return "Name must contain at least 3 letters";
                return "";
            }

            case "accountNumber":
                if (!value) return "Bank account number is required";
                if (!/^\d{9,18}$/.test(value))
                    return "Account number must be 9 to 18 digits";
                return "";

            case "confirmAccountNumber":
                if (!value) return "Please re-enter account number";
                if (value !== currentForm.accountNumber)
                    return "Account numbers do not match";
                return "";

            case "ifsc":
                if (!value) return "IFSC code is required";
                if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value))
                    return "Enter a valid IFSC code";
                return "";

            default:
                return "";
        }
    };

    /* ---------------- HANDLE CHANGE ---------------- */

    const handleChange = (field, rawValue) => {
        let value = rawValue;

        // INPUT RESTRICTIONS
        if (field === "holderName") {
            value = value.replace(/[^A-Za-z ]/g, "");
        }

        if (field === "accountNumber" || field === "confirmAccountNumber") {
            value = value.replace(/\D/g, "").slice(0, 18);
        }

        if (field === "ifsc") {
            value = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11);
        }

        const updatedForm = { ...form, [field]: value };

        setForm(updatedForm);

        const error = validateField(field, value, updatedForm);

        setErrors({
            ...errors,
            [field]: error,
        });
    };

    /* ---------------- FINAL SUBMIT ---------------- */

    const handleContinue = async () => {
        const newErrors = {};

        Object.keys(form).forEach((key) => {
            const error = validateField(key, form[key], form);
            if (error) newErrors[key] = error;
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        setIsSubmitting(true);
        setApiError("");

        try {
            // Combine all vendor data with bank details
            const completeVendorData = {
                // User credentials
                username: vendorData.username || "",
                email: vendorData.email || "",
                password: vendorData.password || "",

                // GST/PAN details
                gst_number: vendorData.gstNumber || vendorData.gst || "",
                pan_number: vendorData.panNumber || "",
                pan_name: vendorData.panName || "",
                id_type: vendorData.idType || (vendorData.gstNumber ? "gst" : "pan"),
                id_number: vendorData.gstNumber || vendorData.panNumber || "",

                // Store details
                shop_name: vendorData.shopName || vendorData.storeName || "",
                shop_description: vendorData.shopDescription || vendorData.storeDescription || "",
                business_type: vendorData.businessType || "retail",

                // Shipping address
                address: vendorData.shippingAddress || "",

                // Shipping fee preferences
                shipping_fee: vendorData.shippingFee || "0",

                // Bank details
                bank_holder_name: form.holderName,
                bank_account_number: form.accountNumber,
                bank_ifsc_code: form.ifsc,
            };

            console.log("Submitting Vendor payload:", completeVendorData);

            // Call the API
            const response = await vendorRegister(completeVendorData);

            console.log("Success! Details have been successfully sent to the Admin for approval.");
            console.log("Response:", response);

            // Clear all vendor data from localStorage after successful submission
            localStorage.removeItem("vendorGSTData");
            localStorage.removeItem("vendorStoreData");
            localStorage.removeItem("vendorShippingData");
            localStorage.removeItem("vendorFeeData");

            // Show success modal
            setShowSuccessModal(true);

        } catch (error) {
            console.error("Error registering vendor:", error);

            // Handle different error types
            if (error.response) {
                // Server responded with error
                const errorMessage = error.response.data?.error ||
                    error.response.data?.message ||
                    "Registration failed. Please try again.";
                setApiError(errorMessage);
            } else if (error.request) {
                // Request made but no response
                setApiError("Unable to connect to server. Please check your connection.");
            } else {
                // Other errors
                setApiError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid =
        Object.values(errors).every((e) => !e) &&
        Object.values(form).every((v) => v);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">

            <header className="px-8 py-5 bg-purple-700 shadow-sm">
                <h1 className="text-sm font-bold text-white">
                    ShopSphere Seller Central
                </h1>
            </header>

            <main className="px-6 py-12">
                <StepProgress />

                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">

                    <h2 className="text-2xl font-bold mb-3">
                        Add your bank account
                    </h2>

                    {/* API Error Message */}
                    {apiError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{apiError}</p>
                        </div>
                    )}

                    {/* ACCOUNT HOLDER NAME */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Account holder name
                        </label>
                        <input
                            value={form.holderName}
                            onChange={(e) =>
                                handleChange("holderName", e.target.value)
                            }
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600"
                            disabled={isSubmitting}
                        />
                        {errors.holderName && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.holderName}
                            </p>
                        )}
                    </div>

                    {/* ACCOUNT NUMBER */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Bank account number
                        </label>
                        <input
                            value={form.accountNumber}
                            onChange={(e) =>
                                handleChange("accountNumber", e.target.value)
                            }
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600"
                            disabled={isSubmitting}
                        />
                        {errors.accountNumber && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.accountNumber}
                            </p>
                        )}
                    </div>

                    {/* CONFIRM ACCOUNT NUMBER */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Re-enter bank account number
                        </label>
                        <input
                            value={form.confirmAccountNumber}
                            onChange={(e) =>
                                handleChange("confirmAccountNumber", e.target.value)
                            }
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600"
                            disabled={isSubmitting}
                        />
                        {errors.confirmAccountNumber && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.confirmAccountNumber}
                            </p>
                        )}
                    </div>

                    {/* IFSC */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium mb-2">
                            IFSC code
                        </label>
                        <input
                            value={form.ifsc}
                            onChange={(e) =>
                                handleChange("ifsc", e.target.value)
                            }
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600"
                            disabled={isSubmitting}
                        />
                        {errors.ifsc && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.ifsc}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleContinue}
                        disabled={!isFormValid || isSubmitting}
                        className={`w-full py-3 rounded-lg font-medium transition
                        ${isFormValid && !isSubmitting
                                ? "bg-gradient-to-r from-purple-700 to-purple-500 text-white hover:from-purple-800 hover:to-purple-600"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        {isSubmitting ? "Submitting..." : "Save and continue"}
                    </button>

                </div>
            </main>

            {/* SUCCESS MODAL */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg px-10 py-8
            animate-scaleIn relative overflow-hidden">

                        {/* Top gradient bar */}
                        <div className="absolute top-0 left-0 w-full h-2
                bg-gradient-to-r from-purple-600 to-purple-400" />

                        {/* Icon */}
                        <div className="flex justify-center mt-4">
                            <div className="w-14 h-14 rounded-full bg-purple-100
                    flex items-center justify-center text-2xl">
                                ✅
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-center mt-6 text-gray-800">
                            Vendor details saved successfully
                        </h3>

                        {/* Message */}
                        <p className="text-sm text-gray-600 text-center mt-3 leading-relaxed">
                            You will be notified about the vendor confirmation
                            through email once the verification is completed.
                        </p>

                        {/* OK Button */}
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    navigate("/Home"); // Home page
                                }}
                                className="px-6 py-3 rounded-lg font-medium text-white
                        bg-gradient-to-r from-purple-700 to-purple-500
                        hover:from-purple-800 hover:to-purple-600
                        transition shadow-lg"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
