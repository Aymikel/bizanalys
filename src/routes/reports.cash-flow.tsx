import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { AppShell } from "@/components/AppShell";
import { Money } from "@/components/Money";
import { RangePicker, ReportBottomBar } from "@/components/ReportChrome";
import {
  formatCompact,
  isIncome,
  PAYMENT_METHODS,
  trendSeries,
  useBusAnalyst,
} from "@/lib/busanalyst";

export const Route = createFileRoute("/reports/cash-flow")({
  head: () => ({
    meta: [
      { title: "Cash Flow report — BusAnalyst" },
      {
        name: "description",
        content: "Track money in and money out by day and by payment method — cash, bank, POS, transfer.",
      },
      { property: "og:title", content: "Cash Flow report — BusAnalyst" },
      { property: "og:description", content: "Where your money came in and where it went out." },
    ],
  }),
  component: CashFlow,
});

function CashFlow() {
  const { transactions } = useBusAnalyst();
  const [range, setRange] = useState(30);
  const series = trendSeries(transactions, range);
  const dates = new Set(series.map((d) => d.date));
  const rows = transactions.filter((t) => dates.has(t.date));

  const inflow = rows.filter((t) => isIncome(t.kind)).reduce((s, t) => s + t.amount, 0);
  const outflow = rows.filter((t) => !isIncome(t.kind)).reduce((s, t) => s + t.amount, 0);

  return (
    <AppShell>
      <h1 className="text-2xl">Cash Flow</h1>
      <RangePicker range={range} onChange={setRange} />

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="card-surface p-4">
          <p className="text-xs text-muted-foreground">Money in</p>
          <Money value={inflow} tone="income" className="mt-1 text-lg" />
        </div>
        <div className="card-surface p-4">
          <p className="text-xs text-muted-foreground">Money out</p>
          <Money value={outflow} tone="expense" className="mt-1 text-lg" />
        </div>
      </div>

      <section className="mt-3 card-surface p-4">
        <h2 className="text-base">Daily flow</h2>
        <div className="mt-3 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--paper-100)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                tick={{ fontSize: 11, fill: "var(--charcoal-500)" }}
              />
              <Tooltip
                formatter={(v: number) => formatCompact(v)}
                contentStyle={{ borderRadius: 12, border: "1px solid var(--paper-100)" }}
              />
              <Bar dataKey="revenue" fill="var(--emerald-600)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="var(--rust-600)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-3 card-surface overflow-hidden">
        <header className="border-b bg-paper-100 px-4 py-2 text-xs tracking-wide text-muted-foreground uppercase">
          By payment method
        </header>
        {PAYMENT_METHODS.map((m) => {
          const set = rows.filter((t) => t.method === m);
          const net = set.reduce((s, t) => s + (isIncome(t.kind) ? t.amount : -t.amount), 0);
          return (
            <div
              key={m}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b px-4 py-3 last:border-0"
            >
              <span className="truncate text-sm text-charcoal-500">{m}</span>
              <Money
                value={net}
                signed
                tone={net >= 0 ? "income" : "expense"}
                className="text-sm"
              />
            </div>
          );
        })}
      </section>

      <ReportBottomBar />
    </AppShell>
  );
}
