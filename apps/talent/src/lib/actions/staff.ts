"use server";

import { failure, type ApiResult } from "@/lib/api/result";
import {
  availabilitySlotSchema,
  contactRequestSchema,
  interviewerSchema,
  interviewFeedbackSchema,
  listingDecisionSchema,
  pipelineUpdateSchema,
  verificationDecisionSchema,
} from "@/lib/journey/schemas";
import type { AvailabilitySlot, Interviewer } from "@/lib/journey/types";
import { idOrNull, invalidId, mutate, requireRole, validated } from "./helpers";

/* Admin ----------------------------------------------------------------------- */

export async function decideVerification(candidateId: unknown, values: unknown): Promise<ApiResult<null>> {
  const allowed = await requireRole("admin");
  if (!allowed.ok) return allowed;

  const id = idOrNull(candidateId);
  if (!id) return invalidId();

  const input = await validated(verificationDecisionSchema, values);
  if (!input.ok) return input;

  return mutate("POST", `/staff/candidates/${id}/verification`, { body: input.data });
}

export async function decideListing(candidateId: unknown, values: unknown): Promise<ApiResult<null>> {
  const allowed = await requireRole("admin");
  if (!allowed.ok) return allowed;

  const id = idOrNull(candidateId);
  if (!id) return invalidId();

  const input = await validated(listingDecisionSchema, values);
  if (!input.ok) return input;

  return mutate("POST", `/staff/candidates/${id}/listing`, { body: input.data });
}

export async function createInterviewer(values: unknown): Promise<ApiResult<Interviewer>> {
  const allowed = await requireRole("admin");
  if (!allowed.ok) return allowed;

  const input = await validated(interviewerSchema, values);
  if (!input.ok) return input;

  return mutate("POST", "/staff/interviewers", { body: input.data });
}

export async function setInterviewerActive(interviewerId: unknown, active: unknown): Promise<ApiResult<Interviewer>> {
  const allowed = await requireRole("admin");
  if (!allowed.ok) return allowed;

  const id = idOrNull(interviewerId);
  if (!id) return invalidId();
  if (typeof active !== "boolean") return failure("validation", "Invalid request.");

  return mutate("PATCH", `/staff/interviewers/${id}`, { body: { active } });
}

/* Interviewer ----------------------------------------------------------------- */

export async function addAvailability(values: unknown): Promise<ApiResult<AvailabilitySlot>> {
  const allowed = await requireRole("interviewer");
  if (!allowed.ok) return allowed;

  const input = await validated(availabilitySlotSchema, values);
  if (!input.ok) return input;

  return mutate("POST", "/staff/me/availability", { body: input.data });
}

export async function removeAvailability(slotId: unknown): Promise<ApiResult<null>> {
  const allowed = await requireRole("interviewer");
  if (!allowed.ok) return allowed;

  const id = idOrNull(slotId);
  if (!id) return invalidId();

  return mutate("DELETE", `/staff/me/availability/${id}`);
}

export async function submitInterviewFeedback(interviewId: unknown, values: unknown): Promise<ApiResult<null>> {
  const allowed = await requireRole("interviewer");
  if (!allowed.ok) return allowed;

  const id = idOrNull(interviewId);
  if (!id) return invalidId();

  const input = await validated(interviewFeedbackSchema, values);
  if (!input.ok) return input;

  return mutate("POST", `/staff/interviews/${id}/feedback`, { body: input.data });
}

/* Recruiter ------------------------------------------------------------------- */

export async function setShortlisted(candidateId: unknown, shortlisted: unknown): Promise<ApiResult<null>> {
  const allowed = await requireRole("recruiter");
  if (!allowed.ok) return allowed;

  const id = idOrNull(candidateId);
  if (!id) return invalidId();
  if (typeof shortlisted !== "boolean") return failure("validation", "Invalid request.");

  return mutate(shortlisted ? "POST" : "DELETE", `/staff/talent/${id}/shortlist`);
}

export async function requestContact(candidateId: unknown, values: unknown): Promise<ApiResult<null>> {
  const allowed = await requireRole("recruiter");
  if (!allowed.ok) return allowed;

  const id = idOrNull(candidateId);
  if (!id) return invalidId();

  const input = await validated(contactRequestSchema, values);
  if (!input.ok) return input;

  return mutate("POST", `/staff/talent/${id}/contact-requests`, { body: input.data });
}

/** Hiring is only ever recorded here, by a recruiter, with a hired date. */
export async function updatePipeline(candidateId: unknown, values: unknown): Promise<ApiResult<null>> {
  const allowed = await requireRole("recruiter");
  if (!allowed.ok) return allowed;

  const id = idOrNull(candidateId);
  if (!id) return invalidId();

  const input = await validated(pipelineUpdateSchema, values);
  if (!input.ok) return input;

  return mutate("POST", `/staff/talent/${id}/pipeline`, { body: input.data });
}
