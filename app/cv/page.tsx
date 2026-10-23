import type { Metadata } from "next";
import { CONTACT } from "@/data/contact";
import { CV_PROJECTS, SKILLS, SUMMARY } from "@/data/cv";
import { POSTS, STUDY } from "@/data/timeline";

export const metadata: Metadata = {
  title: "Curriculum vitae",
  description:
    "The full record — experience, projects, technical skills, education and certifications for Nishtha Jain.",
};

function Head({ n, title, note }: { n: number; title: string; note: string }) {
  return (
    <header className="mb-10 border-umber border-b pb-4">
      <p className="text-[12px] text-amber/80 tabular-nums">{String(n).padStart(2, "0")}</p>
      <h2 className="mt-2 text-[clamp(1.7rem,3.6vw,2.2rem)]">{title}</h2>
      <p className="face-display mt-1 text-[17px] text-sandal italic">{note}</p>
    </header>
  );
}

export default function CvPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20 sm:px-10 sm:py-28">
      <p className="text-ash text-sm">
        <a href="/">← Back to the turntable</a>
      </p>

      <header className="mt-16 border-umber border-b pb-14">
        <h1 className="text-[clamp(2.8rem,8vw,4.4rem)] leading-[0.95]">Nishtha Jain</h1>
        <p className="face-display mt-3 text-[clamp(1.15rem,2.4vw,1.4rem)] text-sandal italic">
          Final-year Computer Science, GNDEC Ludhiana
        </p>
        <p className="mt-8 max-w-[62ch] text-[17px] text-sandal leading-relaxed">{SUMMARY}</p>

        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3 text-sm">
          <span className="text-ash">Ludhiana, Punjab</span>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={CONTACT.github.href}>{CONTACT.github.label}</a>
          <a href={CONTACT.resume.href}>One-page résumé (PDF)</a>
        </div>
      </header>

      <section className="mt-24">
        <Head n={1} title="Experience" note="Where the work happened" />
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
                <h3 className="text-[1.45rem]">{p.role}</h3>
                <p className="face-display mt-0.5 text-[17px] text-amber/90 italic">
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
        <Head n={2} title="Skills" note="What I work with" />
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
        <Head n={3} title="Projects" note="Everything, not just the highlights" />
        <ol className="space-y-14">
          {CV_PROJECTS.map((p) => (
            <li key={p.name}>
              <h3 className="text-[1.45rem]">{p.name}</h3>
              <p className="face-display mt-0.5 text-[16px] text-ash italic">{p.kind}</p>
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
        <Head n={4} title="Education" note="Where I'm studying" />
        <div className="grid gap-3 sm:grid-cols-[11rem_1fr] sm:gap-10">
          <p className="text-ash text-sm tabular-nums sm:pt-1.5">{STUDY.until}</p>
          <div>
            <h3 className="text-[1.45rem]">{STUDY.degree}</h3>
            <p className="face-display mt-0.5 text-[17px] text-amber/90 italic">
              {STUDY.school}
            </p>
            <p className="mt-3 text-sandal text-sm">{STUDY.before}</p>
          </div>
        </div>
      </section>

      <section className="mt-24">
        <Head n={5} title="Certifications" note="Courses finished properly" />
        <ul className="grid gap-3 text-sandal sm:grid-cols-2">
          {STUDY.certifications.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <section className="mt-24">
        <Head n={6} title="Teaching & Leadership" note="The people I've learned alongside" />
        <ul className="space-y-3 text-sandal">
          {STUDY.taught.map((t) => (
            <li key={t} className="max-w-[62ch]">
              {t}
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-28 border-umber border-t pt-10">
        <p className="face-display max-w-[58ch] text-[1.15rem] text-sandal italic">
          Also: R&amp;B, pop, classical and slow EDM; singing; K-pop and K-dramas; the cosmos;
          and photography.
        </p>
        <p className="mt-10 text-ash text-sm">
          <a href="/">← Back to the turntable</a>
        </p>
      </footer>
    </main>
  );
}
