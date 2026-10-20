/*
 * Result types shared by the data layer, server actions and client components.
 * Expected failures are values, not exceptions, so every screen can render a
 * proper error state instead of crashing.
 */

export type ApiErrorKind =
  | "unconfigured"
  | "preview"
  | "network"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "validation"
  | "rate_limited"
  | "server";

export type ApiFailure = {
  kind: ApiErrorKind;
  message: string;
  /** Field path to message, e.g. { "items[0].degree": "Degree is required" }. */
  fieldErrors: Record<string, string> | null;
};

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiFailure };

export function failure(
  kind: ApiErrorKind,
  message: string,
  fieldErrors: Record<string, string> | null = null
): { ok: false; error: ApiFailure } {
  return { ok: false, error: { kind, message, fieldErrors } };
}
