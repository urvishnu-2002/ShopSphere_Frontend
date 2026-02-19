import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function VendorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Login and get tokens
      const loginRes = await axios.post(`${API_BASE_URL}/user_login`, { email, password });
      const { access, refresh } = loginRes.data;

      if (!access) {
        setError("Login failed. Invalid credentials.");
        return;
      }

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Step 2: Fetch user info to determine role
      const meRes = await axios.get(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${access}` }
      });
      const user = meRes.data;

      // Step 3: Redirect based on role
      if (user.role === "admin" || user.is_staff || user.is_superuser) {
        navigate("/admindashboard");
      } else if (user.role === "vendor") {
        navigate("/welcome");
      } else {
        setError("This portal is for vendors and admins only.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.error || "Invalid email or password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1523275335684-37898b6baf30')",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm bg-white p-8 rounded-2xl shadow-2xl"
      >
        <h3 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest">
          Welcome to
        </h3>

        <h1 className="text-center text-2xl font-black text-blue-600 mb-1">
          SHOP SPHERE
        </h1>

        <h2 className="text-center text-base font-semibold text-gray-500 mb-6">
          Vendor & Admin Portal
        </h2>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Email */}
        <label htmlFor="email" className="block text-sm font-semibold text-gray-600 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        {/* Password */}
        <label htmlFor="password" className="block text-sm font-semibold text-gray-600 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-6 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
          ) : "Login"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Admin and approved vendors only
        </p>
      </form>
    </div>
  );
}

export default VendorLogin;
