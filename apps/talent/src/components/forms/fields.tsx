"use client";

import { createContext, useContext, useId, useState } from "react";
import { getIn, useField, useFormikContext } from "formik";
import { Plus, X } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

/*
 * Formik-bound fields. Each renders a label, the control, a hint and an error
 * wired up with aria-invalid / aria-describedby. Use inside <Formik>.
 */

const controlClass = "h-11 rounded-xl border-slate-200 bg-white px-3.5 shadow-[0_1px_2px_rgba(11,21,51,0.04)] hover:border-slate-300";

/** Disables every field below it, e.g. while a profile is locked for review. */
export const FormDisabledContext = createContext(false);

function useDisabled(disabled: boolean | undefined) {
  return useContext(FormDisabledContext) || !!disabled;
}

function useFieldIds(name: string) {
  const base = useId();
  return { id: `${base}-${name.replace(/[^a-zA-Z0-9]/g, "-")}`, errorId: `${base}-error`, hintId: `${base}-hint` };
}

/** Shows a field's error once it has been touched or the form was submitted. */
function useFieldError(name: string) {
  const { errors, touched, submitCount } = useFormikContext();
  const error = getIn(errors, name);
  const wasTouched = getIn(touched, name) || submitCount > 0;
  return wasTouched && typeof error === "string" ? error : undefined;
}

export function FieldShell({
  id,
  label,
  required,
  hint,
  error,
  hintId,
  errorId,
  className,
  children,
}: {
  id?: string;
  label: React.ReactNode;
  required?: boolean;
  hint?: React.ReactNode;
  error?: string;
  hintId: string;
  errorId: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-semibold text-brand-950">
        {label}
        {required && (
          <span className="text-red-600" aria-hidden>
            *
          </span>
        )}
      </Label>
      {children}
      {hint && !error && (
        <p id={hintId} className="text-xs leading-5 text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs font-medium leading-5 text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

type CommonProps = {
  name: string;
  label: React.ReactNode;
  required?: boolean;
  hint?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

function describedBy(error: string | undefined, hint: React.ReactNode, ids: { errorId: string; hintId: string }) {
  if (error) return ids.errorId;
  return hint ? ids.hintId : undefined;
}

export function TextField({
  name,
  label,
  required,
  hint,
  className,
  disabled: disabledProp,
  ...inputProps
}: CommonProps & Omit<React.ComponentProps<"input">, "name" | "value" | "onChange" | "onBlur">) {
  const [field] = useField(name);
  const error = useFieldError(name);
  const ids = useFieldIds(name);
  const disabled = useDisabled(disabledProp);

  return (
    <FieldShell label={label} required={required} hint={hint} error={error} className={className} {...ids}>
      <Input
        {...inputProps}
        {...field}
        id={ids.id}
        value={field.value ?? ""}
        disabled={disabled}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy(error, hint, ids)}
        className={controlClass}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  name,
  label,
  required,
  hint,
  className,
  disabled: disabledProp,
  maxLength,
  rows = 4,
  placeholder,
}: CommonProps & { maxLength?: number; rows?: number; placeholder?: string }) {
  const [field] = useField<string>(name);
  const error = useFieldError(name);
  const ids = useFieldIds(name);
  const disabled = useDisabled(disabledProp);
  const length = (field.value ?? "").length;

  return (
    <FieldShell
      label={label}
      required={required}
      hint={
        maxLength ? (
          <span className="flex justify-between gap-3">
            <span>{hint}</span>
            <span className="tabular-nums">
              {length}/{maxLength}
            </span>
          </span>
        ) : (
          hint
        )
      }
      error={error}
      className={className}
      {...ids}
    >
      <Textarea
        {...field}
        id={ids.id}
        value={field.value ?? ""}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy(error, hint || maxLength, ids)}
        className="min-h-28 rounded-xl border-slate-200 bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(11,21,51,0.04)] hover:border-slate-300"
      />
    </FieldShell>
  );
}

export function SelectField({
  name,
  label,
  required,
  hint,
  className,
  disabled: disabledProp,
  options,
  placeholder = "Select…",
}: CommonProps & { options: Record<string, string>; placeholder?: string }) {
  const [field, , helpers] = useField<string | null>(name);
  const error = useFieldError(name);
  const ids = useFieldIds(name);
  const disabled = useDisabled(disabledProp);

  return (
    <FieldShell label={label} required={required} hint={hint} error={error} className={className} {...ids}>
      <Select
        items={options}
        value={field.value || null}
        disabled={disabled}
        onValueChange={(value) => {
          void helpers.setValue(value as string | null);
          void helpers.setTouched(true, false);
        }}
      >
        <SelectTrigger
          id={ids.id}
          aria-invalid={!!error}
          aria-describedby={describedBy(error, hint, ids)}
          className={cn(controlClass, "w-full data-[size=default]:h-11")}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(options).map(([value, text]) => (
            <SelectItem key={value} value={value}>
              {text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldShell>
  );
}

export function CheckboxField({
  name,
  label,
  description,
  className,
  disabled: disabledProp,
}: {
  name: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const [field, , helpers] = useField<boolean>(name);
  const error = useFieldError(name);
  const ids = useFieldIds(name);
  const disabled = useDisabled(disabledProp);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-start gap-3">
        <Checkbox
          id={ids.id}
          checked={!!field.value}
          disabled={disabled}
          onCheckedChange={(checked) => void helpers.setValue(checked === true)}
          aria-invalid={!!error}
          aria-describedby={error ? ids.errorId : description ? ids.hintId : undefined}
          className="mt-0.5"
        />
        <div>
          <Label htmlFor={ids.id} className="cursor-pointer text-sm font-semibold leading-5 text-brand-950">
            {label}
          </Label>
          {description && (
            <p id={ids.hintId} className="mt-0.5 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      {error && (
        <p id={ids.errorId} className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/** Multi-select as toggle chips, for small fixed option sets. */
export function ChipGroupField({
  name,
  label,
  required,
  hint,
  options,
  className,
  disabled: disabledProp,
}: CommonProps & { options: Record<string, string> }) {
  const [field, , helpers] = useField<string[]>(name);
  const error = useFieldError(name);
  const ids = useFieldIds(name);
  const disabled = useDisabled(disabledProp);
  const selected = field.value ?? [];

  const toggle = (value: string) => {
    void helpers.setValue(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
    void helpers.setTouched(true, false);
  };

  return (
    <fieldset
      className={cn("flex min-w-0 flex-col gap-2", className)}
      aria-invalid={!!error}
      aria-describedby={describedBy(error, hint, ids)}
      disabled={disabled}
    >
      <legend className="mb-2 text-sm font-semibold text-brand-950">
        {label}
        {required && (
          <span className="text-red-600" aria-hidden>
            *
          </span>
        )}
      </legend>
      <div className="flex flex-wrap gap-2">
        {Object.entries(options).map(([value, text]) => {
          const checked = selected.includes(value);
          return (
            <label
              key={value}
              className={cn(
                "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                checked ? "border-brand-600 bg-brand-600 text-white" : "border-brand-200 bg-white text-brand-950 hover:border-brand-300 hover:bg-brand-50"
              )}
            >
              <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggle(value)} />
              {text}
            </label>
          );
        })}
      </div>
      {hint && !error && (
        <p id={ids.hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={ids.errorId} className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}

/** Single choice as cards. Native radios keep keyboard behaviour for free. */
export function RadioCardField({
  name,
  label,
  required,
  hint,
  options,
  className,
  columns = "sm:grid-cols-2",
  disabled: disabledProp,
}: CommonProps & {
  options: { value: string; label: string; description?: string }[];
  columns?: string;
}) {
  const [field, , helpers] = useField<string | null>(name);
  const error = useFieldError(name);
  const ids = useFieldIds(name);
  const disabled = useDisabled(disabledProp);

  return (
    <fieldset className={cn("flex min-w-0 flex-col gap-2", className)} aria-describedby={describedBy(error, hint, ids)} disabled={disabled}>
      <legend className="mb-2 text-sm font-semibold text-brand-950">
        {label}
        {required && (
          <span className="text-red-600" aria-hidden>
            *
          </span>
        )}
      </legend>
      <div className={cn("grid gap-2", columns)}>
        {options.map((option) => {
          const checked = field.value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer gap-3 rounded-2xl border p-3.5 transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                checked ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600" : "border-brand-100 bg-white hover:border-brand-300"
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => {
                  void helpers.setValue(option.value);
                  void helpers.setTouched(true, false);
                }}
                className="mt-0.5 size-4 accent-brand-600"
              />
              <span>
                <span className="block text-sm font-semibold text-brand-950">{option.label}</span>
                {option.description && <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{option.description}</span>}
              </span>
            </label>
          );
        })}
      </div>
      {hint && !error && (
        <p id={ids.hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={ids.errorId} className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}

/** Free-text list (roles, locations). Enter or the Add button adds an item. */
export function TagField({
  name,
  label,
  required,
  hint,
  className,
  disabled: disabledProp,
  max = 10,
  placeholder,
}: CommonProps & { max?: number; placeholder?: string }) {
  const [field, , helpers] = useField<string[]>(name);
  const error = useFieldError(name);
  const ids = useFieldIds(name);
  const disabled = useDisabled(disabledProp);
  const [draft, setDraft] = useState("");
  const items = field.value ?? [];
  const full = items.length >= max;

  const add = () => {
    const value = draft.trim();
    if (!value || full) return;
    if (!items.some((item) => item.toLowerCase() === value.toLowerCase())) void helpers.setValue([...items, value]);
    void helpers.setTouched(true, false);
    setDraft("");
  };

  return (
    <FieldShell label={label} required={required} hint={hint ?? `Press Enter to add. Up to ${max}.`} error={error} className={className} {...ids}>
      {items.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label={typeof label === "string" ? label : undefined}>
          {items.map((item) => (
            <li key={item} className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-1 pr-1 pl-3 text-sm font-semibold text-brand-800 ring-1 ring-brand-200">
              {item}
              <button
                type="button"
                disabled={disabled}
                onClick={() => void helpers.setValue(items.filter((entry) => entry !== item))}
                className="flex size-5 items-center justify-center rounded-full text-brand-600 hover:bg-brand-100 focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:outline-none"
                aria-label={`Remove ${item}`}
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <Input
          id={ids.id}
          value={draft}
          disabled={disabled || full}
          placeholder={full ? `Maximum of ${max} reached` : placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          aria-invalid={!!error}
          aria-describedby={describedBy(error, true, ids)}
          className={controlClass}
        />
        <Button type="button" variant="brand-outline" className="h-11 px-4" onClick={add} disabled={disabled || full || !draft.trim()}>
          <Plus aria-hidden />
          Add
        </Button>
      </div>
    </FieldShell>
  );
}

/** Error attached to an array or the whole form rather than a single input. */
export function FormError({ name }: { name: string }) {
  const error = useFieldError(name);
  if (!error) return null;
  return (
    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
      {error}
    </p>
  );
}
