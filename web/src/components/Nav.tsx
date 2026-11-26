import { site } from "@/content/site";

export function Nav() {
  return (
    <header className="bg-ultra text-paper">
      <nav aria-label="Main" className="mx-auto flex max-w-page items-center justify-between px-5 py-5 sm:px-8">
        <a href="#top" className="font-display text-xl font-extrabold tracking-tight">
          {site.name}
        </a>
        <ul className="flex items-center gap-5 text-base sm:gap-8">
          <li>
            <a href="#projects" className="underline-offset-4 hover:underline">
              Projects
            </a>
          </li>
          <li>
            <a href={site.links.github} className="underline-offset-4 hover:underline">
              GitHub
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
