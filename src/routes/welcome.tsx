import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WELCOME_AUTO_MS, markWelcomeSeen } from "@/lib/welcome";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome to BizAnalyst — Your numbers, understood" },
      {
        name: "description",
        content:
          "Start with BizAnalyst: continue as a guest or sign in to track daily profit, cash flow and business health.",
      },
      { property: "og:title", content: "Welcome to BizAnalyst" },
      {
        property: "og:description",
        content: "Continue as guest or sign in to track profit, cash and business health.",
      },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const navigate = useNavigate();

  const markSeen = markWelcomeSeen;

  // Auto-continue to the dashboard after the splash has been shown briefly.
  useEffect(() => {
    const t = setTimeout(() => {
      markWelcomeSeen();
      navigate({ to: "/", replace: true });
    }, WELCOME_AUTO_MS);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-blue-900 px-6 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(transparent, transparent 39px, rgba(255,255,255,0.035) 40px)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-6 grid h-[76px] w-[76px] place-items-center rounded-[20px] bg-paper-50">
          <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden>
            <rect x="4" y="22" width="7" height="14" rx="1.5" fill="var(--blue-900)" />
            <rect x="16.5" y="14" width="7" height="22" rx="1.5" fill="var(--blue-900)" />
            <rect x="29" y="6" width="7" height="30" rx="1.5" fill="var(--gold-500)" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-paper-50">
          Biz<span className="text-gold-500">Analyst</span>
        </h1>
        <p className="mt-2 text-xs tracking-[0.4px] text-paper-50/65 uppercase">
          Your Numbers, Understood
        </p>
      </div>

      <div className="relative z-10 mt-12 flex w-full max-w-sm flex-col gap-3">
        <Button
          className="min-h-12 w-full bg-gold-500 font-display text-base text-charcoal-800 hover:bg-gold-500/90"
          onClick={() => {
            markSeen();
            navigate({ to: "/auth" });
          }}
        >
          Log in or sign up
        </Button>
        <Button
          variant="outline"
          className="min-h-12 w-full border-paper-50/30 bg-transparent font-display text-base text-paper-50 hover:bg-paper-50/10 hover:text-paper-50"
          onClick={() => {
            markSeen();
            navigate({ to: "/" });
          }}
        >
          Continue as guest
        </Button>
      </div>

      <div className="relative z-10 mt-10 flex gap-2" aria-hidden>
        {["bg-emerald-600", "bg-emerald-600", "bg-gold-500", "bg-paper-50/30", "bg-paper-50/30"].map(
          (tone, i) => (
            <span
              key={i}
              className={`bead-appear h-2 w-2 rounded-full ${tone}`}
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ),
        )}
      </div>
    </main>
  );
}
