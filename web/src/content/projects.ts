// One entry per project, in build order. Add a project = add an object here (text in both languages).
import type { Locale } from "./i18n";

export type ProjectStatus = "live" | "building" | "planned";
type Text = Record<Locale, string>;

export type Project = {
  number: number;
  title: Text;
  pitch: Text;
  status: ProjectStatus;
  /** Tailwind colour name used for the tile, from tailwind.config.ts */
  color: "tangerine" | "mint" | "bubblegum" | "sunflower" | "lilac";
  tech: string[];
  /** 1-2 short facts that prove the project is real */
  proof?: Text[];
  links?: { label: Text; href: string }[];
};

export const projects: Project[] = [
  {
    number: 0,
    title: { en: "claude-dev-toolkit", fr: "claude-dev-toolkit" },
    pitch: {
      en: "A Claude Code plugin that scopes my projects, teaches me what I build and ships my releases.",
      fr: "Un plugin Claude Code qui cadre mes projets, m’explique ce que je construis et publie mes versions.",
    },
    status: "live",
    color: "tangerine",
    tech: ["Claude Code", "Node.js", "JavaScript"],
    proof: [
      { en: "v0.3.0 released", fr: "v0.3.0 publiée" },
      { en: "26 automated tests", fr: "26 tests automatisés" },
    ],
    links: [
      { label: { en: "Code on GitHub", fr: "Code sur GitHub" }, href: "https://github.com/E54Sacha/claude-dev-toolkit" },
      { label: { en: "Lessons it wrote", fr: "Les cours qu’il a écrits" }, href: "https://e54sacha.github.io/lessons/" },
    ],
  },
  {
    number: 1,
    title: { en: "This portfolio", fr: "Ce portfolio" },
    pitch: {
      en: "The site you're on: a Next.js front end with a small FastAPI back end for the contact form.",
      fr: "Le site que vous visitez : un front-end Next.js et un petit back-end FastAPI pour le formulaire de contact.",
    },
    status: "live",
    color: "mint",
    tech: ["Next.js", "TypeScript", "FastAPI"],
    proof: [
      { en: "Lighthouse 100 / 100", fr: "Lighthouse 100 / 100" },
      { en: "29 API tests", fr: "29 tests d’API" },
    ],
    links: [
      { label: { en: "Code on GitHub", fr: "Code sur GitHub" }, href: "https://github.com/E54Sacha/portfolio" },
      { label: { en: "How it’s built", fr: "Coulisses du site" }, href: "/how-its-built" },
    ],
  },
  {
    number: 2,
    title: { en: "Habit tracker", fr: "Suivi d’habitudes" },
    pitch: {
      en: "A habit tracker with accounts, streaks and a one-click guest demo, deployed automatically once its tests pass.",
      fr: "Un suivi d’habitudes avec comptes, séries de jours et démo invité en un clic, déployé automatiquement quand les tests passent.",
    },
    status: "live",
    color: "bubblegum",
    tech: ["Next.js", "FastAPI", "PostgreSQL", "Docker", "GitHub Actions"],
    proof: [
      { en: "34 API tests, 100% coverage", fr: "34 tests d’API, 100 % de couverture" },
      { en: "End-to-end test in CI", fr: "Test de bout en bout en CI" },
    ],
    links: [
      { label: { en: "Try the live demo", fr: "Essayer la démo" }, href: "https://habit-tracker-zeta-sooty.vercel.app" },
      { label: { en: "Code on GitHub", fr: "Code sur GitHub" }, href: "https://github.com/E54Sacha/habit-tracker" },
    ],
  },
  {
    number: 3,
    title: { en: "CS revision game", fr: "Jeu de révision" },
    pitch: {
      en: "A revision game for web and phone with spaced repetition, fed by the quizzes my tutor writes.",
      fr: "Un jeu de révision pour le web et le téléphone, avec répétition espacée, alimenté par les quiz de mon tuteur.",
    },
    status: "planned",
    color: "sunflower",
    tech: ["Expo", "React Native", "TypeScript"],
  },
  {
    number: 4,
    title: { en: "CHIP-8 emulator", fr: "Émulateur CHIP-8" },
    pitch: {
      en: "A CPU emulator that runs games from the 1970s in your browser.",
      fr: "Un émulateur de processeur qui fait tourner des jeux des années 1970 dans le navigateur.",
    },
    status: "planned",
    color: "lilac",
    tech: ["TypeScript", "Canvas"],
  },
];
