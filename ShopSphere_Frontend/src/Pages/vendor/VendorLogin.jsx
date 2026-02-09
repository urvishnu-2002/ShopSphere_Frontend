import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function VendorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple demo validation
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    // You can replace this with real auth
    if (email === "vendor@example.com" && password === "123456") {
      // Navigate to dashboard
      navigate("/dashboard");
    } else {
      alert("Invalid email or password");
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
      <div className="absolute inset-0 bg-black/40"></div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm bg-white p-6 rounded-lg shadow-xl"
      >
        <h3 className="text-center text-sm font-semibold text-gray-500">
          WELCOME TO
        </h3>

        <h1 className="text-center text-2xl font-bold text-blue-600 mb-1">
          SHOP SPHERE
        </h1>

        <h2 className="text-center text-lg font-semibold text-gray-700 mb-6">
          Vendor Login
        </h2>

        {/* Email */}
        <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Vendor Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Password */}
        <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <input id="remember" type="checkbox" className="h-4 w-4 text-blue-600" />
            <label htmlFor="remember" className="text-sm text-gray-600">
              Remember Me
            </label>
          </div>

          <a
            href="http://mail.google.com/"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default VendorLogin;
