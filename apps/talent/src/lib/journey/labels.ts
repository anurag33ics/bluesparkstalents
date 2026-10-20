import type {
  AiInterviewStatus,
  AvailabilityStatus,
  CheckStatus,
  ContactRequest,
  DocumentType,
  EmploymentType,
  ExperienceLevel,
  ExpertInterviewStatus,
  HiringStatus,
  JobType,
  ListingStatus,
  Offer,
  OpportunityStage,
  PaymentStatus,
  PersonalDetails,
  Recommendation,
  SkillLevel,
  StageStatus,
  VerificationStatus,
  WorkMode,
} from "./types";

/**
 * Tones map to the reserved status colours (see StatusBadge). They always ship
 * with an icon and a label, never colour alone.
 */
export type Tone = "neutral" | "info" | "success" | "warning" | "danger";

export type StatusLabel = { label: string; tone: Tone };

export const stageStatusLabels: Record<StageStatus, StatusLabel> = {
  pending: { label: "Pending", tone: "neutral" },
  in_progress: { label: "In progress", tone: "info" },
  completed: { label: "Completed", tone: "success" },
  action_required: { label: "Action required", tone: "warning" },
  blocked: { label: "Blocked", tone: "danger" },
};

export const hiringStatusLabels: Record<HiringStatus, StatusLabel> = {
  not_listed: { label: "Not listed yet", tone: "neutral" },
  available: { label: "Available", tone: "info" },
  shortlisted: { label: "Shortlisted", tone: "info" },
  interviewing: { label: "Interview in progress", tone: "info" },
  offer_received: { label: "Offer received", tone: "success" },
  hired: { label: "Hired", tone: "success" },
  not_selected: { label: "Not selected", tone: "neutral" },
};

export const verificationStatusLabels: Record<VerificationStatus, StatusLabel> = {
  not_started: { label: "Not started", tone: "neutral" },
  pending_review: { label: "Pending review", tone: "info" },
  changes_required: { label: "Changes required", tone: "warning" },
  verified: { label: "Verified", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
};

export const checkStatusLabels: Record<CheckStatus, StatusLabel> = {
  pending: { label: "Awaiting review", tone: "neutral" },
  approved: { label: "Approved", tone: "success" },
  changes_required: { label: "Changes required", tone: "warning" },
  rejected: { label: "Rejected", tone: "danger" },
};

export const paymentStatusLabels: Record<PaymentStatus, StatusLabel> = {
  created: { label: "Awaiting payment", tone: "neutral" },
  pending: { label: "Processing", tone: "info" },
  captured: { label: "Paid", tone: "success" },
  failed: { label: "Failed", tone: "danger" },
  refunded: { label: "Refunded", tone: "neutral" },
};

export const aiInterviewStatusLabels: Record<AiInterviewStatus, StatusLabel> = {
  in_progress: { label: "In progress", tone: "info" },
  evaluating: { label: "Evaluating", tone: "info" },
  completed: { label: "Completed", tone: "success" },
  failed: { label: "Failed", tone: "danger" },
};

export const expertInterviewStatusLabels: Record<ExpertInterviewStatus | "not_scheduled", StatusLabel> = {
  not_scheduled: { label: "Not scheduled", tone: "neutral" },
  scheduled: { label: "Scheduled", tone: "info" },
  rescheduled: { label: "Rescheduled", tone: "info" },
  completed: { label: "Completed", tone: "success" },
  cancelled: { label: "Cancelled", tone: "neutral" },
  no_show: { label: "Missed", tone: "danger" },
};

export const listingStatusLabels: Record<ListingStatus, StatusLabel> = {
  not_eligible: { label: "Not eligible yet", tone: "neutral" },
  ready: { label: "Ready to request", tone: "info" },
  pending_approval: { label: "Pending approval", tone: "info" },
  listed: { label: "Live on portal", tone: "success" },
  paused: { label: "Paused", tone: "warning" },
  rejected: { label: "Not approved", tone: "danger" },
};

export const opportunityStageLabels: Record<OpportunityStage, StatusLabel> = {
  shortlisted: { label: "Shortlisted", tone: "info" },
  interviewing: { label: "Interview in progress", tone: "info" },
  offer: { label: "Offer received", tone: "success" },
  hired: { label: "Hired", tone: "success" },
  not_selected: { label: "Not selected", tone: "neutral" },
  withdrawn: { label: "Withdrawn", tone: "neutral" },
};

export const offerStatusLabels: Record<Offer["status"], StatusLabel> = {
  pending: { label: "Awaiting your response", tone: "warning" },
  accepted: { label: "Accepted", tone: "success" },
  declined: { label: "Declined", tone: "neutral" },
  expired: { label: "Expired", tone: "neutral" },
};

export const contactRequestStatusLabels: Record<ContactRequest["status"], StatusLabel> = {
  pending: { label: "Awaiting your reply", tone: "warning" },
  shared: { label: "Details shared", tone: "success" },
  declined: { label: "Declined", tone: "neutral" },
};

export const availabilityLabels: Record<AvailabilityStatus, string> = {
  immediate: "Available immediately",
  notice_period: "Serving notice period",
  not_looking: "Not looking right now",
};

export const experienceLevelLabels: Record<ExperienceLevel, string> = {
  fresher: "Fresher (0-1 yrs)",
  junior: "Junior (1-3 yrs)",
  mid: "Mid-level (3-6 yrs)",
  senior: "Senior (6-10 yrs)",
  lead: "Lead (10+ yrs)",
};

export const recommendationLabels: Record<Recommendation, string> = {
  strong_yes: "Strongly recommended",
  yes: "Recommended",
  maybe: "Mixed signals",
  no: "Not recommended yet",
};

export const documentTypeLabels: Record<DocumentType, string> = {
  government_id: "Government ID",
  degree_certificate: "Degree certificate",
  experience_letter: "Experience letter",
  other: "Other document",
};

export const employmentTypeLabels: Record<EmploymentType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
  freelance: "Freelance",
};

export const jobTypeLabels: Record<JobType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
};

export const workModeLabels: Record<WorkMode, string> = {
  onsite: "On-site",
  hybrid: "Hybrid",
  remote: "Remote",
};

export const skillLevelLabels: Record<SkillLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

export const genderLabels: Record<NonNullable<PersonalDetails["gender"]>, string> = {
  female: "Female",
  male: "Male",
  non_binary: "Non-binary",
  prefer_not_to_say: "Prefer not to say",
};
