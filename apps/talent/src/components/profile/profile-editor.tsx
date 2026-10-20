import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, CircleCheck, ClipboardCheck, Lightbulb, LockKeyhole } from "lucide-react";
import { cn } from "cn";
import { FileRow, FileUpload } from "@/components/forms/file-upload";
import { accentTile } from "@/components/journey/accents";
import { panelClass } from "@/components/journey/layout";
import { LocalTime } from "@/components/journey/local-time";
import { Meter } from "@/components/journey/meter";
import { StatusBadge } from "@/components/journey/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { uploadResume } from "@/lib/actions/candidate";
import { formatFileSize } from "@/lib/format";
import { profileCompletion, profileSectionMeta, type ProfileCompletion } from "@/lib/journey/profile";
import { resumeUploadRules } from "@/lib/journey/schemas";
import { profileSectionKeys, type CandidateProfile, type ProfileSectionKey, type StageSummary } from "@/lib/journey/types";
import { ReviewAndSubmit } from "./review-and-submit";
import { sectionVisuals } from "./section-meta";
import { ContactForm, EducationForm, ExperienceForm, PersonalForm, PreferencesForm, SkillsForm } from "./section-forms";

/** The seven profile sections plus the final review step. */
export type ProfileView = ProfileSectionKey | "review";

const views: ProfileView[] = [...profileSectionKeys, "review"];

const forms: Record<Exclude<ProfileSectionKey, "resume">, typeof PersonalForm> = {
  personal: PersonalForm,
  contact: ContactForm,
  education: EducationForm,
  experience: ExperienceForm,
  skills: SkillsForm,
  preferences: PreferencesForm,
};

const reviewVisual = {
  title: "Review & submit",
  description: "Check your details, confirm they're authentic and submit your profile.",
  tips: [
    "Open any section to correct it before you submit.",
    "Make sure your resume dates match your work experience.",
  ],
};

/* Section navigation ---------------------------------------------------------- */

function NavItem({
  href,
  current,
  icon: Icon,
  tile,
  title,
  status,
  statusClass,
  done,
}: {
  href: string;
  current: boolean;
  icon: typeof ClipboardCheck;
  tile: string;
  title: string;
  status: string;
  statusClass: string;
  done: boolean;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={current ? "step" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3 py-2.5 outline-none transition-all focus-visible:ring-2 focus-visible:ring-brand-500/40",
        current ? "bg-brand-50 ring-1 ring-brand-200" : "hover:bg-slate-50"
      )}
    >
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl ring-1", tile)}>
        <Icon className="size-4.5" strokeWidth={1.9} aria-hidden />
      </span>
      <span className="min-w-0 flex-1 pr-2 lg:pr-0">
        <span className={cn("block text-sm font-semibold whitespace-nowrap", current ? "text-brand-800" : "text-ink-950")}>{title}</span>
        <span className={cn("block text-xs", statusClass)}>{status}</span>
      </span>
      {done ? (
        <CircleCheck className="hidden size-4.5 shrink-0 text-emerald-500 lg:block" aria-hidden />
      ) : (
        <ChevronRight className="hidden size-4 shrink-0 text-slate-400 lg:block" aria-hidden />
      )}
    </Link>
  );
}

function SectionNav({ active, completion, submitted }: { active: ProfileView; completion: ProfileCompletion; submitted: boolean }) {
  const ready = completion.incomplete.length === 0;

  return (
    <nav aria-label="Profile sections" className={cn(panelClass, "p-2 sm:p-2")}>
      <div className="px-3 pt-3 pb-3">
        <Meter
          label="Profile completion"
          value={completion.complete.length}
          max={profileSectionKeys.length}
          valueLabel={`${completion.percent}%`}
          size="sm"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {completion.complete.length} of {profileSectionKeys.length} sections complete
        </p>
      </div>

      <ul className="flex gap-2 overflow-x-auto p-1 lg:flex-col lg:gap-1 lg:overflow-visible">
        {profileSectionKeys.map((key) => {
          const visual = sectionVisuals[key];
          const done = completion.complete.includes(key);
          return (
            <li key={key} className="shrink-0 lg:shrink">
              <NavItem
                href={`/profile?section=${key}`}
                current={key === active}
                icon={visual.icon}
                tile={accentTile[visual.accent]}
                title={profileSectionMeta[key].title}
                status={done ? "Complete" : "Needs details"}
                statusClass={done ? "text-emerald-700" : "text-slate-500"}
                done={done}
              />
            </li>
          );
        })}

        <li className="shrink-0 lg:mt-1 lg:shrink lg:border-t lg:border-black/6 lg:pt-2">
          <NavItem
            href="/profile?section=review"
            current={active === "review"}
            icon={ClipboardCheck}
            tile={accentTile.blue}
            title={reviewVisual.title}
            status={submitted ? "Submitted" : ready ? "Ready to submit" : "Complete all sections"}
            statusClass={submitted ? "text-emerald-700" : ready ? "text-brand-700" : "text-slate-500"}
            done={submitted}
          />
        </li>
      </ul>
    </nav>
  );
}

function TipsCard({ tips }: { tips: string[] }) {
  return (
    <div className="hidden rounded-3xl bg-gold-50 p-5 ring-1 ring-gold-100 lg:block">
      <p className="flex items-center gap-2 text-sm font-semibold text-ink-950">
        <Lightbulb className="size-4 text-gold-600" aria-hidden />
        Tips for a standout profile
      </p>
      <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-slate-700">
        {tips.map((tip) => (
          <li key={tip} className="flex gap-2">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold-400" aria-hidden />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Active section -------------------------------------------------------------- */

function viewTitle(view: ProfileView) {
  return view === "review" ? reviewVisual.title : profileSectionMeta[view].title;
}

function SectionStepper({ active }: { active: ProfileView }) {
  const index = views.indexOf(active);
  const previous = views[index - 1];
  const next = views[index + 1];
  const linkClass =
    "flex size-9 items-center justify-center rounded-xl text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-50 hover:text-ink-950 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:outline-none";

  return (
    <div className="flex items-center gap-1.5">
      {previous ? (
        <Link href={`/profile?section=${previous}`} scroll={false} className={linkClass} aria-label={`Previous: ${viewTitle(previous)}`}>
          <ChevronLeft className="size-4" aria-hidden />
        </Link>
      ) : (
        <span className={cn(linkClass, "pointer-events-none opacity-40")} aria-hidden>
          <ChevronLeft className="size-4" />
        </span>
      )}
      {next ? (
        <Link href={`/profile?section=${next}`} scroll={false} className={linkClass} aria-label={`Next: ${viewTitle(next)}`}>
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span className={cn(linkClass, "pointer-events-none opacity-40")} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
      )}
    </div>
  );
}

function ResumeSection({ profile, locked }: { profile: CandidateProfile; locked: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      {profile.resume && (
        <FileRow
          name={profile.resume.name}
          href={profile.resume.url}
          meta={
            <>
              {formatFileSize(profile.resume.sizeBytes)} · Uploaded <LocalTime value={profile.resume.uploadedAt} format="date" />
            </>
          }
        />
      )}
      {!locked && (
        <FileUpload
          upload={uploadResume}
          rules={resumeUploadRules}
          label={profile.resume ? "Replace your resume" : "Upload your resume"}
          success="Resume uploaded"
        />
      )}
      <p className="text-xs leading-5 text-muted-foreground">
        Recruiters only see your resume once you&apos;re listed, and only if you allow it in your listing settings.
      </p>
      {profile.resume && (
        <div className="flex justify-end border-t border-black/6 pt-5">
          <Link href="/profile?section=review" scroll={false} className={buttonVariants({ variant: "brand", size: "cta" })}>
            Continue to review
            <ArrowRight aria-hidden />
          </Link>
        </div>
      )}
    </div>
  );
}

export function ProfileEditor({
  profile,
  active,
  stage,
}: {
  profile: CandidateProfile;
  active: ProfileView;
  stage: StageSummary;
}) {
  const completion = profileCompletion(profile);
  const submitted = stage.status === "completed";
  const isReview = active === "review";
  const visual = isReview ? null : sectionVisuals[active];
  const Icon = visual?.icon ?? ClipboardCheck;
  const Form = isReview || active === "resume" ? null : forms[active];
  const done = isReview ? submitted : completion.complete.includes(active);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[19rem_1fr]">
      <aside className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-28">
        <SectionNav active={active} completion={completion} submitted={submitted} />
        <TipsCard tips={visual?.tips ?? reviewVisual.tips} />
      </aside>

      <section aria-labelledby="section-heading" className={cn(panelClass, "sm:p-8")}>
        <div className="mb-7 flex flex-col gap-4 border-b border-black/6 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl ring-1", accentTile[visual?.accent ?? "blue"])}>
              <Icon className="size-6" strokeWidth={1.8} aria-hidden />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-600">
                {isReview ? "Final step" : `Section ${profileSectionKeys.indexOf(active as ProfileSectionKey) + 1} of ${profileSectionKeys.length}`}
              </p>
              <h2 id="section-heading" className="mt-1 font-heading text-2xl font-medium tracking-tight text-ink-950">
                {viewTitle(active)}
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {isReview ? reviewVisual.description : profileSectionMeta[active as ProfileSectionKey].description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge
              status={
                isReview
                  ? submitted
                    ? { label: "Submitted", tone: "success" }
                    : { label: "Not submitted", tone: "neutral" }
                  : done
                    ? { label: "Complete", tone: "success" }
                    : { label: "Needs details", tone: "neutral" }
              }
            />
            <SectionStepper active={active} />
          </div>
        </div>

        {profile.locked && (
          <p role="status" className="mb-6 flex items-start gap-2 rounded-2xl border border-brand-200 bg-brand-50 p-3 text-sm leading-6 text-brand-900">
            <LockKeyhole className="mt-0.5 size-4 shrink-0" aria-hidden />
            {profile.lockedReason ?? "Your profile is under review, so editing is paused until the reviewer responds."}
          </p>
        )}

        {isReview ? (
          <ReviewAndSubmit profile={profile} completion={completion} submitted={submitted} />
        ) : Form ? (
          <Form key={active} profile={profile} locked={profile.locked} />
        ) : (
          <ResumeSection profile={profile} locked={profile.locked} />
        )}
      </section>
    </div>
  );
}
