export type Party = {
  id: string;
  name: string;
  phone: string;
  balance: number;
  history: { date: string; label: string; amount: number }[];
};

export const CUSTOMERS: Party[] = [
  {
    id: "amaka-stores",
    name: "Amaka Stores",
    phone: "0803 111 2233",
    balance: 42500,
    history: [
      { date: "2026-08-20", label: "Sale — 3 cartons", amount: 60000 },
      { date: "2026-08-21", label: "Payment received", amount: -17500 },
    ],
  },
  {
    id: "chidi-ventures",
    name: "Chidi Ventures",
    phone: "0810 445 9021",
    balance: 0,
    history: [
      { date: "2026-08-18", label: "Sale — bulk order", amount: 128000 },
      { date: "2026-08-19", label: "Payment received", amount: -128000 },
    ],
  },
  {
    id: "grace-kitchen",
    name: "Grace Kitchen",
    phone: "0705 220 7788",
    balance: 12000,
    history: [{ date: "2026-08-22", label: "Sale — daily supply", amount: 12000 }],
  },
];

export const SUPPLIERS: Party[] = [
  {
    id: "lagos-wholesale",
    name: "Lagos Wholesale Ltd",
    phone: "0812 909 0011",
    balance: 85000,
    history: [
      { date: "2026-08-17", label: "Purchase — stock refill", amount: 185000 },
      { date: "2026-08-20", label: "Payment made", amount: -100000 },
    ],
  },
  {
    id: "kano-farms",
    name: "Kano Farms",
    phone: "0906 774 1122",
    balance: 0,
    history: [{ date: "2026-08-15", label: "Purchase — grains", amount: 74000 }],
  },
];

export type Item = {
  id: string;
  name: string;
  qty: number;
  unitCost: number;
  lowAt: number;
};

export const INVENTORY: Item[] = [
  { id: "rice-50kg", name: "Rice 50kg bag", qty: 12, unitCost: 68000, lowAt: 5 },
  { id: "veg-oil", name: "Vegetable oil 5L", qty: 3, unitCost: 12500, lowAt: 6 },
  { id: "sugar-1kg", name: "Sugar 1kg", qty: 48, unitCost: 1400, lowAt: 20 },
  { id: "sachet-water", name: "Sachet water (bag)", qty: 4, unitCost: 350, lowAt: 10 },
];

export const ROLES = ["Owner", "Admin", "Accountant", "Sales", "Inventory", "Cashier"] as const;
export type Role = (typeof ROLES)[number];

export const TEAM: { id: string; name: string; email: string; role: Role }[] = [
  { id: "1", name: "You", email: "owner@bizanalyst.app", role: "Owner" },
  { id: "2", name: "Ngozi A.", email: "ngozi@bizanalyst.app", role: "Accountant" },
  { id: "3", name: "Samuel O.", email: "samuel@bizanalyst.app", role: "Sales" },
];

export const FAQS = [
  {
    q: "How do I record a sale?",
    a: "Tap the gold + button on any screen, choose Sale, enter the amount and payment method, then save.",
  },
  {
    q: "Can I use BizAnalyst without internet?",
    a: "Yes. Entries are stored on your device and sync to your account the next time you are online.",
  },
  {
    q: "How is my profit calculated?",
    a: "Income (sales and other income) minus expenses and purchases for the selected period.",
  },
  {
    q: "Who can see my records?",
    a: "Only you and the teammates you invite under User roles.",
  },
];
