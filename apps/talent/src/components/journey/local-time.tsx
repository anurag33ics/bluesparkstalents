"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False during SSR and hydration, true once running in the browser. */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

const presets = {
  date: { day: "numeric", month: "short", year: "numeric" },
  datetime: { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" },
  time: { hour: "numeric", minute: "2-digit" },
  long: { weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit", timeZoneName: "short" },
  day: { weekday: "short", day: "numeric", month: "short" },
  month: { month: "short" },
  dayOfMonth: { day: "numeric" },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

export type TimeFormat = keyof typeof presets;

export function formatLocal(value: string, format: TimeFormat, timeZone?: string) {
  return new Intl.DateTimeFormat("en-IN", { ...presets[format], timeZone }).format(new Date(value));
}

export function localTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Renders a timestamp in the viewer's own time zone. The server doesn't know
 * it, so the first paint uses UTC and the browser swaps in local time.
 */
export function LocalTime({
  value,
  format = "datetime",
  className,
}: {
  value: string;
  format?: TimeFormat;
  className?: string;
}) {
  const hydrated = useHydrated();
  const text = formatLocal(value, format, hydrated ? undefined : "UTC");

  return (
    <time dateTime={value} className={className}>
      {text}
      {!hydrated && (format === "datetime" || format === "time") && " UTC"}
    </time>
  );
}
