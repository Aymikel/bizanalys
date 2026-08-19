import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Money } from "@/components/Money";
import { ReportBottomBar, RangePicker } from "@/components/ReportChrome";
import { isIncome, trendSeries, useBusAnalyst } from "@/lib/busanalyst";

export const Route = createFileRoute("/reports/profit-loss")({
  head: () => ({
    meta: [
      { title: "Profit & Loss report — BusAnalyst" },
      {
        name: "description",
        content: "See revenue, cost lines and net profit for the last 7, 30 or 90 days.",
      },
      { property: "og:title", content: "Profit & Loss report — BusAnalyst" },
      { property: "og:description", content: "Revenue minus expenses, explained in plain terms." },
    ],
  }),
  component: ProfitLoss,
});

function ProfitLoss() {
  const { transactions } = useBusAnalyst();
  const [range, setRange] = useState(30);
  const dates = new Set(trendSeries(transactions, range).map((d) => d.date));
  const rows = transactions.filter((t) => dates.has(t.date));

  const revenue = rows.filter((t) => isIncome(t.kind)).reduce((s, t) => s + t.amount, 0);
  const byCategory = new Map<string, number>();
  for (const t of rows.filter((t) => !isIncome(t.kind))) {
    byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + t.amount);
  }
  const expenses = [...byCategory.values()].reduce((s, v) => s + v, 0);
  const profit = revenue - expenses;

  return (
    <AppShell>
      <h1 className="text-2xl">Profit &amp; Loss</h1>
      <RangePicker range={range} onChange={setRange} />

      <section className="mt-3 card-surface overflow-hidden">
        <Row label="Revenue" value={revenue} tone="income" bold />
        <div className="border-t bg-paper-100 px-4 py-2 text-xs tracking-wide text-muted-foreground uppercase">
          Expenses
        </div>
        {[...byCategory.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([cat, val]) => (
            <Row key={cat} label={cat} value={val} tone="expense" indent />
          ))}
        <Row label="Total expenses" value={expenses} tone="expense" bold />
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-t-2 border-blue-900 bg-blue-50 px-4 py-4">
          <span className="font-display font-semibold text-blue-900">Net profit</span>
          <Money
            value={profit}
            tone={profit >= 0 ? "income" : "expense"}
            className="text-lg font-medium"
          />
        </div>
      </section>

      <p className="mt-3 text-sm text-muted-foreground">
        Margin:{" "}
        <span className="money">
          {revenue ? Math.round((profit / revenue) * 100) : 0}%
        </span>{" "}
        of every naira earned stayed in the business.
      </p>

      <ReportBottomBar />
    </AppShell>
  );
}

function Row({
  label,
  value,
  tone,
  bold,
  indent,
}: {
  label: string;
  value: number;
  tone: "income" | "expense";
  bold?: boolean;
  indent?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b px-4 py-3 last:border-b-0 ${indent ? "pl-8" : ""}`}
    >
      <span
        className={`truncate text-sm ${bold ? "font-display font-medium text-charcoal-800" : "text-charcoal-500"}`}
      >
        {label}
      </span>
      <Money value={value} tone={tone} className="text-sm" />
    </div>
  );
}
