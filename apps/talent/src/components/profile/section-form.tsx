"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Form, Formik, type FormikHelpers, type FormikValues } from "formik";
import type * as Yup from "yup";
import { CircleCheck, Loader2 } from "lucide-react";
import { settle } from "@/components/forms/feedback";
import { FormDisabledContext } from "@/components/forms/fields";
import { Button } from "@/components/ui/button";
import { saveProfileSection } from "@/lib/actions/candidate";
import { profileCompletion } from "@/lib/journey/profile";
import type { EditableProfileSection } from "@/lib/journey/schemas";
import type { ProfileSectionKey } from "@/lib/journey/types";
import { profileSectionKeys } from "@/lib/journey/types";

/**
 * Formik wrapper shared by every profile section: validates with the section
 * schema, saves through the server action and can move on to the next
 * incomplete section. Progress is saved per section, so candidates can stop at
 * any point and continue later.
 */
export function SectionForm<Values extends FormikValues>({
  section,
  initialValues,
  schema,
  locked,
  children,
}: {
  section: EditableProfileSection;
  initialValues: Values;
  schema: Yup.AnyObjectSchema;
  locked: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const continueAfterSave = useRef(false);

  async function onSubmit(values: Values, helpers: FormikHelpers<Values>) {
    const result = await saveProfileSection(section, values);
    if (!settle(result, { success: "Saved", setErrors: helpers.setErrors })) return;

    helpers.resetForm({ values });
    if (continueAfterSave.current) {
      // Next incomplete section, or the final review once everything is filled in.
      const { incomplete } = profileCompletion(result.data);
      const order = profileSectionKeys;
      const after = order.slice(order.indexOf(section) + 1);
      const next: ProfileSectionKey | "review" = after.find((key) => incomplete.includes(key)) ?? incomplete[0] ?? "review";
      if (next !== section) router.push(`/profile?section=${next}`);
    }
  }

  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit} enableReinitialize>
      {({ isSubmitting, dirty, submitForm }) => (
        <Form noValidate>
          <FormDisabledContext.Provider value={locked || isSubmitting}>
            <div className="flex flex-col gap-5">{children}</div>
          </FormDisabledContext.Provider>

          {!locked && (
            <div className="sticky bottom-4 z-10 mt-8 flex flex-col-reverse gap-3 rounded-2xl bg-white/90 p-3 shadow-[0_12px_32px_-12px_rgba(11,21,51,0.25)] ring-1 ring-black/8 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:pl-5">
              <p className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
                {dirty ? (
                  <>
                    <span className="size-2 rounded-full bg-amber-500" aria-hidden />
                    Unsaved changes
                  </>
                ) : (
                  <>
                    <CircleCheck className="size-4 text-emerald-600" aria-hidden />
                    All changes saved. You can finish later.
                  </>
                )}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="brand-outline"
                  size="cta"
                  disabled={isSubmitting}
                  onClick={() => {
                    continueAfterSave.current = false;
                    void submitForm();
                  }}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="brand"
                  size="cta"
                  disabled={isSubmitting}
                  onClick={() => {
                    continueAfterSave.current = true;
                    void submitForm();
                  }}
                >
                  {isSubmitting && <Loader2 className="animate-spin" aria-hidden />}
                  Save & continue
                </Button>
              </div>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
}
