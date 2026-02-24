import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/axios";
import toast from "react-hot-toast";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!token) {
            toast.error("Invalid or missing reset token");
            return;
        }

        setLoading(true);

        try {
            const res = await resetPassword(token, form.password, form.confirmPassword);
            toast.success(res.message || "Password reset successful!");
            setForm({ password: "", confirmPassword: "" });
            navigate("/login");
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to reset password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff] px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-center mb-6">
                    Reset Password
                </h2>

                {/* New Password */}
                <input
                    type="password"
                    name="password"
                    placeholder="New password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-orange-400"
                />

                {/* Confirm Password */}
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-orange-400"
                />

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-400 text-white py-3 rounded-lg hover:bg-orange-400 transition"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;