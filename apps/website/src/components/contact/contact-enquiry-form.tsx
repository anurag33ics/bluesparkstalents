"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactEnquiryForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = encodeURIComponent(`Website enquiry from ${values.name || "a visitor"}`);
    const body = encodeURIComponent(
      `Name: ${values.name}\nEmail: ${values.email}\nCompany: ${values.company}\n\n${values.message}`
    );
    window.location.href = `mailto:support@bluesparkstalents.com?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white bg-white p-6 shadow-2xl shadow-brand-500/15 sm:p-8 lg:p-9">
      <div className="flex items-start justify-between gap-5 border-b border-brand-100 pb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Enquiry form</p>
          <h3 className="mt-2 font-heading text-2xl font-medium tracking-tight text-brand-950 sm:text-3xl">Let&apos;s make the introduction count.</h3>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Send className="h-5 w-5" /></span>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name" className="font-semibold text-brand-950">Your name</Label>
          <Input id="contact-name" required value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} placeholder="Jane Smith" className="h-11 border-brand-950/15 bg-white px-3 focus-visible:border-brand-600" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email" className="font-semibold text-brand-950">Work email</Label>
          <Input id="contact-email" type="email" required value={values.email} onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))} placeholder="jane@company.com" className="h-11 border-brand-950/15 bg-white px-3 focus-visible:border-brand-600" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact-company" className="font-semibold text-brand-950">Company or context <span className="font-normal text-[#536888]">(optional)</span></Label>
          <Input id="contact-company" value={values.company} onChange={(event) => setValues((current) => ({ ...current, company: event.target.value }))} placeholder="Tell us where you are coming from" className="h-11 border-brand-950/15 bg-white px-3 focus-visible:border-brand-600" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact-message" className="font-semibold text-brand-950">How can we help?</Label>
          <Textarea id="contact-message" required rows={5} value={values.message} onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))} placeholder="Tell us a little about the role, opportunity, or conversation you have in mind." className="resize-none border-brand-950/15 bg-white px-3 py-3 focus-visible:border-brand-600" />
        </div>
      </div>

      <button type="submit" className="group mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-500 sm:w-auto">
        Send enquiry
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
      <p className="mt-4 text-xs leading-5 text-[#536888]">Submitting opens your email app with your message addressed to our team.</p>
    </form>
  );
}