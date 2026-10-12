import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, ShieldCheck, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Verified Talent",
    description: "Every profile goes through our screening process.",
  },
  {
    icon: Users,
    title: "Quality Candidates",
    description: "Connect with professionals matched to your needs.",
  },
  {
    icon: Zap,
    title: "Faster Hiring",
    description: "Reduce screening time and focus on the right people.",
  },
];

export function About() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">

          {/* IMAGE SIDE */}
          <Reveal className="relative">

            {/* Main image */}
            <div className="relative mx-auto max-w-xl">

              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-2xl shadow-brand-500/15">
                <Image
                  src="/assets/images/about.jpg"
                  alt="Professional talent and hiring"
                  fill
                  sizes="(min-width: 1024px) 36rem, 100vw"
                  className="object-cover object-top"
                />

                {/* Image overlay */}

                {/* Bottom image content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white bg-white/85 px-4 py-2 shadow-sm backdrop-blur-md">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>

                    <span className="text-sm font-semibold text-brand-950">
                      Trusted Talent. Better Hiring.
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-7 -right-3 w-[230px] rounded-2xl border border-white/60 bg-white p-5 shadow-xl sm:-right-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                    <ShieldCheck className="h-6 w-6 text-brand-600" />
                  </div>

                  <div>
                    <p className="font-heading text-xl font-medium text-brand-950">
                      Verified
                    </p>

                    <p className="text-xs text-gray-500">
                      Candidate profiles
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-brand-50">
                  <div className="h-full w-full rounded-full bg-brand-500" />
                </div>
              </div>

              {/* Decorative square */}
              <div className="absolute -left-5 -top-5 -z-10 h-24 w-24 rounded-2xl border-2 border-brand-200" />

            </div>
          </Reveal>

          {/* CONTENT SIDE */}
          <Reveal delay={150}>

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2">
              <span className="h-1 w-8 rounded-full bg-brand-500" />

              <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
                Who We Are
              </span>
            </div>

            {/* Heading */}
            <h2 className="mt-5 font-heading text-3xl font-medium leading-tight tracking-tight text-brand-950 sm:text-4xl lg:text-5xl">
              Where great talent meets
              <span className="text-brand-600"> great opportunities.</span>
            </h2>

            {/* Description */}
            <p className="mt-6 text-base leading-7 text-gray-600 sm:text-lg">
              Bluespark Talents is built to make hiring simpler, faster,
              and more reliable. We bring companies and skilled
              professionals together through a quality-first approach
              to recruitment.
            </p>

            <p className="mt-4 text-base leading-7 text-gray-600">
              Our candidates are screened and evaluated before they reach
              hiring teams, giving employers greater confidence and
              candidates a clearer path toward the right opportunity.
            </p>

            {/* Highlights */}
            <div className="mt-8 space-y-5">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group flex gap-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm transition-colors group-hover:bg-brand-600">
                      <Icon className="h-5 w-5 text-brand-600 group-hover:text-white" />
                    </div>

                    <div>
                      <h3 className="font-heading text-base font-bold text-brand-950">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-9">
              <Button
                size="lg"
                nativeButton={false}
                render={
                  <Link
                    href="/about-us"
                    className="group bg-brand-600 text-white hover:bg-brand-500"
                  />
                }
              >
                Discover Bluespark Talents

                <ArrowRight
                  data-icon="inline-end"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Button>
            </div>

          </Reveal>
        </div>
      </div>
    </section>
  );
}