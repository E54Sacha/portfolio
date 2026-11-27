import type { Dictionary, Locale } from "@/content/i18n";
import { site } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";

type Page = "home" | "built";

export function Nav({ lang, t, page = "home" }: { lang: Locale; t: Dictionary["nav"]; page?: Page }) {
  const other: Locale = lang === "en" ? "fr" : "en";
  const home = `/${lang}`;
  const links = [
    { href: `${home}#projects`, label: t.projects },
    { href: `${home}#about`, label: t.about },
    { href: `${home}/how-its-built`, label: t.built, current: page === "built" },
    { href: `${home}#contact`, label: t.contact },
  ];

  return (
    <header className="bg-ultra text-paper dark:bg-ultra-deep">
      <nav aria-label={t.label} className="mx-auto flex max-w-page flex-wrap items-center gap-x-8 gap-y-3 px-5 py-5 sm:px-8">
        <a href={home} className="mr-auto font-display text-xl font-extrabold tracking-tight">
          {site.name}
        </a>
        {/* On phones the links take their own row, below the name and the buttons. */}
        <ul className="order-last flex w-full gap-5 overflow-x-auto whitespace-nowrap text-base md:order-none md:w-auto md:gap-7">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={l.current ? "page" : undefined}
                className="underline-offset-4 hover:underline aria-[current=page]:underline aria-[current=page]:decoration-2"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <ThemeToggle label={t.theme} />
          <a
            href={page === "built" ? `/${other}/how-its-built` : `/${other}`}
            hrefLang={other}
            lang={other}
            aria-label={t.switchLabel}
            className="rounded-full border-2 border-paper/60 px-3 py-1 font-bold hover:border-paper"
          >
            {t.switchTo}
          </a>
        </div>
      </nav>
    </header>
  );
}
