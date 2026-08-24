import { Link, useRouterState } from "@tanstack/react-router";
import { Plus, LayoutDashboard, Receipt, BarChart3, MoreHorizontal } from "lucide-react";
import type { ReactNode } from "react";
import { useBizAnalyst } from "@/lib/busanalyst";
import { QuickEntrySheet } from "@/components/QuickEntrySheet";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/more", label: "More", icon: MoreHorizontal },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { setEntrySheetOpen, activeBusiness, isGuest } = useBizAnalyst();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-card p-4 lg:block">
        <div className="rounded-xl bg-blue-50 p-3">
          <p className="text-xs text-muted-foreground">Business</p>
          <p className="truncate font-display font-semibold text-blue-900">
            {activeBusiness.name}
          </p>
          <Link
            to={isGuest ? "/auth" : "/businesses"}
            className="text-xs font-medium text-blue-700 hover:underline"
          >
            {isGuest ? "Sign in" : "Switch business"}
          </Link>
        </div>
        <nav className="mt-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium",
                isActive(to)
                  ? "bg-blue-900 text-primary-foreground"
                  : "text-charcoal-500 hover:bg-blue-50",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => setEntrySheetOpen(true)}
          className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-3 text-sm font-semibold text-charcoal-800"
        >
          <Plus className="h-5 w-5" aria-hidden /> Record
        </button>
      </aside>

      <div className="min-w-0 flex-1">
        <main className="mx-auto w-full max-w-3xl px-4 pt-4 pb-28 lg:max-w-5xl lg:pb-10">
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-card lg:hidden">
        <div className="mx-auto grid max-w-3xl grid-cols-5 items-end px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {NAV.slice(0, 2).map(({ to, label, icon: Icon }) => (
            <TabLink key={to} to={to} label={label} Icon={Icon} active={isActive(to)} />
          ))}
          <div className="flex justify-center">
            <button
              onClick={() => setEntrySheetOpen(true)}
              aria-label="Record a transaction"
              className="-mt-7 grid h-14 w-14 place-items-center rounded-full bg-gold-500 text-charcoal-800 shadow-lg ring-4 ring-card"
            >
              <Plus className="h-7 w-7" aria-hidden />
            </button>
          </div>
          {NAV.slice(2).map(({ to, label, icon: Icon }) => (
            <TabLink key={to} to={to} label={label} Icon={Icon} active={isActive(to)} />
          ))}
        </div>
      </nav>

      <QuickEntrySheet />
    </div>
  );
}

function TabLink({
  to,
  label,
  Icon,
  active,
}: {
  to: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex min-h-11 flex-col items-center justify-center gap-1 rounded-lg py-1 text-[11px] font-medium",
        active ? "text-blue-900" : "text-charcoal-500",
      )}
    >
      <Icon className="h-5 w-5" />
      {label}
      <span
        className={cn("h-0.5 w-6 rounded-full", active ? "bg-gold-500" : "bg-transparent")}
        aria-hidden
      />
    </Link>
  );
}
