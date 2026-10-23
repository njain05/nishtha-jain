import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API security research",
  description:
    "Nishtha Jain — a written standard for securing a public-facing API, and what it changed on a production stack.",
};

const STANDARD: { n: string; h: string; body: string }[] = [
  {
    n: "01",
    h: "Authentication and token lifetime",
    body: "Short-lived access tokens against long-lived refresh tokens. The storage comparison is the part that matters: access tokens held in memory, refresh tokens in an HttpOnly, Secure, SameSite cookie — because anything readable by JavaScript is readable by injected JavaScript.",
  },
  {
    n: "02",
    h: "Authorisation",
    body: "Least privilege as the default, role-based access on every route rather than on the ones that felt sensitive, and guest sessions treated as a real principal with real limits instead of an absence of one.",
  },
  {
    n: "03",
    h: "Input validation",
    body: "Validated on the server, always — client validation is a courtesy to the user, not a control. Parameterised queries against injection, and file uploads checked by their content rather than by the extension someone typed.",
  },
  {
    n: "04",
    h: "Rate limiting",
    body: "Layered: per IP, per account, per route, with the expensive endpoints limited harder than the cheap ones, and enforced at the gateway so it cannot be skipped by reaching the service another way.",
  },
  {
    n: "05",
    h: "Transport, CORS and headers",
    body: "HTTPS everywhere with HSTS. CORS as an explicit origin allow-list rather than a wildcard. The security header set applied once, centrally, so no route can quietly ship without it.",
  },
  {
    n: "06",
    h: "Keys and data exposure",
    body: "API keys rotated and never in the client bundle. Responses shaped to what the caller needs, since the cheapest data breach to prevent is the field nobody needed to return.",
  },
  {
    n: "07",
    h: "Measured against OWASP",
    body: "The whole standard mapped back to the OWASP API Security Top 10, so the coverage was checkable rather than asserted.",
  },
];

export default function SecurityPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 sm:px-10">
      <p className="text-ash text-sm">
        <a href="/">← Back to the turntable</a>
      </p>

      <header className="mt-14">
        <h1 className="text-[clamp(2.4rem,6vw,3.4rem)]">
          API Security for a Public-Facing Stack
        </h1>
        <p className="face-display mt-4 max-w-[52ch] text-[1.3rem] text-sandal italic leading-snug">
          Written in July 2026, seventeen pages. Part one sets the standard; part two measured
          the system we were actually shipping against it.
        </p>
      </header>

      <hr className="rule mt-14" />

      <section className="mt-14">
        <h2 className="text-[1.9rem]">Part One — The Standard</h2>
        <ol className="mt-10 space-y-10">
          {STANDARD.map((s) => (
            <li key={s.n} className="grid gap-3 sm:grid-cols-[3rem_1fr] sm:gap-8">
              <p className="text-ash text-sm tabular-nums sm:pt-1.5">{s.n}</p>
              <div>
                <h3 className="text-[1.35rem]">{s.h}</h3>
                <p className="mt-2 text-sandal">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <hr className="rule mt-16" />

      <section className="mt-14">
        <h2 className="text-[1.9rem]">Part Two — What It Changed</h2>
        <div className="prose-measure mt-6 space-y-4 text-sandal">
          <p>
            The second half audited a live production stack line by line against part one,
            graded the gaps, and put them in order. It isn&rsquo;t reproduced here: it names
            real weaknesses in a system that still serves real customers, and a portfolio is a
            public document.
          </p>
          <p>
            What it produced is public enough. A security-hardening branch on the production API
            replaced raw decrypt calls with a wrapper that fails closed instead of returning
            garbage, and untracked environment files that should never have been committed.
          </p>
          <p className="face-display text-[1.2rem] text-ivory italic">
            The part worth keeping: writing the standard first, before looking at our own code,
            meant the audit couldn&rsquo;t quietly lower the bar to whatever we were already
            doing.
          </p>
        </div>
      </section>

      <p className="mt-20 text-ash text-sm">
        <a href="/">← Back to the turntable</a>
      </p>
    </main>
  );
}
