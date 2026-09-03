import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  Field,
  GroupLabel,
  PrimaryButton,
  SectionPage,
  Toggle,
  inputClass,
} from "@/components/SectionPage";
import { PAYMENT_METHODS } from "@/lib/busanalyst";

export const Route = createFileRoute("/more/payment-methods")({
  head: () => ({
    meta: [
      { title: "Payment methods — BizAnalyst" },
      { name: "description", content: "Cash, bank transfer, POS or mobile money — group your money where it lives." },
      { property: "og:title", content: "Payment methods — BizAnalyst" },
      { property: "og:description", content: "Enable the accounts you actually use." },
    ],
  }),
  component: PaymentMethodsPage,
});

function PaymentMethodsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    Cash: true,
    Bank: true,
    POS: true,
    Transfer: false,
  });
  const [accounts, setAccounts] = useState<{ id: string; bank: string; number: string }[]>([
    { id: "1", bank: "First Bank", number: "•••• 4412" },
  ]);
  const [open, setOpen] = useState(false);
  const [bank, setBank] = useState("");
  const [number, setNumber] = useState("");

  return (
    <SectionPage title="Payment methods" subtitle="Turn on the ways money reaches your business.">
      <div>
        <GroupLabel>Methods</GroupLabel>
        <Card className="mt-2">
          {PAYMENT_METHODS.map((m) => (
            <Toggle
              key={m}
              label={m}
              checked={!!enabled[m]}
              onChange={(v) => setEnabled((prev) => ({ ...prev, [m]: v }))}
            />
          ))}
        </Card>
      </div>

      <div>
        <GroupLabel>Bank accounts</GroupLabel>
        <Card className="mt-2">
          {accounts.map((a) => (
            <div key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b px-4 py-3 last:border-0">
              <span className="text-sm font-medium text-charcoal-800">{a.bank}</span>
              <span className="money text-sm text-charcoal-500">{a.number}</span>
            </div>
          ))}
        </Card>
      </div>

      {open ? (
        <Card className="space-y-3 p-4">
          <Field label="Bank name">
            <input className={inputClass} value={bank} onChange={(e) => setBank(e.target.value)} />
          </Field>
          <Field label="Account number">
            <input
              inputMode="numeric"
              className={inputClass}
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </Field>
          <PrimaryButton
            onClick={() => {
              if (!bank.trim()) return;
              setAccounts((prev) => [
                ...prev,
                { id: `${Date.now()}`, bank: bank.trim(), number: `•••• ${number.slice(-4)}` },
              ]);
              setBank("");
              setNumber("");
              setOpen(false);
              toast.success("Bank account added");
            }}
          >
            Save account
          </PrimaryButton>
        </Card>
      ) : (
        <PrimaryButton onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden /> Add bank account
        </PrimaryButton>
      )}
    </SectionPage>
  );
}
