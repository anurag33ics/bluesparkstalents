import type { StageKey } from "@/lib/journey/types";

/*
 * Identity colours for icon tiles. Each step keeps the same hue everywhere so it
 * is recognisable at a glance; the step name is always shown too, so colour is
 * never the only cue. Status colours (emerald, amber, red) are kept separate.
 */

export type Accent = "violet" | "sky" | "teal" | "indigo" | "fuchsia" | "cyan" | "gold" | "blue";

export const accentTile: Record<Accent, string> = {
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  sky: "bg-sky-50 text-sky-600 ring-sky-100",
  teal: "bg-teal-50 text-teal-600 ring-teal-100",
  indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
  fuchsia: "bg-fuchsia-50 text-fuchsia-600 ring-fuchsia-100",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-100",
  gold: "bg-gold-50 text-gold-600 ring-gold-100",
  blue: "bg-brand-50 text-brand-600 ring-brand-100",
};

export const stageAccent: Record<StageKey, Accent> = {
  profile: "violet",
  plan: "sky",
  verification: "teal",
  ai_interview: "indigo",
  expert_interview: "fuchsia",
  listing: "cyan",
  hiring: "gold",
};
