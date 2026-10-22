/** Ketu — what is set down. Everything else, listed plainly. */

export interface ArchiveItem {
  title: string;
  kind: string;
  stack: string;
  href?: string;
  note?: string;
}

export const ARCHIVE: ArchiveItem[] = [
  {
    title: "k.k knitwear club",
    kind: "b2b fabric catalogue · client work, ludhiana",
    stack: "next 16 · tailwind v4 · static export",
    note: "17 fabric categories, 114 product photographs recovered and re-shot, and a quote basket that sends the request over whatsapp because that is where the buyers already are. no cart, no prices — wholesale does not work that way.",
  },
  {
    title: "panwar knitwear",
    kind: "manufacturer homepage · client work, ludhiana",
    stack: "astro 5 · tailwind v4",
    note: "zero client-side javascript except the call and whatsapp links. it loads instantly on a bad connection, which is the whole brief.",
  },
  {
    title: "shri guru ji dry fruits",
    kind: "e-commerce storefront",
    stack: "react 18 · vite 6",
    note: "sixteen products, search and sort, a free-delivery threshold, upi qr codes for gpay, phonepe and paytm, and a checkout that hands the order to whatsapp. visual identity designed from nothing.",
  },
  {
    title: "crumb & co.",
    kind: "bakery landing page",
    stack: "html · css · javascript, no dependencies",
    note: "hand-drawn svg illustrations, every business fact in one config file, structured data for local search.",
  },
  {
    title: "smart real estate advisor",
    kind: "capstone, prompt engineering programme",
    stack: "python · predictive analytics",
    note: "property insight and market trend analysis.",
  },
  {
    title: "dynamic pricing for urban parking",
    kind: "ai/ml capstone",
    stack: "python",
    note: "pricing against real-time demand and occupancy.",
  },
  {
    title: "hosiery ledger clean-up",
    kind: "data analysis",
    stack: "pandas · matplotlib",
    note: "102 messy rows into 100 clean ones: day-first dates, currency junk stripped, 44 spellings of twelve shop names resolved to twelve. ₹2.17l of ₹6.99l billed was outstanding — 31.1% unpaid.",
  },
  {
    title: "pac-man agent",
    kind: "search and pathfinding",
    stack: "python",
    note: "a* and heuristic search in a single-player environment.",
  },
];
