import React, { useState } from "react";
import StepProgress from "../../Components/StepProgress";
import { useNavigate } from "react-router-dom";

export default function ShippingMethod() {
    const navigate = useNavigate();

    const [method, setMethod] = useState("easy_ship"); // default

    const handleContinue = () => {
        localStorage.setItem("shippingMethod", method);
        navigate("/shipping-fee-preferences");
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

                    <h2 className="text-2xl font-bold mb-6">
                        Select how you want to ship orders
                    </h2>

                    {/* SHIPPING OPTIONS */}
                    <div className="space-y-6">

                        {/* EASY SHIP */}
                        <label
                            className={`block border rounded-xl p-6 cursor-pointer transition
                            ${method === "easy_ship"
                                    ? "border-purple-600 bg-purple-50"
                                    : "border-gray-300 hover:border-purple-400"
                                }`}
                        >
                            <div className="flex gap-4">
                                <input
                                    type="radio"
                                    name="shippingMethod"
                                    checked={method === "easy_ship"}
                                    onChange={() => setMethod("easy_ship")}
                                    className="accent-purple-600 mt-1"
                                />

                                <div>
                                    <p className="font-semibold text-gray-800">
                                        You store products, we handle delivery (Easy Ship)
                                    </p>

                                    <p className="text-sm text-gray-600 mt-1">
                                        Keep your products with you. Once an order is placed, we’ll pick it up from your location and deliver it to customers.
                                    </p>

                                    <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold
                                        bg-purple-100 text-orange-400 rounded-full">
                                        Most sellers choose this
                                    </span>
                                </div>
                            </div>
                        </label>

                        {/* SELF SHIP */}
                        <label
                            className={`block border rounded-xl p-6 cursor-pointer transition
                            ${method === "self_ship"
                                    ? "border-purple-600 bg-purple-50"
                                    : "border-gray-300 hover:border-purple-400"
                                }`}
                        >
                            <div className="flex gap-4">
                                <input
                                    type="radio"
                                    name="shippingMethod"
                                    checked={method === "self_ship"}
                                    onChange={() => setMethod("self_ship")}
                                    className="accent-purple-600 mt-1"
                                />

                                <div>
                                    <p className="font-semibold text-gray-800">
                                        You manage storage and delivery yourself(Self Ship)
                                    </p>

                                    <p className="text-sm text-gray-600 mt-1">
                                        Store, pack, and ship orders on your own or using a delivery partner of your choice.
                                    </p>
                                </div>
                            </div>
                        </label>
                    </div>

                    <p className="text-sm text-gray-500 mt-6">
                        You can update your shipping preference later from your account settings.

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
                            Save & Continue
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
}
