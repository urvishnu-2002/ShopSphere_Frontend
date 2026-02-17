import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from "../api/axios";

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLoading) return;

        setIsLoading(true);
        setError('');
        try {
            const data = await adminLogin(username, password);

            // Correctly store tokens based on backend response keys
            if (data.access) {
                localStorage.setItem("authToken", data.access);
            }
            if (data.refresh) {
                localStorage.setItem("refreshToken", data.refresh);
            }

            localStorage.setItem("adminAuthenticated", "true");
            navigate("/dashboard");
            console.log("Login Success");

        } catch (err) {
            console.error("Login Error:", err);
            const msg = err.response?.data?.message ||
                err.response?.data?.error ||
                "Login failed. Please check your credentials.";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-[20px] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
            {/* Background Image Layer */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: 'url("/adminloginbg.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {/* Dark Overlay to maintain card contrast */}
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative z-10 bg-white rounded-[10px] shadow-[0_10px_25px_rgba(0,0,0,0.2)] w-full max-w-[400px] p-[40px] animate-in fade-in duration-500">
                <div className="text-center mb-[30px]">
                    <h1 className="text-[#333] text-[28px] font-bold mb-[10px]">🔐 Admin Panel</h1>
                    <p className="text-[#666] text-[14px]">E-Commerce Management System</p>
                </div>

                {error && (
                    <div className="bg-[#fee] text-[#c00] p-[12px] rounded-[5px] mb-[20px] text-[14px] border-l-[4px] border-[#c00] animate-in slide-in-from-top-2 duration-300">
                        {error}
                    </div>
                )}

                <div className="bg-[#eef] text-[#00c] p-[12px] rounded-[5px] mb-[20px] text-[13px] border-l-[4px] border-[#00c]">
                    ℹ️ Only admin users with superuser or staff privileges can log in here.
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-[20px]">
                        <label htmlFor="username" className="block mb-[8px] text-[#333] font-medium text-[14px]">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter your username"
                            className="w-full p-[12px] border border-[#ddd] rounded-[5px] text-[14px] transition-all focus:outline-none focus:border-[#667eea] focus:ring-[rgba(102,126,234,0.1)]"
                        />
                    </div>

                    <div className="mb-[20px]">
                        <label htmlFor="password" className="block mb-[8px] text-[#333] font-medium text-[14px]">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                            className="w-full p-[12px] border border-[#ddd] rounded-[5px] text-[14px] transition-all focus:outline-none focus:border-[#667eea] focus:ring-[rgba(102,126,234,0.1)]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full p-[12px] bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-[5px] text-[16px] font-semibold cursor-pointer transition-all hover:-translate-y-[2px] hover:shadow-[0_5px_15px_rgba(102,126,234,0.4)] active:translate-y-0 mt-[10px] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Processing...' : 'Login'}
                    </button>
                </form>

                <div className="text-center mt-[20px] text-[13px] text-[#999]">
                    <p>🏠 <a href="/" className="text-[#667eea] no-underline hover:underline">Back to Vendor Login</a></p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;