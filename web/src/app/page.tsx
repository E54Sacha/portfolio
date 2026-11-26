import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { ProjectTile } from "@/components/ProjectTile";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <section id="projects" aria-labelledby="projects-title" className="mx-auto max-w-page px-5 py-20 sm:px-8 md:py-28">
          <h2 id="projects-title" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            What I&rsquo;m building
          </h2>
          <p className="mt-4 max-w-[38rem] text-lg leading-relaxed">
            Projects in the order I build them. Each one is a new area of computer science, and finished ones link to their
            code.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectTile key={p.number} project={p} />
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t-2 border-ink/10">
        <div className="mx-auto flex max-w-page flex-wrap justify-between gap-4 px-5 py-8 text-sm sm:px-8">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <a href={site.links.github} className="underline underline-offset-4">
            GitHub
          </a>
        </div>
      </footer>
    </>
  );
}
