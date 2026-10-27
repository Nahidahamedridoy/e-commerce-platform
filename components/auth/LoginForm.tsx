"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { authApi, ApiError } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  AlertCircleIcon,
  CheckIcon,
  SpinnerIcon,
  GoogleIcon,
  GithubIcon,
} from "@/components/ui/Icons";

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [forgotNotice, setForgotNotice] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotNotice(null);
    setApiError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage(null);

    try {
      const data = await authApi.login({
        email: email.trim().toLowerCase(),
        password,
      });

      dispatch(setCredentials({ user: data.user, token: data.token }));
      setSuccessMessage(`Welcome back, ${data.user.name}! Redirecting...`);

      setTimeout(() => {
        if (data.user.role === "ADMIN") {
          router.push(redirectUrl === "/" ? "/admin" : redirectUrl);
        } else {
          router.push(redirectUrl);
        }
      }, 700);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setApiError(err.message || "Failed to sign in. Please verify your credentials.");
      } else if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError("Cannot reach auth server at http://localhost:5000/api. Ensure server is running.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setIsSocialLoading(provider);
    setTimeout(() => {
      setIsSocialLoading(null);
      setSuccessMessage(`Demo sign-in with ${provider} completed successfully!`);
    }, 1000);
  };

  const handleForgotPassword = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter your email above to receive a recovery link",
      }));
      return;
    }
    setForgotNotice(`Password reset instructions have been dispatched to ${email.trim()}`);
  };

  return (
    <div className="space-y-6">
      {/* API Error Notification Banner */}
      {apiError && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-[#FF8066]/15 border border-[#FF8066]/40 flex items-start gap-3 text-xs sm:text-sm text-[#FF8066] animate-fade-in"
        >
          <div className="h-5 w-5 rounded-full bg-[#FF8066]/20 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircleIcon className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1">
            <span className="font-bold">Authentication Error: </span>
            <span>{apiError}</span>
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {successMessage && (
        <div
          role="status"
          className="p-4 rounded-2xl bg-[#C6F36A]/15 border border-[#C6F36A]/40 flex items-start gap-3 text-xs sm:text-sm text-[#C6F36A] animate-fade-in"
        >
          <div className="h-5 w-5 rounded-full bg-[#C6F36A]/20 flex items-center justify-center shrink-0 mt-0.5">
            <CheckIcon className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1">
            <span className="font-bold">Sign In: </span>
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Forgot Password Feedback Banner */}
      {forgotNotice && (
        <div
          role="status"
          className="p-4 rounded-2xl bg-[#171B2B] border border-[#2E364F] flex items-start gap-3 text-xs sm:text-sm text-[#F4F3ED] animate-fade-in"
        >
          <div className="h-5 w-5 rounded-full bg-[#C6F36A]/20 text-[#C6F36A] flex items-center justify-center shrink-0 mt-0.5">
            <CheckIcon className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1">
            <span className="font-semibold">{forgotNotice}</span>
          </div>
        </div>
      )}

      {/* Social Quick Login */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="card"
          size="md"
          disabled={isLoading || !!isSocialLoading}
          onClick={() => handleSocialLogin("Google")}
          className="w-full text-xs font-semibold gap-2 border-[#2E364F] hover:border-[#3E496A] bg-[#171B2B]"
        >
          {isSocialLoading === "Google" ? (
            <SpinnerIcon className="w-4 h-4 text-[#C6F36A]" />
          ) : (
            <GoogleIcon className="w-4 h-4 shrink-0" />
          )}
          <span>Google</span>
        </Button>

        <Button
          type="button"
          variant="card"
          size="md"
          disabled={isLoading || !!isSocialLoading}
          onClick={() => handleSocialLogin("GitHub")}
          className="w-full text-xs font-semibold gap-2 border-[#2E364F] hover:border-[#3E496A] bg-[#171B2B]"
        >
          {isSocialLoading === "GitHub" ? (
            <SpinnerIcon className="w-4 h-4 text-[#C6F36A]" />
          ) : (
            <GithubIcon className="w-4 h-4 shrink-0" />
          )}
          <span>GitHub</span>
        </Button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-[#2E364F] w-full" />
        <span className="bg-[#22283A] px-3 text-[11px] uppercase tracking-wider text-[#657189] font-mono">
          Or with email
        </span>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email Field */}
        <div>
          <label
            htmlFor="login-email"
            className="block text-xs font-semibold text-[#F4F3ED] mb-1.5"
          >
            Email Address
          </label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            placeholder="name@example.com"
            icon={<MailIcon className="w-4 h-4" />}
            error={!!errors.email}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            disabled={isLoading}
          />
          {errors.email && (
            <div
              id="login-email-error"
              className="flex items-center gap-1.5 mt-1.5 text-xs text-[#FF8066]"
            >
              <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="login-password"
              className="text-xs font-semibold text-[#F4F3ED]"
            >
              Password
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs text-[#C6F36A] hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C6F36A] rounded transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            placeholder="Enter your password"
            icon={<LockIcon className="w-4 h-4" />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="hover:text-[#F4F3ED] transition-colors focus:outline-none cursor-pointer"
              >
                {showPassword ? (
                  <EyeOffIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </button>
            }
            error={!!errors.password}
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? "login-password-error" : undefined
            }
            disabled={isLoading}
          />
          {errors.password && (
            <div
              id="login-password-error"
              className="flex items-center gap-1.5 mt-1.5 text-xs text-[#FF8066]"
            >
              <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.password}</span>
            </div>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-[#2E364F] bg-[#10131F] text-[#C6F36A] accent-[#C6F36A] focus:ring-0 cursor-pointer"
            />
            <span className="text-xs text-[#9AA3B8] hover:text-[#F4F3ED] transition-colors">
              Remember me on this browser
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="lime"
          size="lg"
          disabled={isLoading}
          className="w-full text-sm font-bold shadow-[0_0_20px_rgba(198,243,106,0.3)] hover:shadow-[0_0_30px_rgba(198,243,106,0.5)] transition-all duration-200 mt-2"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <SpinnerIcon className="w-4 h-4" />
              <span>Signing in...</span>
            </div>
          ) : (
            <span>Sign In to Amar Dokan</span>
          )}
        </Button>
      </form>
    </div>
  );
};
