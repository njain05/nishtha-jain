/**
 * Side A, as an album. Every fact here comes from the project's README, its
 * live site, or something Nishtha said — nothing is filled in by guesswork.
 * Private repositories are described but never linked.
 */

export type PatternKind =
  | "flow"
  | "radial"
  | "grid"
  | "truchet"
  | "dots"
  | "interference"
  | "skyline"
  // Side B
  | "ocean"
  | "episodes"
  | "stars"
  | "voice"
  | "staff"
  | "aperture";

export interface Track {
  id: string;
  title: string;
  /** The italic line under the title. */
  kind: string;
  year?: number;
  /**
   * The track's light. Always a deep shade: the room stays dark and the
   * colour only tints it while the track plays.
   */
  color: string;
  /** Either a screenshot of the live work, or generated sleeve art. */
  art: { image: string; position?: string } | { pattern: PatternKind };
  blurb: string;
  details: string[];
  stack: string[];
  links: { label: string; href: string }[];
  /** Shown instead of links when the code is private. */
  note?: string;
  /** Words still to come from Nishtha: shown as a prompt, not as copy. */
  draft?: boolean;
}

export const TITLE_TRACK: Track = {
  id: "utilstop",
  title: "UtilStop",
  kind: "Home-services platform · UAE & India",
  year: 2026,
  color: "#7a1f2b",
  art: { image: "/work/utilstop.jpg", position: "left top" },
  blurb:
    "Pick a service, get matched with a professional nearby, and watch them arrive on a map. Twenty-six services across the UAE, with an India toggle at the door.",
  details: [
    "I built the web app end to end: OTP sign-in, the booking engine, Stripe and Razorpay payments, and live GPS tracking for providers — across a 225-file codebase that builds with zero lint errors.",
    "Then I hardened the company's API: encrypted booking IDs, silent token refresh, rate limiting and CORS — and wrote the security research it was measured against.",
  ],
  stack: ["React 19", "Vite", "Zustand", "TanStack Query", "Stripe", "Razorpay", "Google Maps"],
  links: [{ label: "utilstop.com", href: "https://utilstop.com" }],
  note: "Company codebase",
};

export const TRACKS: Track[] = [
  TITLE_TRACK,
  {
    id: "intelligence-hub",
    title: "Competitor Intelligence Hub",
    kind: "LLM + RAG pricing pipeline",
    year: 2026,
    color: "#8a5a12",
    art: { pattern: "flow" },
    blurb:
      "Watches what competitors charge, remembers every price it has seen, and answers questions about that history in plain English.",
    details: [
      "Five stages in one script — scrape, warehouse, retrieve, analyse, display — run once or on a schedule.",
      "Answers come from recorded history through retrieval, using Llama 3.2 locally with a rule-based fallback, so it still works with no model reachable. Test data can never pass itself off as real prices.",
    ],
    stack: ["Python", "Playwright", "Ollama", "Llama 3.2", "Groq", "RAG", "Streamlit"],
    links: [],
    note: "Company codebase",
  },
  {
    id: "offer-copilot",
    title: "Offer Copilot",
    kind: "AI offer engine · hackathon",
    year: 2026,
    color: "#8c3a22",
    art: { pattern: "radial" },
    blurb:
      "Works out which customer of an online dry-fruit shop should get which offer, and why. AI proposes, rules decide, and the seller has the final say.",
    details: [
      "Every offer — from the rule engine, from Claude, or typed by the seller in plain English, like “15% off almonds for lapsed customers in Ludhiana” — is checked against the shop's rules: discount caps by category, minimum margin, stock, how often one customer can be offered something. It goes through, is lowered to the highest allowed discount, or is blocked with the reason in plain words.",
      "Two Telegram bots share one state: the seller allows or rejects offers on cards, and the customer bot delivers them the moment they are allowed. A dashboard shows customer groups, results and an Ask Copilot chat. Claude's output is treated as untrusted — structured, and checked again before anything reaches a customer. 67 tests.",
    ],
    stack: [
      "Python",
      "Claude (Anthropic SDK)",
      "Telegram Bot API",
      "pandas",
      "pytest",
      "Render",
    ],
    links: [
      { label: "Customer bot", href: "https://t.me/perofferengine_Bot" },
      { label: "Dashboard", href: "https://offer-copilot-j0h5.onrender.com" },
      { label: "GitHub", href: "https://github.com/njain05/hackathon2-offer-copilot" },
    ],
    note: "Free hosting — the first visit can take half a minute",
  },
  {
    id: "timetable",
    title: "College Timetable",
    kind: "Constraint solving · J-PAL hackathon",
    year: 2026,
    color: "#1f3d66",
    art: { image: "/work/college-timetable.jpg", position: "left top" },
    blurb:
      "One place for a whole college: the Dean's office generates a clash-free timetable in minutes, and everyone — HODs, teachers, students, clubs — signs in to see only their own pages.",
    details: [
      "Google OR-Tools (CP-SAT) places every class so no teacher, section or room is ever double-booked, and a separate checker that shares no code with the solver verifies it: “Verified: 0 clashes”. When something can't fit, it says exactly what is short and how to fix it.",
      "Nothing about days, periods, breaks or rooms is hard-coded, so it works for any college. Departments approve their own data, teachers ask for leave and get a ranked list of substitutes, clubs book halls with digital approval, and an Ask the timetable chat — Claude with six tools over the real timetable — answers “Where is my next class?”. Built for the Punjab Jobs AI Bootcamp hackathon (J-PAL South Asia).",
    ],
    stack: [
      "Next.js",
      "FastAPI",
      "OR-Tools CP-SAT",
      "PostgreSQL",
      "Claude",
      "Vercel",
      "Render",
    ],
    links: [
      { label: "Live", href: "https://college-timetable-teal.vercel.app" },
      { label: "GitHub", href: "https://github.com/njain05/hackathon_1" },
    ],
    note: "Free hosting — the first visit can take a minute",
  },
  {
    id: "idea-critic",
    title: "AI Project Idea Critic",
    kind: "A skill for Claude",
    year: 2026,
    color: "#4b2a73",
    art: { pattern: "truchet" },
    blurb:
      "Scores a project idea against six criteria and says plainly whether it's worth building — then hands back a stronger version of it.",
    details: [
      "A Claude Skill: problem, AI necessity, originality, feasibility, data availability and portfolio value, a verdict of Weak, Promising or Strong, and what would have to be true for the idea to work.",
    ],
    stack: ["Claude Skills", "Prompt design", "Rubric design"],
    links: [{ label: "GitHub", href: "https://github.com/njain05/claude-skill-idea-critic" }],
  },
  {
    id: "mittal-sweets",
    title: "Mittal Sweets",
    kind: "Weather-priced storefront",
    year: 2026,
    color: "#1d5a40",
    art: { image: "/work/mittal-sweets.jpg" },
    blurb:
      "Seven branches across five timezones, with prices that move with each branch's weather — and never past closing time.",
    details: [
      "It works out how big a discount is still worth giving before stock spoils, using the forecast from Open-Meteo, which needs no API key.",
    ],
    stack: ["JavaScript", "Open-Meteo"],
    links: [
      { label: "Live", href: "https://mittal-sweets-weather.vercel.app" },
      { label: "GitHub", href: "https://github.com/njain05/mittal-sweets-weather" },
    ],
  },
  {
    id: "kkknitwear",
    title: "K.K Knitwear Club",
    kind: "B2B fabric catalogue · client work",
    year: 2026,
    color: "#263a8a",
    art: { image: "/work/kkknitwear.jpg" },
    blurb:
      "A catalogue for a Ludhiana knitwear business founded in 1990, replacing a dated IndiaMART listing: 17 fabric categories, 114 recovered photographs, quotes over WhatsApp.",
    details: [
      "No cart and no prices on purpose — wholesale doesn't work that way. Buyers build a quote basket and send it on WhatsApp or by email.",
    ],
    stack: ["Next.js 16", "Tailwind v4", "TypeScript", "sharp"],
    links: [
      { label: "Live", href: "https://kkknitwear.vercel.app" },
      { label: "GitHub", href: "https://github.com/njain05/kkknitwear" },
    ],
  },
  {
    id: "panwar",
    title: "Panwar Knitwear",
    kind: "Manufacturer homepage · client work",
    year: 2026,
    color: "#4a1f6b",
    art: { image: "/work/panwar.jpg" },
    blurb:
      "No JavaScript in the browser except the call and WhatsApp buttons, so it loads instantly on a bad connection — which was the whole brief.",
    details: ["A static Astro site with self-hosted fonts, aimed at bulk wholesale buyers."],
    stack: ["Astro 5", "Tailwind v4"],
    links: [
      { label: "Live", href: "https://panwar-knitwear-kohl.vercel.app" },
      { label: "GitHub", href: "https://github.com/njain05/panwar-knitwear" },
    ],
  },
  {
    id: "shri-guruji",
    title: "Shri Guru Ji Dry Fruits",
    kind: "E-commerce storefront",
    year: 2026,
    color: "#7a5520",
    art: { image: "/work/shri-guruji.jpg" },
    blurb:
      "Sixteen products with search and sort, UPI QR codes for GPay, PhonePe and Paytm, and a checkout that hands the order to WhatsApp.",
    details: ["Static and free to host, with the visual identity designed from scratch."],
    stack: ["React 18", "Vite", "Supabase"],
    links: [
      { label: "Live", href: "https://shriguruji-dryfruits.vercel.app" },
      { label: "GitHub", href: "https://github.com/njain05/shri-guruji-website" },
    ],
  },
  {
    id: "crumb-and-co",
    title: "Crumb & Co.",
    kind: "Bakery landing page",
    year: 2026,
    color: "#8a4a22",
    art: { image: "/work/crumb-and-co.jpg" },
    blurb:
      "No dependencies, hand-drawn SVG illustrations, and every business fact kept in a single config file.",
    details: ["Structured data for local search, light and dark themes, WhatsApp ordering."],
    stack: ["HTML", "CSS", "JavaScript"],
    links: [
      { label: "Live", href: "https://first-project-tan-two.vercel.app" },
      { label: "GitHub", href: "https://github.com/njain05/crumb-and-co" },
    ],
  },
  {
    id: "sportsync",
    title: "SportSync",
    kind: "Major project · GNDEC",
    year: 2026,
    color: "#135a56",
    art: { pattern: "dots" },
    blurb:
      "One record per student across every sports event, QR registration that only works during a set window at the venue — so no proxy sign-ups — and certificates issued automatically.",
    details: [
      "The Sports In-Charge gets an Excel participation report. This repository is the frontend.",
    ],
    stack: ["React", "Tailwind", "QR", "jsPDF"],
    links: [{ label: "GitHub", href: "https://github.com/njain05/sportsync" }],
  },
  {
    id: "astns",
    title: "ASTNS",
    kind: "Minor project · team of three",
    year: 2026,
    color: "#7a2a4f",
    art: { pattern: "interference" },
    blurb:
      "Tells a student's guardian how they're really doing, through a time-limited link — with no account to make.",
    details: [
      "The link's token is the whole security model, so it has a real lifecycle: active, used, expired, revoked. Staff upload marks in bulk and send every notification in one click.",
    ],
    stack: ["React 19", "Express 5", "MongoDB", "Nodemailer"],
    links: [{ label: "GitHub", href: "https://github.com/njain05/minor_project_g14" }],
  },
  {
    id: "real-estate",
    title: "Smart Real Estate Advisor",
    kind: "Gemini-powered web app",
    year: 2025,
    color: "#1d4f7a",
    art: { pattern: "skyline" },
    blurb:
      "Property insights and market trends, with Gemini wired into a Next.js app — my first TypeScript.",
    details: ["Built as the capstone of the GNDEC prompt-engineering programme."],
    stack: ["Next.js", "TypeScript", "Genkit", "Gemini"],
    links: [
      { label: "Live", href: "https://smart-real-estate-advisor.vercel.app" },
      { label: "GitHub", href: "https://github.com/njain05/smart_real_estate_advisor" },
    ],
  },
];

/** The hidden track: where it started. */
export const HIDDEN_TRACK: Track = {
  id: "wave-rider",
  title: "Trigonometric Wave Rider",
  kind: "My first ever game · 2024",
  year: 2024,
  color: "#7a6312",
  art: { image: "/work/wave-rider.jpg" },
  blurb:
    "Inspired by the Chrome dinosaur game: ride a sine wave whose amplitude, frequency and phase change every ten seconds while blocks fall.",
  details: ["HTML, CSS and JavaScript, and a high score saved in the browser."],
  stack: ["HTML", "CSS", "JavaScript", "Canvas"],
  links: [
    {
      label: "Open it full size",
      href: "https://njain05.github.io/trigonometric_wave_rider_game/",
    },
    { label: "GitHub", href: "https://github.com/njain05/trigonometric_wave_rider_game" },
  ],
};
