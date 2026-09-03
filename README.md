# bizanalys

BusAnalyst — Complete UI/UX Specification (for Lovable)

Product: BusAnalyst — a mobile-first business intelligence & financial management app for SMEs. A business owner records what happened each day in plain language; the app turns it into financial statements, insights, and forecasts. No accounting knowledge required.

Audience: Small business owners with little to no formal accounting background — retail, wholesale, food, agriculture, services. Mobile-first, often mid-range Android, sometimes patchy connectivity.

Paste this whole document into Lovable as your build prompt.

1. Design Tokens

Color — Blue / Gold / Complementary

Token Hex Role blue-900 #1B3A6B Primary brand — nav bar, primary buttons, headers, active states blue-700 #2C548F Hover/pressed states, links blue-50 #EAF0F8 Light fills, selected chip backgrounds gold-500 #C9962B Accent — key numbers, highlights, Business Health ring, active tab indicator gold-100 #F6E9CE Soft accent fills, badges emerald-600 #2F7A5B Complementary — income, positive deltas, success states, "healthy" status rust-600 #B54B3F Expenses, negative deltas, destructive actions, warnings paper-50 #F7F8FA App background paper-100 #EDEFF3 Card backgrounds, dividers charcoal-800 #20242B Body text charcoal-500 #5B6270 Secondary/muted text

Blue carries trust and structure, gold carries value and achievement (money, milestones, the Health Score), emerald is the complementary third — money coming in, growth, "good news" — leaving rust free to mean exactly one thing: money going out or something needing attention.

Typography — 3 typefaces

Role Typeface Notes Headings / display Poppins (SemiBold/Medium) Geometric, friendly, confident — page titles, section headers, the Business Health number Body / UI Inter (Regular/Medium) Small-size legibility for labels, buttons, descriptions, nav Numbers / tabular data IBM Plex Mono (Regular/Medium) Every currency figure and table column — keeps digits aligned

Layout system

Mobile-first, single column, bottom tab bar; scales to a 2-column dashboard at tablet width and a sidebar layout at desktop

8px spacing grid, minimum 44px tap targets

Cards: 12px radius, 1px paper-100 border, no heavy drop shadows — flat and legible over decorative

Currency: always right-aligned, IBM Plex Mono, color-coded (emerald for +, rust for −)

Iconography

Rounded, medium-weight line icons (e.g. Phosphor or Lucide "rounded" style) — matches Poppins' friendliness, avoids sharp/corporate fintech iconography

2. Navigation Structure

Mobile (primary target): bottom tab bar — Dashboard | Transactions | + | Reports | More

+ is a raised circular gold-filled button, opens the quick-entry sheet

More holds: Business Switcher, Customers, Suppliers, Inventory, Settings, Help

Tablet/Desktop: left sidebar with the same five destinations, business switcher pinned at the top of the sidebar, + becomes a persistent top-right button instead of a tab

3. Screens

A. Onboarding

Welcome — Poppins display headline, one-line value prop, "Get Started"

Business name — single large text input

Business type — grid of tappable icon cards (Retail, Food, Agriculture, Services, Manufacturing, Other…)

Payment methods used — multi-select chips (Cash, Bank, POS, Transfer)

Done — "Your dashboard is ready," brief animated reveal of the day-thread indicator (see Signature, below)

Progress shown as dots, not a percentage — five short steps, never feels long.

B. Dashboard (Home)

[ ▾ Business name ]                         🔔  👤
──────────────────────────────────────────────
 ● ● ● ● ●  ○ ○         <- today's "day thread"
──────────────────────────────────────────────
  TODAY'S PROFIT (Poppins label, Plex Mono figure)
  ₦112,500                        ▲ 12% vs yesterday
  Revenue ₦185,000     Expenses ₦72,500
──────────────────────────────────────────────
 [ Cash ₦850,000 ]   [ Bank ₦1,240,000 ]
 [ Receivable ₦420k ] [ Payable ₦280k ]
──────────────────────────────────────────────
 ✦ AI INSIGHT
 "Expenses grew faster than revenue this month —
  mostly transport. Tap for details."
──────────────────────────────────────────────
 Revenue trend            [7d] [30d] [90d]
 (sparkline / bar chart, blue line, gold dot on today)
──────────────────────────────────────────────
 Business Health          [ 78 ]  🟢 Healthy
 (gold ring gauge, Poppins numeral in center)
──────────────────────────────────────────────
[Dashboard][Transactions][ + ][Reports][More]


C. Record Transaction (bottom sheet)

Four primary actions at top, equal-weight pill buttons: + Income · − Expense · Sale · Purchase

Amount field: large IBM Plex Mono numeric display with number pad

Payment method: chip selector (Cash / Bank / POS / Transfer)

Category: chip selector, contextual to business type (e.g. Retail → Stock, Rent, Transport; Food → Ingredients, Gas, Delivery)

Description: one-line text field

Date: defaults to today, tap to change

Full-width primary button: Save Transaction (blue-900 fill, white text)

On save: toast confirmation + a new bead animates onto the day-thread

D. Transactions List

Grouped by day with a running daily total

Row: category icon (blue), description, amount (emerald/rust, Plex Mono, right-aligned), payment method tag

Swipe left to edit, swipe right to delete (with confirm)

Filter bar: type, date range, payment method, category

Sticky search at top

E. Reports Centre

Section headers (Poppins): Financial, Sales, Expenses, Customers, Suppliers, Inventory, Management

Each report is a card: name, one-line description, small preview chart where relevant

Report detail screen: consistent bottom bar — View → Filter → Export PDF → Export Excel → Print

F. Business Switcher

Reached via the business-name dropdown at the top of Dashboard

List of business cards: name, type icon, today's profit at a glance, gold border on the active one

"+ Add another business" card at the bottom

G. AI Insight Detail

Full-screen expansion of a dashboard insight

Plain-language explanation first (Inter body), supporting chart/numbers below, one clear recommendation in a gold-bordered callout box

"Ask a follow-up" input pinned at the bottom for conversational Q&A

H. Settings / More

Business profile, user roles (Owner/Admin/Accountant/Sales/Inventory/Cashier), payment methods, categories, notifications, export data, help/support, log out

4. Component Library

Buttons: Primary (blue-900 fill), Secondary (blue-900 outline), Destructive (rust-600), all Poppins Medium label, 12px radius

Chips: pill-shaped, paper-100 default, blue-50 + blue-900 border when selected

Cards: paper-50 background, paper-100 1px border, 12px radius, 16px padding

Status badges: 🟢 Healthy (emerald-600), 🟡 Needs Attention (gold-500), 🔴 Critical (rust-600)

Inputs: underline style on mobile forms (lighter, faster to scan), boxed style in report filters

Charts: blue line/bars for neutral trends, emerald for positive, rust for negative, gold dot/marker for "today" or a highlighted point

5. Signature Element — The Day Thread

A slim horizontal strip at the top of the dashboard: one small bead per transaction recorded that day — emerald for income, rust for expense — like a trader counting stones on a string while closing the books. It's the one place the interface gets expressive; everything else stays disciplined and quiet. Tapping a bead jumps to that transaction. Respect prefers-reduced-motion — the bead-appear animation should be brief and skippable.

6. Copy & Interaction Principles

Buttons name the action: "Save Transaction," never "Submit"

Errors are specific: "Amount can't be zero — enter how much was received," never "Invalid input"

Empty states invite action: "No transactions yet today — tap + to record your first one"

Success keeps the same verb through the flow: "Save Transaction" → toast says "Transaction saved"

Every currency figure: IBM Plex Mono, right-aligned, color-coded by sign

7. Accessibility & Responsiveness

Minimum 44px tap targets throughout

Color is never the only signal — pair emerald/rust with icons (▲/▼) for colorblind users

Visible keyboard focus states on all interactive elements

Mobile-first at 375px, scales to tablet (2-column dashboard) and desktop (sidebar nav + wider report tables)

8. Build Priority for Lovable

Tell Lovable to build in this order — this is the core loop the rest of the product depends on:

Dashboard (B) with static/mock data first

Record Transaction (C) wired to update the dashboard live

Transactions List (D)

Reports Centre (E) — start with P&L and Cash Flow only

AI Insight (G) can start as a static card; wire to real logic later

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bizanalys.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a9a3100c-529a-4aa8-b71d-ce166d355a01).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
