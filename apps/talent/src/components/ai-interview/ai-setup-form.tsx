"use client";

import { useRouter } from "next/navigation";
import { Form, Formik } from "formik";
import { Loader2, Play } from "lucide-react";
import { settle } from "@/components/forms/feedback";
import { RadioCardField, SelectField } from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import { startAiInterview } from "@/lib/actions/candidate";
import { experienceLevelLabels } from "@/lib/journey/labels";
import { aiSetupSchema } from "@/lib/journey/schemas";
import type { AiInterviewOptions, AiInterviewSetup } from "@/lib/journey/types";

const toOptions = (values: string[]) => Object.fromEntries(values.map((value) => [value, value]));

export function AiSetupForm({ options, defaults }: { options: AiInterviewOptions; defaults: Partial<AiInterviewSetup> }) {
  const router = useRouter();
  const initialValues = {
    role: defaults.role && options.roles.includes(defaults.role) ? defaults.role : "",
    experienceLevel: defaults.experienceLevel ?? "",
    skillCategory: defaults.skillCategory && options.skillCategories.includes(defaults.skillCategory) ? defaults.skillCategory : "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={aiSetupSchema}
      onSubmit={async (values, helpers) => {
        const result = await startAiInterview(values);
        if (settle(result, { setErrors: helpers.setErrors })) router.push(`/ai-interview/${encodeURIComponent(result.data.id)}`);
      }}
    >
      {({ isSubmitting }) => (
        <Form noValidate className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField name="role" label="Job role" required options={toOptions(options.roles)} placeholder="Choose a role" />
            <SelectField name="skillCategory" label="Skill category" required options={toOptions(options.skillCategories)} placeholder="Choose a category" />
          </div>
          <RadioCardField
            name="experienceLevel"
            label="Experience level"
            required
            columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            options={options.experienceLevels.map((level) => {
              const [label, years] = experienceLevelLabels[level].split(" (");
              return { value: level, label, description: years?.replace(")", "") };
            })}
          />
          <div className="flex flex-col gap-3 border-t border-brand-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {options.questionCount} questions · answer by typing
              {options.answerModes.includes("voice") ? " or speaking" : ""} · your answers save as you go
            </p>
            <Button type="submit" variant="brand" size="cta" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : <Play aria-hidden />}
              Start interview
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
