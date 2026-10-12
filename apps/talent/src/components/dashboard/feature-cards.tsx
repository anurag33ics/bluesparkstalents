import Link from "next/link";
import { ArrowRight, BellRing, Bot, Headphones } from "lucide-react";

export function FeatureCards() {
  return (
    <section aria-label="Featured" className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">

      {/* AI interview coach */}
      <div className="relative">
        <span className="absolute -top-2.5 left-6 z-10 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
          New
        </span>

        <div className="relative flex h-full flex-col gap-5 overflow-hidden rounded-3xl bg-linear-to-br from-brand-600 to-brand-800 p-6 text-white shadow-xl shadow-brand-600/20 sm:flex-row sm:items-center sm:p-7">
          <div className="pointer-events-none absolute -right-12 -top-16 size-48 rounded-full bg-white/10" />

          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 ring-8 ring-white/15">
            <Bot className="size-8" strokeWidth={1.8} />
          </span>

          <div className="relative flex-1">
            <h2 className="font-heading text-xl font-medium">
              Practise with your AI Interview Coach
              <Headphones className="ml-2 inline size-5 align-[-3px]" aria-hidden />
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/80">
              Run realistic mock interviews any time, 24x7, and get instant, structured feedback on every answer.
            </p>
          </div>

          <Link href="/ai-interview" className="relative inline-flex shrink-0 items-center justify-center self-start rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-brand-700 shadow-lg shadow-brand-950/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-50 sm:self-center">
            Start interview
          </Link>
        </div>
      </div>

      {/* Webinar series */}
      <div className="relative flex flex-col gap-5 overflow-hidden rounded-3xl bg-brand-900 p-6 text-white shadow-xl shadow-brand-900/20 sm:flex-row sm:items-center sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-14 size-44 rounded-full bg-brand-600/30" />

        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20">
          <BellRing className="size-6" />
        </span>

        <div className="relative flex-1">
          <h2 className="font-heading text-xl font-medium">Join the Webinar Series</h2>
          <p className="mt-2 text-sm leading-6 text-white/75">
            Expert-led live sessions to help you plan your next move with clarity.
          </p>
        </div>

        <Link href="/webinars" className="group relative inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-brand-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-50 sm:self-center">
          View series
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>

    </section>
  );
}
