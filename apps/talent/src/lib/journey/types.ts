/*
 * Candidate journey API contract (v1).
 *
 * These are the response and request shapes the talent app expects from
 * apps/api. The API owns every workflow rule and permission check; the talent
 * app only renders what it returns. Endpoints and the rules the API must enforce
 * are documented in docs/journey-api.md. Keep the two in sync.
 *
 * Conventions: timestamps are ISO-8601 UTC strings, calendar dates are
 * "YYYY-MM-DD", and money is in minor units (paise for INR).
 */

export type IsoDateTime = string;
export type IsoDate = string;

export type Money = { amount: number; currency: string };

export type Role = "candidate" | "admin" | "interviewer" | "recruiter";

export type CurrentUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
};

/* ----------------------------------------------------------------------------
 * Journey
 * ------------------------------------------------------------------------- */

export const stageKeys = [
  "profile",
  "plan",
  "verification",
  "ai_interview",
  "expert_interview",
  "listing",
  "hiring",
] as const;

export type StageKey = (typeof stageKeys)[number];

/**
 * pending: not started (or waiting on an earlier stage, see `locked`)
 * in_progress: started, or waiting on someone else (review, payment capture)
 * completed: done and validated by the API
 * action_required: the candidate has to do something (fix, retry, rebook)
 * blocked: can't continue until an admin or external event unblocks it
 */
export type StageStatus = "pending" | "in_progress" | "completed" | "action_required" | "blocked";

export type StageSummary = {
  key: StageKey;
  status: StageStatus;
  /** True while an earlier stage this one depends on is incomplete. */
  locked: boolean;
  /** Stage-specific state in words, e.g. "Pending review" or "Payment failed". */
  detail: string | null;
  /** Why the stage is blocked or what action is required. */
  note: string | null;
  completedAt: IsoDateTime | null;
  updatedAt: IsoDateTime | null;
};

export type HiringStatus =
  | "not_listed"
  | "available"
  | "shortlisted"
  | "interviewing"
  | "offer_received"
  | "hired"
  | "not_selected";

export type Journey = {
  /** Always all seven stages, in `stageKeys` order. */
  stages: StageSummary[];
  hiringStatus: HiringStatus;
  activePlanName: string | null;
};

/* ----------------------------------------------------------------------------
 * Step 1: Profile
 * ------------------------------------------------------------------------- */

export const profileSectionKeys = [
  "personal",
  "contact",
  "education",
  "experience",
  "skills",
  "preferences",
  "resume",
] as const;

export type ProfileSectionKey = (typeof profileSectionKeys)[number];

export type PersonalDetails = {
  firstName: string;
  lastName: string;
  dateOfBirth: IsoDate | null;
  gender: "female" | "male" | "non_binary" | "prefer_not_to_say" | null;
  headline: string;
  summary: string;
};

export type ContactDetails = {
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  linkedinUrl: string;
  portfolioUrl: string;
};

export type EducationEntry = {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number | null;
  endYear: number | null;
  grade: string;
};

export type EmploymentType = "full_time" | "part_time" | "contract" | "internship" | "freelance";

export type ExperienceEntry = {
  id?: string;
  company: string;
  title: string;
  employmentType: EmploymentType;
  /** "YYYY-MM" */
  startMonth: string;
  /** "YYYY-MM", null while `current` is true */
  endMonth: string | null;
  current: boolean;
  description: string;
};

export type WorkExperience = {
  fresher: boolean;
  totalYears: number | null;
  items: ExperienceEntry[];
};

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type Skill = { name: string; level: SkillLevel };

export type JobType = "full_time" | "part_time" | "contract" | "internship";
export type WorkMode = "onsite" | "hybrid" | "remote";

export type CareerPreferences = {
  desiredRoles: string[];
  jobTypes: JobType[];
  workModes: WorkMode[];
  preferredLocations: string[];
  /** Annual, in major units (rupees), so it reads naturally in forms. */
  expectedSalary: number | null;
  salaryCurrency: string;
  noticePeriodDays: number | null;
  willingToRelocate: boolean;
};

export type StoredFile = {
  id: string;
  name: string;
  sizeBytes: number;
  uploadedAt: IsoDateTime;
  /** Short-lived signed URL. */
  url: string;
};

export type CandidateProfile = {
  personal: PersonalDetails;
  contact: ContactDetails;
  education: EducationEntry[];
  experience: WorkExperience;
  skills: Skill[];
  preferences: CareerPreferences;
  resume: StoredFile | null;
  /** Set once the API accepted the profile as complete. */
  completedAt: IsoDateTime | null;
  /** Editing is locked while verification is under review. */
  locked: boolean;
  lockedReason: string | null;
  updatedAt: IsoDateTime;
};

export type ProfileSectionInput = {
  personal: PersonalDetails;
  contact: Omit<ContactDetails, "email">;
  education: { items: EducationEntry[] };
  experience: WorkExperience;
  skills: { items: Skill[] };
  preferences: CareerPreferences;
};

/* ----------------------------------------------------------------------------
 * Step 2: Plan and payment (Razorpay). There is a single paid plan.
 * ------------------------------------------------------------------------- */

export type Entitlement = "verification" | "ai_interview" | "expert_interview" | "listing";

export type Plan = {
  id: string;
  name: string;
  tagline: string;
  price: Money;
  validityDays: number | null;
  features: string[];
  entitlements: Entitlement[];
};

export type PaymentStatus = "created" | "pending" | "captured" | "failed" | "refunded";

export type Payment = {
  id: string;
  planId: string;
  planName: string;
  amount: Money;
  status: PaymentStatus;
  gateway: "razorpay";
  gatewayOrderId: string;
  gatewayPaymentId: string | null;
  method: string | null;
  failureReason: string | null;
  invoice: { number: string; url: string } | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
};

export type ActivePlan = {
  planId: string;
  name: string;
  activatedAt: IsoDateTime;
  expiresAt: IsoDateTime | null;
  entitlements: Entitlement[];
};

export type Billing = {
  activePlan: ActivePlan | null;
  plan: Plan;
  payments: Payment[];
};

/** Returned by POST /me/payments/orders; everything Razorpay Checkout needs. */
export type CheckoutOrder = {
  paymentId: string;
  keyId: string;
  orderId: string;
  amount: Money;
  planName: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
};

export type RazorpayConfirmation = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

/* ----------------------------------------------------------------------------
 * Step 3: Verification
 * ------------------------------------------------------------------------- */

export type VerificationStatus =
  | "not_started"
  | "pending_review"
  | "changes_required"
  | "verified"
  | "rejected";

export type VerificationCheckKey = "identity" | "resume" | "education" | "experience" | "skills";

export type CheckStatus = "pending" | "approved" | "changes_required" | "rejected";

export type VerificationCheck = {
  key: VerificationCheckKey;
  label: string;
  status: CheckStatus;
  comment: string | null;
};

export type DocumentType = "government_id" | "degree_certificate" | "experience_letter" | "other";

export type VerificationDocument = StoredFile & { type: DocumentType };

export type VerificationEvent = {
  at: IsoDateTime;
  status: VerificationStatus;
  actor: string | null;
  note: string | null;
};

export type Verification = {
  status: VerificationStatus;
  submittedAt: IsoDateTime | null;
  reviewedAt: IsoDateTime | null;
  verifiedAt: IsoDateTime | null;
  reviewerName: string | null;
  feedback: string | null;
  checks: VerificationCheck[];
  documents: VerificationDocument[];
  requiredDocuments: DocumentType[];
  history: VerificationEvent[];
  /** Whether documents can be added or removed right now. */
  editable: boolean;
  canSubmit: boolean;
  submitBlockedReason: string | null;
};

/* ----------------------------------------------------------------------------
 * Step 4: AI mock interview
 * ------------------------------------------------------------------------- */

export type ExperienceLevel = "fresher" | "junior" | "mid" | "senior" | "lead";

export type AiInterviewOptions = {
  roles: string[];
  experienceLevels: ExperienceLevel[];
  skillCategories: string[];
  questionCount: number;
  /** Only "text" until the platform supports voice answers. */
  answerModes: ("text" | "voice")[];
};

export type AiInterviewStatus = "in_progress" | "evaluating" | "completed" | "failed";

export type AiInterviewQuestion = {
  id: string;
  order: number;
  prompt: string;
  competency: string;
  answer: string | null;
  answeredAt: IsoDateTime | null;
};

export type AiCriterionScore = {
  key: string;
  label: string;
  /** 0-100 */
  score: number;
  comment: string;
};

export type AiInterviewReport = {
  /** 0-100 */
  overallScore: number;
  criteria: AiCriterionScore[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  generatedAt: IsoDateTime;
};

export type AiInterviewSession = {
  id: string;
  role: string;
  experienceLevel: ExperienceLevel;
  skillCategory: string;
  status: AiInterviewStatus;
  questions: AiInterviewQuestion[];
  startedAt: IsoDateTime;
  completedAt: IsoDateTime | null;
  report: AiInterviewReport | null;
  failureReason: string | null;
};

export type AiInterviewSummary = {
  id: string;
  role: string;
  experienceLevel: ExperienceLevel;
  skillCategory: string;
  status: AiInterviewStatus;
  startedAt: IsoDateTime;
  completedAt: IsoDateTime | null;
  questionCount: number;
  answeredCount: number;
  overallScore: number | null;
};

export type AiInterviewOverview = {
  available: boolean;
  unavailableReason: string | null;
  attemptsRemaining: number | null;
  options: AiInterviewOptions;
  sessions: AiInterviewSummary[];
  latestReport: (AiInterviewReport & { sessionId: string; role: string }) | null;
};

export type AiInterviewSetup = {
  role: string;
  experienceLevel: ExperienceLevel;
  skillCategory: string;
};

/* ----------------------------------------------------------------------------
 * Step 5: One-to-one interview
 * ------------------------------------------------------------------------- */

/** "Not scheduled" is the absence of a current interview. */
export type ExpertInterviewStatus = "scheduled" | "rescheduled" | "completed" | "cancelled" | "no_show";

export type InterviewerSummary = {
  id: string;
  name: string;
  title: string;
};

export type InterviewSlot = {
  id: string;
  startsAt: IsoDateTime;
  endsAt: IsoDateTime;
  interviewer: InterviewerSummary;
};

export type Recommendation = "strong_yes" | "yes" | "maybe" | "no";

export type InterviewFeedback = {
  submittedAt: IsoDateTime;
  /** 1-5 */
  rating: number;
  recommendation: Recommendation;
  summary: string;
  strengths: string[];
  improvements: string[];
};

export type ExpertInterview = {
  id: string;
  status: ExpertInterviewStatus;
  startsAt: IsoDateTime;
  endsAt: IsoDateTime;
  interviewer: InterviewerSummary;
  meetingUrl: string | null;
  bookedAt: IsoDateTime;
  rescheduleCount: number;
  canReschedule: boolean;
  canCancel: boolean;
  cancelReason: string | null;
  /** When reminder emails go out. */
  reminders: IsoDateTime[];
  feedback: InterviewFeedback | null;
};

export type InterviewPolicy = {
  durationMinutes: number;
  rescheduleCutoffHours: number;
  cancelCutoffHours: number;
  maxReschedules: number;
};

export type ExpertInterviewOverview = {
  eligible: boolean;
  ineligibleReason: string | null;
  policy: InterviewPolicy;
  current: ExpertInterview | null;
  history: ExpertInterview[];
};

/* ----------------------------------------------------------------------------
 * Step 6: Hiring portal listing
 * ------------------------------------------------------------------------- */

export type ListingStatus = "not_eligible" | "ready" | "pending_approval" | "listed" | "paused" | "rejected";

/** Contact details are never part of a listing; recruiters request them. */
export type ListingVisibility = {
  showFullName: boolean;
  showCurrentCompany: boolean;
  showEducation: boolean;
  showResume: boolean;
  showExpectedSalary: boolean;
  showAiAssessment: boolean;
  showExpertFeedback: boolean;
};

export type AvailabilityStatus = "immediate" | "notice_period" | "not_looking";

export type Availability = {
  status: AvailabilityStatus;
  noticePeriodDays: number | null;
  availableFrom: IsoDate | null;
};

export type PublicProfile = {
  candidateId: string;
  displayName: string;
  headline: string;
  location: string;
  experienceYears: number | null;
  skills: Skill[];
  desiredRoles: string[];
  workModes: WorkMode[];
  preferredLocations: string[];
  availability: Availability;
  currentCompany: string | null;
  education: { degree: string; institution: string }[] | null;
  expectedSalary: Money | null;
  resumeUrl: string | null;
  aiAssessment: { overallScore: number; summary: string } | null;
  expertInterview: { rating: number; recommendation: Recommendation; summary: string } | null;
  verifiedAt: IsoDateTime | null;
};

export type ListingStats = {
  windowDays: number;
  profileViews: number;
  recruiterInterest: number;
  shortlists: number;
};

export type Listing = {
  status: ListingStatus;
  missingRequirements: string[];
  requestedAt: IsoDateTime | null;
  listedAt: IsoDateTime | null;
  reviewerNote: string | null;
  visibility: ListingVisibility;
  stats: ListingStats | null;
  preview: PublicProfile | null;
};

/* ----------------------------------------------------------------------------
 * Step 7: Shortlisting and hiring
 * ------------------------------------------------------------------------- */

export type OpportunityStage = "shortlisted" | "interviewing" | "offer" | "hired" | "not_selected" | "withdrawn";

export type InterviewRound = {
  name: string;
  scheduledAt: IsoDateTime | null;
  status: "scheduled" | "completed" | "cancelled";
};

export type Offer = {
  ctc: Money | null;
  joiningDate: IsoDate | null;
  expiresAt: IsoDateTime | null;
  status: "pending" | "accepted" | "declined" | "expired";
};

export type Opportunity = {
  id: string;
  company: string;
  jobTitle: string;
  location: string | null;
  stage: OpportunityStage;
  recruiterName: string;
  rounds: InterviewRound[];
  offer: Offer | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
};

export type ContactRequest = {
  id: string;
  company: string;
  recruiterName: string;
  jobTitle: string;
  message: string;
  requestedAt: IsoDateTime;
  status: "pending" | "shared" | "declined";
};

export type HireRecord = {
  company: string;
  jobTitle: string;
  hiredAt: IsoDate;
  startDate: IsoDate | null;
  ctc: Money | null;
};

export type Hiring = {
  status: HiringStatus;
  availability: Availability;
  opportunities: Opportunity[];
  contactRequests: ContactRequest[];
  hired: HireRecord | null;
};

/* ----------------------------------------------------------------------------
 * Notifications and support
 * ------------------------------------------------------------------------- */

export type NotificationKind = "status_change" | "action_required" | "reminder" | "recruiter" | "payment" | "system";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  href: string | null;
  createdAt: IsoDateTime;
  readAt: IsoDateTime | null;
};

export type NotificationFeed = {
  unreadCount: number;
  items: AppNotification[];
};

export type SupportRequestInput = {
  topic: "profile" | "payment" | "verification" | "interview" | "listing" | "other";
  message: string;
};

/* ----------------------------------------------------------------------------
 * Staff: admins, interviewers and recruiters
 * ------------------------------------------------------------------------- */

export type ReviewQueueItem = {
  candidateId: string;
  name: string;
  email: string;
  headline: string;
  planName: string | null;
  submittedAt: IsoDateTime;
  verificationStatus: VerificationStatus;
  listingStatus: ListingStatus;
};

export type StaffCandidate = {
  id: string;
  profile: CandidateProfile;
  journey: Journey;
  verification: Verification;
  listing: Pick<Listing, "status" | "requestedAt" | "listedAt" | "reviewerNote">;
  aiInterviews: AiInterviewSummary[];
  expertInterviews: ExpertInterview[];
};

export type VerificationDecisionInput = {
  decision: "verified" | "changes_required" | "rejected";
  feedback: string;
  checks: { key: VerificationCheckKey; status: CheckStatus; comment: string }[];
};

export type ListingDecisionInput = {
  decision: "approve" | "reject";
  note: string;
};

export type Interviewer = InterviewerSummary & {
  email: string;
  active: boolean;
  upcomingInterviews: number;
};

export type InterviewerInput = { name: string; email: string; title: string };

export type AvailabilitySlot = InterviewSlot & {
  booked: boolean;
  candidateName: string | null;
};

export type AvailabilityInput = {
  startsAt: IsoDateTime;
  durationMinutes: number;
};

export type InterviewerAssignment = {
  id: string;
  candidate: { id: string; name: string; headline: string };
  startsAt: IsoDateTime;
  endsAt: IsoDateTime;
  status: ExpertInterviewStatus;
  meetingUrl: string | null;
  feedbackDue: boolean;
  feedback: InterviewFeedback | null;
};

export type InterviewFeedbackInput = {
  outcome: "completed" | "no_show";
  rating: number | null;
  recommendation: Recommendation | null;
  summary: string;
  strengths: string[];
  improvements: string[];
};

export type TalentSearchQuery = {
  q?: string;
  skill?: string;
  location?: string;
  minExperience?: number;
  maxExperience?: number;
  availability?: AvailabilityStatus;
  workMode?: WorkMode;
  shortlisted?: boolean;
  page?: number;
};

export type TalentCard = {
  candidateId: string;
  displayName: string;
  headline: string;
  location: string;
  experienceYears: number | null;
  topSkills: string[];
  availability: Availability;
  aiScore: number | null;
  shortlisted: boolean;
  verifiedAt: IsoDateTime | null;
};

export type TalentSearchResult = {
  items: TalentCard[];
  total: number;
  page: number;
  pageSize: number;
};

export type RecruiterCandidateView = {
  profile: PublicProfile;
  shortlisted: boolean;
  opportunity: Opportunity | null;
  contactRequest: ContactRequest | null;
  /** Only present once the candidate agreed to share. */
  contact: { email: string; phone: string } | null;
};

export type ContactRequestInput = { jobTitle: string; message: string };

export type PipelineUpdateInput = {
  stage: OpportunityStage;
  jobTitle: string;
  location: string;
  roundName: string;
  roundAt: IsoDateTime | null;
  offerCtc: number | null;
  offerJoiningDate: IsoDate | null;
  hiredAt: IsoDate | null;
  startDate: IsoDate | null;
  note: string;
};
