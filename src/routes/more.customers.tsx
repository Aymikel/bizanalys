import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Card, Field, PrimaryButton, Row, SectionPage, inputClass } from "@/components/SectionPage";
import { formatMoney } from "@/lib/busanalyst";
import { CUSTOMERS } from "@/lib/more-data";

export const Route = createFileRoute("/more/customers")({
  head: () => ({
    meta: [
      { title: "Customers — BizAnalyst" },
      { name: "description", content: "Track who buys from you and who still owes you money." },
      { property: "og:title", content: "Customers — BizAnalyst" },
      { property: "og:description", content: "Customer balances and payment history." },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const [customers, setCustomers] = useState(CUSTOMERS);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  function add() {
    if (!name.trim()) return;
    setCustomers((prev) => [
      { id: `${Date.now()}`, name: name.trim(), phone, balance: 0, history: [] },
      ...prev,
    ]);
    setName("");
    setPhone("");
    setOpen(false);
    toast.success("Customer added");
  }

  return (
    <SectionPage title="Customers" subtitle="Balances and payment history for everyone who buys from you.">
      <Card>
        {customers.map((c) => (
          <Row
            key={c.id}
            to="/more/customer/$id"
            params={{ id: c.id }}
            title={c.name}
            meta={c.phone}
            right={
              <span
                className={`money text-sm ${c.balance > 0 ? "text-rust-600" : "text-charcoal-500"}`}
              >
                {formatMoney(c.balance)}
              </span>
            }
          />
        ))}
      </Card>

      {open ? (
        <Card className="space-y-3 p-4">
          <Field label="Customer name">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Phone">
            <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
          <PrimaryButton onClick={add}>Save customer</PrimaryButton>
        </Card>
      ) : (
        <PrimaryButton onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden /> Add customer
        </PrimaryButton>
      )}
    </SectionPage>
  );
}
