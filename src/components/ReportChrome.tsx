import { Eye, Filter, FileText, Sheet as SheetIcon, Printer } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function RangePicker({
  range,
  onChange,
}: {
  range: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="mt-2 flex gap-2">
      {[7, 30, 90].map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          aria-pressed={range === r}
          className={cn(
            "min-h-9 rounded-full px-4 text-xs font-medium",
            range === r ? "bg-blue-50 text-blue-900" : "bg-paper-100 text-charcoal-500",
          )}
        >
          Last {r} days
        </button>
      ))}
    </div>
  );
}

const ACTIONS = [
  { label: "View", icon: Eye },
  { label: "Filter", icon: Filter },
  { label: "PDF", icon: FileText },
  { label: "Excel", icon: SheetIcon },
  { label: "Print", icon: Printer },
];

export function ReportBottomBar() {
  return (
    <div className="mt-4 mb-2 card-surface grid grid-cols-5 gap-1 p-2">
      {ACTIONS.map(({ label, icon: Icon }) => (
        <button
          key={label}
          onClick={() =>
            label === "Print"
              ? window.print()
              : toast.info(`${label} coming soon`, {
                  description: "This report action isn't wired up yet.",
                })
          }
          className="flex min-h-11 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium text-charcoal-500 hover:bg-blue-50 hover:text-blue-900"
        >
          <Icon className="h-4 w-4" aria-hidden />
          {label}
        </button>
      ))}
    </div>
  );
}
