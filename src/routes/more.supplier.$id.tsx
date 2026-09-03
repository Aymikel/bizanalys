import { createFileRoute, notFound } from "@tanstack/react-router";
import { Card, Row, SectionPage } from "@/components/SectionPage";
import { formatMoney } from "@/lib/busanalyst";
import { SUPPLIERS } from "@/lib/more-data";

export const Route = createFileRoute("/more/supplier/$id")({
  loader: ({ params }) => {
    const supplier = SUPPLIERS.find((s) => s.id === params.id);
    if (!supplier) throw notFound();
    return { supplier };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.supplier.name} — BizAnalyst` },
            { name: "description", content: "Supplier purchase and payment history." },
            { property: "og:title", content: `${loaderData.supplier.name} — BizAnalyst` },
            { property: "og:description", content: "Supplier purchase and payment history." },
          ],
        }
      : { meta: [{ title: "Not found — BizAnalyst" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => (
    <SectionPage title="Supplier not found" backTo="/more/suppliers" backLabel="Suppliers">
      <p className="text-sm text-muted-foreground">That supplier no longer exists.</p>
    </SectionPage>
  ),
  component: SupplierDetail,
});

function SupplierDetail() {
  const { supplier } = Route.useLoaderData();
  return (
    <SectionPage title={supplier.name} subtitle={supplier.phone} backTo="/more/suppliers" backLabel="Suppliers">
      <Card className="p-4">
        <p className="text-xs text-muted-foreground">Outstanding payable</p>
        <p
          className={`money text-2xl ${supplier.balance > 0 ? "text-rust-600" : "text-charcoal-800"}`}
        >
          {formatMoney(supplier.balance)}
        </p>
      </Card>

      <Card>
        {supplier.history.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">No purchases yet.</p>
        ) : (
          supplier.history.map((h) => (
            <Row
              key={`${h.date}-${h.label}`}
              title={h.label}
              meta={h.date}
              right={
                <span
                  className={`money text-sm ${h.amount < 0 ? "text-emerald-600" : "text-charcoal-800"}`}
                >
                  {formatMoney(h.amount)}
                </span>
              }
            />
          ))
        )}
      </Card>
    </SectionPage>
  );
}
