import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";
import { EnquiryForm } from "@/components/home/enquiry-form";
import { Reveal } from "@/components/ui/reveal";

const benefits = [
  "Pre-screened professionals",
  "Verified candidate profiles",
  "Faster hiring decisions",
];

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28">

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Main CTA */}
        <div className="relative overflow-hidden rounded-[2.75rem] border border-brand-100 bg-white shadow-2xl shadow-brand-500/10">

          {/* Decorative circle */}
          <div className="pointer-events-none absolute right-10 top-10 hidden h-32 w-32 rounded-full border border-brand-100 lg:block" />
          <div className="pointer-events-none absolute right-20 top-20 hidden h-12 w-12 rounded-full border border-brand-100 lg:block" />

          <div className="relative grid lg:grid-cols-2">

            {/* =====================================================
                LEFT CONTENT
            ====================================================== */}

            <Reveal className="flex flex-col justify-center p-7 sm:p-10 lg:p-14 xl:p-16">

              {/* Badge */}
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2">
                <Sparkles className="h-4 w-4 text-brand-600" strokeWidth={1.8} />

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                  Let's Work Together
                </span>
              </div>

              {/* Heading */}
              <h2 className="mt-7 max-w-xl font-heading text-4xl font-medium leading-[1.02] tracking-tight text-brand-950 sm:text-5xl lg:text-6xl">
                Your next great
                <br />
                <span className="text-brand-600">hire is out there.</span>
              </h2>

              {/* Description */}
              <p className="mt-6 max-w-lg text-base leading-7 text-[#536888] sm:text-lg">
                Connect with skilled, screened, and verified professionals
                who are ready to take the next step in their careers.
              </p>

              {/* Benefits */}
              <div className="mt-8 space-y-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50">
                      <CheckCircle2 className="h-4 w-4 text-brand-600" />
                    </div>

                    <span className="text-sm font-medium text-brand-950/80">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <Link
                  href="/contact-us"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/25"
                >
                  Find Talent
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/contact-us"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white px-6 text-sm font-semibold text-brand-700 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:bg-white"
                >
                  Contact Us
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>

              </div>

              {/* Trust text */}
              <div className="mt-9 flex items-center gap-3 border-t border-brand-200 pt-6">
                <div className="flex -space-x-2">
                  <span className="h-7 w-7 rounded-full border-2 border-white bg-brand-400" />
                  <span className="h-7 w-7 rounded-full border-2 border-white bg-brand-600" />
                  <span className="h-7 w-7 rounded-full border-2 border-white bg-brand-100" />
                </div>

                <p className="text-xs text-[#536888]">
                  Trusted by companies looking for quality talent
                </p>
              </div>

            </Reveal>

            {/* =====================================================
                RIGHT FORM
            ====================================================== */}

            <Reveal delay={150} className="p-4 sm:p-6 lg:p-8">

              <div className="h-full rounded-[2rem] bg-white p-6 shadow-2xl shadow-brand-500/10 sm:p-8 lg:p-9">

                {/* Form heading */}
                <div className="mb-7">
                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                        Get in touch
                      </p>

                      <h3 className="mt-2 font-heading text-2xl font-medium text-brand-950 sm:text-3xl">
                        Tell us what you need.
                      </h3>
                    </div>

                    <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 sm:flex">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>

                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Share your hiring requirements and our team will help
                    you find the right talent.
                  </p>
                </div>

                {/* Existing form */}
                <EnquiryForm />

              </div>

            </Reveal>

          </div>
        </div>
      </div>
    </section>
  );
}