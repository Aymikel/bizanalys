import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Store, UtensilsCrossed, Sprout, Wrench, Factory, Boxes } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BUSINESS_TYPES, PAYMENT_METHODS, useBizAnalyst } from "@/lib/busanalyst";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your business — BizAnalyst" },
      {
        name: "description",
        content:
          "Five short steps: name your business, pick its type and payment methods, and your dashboard is ready.",
      },
      { property: "og:title", content: "Set up your business — BizAnalyst" },
      { property: "og:description", content: "Ready in under a minute. No accounting needed." },
    ],
  }),
  component: Onboarding,
});

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Retail: Store,
  Food: UtensilsCrossed,
  Agriculture: Sprout,
  Services: Wrench,
  Manufacturing: Factory,
  Other: Boxes,
};

function Onboarding() {
  const { addBusiness } = useBizAnalyst();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [methods, setMethods] = useState<string[]>(["Cash"]);

  const steps = ["Welcome", "Name", "Type", "Payments", "Done"];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-8">
      <div className="flex justify-center gap-2" aria-label={`Step ${step + 1} of 5`}>
        {steps.map((s, i) => (
          <span
            key={s}
            className={cn(
              "h-2 rounded-full transition-all",
              i === step ? "w-6 bg-gold-500" : "w-2 bg-paper-100",
            )}
          />
        ))}
      </div>

      <div className="mt-10 flex-1">
        {step === 0 && (
          <>
            <h1 className="text-3xl">Know your business, day by day.</h1>
            <p className="mt-3 text-charcoal-500">
              Record what happened today in plain words — BizAnalyst turns it into profit, cash flow
              and advice.
            </p>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="text-2xl">What's your business called?</h1>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nobelza Stores"
              className="mt-6 min-h-12 rounded-none border-0 border-b bg-transparent px-0 font-display text-xl shadow-none focus-visible:ring-0"
            />
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl">What kind of business is it?</h1>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {BUSINESS_TYPES.map((t) => {
                const Icon = TYPE_ICONS[t] ?? Boxes;
                return (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={cn(
                      "card-surface flex min-h-24 flex-col items-center justify-center gap-2 text-sm font-medium",
                      type === t
                        ? "border-2 border-blue-900 bg-blue-50 text-blue-900"
                        : "text-charcoal-500",
                    )}
                  >
                    <Icon className="h-6 w-6" />
                    {t}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-2xl">How do you get paid?</h1>
            <p className="mt-2 text-sm text-charcoal-500">Pick all that apply.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((m) => {
                const active = methods.includes(m);
                return (
                  <button
                    key={m}
                    onClick={() =>
                      setMethods((prev) =>
                        active ? prev.filter((x) => x !== m) : [...prev, m],
                      )
                    }
                    aria-pressed={active}
                    className={cn(
                      "min-h-11 rounded-full border px-5 text-sm font-medium",
                      active
                        ? "border-blue-900 bg-blue-50 text-blue-900"
                        : "border-transparent bg-paper-100 text-charcoal-500",
                    )}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h1 className="text-2xl">Your dashboard is ready</h1>
            <p className="mt-2 text-charcoal-500">
              Each transaction you record adds a bead to your day thread.
            </p>
            <div className="mt-8 flex items-center gap-2">
              {["emerald", "rust", "emerald", "emerald", "rust"].map((tone, i) => (
                <span
                  key={i}
                  className={cn(
                    "bead-appear h-3.5 w-3.5 rounded-full",
                    tone === "emerald" ? "bg-emerald-600" : "bg-rust-600",
                  )}
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Button
        className="min-h-12 w-full font-display text-base"
        disabled={(step === 1 && !name.trim()) || (step === 2 && !type)}
        onClick={() => {
          if (step === 4) {
            addBusiness(name.trim() || "My Business", type || "Other");
            navigate({ to: "/" });
            return;
          }
          setStep((s) => s + 1);
        }}
      >
        {step === 0 ? "Get Started" : step === 4 ? "Open Dashboard" : "Continue"}
      </Button>
    </div>
  );
}
