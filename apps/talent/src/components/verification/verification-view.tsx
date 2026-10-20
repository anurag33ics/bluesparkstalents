import Link from "next/link";
import { CircleCheck, Circle, EyeOff, History, MessageSquareQuote, Trash2 } from "lucide-react";
import { cn } from "cn";
import { ActionButton } from "@/components/forms/action-button";
import { FileRow } from "@/components/forms/file-upload";
import { DetailList, Panel } from "@/components/journey/layout";
import { LocalTime } from "@/components/journey/local-time";
import { StatusBadge, toneStyles } from "@/components/journey/status-badge";
import { removeVerificationDocument } from "@/lib/actions/candidate";
import { formatFileSize } from "@/lib/format";
import { checkStatusLabels, documentTypeLabels, verificationStatusLabels } from "@/lib/journey/labels";
import type { ProfileSectionKey, Verification, VerificationCheckKey, VerificationStatus } from "@/lib/journey/types";
import { DocumentUpload } from "./document-upload";
import { SubmitVerificationForm } from "./submit-verification-form";

const headlines: Record<VerificationStatus, { title: string; body: string }> = {
  not_started: {
    title: "Submit your profile for verification",
    body: "Upload the required documents and submit. A reviewer checks your details, resume and qualifications.",
  },
  pending_review: {
    title: "Your profile is being reviewed",
    body: "There's nothing you need to do right now. We'll notify you as soon as a reviewer responds.",
  },
  changes_required: {
    title: "A reviewer asked for a few changes",
    body: "Fix the items marked below, then resubmit. Everything already approved stays approved.",
  },
  verified: {
    title: "Your profile is verified",
    body: "Recruiters will see a verified badge on your profile once you're listed.",
  },
  rejected: {
    title: "We couldn't verify your profile",
    body: "Read the reviewer's feedback below. Contact support if you think this is a mistake.",
  },
};

const fixLinks: Record<VerificationCheckKey, ProfileSectionKey> = {
  identity: "personal",
  resume: "resume",
  education: "education",
  experience: "experience",
  skills: "skills",
};

export function VerificationView({ verification }: { verification: Verification }) {
  const status = verificationStatusLabels[verification.status];
  const headline = headlines[verification.status];
  const uploadedTypes = new Set(verification.documents.map((document) => document.type));
  const missingDocument = verification.requiredDocuments.find((type) => !uploadedTypes.has(type)) ?? null;
  const canSubmitNow = verification.status === "not_started" || verification.status === "changes_required";

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="flex flex-col gap-6">
        {/* Status */}
        <section aria-labelledby="verification-status" className={cn("rounded-3xl border p-6 sm:p-7", toneStyles[status.tone].surface)}>
          <StatusBadge status={status} size="md" className="bg-white" />
          <h2 id="verification-status" className="mt-4 font-heading text-xl font-medium text-brand-950 sm:text-2xl">
            {headline.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-950/80">{headline.body}</p>

          {verification.feedback && (
            <blockquote className="mt-5 rounded-2xl bg-white p-4 text-sm leading-6 text-brand-950 ring-1 ring-black/5">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                <MessageSquareQuote className="size-4" aria-hidden />
                Reviewer feedback{verification.reviewerName && ` · ${verification.reviewerName}`}
              </p>
              <p className="mt-2">{verification.feedback}</p>
            </blockquote>
          )}

          <DetailList
            className="mt-6 sm:grid-cols-3"
            items={[
              { label: "Submitted", value: verification.submittedAt ? <LocalTime value={verification.submittedAt} /> : "Not yet" },
              { label: "Reviewed", value: verification.reviewedAt ? <LocalTime value={verification.reviewedAt} /> : "Not yet" },
              { label: "Verified", value: verification.verifiedAt ? <LocalTime value={verification.verifiedAt} /> : "Not yet" },
            ]}
          />
        </section>

        {/* Checks */}
        <Panel title="What we check" description="Each part of your profile is reviewed separately.">
          <ul className="flex flex-col divide-y divide-brand-100">
            {verification.checks.map((check) => (
              <li key={check.key} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold text-brand-950">{check.label}</p>
                  {check.comment && <p className="mt-1 text-sm leading-6 text-muted-foreground">{check.comment}</p>}
                  {(check.status === "changes_required" || check.status === "rejected") && verification.editable && (
                    <Link href={`/profile?section=${fixLinks[check.key]}`} className="mt-1.5 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700">
                      Fix in your profile
                    </Link>
                  )}
                </div>
                <StatusBadge status={checkStatusLabels[check.status]} />
              </li>
            ))}
          </ul>
        </Panel>

        {/* Documents */}
        <Panel title="Supporting documents" description="Mask any ID numbers you don't want to share; we only need to confirm it's you.">
          <ul className="mb-5 flex flex-wrap gap-2">
            {verification.requiredDocuments.map((type) => {
              const uploaded = uploadedTypes.has(type);
              return (
                <li
                  key={type}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1",
                    uploaded ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-white text-brand-950 ring-brand-200"
                  )}
                >
                  {uploaded ? <CircleCheck className="size-3.5" aria-hidden /> : <Circle className="size-3.5" aria-hidden />}
                  {documentTypeLabels[type]}
                  <span className="sr-only">{uploaded ? "(uploaded)" : "(required, not uploaded)"}</span>
                </li>
              );
            })}
          </ul>

          {verification.documents.length > 0 && (
            <ul className="mb-5 flex flex-col gap-2">
              {verification.documents.map((document) => (
                <li key={document.id}>
                  <FileRow
                    name={document.name}
                    href={document.url}
                    meta={
                      <>
                        {documentTypeLabels[document.type]} · {formatFileSize(document.sizeBytes)} · <LocalTime value={document.uploadedAt} format="date" />
                      </>
                    }
                    action={
                      verification.editable ? (
                        <ActionButton
                          action={removeVerificationDocument.bind(null, document.id)}
                          variant="ghost"
                          size="icon"
                          className="size-9 text-red-700 hover:bg-red-50"
                          success="Document removed"
                          confirm={{
                            title: "Remove this document?",
                            description: `${document.name} will be deleted. You can upload it again later.`,
                            confirmLabel: "Remove",
                            destructive: true,
                          }}
                        >
                          <Trash2 aria-hidden />
                          <span className="sr-only">Remove {document.name}</span>
                        </ActionButton>
                      ) : undefined
                    }
                  />
                </li>
              ))}
            </ul>
          )}

          {verification.editable ? (
            <DocumentUpload suggested={missingDocument} />
          ) : (
            <p className="text-sm text-muted-foreground">Documents can&apos;t be changed while your profile is under review or after it&apos;s verified.</p>
          )}
        </Panel>

        {canSubmitNow && (
          <Panel title={verification.status === "changes_required" ? "Resubmit for verification" : "Submit for verification"}>
            <SubmitVerificationForm
              resubmit={verification.status === "changes_required"}
              canSubmit={verification.canSubmit}
              blockedReason={verification.submitBlockedReason}
            />
          </Panel>
        )}
      </div>

      <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
        <Panel title="History">
          {verification.history.length ? (
            <ol className="relative flex flex-col gap-5 border-l-2 border-brand-100 pl-5">
              {verification.history.map((event) => (
                <li key={`${event.at}-${event.status}`} className="relative">
                  <span className="absolute top-1 -left-[27px] size-3 rounded-full bg-brand-600 ring-4 ring-white" aria-hidden />
                  <StatusBadge status={verificationStatusLabels[event.status]} />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    <LocalTime value={event.at} />
                    {event.actor && ` · ${event.actor}`}
                  </p>
                  {event.note && <p className="mt-1 text-sm text-brand-950">{event.note}</p>}
                </li>
              ))}
            </ol>
          ) : (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <History className="size-4" aria-hidden />
              Nothing yet. Updates appear here after you submit.
            </p>
          )}
        </Panel>

        <div className="flex gap-3 rounded-3xl border border-brand-100 bg-white p-5 text-sm leading-6 text-muted-foreground">
          <EyeOff className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden />
          <p>
            <span className="font-semibold text-brand-950">Private until verified.</span> Recruiters can never see an unverified profile.
          </p>
        </div>
      </aside>
    </div>
  );
}
