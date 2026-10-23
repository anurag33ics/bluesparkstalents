"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function EmailVerificationSuccess() {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (countdown <= 0) {
            // The dashboard lives in the talent app, so this is a full page load.
            window.location.assign("/talent/dashboard");
            return;
        }
        const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    return (
        <div className="min-h-screen flex flex-col justify-between items-center px-6 py-10">
            <div className="flex flex-col justify-center items-center flex-grow text-center">
                <h2 className="text-[32px] font-bold mb-2 text-brand-950">
                    Authentication Successfully
                </h2>
                <p className="text-[#525866] text-[16px] mb-8">
                    You have been authenticated successfully
                </p>

                <div className="w-full max-w-sm mb-6">
                    <div className="h-px bg-[#E4E6E8]" />
                </div>

                <div className="mb-10">
                    <Image
                        src="/assets/images/login/success.png"
                        alt="Authentication success"
                        width={300}
                        height={300}
                    />
                </div>

                <p className="text-[#525866] text-[14px]">
                    Redirecting you to dashboard{" "}
                    <span className="font-semibold text-black">
                        00:0{countdown}
                    </span>
                </p>
            </div>

            <div className="w-full flex items-center justify-between text-xs text-gray-400">
                <span>© 2026 Bluespark Talents.</span>
                <span className="flex items-center gap-1">🌐 ENG</span>
            </div>
        </div>
    );
}
