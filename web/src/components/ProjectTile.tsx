import type { Dictionary, Locale } from "@/content/i18n";
import type { Project } from "@/content/projects";
import { pad, tileBg, tileBorder } from "./tiles";

export function ProjectTile({ project, lang, t }: { project: Project; lang: Locale; t: Dictionary["projects"] }) {
  const done = project.status !== "planned";
  return (
    <article
      className={`flex flex-col rounded-[1.75rem] p-7 ${
        done ? `${tileBg[project.color]} text-ink` : `border-[3px] border-dashed bg-paper ${tileBorder[project.color]}`
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-display text-6xl font-extrabold leading-none" aria-label={`${t.projectLabel} ${project.number}`}>
          {pad(project.number)}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-sm font-bold ${done ? "bg-ink text-paper" : "bg-ink/5 text-ink"}`}
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
          <li key={name} className={`rounded-full px-3 py-1 text-sm ${done ? "bg-paper/70" : "bg-ink/5"}`}>
            {name}
          </li>
        ))}
      </ul>

      {project.links && (
        <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-6">
          {project.links.map((l) => (
            <a key={l.href} href={l.href} className="font-bold underline decoration-2 underline-offset-4 hover:decoration-4">
              {l.label[lang]}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
