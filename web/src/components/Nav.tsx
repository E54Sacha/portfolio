import type { Dictionary, Locale } from "@/content/i18n";
import { site } from "@/content/site";

export function Nav({ lang, t }: { lang: Locale; t: Dictionary["nav"] }) {
  const other: Locale = lang === "en" ? "fr" : "en";
  return (
    <header className="bg-ultra text-paper">
      <nav aria-label={t.label} className="mx-auto flex max-w-page items-center justify-between px-5 py-5 sm:px-8">
        <a href="#top" className="font-display text-xl font-extrabold tracking-tight">
          {site.name}
        </a>
        <ul className="flex items-center gap-4 text-base sm:gap-8">
          <li className="hidden sm:block">
            <a href="#projects" className="underline-offset-4 hover:underline">
              {t.projects}
            </a>
          </li>
          <li>
            <a href="#contact" className="underline-offset-4 hover:underline">
              {t.contact}
            </a>
          </li>
          <li className="hidden sm:block">
            <a href={site.links.github} className="underline-offset-4 hover:underline">
              {t.github}
            </a>
          </li>
          <li>
            <a
              href={`/${other}`}
              hrefLang={other}
              lang={other}
              aria-label={t.switchLabel}
              className="rounded-full border-2 border-paper/60 px-3 py-1 font-bold hover:border-paper"
            >
              {t.switchTo}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
