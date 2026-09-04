import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, SectionPage, Toggle } from "@/components/SectionPage";

export const Route = createFileRoute("/more/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — BizAnalyst" },
      { name: "description", content: "Gentle nudges so you never forget to record a day." },
      { property: "og:title", content: "Notifications — BizAnalyst" },
      { property: "og:description", content: "Choose which alerts BizAnalyst sends you." },
    ],
  }),
  component: NotificationsPage,
});

const ITEMS = [
  { key: "lowStock", label: "Low stock alerts", description: "When an item falls below its reorder level" },
  { key: "paymentReceived", label: "Payment received", description: "When a customer settles a balance" },
  { key: "paymentOverdue", label: "Payment overdue", description: "When money owed passes its due date" },
  { key: "dailySummary", label: "Daily summary", description: "One evening recap of the day's money" },
  { key: "aiInsights", label: "AI insights", description: "Weekly plain-language analysis of your numbers" },
];

function NotificationsPage() {
  const [on, setOn] = useState<Record<string, boolean>>({
    lowStock: true,
    paymentReceived: true,
    paymentOverdue: true,
    dailySummary: false,
    aiInsights: true,
  });

  return (
    <SectionPage title="Notifications" subtitle="Turn each alert on or off.">
      <Card>
        {ITEMS.map((i) => (
          <Toggle
            key={i.key}
            label={i.label}
            description={i.description}
            checked={!!on[i.key]}
            onChange={(v) => setOn((prev) => ({ ...prev, [i.key]: v }))}
          />
        ))}
      </Card>
    </SectionPage>
  );
}
