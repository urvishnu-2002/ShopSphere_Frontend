import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
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
        "service_0a1vbhw",
        "template_30pivyj",
        {
          to_email: email,
          otp: otp,
          name: "ShopSphere",
          time: new Date().toLocaleString(),
        },
        "Ch-Wgw8L8R5zWGNme"
      );

      localStorage.setItem("verify_email", email);
      localStorage.setItem("email_otp", otp);
      localStorage.setItem("email_otp_expiry", Date.now() + 5 * 60 * 1000);

      navigate("/verify-otp");
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #fff5f5 0%, #fef3f2 50%, #f3e8ff 100%)" }}>
      {/* HEADER */}
      <header className="px-8 py-5 shadow-sm" style={{ background: "linear-gradient(to right, #fb923c, #a855f7)" }}>
        <h1 className="text-sm font-bold text-white tracking-wide">
          ShopSphere Seller Central
        </h1>
      </header>

      <main className="px-6 py-14">
        {/* Step Progress */}
        <StepProgress />

        {/* Card */}
        <div className="max-w-sm mx-auto mt-14 rounded-2xl shadow-2xl overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #f1e8ff" }}>

          {/* Card top accent */}
          <div className="h-2" style={{ background: "linear-gradient(to right, #fb923c, #a855f7)" }} />

          <div className="p-8">
            <h2 className="text-2xl font-extrabold mb-1" style={{ color: "#1e1b4b" }}>
              Verify your email
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
              We'll send a one-time password to your email address.
            </p>

            <label className="block text-sm font-semibold mb-1" style={{ color: "#374151" }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: error ? "2px solid #ef4444" : "2px solid #e9d5ff",
                borderRadius: "10px",
                outline: "none",
                fontSize: "14px",
                color: "#111827",
                background: "#faf5ff",
                boxSizing: "border-box",
              }}
            />

            {error && (
              <p className="text-xs mt-2 font-medium" style={{ color: "#dc2626" }}>
                ⚠ {error}
              </p>
            )}

            <button
              onClick={sendOtp}
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "13px",
                borderRadius: "10px",
                background: loading
                  ? "#d1d5db"
                  : "linear-gradient(to right, #fb923c, #a855f7)",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "14px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.03em",
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "Sending OTP..." : "Send OTP →"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
