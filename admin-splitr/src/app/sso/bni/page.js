'use client';
import { useRouter } from 'next/navigation';

export default function BNISSOPage() {
  const router = useRouter();

  const handleBackToLogin = () => {
    router.push('/');
  };

  return (
    <div className="w-screen h-screen bg-gray-800 flex flex-col md:flex-row m-0 p-0">
      {/* Left Side - Illustration */}
      <div className="hidden md:flex flex-1 bg-gray-100 p-4 md:p-8 items-center justify-center relative">
        <div className="relative scale-75 md:scale-90 w-full h-full flex items-center justify-center">
          <img 
            src="/assets/astronaut.png"
            alt="Astronaut Illustration"
            className="rounded-3xl max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="flex-1 p-4 md:p-2 flex flex-col justify-center bg-white min-h-screen md:min-h-0">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/assets/splitr.png"
              alt="BNI Splitr Logo"
              className="h-25 object-contain"
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-4 text-gray-900">
            Maintenance Mode
          </h1>

          {/* Paragraph */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            We are adding new features for BNI SSO, It will be operational
            really soon
            <br />
            <br />
            <span className="italic">May the force be with you</span>
          </p>

          {/* Back to login button */}
          <button
            onClick={handleBackToLogin}
            className="w-full bg-orange-500 text-white py-2.5 rounded-md font-medium hover:bg-orange-600 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}