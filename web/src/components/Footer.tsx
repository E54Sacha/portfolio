import type { Dictionary, Locale } from "@/content/i18n";
import { site } from "@/content/site";

export function Footer({ lang, t }: { lang: Locale; t: Dictionary["nav"] }) {
  const home = `/${lang}`;
  return (
    <footer className="border-t-2 border-ink/10 dark:border-paper/10">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm sm:px-8">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          <li>
            <a href={`${home}/how-its-built`} className="underline underline-offset-4">
              {t.built}
            </a>
          </li>
          <li>
            <a href={site.links.github} className="underline underline-offset-4">
              {t.github}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
