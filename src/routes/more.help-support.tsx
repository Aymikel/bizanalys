import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Mail, MessageCircle } from "lucide-react";
import { Card, GroupLabel, SectionPage } from "@/components/SectionPage";
import { FAQS } from "@/lib/more-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/more/help-support")({
  head: () => ({
    meta: [
      { title: "Help & support — BizAnalyst" },
      { name: "description", content: "Answers to common questions and how to reach a human." },
      { property: "og:title", content: "Help & support — BizAnalyst" },
      { property: "og:description", content: "FAQs, email support and WhatsApp chat." },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
  const [open, setOpen] = useState<string | null>(FAQS[0]?.q ?? null);

  return (
    <SectionPage title="Help & support" subtitle="Stuck on something? Start here.">
      <div>
        <GroupLabel>Frequently asked</GroupLabel>
        <Card className="mt-2">
          {FAQS.map((f) => (
            <div key={f.q} className="border-b last:border-0">
              <button
                type="button"
                onClick={() => setOpen(open === f.q ? null : f.q)}
                className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-blue-50 active:opacity-80"
              >
                <span className="text-sm font-medium text-charcoal-800">{f.q}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-charcoal-500 transition-transform",
                    open === f.q && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
              {open === f.q && (
                <p className="px-4 pb-3 text-sm text-muted-foreground">{f.a}</p>
              )}
            </div>
          ))}
        </Card>
      </div>

      <div className="space-y-2">
        <a
          href="mailto:support@bizanalyst.app"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 text-sm font-semibold text-primary-foreground transition-opacity active:opacity-80"
        >
          <Mail className="h-4 w-4" aria-hidden /> Contact support
        </a>
        <a
          href="https://wa.me/2348000000000"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-paper-100 px-5 text-sm font-semibold text-blue-900 transition-opacity active:opacity-80"
        >
          <MessageCircle className="h-4 w-4" aria-hidden /> Chat on WhatsApp
        </a>
      </div>
    </SectionPage>
  );
}
