import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import StepProgress from "../../Components/StepProgress";

export default function VerifyAccount() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setLoading(true);

    try {
      await emailjs.send(
        "service_pnn3tru",
        "template_by7q0ma",
        {
          to_email: email,
          otp: otp,
        },
        "JWjKVEari_L-AoiHX"
      );

      localStorage.setItem("verify_email", email);
      localStorage.setItem("email_otp", otp);

      navigate("/verify-otp");
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
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
        {/* ✅ STEP PROGRESS */}
        <StepProgress />

        {/* CONTENT */}
        <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg p-6 mt-10">
          <h1 className="text-xl font-bold mb-2">Verify your email</h1>

          <p className="text-sm text-gray-600 mb-4">
            We’ll send a one-time password to your email.
          </p>

          <label className="text-sm font-medium">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className={`w-full px-3 py-2 mt-1 border rounded-md focus:ring-2
              ${error
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-purple-400"
              }`}
          />

          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full mt-5 py-2 rounded-md bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      </main>
    </div>
  );
}
