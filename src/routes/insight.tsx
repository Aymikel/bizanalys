import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Send, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { AppShell } from "@/components/AppShell";
import { Money } from "@/components/Money";
import { Input } from "@/components/ui/input";
import { formatCompact, isIncome, trendSeries, useBusAnalyst } from "@/lib/busanalyst";

export const Route = createFileRoute("/insight")({
  head: () => ({
    meta: [
      { title: "AI insight — BusAnalyst" },
      {
        name: "description",
        content:
          "A plain-language explanation of what changed in your business this month, with one clear recommendation.",
      },
      { property: "og:title", content: "AI insight — BusAnalyst" },
      { property: "og:description", content: "Your numbers, explained like a person would." },
    ],
  }),
  component: InsightDetail,
});

function InsightDetail() {
  const { transactions } = useBusAnalyst();
  const [question, setQuestion] = useState("");
  const [thread, setThread] = useState<Array<{ q: string; a: string }>>([]);

  const series = trendSeries(transactions, 30);
  const dates = new Set(series.map((d) => d.date));
  const rows = transactions.filter((t) => dates.has(t.date) && !isIncome(t.kind));
  const byCategory = new Map<string, number>();
  for (const t of rows) byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + t.amount);
  const top = [...byCategory.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const chartData = top.map(([category, amount]) => ({ category, amount }));

  return (
    <AppShell>
      <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-blue-900">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to dashboard
      </Link>

      <h1 className="mt-1 flex items-center gap-2 text-2xl">
        <Sparkles className="h-5 w-5 text-gold-500" aria-hidden /> Expenses are outpacing revenue
      </h1>

      <p className="mt-3 text-[15px] leading-relaxed text-charcoal-800">
        Over the last 30 days your expenses grew faster than your sales. Most of the increase came
        from transport and restocking runs — you paid for several small pickups instead of fewer
        larger ones. Sales themselves are steady, so this is a cost problem, not a demand problem.
      </p>

      <section className="mt-4 card-surface p-4">
        <h2 className="text-base">Where the money went</h2>
        <div className="mt-3 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--paper-100)" />
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--charcoal-500)" }}
              />
              <Tooltip
                formatter={(v: number) => formatCompact(v)}
                contentStyle={{ borderRadius: 12, border: "1px solid var(--paper-100)" }}
              />
              <Bar dataKey="amount" fill="var(--rust-600)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <ul className="mt-3 divide-y">
          {top.map(([cat, amount]) => (
            <li key={cat} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 py-2">
              <span className="truncate text-sm text-charcoal-500">{cat}</span>
              <Money value={amount} tone="expense" className="text-sm" />
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-4 rounded-xl border-2 border-gold-500 bg-gold-100 p-4">
        <p className="font-display text-sm font-semibold text-charcoal-800">Recommendation</p>
        <p className="mt-1 text-sm text-charcoal-800">
          Consolidate restocking into two trips a week. At your current transport spend that would
          keep roughly ₦40,000 a month in the business without touching your sales.
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {thread.map((m, i) => (
          <div key={i} className="card-surface p-4">
            <p className="text-sm font-medium text-blue-900">{m.q}</p>
            <p className="mt-1 text-sm text-charcoal-800">{m.a}</p>
          </div>
        ))}
      </div>

      <form
        className="mt-4 mb-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!question.trim()) return;
          setThread((t) => [
            ...t,
            {
              q: question.trim(),
              a: "Once your data is connected to live analysis, answers will appear here based on your own transactions.",
            },
          ]);
          setQuestion("");
        }}
      >
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a follow-up…"
          aria-label="Ask a follow-up question"
          className="min-h-12 rounded-xl bg-card"
        />
        <button
          type="submit"
          aria-label="Send question"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-900 text-primary-foreground"
        >
          <Send className="h-5 w-5" aria-hidden />
        </button>
      </form>
    </AppShell>
  );
}
