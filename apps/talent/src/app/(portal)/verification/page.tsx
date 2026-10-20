import type { Metadata } from "next";
import { ApiErrorState } from "@/components/journey/api-error-state";
import { StageFrame } from "@/components/journey/stage-frame";
import { VerificationView } from "@/components/verification/verification-view";
import { getJourney, getVerification } from "@/lib/api/candidate";

export const metadata: Metadata = {
  title: "Profile verification",
};

export default async function VerificationPage() {
  const [journey, verification] = await Promise.all([getJourney(), getVerification()]);

  return (
    <StageFrame stageKey="verification" journey={journey}>
      {verification.ok ? <VerificationView verification={verification.data} /> : <ApiErrorState error={verification.error} />}
    </StageFrame>
  );
}
