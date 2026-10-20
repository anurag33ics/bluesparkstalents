import "server-only";
import { cookies } from "next/headers";
import { previewRequest } from "./preview";
import { failure, type ApiErrorKind, type ApiFailure, type ApiResult } from "./result";

/*
 * Server-side client for apps/api (see docs/journey-api.md). The API owns
 * authentication, workflow rules and permissions; this client forwards the
 * signed-in user's session token and maps responses to ApiResult values.
 *
 * Modes:
 * - live: API_URL is set.
 * - preview: API_URL is unset and API_PREVIEW=true outside production. Reads
 *   return sample data and writes are refused, so the UI can be reviewed.
 * - unconfigured: neither; screens show a "service unavailable" state.
 */

const apiUrl = (process.env.API_URL ?? "").replace(/\/+$/, "");
const sessionCookie = process.env.AUTH_COOKIE_NAME ?? "bs_session";
const timeoutMs = 15_000;

export type ApiMode = "live" | "preview" | "unconfigured";

export function apiMode(): ApiMode {
  if (apiUrl) return "live";
  if (process.env.API_PREVIEW === "true" && process.env.NODE_ENV !== "production") return "preview";
  return "unconfigured";
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type Query = Record<string, string | number | boolean | null | undefined>;

type RequestOptions = {
  method?: HttpMethod;
  query?: Query;
  body?: unknown;
  /** Multipart uploads; takes precedence over `body`. */
  form?: FormData;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
  const method = options.method ?? "GET";
  const mode = apiMode();

  if (mode === "preview") return previewRequest<T>(method, path, options.query ?? {});
  if (mode === "unconfigured") {
    return failure("unconfigured", "The talent API isn't connected yet, so we can't load your journey right now.");
  }

  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return failure("unauthorized", "Your session has ended. Sign in again to continue.");

  const url = new URL(`${apiUrl}/v1${path}`);
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  let body: BodyInit | undefined;
  if (options.form) {
    body = options.form;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    console.error(`[api] ${method} ${path} failed to connect`, error);
    return failure("network", fallbackMessages.network);
  }

  if (response.status === 204) return { ok: true, data: undefined as T };

  const payload: unknown = await response.json().catch(() => null);
  if (response.ok) return { ok: true, data: payload as T };

  if (response.status >= 500) console.error(`[api] ${method} ${path} returned ${response.status}`, payload);
  return { ok: false, error: toFailure(response.status, payload) };
}

/** Error body every apps/api endpoint returns on 4xx/5xx. */
type ErrorBody = {
  error?: { code?: string; message?: string; fields?: Record<string, string> };
};

const kindByStatus: Record<number, ApiErrorKind> = {
  400: "validation",
  401: "unauthorized",
  403: "forbidden",
  404: "not_found",
  409: "conflict",
  422: "validation",
  429: "rate_limited",
};

const fallbackMessages: Record<ApiErrorKind, string> = {
  unconfigured: "The talent API isn't connected yet.",
  preview: "Preview mode: changes aren't saved.",
  network: "We couldn't reach our servers. Check your connection and try again.",
  unauthorized: "Your session has ended. Sign in again to continue.",
  forbidden: "You don't have permission to do that.",
  not_found: "We couldn't find what you were looking for.",
  conflict: "That step isn't available right now. Refresh the page and try again.",
  validation: "Some details need fixing. Check the highlighted fields.",
  rate_limited: "Too many attempts. Wait a moment and try again.",
  server: "Something went wrong on our side. Please try again in a few minutes.",
};

function toFailure(status: number, payload: unknown): ApiFailure {
  const kind = kindByStatus[status] ?? "server";
  const body = (payload ?? {}) as ErrorBody;

  return {
    kind,
    // Only 4xx messages are written for candidates; 5xx bodies may carry internals.
    message: status < 500 && body.error?.message ? body.error.message : fallbackMessages[kind],
    fieldErrors: status < 500 ? (body.error?.fields ?? null) : null,
  };
}
