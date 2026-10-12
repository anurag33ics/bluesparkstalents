"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Verification() {
    const router = useRouter();
    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputRefs = useRef<HTMLInputElement[]>([]);

    const handleChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return;
        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalCode = otp.join("");
        if (finalCode.length === 4) {
            console.log("✅ OTP Entered:", finalCode);
            router.push("/email-verification-success");
        }
    };

    const isFilled = otp.every((digit) => digit !== "");

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-[600px] mx-auto py-10 px-4 md:px-10 flex flex-col justify-between min-h-screen">
            <div>
                <h2 className="text-[32px] font-bold mt-[2rem] mb-2 text-center">Enter Verification Code</h2>
                <p className="text-[#525866] mb-8 text-center">
                    We’ve sent a code to <span className="font-bold">your email address</span>
                </p>
                <div className="my-6 text-[#99A0AE] w-full flex items-center gap-2">
                    <div className="h-px bg-[#E4E6E8] flex-grow" />
                </div>
                <div className="flex justify-center gap-3 mb-10">
                    {otp.map((value, index) => (
                        <input
                            key={index}
                            ref={(el) => {
                                inputRefs.current[index] = el!;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            className="w-20 h-15 border border-gray-300 rounded text-center text-[24px] focus:outline-none"
                            value={value}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    ))}
                </div>
            </div>
            <div className="mt-10 text-[14px] text-center text-[#525866]">
                <Button
                    type="submit"
                    disabled={!isFilled}
                    className={`w-full text-[14px] font-medium py-2 rounded-md transition duration-300 ${isFilled
                        ? "text-white"
                        : "text-[#CACFD8] cursor-not-allowed bg-[#F5F7FA]"
                        }`}
                    style={
                        isFilled
                            ? {
                                background:
                                    "linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 100%), var(--brand-600)",
                                cursor: "pointer",
                            }
                            : {}
                    }
                >
                    Submit Code
                </Button>
                <p className="mt-4">
                    Experiencing issues receiving the code?{" "}
                    <a href="#" className="text-brand-700 font-bold underline">
                        Resend code
                    </a>
                </p>
                <div className="w-full flex items-center justify-between text-xs text-gray-400 mt-6">
                    <span>© 2026 Bluespark Talents.</span>
                    <span className="flex items-center gap-1">🌐 ENG</span>
                </div>
            </div>
        </form>
    );
}
