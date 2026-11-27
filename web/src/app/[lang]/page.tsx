import { notFound } from "next/navigation";
import { About } from "@/components/About";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { ProjectTile } from "@/components/ProjectTile";
import { dictionaries, isLocale } from "@/content/i18n";
import { projects } from "@/content/projects";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictionaries[lang];

  return (
    <>
      <Nav lang={lang} t={t.nav} />
      <main>
        <Hero lang={lang} t={t.hero} />
        <section id="projects" aria-labelledby="projects-title" className="mx-auto max-w-page px-5 py-20 sm:px-8 md:py-28">
          <h2 id="projects-title" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t.projects.title}
          </h2>
          <p className="mt-4 max-w-[38rem] text-lg leading-relaxed">{t.projects.intro}</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectTile key={p.number} project={p} lang={lang} t={t.projects} />
            ))}
          </div>
        </section>

        <About lang={lang} t={t.about} />

        <section id="contact" aria-labelledby="contact-title" className="on-sunflower bg-sunflower text-ink">
          <div className="mx-auto grid max-w-page gap-10 px-5 py-20 sm:px-8 md:grid-cols-[1fr_1.4fr] md:py-28">
            <div>
              <h2 id="contact-title" className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                {t.contact.title}
              </h2>
              <p className="mt-4 max-w-[28rem] text-lg leading-relaxed">{t.contact.intro}</p>
            </div>
            <ContactForm t={t.contact} />
          </div>
        </section>
      </main>
      <Footer lang={lang} t={t.nav} />
    </>
  );
}
