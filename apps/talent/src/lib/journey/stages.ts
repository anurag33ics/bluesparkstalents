import { stageKeys, type StageKey, type StageStatus } from "./types";

export type StageMeta = {
  key: StageKey;
  step: number;
  title: string;
  shortTitle: string;
  description: string;
  href: string;
  /** The stage that must be completed first. The API enforces this; the UI only explains it. */
  requires: StageKey | null;
  actionLabels: Record<StageStatus, string>;
};

export const stages: Record<StageKey, StageMeta> = {
  profile: {
    key: "profile",
    step: 1,
    title: "Create Account & Complete Profile",
    shortTitle: "Profile",
    description:
      "Candidate registration, personal details, skills, resume, education, and work experience.",
    href: "/profile",
    requires: null,
    actionLabels: {
      pending: "Complete profile",
      in_progress: "Continue profile",
      action_required: "Update profile",
      blocked: "View profile",
      completed: "View profile",
    },
  },
  plan: {
    key: "plan",
    step: 2,
    title: "Plan & Payment",
    shortTitle: "Plan",
    description: "Review the service plan and complete payment.",
    href: "/plans",
    requires: "profile",
    actionLabels: {
      pending: "View plan",
      in_progress: "Check payment status",
      action_required: "Make payment",
      blocked: "View plan",
      completed: "View plan & invoices",
    },
  },
  verification: {
    key: "verification",
    step: 3,
    title: "Profile Verification & Approval",
    shortTitle: "Verification",
    description: "Validate candidate details, resume, skills, and identity where required.",
    href: "/verification",
    requires: "plan",
    actionLabels: {
      pending: "Verify profile",
      in_progress: "View verification status",
      action_required: "Fix and resubmit",
      blocked: "View feedback",
      completed: "View verification",
    },
  },
  ai_interview: {
    key: "ai_interview",
    step: 4,
    title: "AI-Based Mock Interview",
    shortTitle: "AI interview",
    description: "Assess skills, communication, technical knowledge, and interview readiness.",
    href: "/ai-interview",
    requires: "verification",
    actionLabels: {
      pending: "Start AI interview",
      in_progress: "Resume AI interview",
      action_required: "Retake AI interview",
      blocked: "View AI interview",
      completed: "View AI report",
    },
  },
  expert_interview: {
    key: "expert_interview",
    step: 5,
    title: "Schedule & Attend One-to-One Interview",
    shortTitle: "Expert interview",
    description: "Book a time slot with an interviewer or career expert and receive feedback.",
    href: "/interview",
    requires: "ai_interview",
    actionLabels: {
      pending: "Schedule interview",
      in_progress: "View interview details",
      action_required: "Reschedule interview",
      blocked: "View interview",
      completed: "View feedback",
    },
  },
  listing: {
    key: "listing",
    step: 6,
    title: "Get Listed on the Hiring Portal",
    shortTitle: "Listing",
    description:
      "Publish the approved candidate profile for employers and recruiters to discover, subject to candidate consent.",
    href: "/listing",
    requires: "expert_interview",
    actionLabels: {
      pending: "Request listing",
      in_progress: "View listing status",
      action_required: "Update listing",
      blocked: "View listing",
      completed: "Manage listing",
    },
  },
  hiring: {
    key: "hiring",
    step: 7,
    title: "Get Shortlisted & Hired",
    shortTitle: "Hiring",
    description: "Track employer interest, interview rounds, offers, and final hiring status.",
    href: "/hiring",
    requires: "listing",
    actionLabels: {
      pending: "View hiring status",
      in_progress: "View hiring status",
      action_required: "Respond to recruiters",
      blocked: "View hiring status",
      completed: "View hiring status",
    },
  },
};

export const stageList: StageMeta[] = stageKeys.map((key) => stages[key]);

export const stageCount = stageList.length;
