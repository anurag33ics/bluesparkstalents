import { Info } from "lucide-react";
import { cn } from "cn";

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <p className={cn("flex gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm leading-6 text-brand-950", className)}>
      <Info className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden />
      <span>
        <span className="font-semibold">This is an AI assessment for practice.</span> Scores and feedback are generated automatically.
        They aren&apos;t a hiring decision and don&apos;t guarantee any outcome with recruiters.
      </span>
    </p>
  );
}
