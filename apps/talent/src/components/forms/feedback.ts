"use client";

import { setIn, type FormikErrors } from "formik";
import { toast } from "@/components/ui/toast";
import type { ApiErrorKind, ApiResult } from "@/lib/api/result";

const errorTitles: Partial<Record<ApiErrorKind, string>> = {
  preview: "Preview mode",
  validation: "Please check the form",
  unauthorized: "Session expired",
  forbidden: "Not allowed",
  conflict: "Not available right now",
  network: "Connection problem",
  unconfigured: "Service unavailable",
};

/** Turns "items[0].degree" style paths into Formik's nested error shape. */
export function toFormikErrors<T>(fieldErrors: Record<string, string>): FormikErrors<T> {
  return Object.entries(fieldErrors).reduce<FormikErrors<T>>(
    (errors, [path, message]) => setIn(errors, path, message),
    {}
  );
}

/**
 * Reports an action result to the user. Returns true on success so callers can
 * continue (close a dialog, reset a form).
 */
export function settle<T, Values = unknown>(
  result: ApiResult<T>,
  options: { success?: string; successDetail?: string; setErrors?: (errors: FormikErrors<Values>) => void } = {}
): result is { ok: true; data: T } {
  if (result.ok) {
    if (options.success) toast.success(options.success, options.successDetail);
    return true;
  }

  const { error } = result;
  if (error.fieldErrors && options.setErrors) options.setErrors(toFormikErrors<Values>(error.fieldErrors));
  toast.error(errorTitles[error.kind] ?? "Something went wrong", error.message);
  return false;
}
