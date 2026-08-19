import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Store } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Money } from "@/components/Money";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BUSINESS_TYPES, dayTotals, isIncome, todayISO, useBusAnalyst } from "@/lib/busanalyst";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/businesses")({
  head: () => ({
    meta: [
      { title: "Switch business — BusAnalyst" },
      {
        name: "description",
        content: "Move between the businesses you run and see today's profit for each one.",
      },
      { property: "og:title", content: "Switch business — BusAnalyst" },
      { property: "og:description", content: "One app, every business you run." },
    ],
  }),
  component: BusinessSwitcher,
});

function BusinessSwitcher() {
  const { businesses, activeBusinessId, setActiveBusiness, allTransactions, addBusiness } =
    useBusAnalyst();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState(BUSINESS_TYPES[0]!);

  return (
    <AppShell>
      <h1 className="text-2xl">Your businesses</h1>

      <div className="mt-3 space-y-3">
        {businesses.map((b) => {
          const txs = allTransactions.filter((t) => t.businessId === b.id);
          const profit = dayTotals(txs, todayISO()).profit;
          const count = txs.filter((t) => t.date === todayISO() && isIncome(t.kind)).length;
          return (
            <button
              key={b.id}
              onClick={() => {
                setActiveBusiness(b.id);
                navigate({ to: "/" });
              }}
              className={cn(
                "card-surface grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4 text-left",
                b.id === activeBusinessId && "border-2 border-gold-500",
              )}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50">
                <Store className="h-5 w-5 text-blue-900" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display font-medium text-charcoal-800">
                  {b.name}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {b.type} · {count} sales today
                </span>
              </span>
              <Money
                value={profit}
                tone={profit >= 0 ? "income" : "expense"}
                className="text-sm"
              />
            </button>
          );
        })}

        {adding ? (
          <div className="card-surface space-y-3 p-4">
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Business name"
              className="min-h-11"
            />
            <div className="flex flex-wrap gap-2">
              {BUSINESS_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "min-h-9 rounded-full border px-3 text-xs font-medium",
                    type === t
                      ? "border-blue-900 bg-blue-50 text-blue-900"
                      : "border-transparent bg-paper-100 text-charcoal-500",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <Button
              className="min-h-11 w-full"
              onClick={() => {
                if (!name.trim()) return;
                addBusiness(name.trim(), type);
                setName("");
                setAdding(false);
                navigate({ to: "/" });
              }}
            >
              Add Business
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="grid min-h-16 w-full place-items-center rounded-xl border border-dashed border-blue-900 text-sm font-medium text-blue-900"
          >
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" aria-hidden /> Add another business
            </span>
          </button>
        )}
      </div>
    </AppShell>
  );
}
