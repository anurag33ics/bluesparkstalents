"use client";

import { Form, Formik } from "formik";
import { Loader2, Send } from "lucide-react";
import { settle } from "@/components/forms/feedback";
import { CheckboxField } from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import { submitVerification } from "@/lib/actions/candidate";
import { verificationSubmitSchema } from "@/lib/journey/schemas";

export function SubmitVerificationForm({
  resubmit,
  canSubmit,
  blockedReason,
}: {
  resubmit: boolean;
  canSubmit: boolean;
  blockedReason: string | null;
}) {
  return (
    <Formik
      initialValues={{ declaration: false }}
      validationSchema={verificationSubmitSchema}
      onSubmit={async (values, helpers) => {
        const result = await submitVerification(values);
        if (settle(result, { success: resubmit ? "Resubmitted for verification" : "Submitted for verification", setErrors: helpers.setErrors })) {
          helpers.resetForm();
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form noValidate className="flex flex-col gap-4">
          <CheckboxField
            name="declaration"
            disabled={!canSubmit}
            label="I confirm the information in my profile and documents is accurate and my own."
            description="Submitting false information can lead to permanent removal from the platform."
          />
          {!canSubmit && blockedReason && <p className="text-sm text-muted-foreground">{blockedReason}</p>}
          <Button type="submit" variant="brand" size="cta" className="self-start" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />}
            {resubmit ? "Resubmit for verification" : "Submit for verification"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
