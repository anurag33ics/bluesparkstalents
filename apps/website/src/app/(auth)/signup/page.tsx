"use client";

import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { useFormik } from "formik";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignUpSchema } from "@/validation/authValidation";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignUp() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
    },
    validationSchema: SignUpSchema,
    onSubmit: (values) => {
      console.log("✅ Submitted Form Data:", values);
      router.push("/role");
    },
  });

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    setFieldValue,
    handleSubmit,
  } = formik;

  const isActive =
    values.fullName.trim() !== "" &&
    values.email.trim() !== "" &&
    values.phone.trim() !== "" &&
    values.password.trim() !== "" &&
    Object.keys(errors).length === 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[600px] mx-auto py-6 px-4 md:px-10 flex flex-col justify-between min-h-screen"
    >
      <div>
        <h2 className="text-[32px] font-bold mb-1 text-center">Personal Information</h2>
        <p className="text-[#525866] mb-2 text-center">
          Provide essential information to proceed.
        </p>

        {/* Full Name */}
        <div className="mb-4">
          <Label htmlFor="fullName" className="text-[14px] font-semibold">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="James Brown"
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="mt-1 bg-white"
          />
          {touched.fullName && errors.fullName && (
            <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
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

        {/* Phone */}
        <div className="mb-4">
          <Label htmlFor="phone" className="text-[14px] font-semibold">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <div className="relative w-full mt-1">
            <PhoneInput
              country={"in"}
              value={values.phone}
              onChange={(val: string) => setFieldValue("phone", val)}
              onBlur={() => formik.setFieldTouched("phone", true)}
              inputClass="!w-full !h-[44px] !pl-[90px] !pr-4 !rounded-[10px] !border !border-[#E4E6E8] !text-[14px] !text-brand-950 !bg-white !outline-none !shadow-none placeholder:text-[#99A0AE]"
              buttonClass="!absolute !left-3 !top-[5px] !z-10 !bg-transparent !border-none !p-0"
              containerClass="!w-full !relative !rounded-[10px] !bg-white"
              dropdownClass="!rounded-lg !shadow-md !z-[1000]"
            />
            {/* Divider */}
            <div className="absolute left-[72px] top-1/2 -translate-y-1/2 h-6 w-px bg-[#E4E6E8] z-20" />
          </div>
          {touched.phone && errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <Label htmlFor="password" className="text-[14px] font-semibold">
            Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Lock size={18} />
            </span>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="pl-10 bg-white"
            />
          </div>
          {touched.password && errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!isActive}
          className={`w-full py-3 font-semibold rounded-[10px] transition duration-300 ${
            isActive
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

        <div className="my-6 text-[#99A0AE] w-full flex items-center gap-2">
          <div className="h-px bg-[#E4E6E8] flex-grow" />
          <span className="text-xs whitespace-nowrap">OR</span>
          <div className="h-px bg-[#E4E6E8] flex-grow" />
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 mb-3 border border-gray-300"
        >
          <Image src="/assets/images/google.png" alt="Google" width={18} height={18} />
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 mb-4 border border-gray-300"
        >
          <Image src="/assets/images/facebook.png" alt="Facebook" width={18} height={18} />
          Continue with Facebook
        </Button>
      </div>

      <div className="mt-3 w-full text-center text-[14px] text-[#525866]">
        <p className="mt-4">
          Already have an account?{" "}
          <Link href="/signin" className="text-brand-700 font-bold hover:underline">
            Login
          </Link>
        </p>

        <div className="w-full flex items-center justify-between text-xs text-gray-400 mt-6">
          <span>© 2026 Bluespark Talents.</span>
          <span className="flex items-center gap-1">🌐 ENG</span>
        </div>
      </div>
    </form>
  );
}
