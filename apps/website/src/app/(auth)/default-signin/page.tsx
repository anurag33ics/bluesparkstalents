"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormik } from "formik";
import { EmailSignInSchema } from "@/validation/authValidation";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      acceptTerms: false,
    },
    validationSchema: EmailSignInSchema,
    onSubmit: (values) => {
      console.log("Login values:", values);
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = formik;

  const isActive = values.email.trim() !== "" && !errors.email && values.acceptTerms;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[600px] mx-auto py-10 px-4 md:px-10 flex flex-col justify-between min-h-screen">
      {/* Title */}
      <div>
        <h2 className="text-[24px] md:text-[28px] font-bold text-center mb-2">
          Get started with Bluespark Talents
        </h2>
        <p className="text-[#525866] text-center text-[14px] mb-6">
          Enter your email address to continue.
        </p>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 text-[14px] py-3 rounded-md mb-6"
        >
          <Image src="/assets/images/google.png" alt="Google" width={18} height={18} />
          Continue with Google
        </Button>

        <div className="my-6 text-[#99A0AE] w-full flex items-center gap-2">
          <div className="flex-grow h-px bg-[#E4E6E8]" />
          <span className="text-xs whitespace-nowrap">OR</span>
          <div className="flex-grow h-px bg-[#E4E6E8]" />
        </div>

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
              className="pl-10 bg-white text-[14px] rounded-md"
            />
          </div>
          {touched.email && errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="flex items-start gap-2 mb-6 text-[14px]">
          <Checkbox
            id="acceptTerms"
            checked={values.acceptTerms}
            onCheckedChange={(checked) => setFieldValue("acceptTerms", checked)}
          />
          <Label htmlFor="acceptTerms" className="cursor-pointer leading-snug text-brand-950">
            I agree to the{" "}
            <Link href="/terms-conditions" className="text-brand-700 font-semibold underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-brand-700 font-semibold underline">
              Privacy Policy
            </Link>
            .
          </Label>
        </div>

        {touched.acceptTerms && errors.acceptTerms && (
          <p className="-mt-4 mb-6 text-sm text-red-500">{errors.acceptTerms}</p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-10 w-full text-center text-[14px] text-[#525866]">
        {/* Submit Button */}
        <button
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
          Get Started
        </button>

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
