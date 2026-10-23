import "server-only";
import { cookies } from "next/headers";
import { failure, type ApiResult } from "./result";
import type {
  AccountSettings,
  AiInterviewOverview,
  AiInterviewReport,
  AiInterviewSession,
  AiInterviewSummary,
  AvailabilitySlot,
  Billing,
  CandidateProfile,
  CurrentUser,
  ExpertInterview,
  ExpertInterviewOverview,
  Hiring,
  Interviewer,
  InterviewerAssignment,
  InterviewerSummary,
  InterviewSlot,
  Journey,
  Listing,
  ListingVisibility,
  NotificationFeed,
  PublicProfile,
  RecruiterCandidateView,
  ReviewQueueItem,
  StaffCandidate,
  StageKey,
  StageSummary,
  TalentCard,
  TalentSearchResult,
  Verification,
} from "@/lib/journey/types";

/*
 * PREVIEW DATA - development only.
 *
 * Used when API_URL is unset and API_PREVIEW=true (never in production), so the
 * screens can be reviewed before apps/api exists. Every write is refused. Pick a
 * scenario by setting the `bs_preview_scenario` cookie to one of the keys below
 * (defaults to "midway"). Delete this file once the API is live.
 */

export const previewScenarios = {
  new: "New candidate",
  action_required: "Changes requested",
  midway: "Interview booked",
  listed: "Listed & interviewing",
} as const;

export type PreviewScenario = keyof typeof previewScenarios;

export const previewScenarioCookie = "bs_preview_scenario";

export async function currentPreviewScenario(): Promise<PreviewScenario> {
  const value = (await cookies()).get(previewScenarioCookie)?.value;
  return value && value in previewScenarios ? (value as PreviewScenario) : "midway";
}

export async function previewRequest<T>(
  method: string,
  path: string,
  query: Record<string, unknown>
): Promise<ApiResult<T>> {
  if (method !== "GET") {
    return failure("preview", "Preview mode: changes aren't saved. Connect the API (API_URL) to make this work.");
  }

  const data = resolve(await currentPreviewScenario(), path, query);
  if (data === undefined) return failure("not_found", "We couldn't find what you were looking for.");
  return { ok: true, data: structuredClone(data) as T };
}

/* ----------------------------------------------------------------------------
 * Router
 * ------------------------------------------------------------------------- */

function resolve(scenario: PreviewScenario, path: string, query: Record<string, unknown>): unknown {
  const at = clock();
  const [, scope, resource, id] = path.split("/");

  if (scope === "me") {
    switch (resource) {
      case undefined:
        return user;
      case "journey":
        return journey(scenario);
      case "profile":
        return profile(scenario, at);
      case "billing":
        return billing(scenario, at);
      case "verification":
        return verification(scenario, at);
      case "ai-interviews":
        return id ? aiSessions(at).find((session) => session.id === id) : aiOverview(scenario, at);
      case "interviews":
        return expertInterviews(scenario, at);
      case "interview-slots":
        return interviewSlots(at);
      case "listing":
        return listing(scenario, at);
      case "hiring":
        return hiring(scenario, at);
      case "notifications":
        return notifications(scenario, at);
      case "settings":
        return settings(scenario, at);
    }
  }

  if (scope === "staff") {
    switch (resource) {
      case "verifications":
        return reviewQueue(at).filter((item) => !query.status || item.verificationStatus === query.status);
      case "listings":
        return reviewQueue(at).filter((item) => !query.status || item.listingStatus === query.status);
      case "candidates":
        return staffCandidate(id, at);
      case "interviewers":
        return interviewers;
      case "me":
        return id === "availability" ? myAvailability(at) : myAssignments(at);
      case "talent":
        return id ? talentProfile(id, at) : talentSearch(query, at);
    }
  }

  return undefined;
}

/* ----------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------- */

function clock() {
  const now = Date.now();
  const hour = 60 * 60 * 1000;
  return {
    ago: (hours: number) => new Date(now - hours * hour).toISOString(),
    ahead: (hours: number) => new Date(now + hours * hour).toISOString(),
    dateAhead: (days: number) => new Date(now + days * 24 * hour).toISOString().slice(0, 10),
  };
}

type Clock = ReturnType<typeof clock>;

const rank: Record<PreviewScenario, number> = { new: 0, action_required: 1, midway: 2, listed: 3 };

function stage(key: StageKey, status: StageSummary["status"], extra: Partial<StageSummary> = {}): StageSummary {
  return { key, status, locked: false, detail: null, note: null, completedAt: null, updatedAt: null, ...extra };
}

const locked = (key: StageKey) => stage(key, "pending", { locked: true });

/* ----------------------------------------------------------------------------
 * Candidate
 * ------------------------------------------------------------------------- */

const user: CurrentUser = {
  id: "cand_preview",
  firstName: "Khushee",
  lastName: "Sharma",
  email: "khushee@example.com",
  roles: ["candidate", "admin", "interviewer", "recruiter"],
};

function journey(scenario: PreviewScenario): Journey {
  const at = clock();
  const done = (key: StageKey, daysAgo: number, detail: string | null = null) =>
    stage(key, "completed", { detail, completedAt: at.ago(daysAgo * 24), updatedAt: at.ago(daysAgo * 24) });

  const byScenario: Record<PreviewScenario, StageSummary[]> = {
    new: [
      stage("profile", "in_progress", { detail: "3 of 7 sections complete", updatedAt: at.ago(2) }),
      locked("plan"),
      locked("verification"),
      locked("ai_interview"),
      locked("expert_interview"),
      locked("listing"),
      locked("hiring"),
    ],
    action_required: [
      done("profile", 6),
      done("plan", 5, "Career Pro"),
      stage("verification", "action_required", {
        detail: "Changes required",
        note: "Your reviewer asked you to fix your resume dates and add a degree certificate.",
        updatedAt: at.ago(20),
      }),
      locked("ai_interview"),
      locked("expert_interview"),
      locked("listing"),
      locked("hiring"),
    ],
    midway: [
      done("profile", 24),
      done("plan", 23, "Career Pro"),
      done("verification", 12, "Verified"),
      done("ai_interview", 4, "Score 78/100"),
      stage("expert_interview", "in_progress", { detail: "Scheduled", updatedAt: at.ago(30) }),
      locked("listing"),
      locked("hiring"),
    ],
    listed: [
      done("profile", 40),
      done("plan", 39, "Career Pro"),
      done("verification", 30, "Verified"),
      done("ai_interview", 22, "Score 78/100"),
      done("expert_interview", 14, "Recommended"),
      done("listing", 6, "Live on portal"),
      stage("hiring", "action_required", {
        detail: "Offer received",
        note: "Finlytics sent you an offer. Respond before it expires.",
        updatedAt: at.ago(5),
      }),
    ],
  };

  return {
    stages: byScenario[scenario],
    hiringStatus: scenario === "listed" ? "offer_received" : "not_listed",
    activePlanName: scenario === "new" ? null : "Career Pro",
  };
}

function profile(scenario: PreviewScenario, at: Clock): CandidateProfile {
  const full: CandidateProfile = {
    personal: {
      firstName: "Khushee",
      lastName: "Sharma",
      dateOfBirth: "2001-04-12",
      gender: "female",
      headline: "Frontend developer · React, Next.js & TypeScript",
      summary:
        "Frontend developer with 2+ years of experience building accessible, fast web apps in React and Next.js. I turn complex workflows into simple interfaces and led the design-system work for a B2B dashboard used by 40,000 people.",
    },
    contact: {
      email: user.email,
      phone: "+919812345670",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      linkedinUrl: "https://www.linkedin.com/in/khushee-sharma",
      portfolioUrl: "https://khushee.example.com",
    },
    education: [
      {
        id: "edu_1",
        institution: "Savitribai Phule Pune University",
        degree: "B.E.",
        fieldOfStudy: "Computer Engineering",
        startYear: 2019,
        endYear: 2023,
        grade: "8.6 CGPA",
      },
    ],
    experience: {
      fresher: false,
      totalYears: 2.5,
      items: [
        {
          id: "exp_1",
          company: "Nimbus Labs",
          title: "Frontend Developer",
          employmentType: "full_time",
          startMonth: "2023-07",
          endMonth: null,
          current: true,
          description:
            "Own the customer dashboard (Next.js, TypeScript). Cut page load time by 38% and built the shared component library.",
        },
        {
          id: "exp_2",
          company: "Pixelcraft Studio",
          title: "Frontend Intern",
          employmentType: "internship",
          startMonth: "2023-01",
          endMonth: "2023-06",
          current: false,
          description: "Built marketing pages and an internal CMS interface in React.",
        },
      ],
    },
    skills: [
      { name: "React", level: "advanced" },
      { name: "TypeScript", level: "advanced" },
      { name: "Next.js", level: "advanced" },
      { name: "Tailwind CSS", level: "expert" },
      { name: "Node.js", level: "intermediate" },
      { name: "Testing Library", level: "intermediate" },
    ],
    preferences: {
      desiredRoles: ["Frontend Developer", "Full-stack Developer"],
      jobTypes: ["full_time"],
      workModes: ["hybrid", "remote"],
      preferredLocations: ["Pune", "Bengaluru", "Remote"],
      expectedSalary: 1_400_000,
      salaryCurrency: "INR",
      noticePeriodDays: 30,
      willingToRelocate: true,
    },
    resume: {
      id: "file_resume",
      name: "Khushee_Sharma_Resume.pdf",
      sizeBytes: 248_320,
      uploadedAt: at.ago(24 * 20),
      url: "#preview-resume",
    },
    completedAt: at.ago(24 * 24),
    locked: false,
    lockedReason: null,
    updatedAt: at.ago(24 * 3),
  };

  if (scenario !== "new") return full;

  return {
    ...full,
    experience: { fresher: false, totalYears: null, items: [] },
    skills: [],
    preferences: {
      desiredRoles: [],
      jobTypes: [],
      workModes: [],
      preferredLocations: [],
      expectedSalary: null,
      salaryCurrency: "INR",
      noticePeriodDays: null,
      willingToRelocate: false,
    },
    resume: null,
    completedAt: null,
    updatedAt: at.ago(2),
  };
}

const plan: Billing["plan"] = {
  id: "plan_pro",
  name: "Career Pro",
  tagline: "Everything you need to get hired",
  price: { amount: 299_900, currency: "INR" },
  validityDays: 180,
  entitlements: ["verification", "ai_interview", "expert_interview", "listing"],
  features: [
    "Priority verification within 48 hours",
    "3 AI mock interviews",
    "One-to-one expert interview",
    "Hiring portal listing for 6 months",
    "Recruiter activity insights",
  ],
};

function billing(scenario: PreviewScenario, at: Clock): Billing {
  if (scenario === "new") return { activePlan: null, plan, payments: [] };

  const days = scenario === "listed" ? 39 : scenario === "midway" ? 23 : 5;
  return {
    activePlan: {
      planId: "plan_pro",
      name: "Career Pro",
      activatedAt: at.ago(days * 24),
      expiresAt: at.ahead((180 - days) * 24),
      entitlements: ["verification", "ai_interview", "expert_interview", "listing"],
    },
    plan,
    payments: [
      {
        id: "pay_2",
        planId: "plan_pro",
        planName: "Career Pro",
        amount: { amount: 299_900, currency: "INR" },
        status: "captured",
        gateway: "razorpay",
        gatewayOrderId: "order_PRV2x8",
        gatewayPaymentId: "pay_PRV9kQ",
        method: "UPI",
        failureReason: null,
        invoice: { number: "BST-2026-00418", url: "#preview-invoice" },
        createdAt: at.ago(days * 24),
        updatedAt: at.ago(days * 24),
      },
      {
        id: "pay_1",
        planId: "plan_pro",
        planName: "Career Pro",
        amount: { amount: 299_900, currency: "INR" },
        status: "failed",
        gateway: "razorpay",
        gatewayOrderId: "order_PRV1a4",
        gatewayPaymentId: "pay_PRV1zz",
        method: "Card",
        failureReason: "Your bank declined the payment.",
        invoice: null,
        createdAt: at.ago(days * 24 + 1),
        updatedAt: at.ago(days * 24 + 1),
      },
    ],
  };
}

function verification(scenario: PreviewScenario, at: Clock): Verification {
  const base: Verification = {
    status: "not_started",
    submittedAt: null,
    reviewedAt: null,
    verifiedAt: null,
    reviewerName: null,
    feedback: null,
    requiredDocuments: ["government_id", "degree_certificate"],
    documents: [],
    history: [],
    editable: true,
    canSubmit: false,
    submitBlockedReason: "Complete your profile and plan payment first.",
    checks: [
      { key: "identity", label: "Identity", status: "pending", comment: null },
      { key: "resume", label: "Resume", status: "pending", comment: null },
      { key: "education", label: "Education", status: "pending", comment: null },
      { key: "experience", label: "Work experience", status: "pending", comment: null },
      { key: "skills", label: "Skills", status: "pending", comment: null },
    ],
  };

  if (scenario === "new") return base;

  const idDoc = {
    id: "doc_1",
    type: "government_id" as const,
    name: "aadhaar-masked.pdf",
    sizeBytes: 182_000,
    uploadedAt: at.ago(80),
    url: "#preview-doc",
  };

  if (scenario === "action_required") {
    return {
      ...base,
      status: "changes_required",
      submittedAt: at.ago(72),
      reviewedAt: at.ago(20),
      reviewerName: "Ananya Rao",
      feedback:
        "Thanks for submitting! Two quick fixes and we can verify you: make your resume dates match your profile, and upload your degree certificate.",
      documents: [idDoc],
      canSubmit: true,
      submitBlockedReason: null,
      checks: [
        { key: "identity", label: "Identity", status: "approved", comment: null },
        {
          key: "resume",
          label: "Resume",
          status: "changes_required",
          comment: "Your resume says the Nimbus Labs role started in 2022, but your profile says July 2023. Please make them match.",
        },
        {
          key: "education",
          label: "Education",
          status: "changes_required",
          comment: "Upload your degree certificate or final-year marksheet.",
        },
        { key: "experience", label: "Work experience", status: "approved", comment: null },
        { key: "skills", label: "Skills", status: "approved", comment: null },
      ],
      history: [
        { at: at.ago(20), status: "changes_required", actor: "Ananya Rao", note: "Resume dates and degree certificate" },
        { at: at.ago(72), status: "pending_review", actor: null, note: "Submitted for verification" },
      ],
    };
  }

  const verifiedHours = (scenario === "listed" ? 30 : 12) * 24;
  return {
    ...base,
    status: "verified",
    submittedAt: at.ago(verifiedHours + 40),
    reviewedAt: at.ago(verifiedHours),
    verifiedAt: at.ago(verifiedHours),
    reviewerName: "Ananya Rao",
    feedback: "Everything checks out. Well-structured profile!",
    editable: false,
    canSubmit: false,
    submitBlockedReason: "Your profile is verified.",
    documents: [
      idDoc,
      { id: "doc_2", type: "degree_certificate", name: "be-degree-certificate.pdf", sizeBytes: 412_000, uploadedAt: at.ago(verifiedHours + 30), url: "#preview-doc" },
    ],
    checks: base.checks.map((check) => ({ ...check, status: "approved" })),
    history: [
      { at: at.ago(verifiedHours), status: "verified", actor: "Ananya Rao", note: null },
      { at: at.ago(verifiedHours + 40), status: "pending_review", actor: null, note: "Submitted for verification" },
    ],
  };
}

const aiQuestions = [
  ["Walk me through how React decides when to re-render a component, and how you'd avoid unnecessary renders.", "Technical knowledge"],
  ["A page in your app takes 6 seconds to become interactive. How would you investigate and fix it?", "Problem solving"],
  ["Tell me about a time you disagreed with a designer or product manager. How did you resolve it?", "Communication"],
  ["How would you make a custom dropdown component accessible to keyboard and screen-reader users?", "Technical knowledge"],
  ["Explain the difference between server and client components in Next.js and when you'd use each.", "Technical knowledge"],
  ["Why do you want to move into this role, and what would you focus on in your first 90 days?", "Role fit"],
] as const;

const aiReport: AiInterviewReport = {
  overallScore: 78,
  generatedAt: "",
  criteria: [
    { key: "technical", label: "Technical knowledge", score: 82, comment: "Clear, accurate explanations of rendering and server components." },
    { key: "problem_solving", label: "Problem solving", score: 74, comment: "Good structure; quantify the impact of each fix." },
    { key: "communication", label: "Communication", score: 80, comment: "Concise answers with a clear beginning, middle and end." },
    { key: "role_fit", label: "Role fit", score: 76, comment: "Motivation is clear; tie it more to the company's product." },
  ],
  strengths: [
    "Strong grasp of React rendering and memoisation trade-offs",
    "Uses concrete examples from real projects",
    "Explains accessibility requirements precisely",
  ],
  weaknesses: [
    "Performance answer skipped measuring before optimising",
    "Conflict story didn't state the outcome",
  ],
  suggestions: [
    "Open performance answers with how you'd measure (Lighthouse, React Profiler, Web Vitals).",
    "Use the STAR format and finish behavioural answers with a measurable result.",
    "Research the company's product so your 90-day plan feels specific.",
  ],
};

function aiSessions(at: Clock): AiInterviewSession[] {
  return [
    {
      id: "ai_102",
      role: "Frontend Developer",
      experienceLevel: "junior",
      skillCategory: "Web development",
      status: "in_progress",
      startedAt: at.ago(1),
      completedAt: null,
      report: null,
      failureReason: null,
      questions: aiQuestions.map(([prompt, competency], index) => ({
        id: `q_${index + 1}`,
        order: index + 1,
        prompt,
        competency,
        answer: index < 2 ? "React re-renders a component when its state or props change, or when its parent re-renders. I keep state close to where it's used and memoise expensive children." : null,
        answeredAt: index < 2 ? at.ago(0.5) : null,
      })),
    },
    {
      id: "ai_101",
      role: "Frontend Developer",
      experienceLevel: "junior",
      skillCategory: "Web development",
      status: "completed",
      startedAt: at.ago(24 * 4 + 1),
      completedAt: at.ago(24 * 4),
      failureReason: null,
      report: { ...aiReport, generatedAt: at.ago(24 * 4) },
      questions: aiQuestions.map(([prompt, competency], index) => ({
        id: `q_${index + 1}`,
        order: index + 1,
        prompt,
        competency,
        answer:
          "I'd start by reproducing it and measuring with the React Profiler and Lighthouse, then work through the biggest contributors: bundle size, blocking requests and expensive renders.",
        answeredAt: at.ago(24 * 4 + 0.5),
      })),
    },
  ];
}

function summarize(session: AiInterviewSession): AiInterviewSummary {
  return {
    id: session.id,
    role: session.role,
    experienceLevel: session.experienceLevel,
    skillCategory: session.skillCategory,
    status: session.status,
    startedAt: session.startedAt,
    completedAt: session.completedAt,
    questionCount: session.questions.length,
    answeredCount: session.questions.filter((question) => question.answer).length,
    overallScore: session.report?.overallScore ?? null,
  };
}

function aiOverview(scenario: PreviewScenario, at: Clock): AiInterviewOverview {
  const unlocked = rank[scenario] >= rank.midway;
  const sessions = unlocked ? aiSessions(at) : [];
  const completed = sessions.find((session) => session.report);

  return {
    available: unlocked,
    unavailableReason: unlocked ? null : "Unlocks once your profile is verified.",
    attemptsRemaining: unlocked ? 1 : null,
    options: {
      roles: ["Frontend Developer", "Backend Developer", "Full-stack Developer", "Data Analyst", "QA Engineer", "DevOps Engineer", "Product Designer"],
      experienceLevels: ["fresher", "junior", "mid", "senior", "lead"],
      skillCategories: ["Web development", "Data & analytics", "Cloud & DevOps", "Design", "Quality engineering", "Problem solving & DSA"],
      questionCount: aiQuestions.length,
      answerModes: ["text"],
    },
    sessions: sessions.map(summarize),
    latestReport: completed?.report ? { ...completed.report, sessionId: completed.id, role: completed.role } : null,
  };
}

const interviewerPool: InterviewerSummary[] = [
  { id: "int_1", name: "Rohan Kapoor", title: "Engineering Manager" },
  { id: "int_2", name: "Sneha Kulkarni", title: "Senior Frontend Engineer" },
  { id: "int_3", name: "Arjun Menon", title: "Career Coach" },
];

function expertInterviews(scenario: PreviewScenario, at: Clock): ExpertInterviewOverview {
  const policy = { durationMinutes: 45, rescheduleCutoffHours: 12, cancelCutoffHours: 24, maxReschedules: 2 };

  if (rank[scenario] < rank.midway) {
    return {
      eligible: false,
      ineligibleReason: "Complete your AI mock interview to unlock one-to-one interviews.",
      policy,
      current: null,
      history: [],
    };
  }

  if (scenario === "midway") {
    const startsAt = at.ahead(50);
    return {
      eligible: true,
      ineligibleReason: null,
      policy,
      history: [],
      current: {
        id: "exp_int_1",
        status: "scheduled",
        startsAt,
        endsAt: new Date(Date.parse(startsAt) + 45 * 60_000).toISOString(),
        interviewer: interviewerPool[0],
        meetingUrl: "https://meet.example.com/bsp-4821",
        bookedAt: at.ago(30),
        rescheduleCount: 0,
        canReschedule: true,
        canCancel: true,
        cancelReason: null,
        reminders: [at.ahead(26), at.ahead(49)],
        feedback: null,
      },
    };
  }

  const completed: ExpertInterview = {
    id: "exp_int_1",
    status: "completed",
    startsAt: at.ago(24 * 15),
    endsAt: at.ago(24 * 15 - 0.75),
    interviewer: interviewerPool[0],
    meetingUrl: null,
    bookedAt: at.ago(24 * 18),
    rescheduleCount: 1,
    canReschedule: false,
    canCancel: false,
    cancelReason: null,
    reminders: [],
    feedback: {
      submittedAt: at.ago(24 * 14),
      rating: 4,
      recommendation: "yes",
      summary:
        "Khushee communicates clearly and has solid React fundamentals. With sharper performance-debugging stories she'll be a strong mid-level frontend hire.",
      strengths: ["Component architecture", "Accessibility awareness", "Clear communication"],
      improvements: ["Lead with metrics in project stories", "Practise system-design questions for frontend"],
    },
  };

  return { eligible: true, ineligibleReason: null, policy, current: null, history: [completed] };
}

function interviewSlots(at: Clock): InterviewSlot[] {
  const slots: InterviewSlot[] = [];
  const start = new Date(at.dateAhead(1) + "T00:00:00Z");
  // 10:00, 14:30 and 17:00 IST
  const times: [number, number][] = [[4, 30], [9, 0], [11, 30]];

  for (let day = 0; day < 14; day++) {
    const date = new Date(start.getTime() + day * 24 * 60 * 60 * 1000);
    if (date.getUTCDay() === 0) continue;

    times.forEach(([hour, minute], index) => {
      if ((day + index) % 4 === 3) return;
      const startsAt = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour, minute));
      slots.push({
        id: `slot_${day}_${index}`,
        startsAt: startsAt.toISOString(),
        endsAt: new Date(startsAt.getTime() + 45 * 60_000).toISOString(),
        interviewer: interviewerPool[(day + index) % interviewerPool.length],
      });
    });
  }
  return slots;
}

const defaultVisibility: ListingVisibility = {
  showFullName: true,
  showCurrentCompany: false,
  showEducation: true,
  showResume: true,
  showExpectedSalary: false,
  showAiAssessment: true,
  showExpertFeedback: true,
};

function publicProfile(scenario: PreviewScenario, at: Clock): PublicProfile {
  const source = profile("listed", at);
  return {
    candidateId: user.id,
    displayName: "Khushee Sharma",
    headline: source.personal.headline,
    location: "Pune, Maharashtra",
    experienceYears: source.experience.totalYears,
    skills: source.skills,
    desiredRoles: source.preferences.desiredRoles,
    workModes: source.preferences.workModes,
    preferredLocations: source.preferences.preferredLocations,
    availability: { status: "notice_period", noticePeriodDays: 30, availableFrom: null },
    currentCompany: null,
    education: [{ degree: "B.E. Computer Engineering", institution: "Savitribai Phule Pune University" }],
    expectedSalary: null,
    resumeUrl: "#preview-resume",
    aiAssessment: { overallScore: 78, summary: "Strong React fundamentals and clear communication." },
    expertInterview:
      scenario === "listed"
        ? { rating: 4, recommendation: "yes", summary: "Solid React fundamentals; clear communicator." }
        : null,
    verifiedAt: at.ago(24 * 12),
  };
}

function listing(scenario: PreviewScenario, at: Clock): Listing {
  if (scenario === "listed") {
    return {
      status: "listed",
      missingRequirements: [],
      requestedAt: at.ago(24 * 8),
      listedAt: at.ago(24 * 6),
      reviewerNote: null,
      visibility: defaultVisibility,
      stats: { windowDays: 30, profileViews: 48, recruiterInterest: 6, shortlists: 3 },
      preview: publicProfile(scenario, at),
    };
  }

  const missing: Record<Exclude<PreviewScenario, "listed">, string[]> = {
    new: [
      "Complete your profile",
      "Get your profile verified",
      "Complete an AI mock interview",
      "Complete a one-to-one interview",
      "Complete your plan payment",
    ],
    action_required: ["Get your profile verified", "Complete an AI mock interview", "Complete a one-to-one interview"],
    midway: ["Complete your one-to-one interview"],
  };

  return {
    status: "not_eligible",
    missingRequirements: missing[scenario],
    requestedAt: null,
    listedAt: null,
    reviewerNote: null,
    visibility: defaultVisibility,
    stats: null,
    preview: scenario === "midway" ? publicProfile(scenario, at) : null,
  };
}

function hiring(scenario: PreviewScenario, at: Clock): Hiring {
  const availability = { status: "notice_period" as const, noticePeriodDays: 30, availableFrom: null };

  if (scenario !== "listed") {
    return { status: "not_listed", availability, opportunities: [], contactRequests: [], hired: null };
  }

  return {
    status: "offer_received",
    availability,
    hired: null,
    opportunities: [
      {
        id: "opp_1",
        company: "Finlytics",
        jobTitle: "Frontend Engineer",
        location: "Bengaluru (Hybrid)",
        stage: "offer",
        recruiterName: "Meera Iyer",
        rounds: [
          { name: "Technical interview", scheduledAt: at.ago(24 * 5), status: "completed" },
          { name: "Hiring manager round", scheduledAt: at.ago(24 * 2), status: "completed" },
        ],
        offer: {
          ctc: { amount: 1_500_000_00, currency: "INR" },
          joiningDate: at.dateAhead(35),
          expiresAt: at.ahead(24 * 4),
          status: "pending",
        },
        createdAt: at.ago(24 * 6),
        updatedAt: at.ago(5),
      },
      {
        id: "opp_2",
        company: "CloudNest",
        jobTitle: "UI Engineer",
        location: "Remote",
        stage: "interviewing",
        recruiterName: "Vikram Shah",
        rounds: [{ name: "Take-home review", scheduledAt: at.ahead(26), status: "scheduled" }],
        offer: null,
        createdAt: at.ago(24 * 4),
        updatedAt: at.ago(24),
      },
      {
        id: "opp_3",
        company: "Brightpath Health",
        jobTitle: "Frontend Developer",
        location: "Pune",
        stage: "shortlisted",
        recruiterName: "Kavya Reddy",
        rounds: [],
        offer: null,
        createdAt: at.ago(30),
        updatedAt: at.ago(30),
      },
      {
        id: "opp_4",
        company: "ShopSphere",
        jobTitle: "React Developer",
        location: "Mumbai",
        stage: "not_selected",
        recruiterName: "Dev Malhotra",
        rounds: [{ name: "Technical interview", scheduledAt: at.ago(24 * 5), status: "completed" }],
        offer: null,
        createdAt: at.ago(24 * 6),
        updatedAt: at.ago(24 * 3),
      },
    ],
    contactRequests: [
      {
        id: "cr_1",
        company: "Brightpath Health",
        recruiterName: "Kavya Reddy",
        jobTitle: "Frontend Developer",
        message: "Hi Khushee, we loved your accessibility work. Could we share a few details about our patient portal team and set up a call?",
        requestedAt: at.ago(30),
        status: "pending",
      },
      {
        id: "cr_2",
        company: "Finlytics",
        recruiterName: "Meera Iyer",
        jobTitle: "Frontend Engineer",
        message: "We'd like to schedule a technical interview for our Frontend Engineer role.",
        requestedAt: at.ago(24 * 6),
        status: "shared",
      },
    ],
  };
}

function notifications(scenario: PreviewScenario, at: Clock): NotificationFeed {
  const items: Record<PreviewScenario, NotificationFeed["items"]> = {
    new: [
      { id: "n_1", kind: "system", title: "Welcome to Bluespark Talents", body: "Complete your profile to start your hiring journey.", href: "/profile", createdAt: at.ago(3), readAt: null },
    ],
    action_required: [
      { id: "n_3", kind: "action_required", title: "Changes requested on your profile", body: "Ananya left 2 comments. Fix them and resubmit for verification.", href: "/verification", createdAt: at.ago(20), readAt: null },
      { id: "n_2", kind: "payment", title: "Payment received", body: "Career Pro is active. Your invoice BST-2026-00418 is ready.", href: "/plans", createdAt: at.ago(24 * 5), readAt: at.ago(24 * 5) },
    ],
    midway: [
      { id: "n_6", kind: "reminder", title: "Interview in 2 days", body: "Your one-to-one interview with Rohan Kapoor is coming up.", href: "/interview", createdAt: at.ago(2), readAt: null },
      { id: "n_5", kind: "status_change", title: "AI interview report ready", body: "You scored 78/100. See strengths and what to work on.", href: "/ai-interview/ai_101", createdAt: at.ago(24 * 4), readAt: null },
      { id: "n_4", kind: "status_change", title: "Profile verified", body: "Your profile passed verification.", href: "/verification", createdAt: at.ago(24 * 12), readAt: at.ago(24 * 11) },
    ],
    listed: [
      { id: "n_10", kind: "recruiter", title: "Offer from Finlytics", body: "Respond to the Frontend Engineer offer before it expires.", href: "/hiring", createdAt: at.ago(5), readAt: null },
      { id: "n_9", kind: "recruiter", title: "Brightpath Health wants to contact you", body: "Kavya Reddy asked for your contact details.", href: "/hiring", createdAt: at.ago(30), readAt: null },
      { id: "n_8", kind: "reminder", title: "Take-home review tomorrow", body: "CloudNest scheduled your next round.", href: "/hiring", createdAt: at.ago(24), readAt: at.ago(20) },
      { id: "n_7", kind: "status_change", title: "You're live on the hiring portal", body: "Recruiters can now discover your profile.", href: "/listing", createdAt: at.ago(24 * 6), readAt: at.ago(24 * 6) },
    ],
  };

  const feed = items[scenario];
  return { unreadCount: feed.filter((item) => !item.readAt).length, items: feed };
}

function settings(scenario: PreviewScenario, at: Clock): AccountSettings {
  const on = { email: true, sms: false, whatsapp: true };

  return {
    email: user.email,
    pendingEmail: null,
    phone: scenario === "new" ? null : "+919812345670",
    timeZone: "Asia/Kolkata",
    createdAt: at.ago(24 * 47),
    signIn: {
      hasPassword: true,
      passwordChangedAt: at.ago(24 * 47),
      google: scenario === "listed" ? { email: "khushee.sharma@gmail.com", connectedAt: at.ago(24 * 30) } : null,
    },
    notifications: {
      status_change: on,
      action_required: { email: true, sms: true, whatsapp: true },
      reminder: { email: true, sms: true, whatsapp: true },
      recruiter: on,
      payment: { email: true, sms: false, whatsapp: false },
      security: { email: true, sms: false, whatsapp: false },
      product_news: { email: false, sms: false, whatsapp: false },
    },
    requiredNotifications: { payment: ["email"], security: ["email"] },
    sessions: [
      {
        id: "ses_current",
        device: "Chrome on Windows",
        deviceType: "desktop",
        location: "Pune, India",
        signedInAt: at.ago(24 * 3),
        lastActiveAt: at.ago(0),
        current: true,
      },
      {
        id: "ses_phone",
        device: "Safari on iPhone",
        deviceType: "mobile",
        location: "Pune, India",
        signedInAt: at.ago(24 * 12),
        lastActiveAt: at.ago(5),
        current: false,
      },
      {
        id: "ses_laptop",
        device: "Edge on Windows",
        deviceType: "desktop",
        location: "Mumbai, India",
        signedInAt: at.ago(24 * 26),
        lastActiveAt: at.ago(24 * 9),
        current: false,
      },
    ],
    dataExport:
      scenario === "listed"
        ? { status: "ready", requestedAt: at.ago(26), url: "#preview-export", expiresAt: at.ahead(24 * 6) }
        : null,
    deletionScheduledFor: null,
    deletionGraceDays: 30,
  };
}

/* ----------------------------------------------------------------------------
 * Staff
 * ------------------------------------------------------------------------- */

const people = [
  { id: "cand_201", name: "Priya Nair", headline: "Data analyst · SQL, Python, Power BI", city: "Kochi", skills: ["SQL", "Python", "Power BI"], years: 3 },
  { id: "cand_202", name: "Aditya Joshi", headline: "Backend engineer · Go & PostgreSQL", city: "Pune", skills: ["Go", "PostgreSQL", "Kubernetes"], years: 4 },
  { id: "cand_203", name: "Sana Qureshi", headline: "QA engineer · Playwright & API testing", city: "Hyderabad", skills: ["Playwright", "Postman", "TypeScript"], years: 2 },
  { id: "cand_204", name: "Rahul Verma", headline: "Full-stack developer · MERN", city: "Delhi", skills: ["React", "Node.js", "MongoDB"], years: 1.5 },
  { id: "cand_205", name: "Neha Bansal", headline: "Product designer · Figma & research", city: "Bengaluru", skills: ["Figma", "User research", "Prototyping"], years: 5 },
  { id: user.id, name: "Khushee Sharma", headline: "Frontend developer · React, Next.js & TypeScript", city: "Pune", skills: ["React", "TypeScript", "Next.js"], years: 2.5 },
];

function reviewQueue(at: Clock): ReviewQueueItem[] {
  return people.slice(0, 5).map((person, index) => ({
    candidateId: person.id,
    name: person.name,
    email: `${person.name.split(" ")[0].toLowerCase()}@example.com`,
    headline: person.headline,
    planName: "Career Pro",
    submittedAt: at.ago(6 + index * 9),
    verificationStatus: index < 3 ? "pending_review" : index === 3 ? "changes_required" : "verified",
    listingStatus: index === 4 ? "pending_approval" : "not_eligible",
  }));
}

function staffCandidate(candidateId: string | undefined, at: Clock): StaffCandidate | undefined {
  const person = people.find((entry) => entry.id === candidateId);
  if (!person) return undefined;

  const [firstName, lastName] = person.name.split(" ");
  const base = profile("listed", at);
  const queueItem = reviewQueue(at).find((item) => item.candidateId === candidateId);
  const pending = verification("action_required", at);

  return {
    id: person.id,
    profile: {
      ...base,
      personal: { ...base.personal, firstName, lastName, headline: person.headline },
      contact: { ...base.contact, email: `${firstName.toLowerCase()}@example.com`, city: person.city },
      skills: person.skills.map((name) => ({ name, level: "advanced" })),
    },
    journey: journey("action_required"),
    verification: {
      ...pending,
      status: queueItem?.verificationStatus ?? "pending_review",
      reviewedAt: null,
      reviewerName: null,
      feedback: null,
      checks: pending.checks.map((check) => ({ ...check, status: "pending", comment: null })),
      history: [{ at: at.ago(6), status: "pending_review", actor: null, note: "Submitted for verification" }],
    },
    listing: {
      status: queueItem?.listingStatus ?? "not_eligible",
      requestedAt: queueItem?.listingStatus === "pending_approval" ? at.ago(10) : null,
      listedAt: null,
      reviewerNote: null,
    },
    aiInterviews: aiSessions(at).filter((session) => session.report).map(summarize),
    expertInterviews: expertInterviews("listed", at).history,
  };
}

const interviewers: Interviewer[] = interviewerPool.map((person, index) => ({
  ...person,
  email: `${person.name.split(" ")[0].toLowerCase()}@bluesparkstalents.example`,
  active: index < 2,
  upcomingInterviews: index < 2 ? 4 - index * 2 : 0,
}));

function myAvailability(at: Clock): AvailabilitySlot[] {
  return interviewSlots(at)
    .filter((slot) => slot.interviewer.id === "int_1")
    .slice(0, 8)
    .map((slot, index) => ({
      ...slot,
      booked: index % 3 === 0,
      candidateName: index % 3 === 0 ? people[index % people.length].name : null,
    }));
}

function myAssignments(at: Clock): InterviewerAssignment[] {
  const assignment = (
    id: string,
    personIndex: number,
    startHours: number,
    status: InterviewerAssignment["status"],
    feedbackDue: boolean
  ): InterviewerAssignment => {
    const person = people[personIndex];
    const startsAt = startHours >= 0 ? at.ahead(startHours) : at.ago(-startHours);
    return {
      id,
      candidate: { id: person.id, name: person.name, headline: person.headline },
      startsAt,
      endsAt: new Date(Date.parse(startsAt) + 45 * 60_000).toISOString(),
      status,
      meetingUrl: "https://meet.example.com/bsp-" + id,
      feedbackDue,
      feedback: null,
    };
  };

  return [
    assignment("as_1", 5, 50, "scheduled", false),
    assignment("as_2", 0, 74, "rescheduled", false),
    assignment("as_3", 1, -20, "scheduled", true),
    {
      ...assignment("as_4", 2, -24 * 6, "completed", false),
      feedback: {
        submittedAt: at.ago(24 * 6 - 2),
        rating: 3,
        recommendation: "maybe",
        summary: "Good testing fundamentals; needs more depth on CI pipelines.",
        strengths: ["Test design"],
        improvements: ["CI/CD depth"],
      },
    },
  ];
}

function talentCards(at: Clock): TalentCard[] {
  return people.map((person, index) => ({
    candidateId: person.id,
    displayName: person.name,
    headline: person.headline,
    location: person.city,
    experienceYears: person.years,
    topSkills: person.skills,
    availability:
      index % 3 === 0
        ? { status: "immediate", noticePeriodDays: null, availableFrom: null }
        : { status: "notice_period", noticePeriodDays: 30 + index * 15, availableFrom: null },
    aiScore: [71, 84, 66, null, 88, 78][index],
    shortlisted: index === 1 || index === 5,
    verifiedAt: at.ago(24 * (10 + index)),
  }));
}

function talentSearch(query: Record<string, unknown>, at: Clock): TalentSearchResult {
  const text = (value: unknown) => (typeof value === "string" ? value.trim().toLowerCase() : "");
  const q = text(query.q);
  const skill = text(query.skill);
  const location = text(query.location);

  const items = talentCards(at).filter(
    (card) =>
      (!q || `${card.displayName} ${card.headline} ${card.topSkills.join(" ")}`.toLowerCase().includes(q)) &&
      (!skill || card.topSkills.some((name) => name.toLowerCase().includes(skill))) &&
      (!location || card.location.toLowerCase().includes(location)) &&
      (!query.availability || card.availability.status === query.availability) &&
      (query.minExperience == null || (card.experienceYears ?? 0) >= Number(query.minExperience)) &&
      (query.maxExperience == null || (card.experienceYears ?? 0) <= Number(query.maxExperience)) &&
      (!query.shortlisted || card.shortlisted)
  );

  return { items, total: items.length, page: 1, pageSize: 20 };
}

function talentProfile(candidateId: string, at: Clock): RecruiterCandidateView | undefined {
  const card = talentCards(at).find((entry) => entry.candidateId === candidateId);
  if (!card) return undefined;

  const listed = hiring("listed", at);
  return {
    profile: {
      ...publicProfile("listed", at),
      candidateId: card.candidateId,
      displayName: card.displayName,
      headline: card.headline,
      location: card.location,
      experienceYears: card.experienceYears,
      skills: card.topSkills.map((name) => ({ name, level: "advanced" })),
      availability: card.availability,
      aiAssessment: card.aiScore ? { overallScore: card.aiScore, summary: "Clear, structured answers with solid fundamentals." } : null,
    },
    shortlisted: card.shortlisted,
    opportunity: card.shortlisted ? { ...listed.opportunities[1], company: "Your company" } : null,
    contactRequest: card.shortlisted ? { ...listed.contactRequests[1], company: "Your company" } : null,
    contact: card.shortlisted ? { email: `${card.displayName.split(" ")[0].toLowerCase()}@example.com`, phone: "+919800000000" } : null,
  };
}
