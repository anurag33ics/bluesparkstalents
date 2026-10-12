import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  HelpCircle,
  Mail,
  ShieldCheck,
  BriefcaseBusiness,
  MessageCircle,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/reveal";

const faqs = [
  {
    question: "How much does candidate screening cost?",
    answer: "A one-time professional screening interview costs ₹499. It includes your skills assessment, document verification, and detailed interview-ready feedback.",
  },
  {
    question: "How do I register as a candidate?",
    answer: "Create your profile, complete the one-time screening interview, and get verified. Once verified, your profile can become visible to hiring companies looking for talent like you.",
  },
  {
    question: "How does Bluespark Talents verify candidates?",
    answer: "Every candidate goes through a structured screening interview and document verification. We assess skills and communication before providing a verified profile badge.",
  },
  {
    question: "How can my company access verified candidates?",
    answer: "Contact us to set up a client account. Once your account is active, you can browse, filter, and shortlist verified candidates based on skills, domain, experience, and hiring requirements.",
  },
  {
    question: "What do candidates get after screening?",
    answer: "Candidates receive detailed interview feedback, a verified profile badge, and increased visibility to companies actively looking for relevant talent.",
  },
  {
    question: "How do I contact support?",
    answer: "You can contact our support team at support@bluesparkstalents.com for help with registration, screening, verification, accounts, or general questions.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative scroll-mt-16 overflow-hidden bg-white py-20 sm:py-24 lg:py-32">

      <div className="pointer-events-none absolute right-10 top-16 hidden h-24 w-24 opacity-20 lg:block">
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 25 }).map((_, index) => (
            <span key={index} className="h-1.5 w-1.5 rounded-full bg-brand-400" />
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            MAIN GRID
        ====================================================== */}

        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">

          {/* ===================================================
              LEFT CONTENT
          ==================================================== */}

          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-600/25 bg-white px-4 py-2 shadow-sm">
                <HelpCircle className="h-4 w-4 text-brand-600" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                  FAQ
                </span>
              </div>

              {/* Heading */}
              <h2 className="mt-7 font-heading text-5xl font-medium leading-[0.92] tracking-tight text-brand-950 sm:text-6xl lg:text-7xl">
                Got
                <br />
                <span className="text-brand-600">questions?</span>
              </h2>

              {/* Description */}
              <p className="mt-7 max-w-sm text-base leading-7 text-brand-950/60 sm:text-lg">
                We've answered some of the most common questions from
                candidates and companies. If you can't find what you're
                looking for, we're here to help.
              </p>

              {/* Audience chips */}
              <div className="mt-8 grid grid-cols-3 gap-2 sm:max-w-md sm:gap-3 lg:grid-cols-1">

                <div className="rounded-2xl border border-brand-950/8 bg-white p-3 shadow-sm sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-950 sm:text-sm">For Candidates</p>
                      <p className="mt-0.5 hidden text-[11px] text-gray-500 sm:block">Get clear answers</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-brand-950/8 bg-white p-3 shadow-sm sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <BriefcaseBusiness className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-950 sm:text-sm">For Companies</p>
                      <p className="mt-0.5 hidden text-[11px] text-gray-500 sm:block">Find what you need</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-brand-950/8 bg-white p-3 shadow-sm sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-950 sm:text-sm">Always Supported</p>
                      <p className="mt-0.5 hidden text-[11px] text-gray-500 sm:block">We're here to help</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Contact card */}
              <div className="mt-6 overflow-hidden rounded-[2rem] border border-brand-100 bg-white p-6 shadow-xl shadow-brand-500/10 sm:p-7">

                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white">
                    <Mail className="h-5 w-5" />
                  </div>

                  <ArrowUpRight className="h-5 w-5 text-brand-600" />
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
                  Still have a question?
                </p>

                <h3 className="mt-2 font-heading text-xl font-medium text-brand-950">
                  Talk to our support team.
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#536888]">
                  We're happy to help you with registration, screening,
                  verification, or hiring.
                </p>

                <Link href="mailto:support@bluesparkstalents.com" className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-600">
                  Email Us
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

              </div>

            </div>
          </Reveal>

          {/* ===================================================
              RIGHT FAQ
          ==================================================== */}

          <Reveal delay={120} className="lg:col-span-8">
            <div className="relative">

              {/* Small label */}
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-950/40">
                  Frequently Asked
                </p>

                <div className="hidden items-center gap-2 text-xs font-semibold text-brand-600 sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                  We're here to help
                </div>
              </div>

              <Accordion defaultValue={["faq-0"]} className="space-y-4">

                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`faq-${index}`} className="group relative overflow-hidden rounded-[1.75rem] border border-brand-950/8 bg-white px-5 shadow-sm transition-all duration-500 hover:border-brand-500/40 hover:shadow-lg data-[state=open]:border-brand-300 data-[state=open]:bg-white data-[state=open]:shadow-xl sm:px-7">

                    <AccordionTrigger className="py-6 text-left font-heading text-base font-bold text-brand-950 hover:no-underline data-[state=open]:text-brand-700 sm:text-lg">

                      <div className="flex items-center gap-4 pr-4">

                        {/* Number */}
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 font-heading text-xs font-medium text-brand-950 transition-all duration-500 group-data-[state=open]:bg-white0 group-data-[state=open]:text-white">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span>{faq.question}</span>

                      </div>

                    </AccordionTrigger>

                    <AccordionContent className="pb-7 pl-14 pr-8 text-sm leading-7 text-[#536888] sm:text-base">
                      {faq.answer}
                    </AccordionContent>

                    {/* Active accent */}
                    <div className="absolute bottom-0 left-0 h-1 w-0 rounded-r-full bg-brand-500 transition-all duration-500 group-data-[state=open]:w-full" />

                  </AccordionItem>
                ))}

              </Accordion>

            </div>
          </Reveal>

        </div>

      </div>
    </section>
  );
}