import React, { useState } from 'react'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      console.log('Login attempt:', { email, password, rememberMe })
    }, 1500)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center p-4">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/adminloginbg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Soft Dark Overlay to ensure form readability */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Login Card Container */}
      <div className="w-full max-w-lg relative z-10">
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl shadow-gray-200/60 p-6 sm:p-8 transition-all duration-500 hover:shadow-[0_35px_60px_-12px_rgba(0,0,0,0.15)]">

          {/* Logo Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-900 to-indigo-900 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 transform transition-transform duration-300 hover:scale-105">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>

          {/* Brand Title */}
          <div className="text-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">
              <span className="text-gray-800">Shop</span>
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Sphere</span>
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm font-medium">
              Welcome back! Please sign in to continue
            </p>
          </div>

          {/* Section Title - Centered */}
          <div className="mb-4 flex justify-center">
            <h2 className="text-lg font-bold text-gray-800">
              Admin Login
            </h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 ease-out hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 ease-out hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-md bg-white transition-all duration-200 peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600 peer-checked:border-transparent group-hover:border-gray-400 peer-focus:ring-2 peer-focus:ring-blue-500/20"></div>
                  <svg className="absolute top-0.5 left-0.5 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-xs font-medium text-blue-600 hover:text-indigo-600 transition-colors duration-200 hover:underline underline-offset-2"
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-500/25 transition-all duration-300 ease-out hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] active:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white/70 text-gray-500 font-medium whitespace-nowrap">or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium text-xs transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md active:scale-[0.98]">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium text-xs transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md active:scale-[0.98]">
              <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center mt-6 text-gray-600 text-xs">
            Don't have an account?{' '}
            <a
              href="#"
              className="font-semibold text-blue-600 hover:text-indigo-600 transition-colors duration-200 hover:underline underline-offset-2"
            >
              Sign up for free
            </a>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center mt-4 text-[10px] text-gray-500">
          By signing in, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}

export default AdminLogin