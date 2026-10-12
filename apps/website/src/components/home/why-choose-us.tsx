import Image from "next/image";
import {
  BadgeCheck,
  MessageSquareText,
  ShieldCheck,
  Clock3,
  SlidersHorizontal,
  Users,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const values: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: BadgeCheck,
    title: "Verified Professionals",
    description:
      "Every candidate goes through a structured screening process before becoming part of our talent network.",
  },
  {
    icon: ShieldCheck,
    title: "Confidence in Every Profile",
    description:
      "Get access to candidate information that has been reviewed, evaluated, and presented clearly.",
  },
  {
    icon: Clock3,
    title: "Hire Faster",
    description:
      "Spend less time searching and filtering. Start conversations with candidates who are ready for the next step.",
  },
  {
    icon: SlidersHorizontal,
    title: "Smarter Matching",
    description:
      "Find talent based on skills, experience, domain, and the requirements that matter to your business.",
  },
  {
    icon: MessageSquareText,
    title: "Actionable Feedback",
    description:
      "Candidates receive meaningful feedback that helps them understand their strengths and areas to improve.",
  },
  {
    icon: Users,
    title: "Direct Connections",
    description:
      "Bring companies and candidates together directly, creating a simpler and more transparent hiring experience.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="relative scroll-mt-16 overflow-hidden bg-white py-20 sm:py-24 lg:py-28">

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Why Bluespark Talents</span>
            </div>

            <h2 className="font-heading text-3xl font-medium tracking-tight text-brand-950 sm:text-4xl lg:text-5xl">
              Why companies choose </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#536888] sm:text-lg">
              We take the uncertainty out of recruitment by combining professional screening, verified profiles, and smarter connections between talent and employers.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-10">

          <Reveal className="lg:col-span-5">
            <div className="group relative h-full min-h-[560px] overflow-hidden rounded-[2.5rem] border border-white shadow-xl shadow-brand-500/10">
              <Image src="/assets/images/why-choose-us.jpg" alt="Team collaborating on successful hiring" fill sizes="(min-width: 1024px) 34rem, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />


              <div className="absolute left-6 top-6 sm:left-8 sm:top-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-white bg-white/85 px-4 py-2 shadow-sm backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-brand-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">Built for better hiring</span>
                </div>
              </div>

              <div className="absolute inset-x-4 bottom-4 rounded-[2rem] border border-white bg-white/85 p-6 shadow-lg backdrop-blur-md sm:inset-x-5 sm:bottom-5 sm:p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/25">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <h3 className="font-heading text-2xl font-medium text-brand-950 sm:text-3xl">Quality comes first.</h3>

                <p className="mt-3 max-w-md text-sm leading-6 text-[#536888]">
                  From the first screening to the final connection, we focus on creating a hiring experience where quality matters more than quantity.
                </p>

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600">
                  <span>Built for better hiring</span>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <div className="grid gap-5 sm:grid-cols-2">
              {values.map((value, index) => {
                const Icon = value.icon;

                return (
                  <Reveal key={value.title} delay={index * 70} className="h-full">
<div className="group relative h-full overflow-hidden rounded-[2rem] border border-brand-100 bg-white p-7 shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:border-brand-300 hover:bg-white hover:shadow-2xl hover:shadow-brand-500/10">

  <div className="relative flex items-center gap-5">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-all duration-500 group-hover:bg-brand-500 group-hover:text-white">
      <Icon className="h-5 w-5" strokeWidth={1.8} />
    </div>

    <h3 className="font-heading text-lg font-medium text-brand-950 transition-colors duration-500">
      {value.title}
    </h3>
  </div>

  <p className="relative mt-5 text-sm leading-6 text-[#536888] transition-colors duration-500">
    {value.description}
  </p>

  <div className="absolute bottom-0 left-7 right-7 h-1 rounded-full bg-brand-400 opacity-0 transition-all duration-500 group-hover:opacity-100" />
</div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}