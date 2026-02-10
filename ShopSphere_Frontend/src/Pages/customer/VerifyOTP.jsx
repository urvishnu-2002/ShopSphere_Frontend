import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepProgress from "../../Components/StepProgress";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const storedOtp = localStorage.getItem("email_otp");
  const email = localStorage.getItem("verify_email");

  const verifyOtp = () => {
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    if (otp !== storedOtp) {
      setError("Invalid OTP. Please try again.");
      return;
    }

    // ✅ OTP verified successfully
    localStorage.setItem("email_verified", "true");

    // Next step → Tax verification
    navigate("/verifyGST");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">

      {/* HEADER */}
      <header className="px-8 py-5 bg-purple-700 shadow-sm">
        <h1 className="text-sm font-bold text-white">
          ShopSphere Seller Central
        </h1>
      </header>

      <main className="px-6 py-12">
        {/* ✅ STEP PROGRESS (STEP 1 ACTIVE) */}
        <StepProgress />

        {/* CONTENT */}
        <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg p-6 mt-10">
          <h1 className="text-xl font-bold mb-2">Verify OTP</h1>

          <p className="text-sm text-gray-600 mb-4">
            Enter the one-time password sent to{" "}
            <strong className="text-gray-800">{email}</strong>
          </p>

          <label className="text-sm font-medium">6-digit OTP</label>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ""));
              setError("");
            }}
            className={`w-full px-3 py-2 mt-1 text-center tracking-widest border rounded-md
              focus:ring-2 ${error
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-purple-400"
              }`}
          />

          {error && (
            <p className="text-xs text-red-500 mt-2">{error}</p>
          )}

          <button
            onClick={verifyOtp}
            className="w-full mt-5 py-2 rounded-md bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
          >
            Verify OTP
          </button>
        </div>
      </main>
    </div>
  );
}
