import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { tileBg } from "@/components/tiles";
import { dictionaries, isLocale } from "@/content/i18n";
import type { Project } from "@/content/projects";
import { site } from "@/content/site";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = dictionaries[lang].built;
  return {
    title: `${t.metaTitle} | ${site.name}`,
    description: t.metaDescription,
    alternates: {
      canonical: `/${lang}/how-its-built`,
      languages: { en: "/en/how-its-built", fr: "/fr/how-its-built", "x-default": "/en/how-its-built" },
    },
  };
}

// One colour and a slight tilt per step, like the stickers on the home page.
const look: { color: Project["color"]; r: string }[] = [
  { color: "tangerine", r: "-2deg" },
  { color: "lilac", r: "1.5deg" },
  { color: "mint", r: "-1deg" },
  { color: "bubblegum", r: "2deg" },
  { color: "sunflower", r: "-1.5deg" },
];

export default async function HowItsBuilt({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const all = dictionaries[lang];
  const t = all.built;

  return (
    <>
      <Nav lang={lang} t={all.nav} page="built" />
      <main>
        <section className="bg-ultra text-paper dark:bg-ultra-deep">
          <div className="mx-auto max-w-page px-5 pb-16 pt-10 sm:px-8 md:pb-20 md:pt-14">
            <h1 className="max-w-[18ch] font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[0.95] tracking-tight">
              {t.title}
            </h1>
            <p className="mt-6 max-w-[38rem] text-lg leading-relaxed text-paper/85 sm:text-xl">{t.intro}</p>
          </div>
        </section>

        <section aria-labelledby="flow-title" className="mx-auto max-w-page px-5 py-16 sm:px-8 md:py-24">
          <h2 id="flow-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t.diagramTitle}
          </h2>
          {/* The steps really are a sequence, so an ordered list: vertical on phones, one row on wide screens. */}
          <ol className="mt-12 flex flex-col xl:grid xl:grid-cols-[1fr_7.5rem_1fr_7.5rem_1fr_7.5rem_1fr_7.5rem_1fr]">
            {t.steps.map((step, i) => (
              // On wide screens each <li> "disappears" so its card and arrow sit in the shared grid (equal card widths).
              <li key={step.name} className="flex flex-col xl:contents">
                <div
                  // Stacked cards stay narrow and straight; the tilt only shows in the one-row layout,
                  // where the cards are small (a wide tilted card looks crooked, not playful).
                  className={`animate-drop max-w-sm rounded-[1.4rem] p-5 text-ink shadow-[0_14px_0_-6px_rgba(27,20,70,0.3)] [--r:0deg] xl:max-w-none xl:[--r:var(--tilt)] ${tileBg[look[i].color]}`}
                  style={{ "--tilt": look[i].r, animationDelay: `${100 + i * 120}ms` } as React.CSSProperties}
                >
                  <span className="font-display text-3xl font-extrabold leading-none">{i + 1}</span>
                  <p className="mt-3 font-display text-xl font-extrabold leading-tight">{step.name}</p>
                  <p className="mt-1 text-sm leading-snug">{step.detail}</p>
                </div>
                {step.arrow && (
                  <div className="flex items-center gap-3 py-2 pl-8 xl:flex-col xl:justify-center xl:gap-1.5 xl:px-2 xl:py-0">
                    {/* Arrow: points down on phones, right on wide screens. */}
                    <span aria-hidden="true" className="flex flex-col items-center text-ink/40 dark:text-paper/40 xl:order-2 xl:w-full xl:flex-row">
                      <span className="h-8 w-[3px] rounded bg-current xl:h-[3px] xl:w-auto xl:flex-1" />
                      <svg viewBox="0 0 10 10" className="-mt-0.5 h-3 w-3 xl:-ml-0.5 xl:mt-0 xl:-rotate-90">
                        <path d="M0 2 L5 9 L10 2Z" fill="currentColor" />
                      </svg>
                    </span>
                    <span className="text-sm font-bold leading-tight xl:order-1 xl:text-center xl:text-xs">{step.arrow}</span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="stack-title" className="bg-lilac text-ink dark:bg-ink dark:text-paper">
          <div className="mx-auto max-w-page px-5 py-16 sm:px-8 md:py-24">
            <h2 id="stack-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t.stackTitle}
            </h2>
            <dl className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
              {t.stack.map((row) => (
                <div key={row.part} className="border-l-4 border-ink pl-5 dark:border-lilac">
                  <dt className="font-display text-xl font-extrabold">{row.part}</dt>
                  <dd className="mt-1 font-bold">{row.tools}</dd>
                  <dd className="mt-1 leading-relaxed">{row.why}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section aria-labelledby="problems-title" className="mx-auto max-w-page px-5 py-16 sm:px-8 md:py-24">
          <h2 id="problems-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t.problemsTitle}
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {t.problems.map((p) => (
              <article key={p.title}>
                <h3 className="font-display text-2xl font-extrabold tracking-tight">{p.title}</h3>
                <p className="mt-2 max-w-[34rem] text-lg leading-relaxed">{p.text}</p>
              </article>
            ))}
          </div>
          <p className="mt-14 max-w-[38rem] text-lg leading-relaxed">
            {t.code}{" "}
            <a href={site.links.repo} className="font-bold underline decoration-2 underline-offset-4">
              {t.codeLink}
            </a>
          </p>
        </section>
      </main>
      <Footer lang={lang} t={all.nav} />
    </>
  );
}
