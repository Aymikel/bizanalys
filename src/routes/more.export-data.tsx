import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Card, Field, PrimaryButton, SectionPage, inputClass } from "@/components/SectionPage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/more/export-data")({
  head: () => ({
    meta: [
      { title: "Export data — BizAnalyst" },
      { name: "description", content: "Take your records with you as PDF, Excel or CSV." },
      { property: "og:title", content: "Export data — BizAnalyst" },
      { property: "og:description", content: "Export transactions and reports for any date range." },
    ],
  }),
  component: ExportDataPage,
});

const FORMATS = ["PDF", "Excel", "CSV"] as const;

function ExportDataPage() {
  const [format, setFormat] = useState<(typeof FORMATS)[number]>("PDF");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <SectionPage title="Export data" subtitle="For your accountant, your bank, or your own files.">
      <Card className="space-y-4 p-4">
        <div>
          <span className="block text-xs font-medium text-muted-foreground">Format</span>
          <div className="mt-2 flex gap-2">
            {FORMATS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={cn(
                  "min-h-11 flex-1 rounded-xl text-sm font-medium transition-opacity active:opacity-80",
                  format === f ? "bg-blue-900 text-primary-foreground" : "bg-paper-100 text-charcoal-500",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="From">
            <input type="date" className={inputClass} value={from} onChange={(e) => setFrom(e.target.value)} />
          </Field>
          <Field label="To">
            <input type="date" className={inputClass} value={to} onChange={(e) => setTo(e.target.value)} />
          </Field>
        </div>
      </Card>

      <PrimaryButton onClick={() => toast.success(`Preparing your ${format} export`)}>
        <Download className="h-4 w-4" aria-hidden /> Export
      </PrimaryButton>
    </SectionPage>
  );
}
