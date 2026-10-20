"use client";

import { useState } from "react";
import { Form, Formik } from "formik";
import { ArrowLeft, ArrowRight, Check, Lightbulb, Loader2 } from "lucide-react";
import { cn } from "cn";
import { ActionButton } from "@/components/forms/action-button";
import { settle } from "@/components/forms/feedback";
import { TextAreaField } from "@/components/forms/fields";
import { Meter } from "@/components/journey/meter";
import { Button } from "@/components/ui/button";
import { finishAiInterview, saveAiAnswer } from "@/lib/actions/candidate";
import { aiAnswerSchema } from "@/lib/journey/schemas";
import type { AiInterviewSession } from "@/lib/journey/types";

/**
 * One question at a time. Each answer is saved to the API as soon as the
 * candidate moves on, so leaving and coming back resumes where they stopped.
 */
export function InterviewRunner({ session }: { session: AiInterviewSession }) {
  const questions = [...session.questions].sort((a, b) => a.order - b.order);
  const firstOpen = questions.findIndex((question) => !question.answer);
  const [index, setIndex] = useState(firstOpen === -1 ? questions.length - 1 : firstOpen);

  const question = questions[index];
  const answered = questions.filter((entry) => entry.answer).length;
  const allAnswered = answered === questions.length;
  const isLast = index === questions.length - 1;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
      <section aria-labelledby="question-heading" className="rounded-3xl border border-brand-100 bg-white p-5 shadow-sm shadow-brand-500/5 sm:p-7">
        <Meter label={`Question ${index + 1} of ${questions.length}`} value={answered} max={questions.length} valueLabel={`${answered} answered`} />

        <nav aria-label="Questions" className="mt-5">
          <ol className="flex flex-wrap gap-2">
            {questions.map((entry, position) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => setIndex(position)}
                  aria-current={position === index ? "step" : undefined}
                  aria-label={`Question ${position + 1}${entry.answer ? ", answered" : ""}`}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:outline-none",
                    position === index
                      ? "bg-brand-600 text-white"
                      : entry.answer
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : "bg-brand-50 text-brand-700 hover:bg-brand-100"
                  )}
                >
                  {entry.answer && position !== index ? <Check className="size-4" aria-hidden /> : position + 1}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-7">
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">{question.competency}</span>
          <h2 id="question-heading" className="mt-3 font-heading text-xl leading-snug font-medium text-brand-950 sm:text-2xl">
            {question.prompt}
          </h2>
        </div>

        <Formik
          key={question.id}
          initialValues={{ answer: question.answer ?? "" }}
          validationSchema={aiAnswerSchema}
          onSubmit={async (values, helpers) => {
            const result = await saveAiAnswer(session.id, question.id, values);
            if (!settle(result, { setErrors: helpers.setErrors })) return;
            if (!isLast) setIndex(index + 1);
            else helpers.resetForm({ values });
          }}
        >
          {({ isSubmitting, dirty }) => (
            <Form noValidate className="mt-6 flex flex-col gap-5">
              <TextAreaField name="answer" label="Your answer" required rows={9} maxLength={4000} hint="Be specific: what you did, how, and the result." />
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="button" variant="brand-ghost" size="cta" disabled={index === 0 || isSubmitting} onClick={() => setIndex(index - 1)}>
                  <ArrowLeft aria-hidden />
                  Previous
                </Button>
                <Button type="submit" variant={dirty || !question.answer ? "brand" : "brand-outline"} size="cta" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="animate-spin" aria-hidden />}
                  {isLast ? "Save answer" : "Save & next"}
                  {!isLast && !isSubmitting && <ArrowRight aria-hidden />}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </section>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-28">
        <div className="rounded-3xl border border-brand-100 bg-white p-5 shadow-sm shadow-brand-500/5">
          <p className="font-semibold text-brand-950">
            {session.role} · {session.skillCategory}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {answered} of {questions.length} answered. Answer every question to get your report.
          </p>
          <ActionButton
            action={finishAiInterview.bind(null, session.id)}
            disabled={!allAnswered}
            className="mt-4 w-full"
            success="Interview submitted"
            confirm={{
              title: "Finish and get your report?",
              description: "Your answers will be assessed and you won't be able to change them.",
              confirmLabel: "Finish interview",
            }}
          >
            Finish & get report
          </ActionButton>
        </div>

        <div className="rounded-3xl bg-gold-50 p-5 text-sm leading-6 text-ink-950 ring-1 ring-gold-100">
          <p className="flex items-center gap-2 font-semibold text-ink-950">
            <Lightbulb className="size-4 text-gold-600" aria-hidden />
            Tips for strong answers
          </p>
          <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 marker:text-gold-500">
            <li>Use STAR: situation, task, action, result.</li>
            <li>Name tools and trade-offs, not just outcomes.</li>
            <li>Quantify impact where you can.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
