"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "cn";
import { publicPath } from "@/lib/base-path";

const slides = [
  {
    title: "Plan your journey from campus to career",
    description:
      "Talk to expert counsellors, practise interviews and map out the path to your dream role, one milestone at a time.",
    cta: "Book a session",
    href: "/counselling",
    image: "/assets/images/banner.png",
    cover: true,
  },
  {
    title: "Evaluate and improve your profile",
    description:
      "Review your profile and strengthen it with our resources to improve your chances with top recruiters.",
    cta: "Learn more",
    href: "/profile",
    image: "/assets/images/report.png",
    cover: false,
  },
  {
    title: "Practise interviews with AI, anytime",
    description:
      "Rehearse common questions, get structured feedback and walk into every screening interview with confidence.",
    cta: "Try it now",
    href: "/ai-interview",
    image: "/assets/images/ai-interview.png",
    cover: false,
  },
];

const intervalMs = 6000;

export function BannerCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Restart the timer whenever the slide changes so a manual pick gets a full interval.
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), intervalMs);
    return () => window.clearTimeout(id);
  }, [index, paused]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm shadow-brand-500/5">
        <div
          className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.href}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              aria-hidden={i !== index}
              inert={i !== index}
              className="grid w-full shrink-0 bg-linear-to-r from-white via-white to-brand-50 md:grid-cols-[1.1fr_1fr]"
            >
              <div className="flex flex-col justify-center p-6 sm:p-10">
                <h2 className="font-heading text-2xl font-medium leading-tight tracking-tight text-brand-950 sm:text-3xl lg:text-4xl">
                  {slide.title}
                </h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                  {slide.description}
                </p>
                <Link href={slide.href} className="group mt-7 inline-flex items-center gap-2 self-start rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-500">
                  {slide.cta}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="relative h-56 sm:h-72">
                <Image
                  src={publicPath(slide.image)}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 520px, (min-width: 768px) 45vw, 100vw"
                  loading={i === 0 ? "eager" : "lazy"}
                  className={cn(
                    "mix-blend-multiply",
                    slide.cover ? "object-cover" : "object-contain p-4"
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide dots */}
      <div className="mt-4 flex justify-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.href}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              "h-2 rounded-full outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand-500/50",
              i === index ? "w-6 bg-brand-600" : "w-2 bg-brand-200 hover:bg-brand-300"
            )}
          />
        ))}
      </div>
    </section>
  );
}
