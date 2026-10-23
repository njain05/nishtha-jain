export interface Post {
  role: string;
  org: string;
  where?: string;
  from: string;
  /** Omitted for a role that hasn't started yet. */
  to?: string;
  lines: string[];
}

/** Experience, newest first. */
export const POSTS: Post[] = [
  {
    role: "AI Native Software Engineer Intern",
    org: "EPAM India",
    from: "Incoming",
    lines: ["Placement offer, 2026."],
  },
  {
    role: "Generative AI / ML Intern",
    org: "UtilStop",
    where: "Remote",
    from: "Mar 2026",
    to: "Present",
    lines: [
      "Built the Competitor Intelligence Hub end to end — scraper, warehouse, retrieval, model and dashboard.",
      "Built and shipped the consumer web platform: OTP sign-in, booking engine, payments and live tracking.",
      "Engineered the production security layer, then wrote the research it was measured against.",
    ],
  },
  {
    role: "AI–ML Trainee",
    org: "Sensation Software Solutions",
    where: "Remote",
    from: "Jun 2025",
    to: "Jul 2025",
    lines: ["120+ hours of structured training. Graduated A+, top of the cohort."],
  },
  {
    role: "Prompt Engineering — Institutional Training",
    org: "Testing and Consultancy Cell, GNDEC",
    from: "Jun 2025",
    to: "Jul 2025",
    lines: ["Capstone: the Smart Real Estate Advisor. Certified on completion."],
  },
  {
    role: "Machine Learning Intern",
    org: "Cognifyz Technologies",
    where: "Remote",
    from: "May 2025",
    to: "Jun 2025",
    lines: [
      "Supervised models over 5,000+ real records.",
      "Preprocessing and feature engineering lifted performance by roughly 15%.",
    ],
  },
  {
    role: "Senior Technical Executive, then Creative Head",
    org: "Causmic Club, GNDEC",
    from: "Aug 2023",
    to: "Present",
    lines: [
      "Led 5+ technical initiatives from planning to execution.",
      "Mentored 30+ students in programming and AI fundamentals.",
      "Promoted on the quality of the work.",
    ],
  },
];

/** Education, certifications, and the people taught along the way. */
export const STUDY = {
  degree: "B.Tech, Computer Science Engineering",
  school: "Guru Nanak Dev Engineering College, Ludhiana",
  until: "Expected 2027",
  before: "BCM School, Ludhiana — CBSE, 2021 and 2023",
  certifications: [
    "Prompt Design in Vertex AI — Google Cloud",
    "Prompt Engineering — Institutional Training, GNDEC",
    "Neural Networks for Computer Vision & NLP — NPTEL, Elite Silver",
    "Data Analytics Job Simulation — Deloitte Australia",
    "Python — Infosys",
  ],
  taught: [
    "Taught AI–ML fundamentals to 900+ students during college induction",
    "Mentored 30+ students one to one",
    "NSS Executive Member — led a four-person team for Game Fest 2.0, proceeds to an orphanage",
    "Letters of appreciation from the Principal, 2025 and 2026",
    "Top 10 in a college hackathon",
  ],
};
