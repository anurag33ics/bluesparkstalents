import { CloudOff, KeyRound, LockKeyhole, SearchX, ServerCrash, Unplug, type LucideIcon } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { signInUrl, supportEmail } from "@/lib/config";
import type { ApiErrorKind, ApiFailure } from "@/lib/api/result";
import { RetryButton } from "./retry-button";

const copy: Partial<Record<ApiErrorKind, { title: string; icon: LucideIcon }>> = {
  unconfigured: { title: "Service unavailable", icon: Unplug },
  network: { title: "We can't reach our servers", icon: CloudOff },
  unauthorized: { title: "Please sign in again", icon: KeyRound },
  forbidden: { title: "You don't have access to this", icon: LockKeyhole },
  not_found: { title: "Not found", icon: SearchX },
};

/** Full-panel state for a failed read. Every page renders this instead of crashing. */
export function ApiErrorState({
  error,
  className,
  compact = false,
}: {
  error: ApiFailure;
  className?: string;
  compact?: boolean;
}) {
  const { title, icon: Icon } = copy[error.kind] ?? { title: "Something went wrong", icon: ServerCrash };
  const retryable = error.kind === "network" || error.kind === "server" || error.kind === "rate_limited";

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center rounded-3xl border border-brand-100 bg-white text-center shadow-sm shadow-brand-500/5",
        compact ? "px-5 py-6" : "px-6 py-12 sm:py-16",
        className
      )}
    >
      <span className={cn("flex items-center justify-center rounded-2xl bg-brand-50 text-brand-600", compact ? "size-10" : "size-14")}>
        <Icon className={compact ? "size-5" : "size-7"} strokeWidth={1.8} aria-hidden />
      </span>
      <p className={cn("font-heading font-medium text-brand-950", compact ? "mt-3 text-base" : "mt-5 text-xl")}>{title}</p>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{error.message}</p>
      {error.kind === "unconfigured" && !compact && (
        <p className="mt-2 max-w-md text-xs leading-5 text-muted-foreground">
          Your progress is safe. If this keeps happening, email{" "}
          <a href={`mailto:${supportEmail}`} className="font-semibold text-brand-700 hover:underline">
            {supportEmail}
          </a>
          .
        </p>
      )}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {retryable && <RetryButton />}
        {error.kind === "unauthorized" && (
          <a href={signInUrl} className={buttonVariants({ variant: "brand", size: "cta" })}>
            Sign in
          </a>
        )}
      </div>
    </div>
  );
}
