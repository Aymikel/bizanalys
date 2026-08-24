import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bell,
  Boxes,
  Building2,
  CreditCard,
  Download,
  LifeBuoy,
  Settings,
  Tags,
  Truck,
  Users,
  Check,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GuestNotice } from "@/components/GuestNotice";
import { useBizAnalyst } from "@/lib/busanalyst";
import { findSection } from "@/lib/more-sections";

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

export const Route = createFileRoute("/more/$section")({
  loader: ({ params }) => {
    const section = findSection(params.section);
    if (!section) throw notFound();
    return { section };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Not found — BizAnalyst" }, { name: "robots", content: "noindex" }],
      };
    }
    const { label, blurb } = loaderData.section;
    return {
      meta: [
        { title: `${label} — BizAnalyst` },
        { name: "description", content: blurb },
        { property: "og:title", content: `${label} — BizAnalyst` },
        { property: "og:description", content: blurb },
      ],
    };
  },
  notFoundComponent: SectionNotFound,
  component: SectionPage,
});

function SectionPage() {
  const { section } = Route.useLoaderData();
  const { isGuest } = useBizAnalyst();
  const Icon = ICONS[section.icon];

  return (
    <AppShell>
      <BackLink />

      <header className="mt-3 flex items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50">
          <Icon className="h-6 w-6 text-blue-900" aria-hidden />
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl">{section.label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{section.blurb}</p>
        </div>
      </header>

      {isGuest ? (
        <GuestNotice
          title={`Sign in to use ${section.label}`}
          body="This part of BizAnalyst belongs to a business. Create an account or log in to set it up."
        />
      ) : (
        <>
          <section className="card-surface mt-4 p-4">
            <h2 className="text-sm tracking-wide text-muted-foreground uppercase">
              What this covers
            </h2>
            <ul className="mt-3 space-y-2">
              {section.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-charcoal-800">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </section>

          <section className="card-surface mt-3 p-4">
            <p className="text-sm text-muted-foreground">
              Nothing has been set up here yet. Once you start recording transactions, this section
              fills in automatically.
            </p>
            <Link
              to="/transactions"
              className="mt-3 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-900 px-5 text-sm font-semibold text-primary-foreground"
            >
              Go to transactions
            </Link>
          </section>
        </>
      )}
    </AppShell>
  );
}

function BackLink() {
  return (
    <Link
      to="/more"
      className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-blue-900"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden /> More
    </Link>
  );
}

function SectionNotFound() {
  return (
    <AppShell>
      <BackLink />
      <h1 className="mt-3 text-2xl">Section not found</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        That page doesn&apos;t exist. Head back to the More tab.
      </p>
    </AppShell>
  );
}
