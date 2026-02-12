import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StepProgress from "../../Components/StepProgress";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const storedOtp = localStorage.getItem("email_otp");
  const email = localStorage.getItem("verify_email");

  // ✅ HOOK MUST BE INSIDE COMPONENT
  useEffect(() => {
    if (!email || !storedOtp) {
      navigate("/verify-account");
    }
  }, [email, storedOtp, navigate]);

  const verifyOtp = () => {
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    const expiry = localStorage.getItem("email_otp_expiry");

    if (!expiry || Date.now() > Number(expiry)) {
      setError("OTP expired. Please request a new one.");
      return;
    }

    if (otp !== storedOtp) {
      setError("Invalid OTP. Please try again.");
      return;
    }

    // ✅ success
    localStorage.setItem("email_verified", "true");
    localStorage.removeItem("email_otp");
    localStorage.removeItem("email_otp_expiry");

    navigate("/verifyGST");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <header className="px-8 py-5 bg-purple-700 shadow-sm">
        <h1 className="text-sm font-bold text-white">
          ShopSphere Seller Central
        </h1>
      </header>

      <main className="px-6 py-12">
        <StepProgress currentStep={2} />

        <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg p-6 mt-10">
          <h1 className="text-xl font-bold mb-2">Verify OTP</h1>

          <p className="text-sm text-gray-600 mb-4">
            Enter the one-time password sent to{" "}
            <strong>{email}</strong>
          </p>

          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ""));
              setError("");
            }}
            className="w-full px-3 py-2 mt-1 text-center tracking-widest border rounded-md"
          />

          {error && (
            <p className="text-xs text-red-500 mt-2">{error}</p>
          )}

          <button
            onClick={verifyOtp}
            className="w-full mt-5 py-2 rounded-md bg-purple-600 text-white"
          >
            Verify OTP
          </button>
        </div>
      </main>
    </div>
  );
}
