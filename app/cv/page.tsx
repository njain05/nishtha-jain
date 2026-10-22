import type { Metadata } from "next";
import { CONTACT } from "@/data/contact";
import { CV_PROJECTS, SKILLS, SUMMARY } from "@/data/cv";
import { POSTS, STUDY } from "@/data/timeline";

export const metadata: Metadata = {
  title: "Curriculum vitae",
  description:
    "The full record — experience, projects, technical skills, education and certifications for Nishtha Jain.",
};

/** Section heads carry a Devanagari numeral, which is the only ornament here. */
const DEVA_NUM = ["०", "१", "२", "३", "४", "५", "६"];

function Head({ n, children }: { n: number; children: string }) {
  return (
    <header className="mb-10 flex items-baseline gap-5 border-umber border-b pb-4">
      <span className="deva text-graha text-lg leading-none">{DEVA_NUM[n]}</span>
      <h2 className="font-display text-[clamp(1.5rem,3.4vw,1.9rem)] lowercase">{children}</h2>
    </header>
  );
}

export default function CvPage() {
  return (
    <main
      className="mx-auto max-w-4xl px-6 py-20 sm:px-10 sm:py-28"
      style={{ ["--graha" as string]: "#e8a33d" }}
    >
      <p className="text-ash text-sm">
        <a href="/">← back to the sky</a>
      </p>

      {/* masthead */}
      <header className="mt-16 border-umber border-b pb-14">
        <p className="deva text-graha text-xl leading-none">निष्ठा</p>
        <h1 className="mt-5 font-display text-[clamp(2.6rem,8vw,4.2rem)] leading-[0.95] lowercase">
          nishtha jain
        </h1>
        <p className="mt-6 max-w-[62ch] text-lg text-sandal leading-relaxed">{SUMMARY}</p>

        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3 text-sm">
          <span className="text-ash">ludhiana, punjab</span>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={CONTACT.github.href}>{CONTACT.github.label}</a>
          <a href={CONTACT.resume.href}>one-page résumé, pdf</a>
        </div>
      </header>

      <section className="mt-24">
        <Head n={1}>experience</Head>
        <ol className="space-y-14">
          {POSTS.map((p) => (
            <li
              key={`${p.org}-${p.from}`}
              className="grid gap-3 sm:grid-cols-[11rem_1fr] sm:gap-10"
            >
              <p className="text-ash text-sm tabular-nums sm:pt-1.5">
                {p.from}
                <span className="mx-1.5 text-umber">—</span>
                {p.to}
              </p>
              <div>
                <h3 className="font-display text-xl">{p.role}</h3>
                <p className="mt-1 text-graha">
                  {p.org}
                  {p.where ? <span className="text-ash"> · {p.where}</span> : null}
                </p>
                <ul className="mt-4 space-y-2 text-sandal">
                  {p.lines.map((l) => (
                    <li key={l} className="max-w-[62ch]">
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-24">
        <Head n={2}>what she works with</Head>
        <dl className="space-y-5">
          {SKILLS.map((s) => (
            <div key={s.group} className="grid gap-1 sm:grid-cols-[11rem_1fr] sm:gap-10">
              <dt className="text-ivory text-sm sm:pt-0.5">{s.group}</dt>
              <dd className="max-w-[62ch] text-sandal">{s.items}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-24">
        <Head n={3}>projects</Head>
        <ol className="space-y-14">
          {CV_PROJECTS.map((p) => (
            <li key={p.name}>
              <h3 className="font-display text-xl">{p.name}</h3>
              <p className="mt-1 text-ash text-sm">{p.kind}</p>
              <ul className="mt-4 space-y-2 text-sandal">
                {p.bullets.map((b) => (
                  <li key={b} className="max-w-[68ch]">
                    {b}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-24">
        <Head n={4}>study</Head>
        <div className="grid gap-3 sm:grid-cols-[11rem_1fr] sm:gap-10">
          <p className="text-ash text-sm tabular-nums sm:pt-1.5">{STUDY.until}</p>
          <div>
            <h3 className="font-display text-xl">{STUDY.degree}</h3>
            <p className="mt-1 text-graha">{STUDY.school}</p>
            <p className="mt-3 text-sandal text-sm">{STUDY.before}</p>
          </div>
        </div>
      </section>

      <section className="mt-24">
        <Head n={5}>certifications</Head>
        <ul className="grid gap-3 text-sandal sm:grid-cols-2">
          {STUDY.certifications.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <section className="mt-24">
        <Head n={6}>and the taught</Head>
        <ul className="space-y-3 text-sandal">
          {STUDY.taught.map((t) => (
            <li key={t} className="max-w-[62ch]">
              {t}
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-28 border-umber border-t pt-10">
        <p className="max-w-[58ch] text-sandal">
          artificial intelligence and machine learning. data-driven systems and product
          building. music. the cosmos, hindu mythology, and modern history.
        </p>
        <p className="mt-10 text-ash text-sm">
          <a href="/">← back to the sky</a>
        </p>
      </footer>
    </main>
  );
}
