import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CATEGORIES_BY_TYPE,
  PAYMENT_METHODS,
  todayISO,
  useBizAnalyst,
  type PaymentMethod,
  type TxKind,
} from "@/lib/busanalyst";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Delete } from "lucide-react";

const KINDS: Array<{ key: TxKind; label: string }> = [
  { key: "income", label: "+ Income" },
  { key: "expense", label: "− Expense" },
  { key: "sale", label: "Sale" },
  { key: "purchase", label: "Purchase" },
];

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "min-h-11 rounded-full border px-4 text-sm font-medium transition-colors",
        active
          ? "border-blue-900 bg-blue-50 text-blue-900"
          : "border-transparent bg-paper-100 text-charcoal-500 hover:bg-blue-50",
      )}
    >
      {children}
    </button>
  );
}

export function QuickEntrySheet() {
  const { entrySheetOpen, setEntrySheetOpen, addTransaction, activeBusiness } = useBizAnalyst();
  const [kind, setKind] = useState<TxKind>("sale");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("Cash");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayISO());
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(
    () => CATEGORIES_BY_TYPE[activeBusiness.type] ?? CATEGORIES_BY_TYPE["Other"]!,
    [activeBusiness.type],
  );

  function press(key: string) {
    setError(null);
    if (key === "del") return setAmount((a) => a.slice(0, -1));
    if (key === "." && amount.includes(".")) return;
    setAmount((a) => (a + key).replace(/^0(?=\d)/, "").slice(0, 12));
  }

  function reset() {
    setAmount("");
    setDescription("");
    setCategory("");
    setDate(todayISO());
    setError(null);
  }

  function save() {
    const value = Number(amount);
    if (!value) {
      setError("Amount can't be zero — enter how much was received or paid.");
      return;
    }
    addTransaction({
      kind,
      amount: value,
      method,
      category: category || categories[0]!,
      description: description || KINDS.find((k) => k.key === kind)!.label.replace(/[+−] /, ""),
      date,
    });
    toast.success("Transaction saved", { description: `₦${value.toLocaleString()} · ${method}` });
    reset();
    setEntrySheetOpen(false);
  }

  return (
    <Sheet open={entrySheetOpen} onOpenChange={setEntrySheetOpen}>
      <SheetContent
        side="bottom"
        className="max-h-[92vh] overflow-y-auto rounded-t-3xl px-4 pb-6 sm:mx-auto sm:max-w-xl"
      >
        <SheetHeader className="px-0">
          <SheetTitle className="font-display">Record transaction</SheetTitle>
        </SheetHeader>

        <div className="grid grid-cols-4 gap-2">
          {KINDS.map((k) => (
            <Chip key={k.key} active={kind === k.key} onClick={() => setKind(k.key)}>
              {k.label}
            </Chip>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-paper-100 p-4 text-right">
          <p className="text-xs text-muted-foreground">Amount</p>
          <p className="money text-4xl font-medium text-charcoal-800">
            ₦{amount ? Number(amount).toLocaleString() : "0"}
          </p>
        </div>
        {error && (
          <p role="alert" className="mt-2 text-sm text-rust-600">
            {error}
          </p>
        )}

        <div className="mt-3 grid grid-cols-3 gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "000", "0", "del"].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => press(k)}
              className="money min-h-12 rounded-xl bg-card text-lg font-medium text-charcoal-800 ring-1 ring-border transition-colors hover:bg-blue-50"
              aria-label={k === "del" ? "Delete last digit" : k}
            >
              {k === "del" ? <Delete className="mx-auto h-5 w-5" aria-hidden /> : k}
            </button>
          ))}
        </div>

        <p className="mt-5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Payment method
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((m) => (
            <Chip key={m} active={method === m} onClick={() => setMethod(m)}>
              {m}
            </Chip>
          ))}
        </div>

        <p className="mt-5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Category
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </Chip>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-muted-foreground">Description</span>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Sold 3 cartons of milk"
              className="mt-1 rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">Date</span>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="money mt-1 rounded-none border-0 border-b bg-transparent px-0 text-left shadow-none focus-visible:ring-0"
            />
          </label>
        </div>

        <Button onClick={save} className="mt-6 min-h-12 w-full font-display text-base">
          Save Transaction
        </Button>
      </SheetContent>
    </Sheet>
  );
}
