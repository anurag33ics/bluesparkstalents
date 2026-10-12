"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function EmailVerificationFailed() {
    const router = useRouter();

    const handleRetry = () => {
        router.push("/email-verification");
    };

    const handleCancel = () => {
        router.push("/signin");
    };

    return (
        <div className="w-full py-10 px-8 flex flex-col justify-between min-h-screen">
            <div className="flex flex-col justify-center items-center flex-grow text-center">
                <h2 className="text-[32px] font-bold mb-2 text-brand-950">
                    Authentication Failed
                </h2>
                <p className="text-[#525866] text-[16px] mb-8">
                    Please enter the correct code for authentication
                </p>
                <div className="w-full max-w-sm mb-6">
                    <div className="h-px bg-[#E4E6E8]" />
                </div>
                <div className="mb-10">
                    <Image
                        src="/assets/images/login/failed.png"
                        alt="Authentication failed"
                        width={300}
                        height={300}
                    />
                </div>
                <div className="w-full max-w-sm flex flex-col gap-4">
                    <Button
                        onClick={handleRetry}
                        className="w-full py-3 text-white font-semibold rounded-md"
                        style={{
                            background:
                                "linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 100%), var(--brand-600)",
                            cursor: "pointer",
                        }}
                    >
                        Try Again
                    </Button>
                    <Button
                        onClick={handleCancel}
                        className="w-full py-3 text-brand-950 font-semibold"
                        style={{
                            borderRadius: "var(--radius-10, 10px)",
                            background: "var(--bg-white-0, #FFF)",
                            boxShadow:
                                "0px 1px 3px 0px rgba(14, 18, 27, 0.12), 0px 0px 0px 1px var(--stroke-soft-200, #E1E4EA)",
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
            <div className="w-full flex items-center justify-between text-xs text-gray-400 mt-10">
                <span>© 2026 Bluespark Talents.</span>
                <span className="flex items-center gap-1">🌐 ENG</span>
            </div>
        </div>
    );
}
