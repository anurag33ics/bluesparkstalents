"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function EnquiryForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(
      `Enquiry from ${values.name || "website visitor"}`
    );
    const body = encodeURIComponent(
      `Name: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phone}\n\n${values.message}`
    );
    window.location.href = `mailto:support@bluesparkstalents.com?subject=${subject}&body=${body}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-card p-6 shadow-xl ring-1 ring-border/70 sm:p-8"
    >
      <h3 className="font-heading text-lg font-bold text-foreground">
        Send Us an Enquiry
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        We&apos;ll get back to you at the email you provide.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="enquiry-name">Name</Label>
          <Input
            id="enquiry-name"
            required
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            placeholder="Your name"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="enquiry-phone">Phone (optional)</Label>
          <Input
            id="enquiry-phone"
            type="tel"
            value={values.phone}
            onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
            placeholder="+91 00000 00000"
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="enquiry-email">Email</Label>
          <Input
            id="enquiry-email"
            type="email"
            required
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            placeholder="you@example.com"
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="enquiry-message">Message</Label>
          <Textarea
            id="enquiry-message"
            required
            rows={3}
            value={values.message}
            onChange={(e) =>
              setValues((v) => ({ ...v, message: e.target.value }))
            }
            placeholder="Tell us what you're looking for"
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-6 w-full">
        Send Enquiry
        <Send data-icon="inline-end" className="size-4" />
      </Button>
    </form>
  );
}
