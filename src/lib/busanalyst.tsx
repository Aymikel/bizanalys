import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type TxKind = "income" | "expense" | "sale" | "purchase";
export type PaymentMethod = "Cash" | "Bank" | "POS" | "Transfer";

export type Transaction = {
  id: string;
  businessId: string;
  kind: TxKind;
  amount: number;
  method: PaymentMethod;
  category: string;
  description: string;
  date: string; // yyyy-mm-dd
  createdAt: number;
};

export type Business = {
  id: string;
  name: string;
  type: string;
};

export const PAYMENT_METHODS: PaymentMethod[] = ["Cash", "Bank", "POS", "Transfer"];

export const BUSINESS_TYPES = [
  "Retail",
  "Food",
  "Agriculture",
  "Services",
  "Manufacturing",
  "Other",
];

export const CATEGORIES_BY_TYPE: Record<string, string[]> = {
  Retail: ["Stock", "Rent", "Transport", "Salaries", "Utilities", "Sales"],
  Food: ["Ingredients", "Gas", "Delivery", "Rent", "Salaries", "Sales"],
  Agriculture: ["Seeds", "Fertiliser", "Labour", "Transport", "Harvest sales"],
  Services: ["Tools", "Subscriptions", "Transport", "Salaries", "Service fees"],
  Manufacturing: ["Raw materials", "Power", "Labour", "Maintenance", "Sales"],
  Other: ["General", "Rent", "Transport", "Salaries", "Sales"],
};

export function isIncome(kind: TxKind) {
  return kind === "income" || kind === "sale";
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function shiftDay(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatMoney(value: number, opts: { sign?: boolean } = {}) {
  const abs = Math.abs(value).toLocaleString("en-NG", { maximumFractionDigits: 0 });
  const prefix = opts.sign ? (value < 0 ? "−" : "+") : value < 0 ? "−" : "";
  return `${prefix}₦${abs}`;
}

export function formatCompact(value: number) {
  if (Math.abs(value) >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}m`;
  if (Math.abs(value) >= 1_000) return `₦${Math.round(value / 1_000)}k`;
  return formatMoney(value);
}

export function formatDayLabel(iso: string) {
  if (iso === todayISO()) return "Today";
  if (iso === shiftDay(-1)) return "Yesterday";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

const DEFAULT_BUSINESSES: Business[] = [
  { id: "b1", name: "Nobelza Stores", type: "Retail" },
  { id: "b2", name: "Mama Ada Kitchen", type: "Food" },
];

function seedTransactions(): Transaction[] {
  const rows: Array<[number, TxKind, number, PaymentMethod, string, string]> = [
    [0, "sale", 85000, "Cash", "Sales", "Morning counter sales"],
    [0, "sale", 100000, "POS", "Sales", "Bulk order — Chidi"],
    [0, "expense", 42500, "Cash", "Stock", "Restock cartons of milk"],
    [0, "expense", 18000, "Transfer", "Transport", "Van fuel + driver"],
    [0, "expense", 12000, "Cash", "Utilities", "Generator diesel"],
    [-1, "sale", 148000, "Cash", "Sales", "Counter sales"],
    [-1, "expense", 47500, "Bank", "Stock", "Supplier payment"],
    [-2, "sale", 132000, "POS", "Sales", "Weekend rush"],
    [-2, "expense", 26000, "Cash", "Transport", "Delivery runs"],
    [-3, "sale", 96000, "Cash", "Sales", "Counter sales"],
    [-3, "expense", 61000, "Bank", "Rent", "Shop rent instalment"],
    [-4, "sale", 121000, "Transfer", "Sales", "Wholesale order"],
    [-4, "expense", 34000, "Cash", "Stock", "Restock drinks"],
    [-5, "sale", 88000, "Cash", "Sales", "Counter sales"],
    [-5, "expense", 29000, "Cash", "Salaries", "Weekly wages"],
    [-6, "sale", 104000, "POS", "Sales", "Counter sales"],
    [-6, "expense", 31000, "Cash", "Transport", "Market pickup"],
  ];
  return rows.map(([offset, kind, amount, method, category, description], i) => ({
    id: `seed-${i}`,
    businessId: "b1",
    kind,
    amount,
    method,
    category,
    description,
    date: shiftDay(offset),
    createdAt: Date.now() - (rows.length - i) * 60000,
  }));
}

type Store = {
  ready: boolean;
  businesses: Business[];
  activeBusinessId: string;
  activeBusiness: Business;
  transactions: Transaction[];
  allTransactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id" | "businessId" | "createdAt">) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  setActiveBusiness: (id: string) => void;
  addBusiness: (name: string, type: string) => void;
  entrySheetOpen: boolean;
  setEntrySheetOpen: (open: boolean) => void;
};

const StoreContext = createContext<Store | null>(null);
const KEY = "busanalyst.v1";

export function BusAnalystProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>(DEFAULT_BUSINESSES);
  const [activeBusinessId, setActiveBusinessId] = useState("b1");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [entrySheetOpen, setEntrySheetOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setBusinesses(parsed.businesses ?? DEFAULT_BUSINESSES);
        setActiveBusinessId(parsed.activeBusinessId ?? "b1");
        setTransactions(parsed.transactions ?? seedTransactions());
      } else {
        setTransactions(seedTransactions());
      }
    } catch {
      setTransactions(seedTransactions());
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify({ businesses, activeBusinessId, transactions }));
  }, [ready, businesses, activeBusinessId, transactions]);

  const addTransaction = useCallback<Store["addTransaction"]>(
    (tx) => {
      setTransactions((prev) => [
        ...prev,
        {
          ...tx,
          id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          businessId: activeBusinessId,
          createdAt: Date.now(),
        },
      ]);
    },
    [activeBusinessId],
  );

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTransaction = useCallback((id: string, patch: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const addBusiness = useCallback((name: string, type: string) => {
    const id = `b-${Date.now()}`;
    setBusinesses((prev) => [...prev, { id, name, type }]);
    setActiveBusinessId(id);
  }, []);

  const value = useMemo<Store>(() => {
    const activeBusiness =
      businesses.find((b) => b.id === activeBusinessId) ?? businesses[0] ?? DEFAULT_BUSINESSES[0];
    return {
      ready,
      businesses,
      activeBusinessId,
      activeBusiness,
      transactions: transactions
        .filter((t) => t.businessId === activeBusiness.id)
        .sort((a, b) => (a.date === b.date ? a.createdAt - b.createdAt : a.date < b.date ? -1 : 1)),
      allTransactions: transactions,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      setActiveBusiness: setActiveBusinessId,
      addBusiness,
      entrySheetOpen,
      setEntrySheetOpen,
    };
  }, [
    ready,
    businesses,
    activeBusinessId,
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    addBusiness,
    entrySheetOpen,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useBusAnalyst() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useBusAnalyst must be used inside BusAnalystProvider");
  return ctx;
}

/* ---------- derived analytics ---------- */

export function dayTotals(txs: Transaction[], date: string) {
  const rows = txs.filter((t) => t.date === date);
  const revenue = rows.filter((t) => isIncome(t.kind)).reduce((s, t) => s + t.amount, 0);
  const expenses = rows.filter((t) => !isIncome(t.kind)).reduce((s, t) => s + t.amount, 0);
  return { revenue, expenses, profit: revenue - expenses, rows };
}

export function lastNDays(n: number) {
  return Array.from({ length: n }, (_, i) => shiftDay(-(n - 1 - i)));
}

export function trendSeries(txs: Transaction[], days: number) {
  return lastNDays(days).map((date) => {
    const { revenue, expenses, profit } = dayTotals(txs, date);
    return { date, label: date.slice(5), revenue, expenses, profit };
  });
}

export function balances(txs: Transaction[]) {
  const byMethod = (method: PaymentMethod) =>
    txs
      .filter((t) => t.method === method)
      .reduce((s, t) => s + (isIncome(t.kind) ? t.amount : -t.amount), 0);
  return {
    cash: 850000 + byMethod("Cash"),
    bank: 1240000 + byMethod("Bank") + byMethod("Transfer") + byMethod("POS"),
    receivable: 420000,
    payable: 280000,
  };
}

export function healthScore(txs: Transaction[]) {
  const series = trendSeries(txs, 30);
  const revenue = series.reduce((s, d) => s + d.revenue, 0);
  const expenses = series.reduce((s, d) => s + d.expenses, 0);
  if (revenue === 0) return 50;
  const margin = (revenue - expenses) / revenue;
  const activeDays = series.filter((d) => d.revenue + d.expenses > 0).length;
  const consistency = activeDays / 30;
  const score = Math.round(Math.max(0, Math.min(1, margin * 1.6)) * 70 + consistency * 30);
  return Math.max(5, Math.min(99, score));
}

export function healthStatus(score: number) {
  if (score >= 70) return { label: "Healthy", tone: "emerald" as const };
  if (score >= 45) return { label: "Needs Attention", tone: "gold" as const };
  return { label: "Critical", tone: "rust" as const };
}
