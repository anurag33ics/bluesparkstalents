import "server-only";
import { cache } from "react";
import { apiRequest } from "./client";
import type {
  AvailabilitySlot,
  Interviewer,
  InterviewerAssignment,
  ListingStatus,
  RecruiterCandidateView,
  ReviewQueueItem,
  StaffCandidate,
  TalentSearchQuery,
  TalentSearchResult,
  VerificationStatus,
} from "@/lib/journey/types";

/*
 * Staff reads. The API checks the caller's role on every endpoint; the staff
 * screens hide what a role can't use, but that is presentation only.
 */

export const getVerificationQueue = cache((status: VerificationStatus) =>
  apiRequest<ReviewQueueItem[]>("/staff/verifications", { query: { status } })
);

export const getListingQueue = cache((status: ListingStatus) =>
  apiRequest<ReviewQueueItem[]>("/staff/listings", { query: { status } })
);

export const getStaffCandidate = cache((candidateId: string) =>
  apiRequest<StaffCandidate>(`/staff/candidates/${encodeURIComponent(candidateId)}`)
);

export const getInterviewers = cache(() => apiRequest<Interviewer[]>("/staff/interviewers"));

export const getMyAvailability = cache((from: string, to: string) =>
  apiRequest<AvailabilitySlot[]>("/staff/me/availability", { query: { from, to } })
);

export const getMyAssignments = cache(() => apiRequest<InterviewerAssignment[]>("/staff/me/interviews"));

export function searchTalent(query: TalentSearchQuery) {
  return apiRequest<TalentSearchResult>("/staff/talent", { query });
}

export const getTalentProfile = cache((candidateId: string) =>
  apiRequest<RecruiterCandidateView>(`/staff/talent/${encodeURIComponent(candidateId)}`)
);
