import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Check, Pencil } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  Field,
  GroupLabel,
  PrimaryButton,
  SectionPage,
  inputClass,
} from "@/components/SectionPage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/more/categories")({
  head: () => ({
    meta: [
      { title: "Categories — BizAnalyst" },
      { name: "description", content: "Name your income and expense buckets so reports read like your business." },
      { property: "og:title", content: "Categories — BizAnalyst" },
      { property: "og:description", content: "Custom income and expense categories." },
    ],
  }),
  component: CategoriesPage,
});

type Cat = { id: string; name: string; kind: "Income" | "Expense" };

const SEED: Cat[] = [
  { id: "1", name: "Sales", kind: "Income" },
  { id: "2", name: "Service fees", kind: "Income" },
  { id: "3", name: "Stock", kind: "Expense" },
  { id: "4", name: "Rent", kind: "Expense" },
  { id: "5", name: "Transport", kind: "Expense" },
  { id: "6", name: "Salaries", kind: "Expense" },
];

function CategoriesPage() {
  const [cats, setCats] = useState(SEED);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<Cat["kind"]>("Expense");

  return (
    <SectionPage title="Categories" subtitle="Rename, delete or add the buckets your reports use.">
      {(["Income", "Expense"] as const).map((group) => (
        <div key={group}>
          <GroupLabel>{group}</GroupLabel>
          <Card className="mt-2">
            {cats
              .filter((c) => c.kind === group)
              .map((c) => (
                <div
                  key={c.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b px-4 py-2 last:border-0"
                >
                  {editing === c.id ? (
                    <input
                      autoFocus
                      className={cn(inputClass, "mt-0")}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                    />
                  ) : (
                    <span className="truncate text-sm font-medium text-charcoal-800">{c.name}</span>
                  )}
                  <span className="flex shrink-0 items-center">
                    <button
                      type="button"
                      aria-label={editing === c.id ? "Save category" : "Edit category"}
                      onClick={() => {
                        if (editing === c.id) {
                          setCats((prev) =>
                            prev.map((x) => (x.id === c.id ? { ...x, name: draft || x.name } : x)),
                          );
                          setEditing(null);
                        } else {
                          setDraft(c.name);
                          setEditing(c.id);
                        }
                      }}
                      className="grid h-11 w-11 place-items-center rounded-lg text-blue-900 transition-colors hover:bg-blue-50 active:opacity-70"
                    >
                      {editing === c.id ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      aria-label="Delete category"
                      onClick={() => {
                        setCats((prev) => prev.filter((x) => x.id !== c.id));
                        toast.success("Category deleted");
                      }}
                      className="grid h-11 w-11 place-items-center rounded-lg text-rust-600 transition-colors hover:bg-blue-50 active:opacity-70"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </span>
                </div>
              ))}
          </Card>
        </div>
      ))}

      {open ? (
        <Card className="space-y-3 p-4">
          <Field label="Category name">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <div className="flex gap-2">
            {(["Income", "Expense"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={cn(
                  "min-h-9 rounded-full px-4 text-xs font-medium transition-opacity active:opacity-80",
                  kind === k ? "bg-blue-900 text-primary-foreground" : "bg-paper-100 text-charcoal-500",
                )}
              >
                {k}
              </button>
            ))}
          </div>
          <PrimaryButton
            onClick={() => {
              if (!name.trim()) return;
              setCats((prev) => [...prev, { id: `${Date.now()}`, name: name.trim(), kind }]);
              setName("");
              setOpen(false);
              toast.success("Category added");
            }}
          >
            Save category
          </PrimaryButton>
        </Card>
      ) : (
        <PrimaryButton onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden /> Add category
        </PrimaryButton>
      )}
    </SectionPage>
  );
}
