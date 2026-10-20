import Link from "next/link";
import { ArrowRight, CircleCheck, Pencil, ShieldCheck } from "lucide-react";
import { cn } from "cn";
import { FileRow } from "@/components/forms/file-upload";
import { accentTile } from "@/components/journey/accents";
import { DetailList } from "@/components/journey/layout";
import { LocalTime } from "@/components/journey/local-time";
import { StatusBadge } from "@/components/journey/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDateOnly, formatFileSize, formatMonth, formatSalary } from "@/lib/format";
import { genderLabels, jobTypeLabels, skillLevelLabels, workModeLabels } from "@/lib/journey/labels";
import { profileSectionMeta, type ProfileCompletion } from "@/lib/journey/profile";
import type { CandidateProfile, ProfileSectionKey } from "@/lib/journey/types";
import { sectionVisuals } from "./section-meta";
import { SubmitProfileForm } from "./submit-profile-form";

function orNotAdded(value: React.ReactNode) {
  if (value === null || value === undefined || (typeof value === "string" && !value.trim())) {
    return <span className="font-normal text-slate-400">Not added</span>;
  }
  return value;
}

function ReviewCard({
  section,
  done,
  editable,
  children,
}: {
  section: ProfileSectionKey;
  done: boolean;
  editable: boolean;
  children: React.ReactNode;
}) {
  const visual = sectionVisuals[section];
  const Icon = visual.icon;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl ring-1", accentTile[visual.accent])}>
            <Icon className="size-4.5" strokeWidth={1.9} aria-hidden />
          </span>
          <h3 className="truncate font-semibold text-ink-950">{profileSectionMeta[section].title}</h3>
          <StatusBadge status={done ? { label: "Complete", tone: "success" } : { label: "Needs details", tone: "warning" }} className="hidden sm:inline-flex" />
        </div>
        {editable && (
          <Link
            href={`/profile?section=${section}`}
            scroll={false}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 transition-colors hover:bg-brand-50"
          >
            <Pencil className="size-3.5" aria-hidden />
            Edit<span className="sr-only"> {profileSectionMeta[section].title}</span>
          </Link>
        )}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </article>
  );
}

function EntryList({ items }: { items: { title: string; detail: string }[] }) {
  if (!items.length) return <p className="text-sm text-slate-400">Not added</p>;
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={`${item.title}-${item.detail}`} className="text-sm">
          <p className="font-semibold text-ink-950">{item.title}</p>
          <p className="text-muted-foreground">{item.detail}</p>
        </li>
      ))}
    </ul>
  );
}

/** Final profile step: a read-only summary, the authenticity declaration and submit. */
export function ReviewAndSubmit({
  profile,
  completion,
  submitted,
}: {
  profile: CandidateProfile;
  completion: ProfileCompletion;
  submitted: boolean;
}) {
  const { personal, contact, education, experience, skills, preferences, resume } = profile;
  const done = (key: ProfileSectionKey) => completion.complete.includes(key);
  const editable = !profile.locked;
  const ready = completion.incomplete.length === 0;

  return (
    <div className="flex flex-col gap-6">
      {submitted ? (
        <div role="status" className="flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <CircleCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden />
            <div className="text-sm leading-6 text-emerald-950">
              <p className="font-semibold">
                Profile submitted
                {profile.completedAt && (
                  <>
                    {" "}
                    on <LocalTime value={profile.completedAt} format="date" />
                  </>
                )}
              </p>
              <p>Next, complete your plan payment. You can still update your details; changes are re-checked during verification.</p>
            </div>
          </div>
          <Link href="/plans" className={cn(buttonVariants({ variant: "gold", size: "cta" }), "shrink-0 self-start sm:self-center")}>
            Continue to payment
            <ArrowRight aria-hidden />
          </Link>
        </div>
      ) : (
        <div className="flex gap-3 rounded-2xl border border-gold-200 bg-gold-50 p-5 text-sm leading-6 text-ink-950">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-gold-600" aria-hidden />
          <div>
            <p className="font-semibold">Please confirm your details are authentic</p>
            <p className="mt-1 text-slate-700">
              By submitting, you confirm that all the information you have provided is genuine and accurate. Found something
              to correct? Use <span className="font-semibold">Edit</span> on any section below to fix it before you submit.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <ReviewCard section="personal" done={done("personal")} editable={editable}>
          <DetailList
            items={[
              { label: "Full name", value: orNotAdded([personal.firstName, personal.lastName].filter(Boolean).join(" ")) },
              { label: "Date of birth", value: orNotAdded(personal.dateOfBirth ? formatDateOnly(personal.dateOfBirth) : null) },
              { label: "Gender", value: orNotAdded(personal.gender ? genderLabels[personal.gender] : null) },
              { label: "Headline", value: orNotAdded(personal.headline) },
              { label: "Summary", value: orNotAdded(personal.summary), wide: true },
            ]}
          />
        </ReviewCard>

        <ReviewCard section="contact" done={done("contact")} editable={editable}>
          <DetailList
            items={[
              { label: "Email", value: contact.email },
              { label: "Phone", value: orNotAdded(contact.phone) },
              { label: "Location", value: orNotAdded([contact.city, contact.state, contact.country].filter(Boolean).join(", ")) },
              { label: "LinkedIn", value: orNotAdded(contact.linkedinUrl) },
              { label: "Portfolio", value: orNotAdded(contact.portfolioUrl) },
            ]}
          />
        </ReviewCard>

        <ReviewCard section="education" done={done("education")} editable={editable}>
          <EntryList
            items={education.map((entry) => ({
              title: [entry.degree, entry.fieldOfStudy].filter(Boolean).join(", "),
              detail: [entry.institution, [entry.startYear, entry.endYear ?? "Present"].join(" – "), entry.grade].filter(Boolean).join(" · "),
            }))}
          />
        </ReviewCard>

        <ReviewCard section="experience" done={done("experience")} editable={editable}>
          <p className="mb-3 text-sm text-ink-950">
            <span className="font-semibold">Total experience:</span>{" "}
            {experience.fresher ? "Fresher" : experience.totalYears !== null ? `${experience.totalYears} years` : <span className="text-slate-400">Not added</span>}
          </p>
          <EntryList
            items={experience.items.map((entry) => ({
              title: `${entry.title} · ${entry.company}`,
              detail: `${entry.startMonth ? formatMonth(entry.startMonth) : ""} – ${entry.current ? "Present" : entry.endMonth ? formatMonth(entry.endMonth) : ""}`,
            }))}
          />
        </ReviewCard>

        <ReviewCard section="skills" done={done("skills")} editable={editable}>
          {skills.length ? (
            <ul className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <li key={skill.name} className="rounded-full bg-fuchsia-50 px-3 py-1 text-sm text-fuchsia-900 ring-1 ring-fuchsia-100">
                  <span className="font-semibold">{skill.name}</span> · {skillLevelLabels[skill.level]}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">Not added</p>
          )}
        </ReviewCard>

        <ReviewCard section="preferences" done={done("preferences")} editable={editable}>
          <DetailList
            items={[
              { label: "Roles", value: orNotAdded(preferences.desiredRoles.join(", ")) },
              { label: "Job types", value: orNotAdded(preferences.jobTypes.map((type) => jobTypeLabels[type]).join(", ")) },
              { label: "Work modes", value: orNotAdded(preferences.workModes.map((mode) => workModeLabels[mode]).join(", ")) },
              { label: "Preferred locations", value: orNotAdded(preferences.preferredLocations.join(", ")) },
              {
                label: "Expected salary",
                value: preferences.expectedSalary !== null ? `${formatSalary(preferences.expectedSalary, preferences.salaryCurrency)} per year` : "Not shared",
              },
              { label: "Notice period", value: orNotAdded(preferences.noticePeriodDays !== null ? `${preferences.noticePeriodDays} days` : null) },
              { label: "Open to relocating", value: preferences.willingToRelocate ? "Yes" : "No" },
            ]}
          />
        </ReviewCard>

        <ReviewCard section="resume" done={done("resume")} editable={editable}>
          {resume ? (
            <FileRow
              name={resume.name}
              href={resume.url}
              meta={
                <>
                  {formatFileSize(resume.sizeBytes)} · Uploaded <LocalTime value={resume.uploadedAt} format="date" />
                </>
              }
            />
          ) : (
            <p className="text-sm text-slate-400">Not uploaded</p>
          )}
        </ReviewCard>
      </div>

      {!submitted && editable && (
        <SubmitProfileForm ready={ready} missing={completion.incomplete.map((key) => profileSectionMeta[key].title.toLowerCase())} />
      )}
    </div>
  );
}
