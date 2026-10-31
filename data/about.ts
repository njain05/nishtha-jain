/**
 * Who Nishtha is, how they got here, and what they work with — for Side A.
 * Every fact comes from the CV (data/cv.ts, data/timeline.ts) or their own
 * GitHub history; the wording is a draft for them to change.
 */

/**
 * The paragraph that lights up as you read it. *Asterisks* set a phrase in
 * the display italic.
 */
export const ABOUT =
  "I'm Nishtha, a final-year computer science student at GNDEC in Ludhiana. I build software for *real people* — a home-services platform running across the UAE, AI pipelines that answer from real data, and websites for local businesses. I fell for computers at 13, and learned to code on my first laptop during lockdown. Scratch and SQL then; payments, live tracking and the security underneath them now. *Next: EPAM India, offer letter pending.*";

export const FACTS: { big: string; small: string }[] = [
  { big: "900+", small: "students taught AI–ML fundamentals at college induction" },
  { big: "A+", small: "top of the cohort in Sensation Software's AI–ML training" },
  {
    big: "Creative Head",
    small: "Causmic Club, GNDEC — promoted from Senior Technical Executive",
  },
  { big: "Top 10", small: "in a college hackathon" },
];

/** Skills, grouped the way they are cut into the record: one group to a groove. */
export const CREDITS: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "C++", "C", "SQL"] },
  {
    group: "AI & LLMs",
    items: [
      "Large language models",
      "Prompt & context engineering",
      "RAG",
      "NLP",
      "LangChain",
      "Vertex AI",
      "Llama 3.2 via Ollama",
      "Groq",
      "Anthropic SDK",
      "Claude Skills",
    ],
  },
  {
    group: "Machine learning & data",
    items: [
      "Supervised learning",
      "Feature engineering",
      "Model evaluation",
      "Forecasting",
      "scikit-learn",
      "pandas",
      "NumPy",
      "Matplotlib",
      "Plotly",
      "Tableau",
      "Jupyter",
    ],
  },
  {
    group: "Web & backend",
    items: [
      "React 19",
      "Next.js 16",
      "Astro 5",
      "Vite",
      "Node.js",
      "Express 5",
      "FastAPI",
      "Flask",
      "REST APIs",
      "Streamlit",
    ],
  },
  {
    group: "Frontend",
    items: [
      "Tailwind CSS v4",
      "Zustand",
      "TanStack Query",
      "React Hook Form",
      "Zod",
      "HTML",
      "CSS",
    ],
  },
  {
    group: "Databases & cloud",
    items: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "SQLite",
      "Google Cloud",
      "Vercel",
      "Docker",
      "Git",
      "CI/CD",
      "Playwright",
    ],
  },
  {
    group: "Security & payments",
    items: [
      "AES encryption",
      "JWT silent refresh",
      "bcrypt",
      "Rate limiting",
      "CORS",
      "OAuth",
      "Stripe",
      "Razorpay",
      "UPI",
      "OTP sign-in",
    ],
  },
  {
    group: "Fundamentals",
    items: [
      "Object-oriented programming",
      "Data structures & algorithms",
      "DBMS",
      "Computer networks",
    ],
  },
];

/**
 * The journey as a discography, from school to now. The school years are in
 * Nishtha's own words (23 Oct 2026). `commits` are their own commits on
 * GitHub that year (counted 23 Oct 2026); school came before GitHub.
 */
export const RELEASES: {
  year: string;
  /** Where they were: shown above the year. */
  stage?: string;
  title: string;
  lines: string[];
  commits?: number;
  note?: string;
  /** Not out yet. */
  upcoming?: boolean;
}[] = [
  {
    year: "2019",
    stage: "BCM School · 9th class",
    title: "The first spark",
    lines: [
      "I got interested in computers and chose Information Technology — that's where my love for coding began.",
    ],
  },
  {
    year: "2020",
    stage: "BCM School · 10th class",
    title: "Lockdown, and a laptop",
    lines: [
      "Lockdown moved everything online, and I got my first laptop.",
      "Learned to code: the fundamentals in Scratch, then basic SQL.",
    ],
  },
  {
    year: "2021",
    stage: "BCM School · 11th class",
    title: "Python",
    lines: ["Chose Computer Science, and started writing Python."],
  },
  {
    year: "2023",
    stage: "BCM School → GNDEC",
    title: "Debut",
    lines: [
      "Finished school at BCM School, Ludhiana, in March.",
      "Started B.Tech Computer Science at GNDEC, Ludhiana, and began learning web development.",
      "Made my first portfolio by hand, in plain HTML.",
      "Joined Causmic Club as Senior Technical Executive.",
    ],
    commits: 8,
  },
  {
    year: "2024",
    stage: "GNDEC",
    title: "First game",
    lines: [
      "Trigonometric Wave Rider, after the Chrome dinosaur game — the hidden track, playable above.",
    ],
    commits: 5,
  },
  {
    year: "2025",
    stage: "GNDEC",
    title: "Making it think",
    lines: [
      "Machine Learning Intern, Cognifyz: models over 5,000+ records, about 15% better after feature engineering.",
      "AI–ML Trainee, Sensation Software: 120+ hours, A+, top of the cohort.",
      "Prompt engineering at GNDEC, and my first TypeScript — the Smart Real Estate Advisor.",
    ],
    commits: 39,
  },
  {
    year: "2026",
    stage: "GNDEC",
    title: "Real work, real people",
    lines: [
      "Generative AI / ML Intern, UtilStop: the web platform, the pricing-intelligence pipeline, the security layer.",
      "ASTNS with my team, websites for local businesses, SportSync, two hackathons.",
    ],
    commits: 229,
    note: "141 of them in July",
  },
  {
    year: "Next",
    stage: "Selected",
    title: "EPAM India",
    upcoming: true,
    lines: [
      "Selected for the AI Native Software Engineer Intern role.",
      "Offer letter pending.",
    ],
  },
];
