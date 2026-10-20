import Link from "next/link";
import { BriefcaseBusiness, Crown, Sparkles } from "lucide-react";
import { cn } from "cn";
import { IconTile } from "@/components/journey/layout";
import { StatusBadge } from "@/components/journey/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { hiringStatusLabels } from "@/lib/journey/labels";
import type { HiringStatus } from "@/lib/journey/types";

const cardClass =
  "flex items-center gap-3 rounded-2xl border border-black/6 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(11,21,51,0.04),0_8px_24px_-12px_rgba(11,21,51,0.12)]";

export function WelcomeHeader({
  name,
  hiringStatus,
  planName,
}: {
  name: string;
  hiringStatus: HiringStatus | null;
  planName: string | null;
}) {
  return (
    <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
          <Sparkles className="size-3.5" aria-hidden />
          Candidate dashboard
        </p>
        <h1 className="mt-3 font-heading text-4xl font-medium tracking-tight text-ink-950 sm:text-5xl">
          Welcome back, <span className="text-brand-600">{name}</span>
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
          Here&apos;s where you are on your way to getting hired.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {hiringStatus && (
          <div className={cardClass}>
            <IconTile icon={BriefcaseBusiness} accent="teal" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Hiring status</p>
              <StatusBadge status={hiringStatusLabels[hiringStatus]} className="mt-1" />
            </div>
          </div>
        )}

        <div className={cardClass}>
          <IconTile icon={Crown} accent="gold" />
          <div className="mr-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Current plan</p>
            <p className="mt-0.5 font-heading text-lg font-medium text-ink-950">{planName ?? "None yet"}</p>
          </div>
          <Link href="/plans" className={cn(buttonVariants({ variant: "brand", size: "cta-sm" }), "ml-auto")}>
            {planName ? "View plan" : "Get plan"}
          </Link>
        </div>
      </div>
    </section>
  );
}
