"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Form, Formik, useFormikContext, type FormikHelpers, type FormikValues } from "formik";
import type * as Yup from "yup";
import { Loader2, Smartphone, Trash2 } from "lucide-react";
import { settle } from "@/components/forms/feedback";
import { FormDisabledContext, RadioCardField, SelectField, SwitchField, TextField } from "@/components/forms/fields";
import { localTimeZone, useHydrated } from "@/components/journey/local-time";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  changePassword,
  requestAccountDeletion,
  requestEmailChange,
  updateAvailability,
  updateNotificationPreferences,
  updateTimeZone,
  updateVisibility,
} from "@/lib/actions/candidate";
import type { ApiResult } from "@/lib/api/result";
import { canonicalTimeZone } from "@/lib/format";
import {
  availabilityLabels,
  deletionReasonLabels,
  notificationChannelLabels,
  notificationTopicLabels,
} from "@/lib/journey/labels";
import {
  availabilitySchema,
  changeEmailSchema,
  changePasswordSchema,
  deleteAccountSchema,
  notificationPreferencesSchema,
  requirePassword,
  timeZoneSchema,
  visibilitySchema,
} from "@/lib/journey/schemas";
import {
  notificationChannels,
  notificationTopics,
  type AccountSettings,
  type Availability,
  type ListingVisibility,
  type NotificationPreferences,
} from "@/lib/journey/types";

/* Shared form shell ------------------------------------------------------------ */

/**
 * Formik wrapper for one settings card: validates with the shared schema, saves
 * through a server action and reports the result. Forms that hold secrets
 * (passwords) clear themselves after a successful save.
 */
function SettingsForm<Values extends FormikValues>({
  initialValues,
  schema,
  action,
  success,
  successDetail,
  submitLabel = "Save changes",
  idleNote,
  clearOnSuccess = false,
  children,
}: {
  initialValues: Values;
  schema: Yup.AnyObjectSchema;
  action: (values: Values) => Promise<ApiResult<unknown>>;
  success: string;
  successDetail?: string;
  submitLabel?: string;
  idleNote?: React.ReactNode;
  clearOnSuccess?: boolean;
  children: React.ReactNode;
}) {
  async function onSubmit(values: Values, helpers: FormikHelpers<Values>) {
    const result = await action(values);
    if (!settle(result, { success, successDetail, setErrors: helpers.setErrors })) return;
    helpers.resetForm({ values: clearOnSuccess ? initialValues : values });
  }

  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit} enableReinitialize>
      {({ isSubmitting, dirty }) => (
        <Form noValidate>
          <FormDisabledContext.Provider value={isSubmitting}>
            <div className="flex flex-col gap-5">{children}</div>
          </FormDisabledContext.Provider>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-black/6 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex min-h-5 items-center gap-2 text-xs leading-5 text-muted-foreground" aria-live="polite">
              {dirty ? (
                <>
                  <span className="size-2 rounded-full bg-amber-500" aria-hidden />
                  Unsaved changes
                </>
              ) : (
                idleNote
              )}
            </p>
            <Button type="submit" variant="brand" size="cta" disabled={isSubmitting || !dirty}>
              {isSubmitting && <Loader2 className="animate-spin" aria-hidden />}
              {submitLabel}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

/* Account ------------------------------------------------------------------------ */

export function EmailChangeForm({ hasPassword }: { hasPassword: boolean }) {
  return (
    <SettingsForm
      initialValues={{ newEmail: "", currentPassword: "" }}
      schema={requirePassword(changeEmailSchema, hasPassword)}
      action={requestEmailChange}
      success="Check your new inbox"
      successDetail="Open the link we sent to confirm the change. Until then, keep signing in with your current email."
      submitLabel="Send confirmation link"
      idleNote="We'll send a confirmation link to the new address."
      clearOnSuccess
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="newEmail" label="New email address" type="email" autoComplete="email" inputMode="email" required />
        {hasPassword && (
          <TextField name="currentPassword" label="Current password" type="password" autoComplete="current-password" required />
        )}
      </div>
    </SettingsForm>
  );
}

function DeviceTimeZone({ options }: { options: Record<string, string> }) {
  const hydrated = useHydrated();
  const { values, setFieldValue, setFieldTouched } = useFormikContext<{ timeZone: string }>();
  // The browser may name the zone differently from the list (Asia/Calcutta vs Asia/Kolkata).
  const deviceId = hydrated ? canonicalTimeZone(localTimeZone()) : null;
  const deviceOption = useMemo(
    () => (deviceId ? Object.keys(options).find((zone) => canonicalTimeZone(zone) === deviceId) : undefined),
    [deviceId, options]
  );

  if (!deviceOption) return null;
  if (deviceId === canonicalTimeZone(values.timeZone)) {
    return <p className="text-xs text-muted-foreground">Matches the time zone on this device.</p>;
  }

  return (
    <button
      type="button"
      onClick={() => {
        void setFieldValue("timeZone", deviceOption);
        void setFieldTouched("timeZone", true, false);
      }}
      className="self-start text-xs font-semibold text-brand-600 hover:text-brand-700"
    >
      Use this device&apos;s time zone ({deviceOption.replaceAll("_", " ")})
    </button>
  );
}

export function TimeZoneForm({ timeZone, options }: { timeZone: string; options: Record<string, string> }) {
  return (
    <SettingsForm
      initialValues={{ timeZone }}
      schema={timeZoneSchema}
      action={updateTimeZone}
      success="Time zone updated"
      idleNote="Interview times, reminders and emails use this time zone."
    >
      <div className="flex flex-col gap-2">
        <SelectField name="timeZone" label="Time zone" options={options} placeholder="Choose a time zone" />
        <DeviceTimeZone options={options} />
      </div>
    </SettingsForm>
  );
}

/* Security ----------------------------------------------------------------------- */

export function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  return (
    <SettingsForm
      initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
      schema={requirePassword(changePasswordSchema, hasPassword)}
      action={changePassword}
      success={hasPassword ? "Password updated" : "Password set"}
      submitLabel={hasPassword ? "Update password" : "Set password"}
      idleNote={hasPassword ? "Forgot it? Sign out and use “Forgot password” on the sign-in page." : "Set one to sign in with your email as well as Google."}
      clearOnSuccess
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {hasPassword && (
          <TextField
            name="currentPassword"
            label="Current password"
            type="password"
            autoComplete="current-password"
            required
            className="sm:col-span-2 sm:max-w-[calc(50%-0.625rem)]"
          />
        )}
        <TextField
          name="newPassword"
          label="New password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters, with a letter and a number."
          required
        />
        <TextField name="confirmPassword" label="Confirm new password" type="password" autoComplete="new-password" required />
      </div>
    </SettingsForm>
  );
}

/* Notifications -------------------------------------------------------------------- */

export function NotificationsForm({
  preferences,
  required,
  phone,
}: {
  preferences: NotificationPreferences;
  required: AccountSettings["requiredNotifications"];
  phone: string | null;
}) {
  const isLocked = (topic: keyof NotificationPreferences, channel: (typeof notificationChannels)[number]) =>
    (required[topic] ?? []).includes(channel);
  const needsPhone = (channel: (typeof notificationChannels)[number]) => channel !== "email" && !phone;

  // Show what will actually be sent: required channels on, phone channels off without a number.
  const initialValues = Object.fromEntries(
    notificationTopics.map((topic) => [
      topic,
      Object.fromEntries(
        notificationChannels.map((channel) => [
          channel,
          isLocked(topic, channel) || (!needsPhone(channel) && preferences[topic][channel]),
        ])
      ),
    ])
  ) as NotificationPreferences;

  return (
    <SettingsForm
      initialValues={initialValues}
      schema={notificationPreferencesSchema}
      action={updateNotificationPreferences}
      success="Notification preferences saved"
      idleNote="In-app notifications are always on, so you never miss an update."
    >
      {phone ? (
        <p className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
          <Smartphone className="size-4 shrink-0 text-slate-500" aria-hidden />
          <span>
            SMS and WhatsApp messages go to <span className="font-semibold text-ink-950">{phone}</span>.{" "}
            <Link href="/profile?section=contact" className="font-semibold text-brand-600 hover:text-brand-700">
              Change number
            </Link>
          </span>
        </p>
      ) : (
        <p className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <Smartphone className="size-4 shrink-0" aria-hidden />
          <span>
            Add a mobile number to get SMS and WhatsApp alerts.{" "}
            <Link href="/profile?section=contact" className="font-semibold underline underline-offset-2">
              Add number
            </Link>
          </span>
        </p>
      )}

      <div>
        <div className="hidden grid-cols-[1fr_repeat(3,5rem)] gap-2 border-b border-black/6 pb-3 sm:grid" aria-hidden>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Notify me about</span>
          {notificationChannels.map((channel) => (
            <span key={channel} className="text-center text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {notificationChannelLabels[channel]}
            </span>
          ))}
        </div>

        <ul className="divide-y divide-black/6">
          {notificationTopics.map((topic) => {
            const meta = notificationTopicLabels[topic];
            const locked = required[topic] ?? [];
            return (
              <li key={topic} className="grid gap-3 py-4 sm:grid-cols-[1fr_repeat(3,5rem)] sm:items-center sm:gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-950">{meta.label}</p>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                    {meta.description}
                    {locked.length > 0 && (
                      <span className="block text-slate-500">
                        {locked.map((channel) => notificationChannelLabels[channel]).join(" and ")} is always on for this.
                      </span>
                    )}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:contents">
                  {notificationChannels.map((channel) => (
                    <div key={channel} className="flex flex-col items-start gap-1.5 sm:items-center">
                      <span className="text-[11px] font-semibold text-slate-600 sm:hidden" aria-hidden>
                        {notificationChannelLabels[channel]}
                      </span>
                      <SwitchField
                        name={`${topic}.${channel}`}
                        label={`${notificationChannelLabels[channel]}: ${meta.label}`}
                        hideLabel
                        disabled={isLocked(topic, channel) || needsPhone(channel)}
                      />
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </SettingsForm>
  );
}

/* Privacy ---------------------------------------------------------------------------- */

const availabilityDescriptions: Record<Availability["status"], string> = {
  immediate: "You can join as soon as you get an offer.",
  notice_period: "You're working out notice at your current job.",
  not_looking: "Recruiters see that you're not open to offers.",
};

function AvailabilityDetails() {
  const { values } = useFormikContext<Availability>();
  if (values.status === "notice_period") {
    return (
      <TextField
        name="noticePeriodDays"
        label="Notice days left"
        type="number"
        inputMode="numeric"
        min={0}
        max={180}
        required
        className="sm:max-w-xs"
      />
    );
  }
  if (values.status === "not_looking") {
    return (
      <TextField
        name="availableFrom"
        label="Open to offers from"
        type="date"
        hint="Optional. Leave empty if you're not sure yet."
        className="sm:max-w-xs"
      />
    );
  }
  return null;
}

export function AvailabilityForm({ availability }: { availability: Availability }) {
  return (
    <SettingsForm
      initialValues={availability}
      schema={availabilitySchema}
      action={updateAvailability}
      success="Availability updated"
      idleNote="Shown on your listing so recruiters know when you can start."
    >
      <RadioCardField
        name="status"
        label="Your availability"
        columns="sm:grid-cols-3"
        options={(Object.keys(availabilityLabels) as Availability["status"][]).map((value) => ({
          value,
          label: availabilityLabels[value],
          description: availabilityDescriptions[value],
        }))}
      />
      <AvailabilityDetails />
    </SettingsForm>
  );
}

const visibilityFields: { name: keyof ListingVisibility; label: string; description: string }[] = [
  { name: "showFullName", label: "Full name", description: "When off, recruiters see a shortened name until you share your details." },
  { name: "showCurrentCompany", label: "Current employer", description: "Turn off to keep your job search private from your current company." },
  { name: "showEducation", label: "Education", description: "Degrees and institutions from your profile." },
  { name: "showResume", label: "Resume download", description: "Lets recruiters download the resume you uploaded." },
  { name: "showExpectedSalary", label: "Expected salary", description: "The salary range from your career preferences." },
  { name: "showAiAssessment", label: "AI interview score", description: "Your overall score and summary from the AI mock interview." },
  { name: "showExpertFeedback", label: "One-to-one interview feedback", description: "The expert's rating and recommendation." },
];

export function VisibilityForm({ visibility }: { visibility: ListingVisibility }) {
  return (
    <SettingsForm
      initialValues={visibility}
      schema={visibilitySchema}
      action={updateVisibility}
      success="Visibility updated"
      idleNote="Your email and phone number are never shown. Recruiters have to ask, and you decide."
    >
      <ul className="divide-y divide-black/6">
        {visibilityFields.map((field) => (
          <li key={field.name} className="py-4 first:pt-0 last:pb-0">
            <SwitchField name={field.name} label={field.label} description={field.description} />
          </li>
        ))}
      </ul>
    </SettingsForm>
  );
}

/* Data & account ------------------------------------------------------------------------ */

export function DeleteAccountDialog({ hasPassword, graceDays }: { hasPassword: boolean; graceDays: number }) {
  const [open, setOpen] = useState(false);
  const initialValues = { reason: null as string | null, currentPassword: "", confirmation: "" };

  async function onSubmit(values: typeof initialValues, helpers: FormikHelpers<typeof initialValues>) {
    const result = await requestAccountDeletion(values);
    if (settle(result, { success: "Account deletion scheduled", setErrors: helpers.setErrors })) setOpen(false);
  }

  return (
    <>
      <Button type="button" variant="destructive" size="cta" onClick={() => setOpen(true)}>
        <Trash2 aria-hidden />
        Delete account
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Delete your account?</DialogTitle>
            <DialogDescription className="leading-6">
              Your profile leaves the hiring portal straight away. Everything else is permanently deleted after {graceDays} days, and you
              can cancel any time before then.
            </DialogDescription>
          </DialogHeader>

          <Formik initialValues={initialValues} validationSchema={requirePassword(deleteAccountSchema, hasPassword)} onSubmit={onSubmit}>
            {({ isSubmitting }) => (
              <Form noValidate className="flex flex-col gap-4">
                <FormDisabledContext.Provider value={isSubmitting}>
                  <SelectField name="reason" label="Why are you leaving?" options={deletionReasonLabels} placeholder="Optional" />
                  {hasPassword && (
                    <TextField name="currentPassword" label="Password" type="password" autoComplete="current-password" required />
                  )}
                  <TextField
                    name="confirmation"
                    label={
                      <>
                        Type <span className="font-mono">DELETE</span> to confirm
                      </>
                    }
                    autoComplete="off"
                    required
                  />
                </FormDisabledContext.Provider>
                <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <DialogClose render={<Button type="button" variant="outline" className="h-9 rounded-xl px-4" />}>Keep my account</DialogClose>
                  <Button type="submit" variant="destructive" className="h-9 px-4" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="animate-spin" aria-hidden />}
                    Delete account
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
}
