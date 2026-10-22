export interface Post {
  role: string;
  org: string;
  where?: string;
  from: string;
  to: string;
  lines: string[];
}

/** Shani — time, and what it takes to keep showing up. Newest first. */
export const POSTS: Post[] = [
  {
    role: "generative ai / ml intern",
    org: "utilstop",
    where: "remote",
    from: "mar 2026",
    to: "present",
    lines: [
      "built the competitor intelligence hub end to end — scraper, warehouse, retrieval, model, dashboard.",
      "built and shipped the consumer web platform: otp auth, booking engine, payments, live tracking.",
      "engineered the production security layer, then wrote the research it was measured against.",
    ],
  },
  {
    role: "ai–ml trainee",
    org: "sensation software solutions",
    where: "remote",
    from: "jun 2025",
    to: "jul 2025",
    lines: ["120+ hours of structured training. graduated a+, top of the cohort."],
  },
  {
    role: "prompt engineering — institutional training",
    org: "testing and consultancy cell, gndec",
    from: "jun 2025",
    to: "jul 2025",
    lines: ["capstone: the smart real estate advisor. certified on completion."],
  },
  {
    role: "machine learning intern",
    org: "cognifyz technologies",
    where: "remote",
    from: "may 2025",
    to: "jun 2025",
    lines: [
      "supervised models over 5,000+ real records.",
      "preprocessing and feature engineering lifted performance by roughly 15%.",
    ],
  },
  {
    role: "senior technical executive, then creative head",
    org: "causmic club, gndec",
    from: "aug 2023",
    to: "present",
    lines: [
      "led 5+ technical initiatives from planning to execution.",
      "mentored 30+ students in programming and ai fundamentals.",
      "promoted on execution quality.",
    ],
  },
];

/** Brihaspati — the teacher, and the taught. */
export const STUDY = {
  degree: "b.tech, computer science engineering",
  school: "guru nanak dev engineering college, ludhiana",
  until: "expected 2027",
  before: "bcm school, ludhiana — cbse, 2021 and 2023",
  certifications: [
    "prompt design in vertex ai — google cloud",
    "prompt engineering — institutional training, gndec",
    "neural networks for computer vision & nlp — nptel, elite silver",
    "data analytics job simulation — deloitte australia",
    "python — infosys",
  ],
  taught: [
    "900+ students taught ai–ml fundamentals during college induction",
    "30+ mentored one to one",
    "nss executive member — led a 4-person team for game fest 2.0, proceeds to an orphanage",
    "letters of appreciation from the principal, 2025 and 2026",
    "top 10 in a college hackathon",
  ],
};
