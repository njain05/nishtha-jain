export interface Link {
  label: string;
  href: string;
}

export interface Diagram {
  kind: "pipeline" | "states" | "layers";
  caption: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  kind: string;
  /** One line. What it is, in words a non-engineer would follow. */
  blurb: string;
  body: string[];
  /** How the thing actually works, drawn rather than listed. */
  diagram: Diagram;
  /** Four numbers worth reading as figures. */
  stats: { value: string; label: string }[];
  stack: string[];
  links?: Link[];
  /** Shown when there is nothing public to link to. */
  access?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "utilstop-platform",
    title: "utilstop",
    kind: "production web platform · uae and india",
    blurb:
      "a home-services booking platform — you pick a service, it finds someone near you, and you watch them arrive on a map.",
    body: [
      "the parts that were hard were not the parts that show. a booking has to survive a dropped connection on a phone in a lift, a payment that succeeds on stripe's side and fails on ours, and a provider whose gps drifts a hundred metres every thirty seconds.",
      "so the booking id is aes-encrypted before it ever reaches a url, the access token refreshes silently in the background rather than logging anyone out mid-flow, and the whole ui runs against a mock api behind one environment flag — which meant the frontend never blocked on the backend being ready.",
    ],
    stack: [
      "react 19",
      "vite",
      "tailwind",
      "zustand",
      "tanstack query",
      "react hook form + zod",
      "stripe",
      "razorpay",
      "google maps",
      "playwright",
    ],
    diagram: {
      kind: "pipeline",
      caption: "one booking, end to end",
      items: ["request", "otp", "match", "pay", "track", "done"],
    },
    stats: [
      { value: "225+", label: "files, zero lint errors" },
      { value: "0", label: "passwords stored" },
      { value: "2", label: "countries live" },
      { value: "27", label: "days of build diary" },
    ],
    access: "company codebase",
  },
  {
    id: "competitor-intelligence",
    title: "competitor intelligence hub",
    kind: "llm + rag data pipeline",
    blurb:
      "watches what competitors charge, remembers every price it has ever seen, and answers questions about the history in plain english.",
    body: [
      "five stages, one script: scrape, warehouse, index, analyse, display. it runs once by hand or on a cron, and each stage can be re-run alone when only one of them is wrong.",
      "the retrieval layer rebuilds its chunks from warehouse history rather than from the live page, so a question about a price three months ago is answered from what was actually recorded then. the language model is llama 3.2 running locally through ollama, with groq in front of it for speed and a rule-based path underneath — if no model is reachable at all, the pipeline still produces recommendations instead of failing.",
      "synthetic competitor data exists for testing, and it requires an explicit opt-in flag. it is never allowed to surface as though it were real pricing. that was a deliberate choice: a pricing tool that quietly invents numbers is worse than no pricing tool.",
    ],
    stack: [
      "python",
      "playwright",
      "beautifulsoup",
      "postgres / sqlite / mysql",
      "ollama · llama 3.2",
      "groq",
      "scikit-learn",
      "streamlit",
      "plotly",
    ],
    diagram: {
      kind: "pipeline",
      caption: "five stages, one script",
      items: ["scrape", "warehouse", "index", "analyse", "dashboard"],
    },
    stats: [
      { value: "5", label: "stages, each re-runnable alone" },
      { value: "3", label: "warehouse backends" },
      { value: "2", label: "models, plus a fallback" },
      { value: "0", label: "invented prices" },
    ],
    access: "company codebase",
  },
  {
    id: "astns",
    title: "astns",
    kind: "academic status transparency notification system · minor project, team of 3",
    blurb:
      "tells a student's guardian how they are actually doing — without making the guardian create an account.",
    body: [
      "the problem with parent portals is that nobody logs into them. so there is no login. the guardian gets an email with a link containing a cryptographically generated, time-limited token, and that link opens a read-only dashboard of their student's marks. no password, no account, no app.",
      "which makes the token the entire security model, so it gets a real lifecycle: active, used, expired, revoked, with configurable expiry and manual revocation from the admin side. on the other end, staff drag a csv or excel file in, see a live preview validated against the schema before anything is written, and dispatch the whole batch in one click.",
    ],
    stack: [
      "react 19",
      "vite",
      "tailwind",
      "express 5",
      "mongodb atlas",
      "mongoose",
      "nodemailer",
      "vercel",
    ],
    diagram: {
      kind: "states",
      caption: "the token is the whole security model",
      items: ["active", "used", "expired", "revoked"],
    },
    stats: [
      { value: "0", label: "accounts a guardian must make" },
      { value: "4", label: "token states, all reversible by staff" },
      { value: "1", label: "click to dispatch a whole batch" },
      { value: "3", label: "people, weekly sprints" },
    ],
  },
];

/** Mangala — the warrior. What gets defended. */
export const SECURITY = {
  title: "api security for a public-facing stack",
  kind: "research document, then an audit of a live system against it",
  blurb:
    "wrote the standard first, then held a production codebase up against it and wrote down where it fell short.",
  body: [
    "part one is what the practice should be: token lifetimes, a storage-safety comparison that lands on in-memory access tokens with httponly, secure, samesite refresh cookies, role-based access and guest sessions, input validation, injection and file-upload defence, layered rate limiting, cors whitelisting, security headers, and api-key handling.",
    "part two is the uncomfortable half — the same stack we were shipping, measured against part one, with the gaps named. the follow-on work was a security-hardening branch: replacing raw decrypt calls with a wrapper that fails safely, and untracking environment files that should never have been committed.",
  ],
  diagram: {
    kind: "layers" as const,
    caption: "defence, outermost first",
    items: ["transport", "cors", "rate limiting", "authn", "authz", "validation", "data"],
  },
  stats: [
    { value: "17", label: "pages, july 2026" },
    { value: "10", label: "owasp api risks covered" },
    { value: "2", label: "parts — the standard, then us" },
  ],
  href: "/security",
};
