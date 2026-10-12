"use client";

import Link from "next/link";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RoleSchema } from "@/validation/authValidation";

export default function Role() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      companyName: "",
      designation: "",
    },
    validationSchema: RoleSchema,
    onSubmit: (values) => {
      console.log("✅ Submitted Role Data:", values);
      router.push("/email-verification");
    },
  });

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
    errors,
  } = formik;

  const isActive =
    values.companyName.trim() !== "" &&
    values.designation.trim() !== "" &&
    Object.keys(errors).length === 0;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[600px] mx-auto py-10 px-4 md:px-10 flex flex-col justify-between min-h-screen">
      <div>
        {/* Title */}
        <h2 className="text-[32px] font-bold text-center mb-2 text-brand-950">
          Role Selection
        </h2>
        <p className="text-center text-[#525866] mb-8 text-[16px]">
          Tell us about your company and your role.
        </p>

        <div className="mb-4">
          <Label htmlFor="companyName" className="text-[14px] font-semibold">
            Company Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyName"
            name="companyName"
            type="text"
            placeholder="Your company name"
            value={values.companyName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="bg-white"
          />
          {touched.companyName && errors.companyName && (
            <p className="text-sm text-red-500 mt-1">{errors.companyName}</p>
          )}
        </div>

        <div className="mb-6">
          <Label htmlFor="designation" className="text-[14px] font-semibold">
            Designation <span className="text-red-500">*</span>
          </Label>
          <Input
            id="designation"
            name="designation"
            type="text"
            placeholder="HR Manager"
            value={values.designation}
            onChange={handleChange}
            onBlur={handleBlur}
            className="bg-white"
          />
          {touched.designation && errors.designation && (
            <p className="text-sm text-red-500 mt-1">{errors.designation}</p>
          )}
        </div>
      </div>

      <div className="mt-10 text-[14px] text-center text-[#525866] w-full">
        <Button
          type="submit"
          disabled={!isActive}
          className={`w-full py-3 text-[14px] font-semibold rounded-[10px] transition duration-300 ${isActive
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
          Register
        </Button>

        <p className="mt-4 text-[#525866] text-[14px]">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-brand-700 font-bold hover:underline"
          >
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
