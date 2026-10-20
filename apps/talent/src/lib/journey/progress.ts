import { stages } from "./stages";
import type { Journey, StageKey, StageSummary } from "./types";

export type JourneyProgress = {
  completed: number;
  total: number;
  /** Derived from completed stages only, never stored or hand-set. */
  percent: number;
  /** First stage that isn't completed, or null once every stage is done. */
  current: StageSummary | null;
};

export function journeyProgress(journey: Journey): JourneyProgress {
  const total = journey.stages.length;
  const completed = journey.stages.filter((stage) => stage.status === "completed").length;

  return {
    completed,
    total,
    percent: total ? Math.round((completed / total) * 100) : 0,
    current: journey.stages.find((stage) => stage.status !== "completed") ?? null,
  };
}

export function findStage(journey: Journey, key: StageKey): StageSummary | undefined {
  return journey.stages.find((stage) => stage.key === key);
}

export function primaryAction(current: StageSummary | null): { label: string; href: string } {
  if (!current) return { label: "View hiring status", href: stages.hiring.href };

  const meta = stages[current.key];
  return { label: meta.actionLabels[current.status], href: meta.href };
}
