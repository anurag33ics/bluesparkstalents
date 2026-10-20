import type { Metadata } from "next";
import { ApiErrorState } from "@/components/journey/api-error-state";
import { StageFrame } from "@/components/journey/stage-frame";
import { ProfileEditor, type ProfileView } from "@/components/profile/profile-editor";
import { getJourney, getProfile } from "@/lib/api/candidate";
import { profileCompletion } from "@/lib/journey/profile";
import { findStage } from "@/lib/journey/progress";
import { profileSectionKeys } from "@/lib/journey/types";

export const metadata: Metadata = {
  title: "Profile",
};

function isView(value: unknown): value is ProfileView {
  return value === "review" || (typeof value === "string" && (profileSectionKeys as readonly string[]).includes(value));
}

export default async function ProfilePage({ searchParams }: PageProps<"/profile">) {
  const [{ section }, journey, profile] = await Promise.all([searchParams, getJourney(), getProfile()]);
  const stage = journey.ok ? findStage(journey.data, "profile") : undefined;

  // Without a section in the URL, open the first incomplete one, or the review once everything is filled in.
  const fallback = (profile.ok && profileCompletion(profile.data).incomplete[0]) || (stage?.status === "completed" ? "personal" : "review");

  return (
    <StageFrame stageKey="profile" journey={journey}>
      {!profile.ok ? (
        <ApiErrorState error={profile.error} />
      ) : (
        stage && <ProfileEditor profile={profile.data} stage={stage} active={isView(section) ? section : fallback} />
      )}
    </StageFrame>
  );
}
