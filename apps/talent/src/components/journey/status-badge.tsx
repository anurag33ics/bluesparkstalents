import { Ban, CircleAlert, CircleCheck, CircleDashed, Loader, type LucideIcon } from "lucide-react";
import { cn } from "cn";
import type { StatusLabel, Tone } from "@/lib/journey/labels";

export const toneStyles: Record<Tone, { badge: string; icon: LucideIcon; text: string; surface: string }> = {
  neutral: {
    badge: "border-slate-200 bg-slate-50 text-slate-700",
    icon: CircleDashed,
    text: "text-slate-600",
    surface: "border-slate-200 bg-slate-50",
  },
  info: {
    badge: "border-brand-200 bg-brand-50 text-brand-800",
    icon: Loader,
    text: "text-brand-700",
    surface: "border-brand-200 bg-brand-50",
  },
  success: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-800",
    icon: CircleCheck,
    text: "text-emerald-700",
    surface: "border-emerald-200 bg-emerald-50",
  },
  warning: {
    badge: "border-amber-200 bg-amber-50 text-amber-900",
    icon: CircleAlert,
    text: "text-amber-800",
    surface: "border-amber-200 bg-amber-50",
  },
  danger: {
    badge: "border-red-200 bg-red-50 text-red-800",
    icon: Ban,
    text: "text-red-700",
    surface: "border-red-200 bg-red-50",
  },
};

/** Status is always an icon plus a label, never colour alone. */
export function StatusBadge({
  status,
  size = "sm",
  className,
}: {
  status: StatusLabel;
  size?: "sm" | "md";
  className?: string;
}) {
  const style = toneStyles[status.tone];
  const Icon = style.icon;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border font-semibold whitespace-nowrap",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        style.badge,
        className
      )}
    >
      <Icon className={size === "sm" ? "size-3.5" : "size-4"} aria-hidden />
      {status.label}
    </span>
  );
}
