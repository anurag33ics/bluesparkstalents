import type { Metadata } from "next";
import { ApiErrorState } from "@/components/journey/api-error-state";
import { StageFrame } from "@/components/journey/stage-frame";
import { PlansView } from "@/components/plans/plans-view";
import { getBilling, getJourney } from "@/lib/api/candidate";

export const metadata: Metadata = {
  title: "Plans & payment",
};

export default async function PlansPage() {
  const [journey, billing] = await Promise.all([getJourney(), getBilling()]);

  return (
    <StageFrame stageKey="plan" journey={journey}>
      {billing.ok ? <PlansView billing={billing.data} /> : <ApiErrorState error={billing.error} />}
    </StageFrame>
  );
}
