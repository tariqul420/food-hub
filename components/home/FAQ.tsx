"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = [
  {
    q: "How long does delivery take?",
    a: "Typically 30–60 minutes depending on provider and location.",
  },
  {
    q: "Do you accept cash on delivery?",
    a: "Yes — COD is available for most providers.",
  },
  {
    q: "How do I become a provider?",
    a: "Sign up via the Become a Provider link and follow onboarding steps.",
  },
  {
    q: "What about refunds?",
    a: "Refunds are handled per provider policy; we mediate when required.",
  },
];

export default function FAQSection() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">FAQ</h2>

      <Accordion type="single" collapsible>
        {FAQ.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{f.q}</AccordionTrigger>
            <AccordionContent>{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
