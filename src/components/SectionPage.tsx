import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";

export function SectionPage({
  title,
  subtitle,
  backTo = "/more",
  backLabel = "More",
  children,
}: {
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  children: ReactNode;
}) {
  return (
    <AppShell>
      <Link
        to={backTo}
        className="-ml-1 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-blue-900 transition-opacity active:opacity-60"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden /> {backLabel}
      </Link>
      <header className="mt-1">
        <h1 className="font-display text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </header>
      <div className="mt-4 space-y-4 pb-4">{children}</div>
    </AppShell>
  );
}

export function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xs tracking-wide text-muted-foreground uppercase">{children}</h2>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("card-surface overflow-hidden", className)}>{children}</div>;
}

const rowBase =
  "grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b px-4 py-3 text-left last:border-0 transition-colors hover:bg-blue-50 active:bg-blue-50 active:opacity-80";

export function Row({
  title,
  meta,
  right,
  onClick,
  to,
  params,
}: {
  title: ReactNode;
  meta?: ReactNode;
  right?: ReactNode;
  onClick?: () => void;
  to?: string;
  params?: Record<string, string>;
}) {
  const inner = (
    <>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-charcoal-800">{title}</span>
        {meta && <span className="block truncate text-xs text-muted-foreground">{meta}</span>}
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {right}
        {(to || onClick) && (
          <ChevronRight className="h-4 w-4 text-charcoal-500" aria-hidden />
        )}
      </span>
    </>
  );

  if (to) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Link to={to as any} params={params as any} className={rowBase}>
        {inner}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={rowBase}>
        {inner}
      </button>
    );
  }
  return <div className={cn(rowBase, "hover:bg-transparent active:bg-transparent")}>{inner}</div>;
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 text-sm font-semibold text-primary-foreground transition-opacity active:opacity-80",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b px-4 py-3 text-left last:border-0 transition-colors hover:bg-blue-50 active:opacity-80"
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium text-charcoal-800">{label}</span>
        {description && (
          <span className="block text-xs text-muted-foreground">{description}</span>
        )}
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-blue-900" : "bg-paper-100",
        )}
        aria-hidden
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all",
            checked ? "left-[1.375rem]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}

export function Chip({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "blue" | "gold" | "rust" | "emerald";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
        tone === "neutral" && "bg-paper-100 text-charcoal-500",
        tone === "blue" && "bg-blue-50 text-blue-900",
        tone === "gold" && "bg-gold-100 text-charcoal-800",
        tone === "rust" && "bg-rust-600/10 text-rust-600",
        tone === "emerald" && "bg-emerald-600/10 text-emerald-600",
      )}
    >
      {children}
    </span>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "mt-1 min-h-11 w-full rounded-xl border bg-card px-3 text-sm text-charcoal-800 outline-none focus:border-blue-900";
