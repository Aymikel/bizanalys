import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Trash2, Pencil, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Money } from "@/components/Money";
import { Input } from "@/components/ui/input";
import {
  formatDayLabel,
  isIncome,
  PAYMENT_METHODS,
  useBizAnalyst,
  type Transaction,
} from "@/lib/busanalyst";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — BizAnalyst" },
      {
        name: "description",
        content:
          "Every sale, purchase, income and expense grouped by day with running daily totals.",
      },
      { property: "og:title", content: "Transactions — BizAnalyst" },
      { property: "og:description", content: "Your daily money in and money out, at a glance." },
    ],
  }),
  component: TransactionsPage,
});

function TransactionsPage() {
  const { transactions, deleteTransaction, updateTransaction, setEntrySheetOpen } =
    useBizAnalyst();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | "in" | "out">("all");
  const [method, setMethod] = useState<string>("all");
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null);

  const groups = useMemo(() => {
    const filtered = transactions
      .filter((t) => (type === "all" ? true : type === "in" ? isIncome(t.kind) : !isIncome(t.kind)))
      .filter((t) => (method === "all" ? true : t.method === method))
      .filter((t) =>
        query
          ? (t.description + t.category).toLowerCase().includes(query.toLowerCase())
          : true,
      )
      .sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : a.date < b.date ? 1 : -1));

    const map = new Map<string, Transaction[]>();
    for (const t of filtered) {
      const list = map.get(t.date) ?? [];
      list.push(t);
      map.set(t.date, list);
    }
    return [...map.entries()];
  }, [transactions, query, type, method]);

  return (
    <AppShell>
      <h1 className="text-2xl">Transactions</h1>

      <div className="sticky top-0 z-30 -mx-4 mt-2 bg-background px-4 pt-2 pb-3">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search description or category"
            className="min-h-11 rounded-xl bg-card pl-9"
            aria-label="Search transactions"
          />
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {[
            { k: "all", l: "All" },
            { k: "in", l: "Money in" },
            { k: "out", l: "Money out" },
          ].map((f) => (
            <FilterChip
              key={f.k}
              active={type === f.k}
              onClick={() => setType(f.k as typeof type)}
              label={f.l}
            />
          ))}
          <span className="w-px shrink-0 bg-border" />
          <FilterChip
            active={method === "all"}
            onClick={() => setMethod("all")}
            label="Any method"
          />
          {PAYMENT_METHODS.map((m) => (
            <FilterChip key={m} active={method === m} onClick={() => setMethod(m)} label={m} />
          ))}
        </div>
      </div>

      {groups.length === 0 && (
        <div className="card-surface p-8 text-center">
          <p className="text-charcoal-800">No transactions yet today</p>
          <p className="mt-1 text-sm text-muted-foreground">Tap + to record your first one</p>
          <button
            onClick={() => setEntrySheetOpen(true)}
            className="mt-4 min-h-11 rounded-xl bg-blue-900 px-4 text-sm font-medium text-primary-foreground"
          >
            Record Transaction
          </button>
        </div>
      )}

      <div className="space-y-4">
        {groups.map(([date, rows]) => {
          const total = rows.reduce((s, t) => s + (isIncome(t.kind) ? t.amount : -t.amount), 0);
          return (
            <section key={date} className="card-surface overflow-hidden">
              <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b bg-paper-100 px-4 py-2">
                <h2 className="truncate font-display text-sm">{formatDayLabel(date)}</h2>
                <Money
                  value={total}
                  signed
                  tone={total >= 0 ? "income" : "expense"}
                  className="text-sm"
                />
              </header>
              <ul>
                {rows.map((t) => (
                  <li
                    key={t.id}
                    id={t.id}
                    className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b px-4 py-3 last:border-0 target:bg-gold-100"
                  >
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-full",
                        isIncome(t.kind) ? "bg-emerald-600/10" : "bg-rust-600/10",
                      )}
                    >
                      {isIncome(t.kind) ? (
                        <ArrowDownLeft className="h-4 w-4 text-emerald-600" aria-hidden />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-rust-600" aria-hidden />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm text-charcoal-800">{t.description}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full bg-paper-100 px-2 py-0.5">{t.category}</span>
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-900">
                          {t.method}
                        </span>
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Money
                        value={t.amount}
                        signed
                        tone={isIncome(t.kind) ? "income" : "expense"}
                        className="text-sm"
                      />
                      <button
                        aria-label="Edit transaction"
                        onClick={() => {
                          const next = window.prompt("Edit description", t.description);
                          if (next !== null) {
                            updateTransaction(t.id, { description: next });
                            toast.success("Transaction updated");
                          }
                        }}
                        className="grid h-11 w-9 place-items-center text-charcoal-500 hover:text-blue-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        aria-label="Delete transaction"
                        onClick={() => setPendingDelete(t)}
                        className="grid h-11 w-9 place-items-center text-charcoal-500 hover:text-rust-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.description} will be removed from your records. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rust-600 text-destructive-foreground hover:bg-rust-600/90"
              onClick={() => {
                if (pendingDelete) deleteTransaction(pendingDelete.id);
                setPendingDelete(null);
                toast.success("Transaction deleted");
              }}
            >
              Delete Transaction
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "min-h-9 shrink-0 rounded-full border px-3 text-xs font-medium",
        active
          ? "border-blue-900 bg-blue-50 text-blue-900"
          : "border-transparent bg-paper-100 text-charcoal-500",
      )}
    >
      {label}
    </button>
  );
}
