import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Card, Field, PrimaryButton, SectionPage, inputClass } from "@/components/SectionPage";
import { BUSINESS_TYPES, useBizAnalyst } from "@/lib/busanalyst";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/more/business-profile")({
  head: () => ({
    meta: [
      { title: "Business profile — BizAnalyst" },
      { name: "description", content: "Your business name, type, address and contact details." },
      { property: "og:title", content: "Business profile — BizAnalyst" },
      { property: "og:description", content: "Details used across your reports and exports." },
    ],
  }),
  component: BusinessProfilePage,
});

function BusinessProfilePage() {
  const { activeBusiness } = useBizAnalyst();
  const [name, setName] = useState(activeBusiness.name);
  const [type, setType] = useState(activeBusiness.type);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [logo, setLogo] = useState<string | null>(null);

  return (
    <SectionPage title="Business profile" subtitle="Shown on statements, reports and exports.">
      <Card className="space-y-4 p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-blue-50">
            {logo ? (
              <img src={logo} alt="Business logo" className="h-full w-full object-cover" />
            ) : (
              <ImagePlus className="h-6 w-6 text-blue-900" aria-hidden />
            )}
          </span>
          <label className="inline-flex min-h-11 cursor-pointer items-center rounded-xl bg-paper-100 px-4 text-sm font-medium text-blue-900 transition-opacity active:opacity-70">
            Upload logo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setLogo(URL.createObjectURL(file));
              }}
            />
          </label>
        </div>

        <Field label="Business name">
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>

        <div>
          <span className="block text-xs font-medium text-muted-foreground">Business type</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {BUSINESS_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={cn(
                  "min-h-9 rounded-full px-4 text-xs font-medium transition-colors active:opacity-80",
                  type === t ? "bg-blue-900 text-primary-foreground" : "bg-paper-100 text-charcoal-500",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <Field label="Address">
          <input className={inputClass} value={address} onChange={(e) => setAddress(e.target.value)} />
        </Field>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Phone">
            <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
          <Field label="Email">
            <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
        </div>
      </Card>

      <PrimaryButton onClick={() => toast.success("Business profile saved")}>
        Save changes
      </PrimaryButton>
    </SectionPage>
  );
}
