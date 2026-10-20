"use client";

import { useId } from "react";
import { FieldArray, useFormikContext } from "formik";
import { BriefcaseBusiness, GraduationCap, Plus, Trash2, type LucideIcon } from "lucide-react";
import { cn } from "cn";
import { accentTile, type Accent } from "@/components/journey/accents";
import {
  CheckboxField,
  ChipGroupField,
  FormError,
  SelectField,
  TagField,
  TextAreaField,
  TextField,
} from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  employmentTypeLabels,
  genderLabels,
  jobTypeLabels,
  skillLevelLabels,
  workModeLabels,
} from "@/lib/journey/labels";
import { formatMonth } from "@/lib/format";
import { sectionValues } from "@/lib/journey/profile";
import {
  contactSchema,
  educationSchema,
  experienceSchema,
  personalSchema,
  preferencesSchema,
  skillsSchema,
} from "@/lib/journey/schemas";
import type { CandidateProfile, EducationEntry, ExperienceEntry, Skill } from "@/lib/journey/types";
import { SectionForm } from "./section-form";

type FormProps = { profile: CandidateProfile; locked: boolean };

const twoColumns = "grid gap-5 sm:grid-cols-2";

export function PersonalForm({ profile, locked }: FormProps) {
  return (
    <SectionForm section="personal" initialValues={sectionValues(profile, "personal")} schema={personalSchema} locked={locked}>
      <div className={twoColumns}>
        <TextField name="firstName" label="First name" required autoComplete="given-name" />
        <TextField name="lastName" label="Last name" required autoComplete="family-name" />
        <TextField name="dateOfBirth" label="Date of birth" type="date" required autoComplete="bday" />
        <SelectField name="gender" label="Gender" options={genderLabels} placeholder="Optional" hint="Optional. Never shown to recruiters." />
      </div>
      <TextField
        name="headline"
        label="Professional headline"
        required
        maxLength={120}
        placeholder="e.g. Frontend developer · React, Next.js & TypeScript"
        hint="One line recruiters see first."
      />
      <TextAreaField
        name="summary"
        label="Profile summary"
        required
        maxLength={1500}
        rows={6}
        hint="What you do, what you're great at and what you're looking for."
      />
    </SectionForm>
  );
}

export function ContactForm({ profile, locked }: FormProps) {
  return (
    <SectionForm section="contact" initialValues={sectionValues(profile, "contact")} schema={contactSchema} locked={locked}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="account-email" className="text-sm font-semibold text-brand-950">
          Email address
        </Label>
        <Input id="account-email" value={profile.contact.email} readOnly disabled className="h-11 rounded-xl border-slate-200 bg-slate-50 px-3.5" aria-describedby="account-email-hint" />
        <p id="account-email-hint" className="text-xs text-muted-foreground">
          This is your sign-in email. Change it from account settings.
        </p>
      </div>
      <div className={twoColumns}>
        <TextField name="phone" label="Phone number" type="tel" required autoComplete="tel" placeholder="+91 98123 45678" hint="Include your country code." />
        <TextField name="city" label="City" required autoComplete="address-level2" />
        <TextField name="state" label="State" required autoComplete="address-level1" />
        <TextField name="country" label="Country" required autoComplete="country-name" />
        <TextField name="linkedinUrl" label="LinkedIn profile" type="url" placeholder="https://www.linkedin.com/in/…" hint="Optional" />
        <TextField name="portfolioUrl" label="Portfolio or GitHub" type="url" placeholder="https://…" hint="Optional" />
      </div>
      <p className="rounded-2xl bg-slate-50 p-3 text-xs leading-5 text-muted-foreground ring-1 ring-slate-200">
        Your phone number and email are never shown on the hiring portal. Recruiters have to request them, and you decide whether to share.
      </p>
    </SectionForm>
  );
}

const emptyEducation: EducationEntry = { institution: "", degree: "", fieldOfStudy: "", startYear: null, endYear: null, grade: "" };

function EntryCard({
  icon: Icon,
  accent,
  title,
  subtitle,
  onRemove,
  removeLabel,
  children,
}: {
  icon: LucideIcon;
  accent: Accent;
  title: string;
  subtitle?: string;
  onRemove?: () => void;
  removeLabel: string;
  children: React.ReactNode;
}) {
  const headingId = useId();

  return (
    <div role="group" aria-labelledby={headingId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl ring-1", accentTile[accent])}>
            <Icon className="size-4.5" strokeWidth={1.9} aria-hidden />
          </span>
          <div className="min-w-0">
            <p id={headingId} className="truncate font-semibold text-ink-950">
              {title}
            </p>
            {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {onRemove && (
          <Button type="button" variant="ghost" size="icon" className="size-9 shrink-0 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-700" onClick={onRemove} aria-label={removeLabel}>
            <Trash2 aria-hidden />
          </Button>
        )}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function monthRange(start: string, end: string | null, current: boolean) {
  if (!/^\d{4}-\d{2}$/.test(start)) return "";
  const to = current ? "Present" : end && /^\d{4}-\d{2}$/.test(end) ? formatMonth(end) : "";
  return to ? `${formatMonth(start)} – ${to}` : formatMonth(start);
}

export function EducationForm({ profile, locked }: FormProps) {
  const initial = sectionValues(profile, "education");
  return (
    <SectionForm
      section="education"
      initialValues={{ items: initial.items.length ? initial.items : [emptyEducation] }}
      schema={educationSchema}
      locked={locked}
    >
      <EducationEntries locked={locked} />
    </SectionForm>
  );
}

function EducationEntries({ locked }: { locked: boolean }) {
  const { values } = useFormikContext<{ items: EducationEntry[] }>();

  return (
    <FieldArray name="items">
      {({ push, remove }) => (
        <>
          {values.items.map((entry, index) => (
            <EntryCard
              key={entry.id ?? index}
              icon={GraduationCap}
              accent="teal"
              title={entry.degree ? [entry.degree, entry.fieldOfStudy].filter(Boolean).join(", ") : `Qualification ${index + 1}`}
              subtitle={[entry.institution, [entry.startYear, entry.endYear ?? (entry.startYear ? "Present" : null)].filter(Boolean).join(" – ")]
                .filter(Boolean)
                .join(" · ")}
              removeLabel={`Remove qualification ${index + 1}`}
              onRemove={!locked && values.items.length > 1 ? () => remove(index) : undefined}
            >
              <div className={twoColumns}>
                <TextField name={`items.${index}.institution`} label="Institution" required className="sm:col-span-2" />
                <TextField name={`items.${index}.degree`} label="Degree" required placeholder="e.g. B.Tech, MBA, Diploma" />
                <TextField name={`items.${index}.fieldOfStudy`} label="Field of study" required />
                <TextField name={`items.${index}.startYear`} label="Start year" type="number" inputMode="numeric" required />
                <TextField name={`items.${index}.endYear`} label="End year" type="number" inputMode="numeric" hint="Leave blank if you're still studying." />
                <TextField name={`items.${index}.grade`} label="Grade or CGPA" hint="Optional" />
              </div>
            </EntryCard>
          ))}
          <FormError name="items" />
          {!locked && (
            <Button type="button" variant="brand-outline" size="cta" className="self-start" onClick={() => push(emptyEducation)}>
              <Plus aria-hidden />
              Add qualification
            </Button>
          )}
        </>
      )}
    </FieldArray>
  );
}

const emptyExperience: ExperienceEntry = {
  company: "",
  title: "",
  employmentType: "full_time",
  startMonth: "",
  endMonth: null,
  current: false,
  description: "",
};

export function ExperienceForm({ profile, locked }: FormProps) {
  return (
    <SectionForm section="experience" initialValues={sectionValues(profile, "experience")} schema={experienceSchema} locked={locked}>
      <ExperienceFields locked={locked} />
    </SectionForm>
  );
}

function ExperienceFields({ locked }: { locked: boolean }) {
  const { values } = useFormikContext<{ fresher: boolean; items: ExperienceEntry[] }>();

  return (
    <>
      <CheckboxField name="fresher" label="I'm a fresher" description="Tick this if you haven't worked full-time yet. Internships can still be added below." />
      {!values.fresher && (
        <TextField
          name="totalYears"
          label="Total experience (years)"
          type="number"
          step="0.5"
          min="0"
          inputMode="decimal"
          required
          className="sm:max-w-xs"
        />
      )}

      <FieldArray name="items">
        {({ push, remove }) => (
          <>
            {values.items.map((entry, index) => (
              <EntryCard
                key={entry.id ?? index}
                icon={BriefcaseBusiness}
                accent="indigo"
                title={entry.title || `Role ${index + 1}`}
                subtitle={[entry.company, monthRange(entry.startMonth, entry.endMonth, entry.current)].filter(Boolean).join(" · ")}
                removeLabel={`Remove role ${index + 1}`}
                onRemove={!locked ? () => remove(index) : undefined}
              >
                <div className={twoColumns}>
                  <TextField name={`items.${index}.title`} label="Job title" required />
                  <TextField name={`items.${index}.company`} label="Company" required />
                  <SelectField name={`items.${index}.employmentType`} label="Employment type" options={employmentTypeLabels} required />
                  <div className="hidden sm:block" />
                  <TextField name={`items.${index}.startMonth`} label="Start month" type="month" required />
                  {!entry.current && <TextField name={`items.${index}.endMonth`} label="End month" type="month" required />}
                  <CheckboxField name={`items.${index}.current`} label="I currently work here" className="sm:col-span-2" />
                  <TextAreaField
                    name={`items.${index}.description`}
                    label="What did you do?"
                    maxLength={1000}
                    rows={3}
                    hint="Responsibilities and measurable results."
                    className="sm:col-span-2"
                  />
                </div>
              </EntryCard>
            ))}
            <FormError name="items" />
            {!locked && (
              <Button type="button" variant="brand-outline" size="cta" className="self-start" onClick={() => push(emptyExperience)}>
                <Plus aria-hidden />
                Add role
              </Button>
            )}
          </>
        )}
      </FieldArray>
    </>
  );
}

const emptySkill: Skill = { name: "", level: "intermediate" };

export function SkillsForm({ profile, locked }: FormProps) {
  const initial = sectionValues(profile, "skills");
  return (
    <SectionForm
      section="skills"
      initialValues={{ items: initial.items.length ? initial.items : [emptySkill, emptySkill, emptySkill] }}
      schema={skillsSchema}
      locked={locked}
    >
      <SkillRows locked={locked} />
    </SectionForm>
  );
}

function SkillRows({ locked }: { locked: boolean }) {
  const { values } = useFormikContext<{ items: Skill[] }>();

  return (
    <FieldArray name="items">
      {({ push, remove }) => (
        <>
          <p className="text-sm text-muted-foreground">Add at least 3 skills. Recruiters search and filter by these.</p>
          <ul className="flex flex-col gap-3">
            {values.items.map((_, index) => (
              <li key={index} className="grid items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:grid-cols-[1fr_12rem_auto] sm:p-4">
                <TextField name={`items.${index}.name`} label={`Skill ${index + 1}`} required placeholder="e.g. React" />
                <SelectField name={`items.${index}.level`} label="Level" options={skillLevelLabels} required />
                {!locked && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-0 size-11 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-700 sm:mt-6.5"
                    onClick={() => remove(index)}
                    aria-label={`Remove skill ${index + 1}`}
                  >
                    <Trash2 aria-hidden />
                  </Button>
                )}
              </li>
            ))}
          </ul>
          <FormError name="items" />
          {!locked && values.items.length < 20 && (
            <Button type="button" variant="brand-outline" size="cta" className="self-start" onClick={() => push(emptySkill)}>
              <Plus aria-hidden />
              Add skill
            </Button>
          )}
        </>
      )}
    </FieldArray>
  );
}

export function PreferencesForm({ profile, locked }: FormProps) {
  return (
    <SectionForm section="preferences" initialValues={sectionValues(profile, "preferences")} schema={preferencesSchema} locked={locked}>
      <TagField name="desiredRoles" label="Roles you want" required max={5} placeholder="e.g. Frontend Developer" />
      <ChipGroupField name="jobTypes" label="Job types" required options={jobTypeLabels} />
      <ChipGroupField name="workModes" label="Work modes" required options={workModeLabels} />
      <TagField name="preferredLocations" label="Preferred locations" required max={5} placeholder="e.g. Bengaluru, or Remote" />
      <div className={twoColumns}>
        <TextField
          name="expectedSalary"
          label="Expected salary (₹ per year)"
          type="number"
          min="0"
          step="10000"
          inputMode="numeric"
          hint="Optional. Hidden from recruiters unless you choose to show it."
        />
        <TextField name="noticePeriodDays" label="Notice period (days)" type="number" min="0" inputMode="numeric" required hint="Enter 0 if you can join immediately." />
      </div>
      <CheckboxField name="willingToRelocate" label="I'm open to relocating" />
    </SectionForm>
  );
}
