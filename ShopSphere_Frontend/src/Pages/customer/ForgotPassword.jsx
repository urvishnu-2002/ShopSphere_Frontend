import React, { useState } from "react";
import { forgotPassword } from "../../api/axios";

import toast from "react-hot-toast";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await forgotPassword(email);
            toast.success(res.message || "Reset link sent to your email");
            setEmail("");
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to send reset link"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff]">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-xl w-96"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Forgot Password
                </h2>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-orange-400"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-400 text-white py-3 rounded-lg hover:bg-orange-400 transition"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>
        </div>
    );
}

export default ForgotPassword;