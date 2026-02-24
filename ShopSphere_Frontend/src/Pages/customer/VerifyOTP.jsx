import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StepProgress from "../../Components/StepProgress";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const storedOtp = localStorage.getItem("email_otp");
  const email = localStorage.getItem("verify_email");

  useEffect(() => {
    if (!email || !storedOtp) {
      navigate("/account-verification");
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

    localStorage.setItem("email_verified", "true");
    localStorage.removeItem("email_otp");
    localStorage.removeItem("email_otp_expiry");
    navigate("/verifyGST");
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #fff5f5 0%, #fef3f2 50%, #f3e8ff 100%)" }}
    >
      {/* HEADER */}
      <header
        className="px-8 py-5 shadow-sm"
        style={{ background: "linear-gradient(to right, #fb923c, #a855f7)" }}
      >
        <h1 className="text-sm font-bold text-white tracking-wide">
          ShopSphere Seller Central
        </h1>
      </header>

      <main className="px-6 py-14">
        <StepProgress />

        {/* Card */}
        <div
          className="max-w-sm mx-auto mt-14 rounded-2xl shadow-2xl overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #f1e8ff" }}
        >
          {/* Top accent */}
          <div
            className="h-2"
            style={{ background: "linear-gradient(to right, #fb923c, #a855f7)" }}
          />

          <div className="p-8">
            <h2
              className="text-2xl font-extrabold mb-1"
              style={{ color: "#1e1b4b" }}
            >
              Enter OTP
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
              One-time password sent to{" "}
              <span className="font-bold" style={{ color: "#7c3aed" }}>
                {email}
              </span>
            </p>

            {/* OTP boxes */}
            <input
              type="text"
              maxLength={6}
              value={otp}
              placeholder="● ● ● ● ● ●"
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              style={{
                width: "100%",
                padding: "16px",
                textAlign: "center",
                letterSpacing: "0.5em",
                fontSize: "22px",
                fontWeight: "900",
                border: error ? "2px solid #ef4444" : "2px solid #e9d5ff",
                borderRadius: "12px",
                outline: "none",
                color: "#1e1b4b",
                background: "#faf5ff",
                boxSizing: "border-box",
              }}
            />

            {error && (
              <p
                className="text-xs mt-2 font-medium"
                style={{ color: "#dc2626" }}
              >
                ⚠ {error}
              </p>
            )}

            <button
              onClick={verifyOtp}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "13px",
                borderRadius: "10px",
                background: "linear-gradient(to right, #fb923c, #a855f7)",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "14px",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.03em",
              }}
            >
              Verify OTP →
            </button>

            <button
              onClick={() => navigate("/account-verification")}
              style={{
                width: "100%",
                marginTop: "12px",
                padding: "11px",
                borderRadius: "10px",
                background: "transparent",
                color: "#9333ea",
                fontWeight: "600",
                fontSize: "13px",
                border: "2px solid #e9d5ff",
                cursor: "pointer",
              }}
            >
              ← Resend OTP
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
