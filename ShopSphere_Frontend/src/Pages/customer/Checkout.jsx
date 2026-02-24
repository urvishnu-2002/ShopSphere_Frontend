import React, { useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

import {

  FaCreditCard,

  FaMobileAlt,

  FaUniversity,

  FaMoneyBillWave,

  FaChevronRight,

  FaCheckCircle,

  FaLock,

  FaCalendarAlt,

} from "react-icons/fa";

import { MdOutlinePayments, MdOutlineTimer } from "react-icons/md";

import { processPayment } from "../../api/axios";
import { clearCart } from "../../Store";
import { sendOrderConfirmationEmail } from "../../utils/emailService";


function Checkout() {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const cartObjects = useSelector((state) => state.cart || []);

  const [selectedMethod, setSelectedMethod] = useState("cod");

  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    if (!localStorage.getItem("selectedAddress")) {
      navigate("/cart");
    }
  }, [navigate]);


  // Calculations

  const subtotal = cartObjects.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const tax = subtotal * 0.18;

  const deliveryCharges = subtotal > 1000 || subtotal === 0 ? 0 : 50;

  const totalAmount = subtotal + tax + deliveryCharges;


  const paymentMethods = [

    {

      id: "cod",

      title: "Cash on Delivery",

      description: "Pay when your order is delivered",

      icon: <FaMoneyBillWave className="text-orange-400" />,

    },

    {

      id: "online",

      title: "Pay Online",

      description: "UPI, Cards, Netbanking (Razorpay)",

      icon: <FaCreditCard className="text-orange-400" />,

      tag: "Secure",

    },

  ];


  const loadRazorpayScript = () => {

    return new Promise((resolve) => {

      if (window.Razorpay) {

        resolve(true);

        return;

      }


      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.async = true;


      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);


      document.body.appendChild(script);

    });

  };


  const handleRazorpayPayment = async () => {

    if (cartObjects.length === 0) {

      alert("Your cart is empty!");

      return;

    }


    const loaded = await loadRazorpayScript();


    if (!loaded) {

      alert("Razorpay SDK failed to load. Check internet.");

      return;

    }


    const options = {

      key: "rzp_test_SCkSLubYDiWP48",

      amount: Math.round(totalAmount * 100),

      currency: "INR",

      name: "ShopSphere",

      description: "Order Payment",


      handler: async function (response) {

        setIsProcessing(true);

        try {

          // Sync with Backend
          const backendResponse = await processPayment({

            payment_mode: "ONLINE",

            payment_status: "PAID",

            transaction_id: response.razorpay_payment_id,

            items: cartObjects.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })),
            address_id: JSON.parse(localStorage.getItem("selectedAddress"))?.id

          });


          // Store for Success page display

          localStorage.setItem(

            "orderSuccess",

            JSON.stringify({

              transactionId: response.razorpay_payment_id,

              items: cartObjects,

              totalAmount: totalAmount,

              date: new Date().toLocaleString(),

              paymentMode: "Online Payment"

            })

          );


          dispatch(clearCart());

          // Send Confirmation Email
          try {
            const storedUser = localStorage.getItem("user");
            const storedAddress = localStorage.getItem("selectedAddress");
            const userData = storedUser ? JSON.parse(storedUser) : {};
            const address = storedAddress ? JSON.parse(storedAddress) : {};
            const userEmail = userData.email || address?.email;

            if (userEmail) {
              await sendOrderConfirmationEmail({
                email: userEmail,
                orderNumber: backendResponse.order_number || "N/A",
                items: cartObjects,
                subtotal: subtotal,
                tax: tax,
                shipping: deliveryCharges,
                total: totalAmount,
                address: address,
                paymentMode: "Online Payment"
              });
            } else {
              console.warn("No email found for order confirmation. Please re-login.");
            }
          } catch (emailErr) {
            console.error("Email notification failed:", emailErr);
          }

          navigate("/success");

        } catch (error) {

          console.error("Order processing failed:", error);

          alert("Payment received, but order recording failed. Please contact support.");

        } finally {

          setIsProcessing(false);

        }

      },


      prefill: {

        name: "Customer",

        email: "customer@example.com",

        contact: "9999999999",

      },


      theme: {

        color: "#a78bfa",

      },

    };


    const razorpay = new window.Razorpay(options);

    razorpay.open();

  };


  const handleContinue = () => {

    if (selectedMethod === "cod") {

      navigate("/place-order");

    } else {

      handleRazorpayPayment();

    }

  };




  return (

    <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff] py-12 px-4 sm:px-6 lg:px-8">

      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col lg:flex-row gap-10">


          {/* LEFT COLUMN: Payment Methods */}

          <div className="flex-grow lg:w-2/3">

            <div className="flex items-center gap-4 mb-10">

              <button

                onClick={() => navigate("/cart")}

                className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"

              >

                <FaChevronRight className="rotate-180" size={14} />

              </button>

              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Select Payment Mode</h1>

            </div>


            <div className="space-y-4">

              {paymentMethods.map((method) => (

                <div

                  key={method.id}

                  onClick={() => setSelectedMethod(method.id)}

                  className={`group cursor-pointer bg-white rounded-[32px] p-6 border-2 transition-all duration-300 flex items-center gap-6 ${selectedMethod === method.id

                    ? "border-orange-400 shadow-xl shadow-orange-400/10 translate-x-2"

                    : "border-gray-100 hover:border-orange-200"

                    }`}

                >

                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${selectedMethod === method.id ? "bg-gradient-to-r from-orange-400 to-purple-500 text-white shadow-lg" : "bg-gray-50 group-hover:bg-orange-50"

                    }`}>

                    {method.icon}

                  </div>


                  <div className="flex-grow">

                    <div className="flex items-center gap-3 mb-1">

                      <h3 className="text-lg font-black text-gray-900">{method.title}</h3>

                      {method.tag && (

                        <span className="bg-orange-50 text-orange-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-orange-100">

                          {method.tag}

                        </span>

                      )}

                    </div>

                    <p className="text-sm text-gray-400 font-bold">{method.description}</p>

                  </div>


                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedMethod === method.id ? "border-orange-400 bg-orange-400 text-white" : "border-gray-200"

                    }`}>

                    {selectedMethod === method.id && <FaCheckCircle size={12} />}

                  </div>

                </div>

              ))}

            </div>


            {/* Additional Details based on Selection */}

            {selectedMethod === "online" && (

              <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500 bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm text-center">

                <p className="text-gray-500 font-bold">

                  You will be redirected to Razorpay secure payment gateway.

                </p>

              </div>

            )}

          </div>


          {/* RIGHT COLUMN: Order Summary */}

          <div className="lg:w-[400px] flex-shrink-0">

            <div className="sticky top-28 space-y-6">

              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">

                <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Order Details</h2>


                <div className="space-y-4 mb-4">

                  {cartObjects.map((item, idx) => (

                    <div key={idx} className="flex items-center gap-4 text-sm font-bold text-gray-600">

                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">

                        {item.quantity}x

                      </div>

                      <span className="flex-grow line-clamp-1">{item.name}</span>

                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>

                    </div>

                  ))}

                </div>


                <div className="pt-6 border-t border-gray-50 space-y-4">

                  <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-widest">

                    <span>Subtotal</span>

                    <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>

                  </div>

                  <div className="flex justify-between items-center text-sm font-bold text-orange-400 uppercase tracking-widest">

                    <span>Shipping</span>

                    <span>{deliveryCharges === 0 ? "FREE" : `₹${deliveryCharges.toFixed(2)}`}</span>

                  </div>

                  <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-widest">

                    <span>GST (18%)</span>

                    <span className="text-gray-900">₹{tax.toFixed(2)}</span>

                  </div>

                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center">

                    <span className="text-xl font-black text-gray-900">Amount to Pay</span>

                    <span className="text-3xl font-black text-orange-400 font-mono tracking-tighter">₹{totalAmount.toFixed(2)}</span>

                  </div>

                </div>


                <div className="mt-8">

                  <button

                    onClick={handleContinue}

                    disabled={isProcessing}

                    className={`w-full py-5 bg-gradient-to-br from-orange-400 to-purple-500 text-white rounded-[24px] font-black text-lg shadow-xl shadow-orange-400/20 hover:shadow-orange-400/30 hover:-translate-y-1 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mb-6 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}

                  >

                    {isProcessing ? (

                      <>Processing... <FaLock size={16} className="animate-pulse" /></>

                    ) : (

                      <>Continue <FaChevronRight size={16} /></>

                    )}

                  </button>

                  <p className="text-[10px] text-center text-gray-400 font-black uppercase tracking-[2px] px-4">

                    Clicking continue will proceed to the next step.

                  </p>

                </div>

              </div>


              {/* Secure Checkout Badge */}

              <div className="bg-orange-50 rounded-[32px] p-6 border border-orange-100 flex items-center gap-5">

                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-400 shadow-sm shadow-emerald-500/10">

                  <MdOutlinePayments size={28} />

                </div>

                <div>

                  <h4 className="font-black text-orange-900 text-base mb-0.5">Zero Processing Fee</h4>

                  <p className="text-orange-700/60 text-[10px] font-bold uppercase tracking-[1px]">No hidden charges on payment</p>

                </div>

              </div>

            </div>

          </div>


        </div>

      </div>

    </div>

  );

}


export default Checkout;