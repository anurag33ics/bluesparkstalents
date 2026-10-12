"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ForgotPasswordSchema } from "@/validation/authValidation";

export default function ForgotPassword() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ForgotPasswordSchema,
    onSubmit: (values) => {
      console.log("✅ Submitted Form Data:", values);
      router.push("/role"); // You can update to actual reset page if needed
    },
  });

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    handleSubmit,
  } = formik;

  const isActive = values.email.trim() !== "" && Object.keys(errors).length === 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[600px] mx-auto py-18 px-4 md:px-10 flex flex-col justify-between min-h-screen"
    >
      <div>
        <h2 className="text-[32px] font-bold mb-2 text-center">Forgot your Password?</h2>
        <p className="text-[#525866] mb-8 text-center">
          Enter your email address to receive a password reset link
        </p>

        {/* Email */}
        <div className="mt-10">
          <Label htmlFor="email" className="text-[14px] font-semibold">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Mail size={18} />
            </span>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="pl-10 bg-white"
            />
          </div>
          {touched.email && errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="mt-8 w-full text-center text-[14px] text-[#525866]">
        {/* Next Button */}
        <Button
          type="submit"
          disabled={!isActive}
          className={`w-full py-3 font-semibold rounded-[10px] transition duration-300 ${isActive
              ? "text-white"
              : "text-[#CACFD8] cursor-not-allowed bg-[#F5F7FA]"
            }`}
          style={
            isActive
              ? {
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 100%), var(--brand-600)",
                cursor: "pointer",
              }
              : {}
          }
        >
          Next
        </Button>

        {/* Login link */}
        <p className="mt-4">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-brand-700 font-bold hover:underline">
            Sign Up
          </Link>
        </p>

        {/* Footer */}
        <div className="w-full flex items-center justify-between text-xs text-gray-400 mt-6">
          <span>© 2026 Bluespark Talents.</span>
          <span className="flex items-center gap-1">🌐 ENG</span>
        </div>
      </div>
    </form>
  );
}
