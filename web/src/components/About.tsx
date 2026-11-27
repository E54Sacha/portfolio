import type { Dictionary, Locale } from "@/content/i18n";
import { site } from "@/content/site";

const pill = "rounded-full px-6 py-3 font-display text-lg font-bold";

export function About({ lang, t }: { lang: Locale; t: Dictionary["about"] }) {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-lilac text-ink dark:bg-ink dark:text-paper">
      <div className="mx-auto grid max-w-page gap-8 px-5 py-20 sm:px-8 md:grid-cols-[1fr_1.4fr] md:py-28">
        <h2 id="about-title" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          {t.title}
        </h2>
        <div>
          {t.bio.map((line) => (
            <p key={line} className="mb-4 max-w-[36rem] text-xl leading-relaxed">
              {line}
            </p>
          ))}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {site.cv[lang] ? (
              <a href={site.cv[lang]} download className={`${pill} bg-ultra text-paper transition-transform hover:-translate-y-0.5`}>
                {t.cv}
              </a>
            ) : (
              <span className={`${pill} border-2 border-dashed border-ink/40 dark:border-paper/40`}>{t.cvSoon}</span>
            )}
            <a href={site.links.github} className={`${pill} border-2 border-ink hover:bg-ink hover:text-paper dark:border-paper dark:hover:bg-paper dark:hover:text-ink`}>
              {t.github}
            </a>
            {site.links.linkedin && (
              <a href={site.links.linkedin} className={`${pill} border-2 border-ink hover:bg-ink hover:text-paper dark:border-paper dark:hover:bg-paper dark:hover:text-ink`}>
                {t.linkedin}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
