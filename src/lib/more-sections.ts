export type MoreSection = {
  slug: string;
  label: string;
  group: "Business" | "Setup" | "Account";
  icon:
    | "Users"
    | "Truck"
    | "Boxes"
    | "Building2"
    | "CreditCard"
    | "Tags"
    | "Bell"
    | "Download"
    | "Settings"
    | "LifeBuoy";
  blurb: string;
  points: string[];
};

export const MORE_SECTIONS: MoreSection[] = [
  {
    slug: "customers",
    label: "Customers",
    group: "Business",
    icon: "Users",
    blurb: "Keep a record of who buys from you and who still owes you money.",
    points: [
      "Add customers with phone numbers and notes",
      "See what each customer bought and paid",
      "Track outstanding balances (receivables)",
    ],
  },
  {
    slug: "suppliers",
    label: "Suppliers",
    group: "Business",
    icon: "Truck",
    blurb: "Track the people you buy from and what you still owe them.",
    points: [
      "Save supplier contacts and payment terms",
      "Log purchases against a supplier",
      "Watch payables before they become overdue",
    ],
  },
  {
    slug: "inventory",
    label: "Inventory",
    group: "Business",
    icon: "Boxes",
    blurb: "Know what is on the shelf, what is moving and what is running out.",
    points: [
      "Stock items with cost and selling price",
      "Automatic stock movement from sales and purchases",
      "Low-stock alerts before you run dry",
    ],
  },
  {
    slug: "business-profile",
    label: "Business profile",
    group: "Setup",
    icon: "Building2",
    blurb: "Your business name, type, currency and details used across reports.",
    points: [
      "Business name shown on statements",
      "Industry type and reporting currency",
      "Address and contact details for exports",
    ],
  },
  {
    slug: "user-roles",
    label: "User roles",
    group: "Setup",
    icon: "Users",
    blurb: "Decide who can record transactions and who can only view reports.",
    points: ["Owner, manager and staff roles", "Invite teammates by email", "Revoke access anytime"],
  },
  {
    slug: "payment-methods",
    label: "Payment methods",
    group: "Setup",
    icon: "CreditCard",
    blurb: "Cash, bank transfer, POS or mobile money — group your money where it lives.",
    points: [
      "Add the accounts you actually use",
      "Cash flow report splits by method",
      "Set a default for quick entry",
    ],
  },
  {
    slug: "categories",
    label: "Categories",
    group: "Setup",
    icon: "Tags",
    blurb: "Name your income and expense buckets so reports read like your business.",
    points: ["Custom income categories", "Custom expense categories", "Rename or merge at any time"],
  },
  {
    slug: "notifications",
    label: "Notifications",
    group: "Setup",
    icon: "Bell",
    blurb: "Gentle nudges so you never forget to record a day.",
    points: ["Daily record reminder", "Weekly summary", "Low balance and low stock warnings"],
  },
  {
    slug: "export-data",
    label: "Export data",
    group: "Account",
    icon: "Download",
    blurb: "Take your records with you — for your accountant, bank or your own files.",
    points: ["CSV of all transactions", "PDF reports", "Everything stays yours"],
  },
  {
    slug: "settings",
    label: "Settings",
    group: "Account",
    icon: "Settings",
    blurb: "App preferences that shape how BusAnalyst behaves for you.",
    points: ["Currency and number format", "Week start and financial year", "Data and privacy controls"],
  },
  {
    slug: "help-support",
    label: "Help & support",
    group: "Account",
    icon: "LifeBuoy",
    blurb: "Stuck on something? Here is how to reach a human.",
    points: ["Step-by-step guides", "Email support", "Send feedback and feature ideas"],
  },
];

export function findSection(slug: string) {
  return MORE_SECTIONS.find((s) => s.slug === slug);
}
