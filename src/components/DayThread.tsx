import { useNavigate } from "@tanstack/react-router";
import { isIncome, todayISO, useBizAnalyst, formatMoney } from "@/lib/busanalyst";
import { cn } from "@/lib/utils";

export function DayThread() {
  const { transactions } = useBizAnalyst();
  const navigate = useNavigate();
  const today = transactions.filter((t) => t.date === todayISO());
  const placeholders = Math.max(0, 7 - today.length);

  return (
    <div className="flex items-center gap-2" aria-label="Today's day thread">
      <div className="relative flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-1">
        <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-border" />
        {today.map((t) => (
          <button
            key={t.id}
            onClick={() => navigate({ to: "/transactions", hash: t.id })}
            title={`${t.description} · ${formatMoney(t.amount)}`}
            aria-label={`${isIncome(t.kind) ? "Income" : "Expense"} ${formatMoney(t.amount)} — ${t.description}`}
            className={cn(
              "bead-appear relative z-10 h-3.5 w-3.5 shrink-0 rounded-full ring-2 ring-card",
              isIncome(t.kind) ? "bg-emerald-600" : "bg-rust-600",
            )}
          />
        ))}
        {Array.from({ length: placeholders }).map((_, i) => (
          <span
            key={i}
            className="relative z-10 h-3.5 w-3.5 shrink-0 rounded-full border border-border bg-background"
          />
        ))}
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">{today.length} today</span>
    </div>
  );
}
