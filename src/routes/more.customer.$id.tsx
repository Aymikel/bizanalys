import { createFileRoute, notFound } from "@tanstack/react-router";
import { Card, Row, SectionPage } from "@/components/SectionPage";
import { formatMoney } from "@/lib/busanalyst";
import { CUSTOMERS } from "@/lib/more-data";

export const Route = createFileRoute("/more/customer/$id")({
  loader: ({ params }) => {
    const customer = CUSTOMERS.find((c) => c.id === params.id);
    if (!customer) throw notFound();
    return { customer };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.customer.name} — BizAnalyst` },
            { name: "description", content: "Customer transaction and payment history." },
            { property: "og:title", content: `${loaderData.customer.name} — BizAnalyst` },
            { property: "og:description", content: "Customer transaction and payment history." },
          ],
        }
      : { meta: [{ title: "Not found — BizAnalyst" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => (
    <SectionPage title="Customer not found" backTo="/more/customers" backLabel="Customers">
      <p className="text-sm text-muted-foreground">That customer no longer exists.</p>
    </SectionPage>
  ),
  component: CustomerDetail,
});

function CustomerDetail() {
  const { customer } = Route.useLoaderData();
  return (
    <SectionPage title={customer.name} subtitle={customer.phone} backTo="/more/customers" backLabel="Customers">
      <Card className="p-4">
        <p className="text-xs text-muted-foreground">Outstanding balance</p>
        <p
          className={`money text-2xl ${customer.balance > 0 ? "text-rust-600" : "text-charcoal-800"}`}
        >
          {formatMoney(customer.balance)}
        </p>
      </Card>

      <Card>
        {customer.history.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">No transactions yet.</p>
        ) : (
          customer.history.map((h) => (
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
