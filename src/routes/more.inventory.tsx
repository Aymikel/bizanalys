import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  Chip,
  Field,
  PrimaryButton,
  Row,
  SectionPage,
  inputClass,
} from "@/components/SectionPage";
import { formatMoney } from "@/lib/busanalyst";
import { INVENTORY } from "@/lib/more-data";

export const Route = createFileRoute("/more/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — BizAnalyst" },
      { name: "description", content: "Know what is on the shelf, what is moving and what is running out." },
      { property: "og:title", content: "Inventory — BizAnalyst" },
      { property: "og:description", content: "Stock levels, unit cost and stock value." },
    ],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  const [items, setItems] = useState(INVENTORY);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [cost, setCost] = useState("");

  function add() {
    if (!name.trim()) return;
    setItems((prev) => [
      {
        id: `${Date.now()}`,
        name: name.trim(),
        qty: Number(qty) || 0,
        unitCost: Number(cost) || 0,
        lowAt: 5,
      },
      ...prev,
    ]);
    setName("");
    setQty("");
    setCost("");
    setOpen(false);
    toast.success("Item added");
  }

  const total = items.reduce((sum, i) => sum + i.qty * i.unitCost, 0);

  return (
    <SectionPage title="Inventory" subtitle="Stock on hand, unit cost and total stock value.">
      <Card className="p-4">
        <p className="text-xs text-muted-foreground">Total stock value</p>
        <p className="money text-2xl text-charcoal-800">{formatMoney(total)}</p>
      </Card>

      <Card>
        {items.map((i) => (
          <Row
            key={i.id}
            title={
              <span className="flex items-center gap-2">
                {i.name}
                {i.qty <= i.lowAt && <Chip tone="rust">Low stock</Chip>}
              </span>
            }
            meta={`${i.qty} in stock · ${formatMoney(i.unitCost)} each`}
            right={<span className="money text-sm text-charcoal-800">{formatMoney(i.qty * i.unitCost)}</span>}
          />
        ))}
      </Card>

      {open ? (
        <Card className="space-y-3 p-4">
          <Field label="Item name">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Quantity">
              <input
                inputMode="numeric"
                className={inputClass}
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </Field>
            <Field label="Unit cost">
              <input
                inputMode="numeric"
                className={inputClass}
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </Field>
          </div>
          <PrimaryButton onClick={add}>Save item</PrimaryButton>
        </Card>
      ) : (
        <PrimaryButton onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden /> Add item
        </PrimaryButton>
      )}
    </SectionPage>
  );
}
