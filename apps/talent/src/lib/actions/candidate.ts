"use server";

import { apiRequest } from "@/lib/api/client";
import { failure, type ApiResult } from "@/lib/api/result";
import {
  aiAnswerSchema,
  aiSetupSchema,
  availabilitySchema,
  cancelInterviewSchema,
  checkUpload,
  documentTypeSchema,
  documentUploadRules,
  isEditableSection,
  profileDeclarationSchema,
  profileSectionSchemas,
  resumeUploadRules,
  supportRequestSchema,
  verificationSubmitSchema,
  visibilitySchema,
} from "@/lib/journey/schemas";
import type {
  AiInterviewSession,
  CandidateProfile,
  CheckoutOrder,
  ExpertInterview,
  Payment,
  StoredFile,
  VerificationDocument,
} from "@/lib/journey/types";
import { idOrNull, invalidId, isTimeZone, mutate, validated } from "./helpers";

/* Step 1: Profile ---------------------------------------------------------- */

export async function saveProfileSection(section: unknown, values: unknown): Promise<ApiResult<CandidateProfile>> {
  if (!isEditableSection(section)) return failure("validation", "Unknown profile section.");

  const input = await validated(profileSectionSchemas[section], values);
  if (!input.ok) return input;

  return mutate("PATCH", `/me/profile/${section}`, { body: input.data });
}

export async function uploadResume(formData: FormData): Promise<ApiResult<StoredFile>> {
  const file = formData.get("file");
  const problem = checkUpload(file instanceof File ? file : null, resumeUploadRules);
  if (problem) return failure("validation", problem, { file: problem });

  const form = new FormData();
  form.set("file", file as File);
  return mutate("POST", "/me/profile/resume", { form });
}

/**
 * Final profile step. The candidate must confirm the details are authentic; the
 * API checks every mandatory field before marking the stage complete.
 */
export async function completeProfile(values: unknown): Promise<ApiResult<CandidateProfile>> {
  const input = await validated(profileDeclarationSchema, values);
  if (!input.ok) return input;
  return mutate("POST", "/me/profile/complete", { body: input.data });
}

/* Step 2: Plan and payment ------------------------------------------------- */

/** Creates a Razorpay order on the API; the browser then opens Checkout with it. */
export async function createCheckout(planId: unknown): Promise<ApiResult<CheckoutOrder>> {
  const id = idOrNull(planId);
  if (!id) return invalidId();
  return apiRequest("/me/payments/orders", { method: "POST", body: { planId: id } });
}

/** The API verifies the Razorpay signature with its secret before activating the plan. */
export async function confirmPayment(paymentId: unknown, confirmation: unknown): Promise<ApiResult<Payment>> {
  const id = idOrNull(paymentId);
  const fields = confirmation as Record<string, unknown> | null;
  const orderId = idOrNull(fields?.razorpayOrderId);
  const gatewayPaymentId = idOrNull(fields?.razorpayPaymentId);
  const signature = typeof fields?.razorpaySignature === "string" && /^[a-f0-9]{64}$/i.test(fields.razorpaySignature)
    ? fields.razorpaySignature
    : null;

  if (!id || !orderId || !gatewayPaymentId || !signature) {
    return failure("validation", "We couldn't confirm this payment. If money was debited, it will be confirmed automatically.");
  }

  return mutate(`POST`, `/me/payments/${id}/verify`, {
    body: { razorpayOrderId: orderId, razorpayPaymentId: gatewayPaymentId, razorpaySignature: signature },
  });
}

export async function reportPaymentFailure(paymentId: unknown, details: unknown): Promise<ApiResult<null>> {
  const id = idOrNull(paymentId);
  if (!id) return invalidId();

  const error = (details ?? {}) as Record<string, unknown>;
  const text = (value: unknown) => (typeof value === "string" ? value.slice(0, 300) : null);

  return mutate("POST", `/me/payments/${id}/failure`, {
    body: { code: text(error.code), description: text(error.description), reason: text(error.reason) },
  });
}

/* Step 3: Verification ----------------------------------------------------- */

export async function uploadVerificationDocument(formData: FormData): Promise<ApiResult<VerificationDocument>> {
  const type = await validated(documentTypeSchema, formData.get("type"));
  if (!type.ok) return failure("validation", "Choose a document type", { type: "Choose a document type" });

  const file = formData.get("file");
  const problem = checkUpload(file instanceof File ? file : null, documentUploadRules);
  if (problem) return failure("validation", problem, { file: problem });

  const form = new FormData();
  form.set("type", type.data);
  form.set("file", file as File);
  return mutate("POST", "/me/verification/documents", { form });
}

export async function removeVerificationDocument(documentId: unknown): Promise<ApiResult<null>> {
  const id = idOrNull(documentId);
  if (!id) return invalidId();
  return mutate("DELETE", `/me/verification/documents/${id}`);
}

export async function submitVerification(values: unknown): Promise<ApiResult<null>> {
  const input = await validated(verificationSubmitSchema, values);
  if (!input.ok) return input;
  return mutate("POST", "/me/verification/submit", { body: input.data });
}

/* Step 4: AI mock interview ------------------------------------------------ */

export async function startAiInterview(values: unknown): Promise<ApiResult<AiInterviewSession>> {
  const input = await validated(aiSetupSchema, values);
  if (!input.ok) return input;

  return mutate("POST", "/me/ai-interviews", { body: input.data });
}

export async function saveAiAnswer(sessionId: unknown, questionId: unknown, values: unknown): Promise<ApiResult<AiInterviewSession>> {
  const session = idOrNull(sessionId);
  const question = idOrNull(questionId);
  if (!session || !question) return invalidId();

  const input = await validated(aiAnswerSchema, values);
  if (!input.ok) return input;

  return mutate("POST", `/me/ai-interviews/${session}/answers`, { body: { questionId: question, answer: input.data.answer } });
}

export async function finishAiInterview(sessionId: unknown): Promise<ApiResult<AiInterviewSession>> {
  const session = idOrNull(sessionId);
  if (!session) return invalidId();
  return mutate("POST", `/me/ai-interviews/${session}/complete`);
}

/* Step 5: One-to-one interview --------------------------------------------- */

export async function bookInterview(slotId: unknown, timeZone: unknown): Promise<ApiResult<ExpertInterview>> {
  const slot = idOrNull(slotId);
  if (!slot) return invalidId();
  return mutate("POST", "/me/interviews", { body: { slotId: slot, timeZone: isTimeZone(timeZone) ? timeZone : "UTC" } });
}

export async function rescheduleInterview(interviewId: unknown, slotId: unknown, timeZone: unknown): Promise<ApiResult<ExpertInterview>> {
  const interview = idOrNull(interviewId);
  const slot = idOrNull(slotId);
  if (!interview || !slot) return invalidId();
  return mutate("POST", `/me/interviews/${interview}/reschedule`, {
    body: { slotId: slot, timeZone: isTimeZone(timeZone) ? timeZone : "UTC" },
  });
}

export async function cancelInterview(interviewId: unknown, values: unknown): Promise<ApiResult<ExpertInterview>> {
  const interview = idOrNull(interviewId);
  if (!interview) return invalidId();

  const input = await validated(cancelInterviewSchema, values);
  if (!input.ok) return input;

  return mutate("POST", `/me/interviews/${interview}/cancel`, { body: input.data });
}

/* Step 6: Listing ------------------------------------------------------------ */

export async function updateVisibility(values: unknown): Promise<ApiResult<null>> {
  const input = await validated(visibilitySchema, values);
  if (!input.ok) return input;
  return mutate("PUT", "/me/listing/visibility", { body: input.data });
}

export async function requestListing(): Promise<ApiResult<null>> {
  return mutate("POST", "/me/listing/request");
}

export async function setListingPaused(paused: unknown): Promise<ApiResult<null>> {
  if (typeof paused !== "boolean") return failure("validation", "Invalid request.");
  return mutate("POST", "/me/listing/pause", { body: { paused } });
}

/* Step 7: Hiring ------------------------------------------------------------- */

export async function updateAvailability(values: unknown): Promise<ApiResult<null>> {
  const input = await validated(availabilitySchema, values);
  if (!input.ok) return input;
  return mutate("PUT", "/me/hiring/availability", { body: input.data });
}

export async function respondToContactRequest(requestId: unknown, decision: unknown): Promise<ApiResult<null>> {
  const id = idOrNull(requestId);
  if (!id) return invalidId();
  if (decision !== "share" && decision !== "decline") return failure("validation", "Invalid request.");
  return mutate("POST", `/me/hiring/contact-requests/${id}`, { body: { decision } });
}

export async function respondToOffer(opportunityId: unknown, decision: unknown): Promise<ApiResult<null>> {
  const id = idOrNull(opportunityId);
  if (!id) return invalidId();
  if (decision !== "accept" && decision !== "decline") return failure("validation", "Invalid request.");
  return mutate("POST", `/me/hiring/opportunities/${id}/offer`, { body: { decision } });
}

/* Notifications and support ------------------------------------------------- */

export async function markNotificationsRead(ids?: unknown): Promise<ApiResult<null>> {
  const list = Array.isArray(ids) ? ids.map(idOrNull).filter((id): id is string => id !== null).slice(0, 100) : undefined;
  return mutate("POST", "/me/notifications/read", { body: list ? { ids: list } : {} });
}

export async function submitSupportRequest(values: unknown): Promise<ApiResult<{ id: string }>> {
  const input = await validated(supportRequestSchema, values);
  if (!input.ok) return input;
  return mutate("POST", "/me/support-requests", { body: input.data });
}
