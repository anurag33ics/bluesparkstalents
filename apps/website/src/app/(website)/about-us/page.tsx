import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  Zap,
  SearchCheck,
  MessageCircle,
  BriefcaseBusiness,
  BadgeCheck,
  HeartHandshake,
} from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";

export const metadata: Metadata = {
  title: "About Us | Bluespark Talents",
  description:
    "Discover how Bluespark Talents connects verified professionals with companies through a transparent, quality-first recruitment experience.",
};

const stats = [
  {
    value: 3,
    suffix: "",
    label: "Core stages",
    description: "Understand, verify and connect",
  },
  {
    value: 100,
    suffix: "%",
    label: "Quality focused",
    description: "Built around better hiring decisions",
  },
  {
    value: 1,
    suffix: "",
    label: "Clear mission",
    description: "Better matches for both sides",
  },
  {
    value: 24,
    suffix: "/7",
    label: "Human connection",
    description: "People remain at the centre",
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Trust first",
    description:
      "We believe meaningful hiring starts with accurate information, transparent communication and genuine preparation.",
  },
  {
    icon: UsersRound,
    title: "People first",
    description:
      "Candidates and companies are both part of the experience. We design the process with respect for both.",
  },
  {
    icon: Zap,
    title: "Keep moving",
    description:
      "A clear process reduces unnecessary friction and helps the right conversations happen sooner.",
  },
];

const process = [
  {
    number: "01",
    icon: SearchCheck,
    title: "Understand",
    description:
      "We start by understanding the candidate, the opportunity and the expectations behind the search.",
  },
  {
    number: "02",
    icon: BadgeCheck,
    title: "Verify",
    description:
      "We focus on the signals that matter so companies can approach conversations with greater confidence.",
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Connect",
    description:
      "We bring prepared candidates and hiring teams together for focused, meaningful conversations.",
  },
];

const benefits = [
  "Professional screening and verification",
  "Clearer candidate information",
  "More focused conversations",
  "A quality-first recruitment experience",
];

export default function AboutUsPage() {
  return (
    <div className="overflow-hidden bg-white">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative isolate overflow-hidden bg-[#F8FBFF]">

        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-brand-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-28">

          {/* Hero content */}
          <Reveal className="lg:col-span-7">

            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 shadow-sm">
              <Sparkles className="h-4 w-4 text-brand-600" />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
                About Bluespark Talents
              </span>
            </div>

            <h1 className="mt-7 max-w-4xl font-heading text-5xl font-semibold leading-[0.98] tracking-tight text-brand-950 sm:text-6xl lg:text-7xl">
              Better hiring starts with
              <span className="block text-brand-600">
                better connections.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Bluespark Talents brings candidates and companies together
              through a more thoughtful recruitment experience built around
              screening, verification and meaningful conversations.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/contact-us"
                className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-brand-600 px-7 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-700"
              >
                Start a conversation

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/#how-we-work"
                className="inline-flex h-13 items-center justify-center rounded-xl border border-brand-200 bg-white px-7 text-sm font-semibold text-brand-800 transition hover:border-brand-300 hover:bg-brand-50"
              >
                Explore how we work
              </Link>

            </div>

            {/* Trust points */}
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">

              {[
                "Verified professionals",
                "Quality-first approach",
                "Human-centred hiring",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600"
                >
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  {item}
                </div>
              ))}

            </div>

          </Reveal>

          {/* Hero image */}
          <Reveal delay={120} className="lg:col-span-5">

            <div className="relative mx-auto max-w-lg">

              <div className="absolute -right-5 -top-5 h-28 w-28 rounded-3xl border border-brand-200 bg-brand-50/50" />

              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem] border-[6px] border-white bg-white shadow-2xl shadow-brand-900/10">

                <Image
                  src="/assets/images/about.jpg"
                  alt="Professional at work"
                  fill
                  priority
                  sizes="(min-width: 1024px) 32rem, 90vw"
                  className="object-cover object-top"
                />

                <div className="absolute bottom-5 left-5 right-5">

                  <div className="rounded-2xl border border-white/50 bg-white/90 p-5 shadow-xl backdrop-blur-xl">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
                        <BadgeCheck className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-brand-950">
                          Quality-first recruitment
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Verified. Prepared. Ready to connect.
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </Reveal>

        </div>
      </section>


      {/* =====================================================
          STATS
      ====================================================== */}
      <section className="relative z-10 -mt-2 px-5 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="grid overflow-hidden rounded-[2rem] border border-brand-100 bg-white shadow-xl shadow-brand-900/5 sm:grid-cols-2 lg:grid-cols-4">

            {stats.map((stat, index) => (
              <Reveal
                key={stat.label}
                delay={index * 80}
                className="relative"
              >

                <div className="h-full p-7 sm:p-8 lg:p-9">

                  <div className="font-heading text-4xl font-semibold tracking-tight text-brand-600">
                    <CountUp
                      end={stat.value}
                      suffix={stat.suffix}
                    />
                  </div>

                  <p className="mt-3 font-heading text-lg font-semibold text-brand-950">
                    {stat.label}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {stat.description}
                  </p>

                </div>

                {index !== stats.length - 1 && (
                  <div className="absolute bottom-8 right-0 hidden h-16 w-px bg-brand-100 lg:block" />
                )}

              </Reveal>
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          WHO WE ARE
      ====================================================== */}
      <section className="bg-white py-24 sm:py-32">

        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-20 lg:px-8">

          <Reveal className="lg:col-span-5">

            <div className="relative overflow-hidden rounded-[2rem] border border-brand-100 bg-white p-8 shadow-xl shadow-brand-500/10 sm:p-10">

              <div className="relative">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <HeartHandshake className="h-7 w-7" />
                </div>

                <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                  Who we are
                </p>

                <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-brand-950 sm:text-4xl">
                  Recruitment with more clarity, less noise.
                </h2>

                <p className="mt-5 text-sm leading-7 text-slate-600">
                  We believe recruitment should be more than moving profiles
                  from one inbox to another. It should create confidence
                  before the first conversation happens.
                </p>

                <div className="mt-8 h-px bg-brand-100" />

                <div className="mt-6 flex items-center gap-3">

                  <div className="flex -space-x-2">
                    {["bg-brand-300", "bg-brand-500", "bg-brand-100"].map((color) => (
                      <div
                        key={color}
                        className={`h-9 w-9 rounded-full border-2 border-white ${color}`}
                      />
                    ))}
                  </div>

                  <p className="text-xs font-medium text-slate-500">
                    Candidates + companies
                    <br />
                    moving forward together
                  </p>

                </div>

              </div>

            </div>

          </Reveal>


          <Reveal delay={100} className="lg:col-span-7">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              Our philosophy
            </p>

            <h2 className="mt-4 max-w-3xl font-heading text-4xl font-semibold leading-tight tracking-tight text-brand-950 sm:text-5xl">
              The right opportunity deserves the right introduction.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
              Bluespark Talents exists to make recruitment more useful for
              everyone involved. Candidates deserve to be represented clearly,
              while companies deserve access to people who are genuinely
              relevant to their needs.
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              Our approach puts preparation before introduction. By creating
              clearer expectations and stronger candidate signals, we aim to
              make every conversation more meaningful.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">

              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50/50 p-4"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-600" />

                  <span className="text-sm font-semibold text-brand-950">
                    {benefit}
                  </span>
                </div>
              ))}

            </div>

          </Reveal>

        </div>

      </section>


      {/* =====================================================
          MISSION / VISION
      ====================================================== */}
      <section className="bg-[#F8FBFF] py-24 sm:py-32">

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <Reveal className="max-w-2xl">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              What drives us
            </p>

            <h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-brand-950 sm:text-5xl">
              Built with purpose.
              <span className="block text-brand-600">
                Designed for people.
              </span>
            </h2>

          </Reveal>


          <div className="mt-12 grid gap-6 lg:grid-cols-2">

            {/* Mission */}
            <Reveal>

              <article className="h-full rounded-[2rem] border border-brand-100 bg-white p-8 shadow-sm sm:p-10">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white">
                  <Target className="h-6 w-6" />
                </div>

                <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                  Our mission
                </p>

                <h3 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-brand-950">
                  Raise the standard of recruitment.
                </h3>

                <p className="mt-5 text-base leading-8 text-slate-600">
                  To create a recruitment experience where candidates are
                  properly prepared and companies can engage with talent with
                  greater clarity and confidence.
                </p>

                <div className="mt-8 space-y-3 border-t border-slate-100 pt-7">

                  {[
                    "Professional screening",
                    "Candidate verification",
                    "Transparent communication",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm font-semibold text-brand-950"
                    >
                      <CheckCircle2 className="h-4 w-4 text-brand-600" />
                      {item}
                    </div>
                  ))}

                </div>

              </article>

            </Reveal>


            {/* Vision */}
            <Reveal delay={100}>

              <article className="h-full overflow-hidden rounded-[2rem] border border-brand-100 bg-white p-8 shadow-sm sm:p-10">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <Eye className="h-6 w-6" />
                </div>

                <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                  Our vision
                </p>

                <h3 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-brand-950">
                  Make every opportunity count.
                </h3>

                <p className="mt-5 text-base leading-8 text-slate-600">
                  We envision a recruitment ecosystem where talented people
                  are recognised for their potential and companies can build
                  teams with greater confidence and clarity.
                </p>

                <div className="mt-8 rounded-2xl border border-brand-100 p-6">

                  <p className="font-heading text-xl font-semibold text-brand-950">
                    Better matches.
                  </p>

                  <p className="mt-1 font-heading text-xl font-semibold text-brand-600">
                    Brighter futures.
                  </p>

                </div>

              </article>

            </Reveal>

          </div>

        </div>

      </section>


      {/* =====================================================
          PROCESS
      ====================================================== */}
     <section className="relative overflow-hidden bg-[#F8FBFF] py-24 sm:py-32">
  {/* Background decoration */}
  <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-brand-100/50 blur-3xl" />
  <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

  <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

    {/* Section Header */}
    <Reveal className="mx-auto max-w-2xl text-center">

      <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 shadow-sm">
        <span className="h-2 w-2 rounded-full bg-brand-600" />

        <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
          How it works
        </span>
      </div>

      <h2 className="mt-6 font-heading text-4xl font-semibold leading-tight tracking-tight text-brand-950 sm:text-5xl">
        A simpler path to
        <span className="block text-brand-600">
          better hiring.
        </span>
      </h2>

      <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">
        From the first conversation to the right match, our process keeps
        everything clear, focused, and human.
      </p>

    </Reveal>


    {/* Process */}
    <div className="relative mt-16 lg:mt-20">

      {/* Connecting Line - Desktop */}
      <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-[52px] hidden lg:block">
        <div className="h-px w-full bg-brand-200" />

        {/* Progress line */}
        <div className="absolute left-0 top-0 h-px w-1/2 bg-gradient-to-r from-brand-500 to-brand-300" />
      </div>


      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">

        {process.map((item, index) => {
          const Icon = item.icon;

          return (
            <Reveal
              key={item.number}
              delay={index * 120}
              className="relative"
            >

              <article className="group relative h-full">

                {/* Number / Icon */}
                <div className="relative z-10 mx-auto flex h-[104px] w-[104px] items-center justify-center">

                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border border-brand-200 bg-white shadow-sm transition-all duration-500 group-hover:border-brand-400 group-hover:shadow-lg group-hover:shadow-brand-500/10" />

                  {/* Inner circle */}
                  <div className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/20 transition-all duration-500 group-hover:scale-105 group-hover:bg-brand-700">

                    <Icon className="h-7 w-7" />

                  </div>
                </div>


                {/* Card */}
                <div className="mt-7 rounded-[2rem] border border-brand-100 bg-white p-7 text-center shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:border-brand-200 group-hover:shadow-xl group-hover:shadow-brand-500/10 sm:p-8">

                  {/* Small label */}
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-500">
                    Step {item.number}
                  </p>

                  {/* Title */}
                  <h3 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-brand-950">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>


                  {/* Bottom indicator */}
                  <div className="mx-auto mt-6 flex items-center justify-center gap-2">

                    <span className="h-1.5 w-1.5 rounded-full bg-brand-300" />

                    <span className="h-1.5 w-8 rounded-full bg-brand-100 transition-all duration-500 group-hover:w-12 group-hover:bg-brand-500" />

                    <span className="h-1.5 w-1.5 rounded-full bg-brand-300" />

                  </div>

                </div>

              </article>

            </Reveal>
          );
        })}

      </div>
    </div>
  </div>
</section>


      {/* =====================================================
          VALUES
      ====================================================== */}
      <section className="bg-[#F8FBFF] py-24 sm:py-32">

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">

            <Reveal className="lg:col-span-5">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                What matters to us
              </p>

              <h2 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-tight text-brand-950 sm:text-5xl">
                Principles that shape
                <span className="block text-brand-600">
                  every interaction.
                </span>
              </h2>

            </Reveal>

            <Reveal delay={100} className="lg:col-span-7">

              <p className="max-w-2xl text-base leading-8 text-slate-600">
                Our values influence how we work with candidates, companies and
                each other. They keep the experience focused on trust,
                transparency and meaningful outcomes.
              </p>

            </Reveal>

          </div>


          <div className="mt-12 grid gap-5 md:grid-cols-3">

            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <Reveal key={value.title} delay={index * 100}>

                  <article className="group h-full rounded-[1.75rem] border border-brand-100 bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 sm:p-8">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-7 font-heading text-2xl font-semibold text-brand-950">
                      {value.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {value.description}
                    </p>

                  </article>

                </Reveal>
              );
            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="px-5 py-20 sm:px-6 sm:py-28 lg:px-8">

        <Reveal>

          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-brand-100 bg-white px-7 py-14 text-center shadow-2xl shadow-brand-500/10 sm:px-12 sm:py-20">

            <div className="relative mx-auto max-w-3xl">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <BriefcaseBusiness className="h-6 w-6" />
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                Ready to connect?
              </p>

              <h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-brand-950 sm:text-5xl">
                Let’s build better connections.
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">
                Whether you&apos;re looking for your next opportunity or building
                your next team, start with a conversation.
              </p>

              <Link
                href="/contact-us"
                className="group mt-8 inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-brand-600 px-7 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-500"
              >
                Start a conversation

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

            </div>

          </div>

        </Reveal>

      </section>

    </div>
  );
}