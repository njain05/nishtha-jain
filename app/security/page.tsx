import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API security research",
  description:
    "Nishtha Jain — a written standard for securing a public-facing API, and what it changed on a production stack.",
};

const STANDARD: { n: string; h: string; body: string }[] = [
  {
    n: "01",
    h: "authentication and token lifetime",
    body: "short-lived access tokens against long-lived refresh tokens. the storage comparison is the part that matters: access tokens held in memory, refresh tokens in an httponly, secure, samesite cookie — because anything readable by javascript is readable by injected javascript.",
  },
  {
    n: "02",
    h: "authorisation",
    body: "least privilege as the default, role-based access on every route rather than on the ones that felt sensitive, and guest sessions treated as a real principal with real limits instead of an absence of one.",
  },
  {
    n: "03",
    h: "input validation",
    body: "validated on the server, always — client validation is a courtesy to the user, not a control. parameterised queries for injection, and file uploads checked by content rather than by the extension someone typed.",
  },
  {
    n: "04",
    h: "rate limiting",
    body: "layered: per ip, per account, per route, with the expensive endpoints limited harder than the cheap ones, and enforced at the gateway so it cannot be skipped by reaching the service another way.",
  },
  {
    n: "05",
    h: "transport, cors and headers",
    body: "https everywhere with hsts. cors as an explicit origin whitelist rather than a wildcard. the security header set applied once, centrally, so no route can quietly ship without it.",
  },
  {
    n: "06",
    h: "keys and data exposure",
    body: "api keys rotated and never in the client bundle. responses shaped to what the caller needs, since the cheapest data breach to prevent is the field nobody needed to return.",
  },
  {
    n: "07",
    h: "measured against owasp",
    body: "the whole standard mapped back to the owasp api security top ten so the coverage was checkable rather than asserted.",
  },
];

export default function SecurityPage() {
  return (
    <main
      className="mx-auto max-w-3xl px-6 py-24 sm:px-10"
      style={{ ["--graha" as string]: "#e2542f" }}
    >
      <p className="text-ash text-sm">
        <a href="/#security">back to the sky</a>
      </p>

      <header className="mt-10">
        <p className="deva text-graha text-lg leading-none">मंगल</p>
        <h1 className="mt-4 text-[clamp(2.2rem,6vw,3.157rem)]">
          api security for a public-facing stack
        </h1>
        <p className="lede mt-6 max-w-[52ch]">
          written july 2026, seventeen pages. part one sets the standard. part two measured the
          system we were actually shipping against it.
        </p>
      </header>

      <hr className="rule mt-14" />

      <section className="mt-14">
        <h2 className="text-2xl">part one — the standard</h2>
        <ol className="mt-10 space-y-10">
          {STANDARD.map((s) => (
            <li key={s.n} className="grid gap-3 sm:grid-cols-[3rem_1fr] sm:gap-8">
              <p className="text-ash text-sm tabular-nums sm:pt-1">{s.n}</p>
              <div>
                <h3 className="text-lg">{s.h}</h3>
                <p className="mt-2 text-sandal">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <hr className="rule mt-16" />

      <section className="mt-14">
        <h2 className="text-2xl">part two — what it changed</h2>
        <div className="prose-measure mt-6 space-y-4 text-sandal">
          <p>
            the second half audited a live production stack line by line against part one,
            graded the gaps, and ordered them. it is not reproduced here: it names real
            weaknesses in a system that is still serving real customers, and a portfolio is a
            public document.
          </p>
          <p>
            what it produced is public enough. a security-hardening branch on the production api
            replaced raw decrypt calls with a wrapper that fails closed rather than returning
            garbage, and untracked environment files that should never have been committed in
            the first place.
          </p>
          <p>
            the part worth keeping from the exercise: writing the standard first, before looking
            at our own code, meant the audit could not quietly lower the bar to whatever we
            happened to already be doing.
          </p>
        </div>
      </section>

      <p className="mt-20 text-ash text-sm">
        <a href="/#security">back to the sky</a>
      </p>
    </main>
  );
}
