import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  MessageSquareText,
  Sparkles,
  UserRound,
} from "lucide-react";
import { ContactEnquiryForm } from "@/components/contact/contact-enquiry-form";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Contact Us | Bluespark Talents",
  description:
    "Talk with the Bluespark Talents team about verified talent, your next opportunity, or a quality-first hiring partnership.",
};

const pathways = [
  {
    icon: Building2,
    title: "For hiring teams",
    description: "Share your brief and discover a more focused way to meet verified talent.",
  },
  {
    icon: UserRound,
    title: "For candidates",
    description: "Get clarity on registration, screening, and your next best opportunity.",
  },
  {
    icon: MessageSquareText,
    title: "For partnerships",
    description: "Have an idea, referral, or collaboration in mind? We would love to hear it.",
  },
];

const expectations = [
  "A real response from our team",
  "A focused conversation, not a sales script",
  "Clear next steps after we connect",
];

export default function ContactUsPage() {
  return (
    <div className="overflow-hidden bg-white">
      <section className="relative overflow-hidden bg-white">

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-18 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-8 lg:py-28">
          <Reveal className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 shadow-sm">
              <Sparkles className="h-4 w-4 text-brand-600" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Contact Bluespark Talents</span>
            </div>
            <h1 className="mt-7 max-w-3xl font-heading text-5xl font-medium leading-[0.96] tracking-tight text-brand-950 sm:text-6xl lg:text-7xl">
              The right conversation can change the direction of a career or a company.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-[#536888] sm:text-lg">
              Tell us what you are working toward. Whether you are hiring, looking for a role, or exploring a partnership, our team is ready to help you take the next thoughtful step.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#enquiry" className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-500">
                Send a message
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="mailto:support@bluesparkstalents.com" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white px-6 text-sm font-semibold text-brand-950 transition-all duration-300 hover:border-brand-500/50 hover:bg-white">
                Email our team
                <ArrowUpRight className="h-4 w-4 text-brand-700" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={140} className="relative lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:ml-auto">
              <div className="absolute -right-5 top-8 h-24 w-24 rounded-3xl border-2 border-brand-100 sm:-right-9" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl shadow-brand-500/15">
                <Image src="/assets/images/contact-us.jpg" alt="A friendly Bluespark Talents team member" fill priority sizes="(min-width: 1024px) 32rem, 90vw" className="object-cover" />
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white bg-white/85 p-4 shadow-sm backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white"><Mail className="h-5 w-5" /></span>
                    <div>
                      <p className="text-sm font-bold text-brand-950">support@bluesparkstalents.com</p>
                      <p className="mt-0.5 text-xs text-[#536888]">A direct line to our team.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-4 rounded-2xl bg-white px-5 py-4 shadow-xl sm:-left-10">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-brand-600" />
                  <div>
                    <p className="text-sm font-bold text-brand-950">Thoughtful replies</p>
                    <p className="text-xs text-[#536888]">We respect your time.</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-white py-22 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Choose your starting point</span>
            <h2 className="mt-4 font-heading text-4xl font-medium tracking-tight text-brand-950 sm:text-5xl">One team. Three ways we can help.</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {pathways.map((pathway, index) => {
              const Icon = pathway.icon;
              return (
                <Reveal key={pathway.title} delay={index * 100}>
                  <article className="group h-full rounded-[1.75rem] border border-brand-100 bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:border-brand-300 hover:bg-white hover:shadow-xl hover:shadow-brand-500/10">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition-all duration-500 group-hover:bg-brand-500 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-8 font-heading text-2xl font-medium tracking-tight text-brand-950 transition-colors duration-500">{pathway.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#536888] transition-colors duration-500">{pathway.description}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="enquiry" className="relative overflow-hidden bg-white py-22 scroll-mt-20 sm:py-28">
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:items-start lg:gap-16 lg:px-8">
          <Reveal className="lg:col-span-5 lg:pt-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
              <MessageSquareText className="h-4 w-4" />
              Make your first move
            </div>
            <h2 className="mt-6 max-w-md font-heading text-4xl font-medium leading-[1.02] tracking-tight text-brand-950 sm:text-5xl">Tell us a little. We will take it from there.</h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#536888]">The more context you can share, the more useful our first reply will be. No pressure, no complicated process.</p>

            <div className="mt-9 space-y-4 border-t border-brand-200 pt-7">
              {expectations.map((expectation) => (
                <div key={expectation} className="flex items-center gap-3 text-sm font-medium text-brand-950/80">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600"><CheckCircle2 className="h-4 w-4" /></span>
                  {expectation}
                </div>
              ))}
            </div>

            <a href="mailto:support@bluesparkstalents.com" className="group mt-10 inline-flex items-center gap-2 text-sm font-bold text-brand-600">
              Prefer email? support@bluesparkstalents.com
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
          </Reveal>

          <Reveal delay={130} className="lg:col-span-7">
            <ContactEnquiryForm />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-brand-100 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <p className="font-heading text-xl font-medium text-brand-950">Not ready to talk yet?</p>
            <p className="mt-1 text-sm text-[#536888]">Explore how Bluespark Talents is raising the bar for recruitment.</p>
          </div>
          <Link href="/about-us" className="group inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-5 py-3 text-sm font-bold text-brand-950 transition-all duration-300 hover:border-brand-400 hover:bg-white">
            Meet Bluespark Talents
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}