"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import Cookies from "js-cookie";
import { Button, Input } from "../components";
import { ForgotPasswordModal } from "../components";

export default function SplitrLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const router = useRouter();

  // Remove default body margins and ensure full screen
  React.useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.body.style.width = "100vw";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.documentElement.style.height = "100vh";
    document.documentElement.style.width = "100vw";

    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.width = "";
      document.documentElement.style.margin = "";
      document.documentElement.style.padding = "";
      document.documentElement.style.height = "";
      document.documentElement.style.width = "";
    };
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting login with:", { username, password });

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response status:", response.status);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          "Server returned HTML instead of JSON. Check API endpoint."
        );
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        // Store admin data in cookies
        console.log("Setting cookies with data:", data);

        if (data.sessionId) {
          Cookies.set("sessionId", data.sessionId, { expires: 1, path: "/" });
          console.log("SessionId cookie set:", Cookies.get("sessionId"));
        }

        // Create user data from response or fallback
        const userData = data.admin ||
          data.user ||
          data.data || {
            username: username,
            name: data.name || username,
            role: data.role || "Admin",
            id: data.id || 1,
          };

        console.log("User data to store:", userData);
        Cookies.set("user", JSON.stringify(userData), {
          expires: 1,
          path: "/",
        });
        console.log("User cookie set:", Cookies.get("user"));

        console.log("Login successful, redirecting to dashboard");
        console.log("SessionId cookie:", Cookies.get("sessionId"));
        console.log("User cookie:", Cookies.get("user"));

        // Small delay to ensure cookies are set before navigation
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      } else {
        console.error("Login failed:", data);
        alert(data.error || data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = () => {
    router.push("/sso/bni");
  };

  const handleAdminLogin = () => {
    router.push("/admin");
  };

  const handleForgotPassword = () => {
    setShowForgotModal(true);
  };

  return (
    <div className="w-screen h-screen bg-gray-800 flex flex-col md:flex-row m-0 p-0">
      {/* Left Side - Illustration */}
      <div className="hidden md:flex flex-1 bg-gray-100 p-4 md:p-8 items-center justify-center relative">
        <div className="relative scale-75 md:scale-90 w-full h-full flex items-center justify-center">
          {/* Gambar lokal */}
          <img
            src="/assets/phone.png"
            alt="Phone Illustration"
            className="rounded-3xl max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 p-4 md:p-2 flex flex-col justify-center bg-white min-h-screen md:min-h-0">
        <div className="max-w-md mx-auto w-full px-4 md:px-0">
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
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your username"
              required
            />

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors pr-12 text-gray-900 bg-white placeholder-gray-400"
                  placeholder="Enter your password"
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
                  suppressHydrationWarning
                >
                  {showPassword ? (
                    <RiEyeLine size={20} />
                  ) : (
                    <RiEyeOffLine size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                onClick={handleForgotPassword}
                className="text-sm text-orange-500 hover:text-orange-600"
                suppressHydrationWarning
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              loading={isLoading}
              className="w-full"
            >
              LOG IN
            </Button>

            {/* Divider */}
            <div className="text-center text-gray-500 text-sm">OR</div>

            {/* SSO Login Button */}
            <Button
              variant="secondary"
              onClick={handleSSOLogin}
              className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
            >
              <span className="mr-2">🏢</span>
              Login with BNI SSO
            </Button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={showForgotModal} 
        onClose={() => setShowForgotModal(false)} 
      />
    </div>
  );
}
