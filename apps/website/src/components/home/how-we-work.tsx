import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  UserPlus,
  ClipboardCheck,
  ShieldCheck,
  Search,
  Handshake,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const chips = [
  { icon: UserPlus, label: "Register" },
  { icon: ShieldCheck, label: "Verify" },
  { icon: Handshake, label: "Hire" },
];

const steps: {
  number: string;
  icon: LucideIcon;
  tag: string;
  title: string;
  description: string;
}[] = [
  {
    number: "01",
    icon: UserPlus,
    tag: "GET STARTED",
    title: "Register",
    description:
      "Create your profile in minutes and tell us what you're looking for.",
  },
  {
    number: "02",
    icon: ClipboardCheck,
    tag: "SCREENING",
    title: "Get Screened",
    description:
      "Complete a professional screening interview to demonstrate your skills and communication.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    tag: "VERIFICATION",
    title: "Get Verified",
    description:
      "Your skills and profile are reviewed so companies can hire with greater confidence.",
  },
  {
    number: "04",
    icon: Search,
    tag: "DISCOVERY",
    title: "Get Discovered",
    description:
      "Companies find and shortlist candidates based on skills, experience, and hiring needs.",
  },
  {
    number: "05",
    icon: Handshake,
    tag: "OPPORTUNITY",
    title: "Get Hired",
    description:
      "Connect directly with the right company and move forward with confidence.",
  },
];

export function HowWeWork() {
  return (
    <section id="how-we-work" className="relative scroll-mt-16 overflow-hidden bg-white py-20 sm:py-24 lg:py-28">

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-50 px-4 py-2">
              <Sparkles className="h-4 w-4 text-brand-600" strokeWidth={2} />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">How It Works</span>
            </div>

            <h2 className="font-heading text-3xl font-medium tracking-tight text-brand-950 sm:text-4xl lg:text-5xl">
              From first step to
              <span className="text-brand-600"> the right opportunity.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              We've simplified the hiring journey so candidates know what to expect and companies can focus on finding the right talent.
            </p>
          </div>
        </Reveal>

        {/* PROCESS */}
        <div className="mt-16">

          {/* Desktop timeline */}
          <div className="relative hidden lg:block">

            {/* Connecting line */}
            <div className="absolute left-[10%] right-[10%] top-[3.5rem] h-px bg-brand-100" />

            {/* Green progress line */}
            <div className="absolute left-[10%] top-[3.5rem] h-px w-[80%] bg-gradient-to-r from-brand-500 via-brand-600 to-brand-500" />

            <div className="grid grid-cols-5 gap-4">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <Reveal key={step.number} delay={index * 90}>
                    <div className="group relative text-center">

                      {/* Icon */}
                      <div className="relative z-10 mx-auto flex h-28 w-28 items-center justify-center rounded-full border-8 border-white bg-brand-50 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:bg-brand-500 group-hover:shadow-xl group-hover:shadow-brand-500/20">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand-600 transition-all duration-500 group-hover:text-brand-600">
                          <Icon className="h-7 w-7" strokeWidth={1.7} />
                        </div>
                      </div>

                      {/* Number */}
                      <div className="mx-auto mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-700 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                        <CheckCircle2 className="h-3 w-3" />
                        Step {index + 1}
                      </div>

                      {/* Title */}
                      <h3 className="mt-4 font-heading text-xl font-medium text-brand-950">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="mx-auto mt-3 max-w-[210px] text-sm leading-6 text-gray-500">
                        {step.description}
                      </p>

                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Mobile / Tablet cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <Reveal key={step.number} delay={index * 80}>
                  <div className="group relative h-full overflow-hidden rounded-[2rem] border border-brand-100 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-brand-300 hover:bg-white hover:shadow-xl hover:shadow-brand-500/15">

                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-600 transition-all duration-500 group-hover:bg-brand-500 group-hover:text-white">
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </div>

                      <span className="text-xs font-bold uppercase tracking-widest text-brand-600 transition-colors duration-500 group-hover:text-brand-600">
                        Step {index + 1}
                      </span>
                    </div>

                    <h3 className="mt-6 font-heading text-xl font-medium text-brand-950">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-600 transition-colors duration-500 group-hover:text-brand-950/70">
                      {step.description}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors duration-500 group-hover:text-brand-700">
                      <span>{step.tag}</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}