"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormik } from "formik";
import { SignInSchema } from "@/validation/authValidation";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            keepLoggedIn: false,
        },
        validationSchema: SignInSchema,
        onSubmit: (values) => {
            console.log("Login values:", values);
        },
    });

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = formik;

    const isActive = values.email.trim() !== "" && !errors.email && values.password.trim() !== "" && !errors.password;

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-[600px] mx-auto py-8 px-4 md:px-10 flex flex-col justify-between min-h-screen"
        >
            <h2 className="text-[28px] md:text-[32px] font-bold mb-4 text-center">
                Sign in to Bluespark Talents
            </h2>
            <p className="text-[#525866] mb-6 text-center text-[14px] md:text-[16px]">
                Access your profile, screening status, and verified talent in one place.
            </p>

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
                        className="pl-10"
                    />
                </div>
                {touched.email && errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
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
                        className="pl-10"
                    />
                </div>
                {touched.password && errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
            </div>

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="keepLoggedIn"
                        checked={values.keepLoggedIn}
                        onCheckedChange={(val) => setFieldValue("keepLoggedIn", val === true)}
                    />
                    <Label htmlFor="keepLoggedIn" className="text-[14px] text-brand-950 cursor-pointer">
                        Keep me logged in
                    </Label>
                </div>
                <Link href="/forgot-password" className="text-[14px] text-brand-700 font-bold hover:underline">
                    Forgot password?
                </Link>
            </div>

            <Button
                type="submit"
                disabled={!isActive}
                className={`w-full text-[14px] font-medium py-2 mt-3 rounded-md transition duration-300 ${isActive
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
                Login
            </Button>

            <div className="my-6 text-[#99A0AE] w-full flex items-center gap-2">
                <div className="h-px bg-[#E4E6E8] flex-grow" />
                <span className="text-xs whitespace-nowrap">OR</span>
                <div className="h-px bg-[#E4E6E8] flex-grow" />
            </div>

            <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 mb-6 border border-gray-300"
            >
                <Image src="/assets/images/google.png" alt="Google" width={18} height={18} />
                Continue with Google
            </Button>

            <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 mb-6 border border-gray-300"
            >
                <Image src="/assets/images/facebook.png" alt="Facebook" width={18} height={18} />
                Continue with Facebook
            </Button>

            <div className="text-[14px] text-center mt-6 text-[#525866]">
                Don’t have an account?{" "}
                <Link href="/signup" className="text-brand-700 font-bold hover:underline">
                    Register
                </Link>
            </div>

            <div className="w-full flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 mt-10 gap-2">
                <span>© 2026 Bluespark Talents.</span>
                <span className="flex items-center gap-1">🌐 ENG</span>
            </div>
        </form>
    );
}
