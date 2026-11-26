import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { pad, tileBg } from "./tiles";

// The one memorable element: the projects, stacked like stickers, dropping in once on load.
const placement = [
  { r: "-8deg", x: "0%", y: "0%" },
  { r: "6deg", x: "34%", y: "8%" },
  { r: "-3deg", x: "10%", y: "38%" },
  { r: "9deg", x: "46%", y: "44%" },
  { r: "-11deg", x: "22%", y: "70%" },
];

export function Hero() {
  return (
    <section id="top" className="overflow-hidden bg-ultra text-paper">
      <div className="mx-auto grid max-w-page items-center gap-12 px-5 pb-20 pt-10 sm:px-8 md:grid-cols-[1.15fr_1fr] md:pb-28 md:pt-16">
        <div>
          <h1 className="font-display text-[clamp(2.75rem,7vw,5.25rem)] font-extrabold leading-[0.95] tracking-tight">
            {site.headline}
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-paper/85 sm:text-xl">{site.intro}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-full bg-sunflower px-7 py-3.5 font-display text-lg font-bold text-ink transition-transform hover:-translate-y-0.5"
            >
              See my projects
            </a>
            <a
              href={site.links.github}
              className="rounded-full border-2 border-paper/60 px-7 py-3.5 font-display text-lg font-bold hover:border-paper"
            >
              GitHub profile
            </a>
          </div>
        </div>

        <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[26rem]">
          {projects.slice(0, placement.length).map((p, i) => (
            <div
              key={p.number}
              className={`absolute flex h-[42%] w-[52%] animate-drop flex-col justify-between rounded-[1.4rem] p-5 text-ink shadow-[0_18px_0_-6px_rgba(27,20,70,0.35)] ${tileBg[p.color]}`}
              style={
                {
                  "--r": placement[i].r,
                  left: placement[i].x,
                  top: placement[i].y,
                  animationDelay: `${120 + i * 110}ms`,
                } as React.CSSProperties
              }
            >
              <span className="font-display text-5xl font-extrabold leading-none">{pad(p.number)}</span>
              <span className="hidden font-display text-lg font-bold leading-tight sm:block">{p.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
