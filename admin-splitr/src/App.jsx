import React, { useState } from 'react';
import splitrLogo from './assets/splitr.png';
import phoneImage from './assets/phone-image.png';
import 'remixicon/fonts/remixicon.css';


export default function SplitrLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    console.log('Login attempt:', { username, password, rememberMe });
  };

  // Add global styles to remove default margins/padding
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex m-0 p-0">
      <div className="bg-white shadow-2xl overflow-hidden w-full h-full flex">
        {/* Left Side - Illustration */}
        <div className="flex-1 bg-gradient-to-br from-purple-100 to-pink-100 p-12 flex items-center justify-center relative">
          <div className="relative">
            {/* Phone illustration pakai gambar lokal */}
            <img 
              src={phoneImage} 
              alt="Phone Illustration" 
              className="relative rounded-xl shadow-xl w-80 h-96 object-contain"
            />
            
            {/* Lock icon */}
            {/* <div className="absolute -left-8 top-8 bg-pink-400 rounded-full p-4">
              <div className="w-6 h-6 bg-white rounded border-2 border-pink-400"></div>
            </div> */}
            
            {/* Person illustration */}
            {/* <div className="absolute -left-16 bottom-16">
              <div className="w-12 h-12 bg-purple-400 rounded-full mb-2"></div>
              <div className="w-8 h-16 bg-purple-400 rounded-lg mx-auto"></div>
            </div> */}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            {/* Logo */}
            <img 
              src={splitrLogo} 
              alt="SPLITR Logo" 
              className="h-20 w-auto mx-auto mb-4"
            />

            {/* Login Form */}
            <div className="space-y-6">
              {/* Username/Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username/Email
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-gray-900 bg-white"
                  placeholder="Enter your username or email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors pr-12 text-gray-900 bg-white"
                        placeholder="Enter your password"
                      />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2  text-lg"
                  >
                    {showPassword ? (
                      <i className="ri-eye-fill"></i>
                    ) : (
                      <i className="ri-eye-off-fill"></i>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-orange-500 hover:text-orange-600">
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                LOGIN
              </button>

              {/* Divider */}
              <div className="text-center text-gray-500 text-sm">OR</div>

              {/* SSO Login Button */}
              <button
                type="button"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <span className="mr-2">🏢</span>
                Login with BNI SSO
              </button>

              {/* Admin Dashboard Link */}
              <div className="text-center">
                <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                  Admin Dashboard Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}