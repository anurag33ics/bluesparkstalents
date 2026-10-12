"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export function ParallaxImage({
  speed = 0.15,
  wrapperClassName,
  className,
  alt,
  ...props
}: ImageProps & { speed?: number; wrapperClassName?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const update = () => {
      const el = wrapperRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const viewportH = window.innerHeight;
        const progress = (rect.top + rect.height / 2 - viewportH / 2) / viewportH;
        const clamped = Math.max(-1, Math.min(1, progress));
        setOffset(clamped * speed * 100);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return (
    <div
      ref={wrapperRef}
      className={cn("absolute inset-0 overflow-hidden", wrapperClassName)}
    >
      <div
        style={{ transform: `translate3d(0, ${offset}px, 0)` }}
        className="absolute -inset-y-[8%] inset-x-0"
      >
        <Image
          fill
          alt={alt}
          className={cn("object-cover", className)}
          {...props}
        />
      </div>
    </div>
  );
}
