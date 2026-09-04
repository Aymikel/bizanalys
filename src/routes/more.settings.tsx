import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Card, GroupLabel, Row, SectionPage } from "@/components/SectionPage";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/more/settings")({
  head: () => ({
    meta: [
      { title: "Settings — BizAnalyst" },
      { name: "description", content: "Currency, date format, language and theme preferences." },
      { property: "og:title", content: "Settings — BizAnalyst" },
      { property: "og:description", content: "App preferences that shape how BizAnalyst behaves." },
    ],
  }),
  component: SettingsPage,
});

const OPTIONS = {
  Currency: ["₦ NGN", "$ USD", "£ GBP", "€ EUR"],
  "Date format": ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"],
  Language: ["English", "Pidgin", "Hausa", "Yoruba"],
  Theme: ["Light", "Dark", "System"],
} as const;

type Key = keyof typeof OPTIONS;

function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({
    Currency: "₦ NGN",
    "Date format": "DD/MM/YYYY",
    Language: "English",
    Theme: "Light",
  });
  const [open, setOpen] = useState<string | null>(null);
  const { user } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }

  return (
    <SectionPage title="Settings" subtitle="How BizAnalyst looks and counts for you.">
      <div>
        <GroupLabel>Preferences</GroupLabel>
        <Card className="mt-2">
          {(Object.keys(OPTIONS) as Key[]).map((k) => (
            <div key={k}>
              <Row
                title={k}
                onClick={() => setOpen(open === k ? null : k)}
                right={<span className="text-sm text-charcoal-500">{values[k]}</span>}
              />
              {open === k && (
                <div className="flex flex-wrap gap-2 border-b bg-paper-50 px-4 py-3">
                  {OPTIONS[k].map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => {
                        setValues((prev) => ({ ...prev, [k]: o }));
                        setOpen(null);
                        toast.success(`${k} set to ${o}`);
                      }}
                      className={cn(
                        "min-h-9 rounded-full px-4 text-xs font-medium transition-opacity active:opacity-80",
                        values[k] === o ? "bg-blue-900 text-primary-foreground" : "bg-card text-charcoal-500",
                      )}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Card>
      </div>

      {user && (
        <button
          onClick={signOut}
          className="card-surface flex min-h-11 w-full items-center justify-center gap-2 p-3 text-sm font-semibold text-rust-600 transition-opacity active:opacity-70"
        >
          <LogOut className="h-4 w-4" aria-hidden /> Log out
        </button>
      )}
    </SectionPage>
  );
}
