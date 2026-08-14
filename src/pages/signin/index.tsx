import React, { useEffect, useState } from "react";
import { Button, Input } from "@/components/ui";
import { Lock, User } from "lucide-react";
import { useAppSelector } from "@/hooks";
import { AnimatedSystemSvg } from "@/components/app/AnimatedSystemSvg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/services/auth/hooks";

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const FormState = useAppSelector((s: any) => s.form);
  const { login, loadProfile, loginResult } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      identifier: form.username,
      password: form.password,
    };

    await login(payload);
  };

  useEffect(() => {
    if (!loginResult.isSuccess) return;

    const fetchProfile = async () => {
      try {
        await loadProfile();
      } finally {
        navigate("/", { replace: true });
      }
    };
    fetchProfile();
  }, [loginResult, navigate, loadProfile]);

  return (
    <div className="min-h-screen w-full relative flex items-center bg-white overflow-hidden font-sans">
      {/* Right side diagonal blue background with Grid pattern */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[55%] bg-primary transform lg:-skew-x-12 lg:translate-x-32 hidden lg:block z-0 shadow-2xl shadow-primary/20 overflow-hidden">
        {/* Architectural Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 mix-blend-overlay" />
      </div>
      {/* Right side Animated SVG overlay */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] hidden lg:flex justify-center items-center z-10 pointer-events-none">
        <AnimatedSystemSvg />
      </div>

      {/* Left side content */}
      <div className="relative z-20 w-full lg:w-[45%] flex flex-col justify-center px-8 lg:px-20 xl:px-32 h-screen">
        <div className="w-full max-w-[420px] mx-auto lg:mx-0">
          {/* Top Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-40 h-40 object-contain"
            />
          </div>

          {/* Heading */}
          <div className="mb-12">
            <h1 className="text-[34px] font-[350] text-[#4a4a4a] mb-2 tracking-tight">
              Welcome back,
            </h1>
            <p className="text-[#a0aabf] text-[15px]">
              Please login to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* Username Input */}
              <Input
                variant="primary"
                type="text"
                name="username"
                className="bg-[#f4f7fc]! rounded-2xl! py-4! pl-12! pr-4! text-[15px]! text-gray-700! placeholder-[#a0aabf]!"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                prefix={
                  <User size={18} className="text-[#a0aabf]" strokeWidth={2} />
                }
                error={
                  typeof FormState?.errors?.identifier === "string"
                    ? FormState.errors.identifier
                    : undefined
                }
              />

              {/* Password Input */}

              <Input
                variant="primary"
                name="password"
                className="bg-[#f4f7fc]! rounded-2xl! py-4! pl-12! pr-4! text-[15px]! text-gray-700! placeholder-[#a0aabf]!"
                placeholder="············"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                prefix={
                  <Lock size={18} className="text-[#a0aabf]" strokeWidth={2} />
                }
                error={
                  typeof FormState?.errors?.password === "string"
                    ? FormState.errors.password
                    : undefined
                }
              />
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between text-[13px] pt-1">
              <label className="flex items-center gap-2.5 text-[#a0aabf] cursor-pointer hover:text-gray-600 transition-colors">
                <input
                  type="checkbox"
                  className="rounded-sm text-primary focus:ring-primary border-gray-300 w-4 h-4 bg-[#f4f7fc] border-none cursor-pointer"
                />
                Remember me
              </label>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <Button
                type="submit"
                isLoading={loginResult?.isLoading}
                variant="primary"
                shape="wide"
                size="lg"
                className="rounded-full"
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
