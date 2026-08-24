import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ChevronRight, Lock } from "lucide-react";

export const Route = createFileRoute("/reports/")({
  head: () => ({
    meta: [
      { title: "Reports Centre — BizAnalyst" },
      {
        name: "description",
        content:
          "Profit & loss, cash flow, sales, expenses and inventory reports built from your daily records.",
      },
      { property: "og:title", content: "Reports Centre — BizAnalyst" },
      {
        property: "og:description",
        content: "Financial statements generated from what you recorded today.",
      },
    ],
  }),
  component: ReportsCentre,
});

const SECTIONS: Array<{
  title: string;
  reports: Array<{ name: string; desc: string; to?: "/reports/profit-loss" | "/reports/cash-flow" }>;
}> = [
  {
    title: "Financial",
    reports: [
      {
        name: "Profit & Loss",
        desc: "What you earned and spent over a period",
        to: "/reports/profit-loss",
      },
      { name: "Cash Flow", desc: "Money in and out by payment method", to: "/reports/cash-flow" },
      { name: "Balance Sheet", desc: "What you own and owe" },
    ],
  },
  {
    title: "Sales",
    reports: [
      { name: "Sales by day", desc: "Daily sales performance" },
      { name: "Top products", desc: "Best sellers by revenue" },
    ],
  },
  {
    title: "Expenses",
    reports: [
      { name: "Expenses by category", desc: "Where the money goes" },
      { name: "Recurring costs", desc: "Rent, salaries and subscriptions" },
    ],
  },
  {
    title: "Customers",
    reports: [{ name: "Receivables ageing", desc: "Who still owes you" }],
  },
  {
    title: "Suppliers",
    reports: [{ name: "Payables ageing", desc: "Who you still owe" }],
  },
  {
    title: "Inventory",
    reports: [{ name: "Stock movement", desc: "What came in and went out" }],
  },
  {
    title: "Management",
    reports: [{ name: "Owner summary", desc: "One-page monthly overview" }],
  },
];

function ReportsCentre() {
  return (
    <AppShell>
      <h1 className="text-2xl">Reports</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Built automatically from your recorded transactions.
      </p>

      <div className="mt-4 space-y-6">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="text-sm tracking-wide text-muted-foreground uppercase">{s.title}</h2>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {s.reports.map((r) =>
                r.to ? (
                  <Link
                    key={r.name}
                    to={r.to}
                    className="card-surface grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 p-4 transition-colors hover:bg-blue-50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-display text-sm font-medium text-charcoal-800">
                        {r.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">{r.desc}</span>
                    </span>
                    <ChevronRight className="h-5 w-5 shrink-0 text-blue-900" aria-hidden />
                  </Link>
                ) : (
                  <div
                    key={r.name}
                    className="card-surface grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 p-4 opacity-60"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-display text-sm font-medium text-charcoal-800">
                        {r.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">{r.desc}</span>
                    </span>
                    <Lock className="h-4 w-4 shrink-0 text-charcoal-500" aria-hidden />
                  </div>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
