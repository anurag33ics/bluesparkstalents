import "server-only";
import { refresh } from "next/cache";
import type * as Yup from "yup";
import { getCurrentUser } from "@/lib/api/candidate";
import { apiRequest, type HttpMethod } from "@/lib/api/client";
import { failure, type ApiResult } from "@/lib/api/result";
import { hasRole } from "@/lib/config";
import { validateWith } from "@/lib/journey/schemas";
import type { Role } from "@/lib/journey/types";

/*
 * Server actions are public POST endpoints, so each one re-validates its input
 * here before calling the API, and the API re-checks auth, permissions and
 * workflow rules on its side. Nothing from the client is trusted.
 */

const invalidMessage = "Some details need fixing. Check the highlighted fields.";

export async function validated<S extends Yup.AnySchema>(schema: S, input: unknown): Promise<ApiResult<Yup.InferType<S>>> {
  const result = await validateWith(schema, input);
  return result.ok ? { ok: true, data: result.data } : failure("validation", invalidMessage, result.fieldErrors);
}

/** Calls the API and, on success, refreshes the page so server data is current. */
export async function mutate<T>(
  method: Exclude<HttpMethod, "GET">,
  path: string,
  payload: { body?: unknown; form?: FormData } = {}
): Promise<ApiResult<T>> {
  const result = await apiRequest<T>(path, { method, ...payload });
  if (result.ok) refresh();
  return result;
}

/** IDs end up in API paths, so only accept plain identifiers. */
export function idOrNull(value: unknown): string | null {
  return typeof value === "string" && /^[A-Za-z0-9_-]{1,80}$/.test(value) ? value : null;
}

export const invalidId = () => failure("validation", "That item no longer exists. Refresh the page and try again.");

/** Defence in depth for staff actions; the API makes the real decision. */
export async function requireRole(...roles: Role[]): Promise<ApiResult<null>> {
  const user = await getCurrentUser();
  if (!user.ok) return user;
  if (!hasRole(user.data, ...roles)) return failure("forbidden", "You don't have permission to do that.");
  return { ok: true, data: null };
}

export function isTimeZone(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 64) return false;
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}
