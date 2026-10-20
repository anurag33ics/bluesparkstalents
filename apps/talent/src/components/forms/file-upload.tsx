"use client";

import { useId, useRef, useState, useTransition } from "react";
import { FileText, Loader2, Upload } from "lucide-react";
import { cn } from "cn";
import { checkUpload, type UploadRules } from "@/lib/journey/schemas";
import type { ApiResult } from "@/lib/api/result";
import { settle } from "./feedback";

/**
 * File picker that validates type and size in the browser, then hands the file
 * to a server action (which validates again). Extra form fields can be added
 * with `fields`, e.g. a document type.
 */
export function FileUpload({
  upload,
  rules,
  label,
  success,
  fields,
  disabled,
  className,
}: {
  upload: (formData: FormData) => Promise<ApiResult<unknown>>;
  rules: UploadRules;
  label: string;
  success: string;
  fields?: () => Record<string, string> | string;
  disabled?: boolean;
  className?: string;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onChange(file: File | undefined) {
    const problem = checkUpload(file, rules);
    if (problem || !file) {
      setError(problem);
      return;
    }

    const extra = fields?.() ?? {};
    if (typeof extra === "string") {
      setError(extra);
      return;
    }

    setError(null);
    const formData = new FormData();
    for (const [key, value] of Object.entries(extra)) formData.set(key, value);
    formData.set("file", file);

    startTransition(async () => {
      const result = await upload(formData);
      if (!settle(result, { success })) setError(result.ok ? null : result.error.fieldErrors?.file ?? null);
      if (input.current) input.current.value = "";
    });
  }

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-7 text-center transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
          error ? "border-red-300 bg-red-50/40" : "border-brand-200 bg-brand-50/40 hover:border-brand-400 hover:bg-brand-50",
          (disabled || pending) && "pointer-events-none opacity-60"
        )}
      >
        <span className="flex size-11 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm">
          {pending ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Upload className="size-5" aria-hidden />}
        </span>
        <span className="text-sm font-semibold text-brand-950">{pending ? "Uploading…" : label}</span>
        <span className="text-xs text-muted-foreground">{rules.label}</span>
        <input
          ref={input}
          id={id}
          type="file"
          accept={rules.accept}
          disabled={disabled || pending}
          className="sr-only"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => onChange(event.target.files?.[0])}
        />
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function FileRow({ name, meta, href, action }: { name: string; meta: React.ReactNode; href: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-white p-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <FileText className="size-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <a href={href} target="_blank" rel="noreferrer" className="block truncate text-sm font-semibold text-brand-950 hover:text-brand-700 hover:underline">
          {name}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <p className="text-xs text-muted-foreground">{meta}</p>
      </div>
      {action}
    </div>
  );
}
