import React from 'react';

const VendorLogin = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/50">
                <div className="text-center">
                    <img src="" alt="" />
                    <h2 className="text-4xl font-extrabold tracking-tight">
                        <span className="text-slate-900 italic">Shop</span>
                        <span className="text-indigo-600">Sphere</span>
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 font-medium">
                        Empowering your business. Welcome back!
                    </p>
                    <h3 className="mt-6 text-2xl font-bold text-gray-900 border-b-2 border-indigo-100 pb-2 inline-block">
                        Vendor Login
                    </h3>
                </div>

                <form className="mt-8 space-y-6" action="#" method="POST">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200 bg-white/50 hover:bg-white"
                                placeholder="vendor@shopsphere.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" title="Password" className="block text-sm font-semibold text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200 bg-white/50 hover:bg-white"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember"
                                name="remember"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer transition-colors"
                            />
                            <label htmlFor="remember" className="ml-2 block text-sm text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
                                Remember Me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors hover:underline">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-600/20"
                        >
                            Login as Vendor
                        </button>
                    </div>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600 font-medium">
                        Don't have a vendor account?{' '}
                        <a href="#" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors decoration-2 hover:underline">
                            Sign up for free
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VendorLogin;