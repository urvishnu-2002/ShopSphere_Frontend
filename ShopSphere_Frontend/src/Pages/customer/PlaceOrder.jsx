import React, { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

import { processPayment } from "../../api/axios";

import { FaMapMarkerAlt, FaMoneyBillWave, FaShieldAlt, FaTruck, FaLock } from "react-icons/fa";

import { clearCart } from "../../Store";
import { sendOrderConfirmationEmail } from "../../utils/emailService";


function PlaceOrder() {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const cartObjects = useSelector((state) => state.cart || []);

    const [address, setAddress] = useState(null);

    const [isProcessing, setIsProcessing] = useState(false);


    // Calculations

    const subtotal = cartObjects.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const tax = subtotal * 0.18;

    const deliveryCharges = subtotal > 1000 || subtotal === 0 ? 0 : 50;

    const totalAmount = subtotal + tax + deliveryCharges;

    const discount = 0; // Placeholder if needed


    useEffect(() => {

        // Load address from localStorage as set in Cart/Checkout flow

        const storedAddress = localStorage.getItem("selectedAddress");

        if (storedAddress) {

            setAddress(JSON.parse(storedAddress));

        } else {

            // Fallback if no address found (defense)

            navigate("/cart");

        }

    }, [navigate]);


    const handlePlaceOrder = async () => {

        setIsProcessing(true);

        try {

            // 1. Call API

            const response = await processPayment({

                payment_mode: "COD",

                payment_status: "PENDING",

                total_amount: totalAmount, // Optional depending on backend

                items: cartObjects.map((item) => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),

                address_id: address?.id, // Pass address ID to backend

            });


            // 2. Store success info

            localStorage.setItem(
                "orderSuccess",
                JSON.stringify({
                    transactionId: response.order_number || `COD-${Date.now()}`,
                    items: cartObjects,
                    totalAmount: totalAmount,
                    date: new Date().toLocaleString(),
                    paymentMode: "Cash on Delivery"
                })
            );

            // 2.5 Send Confirmation Email
            try {
                const storedUser = localStorage.getItem("user");
                const userData = storedUser ? JSON.parse(storedUser) : {};
                const userEmail = userData.email || address?.email;
                console.log("DEBUG: User object from localStorage:", userData);
                console.log("DEBUG: Resolved email for order confirmation:", userEmail);

                if (userEmail) {
                    await sendOrderConfirmationEmail({
                        email: userEmail,
                        orderNumber: response.order_number || "N/A",
                        items: cartObjects,
                        subtotal: subtotal,
                        tax: tax,
                        shipping: deliveryCharges,
                        total: totalAmount,
                        address: address,
                        paymentMode: "Cash on Delivery"
                    });
                } else {
                    console.warn("No email found for order confirmation. Please re-login.");
                }
            } catch (emailErr) {
                console.error("Email notification failed:", emailErr);
                // We don't block the UI for email failure
            }


            // 3. Clear Cart

            dispatch(clearCart());


            // 4. Navigate

            navigate("/success");


        } catch (error) {

            console.error("Order placement failed:", error);

            alert("Failed to place order. Please try again.");

        } finally {

            setIsProcessing(false);

        }

    };


    if (!address) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;


    return (

        <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff] py-12 px-4 sm:px-6 lg:px-8">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-black text-gray-900 mb-8">Review & Place Order</h1>


                <div className="flex flex-col lg:flex-row gap-10">

                    {/* LEFT COLUMN */}

                    <div className="flex-grow lg:w-2/3 space-y-6">


                        {/* 1. Delivery Address */}

                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">

                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">

                                <FaMapMarkerAlt className="text-orange-400" /> Delivery Address

                            </h2>

                            <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 text-gray-800">

                                <p className="font-bold text-lg mb-1">{address.name}</p>

                                <p className="text-sm text-gray-600 mb-1">{address.phone}</p>

                                <p className="text-sm text-gray-600">{address.address}, {address.city}, {address.state} - {address.pincode}</p>

                            </div>

                        </div>


                        {/* 2. Products */}

                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">

                            <h2 className="text-xl font-black text-gray-900 mb-4">Items ({cartObjects.length})</h2>

                            <div className="space-y-4">

                                {cartObjects.map((item, idx) => (

                                    <div key={idx} className="flex gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">

                                        <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">

                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />

                                        </div>

                                        <div className="flex-grow">

                                            <h3 className="font-bold text-gray-900">{item.name}</h3>

                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>

                                            <p className="font-bold text-orange-400">₹{item.price}</p>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>


                        {/* 3. Payment Mode */}

                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">

                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">

                                <FaMoneyBillWave className="text-emerald-500" /> Payment Method

                            </h2>

                            <div className="flex items-center gap-3 bg-emerald-50 text-emerald-800 px-5 py-3 rounded-xl font-bold border border-emerald-100 w-fit">

                                <span>Cash on Delivery</span>

                                <span className="bg-emerald-200 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>

                            </div>

                        </div>


                    </div>


                    {/* RIGHT COLUMN: Summary */}

                    <div className="lg:w-[400px] flex-shrink-0">

                        <div className="sticky top-28 bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">

                            <h2 className="text-2xl font-black text-gray-900 mb-6">Price Details</h2>


                            <div className="space-y-4 mb-6 border-b border-gray-50 pb-6">

                                <div className="flex justify-between text-sm font-bold text-gray-500">

                                    <span>Price ({cartObjects.length} items)</span>

                                    <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>

                                </div>

                                {deliveryCharges > 0 ? (

                                    <div className="flex justify-between text-sm font-bold text-gray-500">

                                        <span>Delivery Charges</span>

                                        <span className="text-gray-900">₹{deliveryCharges}</span>

                                    </div>

                                ) : (

                                    <div className="flex justify-between text-sm font-bold text-emerald-500">

                                        <span>Delivery Charges</span>

                                        <span>FREE</span>

                                    </div>

                                )}

                                <div className="flex justify-between text-sm font-bold text-gray-500">

                                    <span>Tax (18%)</span>

                                    <span className="text-gray-900">₹{tax.toFixed(2)}</span>

                                </div>

                            </div>


                            <div className="flex justify-between items-center mb-8">

                                <span className="text-xl font-black text-gray-900">Total Amount</span>

                                <span className="text-3xl font-black text-orange-400">₹{totalAmount.toFixed(2)}</span>

                            </div>


                            <button

                                onClick={handlePlaceOrder}

                                disabled={isProcessing}

                                className={`w-full py-4 bg-orange-400 hover:bg-orange-400 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-400/20 transition-all flex items-center justify-center gap-2 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}

                            >

                                {isProcessing ? "Placing Order..." : "Place Order"}

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default PlaceOrder;