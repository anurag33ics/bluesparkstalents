/*
 * Yup schemas shared by the Formik forms (instant feedback) and the server
 * actions (re-validated before anything reaches the API). The API must apply
 * the same rules; these exist for UX, not as the source of truth.
 */
import * as Yup from "yup";
import { notificationChannels, notificationTopics, type ProfileSectionKey } from "./types";

const currentYear = new Date().getFullYear();
const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const genderValues = ["female", "male", "non_binary", "prefer_not_to_say"] as const;
export const employmentTypes = ["full_time", "part_time", "contract", "internship", "freelance"] as const;
export const skillLevels = ["beginner", "intermediate", "advanced", "expert"] as const;
export const jobTypes = ["full_time", "part_time", "contract", "internship"] as const;
export const workModes = ["onsite", "hybrid", "remote"] as const;
export const experienceLevels = ["fresher", "junior", "mid", "senior", "lead"] as const;
export const availabilityStatuses = ["immediate", "notice_period", "not_looking"] as const;
export const documentTypes = ["government_id", "degree_certificate", "experience_letter", "other"] as const;
export const supportTopics = ["profile", "payment", "verification", "interview", "listing", "other"] as const;
export const checkKeys = ["identity", "resume", "education", "experience", "skills"] as const;
export const checkStatuses = ["pending", "approved", "changes_required", "rejected"] as const;
export const recommendations = ["strong_yes", "yes", "maybe", "no"] as const;
export const opportunityStages = ["shortlisted", "interviewing", "offer", "hired", "not_selected", "withdrawn"] as const;
export const slotDurations = [30, 45, 60] as const;
export const deletionReasons = ["found_job", "not_useful", "privacy", "too_many_emails", "other"] as const;

/** Empty form inputs become null instead of failing the number type check. */
const numberOrNull = () =>
  Yup.number()
    .transform((value, original) => (original === "" || original == null ? null : value))
    .typeError("Enter a number")
    .nullable();

const optionalDate = () =>
  Yup.string()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .matches(datePattern, { message: "Enter a valid date", excludeEmptyString: true });

const optionalUrl = () =>
  Yup.string().trim().max(200, "Keep it under 200 characters").url("Enter a full URL starting with https://").default("");

function yearsSince(date: string) {
  const from = new Date(`${date}T00:00:00Z`);
  const now = new Date();
  let years = now.getUTCFullYear() - from.getUTCFullYear();
  const months = now.getUTCMonth() - from.getUTCMonth();
  if (months < 0 || (months === 0 && now.getUTCDate() < from.getUTCDate())) years -= 1;
  return years;
}

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

/* ----------------------------------------------------------------------------
 * Step 1: Profile sections
 * ------------------------------------------------------------------------- */

export const personalSchema = Yup.object({
  firstName: Yup.string().trim().min(2, "Use at least 2 characters").max(50, "Keep it under 50 characters").required("First name is required"),
  lastName: Yup.string().trim().max(50, "Keep it under 50 characters").required("Last name is required"),
  dateOfBirth: Yup.string()
    .nullable()
    .required("Date of birth is required")
    .matches(datePattern, "Enter a valid date")
    .test("min-age", "You must be at least 16 years old", (value) => !value || yearsSince(value) >= 16)
    .test("max-age", "Enter a valid date", (value) => !value || yearsSince(value) <= 80),
  gender: Yup.string().nullable().oneOf([...genderValues, null], "Choose an option").default(null),
  headline: Yup.string().trim().min(10, "Use at least 10 characters").max(120, "Keep it under 120 characters").required("Professional headline is required"),
  summary: Yup.string().trim().min(50, "Write at least 50 characters").max(1500, "Keep it under 1500 characters").required("Profile summary is required"),
});

export const contactSchema = Yup.object({
  phone: Yup.string()
    .trim()
    .matches(/^\+?[0-9]{10,15}$/, "Enter a valid phone number, including the country code")
    .required("Phone number is required"),
  city: Yup.string().trim().max(60).required("City is required"),
  state: Yup.string().trim().max(60).required("State is required"),
  country: Yup.string().trim().max(60).required("Country is required"),
  linkedinUrl: optionalUrl().test("linkedin", "Use your linkedin.com profile URL", (value) => !value || /linkedin\.com\//i.test(value)),
  portfolioUrl: optionalUrl(),
});

const educationEntrySchema = Yup.object({
  id: Yup.string().optional(),
  institution: Yup.string().trim().max(120).required("Institution is required"),
  degree: Yup.string().trim().max(80).required("Degree is required"),
  fieldOfStudy: Yup.string().trim().max(80).required("Field of study is required"),
  startYear: numberOrNull()
    .integer("Enter a valid year")
    .min(1960, "Enter a valid year")
    .max(currentYear, "Can't be in the future")
    .required("Start year is required"),
  endYear: numberOrNull()
    .integer("Enter a valid year")
    .max(currentYear + 6, "Enter a valid year")
    .test("after-start", "Must be the same as or after the start year", function (value) {
      const { startYear } = this.parent as { startYear: number | null };
      return value == null || startYear == null || value >= startYear;
    }),
  grade: Yup.string().trim().max(20, "Keep it under 20 characters").default(""),
});

export const educationSchema = Yup.object({
  items: Yup.array().of(educationEntrySchema).min(1, "Add at least one qualification").max(8, "Add up to 8 qualifications").required(),
});

const experienceEntrySchema = Yup.object({
  id: Yup.string().optional(),
  company: Yup.string().trim().max(120).required("Company is required"),
  title: Yup.string().trim().max(80).required("Job title is required"),
  employmentType: Yup.string().oneOf(employmentTypes, "Choose an employment type").required("Choose an employment type"),
  startMonth: Yup.string()
    .required("Start month is required")
    .matches(monthPattern, "Enter a valid month")
    .test("not-future", "Can't be in the future", (value) => !value || value <= currentMonth()),
  current: Yup.boolean().default(false),
  endMonth: Yup.string()
    .nullable()
    .when("current", {
      is: true,
      then: (schema) => schema.transform(() => null),
      otherwise: (schema) =>
        schema
          .required("End month is required")
          .matches(monthPattern, "Enter a valid month")
          .test("after-start", "Must be after the start month", function (value) {
            const { startMonth } = this.parent as { startMonth: string };
            return !value || !startMonth || value >= startMonth;
          }),
    }),
  description: Yup.string().trim().max(1000, "Keep it under 1000 characters").default(""),
});

export const experienceSchema = Yup.object({
  fresher: Yup.boolean().default(false),
  totalYears: numberOrNull()
    .min(0, "Can't be negative")
    .max(50, "Enter a valid number")
    .when("fresher", {
      is: false,
      then: (schema) => schema.required("Total experience is required"),
    }),
  items: Yup.array()
    .of(experienceEntrySchema)
    .max(10, "Add up to 10 roles")
    .when("fresher", {
      is: false,
      then: (schema) => schema.min(1, "Add your work experience, or mark yourself as a fresher"),
    })
    .required(),
});

export const skillsSchema = Yup.object({
  items: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().trim().max(40, "Keep it under 40 characters").required("Skill name is required"),
        level: Yup.string().oneOf(skillLevels, "Choose a level").required("Choose a level"),
      })
    )
    .min(3, "Add at least 3 skills")
    .max(20, "Add up to 20 skills")
    .test("unique", "Each skill should only appear once", (items) => {
      const names = (items ?? []).map((item) => item.name?.trim().toLowerCase());
      return new Set(names).size === names.length;
    })
    .required(),
});

export const preferencesSchema = Yup.object({
  desiredRoles: Yup.array().of(Yup.string().trim().max(60).required()).min(1, "Add at least one role").max(5, "Add up to 5 roles").required(),
  jobTypes: Yup.array().of(Yup.string().oneOf(jobTypes).required()).min(1, "Choose at least one job type").required(),
  workModes: Yup.array().of(Yup.string().oneOf(workModes).required()).min(1, "Choose at least one work mode").required(),
  preferredLocations: Yup.array().of(Yup.string().trim().max(60).required()).min(1, "Add at least one location").max(5, "Add up to 5 locations").required(),
  expectedSalary: numberOrNull().min(0, "Can't be negative").max(100_000_000, "Enter a valid amount"),
  salaryCurrency: Yup.string().default("INR"),
  noticePeriodDays: numberOrNull().integer().min(0, "Can't be negative").max(180, "Enter up to 180 days").required("Notice period is required"),
  willingToRelocate: Yup.boolean().default(false),
});

export const profileSectionSchemas = {
  personal: personalSchema,
  contact: contactSchema,
  education: educationSchema,
  experience: experienceSchema,
  skills: skillsSchema,
  preferences: preferencesSchema,
} satisfies Record<Exclude<ProfileSectionKey, "resume">, Yup.AnyObjectSchema>;

export type EditableProfileSection = keyof typeof profileSectionSchemas;

export function isEditableSection(value: unknown): value is EditableProfileSection {
  return typeof value === "string" && value in profileSectionSchemas;
}

/** Final step of the profile: the candidate vouches that the details are genuine. */
export const profileDeclarationSchema = Yup.object({
  declaration: Yup.boolean()
    .oneOf([true], "Please confirm your details are authentic to submit your profile")
    .required("Please confirm your details are authentic to submit your profile"),
});

/* ----------------------------------------------------------------------------
 * File uploads
 * ------------------------------------------------------------------------- */

export type UploadRules = { maxBytes: number; mimeTypes: string[]; accept: string; label: string };

export const resumeUploadRules: UploadRules = {
  maxBytes: 5 * 1024 * 1024,
  mimeTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  accept: ".pdf,.doc,.docx",
  label: "PDF or Word, up to 5 MB",
};

export const documentUploadRules: UploadRules = {
  maxBytes: 5 * 1024 * 1024,
  mimeTypes: ["application/pdf", "image/jpeg", "image/png"],
  accept: ".pdf,.jpg,.jpeg,.png",
  label: "PDF, JPG or PNG, up to 5 MB",
};

export function checkUpload(file: File | null | undefined, rules: UploadRules): string | null {
  if (!file || file.size === 0) return "Choose a file to upload";
  if (!rules.mimeTypes.includes(file.type)) return `Upload a ${rules.label.replace(/, up to .*$/, "")} file`;
  if (file.size > rules.maxBytes) return `The file is too large (max ${Math.round(rules.maxBytes / 1024 / 1024)} MB)`;
  return null;
}

/* ----------------------------------------------------------------------------
 * Steps 3-7
 * ------------------------------------------------------------------------- */

export const verificationSubmitSchema = Yup.object({
  declaration: Yup.boolean().oneOf([true], "Please confirm the declaration to continue").required("Please confirm the declaration to continue"),
});

export const documentTypeSchema = Yup.string().oneOf(documentTypes, "Choose a document type").required("Choose a document type");

export const aiSetupSchema = Yup.object({
  role: Yup.string().trim().max(80).required("Choose a job role"),
  experienceLevel: Yup.string().oneOf(experienceLevels, "Choose your experience level").required("Choose your experience level"),
  skillCategory: Yup.string().trim().max(80).required("Choose a skill category"),
});

export const aiAnswerSchema = Yup.object({
  answer: Yup.string().trim().min(20, "Write at least 20 characters so the answer can be assessed").max(4000, "Keep it under 4000 characters").required("Write an answer before saving"),
});

export const cancelInterviewSchema = Yup.object({
  reason: Yup.string().trim().min(5, "Tell us briefly why").max(500, "Keep it under 500 characters").required("Tell us briefly why"),
});

export const visibilitySchema = Yup.object({
  showFullName: Yup.boolean().required(),
  showCurrentCompany: Yup.boolean().required(),
  showEducation: Yup.boolean().required(),
  showResume: Yup.boolean().required(),
  showExpectedSalary: Yup.boolean().required(),
  showAiAssessment: Yup.boolean().required(),
  showExpertFeedback: Yup.boolean().required(),
});

export const availabilitySchema = Yup.object({
  status: Yup.string().oneOf(availabilityStatuses, "Choose your availability").required("Choose your availability"),
  noticePeriodDays: numberOrNull()
    .integer()
    .min(0, "Can't be negative")
    .max(180, "Enter up to 180 days")
    .when("status", {
      is: "notice_period",
      then: (schema) => schema.required("How many days of notice are left?"),
    }),
  availableFrom: optionalDate(),
});

export const supportRequestSchema = Yup.object({
  topic: Yup.string().oneOf(supportTopics, "Choose a topic").required("Choose a topic"),
  message: Yup.string().trim().min(20, "Describe the issue in at least 20 characters").max(2000, "Keep it under 2000 characters").required("Describe the issue"),
});

/* ----------------------------------------------------------------------------
 * Account settings
 * ------------------------------------------------------------------------- */

const channelSwitches = Yup.object(
  Object.fromEntries(notificationChannels.map((channel) => [channel, Yup.boolean().required()]))
);

export const notificationPreferencesSchema = Yup.object(
  Object.fromEntries(notificationTopics.map((topic) => [topic, channelSwitches.required()]))
);

function isValidTimeZone(value: string | undefined) {
  if (!value) return false;
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export const timeZoneSchema = Yup.object({
  timeZone: Yup.string().max(64).required("Choose a time zone").test("time-zone", "Choose a time zone from the list", isValidTimeZone),
});

/** Accounts created with Google may not have a password; the API asks for it when they do. */
const currentPassword = () => Yup.string().max(128, "Keep it under 128 characters").default("");

const newPassword = () =>
  Yup.string()
    .min(8, "Use at least 8 characters")
    .max(128, "Keep it under 128 characters")
    .matches(/[A-Za-z]/, "Include at least one letter")
    .matches(/\d/, "Include at least one number");

export const changeEmailSchema = Yup.object({
  newEmail: Yup.string().trim().lowercase().max(254, "Keep it under 254 characters").email("Enter a valid email address").required("Enter your new email address"),
  currentPassword: currentPassword(),
});

export const changePasswordSchema = Yup.object({
  currentPassword: currentPassword(),
  newPassword: newPassword()
    .notOneOf([Yup.ref("currentPassword")], "Choose a different password from your current one")
    .required("Enter a new password"),
  confirmPassword: Yup.string().oneOf([Yup.ref("newPassword")], "Passwords don't match").required("Re-enter your new password"),
});

export const deleteAccountSchema = Yup.object({
  reason: Yup.string().nullable().oneOf([...deletionReasons, null], "Choose a reason").default(null),
  currentPassword: currentPassword(),
  confirmation: Yup.string().trim().oneOf(["DELETE"], "Type DELETE to confirm").required("Type DELETE to confirm"),
});

/** Forms ask for the current password only when the account has one. */
export function requirePassword<S extends Yup.AnyObjectSchema>(schema: S, hasPassword: boolean): S {
  return hasPassword
    ? (schema.shape({ currentPassword: currentPassword().required("Enter your current password") }) as unknown as S)
    : schema;
}

/* ----------------------------------------------------------------------------
 * Staff
 * ------------------------------------------------------------------------- */

export const verificationDecisionSchema = Yup.object({
  decision: Yup.string().oneOf(["verified", "changes_required", "rejected"] as const, "Choose a decision").required("Choose a decision"),
  feedback: Yup.string()
    .trim()
    .max(2000, "Keep it under 2000 characters")
    .default("")
    .when("decision", {
      is: (decision: string) => decision !== "verified",
      then: (schema) => schema.min(10, "Explain what the candidate needs to know").required("Feedback is required"),
    }),
  checks: Yup.array()
    .of(
      Yup.object({
        key: Yup.string().oneOf(checkKeys).required(),
        status: Yup.string().oneOf(checkStatuses).required(),
        comment: Yup.string()
          .trim()
          .max(500)
          .default("")
          .when("status", {
            is: (status: string) => status === "changes_required" || status === "rejected",
            then: (schema) => schema.required("Add a comment so the candidate knows what to fix"),
          }),
      })
    )
    .required(),
}).test("all-approved", function (value) {
  if (value.decision !== "verified") return true;
  if (value.checks.every((check) => check.status === "approved")) return true;
  return this.createError({ path: "decision", message: "Approve every check before verifying the profile" });
});

export const listingDecisionSchema = Yup.object({
  decision: Yup.string().oneOf(["approve", "reject"] as const).required("Choose a decision"),
  note: Yup.string()
    .trim()
    .max(1000)
    .default("")
    .when("decision", {
      is: "reject",
      then: (schema) => schema.min(10, "Explain why so the candidate can act on it").required("A note is required"),
    }),
});

export const interviewerSchema = Yup.object({
  name: Yup.string().trim().max(80).required("Name is required"),
  email: Yup.string().trim().email("Enter a valid email address").required("Email is required"),
  title: Yup.string().trim().max(80).required("Title is required"),
});

export const availabilitySlotFormSchema = Yup.object({
  date: Yup.string()
    .required("Choose a date")
    .matches(datePattern, "Enter a valid date")
    .test("not-past", "Choose today or a later date", (value) => !value || value >= todayIso()),
  time: Yup.string().required("Choose a start time").matches(/^\d{2}:\d{2}$/, "Enter a valid time"),
  durationMinutes: Yup.number().oneOf(slotDurations, "Choose a duration").required("Choose a duration"),
});

export const availabilitySlotSchema = Yup.object({
  startsAt: Yup.string()
    .required()
    .test("iso", "Enter a valid start time", (value) => !!value && !Number.isNaN(Date.parse(value)))
    .test("future", "Slots must start in the future", (value) => !!value && Date.parse(value) > Date.now()),
  durationMinutes: Yup.number().oneOf(slotDurations, "Choose a duration").required(),
});

export const interviewFeedbackSchema = Yup.object({
  outcome: Yup.string().oneOf(["completed", "no_show"] as const).required("Choose an outcome"),
  rating: numberOrNull().when("outcome", {
    is: "completed",
    then: (schema) => schema.integer().min(1, "Rate from 1 to 5").max(5, "Rate from 1 to 5").required("Rate the interview"),
  }),
  recommendation: Yup.string()
    .nullable()
    .oneOf([...recommendations, null])
    .when("outcome", {
      is: "completed",
      then: (schema) => schema.required("Choose a recommendation"),
    }),
  summary: Yup.string()
    .trim()
    .max(2000, "Keep it under 2000 characters")
    .when("outcome", {
      is: "completed",
      then: (schema) => schema.min(20, "Write at least 20 characters").required("Write a summary"),
      otherwise: (schema) => schema.min(5, "Add a short note").required("Add a short note"),
    }),
  strengths: Yup.array().of(Yup.string().trim().max(200).required()).max(10).default([]),
  improvements: Yup.array().of(Yup.string().trim().max(200).required()).max(10).default([]),
});

export const contactRequestSchema = Yup.object({
  jobTitle: Yup.string().trim().max(80).required("Job title is required"),
  message: Yup.string().trim().min(20, "Write at least 20 characters").max(1000, "Keep it under 1000 characters").required("Add a message for the candidate"),
});

export const pipelineUpdateSchema = Yup.object({
  stage: Yup.string().oneOf(opportunityStages, "Choose a stage").required("Choose a stage"),
  jobTitle: Yup.string().trim().max(80).required("Job title is required"),
  location: Yup.string().trim().max(80).default(""),
  roundName: Yup.string()
    .trim()
    .max(80)
    .default("")
    .when("stage", {
      is: "interviewing",
      then: (schema) => schema.required("Name the interview round"),
    }),
  roundAt: Yup.string().nullable().default(null),
  offerCtc: numberOrNull().min(0, "Can't be negative"),
  offerJoiningDate: optionalDate(),
  hiredAt: optionalDate().when("stage", {
    is: "hired",
    then: (schema) =>
      schema
        .required("Hired date is required")
        .test("not-future", "Can't be in the future", (value) => !value || value <= todayIso()),
  }),
  startDate: optionalDate(),
  note: Yup.string().trim().max(1000).default(""),
});

/* ----------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------- */

export type FieldErrors = Record<string, string>;

export type Validated<T> = { ok: true; data: T } | { ok: false; fieldErrors: FieldErrors };

/** Validates and casts, collecting one message per field path (e.g. "items[0].degree"). */
export async function validateWith<S extends Yup.AnySchema>(
  schema: S,
  input: unknown
): Promise<Validated<Yup.InferType<S>>> {
  try {
    const data = await schema.validate(input, { abortEarly: false, stripUnknown: true });
    return { ok: true, data };
  } catch (error) {
    if (!(error instanceof Yup.ValidationError)) throw error;

    const fieldErrors: FieldErrors = {};
    for (const issue of error.inner.length ? error.inner : [error]) {
      const path = issue.path || "form";
      if (!(path in fieldErrors)) fieldErrors[path] = issue.message;
    }
    return { ok: false, fieldErrors };
  }
}
