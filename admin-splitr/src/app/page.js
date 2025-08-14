'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SplitrLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Remove default body margins and ensure full screen
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.width = '100vw';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.height = '100vh';
    document.documentElement.style.width = '100vw';
    
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.width = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
      document.documentElement.style.height = '';
      document.documentElement.style.width = '';
    };
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Demo authentication - replace with real API
      const validCredentials = [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'user', password: 'user123', role: 'user' },
        { username: 'demo', password: 'demo123', role: 'user' }
      ];
      
      const user = validCredentials.find(
        cred => cred.username === username && cred.password === password
      );
      
      if (user) {
        const token = 'demo-token-' + Date.now();
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ 
          username: user.username, 
          role: user.role,
          loginTime: new Date().toISOString()
        }));
        router.push('/dashboard');
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = () => {
    window.location.href = '/api/auth/sso/bni';
  };

  const handleAdminLogin = () => {
    router.push('/admin');
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <div className="w-screen h-screen bg-gray-800 flex m-0 p-0">
      {/* Main Container */}
      {/* <div className="bg-gray-200 w-full h-full flex items-center justify-center p-8"> */}
        
        {/* Login Box with Purple Border */}
        <div className=" w-screen h-screen bg-gray-800 flex m-0 p-0 ">
          
          
         {/* Left Side - Illustration */}
          <div className="flex-1 bg-gray-100 p-8 flex items-center justify-center relative">
            <div className="relative scale-90 w-full h-full flex items-center justify-center">
              {/* Gambar lokal */}
              <img 
                src="/assets/phone.png"
                alt="Phone Illustration"
                className="rounded-3xl w-120 h-140 justify-center object-contain"
              />
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex-1 p-2 flex flex-col justify-center bg-white">
            <div className="max-w-md mx-auto w-full">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <img 
                  src="/assets/splitr.png"
                  alt="Phone Illustration"
                  className="h-25 object-contain"
                />
              </div>

              {/* Login Form */}
              <div className="space-y-4">
                {/* Username/Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username/Email
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-gray-900 bg-white placeholder-gray-400"
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
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors pr-12 text-gray-900 bg-white placeholder-gray-400"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
                    >
                      {showPassword ? '🙈' : '👁️'}
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
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 mr-2"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button 
                    onClick={handleForgotPassword}
                    className="text-sm text-orange-500 hover:text-orange-600"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-orange-500 text-white py-2.5 rounded-md font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'LOGGING IN...' : 'LOG IN'}
                </button>

                {/* Divider */}
                <div className="text-center text-gray-500 text-sm">OR</div>

                {/* SSO Login Button */}
                <button
                  onClick={handleSSOLogin}
                  className="w-full bg-white border border-blue-500 text-blue-600 py-2.5 rounded-md font-medium hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                  <span className="mr-2">🏢</span>
                  Login with BNI SSO
                </button>

                {/* Demo Credentials */}
                <div className="text-center mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-600 mb-2">Demo Credentials:</p>
                  <p className="text-xs text-gray-500">admin/admin123 | user/user123 | demo/demo123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}