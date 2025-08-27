'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailVerification = async () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      alert('Verification email sent!');
      setIsLoading(false);
    }, 1000);
  };

  const handleSSOLogin = () => {
    router.push('/sso/bni');
  };

  return (
    <div className="w-screen h-screen bg-gray-800 flex flex-col md:flex-row m-0 p-0">
      {/* Left Side - Illustration */}
        <div className="hidden md:flex flex-1 bg-gray-100 p-4 md:p-8 items-center justify-center relative">
          <div className="relative scale-75 md:scale-90 w-full h-full flex items-center justify-center">
            <img 
              src="/assets/phone.png"
              alt="Phone Illustration"
              className="rounded-3xl max-w-full max-h-full object-contain"
            />
          </div>
        </div>

      {/* Right Side - Forgot Password Form */}
      <div className="flex-1 p-4 md:p-8 flex flex-col justify-center bg-white min-h-screen md:min-h-0">
          <div className="max-w-md mx-auto w-full">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <img 
                  src="/assets/splitr.png"
                  alt="SPLITR Logo"
                  className="h-25 object-contain"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Forgot Password</h2>
              <p className="text-gray-600 text-sm">
                Verify your email or use BNI SSO to reset password
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-gray-900 bg-white placeholder-gray-400"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Email Verification Button */}
              <button
                onClick={handleEmailVerification}
                disabled={isLoading}
                className="w-full bg-orange-500 text-white py-2.5 rounded-md font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'SENDING...' : 'Verfication Email'}
              </button>

              {/* Divider */}
              <div className="text-center text-gray-500 text-sm">OR</div>

              {/* BNI SSO Button */}
              <button
                onClick={handleSSOLogin}
                className="w-full bg-white border border-blue-500 text-blue-600 py-2.5 rounded-md font-medium hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                <span className="mr-2">🏢</span>
                Reset with BNI SSO
              </button>

              {/* Back to Login */}
              <div className="text-center mt-6">
                <button 
                  onClick={() => router.push('/')}
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}