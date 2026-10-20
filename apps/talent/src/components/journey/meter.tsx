import { cn } from "cn";

/*
 * Meters: a single ratio against a limit, drawn on a same-ramp track. Values
 * are always printed as text beside the mark, in text ink.
 */

export function Meter({
  value,
  max = 100,
  label,
  valueLabel,
  className,
  size = "md",
}: {
  value: number;
  max?: number;
  label: string;
  valueLabel?: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const percent = max ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-brand-950">{label}</span>
        <span className="font-semibold tabular-nums text-brand-950">{valueLabel ?? `${Math.round(value)}/${max}`}</span>
      </div>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={valueLabel}
        className={cn("overflow-hidden rounded-full bg-viz-track", size === "sm" ? "h-1.5" : "h-2")}
      >
        <div className="h-full rounded-full bg-viz-stage-2 transition-[width] duration-700" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function ProgressRing({
  value,
  label,
  size = 64,
  strokeWidth = 6,
  className,
  trackClassName = "stroke-viz-track",
  indicatorClassName = "stroke-viz-stage-2",
  children,
}: {
  /** 0-100 */
  value: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  trackClassName?: string;
  indicatorClassName?: string;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="size-full -rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} className={trackClassName} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
          className={cn(indicatorClassName, "transition-[stroke-dashoffset] duration-700")}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children ?? <span className="text-sm font-bold tabular-nums text-brand-950">{Math.round(clamped)}%</span>}
      </div>
    </div>
  );
}
