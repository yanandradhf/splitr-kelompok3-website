'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '../../components';

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
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />

              {/* Email Verification Button */}
              <Button
                onClick={handleEmailVerification}
                disabled={isLoading}
                loading={isLoading}
                className="w-full"
              >
                Verification Email
              </Button>

              {/* Divider */}
              <div className="text-center text-gray-500 text-sm">OR</div>

              {/* BNI SSO Button */}
              <Button
                variant="secondary"
                onClick={handleSSOLogin}
                className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
              >
                <span className="mr-2">🏢</span>
                Reset with BNI SSO
              </Button>

              {/* Back to Login */}
              <div className="text-center mt-6">
                <Button 
                  variant="secondary"
                  onClick={() => router.push('/')}
                  size="sm"
                  className="text-orange-500 hover:text-orange-600"
                >
                  ← Back to Login
                </Button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}