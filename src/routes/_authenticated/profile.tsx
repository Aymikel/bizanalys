import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useSession, displayName } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — BusAnalyst" },
      {
        name: "description",
        content: "Update your name, business name and contact details in BusAnalyst.",
      },
      { property: "og:title", content: "Your profile — BusAnalyst" },
      { property: "og:description", content: "Manage your BusAnalyst account details." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, business_name, phone")
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) toast.error("Could not load your profile");
      setFullName(data?.full_name ?? displayName(user));
      setBusinessName(data?.business_name ?? "");
      setPhone(data?.phone ?? "");
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      business_name: businessName,
      phone,
    });
    setSaving(false);
    if (error) {
      toast.error("Could not save profile");
      return;
    }
    toast.success("Profile saved");
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <AppShell>
      <h1 className="text-2xl">Profile</h1>
      <p className="text-sm text-muted-foreground">{user?.email}</p>

      <form onSubmit={save} className="card-surface mt-4 space-y-3 p-4">
        <Field label="Full name" value={fullName} onChange={setFullName} />
        <Field label="Business name" value={businessName} onChange={setBusinessName} />
        <Field label="Phone" value={phone} onChange={setPhone} type="tel" />
        <button
          type="submit"
          disabled={saving || loading}
          className="min-h-11 w-full rounded-xl bg-blue-900 px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      <button
        onClick={signOut}
        className="card-surface mt-4 flex min-h-11 w-full items-center justify-center gap-2 p-3 text-sm font-semibold text-rust-500"
      >
        <LogOut className="h-4 w-4" aria-hidden /> Log out
      </button>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        className="mt-1 min-h-11 w-full rounded-xl border bg-background px-3 text-sm"
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
