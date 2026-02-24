import React, { useState } from "react";
import StepProgress from "../../Components/StepProgress";
import { useNavigate } from "react-router-dom";

export default function ShippingFeePreferences() {
    const navigate = useNavigate();

    // pay_by_self | customer_pays
    const [paymentType, setPaymentType] = useState("pay_by_self");

    const [fees, setFees] = useState({
        local: "",
        regional: "",
        national: "",
    });

    const handleFeeChange = (key, value) => {
        if (!/^\d*$/.test(value)) return; // numbers only
        setFees({ ...fees, [key]: value });
    };

    const handleContinue = () => {
        if (paymentType === "customer_pays") {
            if (!fees.local || !fees.regional || !fees.national) {
                alert("Please enter all delivery charges");
                return;
            }
        }

        const data = {
            paymentType,
            fees: paymentType === "customer_pays" ? fees : null,
            shippingFee: paymentType === "customer_pays" ? fees.national : "0" // Simple fallback
        };

        localStorage.setItem("vendorFeeData", JSON.stringify(data));
        localStorage.setItem("shippingFeePreferences", JSON.stringify(data));
        navigate("/bank-details");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff]">

            {/* Header */}
            <header className="px-8 py-5 bg-gradient-to-r from-orange-400 to-purple-500 shadow-sm">
                <h1 className="text-sm font-bold text-white">
                    ShopSphere Seller Central
                </h1>
            </header>

            <main className="px-6 py-12">
                <StepProgress />

                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">

                    <h2 className="text-2xl font-bold mb-4">
                        Shipping fee preferences
                    </h2>

                    <p className="text-gray-600 mb-8">
                        These charges apply to standard-sized items weighing under 1000 grams.
                    </p>

                    {/* STATIC FEE INFO (DISPLAY ONLY) */}
                    <div className="grid grid-cols-3 gap-6 mb-10">
                        {[
                            { label: "Local", price: "49" },
                            { label: "Regional", price: "56" },
                            { label: "National", price: "77" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="bg-gray-100 rounded-xl p-6 text-center"
                            >
                                <p className="text-3xl font-bold">₹{item.price}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* PAYMENT OPTIONS */}
                    <h3 className="text-lg font-semibold mb-4">
                        How would you like to handle delivery charges?
                    </h3>

                    <div className="space-y-4">

                        {/* PAY BY YOURSELF */}
                        <label
                            className={`block border rounded-xl p-5 cursor-pointer
                            ${paymentType === "pay_by_self"
                                    ? "border-purple-600 bg-purple-50"
                                    : "border-gray-300 hover:border-purple-400"
                                }`}
                        >
                            <div className="flex gap-4">
                                <input
                                    type="radio"
                                    checked={paymentType === "pay_by_self"}
                                    onChange={() => setPaymentType("pay_by_self")}
                                    className="accent-purple-600 mt-1"
                                />

                                <div>
                                    <p className="font-semibold">
                                        Pay delivery charges yourself
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Customers see free delivery on your products.
                                    </p>

                                    <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold
                                    bg-purple-100 text-orange-400 rounded-full">
                                        Most sellers choose this
                                    </span>
                                </div>
                            </div>
                        </label>

                        {/* CUSTOMER PAYS */}
                        <label
                            className={`block border rounded-xl p-5 cursor-pointer
                            ${paymentType === "customer_pays"
                                    ? "border-purple-600 bg-purple-50"
                                    : "border-gray-300 hover:border-purple-400"
                                }`}
                        >
                            <div className="flex gap-4">
                                <input
                                    type="radio"
                                    checked={paymentType === "customer_pays"}
                                    onChange={() => setPaymentType("customer_pays")}
                                    className="accent-purple-600 mt-1"
                                />

                                <div>
                                    <p className="font-semibold">
                                        Include delivery charges for customers
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Delivery charges will be added to the order total.
                                    </p>
                                </div>
                            </div>
                        </label>

                    </div>

                    {/* CONDITIONAL INPUTS */}
                    {paymentType === "customer_pays" && (
                        <div className="mt-8">
                            <h4 className="font-semibold mb-4">
                                Shipping fees per order
                            </h4>

                            <div className="grid grid-cols-3 gap-6">
                                {[
                                    { key: "local", label: "Local" },
                                    { key: "regional", label: "Regional" },
                                    { key: "national", label: "National" },
                                ].map((item) => (
                                    <div key={item.key}>
                                        <label className="block text-sm font-medium mb-1">
                                            {item.label}
                                        </label>
                                        <div className="flex items-center border rounded-lg px-3 py-2">
                                            <span className="mr-2 text-gray-500">₹</span>
                                            <input
                                                type="text"
                                                value={fees[item.key]}
                                                onChange={(e) =>
                                                    handleFeeChange(item.key, e.target.value)
                                                }
                                                className="w-full outline-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="text-sm text-gray-500 mt-6">
                        You can update shipping fees later from your account settings.
                    </p>

                    {/* FOOTER */}
                    <div className="mt-10">
                        <button
                            onClick={handleContinue}
                            className="w-full py-3 rounded-lg font-medium text-white
                            bg-gradient-to-r from-purple-700 to-purple-500
                            hover:from-purple-800 hover:to-purple-600
                            transition shadow-md"
                        >
                            Save and continue
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
}
