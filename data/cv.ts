/** The long version. Facts, not voice — this is the record. */

export const SUMMARY =
  "Computer science engineering undergraduate with hands-on experience across supervised ML, NLP, LLM and agentic systems, and full-stack software engineering. Designs data pipelines, builds and evaluates models, and ships production web applications with authentication, payments and real-time tracking. Has mentored 900+ peers and led technical teams.";

export const SKILLS: { group: string; items: string }[] = [
  { group: "Languages", items: "Python, JavaScript, TypeScript, C++, C, SQL" },
  {
    group: "Fundamentals",
    items: "Object-oriented programming, data structures & algorithms, DBMS, computer networks",
  },
  {
    group: "Machine learning",
    items:
      "Supervised learning, feature engineering, model evaluation (accuracy / precision / recall), predictive modelling, forecasting",
  },
  {
    group: "AI & LLM",
    items:
      "Large language models, prompt and context engineering, retrieval-augmented generation, NLP, LangChain, Vertex AI, Llama 3.2 via Ollama, Groq",
  },
  {
    group: "Web & backend",
    items:
      "React 18/19, Next.js 16, Astro 5, Vite, Node.js, Express 5, Flask, FastAPI, REST API design, JWT authentication, OAuth, CORS, Streamlit",
  },
  {
    group: "Frontend",
    items: "Tailwind CSS v3 and v4, Zustand, TanStack Query, React Hook Form, Zod, HTML5, CSS3",
  },
  { group: "Databases", items: "MySQL, PostgreSQL, MongoDB, SQLite" },
  {
    group: "Cloud & tooling",
    items: "Google Cloud Vertex AI, Vercel, Docker, Git, GitHub, CI/CD, Playwright, Biome",
  },
  {
    group: "Security",
    items: "AES encryption, JWT silent refresh, bcrypt, rate limiting, CORS whitelisting",
  },
  {
    group: "Data & analytics",
    items: "NumPy, pandas, scikit-learn, Matplotlib, Plotly, Tableau, Jupyter",
  },
  {
    group: "Payments & integrations",
    items: "Stripe, Razorpay, UPI, WhatsApp order flows, GPS tracking, OTP authentication",
  },
];

export interface CvProject {
  name: string;
  kind: string;
  bullets: string[];
}

export const CV_PROJECTS: CvProject[] = [
  {
    name: "UtilStop Web Platform",
    kind: "Full-stack production application",
    bullets: [
      "Production web platform for a home-services company operating across the UAE and India.",
      "OTP-based authentication, a full booking engine, Stripe and Razorpay payment integration, and live GPS tracking for service providers.",
      "React 18/19, Tailwind CSS and Zustand for state management; 225+ file codebase with zero lint or build errors.",
      "Production security: AES-encrypted booking IDs, JWT silent refresh, rate limiting and CORS whitelisting.",
    ],
  },
  {
    name: "UtilStop Competitor Intelligence Hub",
    kind: "LLM + RAG data pipeline",
    bullets: [
      "Multi-stage pipeline — scraper, data warehouse, RAG index, LLM analysis and Streamlit dashboard — runnable as a one-shot script or on a cron schedule.",
      "Ingestion with requests and BeautifulSoup, rate limited and robots.txt-respecting; warehouse supports Postgres/SQLite locally and MySQL in dev and prod, selected by environment variable.",
      "RAG engine rebuilds retrieval chunks from historical warehouse data so answers are grounded in recorded pricing rather than the live page.",
      "LLM analysis on Llama 3.2 via local Ollama with an automatic rule-based fallback; scikit-learn short-horizon price forecasting.",
      "Safeguards ensure synthetic competitor data requires an explicit opt-in flag and is never presented as verified live pricing.",
    ],
  },
  {
    name: "Academic Status Transparency Notification System (ASTNS)",
    kind: "Full-stack MERN application — minor project, team of 3",
    bullets: [
      "Automates academic status notifications from engineering colleges to student guardians. React 19, Vite, Tailwind CSS, Express.js 5, MongoDB Atlas.",
      "Passwordless Guardian Portal: read-only academic dashboard reached via a unique, cryptographically generated, time-limited token embedded in an emailed link — no account, no login.",
      "Admin side: session-authenticated dashboard, drag-and-drop bulk CSV/Excel upload with schema validation and live preview, one-click batch dispatch via Nodemailer over Gmail SMTP.",
      "Full token lifecycle management (active / used / expired / revoked) with configurable expiry and manual revocation.",
      "Interactive SGPA trend chart, semester-wise mark breakdowns and detention alerts; nested student/semester/subject modelling in Mongoose with auto-calculated CGPA.",
      "Deployed serverlessly on Vercel; Agile weekly sprints; tested via Postman, manual functional testing and cross-browser checks.",
    ],
  },
  {
    name: "K.K Knitwear Club",
    kind: "B2B fabric catalogue — client project, live",
    bullets: [
      "Replaced a dated IndiaMART listing with a full catalogue site for a Ludhiana knitwear business established in 1990.",
      "17 fabric categories and 114 recovered product photographs; WhatsApp and email quote-basket RFQ flow with no cart or public pricing, matching how wholesale buying actually works.",
      "Next.js 16 App Router with static export, React 19, TypeScript, Tailwind v4, sharp image pipeline, custom SVG fabric-texture generators and a content validation script.",
    ],
  },
  {
    name: "Panwar Knitwear",
    kind: "Manufacturer marketing site — client project",
    bullets: [
      "Homepage for a Ludhiana knitwear manufacturer aimed at bulk wholesale buyers.",
      "Astro 5 with Tailwind v4 and self-hosted variable fonts; zero client-side JavaScript except WhatsApp and click-to-call, so it loads instantly on a weak connection.",
    ],
  },
  {
    name: "Shri Guru Ji Dry Fruits",
    kind: "E-commerce storefront — client project, React + Vite",
    bullets: [
      "Customer-facing storefront: 16-product catalogue with search, category filter and sort; product detail pages with nutrition facts; cart with free-delivery threshold logic.",
      "WhatsApp checkout generating a pre-filled order message, alongside UPI QR code generation for Google Pay, PhonePe and Paytm.",
      "Full visual identity designed from scratch — palette, Playfair Display and Inter typography, responsive layout. Entirely static and free to host.",
    ],
  },
  {
    name: "Smart Real Estate Advisor",
    kind: "Capstone for the GNDEC prompt engineering programme",
    bullets: [
      "AI-powered web application providing property insights and market trend analysis using predictive analytics.",
    ],
  },
  {
    name: "Dynamic Pricing for Urban Parking Lots",
    kind: "AI/ML capstone",
    bullets: [
      "Dynamic pricing model driven by real-time demand patterns and occupancy data, simulating real-world pricing optimisation.",
    ],
  },
  {
    name: "Pac-Man AI Agent",
    kind: "Search and pathfinding",
    bullets: [
      "Heuristic search including A* for intelligent navigation in a single-player game environment.",
    ],
  },
  {
    name: "Food Order Management System",
    kind: "Python + MySQL backend",
    bullets: ["Python backend integrated with MySQL for order processing and data handling."],
  },
];
