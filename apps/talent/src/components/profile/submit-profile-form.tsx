"use client";

import { useRouter } from "next/navigation";
import { Form, Formik } from "formik";
import { Loader2, Send } from "lucide-react";
import { settle } from "@/components/forms/feedback";
import { CheckboxField } from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import { completeProfile } from "@/lib/actions/candidate";
import { profileDeclarationSchema } from "@/lib/journey/schemas";

/** Authenticity declaration and final submit. On success the candidate moves on to payment. */
export function SubmitProfileForm({ ready, missing }: { ready: boolean; missing: string[] }) {
  const router = useRouter();

  return (
    <Formik
      initialValues={{ declaration: false }}
      validationSchema={profileDeclarationSchema}
      onSubmit={async (values, helpers) => {
        const result = await completeProfile(values);
        if (settle(result, { success: "Profile submitted", successDetail: "Next, complete your plan payment.", setErrors: helpers.setErrors })) {
          router.push("/plans");
        }
      }}
    >
      {({ isSubmitting, values }) => (
        <Form noValidate className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6">
          <CheckboxField
            name="declaration"
            disabled={!ready || isSubmitting}
            label="I confirm that the information I have provided is authentic and accurate."
            description="If anything needs correcting, edit that section first. You can make changes as many times as you need before you submit."
          />

          {!ready && (
            <p className="mt-4 text-sm text-muted-foreground">
              Complete {missing.join(", ")} before you submit.
            </p>
          )}

          <div className="mt-5 flex flex-col-reverse gap-3 border-t border-black/6 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">After submitting, you&apos;ll complete your plan payment.</p>
            <Button type="submit" variant="brand" size="cta" className="h-11 px-6" disabled={!ready || !values.declaration || isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />}
              Submit profile
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
