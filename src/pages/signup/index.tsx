import React, { useEffect, useState } from "react";
import { Button, Input } from "@/components/ui";
import { Lock, User, Mail, Phone, Building, UserCircle } from "lucide-react";
import { useAppSelector } from "@/hooks";
import { AnimatedSystemSvg } from "@/components/app/AnimatedSystemSvg";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/services/auth/hooks";

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const FormState = useAppSelector((s: any) => s.form);
  const { signup, signupResult } = useAuth();
  const [form, setForm] = useState({
    company_name: "",
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirm_password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(form);
  };

  useEffect(() => {
    if (signupResult.isSuccess) {
      navigate("/", { replace: true });
    }
  }, [signupResult, navigate]);

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
      <div className="relative z-20 w-full lg:w-[45%] flex flex-col justify-center px-8 lg:px-20 xl:px-32 py-12 overflow-y-auto max-h-screen">
        <div className="w-full max-w-[420px] mx-auto lg:mx-0">
          {/* Top Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-32 h-32 object-contain"
            />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[34px] font-[350] text-[#4a4a4a] mb-2 tracking-tight">
              Create Account
            </h1>
            <p className="text-[#a0aabf] text-[15px]">
              Start your journey with Enigma Franchisor
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Company Name */}
              <Input
                variant="primary"
                name="company_name"
                className="bg-[#f4f7fc]! rounded-2xl! py-4! pl-12! pr-4! text-[15px]! text-gray-700! placeholder-[#a0aabf]!"
                placeholder="Company Name"
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                required
                prefix={<Building size={18} className="text-[#a0aabf]" strokeWidth={2} />}
                error={FormState?.errors?.company_name}
              />

              {/* Full Name */}
              <Input
                variant="primary"
                name="name"
                className="bg-[#f4f7fc]! rounded-2xl! py-4! pl-12! pr-4! text-[15px]! text-gray-700! placeholder-[#a0aabf]!"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                prefix={<User size={18} className="text-[#a0aabf]" strokeWidth={2} />}
                error={FormState?.errors?.name}
              />

              {/* Email & Phone Group */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  variant="primary"
                  type="email"
                  name="email"
                  className="bg-[#f4f7fc]! rounded-2xl! py-4! pl-12! pr-4! text-[15px]! text-gray-700! placeholder-[#a0aabf]!"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  prefix={<Mail size={18} className="text-[#a0aabf]" strokeWidth={2} />}
                  error={FormState?.errors?.email}
                />
                <Input
                  variant="primary"
                  name="phone"
                  className="bg-[#f4f7fc]! rounded-2xl! py-4! pl-12! pr-4! text-[15px]! text-gray-700! placeholder-[#a0aabf]!"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  prefix={<Phone size={18} className="text-[#a0aabf]" strokeWidth={2} />}
                  error={FormState?.errors?.phone}
                />
              </div>

              {/* Username */}
              <Input
                variant="primary"
                name="username"
                className="bg-[#f4f7fc]! rounded-2xl! py-4! pl-12! pr-4! text-[15px]! text-gray-700! placeholder-[#a0aabf]!"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                prefix={<UserCircle size={18} className="text-[#a0aabf]" strokeWidth={2} />}
                error={FormState?.errors?.username}
              />

              {/* Passwords */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  variant="primary"
                  type="password"
                  name="password"
                  className="bg-[#f4f7fc]! rounded-2xl! py-4! pl-12! pr-4! text-[15px]! text-gray-700! placeholder-[#a0aabf]!"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  prefix={<Lock size={18} className="text-[#a0aabf]" strokeWidth={2} />}
                  error={FormState?.errors?.password}
                />
                <Input
                  variant="primary"
                  type="password"
                  name="confirm_password"
                  className="bg-[#f4f7fc]! rounded-2xl! py-4! pl-12! pr-4! text-[15px]! text-gray-700! placeholder-[#a0aabf]!"
                  placeholder="Confirm"
                  value={form.confirm_password}
                  onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                  required
                  prefix={<Lock size={18} className="text-[#a0aabf]" strokeWidth={2} />}
                  error={FormState?.errors?.confirm_password}
                />
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-4">
              <Button
                type="submit"
                isLoading={signupResult?.isLoading}
                variant="primary"
                shape="wide"
                size="lg"
                className="rounded-full w-full"
              >
                Sign Up
              </Button>

              <p className="text-center text-[13px] text-[#a0aabf]">
                Already have an account?{" "}
                <Link to="/signin" className="text-primary font-medium hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
