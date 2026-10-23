import "server-only";
import { cache } from "react";
import { apiRequest } from "./client";
import type {
  AccountSettings,
  AiInterviewOverview,
  AiInterviewSession,
  Billing,
  CandidateProfile,
  CurrentUser,
  ExpertInterviewOverview,
  Hiring,
  InterviewSlot,
  Journey,
  Listing,
  NotificationFeed,
  Verification,
} from "@/lib/journey/types";

/*
 * Candidate reads. Wrapped in React `cache` so a layout and page asking for the
 * same resource in one request share a single API call.
 */

export const getCurrentUser = cache(() => apiRequest<CurrentUser>("/me"));

export const getJourney = cache(() => apiRequest<Journey>("/me/journey"));

export const getProfile = cache(() => apiRequest<CandidateProfile>("/me/profile"));

export const getBilling = cache(() => apiRequest<Billing>("/me/billing"));

export const getVerification = cache(() => apiRequest<Verification>("/me/verification"));

export const getAiInterviews = cache(() => apiRequest<AiInterviewOverview>("/me/ai-interviews"));

export const getAiInterview = cache((sessionId: string) =>
  apiRequest<AiInterviewSession>(`/me/ai-interviews/${encodeURIComponent(sessionId)}`)
);

export const getExpertInterviews = cache(() => apiRequest<ExpertInterviewOverview>("/me/interviews"));

export const getInterviewSlots = cache((from: string, to: string) =>
  apiRequest<InterviewSlot[]>("/me/interview-slots", { query: { from, to } })
);

export const getListing = cache(() => apiRequest<Listing>("/me/listing"));

export const getHiring = cache(() => apiRequest<Hiring>("/me/hiring"));

export const getNotifications = cache((limit: number) =>
  apiRequest<NotificationFeed>("/me/notifications", { query: { limit } })
);

export const getSettings = cache(() => apiRequest<AccountSettings>("/me/settings"));
