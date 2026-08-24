import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Building2,
  Users,
  Truck,
  Boxes,
  Settings,
  LifeBuoy,
  LogOut,
  CreditCard,
  Tags,
  Bell,
  Download,
  ChevronRight,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useBizAnalyst } from "@/lib/busanalyst";
import { useSession, displayName } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { MORE_SECTIONS } from "@/lib/more-sections";


export const Route = createFileRoute("/more/")({
  head: () => ({
    meta: [
      { title: "More & Settings — BizAnalyst" },
      {
        name: "description",
        content:
          "Manage businesses, customers, suppliers, inventory, roles, categories and app settings.",
      },
      { property: "og:title", content: "More & Settings — BizAnalyst" },
      { property: "og:description", content: "Everything else about running your business." },
    ],
  }),
  component: MorePage,
});

const ICONS = {
  Users,
  Truck,
  Boxes,
  Building2,
  CreditCard,
  Tags,
  Bell,
  Download,
  Settings,
  LifeBuoy,
} as const;

const GROUPS = (["Business", "Setup", "Account"] as const).map((title) => ({
  title,
  items: MORE_SECTIONS.filter((s) => s.group === title),
}));



function MorePage() {
  const { activeBusiness } = useBizAnalyst();
  const { user, loading } = useSession();
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
    <AppShell>
      <h1 className="text-2xl">More</h1>

      {!loading &&
        (user ? (
          <Link
            to="/profile"
            className="mt-3 card-surface grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 p-4"
          >
            <span className="min-w-0">
              <span className="block text-xs text-muted-foreground">Signed in as</span>
              <span className="block truncate font-display font-semibold text-blue-900">
                {displayName(user)}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                View & edit profile
              </span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-blue-900" aria-hidden />
          </Link>
        ) : (
          <Link
            to="/auth"
            className="mt-3 card-surface grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 p-4"
          >
            <span className="min-w-0">
              <span className="block text-xs text-muted-foreground">Account</span>
              <span className="block font-display font-semibold text-blue-900">
                Sign in or create an account
              </span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-blue-900" aria-hidden />
          </Link>
        ))}

      <Link
        to="/businesses"
        className="mt-3 card-surface grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 p-4"
      >
        <span className="min-w-0">
          <span className="block text-xs text-muted-foreground">Active business</span>
          <span className="block truncate font-display font-semibold text-blue-900">
            {activeBusiness.name}
          </span>
          <span className="block text-xs text-muted-foreground">{activeBusiness.type}</span>
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-blue-900" aria-hidden />
      </Link>


      <div className="mt-4 space-y-5">
        {GROUPS.map((g) => (
          <section key={g.title}>
            <h2 className="text-sm tracking-wide text-muted-foreground uppercase">{g.title}</h2>
            <div className="mt-2 card-surface overflow-hidden">
              {g.items.map((item) => {
                const Icon = ICONS[item.icon];
                return (
                  <Link
                    key={item.slug}
                    to="/more/$section"
                    params={{ section: item.slug }}
                    className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b px-4 py-3 text-left last:border-0 hover:bg-blue-50"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-blue-900" aria-hidden />
                    <span className="truncate text-sm text-charcoal-800">{item.label}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-charcoal-500" aria-hidden />
                  </Link>
                );
              })}

            </div>
          </section>
        ))}
      </div>

      {user && (
        <button
          onClick={signOut}
          className="card-surface mt-5 flex min-h-11 w-full items-center justify-center gap-2 p-3 text-sm font-semibold text-rust-500"
        >
          <LogOut className="h-4 w-4" aria-hidden /> Log out
        </button>
      )}
    </AppShell>

  );
}
