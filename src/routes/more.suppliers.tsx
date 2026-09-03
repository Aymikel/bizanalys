import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Card, Field, PrimaryButton, Row, SectionPage, inputClass } from "@/components/SectionPage";
import { formatMoney } from "@/lib/busanalyst";
import { SUPPLIERS } from "@/lib/more-data";

export const Route = createFileRoute("/more/suppliers")({
  head: () => ({
    meta: [
      { title: "Suppliers — BizAnalyst" },
      { name: "description", content: "Track the people you buy from and what you still owe them." },
      { property: "og:title", content: "Suppliers — BizAnalyst" },
      { property: "og:description", content: "Supplier payables and purchase history." },
    ],
  }),
  component: SuppliersPage,
});

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(SUPPLIERS);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  function add() {
    if (!name.trim()) return;
    setSuppliers((prev) => [
      { id: `${Date.now()}`, name: name.trim(), phone, balance: 0, history: [] },
      ...prev,
    ]);
    setName("");
    setPhone("");
    setOpen(false);
    toast.success("Supplier added");
  }

  return (
    <SectionPage title="Suppliers" subtitle="What you owe, and every purchase you have made.">
      <Card>
        {suppliers.map((s) => (
          <Row
            key={s.id}
            to="/more/supplier/$id"
            params={{ id: s.id }}
            title={s.name}
            meta={s.phone}
            right={
              <span
                className={`money text-sm ${s.balance > 0 ? "text-rust-600" : "text-charcoal-500"}`}
              >
                {formatMoney(s.balance)}
              </span>
            }
          />
        ))}
      </Card>

      {open ? (
        <Card className="space-y-3 p-4">
          <Field label="Supplier name">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Phone">
            <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
          <PrimaryButton onClick={add}>Save supplier</PrimaryButton>
        </Card>
      ) : (
        <PrimaryButton onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden /> Add supplier
        </PrimaryButton>
      )}
    </SectionPage>
  );
}
