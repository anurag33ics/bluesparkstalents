import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { CheckCircle2 } from "lucide-react";

const highlights = [
  "Professional screening interviews",
  "Verified candidate profiles",
  "Direct access for hiring companies",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white relative overflow-hidden">
      {/* Background Top */}
 <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[460px] opacity-100"
        style={{
          backgroundImage: "url('/assets/images/login/background.png')",
          backgroundRepeat: "repeat",
          backgroundPosition: "top left",
          backgroundSize: "auto",
        }}
      />

      {/* Left: Form */}
      <div className="relative z-10 w-full lg:w-[45%] flex items-center justify-center">
        {children}
      </div>

      {/* Right: Brand panel */}
      <div className="hidden lg:block w-[55%]">
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src="/assets/images/why-choose-us.jpg"
            alt="Team collaborating on successful hiring"
            fill
            sizes="55vw"
            className="object-cover"
            priority
          />

          {/* Logo top-left */}
          <Link
            href="/"
            className="absolute top-6 left-6 z-10 inline-flex items-center gap-2.5 rounded-2xl border border-white bg-white/85 px-3 py-2 shadow-sm backdrop-blur-md"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 font-heading text-base font-medium text-white">
              B
            </span>
            <span className="font-heading text-lg font-medium tracking-tight text-brand-950">
              Bluespark<span className="text-brand-600">Talents</span>
            </span>
          </Link>

          {/* Brand message */}
          <div className="absolute inset-x-6 bottom-6 z-10 rounded-3xl border border-white bg-white/85 p-7 shadow-xl shadow-brand-500/10 backdrop-blur-md">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              Get Screened. Get Verified. Get Hired.
            </p>
            <p className="mt-3 font-heading text-2xl font-medium leading-snug text-brand-950">
              Connecting verified talent with companies that are ready to hire.
            </p>
            <ul className="mt-5 space-y-2.5">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-[#536888]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
