import { formatMoney } from "@/lib/busanalyst";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

export function Money({
  value,
  signed = false,
  tone,
  className,
}: {
  value: number;
  signed?: boolean;
  tone?: "income" | "expense" | "neutral";
  className?: string;
}) {
  const resolved = tone ?? (value < 0 ? "expense" : "neutral");
  return (
    <span
      className={cn(
        "money inline-block",
        resolved === "income" && "text-emerald-600",
        resolved === "expense" && "text-rust-600",
        className,
      )}
    >
      {signed && resolved === "income" ? "+" : ""}
      {signed && resolved === "expense" ? "−" : ""}
      {formatMoney(Math.abs(value))}
    </span>
  );
}

export function Delta({ percent }: { percent: number }) {
  const up = percent >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium",
        up ? "text-emerald-600" : "text-rust-600",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
      <span className="money">
        {up ? "▲" : "▼"} {Math.abs(Math.round(percent))}%
      </span>
    </span>
  );
}
