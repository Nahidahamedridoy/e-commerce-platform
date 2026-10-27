"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { authApi, ApiError } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  UserIcon,
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

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
  }>({});

  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = (pass: string): { score: number; label: string; color: string } => {
    if (!pass) return { score: 0, label: "", color: "bg-transparent" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-[#FF8066]" };
    if (score === 2 || score === 3)
      return { score: 2, label: "Medium", color: "bg-amber-400" };
    return { score: 3, label: "Strong", color: "bg-[#C6F36A]" };
  };

  const strength = getPasswordStrength(password);

  const validate = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      agreeTerms?: string;
    } = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms agreement
    if (!agreeTerms) {
      newErrors.agreeTerms = "You must agree to the Terms of Service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage(null);

    try {
      const data = await authApi.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      dispatch(setCredentials({ user: data.user, token: data.token }));
      setSuccessMessage(
        `Account created successfully for ${data.user.name}! Redirecting...`
      );

      setTimeout(() => {
        router.push("/");
      }, 800);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setApiError(err.message || "Registration failed. Please review your information.");
      } else if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError("Cannot reach auth server at http://localhost:5000/api. Ensure server is running.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    setIsSocialLoading(provider);
    setTimeout(() => {
      setIsSocialLoading(null);
      setSuccessMessage(`Demo registration with ${provider} completed successfully!`);
    }, 1000);
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
            <span className="font-bold">Registration Error: </span>
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
            <span className="font-bold">Registration: </span>
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Social Quick Sign Up */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="card"
          size="md"
          disabled={isLoading || !!isSocialLoading}
          onClick={() => handleSocialRegister("Google")}
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
          onClick={() => handleSocialRegister("GitHub")}
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
          Or register with email
        </span>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full Name Field */}
        <div>
          <label
            htmlFor="register-name"
            className="block text-xs font-semibold text-[#F4F3ED] mb-1.5"
          >
            Full Name
          </label>
          <Input
            id="register-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) {
                setErrors((prev) => ({ ...prev, name: undefined }));
              }
            }}
            placeholder="John Doe"
            icon={<UserIcon className="w-4 h-4" />}
            error={!!errors.name}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "register-name-error" : undefined}
            disabled={isLoading}
          />
          {errors.name && (
            <div
              id="register-name-error"
              className="flex items-center gap-1.5 mt-1.5 text-xs text-[#FF8066]"
            >
              <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.name}</span>
            </div>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="register-email"
            className="block text-xs font-semibold text-[#F4F3ED] mb-1.5"
          >
            Email Address
          </label>
          <Input
            id="register-email"
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
            aria-describedby={errors.email ? "register-email-error" : undefined}
            disabled={isLoading}
          />
          {errors.email && (
            <div
              id="register-email-error"
              className="flex items-center gap-1.5 mt-1.5 text-xs text-[#FF8066]"
            >
              <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="register-password"
            className="block text-xs font-semibold text-[#F4F3ED] mb-1.5"
          >
            Password
          </label>
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            placeholder="At least 8 characters"
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
              errors.password ? "register-password-error" : undefined
            }
            disabled={isLoading}
          />

          {/* Password Strength Meter */}
          {password && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#9AA3B8]">Security strength:</span>
                <span
                  className={`font-semibold ${
                    strength.score === 1
                      ? "text-[#FF8066]"
                      : strength.score === 2
                      ? "text-amber-400"
                      : "text-[#C6F36A]"
                  }`}
                >
                  {strength.label}
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#171B2B] rounded-full overflow-hidden flex gap-1">
                <div
                  className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                    strength.score >= 1 ? strength.color : "bg-transparent"
                  }`}
                />
                <div
                  className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                    strength.score >= 2 ? strength.color : "bg-transparent"
                  }`}
                />
                <div
                  className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                    strength.score >= 3 ? strength.color : "bg-transparent"
                  }`}
                />
              </div>
            </div>
          )}

          {errors.password && (
            <div
              id="register-password-error"
              className="flex items-center gap-1.5 mt-1.5 text-xs text-[#FF8066]"
            >
              <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.password}</span>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="register-confirm-password"
            className="block text-xs font-semibold text-[#F4F3ED] mb-1.5"
          >
            Confirm Password
          </label>
          <Input
            id="register-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }
            }}
            placeholder="Repeat your password"
            icon={<LockIcon className="w-4 h-4" />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirmed password"
                    : "Show confirmed password"
                }
                className="hover:text-[#F4F3ED] transition-colors focus:outline-none cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </button>
            }
            error={!!errors.confirmPassword}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword
                ? "register-confirm-password-error"
                : undefined
            }
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <div
              id="register-confirm-password-error"
              className="flex items-center gap-1.5 mt-1.5 text-xs text-[#FF8066]"
            >
              <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.confirmPassword}</span>
            </div>
          )}
        </div>

        {/* Terms Agreement Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (errors.agreeTerms) {
                  setErrors((prev) => ({ ...prev, agreeTerms: undefined }));
                }
              }}
              className="mt-0.5 h-4 w-4 rounded border-[#2E364F] bg-[#10131F] text-[#C6F36A] accent-[#C6F36A] focus:ring-0 cursor-pointer shrink-0"
            />
            <span className="text-xs text-[#9AA3B8] leading-tight">
              I agree to the{" "}
              <span className="text-[#F4F3ED] underline hover:text-[#C6F36A]">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-[#F4F3ED] underline hover:text-[#C6F36A]">
                Privacy Policy
              </span>
            </span>
          </label>
          {errors.agreeTerms && (
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#FF8066]">
              <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.agreeTerms}</span>
            </div>
          )}
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
              <span>Creating Account...</span>
            </div>
          ) : (
            <span>Create Dokan Account</span>
          )}
        </Button>
      </form>
    </div>
  );
};
