import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, ChevronDown, Sparkles, User } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  Dot,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { DayThread } from "@/components/DayThread";
import { Delta, Money } from "@/components/Money";
import {
  balances,
  dayTotals,
  formatCompact,
  healthScore,
  healthStatus,
  todayISO,
  trendSeries,
  useBusAnalyst,
} from "@/lib/busanalyst";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BusAnalyst — Daily profit dashboard for small businesses" },
      {
        name: "description",
        content:
          "Record what happened today in plain language and see profit, cash, trends and health for your business — no accounting knowledge needed.",
      },
      { property: "og:title", content: "BusAnalyst — Daily profit dashboard" },
      {
        property: "og:description",
        content: "Turn everyday business notes into profit, cash flow and insight.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { transactions, activeBusiness } = useBusAnalyst();
  const [range, setRange] = useState(7);

  const today = dayTotals(transactions, todayISO());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = dayTotals(transactions, yesterdayDate.toISOString().slice(0, 10));
  const delta =
    yesterday.profit === 0
      ? today.profit > 0
        ? 100
        : 0
      : ((today.profit - yesterday.profit) / Math.abs(yesterday.profit)) * 100;

  const bal = balances(transactions);
  const series = trendSeries(transactions, range);
  const score = healthScore(transactions);
  const status = healthStatus(score);

  return (
    <AppShell>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <Link
          to="/businesses"
          className="flex min-w-0 items-center gap-1 font-display text-lg font-semibold text-blue-900"
        >
          <span className="truncate">{activeBusiness.name}</span>
          <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
        <div className="flex shrink-0 items-center gap-1">
          <button
            aria-label="Notifications"
            className="grid h-11 w-11 place-items-center rounded-full hover:bg-blue-50"
          >
            <Bell className="h-5 w-5 text-charcoal-500" />
          </button>
          <Link
            to="/more"
            aria-label="Profile and settings"
            className="grid h-11 w-11 place-items-center rounded-full hover:bg-blue-50"
          >
            <User className="h-5 w-5 text-charcoal-500" />
          </Link>
        </div>
      </header>

      <div className="mt-3 card-surface px-4 py-3">
        <DayThread />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <section className="card-surface p-4">
          <p className="font-display text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Today's profit
          </p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-2">
            <p
              className={cn(
                "money font-display text-4xl font-semibold",
                today.profit >= 0 ? "text-charcoal-800" : "text-rust-600",
              )}
            >
              <Money value={today.profit} />
            </p>
            <Delta percent={delta} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-3 text-sm">
            <div>
              <p className="text-muted-foreground">Revenue</p>
              <Money value={today.revenue} tone="income" className="text-base" />
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Expenses</p>
              <Money value={today.expenses} tone="expense" className="text-base" />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          {[
            { label: "Cash", value: bal.cash },
            { label: "Bank", value: bal.bank },
            { label: "Receivable", value: bal.receivable },
            { label: "Payable", value: bal.payable },
          ].map((b) => (
            <div key={b.label} className="card-surface p-4">
              <p className="text-xs text-muted-foreground">{b.label}</p>
              <p className="money mt-1 text-lg font-medium text-charcoal-800">
                {formatCompact(b.value)}
              </p>
            </div>
          ))}
        </section>
      </div>

      <Link
        to="/insight"
        className="mt-3 block rounded-xl border border-gold-500 bg-gold-100 p-4 transition-colors hover:bg-gold-100/70"
      >
        <p className="flex items-center gap-2 font-display text-xs font-semibold tracking-wide text-charcoal-800 uppercase">
          <Sparkles className="h-4 w-4 text-gold-500" aria-hidden /> AI insight
        </p>
        <p className="mt-1 text-sm text-charcoal-800">
          Expenses grew faster than revenue this month — mostly transport. Tap for details.
        </p>
      </Link>

      <section className="mt-3 card-surface p-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h2 className="truncate text-base">Revenue trend</h2>
          <div className="flex shrink-0 gap-1">
            {[7, 30, 90].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "min-h-9 rounded-full px-3 text-xs font-medium",
                  range === r ? "bg-blue-50 text-blue-900" : "bg-paper-100 text-charcoal-500",
                )}
              >
                {r}d
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--blue-700)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--blue-700)" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--blue-900)"
                strokeWidth={2}
                fill="url(#rev)"
                dot={(props) => {
                  const isLast = props.index === series.length - 1;
                  return (
                    <Dot
                      key={props.index}
                      cx={props.cx}
                      cy={props.cy}
                      r={isLast ? 5 : 0}
                      fill="var(--gold-500)"
                      stroke="var(--card)"
                      strokeWidth={2}
                    />
                  );
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-3 mb-2 card-surface flex items-center gap-4 p-4">
        <HealthRing score={score} />
        <div className="min-w-0">
          <h2 className="text-base">Business Health</h2>
          <p
            className={cn(
              "mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
              status.tone === "emerald" && "bg-emerald-600/10 text-emerald-600",
              status.tone === "gold" && "bg-gold-100 text-gold-500",
              status.tone === "rust" && "bg-rust-600/10 text-rust-600",
            )}
          >
            ● {status.label}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Based on your last 30 days of margin and recording consistency.
          </p>
        </div>
      </section>
    </AppShell>
  );
}

function HealthRing({ score }: { score: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20 shrink-0" role="img" aria-label={`Health score ${score} of 100`}>
      <circle cx="40" cy="40" r={r} fill="none" stroke="var(--paper-100)" strokeWidth="8" />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="var(--gold-500)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${(score / 100) * c} ${c}`}
        transform="rotate(-90 40 40)"
      />
      <text
        x="40"
        y="46"
        textAnchor="middle"
        className="font-display"
        fontSize="22"
        fontWeight="600"
        fill="var(--charcoal-800)"
      >
        {score}
      </text>
    </svg>
  );
}
