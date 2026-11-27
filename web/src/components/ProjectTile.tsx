import type { Dictionary, Locale } from "@/content/i18n";
import type { Project } from "@/content/projects";
import { pad, tileBg, tileBorder } from "./tiles";

export function ProjectTile({ project, lang, t }: { project: Project; lang: Locale; t: Dictionary["projects"] }) {
  const done = project.status !== "planned";
  return (
    <article
      className={`flex flex-col rounded-[1.75rem] p-7 ${
        done
          ? // Finished tiles are the hero's stickers: they tilt a little when you point at them.
            `${tileBg[project.color]} text-ink transition-transform duration-300 hover:-translate-y-1 hover:-rotate-1`
          : `border-[3px] border-dashed bg-paper dark:bg-night ${tileBorder[project.color]}`
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-display text-6xl font-extrabold leading-none" aria-label={`${t.projectLabel} ${project.number}`}>
          {pad(project.number)}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-sm font-bold ${
            done ? "bg-ink text-paper" : "bg-ink/5 text-ink dark:bg-paper/10 dark:text-paper"
          }`}
        >
          {t.status[project.status]}
        </span>
      </div>

      <h3 className="mt-6 font-display text-2xl font-extrabold tracking-tight">{project.title[lang]}</h3>
      <p className="mt-2 leading-relaxed">{project.pitch[lang]}</p>

      {project.proof && (
        <ul className="mt-4 space-y-1 font-bold">
          {project.proof.map((fact) => (
            <li key={fact.en}>{fact[lang]}</li>
          ))}
        </ul>
      )}

      <ul className="mt-5 flex flex-wrap gap-2" aria-label={t.techLabel}>
        {project.tech.map((name) => (
          <li key={name} className={`rounded-full px-3 py-1 text-sm ${done ? "bg-paper/70" : "bg-ink/5 dark:bg-paper/10"}`}>
            {name}
          </li>
        ))}
      </ul>

      {project.links && (
        <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-6">
          {project.links.map((l) => (
            <a
              key={l.href}
              // Links inside this site ("/how-its-built") stay in the current language.
              href={l.href.startsWith("/") ? `/${lang}${l.href}` : l.href}
              className="font-bold underline decoration-2 underline-offset-4 hover:decoration-4"
            >
              {l.label[lang]}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
